# Proyecto ESCP — Escuela CNUS de Sindicalismo Sociopolítico

Sitio web de la Escuela CNUS (República Dominicana). Este archivo se carga solo
al abrir sesión: recoge lo que no se deduce mirando el código.

## Arquitectura

```
CNUS/   Frontend Next.js 16 (App Router)  → Vercel
CMS/    Strapi v5                          → Railway
```

| Servicio | Para qué |
|---|---|
| Vercel | Aloja el frontend. `www.escuelacnus.com` |
| Railway | Aloja Strapi. `escp-cnus-production.up.railway.app` |
| Supabase | Comentarios, mensajes de contacto, suscriptores |
| Resend | Envío de correo y lista del boletín |
| Cloudinary | Imágenes subidas desde Strapi |

**Los comentarios NO están en Strapi**, están en Supabase. Los debates guardan sus
respuestas en la tabla `comentarios`, usando el slug del debate en `articulo_slug`.

## Cómo se despliega

- **Vercel**: `cd CNUS && npx vercel --prod --yes`. Ojo: a veces reutiliza caché de
  build y sube sin los cambios de CSS. Si algo no aparece, añade `--force`.
- **Railway**: despliega solo al hacer `git push`. Los cambios de esquema de Strapi
  se aplican al arrancar.
- **DNS**: lo gestiona **Vercel**, no Hostinger. Hostinger es solo el registrador;
  los nameservers apuntan a `ns1/ns2.vercel-dns.com`. Los registros que se añadan
  en el panel de Hostinger no tienen ningún efecto.

## Sistema visual

Definido en `CNUS/src/app/globals.css`. Respetarlo, no inventar.

- Tinta `#05162D` · primario `#0045A5` · azul fuerte `#0E52C6` · cian `#22D3EE`
- Grises `#667085`, `#98A2B3`, `#D0D5DD`, `#E0E4EA`, `#F2F4F7`
- Tipografía: `Inter, system-ui`. No hay webfont cargada.
- **Sin sombras**: una regla global las elimina con `!important`. La jerarquía va
  con bordes. La excepción es `:focus-visible`, que necesita el anillo para que el
  foco de teclado sea visible.
- Radios de 24px en tarjetas, `rounded-full` en botones.
- Breakpoints propios: `tablet` 720px, `laptop` 1200px, `desktop` 1610px. Conviven
  con los `md`/`lg` de Tailwind, así que hay que mirar cuál usa cada componente.

## Trampas de Strapi v5 (las tres nos costaron un rato)

**Cuenta documentos, no filas.** Cada documento tiene dos filas: borrador y
publicado. `strapi.db.query().count()` las suma las dos. Un límite de 4 se agota
con 2 registros. Para excluir un documento hay que filtrar por `documentId`, no
por `id`, o solo excluyes una de sus dos filas.

**Las relaciones no vienen sin `populate`.** `findOne({ documentId })` devuelve el
documento sin sus relaciones. Un guard que comprobaba `article.autor` nunca saltó
porque siempre era `undefined`.

**`PUT` publica.** Actualizar vía REST escribe en la versión visible aunque pases
`?status=draft`. Para crear en borrador sí funciona: `POST ...?status=draft`.

## Estado y pendientes

- 45 cursos publicados. **Las descripciones y temarios los generó un asistente**
  como punto de partida: el equipo académico debe revisarlos.
- Las portadas de curso son fotos de banco de Unsplash, marcadas como
  provisionales. Sustituir por archivo propio de la CNUS.
- `info@escuelacnus.com` **no recibe correo**: el dominio no tiene MX. El envío sí
  funciona (dominio verificado en Resend). Los avisos del formulario van a
  `escp2028@outlook.com` mientras tanto.
- **Sin moderación de comentarios.** Se publican al instante y solo se borran desde
  Supabase.
- La política de privacidad (`/politica-de-privacidad`) describe el tratamiento
  real de datos, pero no la ha revisado nadie con criterio legal.

## Documentación

- `GUIA-CMS.md` — manual del panel para el equipo, sin tecnicismos
- `CNUS/scripts/supabase/*.sql` — las políticas RLS aplicadas y por qué
- `CNUS/scripts/contenido-cursos.js` — el contenido de los 45 cursos
- El historial de git se aplanó a 2 commits; el detalle de cada cambio ya no está
  ahí, sino en estos archivos.

## Cómo trabajar aquí

**Verificar antes de afirmar.** Varias veces di algo por bueno sin comprobarlo y
me equivoqué: dije que un token permitía escribir cuando era de solo lectura, di
por hecho que un `?status=draft` mantendría el contenido sin publicar, y avisé de
un fallo en los formularios que en realidad eran pruebas de días atrás. Cuesta
poco lanzar un `curl` o una consulta y evita mandar al usuario a arreglar algo que
no está roto.

**Probar contra producción, no solo compilar.** `npm run build` pasa con código
que luego falla al ejecutarse. El fallo de jsdom que congelaba las páginas de
artículo solo apareció mirando los registros de Vercel.

**Limpiar los datos de prueba.** Si insertas un comentario o un contacto para
comprobar algo, bórralo después.
