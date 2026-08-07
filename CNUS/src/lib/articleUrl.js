/**
 * Construye la URL pública de un artículo.
 * Formato preferido: /articulando/[categoria-slug]/[articulo-slug]
 * Fallback (sin categoría): /articulando/[articulo-slug]
 *
 * @param {object} article - Objeto artículo de Strapi
 * @returns {string} URL relativa del artículo
 */
export function getArticuloUrl(article) {
  if (!article?.slug) return '/articulando';
  const cat = article?.categoria?.slug;
  if (cat) return `/articulando/${cat}/${article.slug}`;
  return `/articulando/${article.slug}`;
}
