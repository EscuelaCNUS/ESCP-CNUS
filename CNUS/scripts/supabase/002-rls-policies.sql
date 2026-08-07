-- APLICADO en Supabase. Se conserva aquí como referencia del esquema.
--
-- Migraciones: rls_contactos, rls_comentarios, rls_respuestas_debate,
-- index_comentario_padre_id, drop_respuestas_debate, rls_comentarios_solo_api,
-- rls_contactos_solo_api.
--
-- Punto de partida: comentarios, contactos y respuestas_debate no tenían RLS.
-- El rol `anon` disponía de SELECT/INSERT/UPDATE/DELETE/TRUNCATE sobre las tres,
-- y esa clave es pública: viaja en el bundle del navegador. Cualquiera podía
-- leer los mensajes del formulario de contacto o vaciar los comentarios.
--
-- Estado final — lo único que puede hacer la clave pública:
--
--   comentarios    → SELECT
--   contactos      → nada
--   suscriptores   → INSERT (correo no vacío)
--
-- Toda la escritura pasa por las rutas de API, que usan
-- SUPABASE_SERVICE_ROLE_KEY y por tanto se saltan RLS. Ahí viven el rate limit,
-- el saneado y los límites de longitud. Sin esto, se podían insertar nombres de
-- 300 caracteres y textos de 5.000 escribiendo directo a la tabla.

-- ─── contactos ────────────────────────────────────────────────────────────────
-- Datos personales de terceros: ni lectura ni escritura para el público.
alter table public.contactos enable row level security;

-- Sin políticas: RLS activo y ninguna regla permisiva equivale a denegar todo.

-- ─── comentarios ──────────────────────────────────────────────────────────────
-- Se muestran en la web, así que la lectura es abierta. Publicar va por
-- /api/comentarios. Sin políticas de update ni delete: nadie edita ni borra
-- comentarios ajenos, y los "me gusta" se ajustan con adjust_comment_likes (001).
alter table public.comentarios enable row level security;

create policy "comentarios: lectura publica"
  on public.comentarios
  for select
  to anon, authenticated
  using (true);

-- ─── suscriptores ─────────────────────────────────────────────────────────────
-- Ya tenía RLS antes de esta revisión. Su política admite inserciones con correo
-- no vacío; /api/newsletter usa Prefer: return=minimal, así que no necesita
-- lectura y la lista de suscriptores no es accesible desde el navegador.

-- ─── respuestas_debate ────────────────────────────────────────────────────────
-- Tabla eliminada (migración drop_respuestas_debate). Era de la encuesta rápida
-- de portada, que nunca se llegó a montar y quedó siempre vacía. Los debates no
-- la usaban: sus respuestas van a `comentarios`, con el slug del debate en
-- `articulo_slug`.

-- ─── Índice que faltaba ───────────────────────────────────────────────────────
-- getComentarios agrupa respuestas por su comentario padre; la foreign key no
-- tenía índice que la cubriera.
create index if not exists idx_comentarios_padre
  on public.comentarios (comentario_padre_id)
  where comentario_padre_id is not null;
