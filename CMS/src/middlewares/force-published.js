'use strict';

/**
 * Fuerza `status=published` en la API REST pública.
 *
 * Strapi v5 sirve las versiones borrador a cualquiera que tenga el permiso
 * `find`, que el rol público necesita para que el sitio funcione. Sin esto,
 * `GET /api/articulos?status=draft` devuelve los textos aún sin publicar a
 * quien sepa pedirlos.
 *
 * El panel de administración no pasa por aquí: usa /content-manager, no /api.
 * El frontend solo consume contenido publicado, así que no pierde nada.
 */
module.exports = () => {
  return async (ctx, next) => {
    if (ctx.request.path.startsWith('/api/')) {
      const q = ctx.request.query;
      if (q && (q.status !== undefined || q.publicationState !== undefined)) {
        q.status = 'published';
        delete q.publicationState;
        ctx.request.query = q;
      }
    }
    await next();
  };
};
