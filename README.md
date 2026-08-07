# Escuela CNUS — Proyecto Web

Plataforma web de la **Escuela CNUS de Sindicalismo Sociopolítico (ESCP)**.

## Estructura del proyecto

```
ESCP/
├── cnus/     → Frontend Next.js 15 (App Router)
└── CMS/      → Backend Strapi v5 (CMS)
```

## Tecnologías

| Proyecto | Stack |
|---|---|
| Frontend | Next.js 15, Tailwind CSS, React 19 |
| CMS | Strapi v5, SQLite (dev) / PostgreSQL (prod) |
| Comentarios | Supabase (pendiente) |
| Imágenes | Cloudinary (pendiente) |

## Desarrollo local

### 1. CMS (Strapi)
```bash
cd CMS
npm install
npm run develop
# Admin: http://localhost:1337/admin
```

### 2. Frontend (Next.js)
```bash
cd cnus
npm install
npm run dev
# App: http://localhost:3000
```

### Variables de entorno

**`cnus/.env.local`** (crear manualmente):
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=<generar en Strapi Admin → Settings → API Tokens>
NEXT_PUBLIC_SUPABASE_URL=<tu URL de Supabase>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu key de Supabase>
```

> ⚠️ Los archivos `.env` y `.env.local` **no se suben al repositorio**.
