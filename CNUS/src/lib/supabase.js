const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const FETCH_TIMEOUT = 10_000;

function serverHeaders(extra = {}) {
  const key = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
  return {
    'Content-Type': 'application/json',
    apikey: key,
    Authorization: `Bearer ${key}`,
    ...extra,
  };
}

function validateSlug(value) {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(value)) {
    throw new Error('Invalid slug format');
  }
  return value;
}

async function supabaseFetch(path, options = {}) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[supabase] Missing SUPABASE_URL or SUPABASE_ANON_KEY');
    }
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  const url = `${SUPABASE_URL}/rest/v1/${path}`;
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      ...options,
      headers: serverHeaders(options.headers),
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`[supabase] ${res.status} ${res.statusText} for ${path}`);
      }
      return null;
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch (err) {
    clearTimeout(timeoutId);
    if (process.env.NODE_ENV === 'development') {
      console.error(`[supabase] Fetch error for ${path}:`, err.message);
    }
    return null;
  }
}

// ─── Comentarios ──────────────────────────────────────────────────────────────

/**
 * Obtiene todos los comentarios raíz de un artículo con sus respuestas,
 * ordenados del más reciente al más antiguo.
 */
export async function getComentarios(articuloSlug) {
  const safeSlug = validateSlug(articuloSlug);
  const all = await supabaseFetch(
    `comentarios?articulo_slug=eq.${safeSlug}&order=created_at.asc`,
    { next: { revalidate: 30 } }
  );
  if (!Array.isArray(all)) return [];

  const roots = all.filter(c => !c.comentario_padre_id);
  const replyMap = {};
  all.forEach(c => {
    if (c.comentario_padre_id) {
      if (!replyMap[c.comentario_padre_id]) replyMap[c.comentario_padre_id] = [];
      replyMap[c.comentario_padre_id].push(c);
    }
  });
  roots.forEach(r => { r.replies = replyMap[r.id] || []; });
  roots.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return roots;
}

/**
 * Cuenta participantes y respuestas de varios slugs de una sola consulta.
 *
 * Participantes son personas distintas —se agrupa por nombre en minúsculas—,
 * no comentarios: quien escriba tres veces cuenta como uno.
 *
 * Lo usa la rejilla de debates anteriores, que antes mostraba un número
 * escrito a mano en Strapi y por tanto nunca se actualizaba solo.
 *
 * @returns {Promise<Record<string, {participantes: number, respuestas: number}>>}
 */
export async function getConteoComentarios(slugs = []) {
  const validos = [...new Set(slugs)].filter(
    (s) => typeof s === 'string' && /^[a-zA-Z0-9_-]+$/.test(s)
  );
  if (validos.length === 0) return {};

  const filas = await supabaseFetch(
    `comentarios?select=articulo_slug,nombre&articulo_slug=in.(${validos.join(',')})`,
    { next: { revalidate: 30 } }
  );
  if (!Array.isArray(filas)) return {};

  const porSlug = {};
  for (const slug of validos) porSlug[slug] = { personas: new Set(), respuestas: 0 };

  for (const fila of filas) {
    const entrada = porSlug[fila.articulo_slug];
    if (!entrada) continue;
    entrada.respuestas += 1;
    const nombre = `${fila.nombre || ''}`.trim().toLowerCase();
    if (nombre) entrada.personas.add(nombre);
  }

  return Object.fromEntries(
    Object.entries(porSlug).map(([slug, v]) => [
      slug,
      { participantes: v.personas.size, respuestas: v.respuestas },
    ])
  );
}

// ─── Contacto ─────────────────────────────────────────────────────────────────

/**
 * Guarda un mensaje de contacto.
 * Devuelve true/false según el estado HTTP (no requiere SELECT del registro).
 */
export async function postContacto(data) {
  return supabaseInsert('contactos', data);
}

/**
 * POST de insert sin devolver el registro (return=minimal).
 * Devuelve true si Supabase responde 2xx, false en cualquier otro caso.
 */
async function supabaseInsert(table, data) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return false;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      signal: controller.signal,
      headers: serverHeaders({ Prefer: 'return=minimal' }),
      body: JSON.stringify(data),
    });
    clearTimeout(timeoutId);
    return res.ok;
  } catch (err) {
    clearTimeout(timeoutId);
    if (process.env.NODE_ENV === 'development') {
      console.error(`[supabase] insert error for ${table}:`, err.message);
    }
    return false;
  }
}

// ─── Newsletter ───────────────────────────────────────────────────────────────
/**
 * Guarda un suscriptor del newsletter en Supabase como respaldo.
 * Devuelve true/false según el estado HTTP (no requiere SELECT del registro).
 */
export async function postSuscriptor(email) {
  return supabaseInsert('suscriptores', { email });
}

// ─── Inserts server-side (API routes) ─────────────────────────────────────────

/**
 * Inserta un comentario y devuelve la fila creada (o null).
 * Solo debe usarse desde API routes (validación/rate-limit aplicados antes).
 */
export async function insertComentario(data) {
  return supabaseInsertRow('comentarios', data);
}

async function supabaseInsertRow(table, data) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      signal: controller.signal,
      headers: serverHeaders({ Prefer: 'return=representation' }),
      body: JSON.stringify(data),
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`[supabase] insert error for ${table}: ${res.status} ${res.statusText}`);
      }
      return null;
    }
    const text = await res.text();
    const rows = text ? JSON.parse(text) : null;
    return Array.isArray(rows) ? rows[0] : null;
  } catch (err) {
    clearTimeout(timeoutId);
    if (process.env.NODE_ENV === 'development') {
      console.error(`[supabase] insert error for ${table}:`, err.message);
    }
    return null;
  }
}

/**
 * Ajusta los likes de un comentario con un delta (+1/-1), acotado a >= 0.
 * Solo debe usarse desde API routes.
 *
 * Delega en la función de Postgres `adjust_comment_likes`, que hace la lectura
 * y la escritura en una sola sentencia: dos likes simultáneos no se pisan.
 * Ver scripts/supabase/001-adjust-likes.sql.
 *
 * @param {number} commentId
 * @param {number} delta - +1 para like, -1 para quitar like.
 */
export async function adjustLikes(commentId, delta) {
  if (!Number.isInteger(commentId) || !Number.isInteger(delta)) return null;

  const rows = await supabaseFetch('rpc/adjust_comment_likes', {
    method: 'POST',
    body: JSON.stringify({ comment_id: commentId, delta }),
  });

  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}
