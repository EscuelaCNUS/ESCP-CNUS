import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/sanitize";
import { adjustLikes } from "@/lib/supabase";

export async function POST(request) {
  const rateCheck = await checkRateLimit(getClientIp(request), 'likes');
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

  const commentId = Number(body?.commentId);
  const delta = Number(body?.delta);

  if (!Number.isInteger(commentId) || commentId <= 0) {
    return Response.json({ message: 'Comentario inválido.' }, { status: 400 });
  }
  if (delta !== 1 && delta !== -1) {
    return Response.json({ message: 'Acción inválida.' }, { status: 400 });
  }

  const updated = await adjustLikes(commentId, delta);

  if (!updated) {
    return Response.json({ message: 'No se pudo actualizar.' }, { status: 500 });
  }

  return Response.json({ likes: Number(updated.likes) || 0 }, { status: 200 });
}
