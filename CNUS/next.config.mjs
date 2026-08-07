import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */

function strapiOrigin(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.hostname}${u.port ? `:${u.port}` : ''}`;
  } catch {
    return null;
  }
}

const isDev = process.env.NODE_ENV !== 'production';
const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const strapiOriginStr = strapiOrigin(strapiUrl);
const strapiCsp = strapiOriginStr || 'http://localhost:1337';

const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://static.cloudflareinsights.com https://www.youtube.com`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: ${strapiCsp} https://res.cloudinary.com https://images.unsplash.com https://img.youtube.com`,
  `font-src 'self' data:`,
  `frame-src https://www.google.com https://www.youtube.com`,
  `connect-src 'self' ${strapiCsp} https://res.cloudinary.com https://*.supabase.co https://o*.ingest.sentry.io`,
  `media-src 'self' ${strapiCsp} https:`,
  `form-action 'self'`,
  `base-uri 'self'`,
  `object-src 'none'`,
  `frame-ancestors 'none'`,
  ...(isDev ? [] : ['upgrade-insecure-requests']),
];

const nextConfig = {
  // Google indexó por separado escuela-cnus.vercel.app y escuelacnus.com, y
  // salían como dos sitios distintos. La etiqueta canonical ya apunta al
  // dominio propio, pero consolidar por esa vía tarda semanas; una redirección
  // permanente se lo dice sin ambigüedad.
  //
  // Solo se redirige el alias de producción. Las URL de cada despliegue
  // (escuela-cnus-xxxxx.vercel.app) quedan fuera, para no romper las previews.
  async redirects() {
    return [
      {
        source: '/:ruta*',
        has: [{ type: 'host', value: 'escuela-cnus.vercel.app' }],
        destination: 'https://www.escuelacnus.com/:ruta*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp.join('; ') },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
        ],
      },
    ];
  },
  images: {
    dangerouslyAllowSVG: false,
    dangerouslyAllowLocalIP: false,
    remotePatterns: [
      ...(isDev
        ? [
            {
              protocol: 'http',
              hostname: 'localhost',
              port: '1337',
              pathname: '/uploads/**',
            },
            {
              protocol: 'http',
              hostname: '127.0.0.1',
              port: '1337',
              pathname: '/uploads/**',
            },
          ]
        : []),
      ...(strapiOriginStr
        ? [
            {
              protocol: strapiOriginStr.startsWith('https') ? 'https' : 'http',
              hostname: new URL(strapiOriginStr).hostname,
              ...(new URL(strapiOriginStr).port && {
                port: new URL(strapiOriginStr).port,
              }),
              pathname: '/uploads/**',
            },
          ]
        : []),
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  tunnelRoute: "/monitoring",
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
