import { Resend } from "resend";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp, escapeHtml as esc } from "@/lib/sanitize";
import { postContacto } from "@/lib/supabase";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const RESEND_FROM = process.env.RESEND_FROM || 'onboarding@resend.dev';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || '';

async function enviarEmail({ nombre, apellido, email, motivo }) {
  if (!RESEND_API_KEY || !CONTACT_EMAIL) return false;

  const resend = new Resend(RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: RESEND_FROM,
    to: [CONTACT_EMAIL],
    replyTo: email,
    subject: `Nuevo mensaje de contacto — ${nombre}${apellido ? ` ${apellido}` : ''}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0045A5; margin-bottom: 8px;">Nuevo mensaje de contacto</h2>
        <p style="color: #667085; margin-top: 0;">Enviado desde el formulario de contacto de la Escuela CNUS</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr>
            <td style="padding: 8px 0; color: #667085; width: 110px; vertical-align: top;"><strong>Nombre:</strong></td>
            <td style="padding: 8px 0;">${esc(nombre)}${apellido ? ` ${esc(apellido)}` : ''}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #667085; vertical-align: top;"><strong>Correo:</strong></td>
            <td style="padding: 8px 0;">${esc(email)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #667085; vertical-align: top;"><strong>Motivo:</strong></td>
            <td style="padding: 8px 0; white-space: pre-wrap;">${esc(motivo)}</td>
          </tr>
        </table>
        <p style="color: #98A2B3; font-size: 13px; margin-top: 24px;">
          Puedes responder directamente a este correo: el mensaje se enviará a <a href="mailto:${esc(email)}">${esc(email)}</a>
        </p>
      </div>
    `,
  });

  if (error) {
    console.error('[contacto] Resend error:', error);
    return false;
  }
  return true;
}

export async function POST(request) {
  const rateCheck = await checkRateLimit(getClientIp(request), 'contacto');
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

  const nombre = typeof body?.nombre === 'string' ? body.nombre.trim() : '';
  const apellido = typeof body?.apellido === 'string' ? body.apellido.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const motivo = typeof body?.motivo === 'string' ? body.motivo.trim() : '';

  if (!nombre || nombre.length > 100) {
    return Response.json({ message: 'El nombre es obligatorio.' }, { status: 400 });
  }
  if (apellido.length > 100) {
    return Response.json({ message: 'Apellido demasiado largo.' }, { status: 400 });
  }
  if (!email || !EMAIL_REGEX.test(email) || email.length > 254) {
    return Response.json({ message: 'Correo electrónico no válido.' }, { status: 400 });
  }
  if (!motivo || motivo.length > 500) {
    return Response.json({ message: 'El motivo es obligatorio.' }, { status: 400 });
  }

  const data = { nombre, apellido, email, motivo };

  const [supabaseResult, resendResult] = await Promise.allSettled([
    postContacto(data),
    enviarEmail(data),
  ]);

  const stored = supabaseResult.status === 'fulfilled' && supabaseResult.value === true;
  const sent = resendResult.status === 'fulfilled' && resendResult.value === true;

  if (!stored && !sent) {
    console.error('[contacto] Fallaron Supabase y Resend:', {
      supabase: supabaseResult.reason ?? null,
      resend: resendResult.reason ?? null,
    });
    return Response.json({ message: 'No se pudo enviar el mensaje. Intenta de nuevo.' }, { status: 500 });
  }

  return Response.json({ message: 'Mensaje enviado.' }, { status: 200 });
}
