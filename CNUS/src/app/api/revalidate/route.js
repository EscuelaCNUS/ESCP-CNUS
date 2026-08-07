import { revalidateTag, revalidatePath } from 'next/cache';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/sanitize';

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  let diff = 0;
  for (let i = 0; i < bufA.length; i += 1) {
    diff |= bufA[i] ^ bufB[i];
  }
  return diff === 0;
}

export async function POST(request) {
  const ip = getClientIp(request);
  const rateCheck = await checkRateLimit(ip, 'revalidate');
  if (!rateCheck.allowed) {
    return Response.json(
      { message: `Demasiadas solicitudes. Intenta de nuevo en ${rateCheck.retryAfter}s.` },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfter) } }
    );
  }

  const secret = request.headers.get('x-revalidate-secret');
  if (!REVALIDATE_SECRET) {
    return Response.json({ message: 'REVALIDATE_SECRET not configured' }, { status: 500 });
  }
  if (!secret || !safeEqual(secret, REVALIDATE_SECRET)) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const model = String(body?.model ?? 'unknown');

    // Invalidar el tag correspondiente según el modelo de Strapi
    switch (model) {
      case 'articulo':
        revalidateTag('articulos');
        revalidatePath('/');
        revalidatePath('/articulando');
        revalidatePath('/articulando/[slug]');
        break;
      case 'debate':
        revalidateTag('debates');
        revalidatePath('/articulando');
        revalidatePath('/articulando/debate');
        revalidatePath('/articulando/debate/[slug]');
        break;
      case 'programa':
      case 'programas':
        revalidateTag('programas');
        revalidatePath('/');
        revalidatePath('/programas');
        revalidatePath('/programas/[slug]');
        break;
      case 'hero-config':
      case 'audiencia':
        revalidatePath('/');
        break;
      case 'eje-formativo':
      case 'eje-formativos':
        revalidateTag('ejes');
        revalidatePath('/');
        revalidatePath('/programas');
        break;
      case 'categoria':
      case 'categorias':
        revalidateTag('articulos');
        revalidateTag('categorias');
        revalidatePath('/articulando');
        break;
      default:
        // Fallback: revalidar todo lo que se conoce
        revalidateTag('articulos');
        revalidateTag('debates');
        revalidateTag('programas');
        revalidatePath('/');
        revalidatePath('/articulando');
        revalidatePath('/programas');
        revalidatePath('/programas/[slug]');
        revalidatePath('/nosotros');
        break;
    }

    return Response.json({
      revalidated: true,
      model,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return Response.json(
      { message: 'Error revalidating', error: String(err) },
      { status: 500 }
    );
  }
}

// GET para verificar que el endpoint existe
export async function GET() {
  return Response.json({ status: 'ok', message: 'Revalidation endpoint active' });
}
