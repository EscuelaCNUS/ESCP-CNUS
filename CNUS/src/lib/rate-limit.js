import { hashIp } from "@/lib/sanitize";

const WINDOW_MS = 60_000;
const DEFAULT_MAX_REQUESTS = 10;
const CLEANUP_INTERVAL = 300_000;

// Cupo por ámbito y minuto. Cada ruta tiene su propio presupuesto: dar "me
// gusta" no debe agotar el del formulario de contacto, y el webhook de
// revalidación (ya protegido por secreto) no debe competir con el público.
const SCOPE_LIMITS = {
  contacto: 5,
  newsletter: 5,
  comentarios: 10,
  likes: 30,
  revalidate: 120,
};

function limitFor(scope) {
  return SCOPE_LIMITS[scope] ?? DEFAULT_MAX_REQUESTS;
}

// ─── Backend distribuido (Upstash Redis REST, sin SDK) ───────────────────────
// Si UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN están configurados, el
// límite es compartido entre instancias serverless. De lo contrario se usa un
// mapa en memoria (por instancia).
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || '';
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || '';
const useRedis = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

function denied(retryAfter) {
  return { allowed: false, retryAfter };
}

async function checkRateLimitRedis(ip, scope) {
  if (typeof ip !== 'string' || !ip || ip === 'unknown') return { allowed: false };

  const now = Date.now();
  const windowStart = Math.floor(now / WINDOW_MS);
  const key = `rl:${scope}:${hashIp(ip)}:${windowStart}`;
  const ttl = Math.ceil(WINDOW_MS / 1000);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    const res = await fetch(`${UPSTASH_URL}/pipeline`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        authorization: `Bearer ${UPSTASH_TOKEN}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', key],
        ['EXPIRE', key, ttl],
        ['TTL', key],
      ]),
    });
    clearTimeout(timeoutId);

    if (!res.ok) return checkRateLimitMemory(ip, scope);

    const data = await res.json();
    const count = Array.isArray(data) ? Number(data[0]) : null;
    const remainingTtl = Array.isArray(data) ? Number(data[2]) : null;

    if (count == null) return checkRateLimitMemory(ip, scope);

    if (count > limitFor(scope)) {
      return denied(Number.isFinite(remainingTtl) && remainingTtl > 0 ? remainingTtl : ttl);
    }
    return { allowed: true };
  } catch {
    clearTimeout(timeoutId);
    return checkRateLimitMemory(ip, scope);
  }
}

// ─── Backend en memoria (fallback / desarrollo) ───────────────────────────────
const rateMap = new Map();
let lastCleanup = Date.now();

function checkRateLimitMemory(ip, scope) {
  const now = Date.now();

  // Periodic cleanup of expired entries to prevent memory leak
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    for (const [k, entry] of rateMap) {
      if (now > entry.resetAt) {
        rateMap.delete(k);
      }
    }
    lastCleanup = now;
  }

  if (typeof ip !== 'string' || !ip || ip === 'unknown') {
    return { allowed: false };
  }

  const key = `${scope}:${hashIp(ip)}`;
  const entry = rateMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  entry.count += 1;

  if (entry.count > limitFor(scope)) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return denied(retryAfter);
  }

  return { allowed: true };
}

/**
 * @param {string} ip
 * @param {string} scope - Identificador de la ruta; cada uno tiene su cupo
 *   independiente (ver SCOPE_LIMITS).
 */
export async function checkRateLimit(ip, scope = 'default') {
  if (useRedis) return checkRateLimitRedis(ip, scope);
  return checkRateLimitMemory(ip, scope);
}
