import { Resend } from "resend";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/sanitize";
import { postSuscriptor } from "@/lib/supabase";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const RESEND_SEGMENT_ID = process.env.RESEND_SEGMENT_ID || '';
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || '';

async function crearContactoResend({ email, firstName, lastName }) {
  if (!RESEND_API_KEY) return 'unavailable';

  const resend = new Resend(RESEND_API_KEY);

  let result;
  if (RESEND_SEGMENT_ID) {
    result = await resend.contacts.create({
      email,
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      segments: [{ id: RESEND_SEGMENT_ID }],
    });
  } else if (RESEND_AUDIENCE_ID) {
    result = await resend.contacts.create({
      email,
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      audienceId: RESEND_AUDIENCE_ID,
    });
  } else {
    result = await resend.contacts.create({
      email,
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
    });
  }

  if (result.error) {
    const alreadySubscribed =
      result.error.statusCode === 400 && /already/i.test(result.error.message || '');
    if (alreadySubscribed) return 'exists';
    console.error('[newsletter] Resend error:', result.error);
    return 'error';
  }
  return 'created';
}

export async function POST(request) {
  const rateCheck = await checkRateLimit(getClientIp(request), 'newsletter');
  if (!rateCheck.allowed) {
    return Response.json(
      { message: `Demasiadas solicitudes. Intenta de nuevo en ${rateCheck.retryAfter}s.` },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfter) } }
    );
  }

  if (!RESEND_API_KEY) {
    return Response.json({ message: 'El newsletter no está configurado.' }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: 'Solicitud inválida.' }, { status: 400 });
  }

  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  if (!email || email.length > 254 || !EMAIL_REGEX.test(email)) {
    return Response.json({ message: 'Correo electrónico no válido.' }, { status: 400 });
  }

  const firstName = typeof body?.nombre === 'string' ? body.nombre.trim().slice(0, 100) : '';
  const lastName = typeof body?.apellido === 'string' ? body.apellido.trim().slice(0, 100) : '';

  const [supabaseResult, resendResult] = await Promise.allSettled([
    postSuscriptor(email),
    crearContactoResend({ email, firstName, lastName }),
  ]);

  const stored = supabaseResult.status === 'fulfilled' && supabaseResult.value === true;
  const resendOutcome = resendResult.status === 'fulfilled' ? resendResult.value : 'error';

  if (resendOutcome === 'exists' && !stored) {
    return Response.json({ message: 'Ya estás suscrito al boletín.' }, { status: 200 });
  }

  if (!stored && resendOutcome !== 'created') {
    console.error('[newsletter] Fallaron Supabase y Resend:', {
      supabase: supabaseResult.status === 'fulfilled' ? 'no insertado' : supabaseResult.reason,
      resend: resendOutcome,
    });
    return Response.json({ message: 'No se pudo procesar la suscripción. Intenta de nuevo.' }, { status: 500 });
  }

  return Response.json({ message: '¡Suscripción exitosa!' }, { status: 200 });
}
