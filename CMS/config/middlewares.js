// Orígenes autorizados a consumir la API. En desarrollo se añade el frontend
// local; en producción se toma de FRONTEND_URL (admite lista separada por comas).
const frontendOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const devOrigins =
  process.env.NODE_ENV === 'production'
    ? []
    : ['http://localhost:3000', 'http://127.0.0.1:3000'];

const origin = [...frontendOrigins, ...devOrigins];

module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      // Si FRONTEND_URL no está configurada en producción, se mantiene el
      // comportamiento permisivo por defecto para no tumbar el sitio; conviene
      // definirla siempre.
      ...(origin.length > 0 && { origin }),
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  // Impide que /api/...?status=draft sirva borradores al público.
  'global::force-published',
];
