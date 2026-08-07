"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Play, MessageCircle } from "lucide-react";
import { getStrapiImageUrl } from "@/lib/strapi";
import { decodeHtmlEntities } from "@/lib/sanitize";

const COOLDOWN_MS = 5_000;
const MAX_CHARS = 500;

const AVATAR_COLORS = [
  "bg-[#0E52C6]", "bg-[#E05A2B]", "bg-[#2EAE6D]", "bg-[#9B59B6]",
  "bg-[#E67E22]", "bg-[#3498DB]", "bg-[#16A085]", "bg-[#E74C3C]",
];

function getColor(id) {
  return AVATAR_COLORS[(id ?? 0) % AVATAR_COLORS.length];
}

export default function DebateHero({ activeDebate = null, comentarios: initialComentarios = [] }) {
  const [playing, setPlaying] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [texto, setTexto] = useState("");
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [comments, setComments] = useState(initialComentarios);
  const lastSentRef = useRef(0);
  const cooldownTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    };
  }, []);

  const pregunta = activeDebate?.pregunta || "Todavía no hay ningún debate publicado";

  // Participantes son personas distintas, no comentarios: antes ambas cifras
  // usaban comments.length, así que tres mensajes de una misma persona
  // aparecían como "3 participando".
  const nombresUnicos = new Set(
    comments.map((c) => `${c.nombre || ""}`.trim().toLowerCase()).filter(Boolean)
  );
  const participantes = nombresUnicos.size;
  const respuestas = comments.length;

  const mediaObj = activeDebate?.archivo_media || activeDebate?.imagen_portada;
  const mediaUrl = getStrapiImageUrl(mediaObj);
  const mimeType = mediaObj?.mime || "";
  const isVideo = mimeType.startsWith("video") || (mediaUrl && (mediaUrl.endsWith(".mp4") || mediaUrl.endsWith(".webm")));

  const validate = () => {
    const errors = {};
    const n = nombre.trim();
    const t = texto.trim();
    if (!n) errors.nombre = "El nombre es obligatorio";
    else if (n.length > 100) errors.nombre = "Máximo 100 caracteres";
    if (!t) errors.texto = "La respuesta es obligatoria";
    else if (t.length > MAX_CHARS) errors.texto = `Máximo ${MAX_CHARS} caracteres`;
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const now = Date.now();
    if (now - lastSentRef.current < COOLDOWN_MS) {
      const remaining = Math.ceil((COOLDOWN_MS - (now - lastSentRef.current)) / 1000);
      setCooldown(remaining);
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
      cooldownTimerRef.current = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) { clearInterval(cooldownTimerRef.current); return 0; }
          return prev - 1;
        });
      }, 1000);
      return;
    }

    setSending(true);
    setSendError(false);

    let ok = false;
    let newCommentData = null;
    try {
      const res = await fetch("/api/comentarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articulo_slug: activeDebate?.slug || "debate-general",
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          texto: texto.trim(),
        }),
      });
      const json = await res.json().catch(() => ({}));
      ok = res.ok;
      if (ok && json.comment) {
        newCommentData = json.comment;
      }
    } catch {
      ok = false;
    }

    setSending(false);

    if (ok) {
      lastSentRef.current = Date.now();
      setSuccess(true);
      if (newCommentData) {
        setComments((prev) => [newCommentData, ...prev]);
      }
    } else {
      setSendError(true);
    }
  };

  return (
    <>
      {/* MEDIA HERO */}
      <section className="relative w-full bg-black mt-22.5 tablet:mt-29">
        <div className="relative w-full aspect-[21/9] max-h-[65vh] min-h-[380px] laptop:min-h-[480px] overflow-hidden bg-[#0A1628]">
          {/* Fondo desenfocado si hay imagen */}
          {mediaUrl && !isVideo && (
            <div
              className="absolute inset-0 scale-110 blur-xl opacity-60"
              style={{
                backgroundImage: `url(${mediaUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          )}

          {isVideo && mediaUrl ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            >
              <source src={mediaUrl} type="video/mp4" />
            </video>
          ) : mediaUrl ? (
            <Image
              src={mediaUrl}
              alt={pregunta}
              fill
              priority
              sizes="100vw"
              className="object-contain object-center"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#05162D] via-[#0E52C6] to-[#0A1628]" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent w-full flex flex-col justify-end">
            <div className="w-full max-w-[1920px] mx-auto px-4 tablet:px-7.5 laptop:px-20 desktop:px-29.5 pb-6 laptop:pb-10 pt-10">
              <div className="flex items-center gap-2 text-[#4A8EFF] text-xs font-semibold uppercase tracking-widest mb-2">
                <MessageCircle size={14} />
                Debate del momento
              </div>
              <h1 className="text-white text-xl laptop:text-3xl desktop:text-4xl font-bold leading-tight max-w-3xl">
                {pregunta}
              </h1>
            </div>
          </div>

          {(participantes > 0 || respuestas > 0) && (
            <div className="absolute top-4 right-4 flex items-center gap-3 bg-black/50 backdrop-blur rounded-full px-4 py-2 border border-white/10 z-20">
              <span className="text-white/70 text-xs"><strong className="text-white">{participantes}</strong> participando</span>
              <span className="w-px h-3 bg-white/20" />
              <span className="text-white/70 text-xs"><strong className="text-white">{respuestas}</strong> opiniones</span>
            </div>
          )}
        </div>
      </section>

      {/* TWO COLUMNS: izquierda = Formulario, derecha = Comentarios */}
      <section className="w-full bg-white">
        <div className="max-w-[1280px] mx-auto px-4 tablet:px-7.5 laptop:px-10 py-12 laptop:py-16">
          <div className="flex flex-col laptop:flex-row gap-10 laptop:gap-12">

            {/* LEFT COLUMN — Formulario */}
            <div className="w-full laptop:w-[420px] shrink-0">
              {!success ? (
                <>
                  <h2 className="text-2xl md:text-[32px] font-bold text-[#05162D] mb-8">
                    ¿Qué opinas sobre el tema?
                  </h2>

                  <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
                    <div className="flex flex-col gap-2">
                      <label className="text-[#05162D] font-medium ml-1">Nombre</label>
                      <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ejemplo: Pedro"
                        required
                        maxLength={100}
                        className={`w-full h-[56px] laptop:h-[60px] rounded-full border px-6 text-[#05162D] placeholder:text-[#98A2B3] focus:outline-none transition ${
                          fieldErrors.nombre ? "border-red-400" : "border-[#D0D5DD] focus:border-primary"
                        }`}
                      />
                      {fieldErrors.nombre && <p className="text-red-500 text-xs ml-2">{fieldErrors.nombre}</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[#05162D] font-medium ml-1">Apellido</label>
                      <input
                        type="text"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        placeholder="Ejemplo: Martínez"
                        maxLength={100}
                        className="w-full h-[56px] laptop:h-[60px] rounded-full border border-[#D0D5DD] px-6 text-[#05162D] placeholder:text-[#98A2B3] focus:outline-none focus:border-primary transition"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[#05162D] font-medium ml-1">
                        Respuesta <span className="text-gray-400 font-normal">({texto.length}/{MAX_CHARS})</span>
                      </label>
                      <textarea
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        placeholder="Escribe tu opinión sobre el tema..."
                        required
                        maxLength={MAX_CHARS}
                        className={`w-full h-[140px] laptop:h-[160px] rounded-[24px] border p-6 text-[#05162D] placeholder:text-[#98A2B3] focus:outline-none transition resize-none ${
                          fieldErrors.texto ? "border-red-400" : "border-[#D0D5DD] focus:border-primary"
                        }`}
                      />
                      {fieldErrors.texto && <p className="text-red-500 text-xs ml-2">{fieldErrors.texto}</p>}
                    </div>

                    {cooldown > 0 && (
                      <p className="text-amber-600 text-sm text-center">Espera {cooldown}s antes de enviar otra opinión.</p>
                    )}

                    {sendError && (
                      <p className="text-red-500 text-sm text-center">Error al enviar. Intenta de nuevo.</p>
                    )}

                    <button
                      type="submit"
                      disabled={sending || cooldown > 0}
                      className="w-full h-[56px] laptop:h-[60px] bg-[#0E52C6] hover:bg-blue-800 disabled:opacity-50 text-white rounded-full font-medium text-lg transition-colors cursor-pointer"
                    >
                      {sending ? "Enviando..." : "Enviar"}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
                  <h2 className="text-2xl font-bold text-[#05162D] mb-2">¡Gracias por tu opinión!</h2>
                  <p className="text-gray-500 mb-6">Tu comentario ha sido publicado.</p>
                  <button onClick={() => { setSuccess(false); setNombre(""); setApellido(""); setTexto(""); }} className="text-[#0E52C6] font-medium hover:underline cursor-pointer">
                    Escribir otro comentario
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN — Comentarios Reales */}
            <div className="flex-1 min-w-0 bg-[#F9FAFB] rounded-[24px] p-6 laptop:p-8 border border-[#E5E7EB]">
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-[#05162D] text-xl md:text-[24px] font-bold">Comentarios</h2>
                <span className="bg-[#0E52C6] text-white text-sm font-bold rounded-full w-[30px] h-[30px] flex items-center justify-center">
                  {comments.length}
                </span>
              </div>

              {comments.length === 0 ? (
                <p className="text-gray-400 text-center py-10">Sé el primero en opinar en este debate.</p>
              ) : (
                <div className="flex flex-col gap-6">
                  {comments.map((comment, i) => {
                    const nombre = decodeHtmlEntities(comment.nombre ?? "");
                    const apellido = decodeHtmlEntities(comment.apellido ?? "");
                    const initials = `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase() || "?";
                    const color = getColor(comment.id ?? i);
                    return (
                      <div key={comment.id ?? i}>
                        <div className="flex gap-3">
                          <div className={`w-[40px] h-[40px] rounded-full ${color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                            {initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-[#05162D] font-semibold text-[14px]">{nombre} {apellido}</span>
                              <span className="text-[#98A2B3] text-[12px]">
                                {comment.created_at ? new Date(comment.created_at).toLocaleDateString("es-DO", { day: "numeric", month: "long", year: "numeric" }) : "Reciente"}
                              </span>
                            </div>
                            <p className="text-[#475467] text-[14px] leading-relaxed mb-2 whitespace-pre-line">{decodeHtmlEntities(comment.texto || comment.respuesta || "")}</p>
                          </div>
                        </div>
                        {i < comments.length - 1 && <div className="border-b border-[#E5E7EB] mt-6" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
