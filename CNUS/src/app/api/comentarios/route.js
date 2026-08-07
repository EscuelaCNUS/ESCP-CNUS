import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp, isValidSlug, sanitizeText } from "@/lib/sanitize";
import { insertComentario } from "@/lib/supabase";

const MAX_NAME = 100;
const MAX_TEXT = 500;

export async function POST(request) {
  const rateCheck = await checkRateLimit(getClientIp(request), 'comentarios');
  if (!rateCheck.allowed) {
    return Response.json(
      { message: `Demasiadas solicitudes. Intenta de nuevo en ${rateCheck.retryAfter}s.` },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfter) } }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: 'Solicitud inválida.' }, { status: 400 });
  }

  const articuloSlug = typeof body?.articulo_slug === 'string' ? body.articulo_slug.trim() : '';
  if (!isValidSlug(articuloSlug)) {
    return Response.json({ message: 'Artículo inválido.' }, { status: 400 });
  }

  const nombre = typeof body?.nombre === 'string' ? body.nombre.trim() : '';
  const apellido = typeof body?.apellido === 'string' ? body.apellido.trim() : '';
  const texto = typeof body?.texto === 'string' ? body.texto.trim() : '';

  if (!nombre) {
    return Response.json({ message: 'El nombre es obligatorio.' }, { status: 400 });
  }
  if (nombre.length > MAX_NAME || apellido.length > MAX_NAME) {
    return Response.json({ message: 'Nombre demasiado largo.' }, { status: 400 });
  }
  if (!texto) {
    return Response.json({ message: 'El comentario es obligatorio.' }, { status: 400 });
  }
  if (texto.length > MAX_TEXT) {
    return Response.json({ message: `Máximo ${MAX_TEXT} caracteres.` }, { status: 400 });
  }

  let comentarioPadreId = null;
  if (body?.comentario_padre_id != null) {
    comentarioPadreId = Number(body.comentario_padre_id);
    if (!Number.isInteger(comentarioPadreId) || comentarioPadreId <= 0) {
      return Response.json({ message: 'Respuesta inválida.' }, { status: 400 });
    }
  }

  const comment = await insertComentario({
    articulo_slug: articuloSlug,
    nombre: sanitizeText(nombre, MAX_NAME),
    apellido: sanitizeText(apellido, MAX_NAME),
    texto: sanitizeText(texto, MAX_TEXT),
    ...(comentarioPadreId ? { comentario_padre_id: comentarioPadreId } : {}),
  });

  if (!comment) {
    return Response.json({ message: 'No se pudo publicar el comentario.' }, { status: 500 });
  }

  return Response.json({ comment }, { status: 201 });
}
