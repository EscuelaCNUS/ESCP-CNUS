export const SLUG_REGEX = /^[a-zA-Z0-9_-]+$/;

/**
 * Escapa HTML. Úsalo SOLO al construir HTML a mano (ej. cuerpos de email).
 * No lo apliques a datos que React vaya a renderizar: React ya escapa por su
 * cuenta y el resultado sería un doble escapado visible ("O&#39;Neill").
 */
export function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const ENTITY_MAP = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
};

/**
 * Revierte el escapado de {@link escapeHtml}. Existe para los registros
 * antiguos que se guardaron ya escapados; el texto nuevo se guarda en crudo.
 */
export function decodeHtmlEntities(value = "") {
  return String(value).replace(/&(?:amp|lt|gt|quot|#39);/g, (m) => ENTITY_MAP[m] ?? m);
}

/**
 * Normaliza texto de usuario para almacenarlo: recorta y acota la longitud.
 * NO escapa: el escapado corresponde a la capa de presentación.
 */
export function sanitizeText(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function isValidSlug(value) {
  return typeof value === "string" && value.length > 0 && SLUG_REGEX.test(value);
}

export function getClientIp(request) {
  const headers = request.headers;
  return (
    headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
    || headers.get("cf-connecting-ip")?.trim()
    || headers.get("x-real-ip")?.trim()
    || headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "unknown"
  );
}

export function hashIp(ip) {
  let hash = 5381;
  for (let i = 0; i < ip.length; i += 1) {
    hash = ((hash << 5) + hash + ip.charCodeAt(i)) >>> 0;
  }
  return `ip:${hash.toString(16)}`;
}
