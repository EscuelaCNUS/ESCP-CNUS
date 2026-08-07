import { cache } from "react";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || '';

const FETCH_TIMEOUT = 15_000;

// Red de seguridad por si un webhook de revalidación se pierde: aun sin
// invalidación explícita, el contenido se refresca pasado este tiempo.
// Con el webhook funcionando esto casi nunca entra en juego; se mantiene bajo
// para que una publicación no tarde en verse aunque el webhook falle.
const FALLBACK_REVALIDATE = 60;

async function strapiFetch(path, options = {}, tags = [], withMeta = false) {
  const url = `${STRAPI_URL}/api/${path}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
      },
      // Cacheado y etiquetado: /api/revalidate purga por tag cuando Strapi
      // publica. Sin esto cada visita golpearía a Strapi.
      next: { tags, revalidate: FALLBACK_REVALIDATE },
      ...options,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`[strapi] ${res.status} ${res.statusText} for ${path}`);
      }
      return withMeta ? { data: null, meta: null } : null;
    }
    const json = await res.json();
    return withMeta
      ? { data: json?.data ?? null, meta: json?.meta ?? null }
      : (json?.data ?? null);
  } catch (err) {
    clearTimeout(timeoutId);
    if (process.env.NODE_ENV === 'development') {
      console.error(`[strapi] Fetch error for ${path}:`, err.message);
    }
    return withMeta ? { data: null, meta: null } : null;
  }
}

async function fetchStrapi(path, options = {}, tags = []) {
  return strapiFetch(path, options, tags, false);
}

async function fetchStrapiWithMeta(path, options = {}, tags = []) {
  return strapiFetch(path, options, tags, true);
}

// ─── Hero Config (Single Type) ───────────────────────────────────────────────
export async function getHeroConfig() {
  return fetchStrapi('hero-config?populate=*', {}, ['hero-config']);
}

// ─── Audiencia (Single Type) ─────────────────────────────────────────────────
export async function getAudiencia() {
  return fetchStrapi('audiencia?populate[slides][populate][imagen][populate]=*', {}, ['audiencia']);
}

// ─── Ejes Formativos ─────────────────────────────────────────────────────────
export async function getEjesFormativos() {
  return fetchStrapi('eje-formativos?sort=orden:asc&populate=*', {}, ['ejes']);
}

// ─── Programas / Cursos ───────────────────────────────────────────────────────
export async function getProgramas(options = {}) {
  const populate = [
    // Sin esto Strapi devuelve solo 25 y el resto desaparece del listado.
    // El filtrado y la paginación de /programas ocurren en el cliente.
    'pagination[pageSize]=200',
    'populate[imagen][populate]=*',
    'populate[eje][populate]=*',
    'populate[instructor][populate]=*',
  ];
  if (Array.isArray(options.filtros)) {
    for (const f of options.filtros) {
      if (f && f.key && f.value) {
        populate.push(`${encodeURIComponent(f.key)}=${encodeURIComponent(f.value)}`);
      }
    }
  }
  return fetchStrapi(`programas?${populate.join('&')}`, {}, ['programas']);
}

export async function getProgramasDestacados() {
  return fetchStrapi(
    'programas?filters[destacado][$eq]=true&sort=createdAt:desc&populate[imagen][populate]=*',
    {},
    ['programas']
  );
}

export const getProgramaPorSlug = cache(async (slug) => {
  return fetchStrapi(
    `programas?filters[slug][$eq]=${encodeURIComponent(slug)}` +
    `&populate[imagen][populate]=*` +
    `&populate[eje][populate]=*` +
    `&populate[instructor][populate][avatar][populate]=*` +
    `&populate[modulos][populate]=*` +
    `&populate[habilidades][populate]=*`,
    {},
    ['programas']
  );
});

export async function getAllProgramaSlugs() {
  const data = await fetchStrapi('programas?fields[0]=slug&pagination[pageSize]=1000', {}, ['programas']);
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({ slug: item.slug }));
}

// ─── Artículos ────────────────────────────────────────────────────────────────
export async function getArticulos(limit = 4) {
  return fetchStrapi(
    `articulos?status=published&sort=fecha_publicacion:desc&pagination[limit]=${limit}` +
    `&populate[imagen_portada][populate]=*` +
    `&populate[autor][populate][avatar][populate]=*` +
    `&populate[categoria][populate]=*`,
    {},
    ['articulos']
  );
}

/**
 * Devuelve el artículo más reciente de una categoría.
 * Retorna null si no hay artículos publicados.
 */
async function getArticuloMasRecientePorCategoria(categoriaSlug) {
  const data = await fetchStrapi(
    `articulos?status=published&filters[categoria][slug][$eq]=${encodeURIComponent(categoriaSlug)}` +
    `&sort=fecha_publicacion:desc&pagination[limit]=1` +
    `&populate[imagen_portada][populate]=*` +
    `&populate[autor][populate][avatar][populate]=*` +
    `&populate[categoria][populate]=*`,
    {},
    ['articulos']
  );
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

/**
 * Artículos más recientes de cada categoría de la sección "Dialogando" de la home:
 * [notas del presidente, columna del director, pensamiento complejo, noticias y eventos].
 * Puede contener nulls si alguna categoría no tiene artículos publicados.
 */
export async function getArticulosDialogando() {
  const [notas, columna, pensamiento, noticiasEventos] = await Promise.all([
    getArticuloMasRecientePorCategoria('notas-del-presidente'),
    getArticuloMasRecientePorCategoria('columna-del-director'),
    getArticuloMasRecientePorCategoria('pensamiento-complejo'),
    getArticuloMasRecientePorCategoria('noticias-y-eventos'),
  ]);
  return [notas, columna, pensamiento, noticiasEventos];
}

export const getArticuloPorSlug = cache(async (slug) => {
  return fetchStrapi(
    `articulos?status=published&filters[slug][$eq]=${encodeURIComponent(slug)}` +
    `&populate[imagen_portada][populate]=*` +
    `&populate[autor][populate]=*` +
    `&populate[categoria][populate]=*` +
    `&populate[tags][populate]=*`,
    {},
    ['articulos']
  );
});

export async function getArticuloDestacado() {
  return fetchStrapi(
    'articulos?status=published&filters[destacado][$eq]=true&sort=updatedAt:desc&pagination[limit]=1' +
    `&populate[imagen_portada][populate]=*` +
    `&populate[categoria][populate]=*`,
    {},
    ['articulos']
  );
}

/**
 * Obtiene artículos de una categoría con paginación server-side.
 * @param {string} categoriaSlug
 * @param {number} page - Página actual (1-indexed)
 * @param {number} pageSize - Artículos por página
 * @returns {{ data: Article[], total: number, pageCount: number }}
 */
export async function getArticulosPorCategoriaPaginado(categoriaSlug, page = 1, pageSize = 6) {
  const { data, meta } = await fetchStrapiWithMeta(
    `articulos?status=published&filters[categoria][slug][$eq]=${encodeURIComponent(categoriaSlug)}` +
    `&sort=fecha_publicacion:desc` +
    `&pagination[page]=${page}&pagination[pageSize]=${pageSize}` +
    `&populate[imagen_portada][populate]=*` +
    `&populate[autor][populate][avatar][populate]=*` +
    `&populate[categoria][populate]=*`,
    {},
    ['articulos']
  );
  return {
    data: Array.isArray(data) ? data : [],
    total: meta?.pagination?.total ?? 0,
    pageCount: meta?.pagination?.pageCount ?? 1,
  };
}

/** Versión simple (sin meta) — usada en el Home para previews */
export async function getArticulosPorCategoria(categoriaSlug, limit = 4) {
  return fetchStrapi(
    `articulos?status=published&filters[categoria][slug][$eq]=${encodeURIComponent(categoriaSlug)}&sort=fecha_publicacion:desc&pagination[limit]=${limit}` +
    `&populate[imagen_portada][populate]=*` +
    `&populate[autor][populate][avatar][populate]=*` +
    `&populate[categoria][populate]=*`,
    {},
    ['articulos']
  );
}

export async function getAllArticuloSlugs() {
  const data = await fetchStrapi(
    'articulos?status=published&fields[0]=slug&populate[categoria][fields][0]=slug&pagination[pageSize]=1000',
    {},
    ['articulos']
  );
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    slug: item.slug,
    categoria: item.categoria?.slug ?? null,
  }));
}

// ─── Categorías ───────────────────────────────────────────────────────────────
export async function getCategorias() {
  return fetchStrapi('categorias?sort=orden:asc', {}, ['categorias']);
}

// ─── Debate ───────────────────────────────────────────────────────────────────
/**
 * El debate destacado es simplemente el más reciente. Antes se elegía con un
 * campo `activo` que había que marcar a mano; se retiró para que publicar un
 * debate nuevo baste para destacarlo.
 */
export async function getDebateActivo() {
  return fetchStrapi(
    'debates?sort=createdAt:desc&pagination[limit]=1' +
    `&populate[archivo_media][populate]=*` +
    `&populate[imagen_portada][populate]=*`,
    {},
    ['debates']
  );
}

export async function getDebates() {
  return fetchStrapi(
    'debates?sort=createdAt:desc&pagination[pageSize]=100' +
    `&populate[archivo_media][populate]=*` +
    `&populate[imagen_portada][populate]=*`,
    {},
    ['debates']
  );
}

export const getDebatePorSlug = cache(async (slug) => {
  return fetchStrapi(
    `debates?filters[slug][$eq]=${encodeURIComponent(slug)}`,
    {},
    ['debates']
  );
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Construye la URL completa de una imagen de Strapi.
 * Maneja imágenes locales (/uploads/...) y externas (https://...).
 */
export function getStrapiImageUrl(imageData) {
  if (!imageData) return null;
  const target = Array.isArray(imageData) ? imageData[0] : (imageData.data || imageData);
  if (!target) return null;
  const url = target.url || target.attributes?.url || target.data?.url || target.data?.attributes?.url;
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
}

/**
 * Formatea una fecha ISO a formato legible en español dominicano.
 * Ej: "2026-07-12T00:00:00.000Z" → "12 de julio de 2026"
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('es-DO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Construye el nombre completo del autor.
 */
export function getAutorNombre(autor) {
  if (!autor) return '';
  return [autor.nombre, autor.apellido].filter(Boolean).join(' ');
}
