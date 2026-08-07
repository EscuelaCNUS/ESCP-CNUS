-- APLICADA en Supabase (migración `adjust_comment_likes_clamp_delta`).
-- Se conserva aquí como referencia del esquema.
--
-- Incremento atómico de "me gusta" en comentarios.
--
-- Reemplaza el patrón leer-modificar-escribir que hacía el cliente, en el que
-- dos likes simultáneos leían el mismo valor y uno se perdía. Aquí el UPDATE
-- lee y escribe en la misma sentencia, así que Postgres serializa la fila.
--
-- Es SECURITY DEFINER a propósito: `comentarios` no tiene política de update,
-- así que ésta es la única vía para modificar la columna `likes`.
--
-- El delta se acota aquí además de en /api/likes, porque el RPC es invocable
-- directamente con la clave anon y esa validación se saltaría.

create or replace function public.adjust_comment_likes(
  comment_id bigint,
  delta int
)
returns table (id bigint, likes int)
language sql
security definer
set search_path = public
as $$
  update public.comentarios
     set likes = least(
           greatest(coalesce(likes, 0) + greatest(least(delta, 1), -1), 0),
           1000000
         )
   where comentarios.id = comment_id
  returning comentarios.id, comentarios.likes;
$$;

grant execute on function public.adjust_comment_likes(bigint, int) to anon, authenticated;
