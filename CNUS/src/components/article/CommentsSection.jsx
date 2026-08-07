"use client";
import { useState, useEffect, useRef } from "react";
import { decodeHtmlEntities } from "@/lib/sanitize";

/**
 * El texto se guarda en crudo y React lo escapa al renderizar. Los comentarios
 * antiguos se guardaron ya escapados, así que los revertimos al mostrarlos.
 */
function displayText(value) {
  return decodeHtmlEntities(value ?? "");
}

const VISIBLE_COUNT = 5;
const COOLDOWN_MS = 5_000;
const MAX_CHARS = 500;

async function postJson(url, data) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, json, status: res.status };
}

function getInitials(nombre = "", apellido = "") {
  const n = displayText(nombre);
  const a = displayText(apellido);
  return `${n.charAt(0)}${a.charAt(0)}`.toUpperCase() || "?";
}

const AVATAR_COLORS = [
  "bg-[#0E52C6]", "bg-[#E05A2B]", "bg-[#2EAE6D]", "bg-[#9B59B6]",
  "bg-[#E67E22]", "bg-[#3498DB]", "bg-[#16A085]", "bg-[#E74C3C]",
];

function getColor(id) {
  return AVATAR_COLORS[(id ?? 0) % AVATAR_COLORS.length];
}

function NewCommentFormInline({ articuloSlug, onSuccess }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [cooldown, setCooldown] = useState(0);
  const lastSentRef = useRef(0);
  const cooldownTimerRef = useRef(null);

  useEffect(() => {
    const timer = cooldownTimerRef.current;
    return () => {
      if (timer) clearInterval(timer);
    };
  }, []);

  const validate = () => {
    const errors = {};
    const trimmedNombre = nombre.trim();
    const trimmedTexto = texto.trim();
    if (!trimmedNombre) errors.nombre = "El nombre es obligatorio";
    else if (trimmedNombre.length > 100) errors.nombre = "Máximo 100 caracteres";
    if (!trimmedTexto) errors.texto = "El comentario es obligatorio";
    else if (trimmedTexto.length > MAX_CHARS) errors.texto = `Máximo ${MAX_CHARS} caracteres`;
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    setError(false);

    const now = Date.now();
    const timeSinceLast = now - lastSentRef.current;
    if (timeSinceLast < COOLDOWN_MS) {
      setCooldown(Math.ceil((COOLDOWN_MS - timeSinceLast) / 1000));
      setLoading(false);
      return;
    }

    const { ok, json } = await postJson("/api/comentarios", {
      articulo_slug: articuloSlug,
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.trim(),
      texto: texto.trim(),
    });

    setLoading(false);

    if (ok && json.comment) {
      lastSentRef.current = Date.now();
      onSuccess(json.comment);
      setNombre("");
      setApellido("");
      setEmail("");
      setTexto("");
      setFieldErrors({});
    } else {
      setError(true);
    }
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-2">
        <label className="text-[#05162D] font-medium ml-1">Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ejemplo: Pedro"
          maxLength={100}
          className={`w-full h-[56px] laptop:h-[60px] rounded-full border border-[#D0D5DD] px-6 text-[#05162D] placeholder:text-[#98A2B3] focus:outline-none focus:border-primary transition ${
            fieldErrors.nombre ? "border-red-400" : ""
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
        <label className="text-[#05162D] font-medium ml-1">Correo electrónico (opcional)</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@ejemplo.com"
          className="w-full h-[56px] laptop:h-[60px] rounded-full border border-[#D0D5DD] px-6 text-[#05162D] placeholder:text-[#98A2B3] focus:outline-none focus:border-primary transition"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[#05162D] font-medium ml-1">
          Comentario <span className="text-gray-400 font-normal">({texto.length}/{MAX_CHARS})</span>
        </label>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe tu opinión sobre el tema..."
          maxLength={MAX_CHARS}
          className={`w-full h-[140px] laptop:h-[160px] rounded-[24px] border border-[#D0D5DD] p-6 text-[#05162D] placeholder:text-[#98A2B3] focus:outline-none focus:border-primary transition resize-none ${
            fieldErrors.texto ? "border-red-400" : ""
          }`}
        />
        {fieldErrors.texto && <p className="text-red-500 text-xs ml-2">{fieldErrors.texto}</p>}
      </div>

      {cooldown > 0 && (
        <p className="text-amber-600 text-sm text-center">Espera {cooldown}s antes de enviar otra opinión.</p>
      )}

      {error && (
        <p className="text-red-500 text-sm text-center">Hubo un error al enviar tu comentario. Intenta de nuevo.</p>
      )}

      <button
        type="submit"
        disabled={loading || cooldown > 0}
        className="w-full h-[56px] laptop:h-[60px] bg-[#0E52C6] hover:bg-blue-800 disabled:opacity-50 text-white rounded-full font-medium text-lg transition-colors cursor-pointer"
      >
        {loading ? "Enviando..." : "Enviar"}
      </button>
    </form>
  );
}

function ReplyModal({ comment, onClose, articuloSlug, onSuccess }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !texto.trim()) return;

    setLoading(true);
    setError(false);

    const { ok, json } = await postJson("/api/comentarios", {
      articulo_slug: articuloSlug,
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      texto: texto.trim(),
      comentario_padre_id: comment.id,
    });

    setLoading(false);

    if (ok && json.comment) {
      setSuccess(true);
      setTimeout(() => {
        onSuccess(json.comment);
        onClose();
      }, 1500);
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Responder comentario"
        className="relative bg-white rounded-[24px] w-full max-w-[560px] p-8 border border-[#D0D5DD] text-[#05162D]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#667085] hover:text-[#05162D] transition-colors"
          aria-label="Cerrar modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <h3 className="text-[#05162D] text-xl font-bold mb-6">Responder comentario</h3>
        <div className="p-4 bg-[#F9FAFB] rounded-[16px] mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-[#05162D]">{displayText(comment.nombre)} {displayText(comment.apellido)}</span>
          </div>
          <p className="text-[#475467] text-[14px] leading-relaxed line-clamp-3 whitespace-pre-line">{displayText(comment.texto)}</p>
        </div>
        {success ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <p className="text-green-600 font-medium">Respuesta enviada</p>
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[#05162D] font-medium text-[13px] ml-1">Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full h-[44px] rounded-full border border-[#D0D5DD] px-4 text-[14px] text-[#05162D] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0E52C6] transition"
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[#05162D] font-medium text-[13px] ml-1">Apellido</label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Tu apellido"
                  className="w-full h-[44px] rounded-full border border-[#D0D5DD] px-4 text-[14px] text-[#05162D] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0E52C6] transition"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[#05162D] font-medium text-[13px] ml-1">Tu respuesta</label>
              <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Escribe tu respuesta..."
                className="w-full h-[100px] rounded-[16px] border border-[#D0D5DD] p-4 text-[14px] text-[#05162D] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0E52C6] transition resize-none"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">Error al enviar. Intenta de nuevo.</p>}
            <div className="flex justify-end gap-3 mt-1">
              <button
                type="button"
                onClick={onClose}
                className="h-[44px] px-6 rounded-full border border-[#D0D5DD] text-[#667085] font-medium text-[14px] hover:bg-[#F9FAFB] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !texto.trim()}
                className="h-[44px] px-6 rounded-full bg-[#0E52C6] hover:bg-blue-800 disabled:opacity-50 text-white font-medium text-[14px] transition-colors"
              >
                {loading ? "Enviando..." : "Enviar respuesta"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function CommentCard({ comment, isReply = false, onReply, onReplySuccess }) {
  const [liked, setLiked] = useState(
    () => typeof window !== "undefined" && localStorage.getItem(`liked_${comment.id}`) === 'true'
  );
  const [likeCount, setLikeCount] = useState(comment.likes ?? 0);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState(comment.replies ?? []);

  const initials = getInitials(comment.nombre, comment.apellido);
  const color = getColor(comment.id ?? 0);

  const handleLike = async () => {
    const newLiked = !liked;
    const delta = newLiked ? 1 : -1;
    setLiked(newLiked);
    setLikeCount((c) => Math.max(0, c + delta));
    localStorage.setItem(`liked_${comment.id}`, newLiked);
    const { ok, json } = await postJson("/api/likes", { commentId: comment.id, delta });
    if (ok && typeof json?.likes === "number") {
      setLikeCount(json.likes);
    }
  };

  const handleReplySuccess = (reply) => {
    setReplies((prev) => [...prev, reply]);
    onReplySuccess?.();
  };

  return (
    <div className={`flex gap-3 ${isReply ? "ml-12 mt-4" : ""}`}>
      <div className={`w-[40px] h-[40px] rounded-full ${color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-[#05162D] font-semibold text-[14px]">{displayText(comment.nombre)} {displayText(comment.apellido)}</span>
          <span className="text-[#98A2B3] text-[12px]">
            {comment.created_at ? new Date(comment.created_at).toLocaleDateString("es-DO", { day: "numeric", month: "long", year: "numeric" }) : "Reciente"}
          </span>
        </div>
        <p className="text-[#475467] text-[14px] leading-relaxed mb-2 whitespace-pre-line">{displayText(comment.texto || comment.respuesta)}</p>
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className={`flex items-center gap-1 text-[12px] font-medium transition-colors ${liked ? "text-rose-500 font-bold" : "text-[#98A2B3] hover:text-[#0E52C6]"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span>{likeCount}</span>
          </button>
          {!isReply && (
            <button onClick={() => onReply(comment)} className="text-[12px] font-semibold text-[#0E52C6] hover:underline transition-colors">
              Responder
            </button>
          )}
        </div>

        {!isReply && replies.length > 0 && (
          <div className="mt-3">
            <button onClick={() => setShowReplies(!showReplies)} className="text-xs font-medium text-[#0E52C6] flex items-center gap-1">
              {showReplies ? "Ocultar respuestas" : `Ver ${replies.length} ${replies.length === 1 ? "respuesta" : "respuestas"}`}
            </button>
          </div>
        )}

        {!isReply && showReplies && replies.map((reply, replyIndex) => (
          <CommentCard key={reply.id ?? replyIndex} comment={reply} isReply onReply={onReply} onReplySuccess={handleReplySuccess} />
        ))}
      </div>
    </div>
  );
}

export default function CommentsSection({ comentarios: initialComentarios = [], articuloSlug }) {
  const [comments, setComments] = useState(initialComentarios);
  const [showAll, setShowAll] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  const visibleComments = showAll ? comments : comments.slice(0, VISIBLE_COUNT);
  const hiddenCount = comments.length - VISIBLE_COUNT;

  const handleNewComment = (newComment) => {
    if (!newComment?.id) return;
    setComments((prev) => [{ ...newComment, replies: [] }, ...prev]);
  };

  return (
    <>
      <section className="w-full bg-white border-t border-[#E5E7EB] mb-20 laptop:mb-32">
        <div className="max-w-[1280px] mx-auto px-4 tablet:px-7.5 laptop:px-10 py-12 laptop:py-16 pb-16 laptop:pb-24">
          <div className="flex flex-col laptop:flex-row gap-10 laptop:gap-12">

            {/* LEFT COLUMN — Formulario */}
            <div className="w-full laptop:w-[420px] shrink-0">
              <h2 className="text-2xl md:text-[32px] font-bold text-[#05162D] mb-8">
                ¿Qué opinas sobre el tema?
              </h2>
              <NewCommentFormInline articuloSlug={articuloSlug} onSuccess={handleNewComment} />
            </div>

            {/* RIGHT COLUMN — Lista de Comentarios */}
            <div className="flex-1 min-w-0 bg-[#F9FAFB] rounded-[24px] p-6 laptop:p-8 border border-[#E5E7EB]">
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-[#05162D] text-xl md:text-[24px] font-bold">Comentarios</h2>
                <span className="bg-[#0E52C6] text-white text-sm font-bold rounded-full w-[30px] h-[30px] flex items-center justify-center">
                  {comments.length}
                </span>
              </div>

              {comments.length === 0 ? (
                <p className="text-gray-400 text-center py-10">Sé el primero en comentar.</p>
              ) : (
                <>
                  <div className="flex flex-col gap-6">
                    {visibleComments.map((comment, index) => (
                      <div key={comment.id ?? index}>
                        <CommentCard comment={comment} onReply={setReplyingTo} />
                        {index < visibleComments.length - 1 && <div className="border-b border-[#E5E7EB] mt-6" />}
                      </div>
                    ))}
                  </div>

                  {comments.length > VISIBLE_COUNT && (
                    <div className="flex justify-center mt-8">
                      <button
                        onClick={() => setShowAll(!showAll)}
                        className="flex items-center gap-2 text-[#0E52C6] font-semibold text-[15px] hover:underline transition-colors"
                      >
                        {showAll ? (
                          <>Mostrar menos <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6"/></svg></>
                        ) : (
                          <>Ver todos los comentarios ({hiddenCount} más) <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg></>
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      </section>

      {replyingTo && (
        <ReplyModal
          comment={replyingTo}
          onClose={() => setReplyingTo(null)}
          articuloSlug={articuloSlug}
          onSuccess={(reply) => {
            setComments((prev) => prev.map((c) =>
              c.id === reply.comentario_padre_id
                ? { ...c, replies: [...(c.replies || []), reply] }
                : c
            ));
          }}
        />
      )}
    </>
  );
}