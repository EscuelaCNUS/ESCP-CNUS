"use client";

import Image from "next/image";
import { MessageCircle, Heart } from "lucide-react";
import { getStrapiImageUrl } from "@/lib/strapi";

function getVideoEmbedUrl(url) {
  if (!url) return null;
  const trimmed = url.trim();
  if (trimmed.includes("youtube.com/watch") || trimmed.includes("youtu.be")) {
    const ytId = trimmed.split("v=")[1]?.split("&")[0] || trimmed.split("youtu.be/")[1]?.split("?")[0];
    return ytId ? `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1` : null;
  }
  if (trimmed.includes("vimeo.com")) {
    const vimeoId = trimmed.split("vimeo.com/")[1]?.split("?")[0];
    return vimeoId ? `https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1` : null;
  }
  return trimmed;
}

export default function DebateArticleHero({ debate, comentarios = [] }) {
  const pregunta = debate?.pregunta || "Debate sin título";

  // Las cifras salen siempre de los comentarios reales: participantes son
  // personas distintas y respuestas son comentarios. Ya no hay contadores
  // manuales en Strapi que puedan quedarse desfasados.
  const uniqueNames = new Set(
    comentarios
      .map((c) => `${c.nombre || ""}`.trim().toLowerCase())
      .filter(Boolean)
  );
  const totalParticipantes = uniqueNames.size;
  const totalRespuestas = comentarios.length;
  const totalLikes = comentarios.reduce((sum, c) => sum + (Number(c.likes) || 0), 0);

  // Strapi media resolution (video link, uploaded video file, or image)
  const embedUrl = getVideoEmbedUrl(debate?.video_url);

  const mediaObj = debate?.archivo_media || debate?.imagen_portada;
  const mediaUrl = getStrapiImageUrl(mediaObj);
  const mimeType = mediaObj?.mime || "";
  const isVideoFile = mimeType.startsWith("video") || (mediaUrl && (mediaUrl.endsWith(".mp4") || mediaUrl.endsWith(".webm")));

  return (
    <section className="relative w-full bg-black mt-22.5 tablet:mt-29">
      <div className="relative w-full aspect-[21/9] max-h-[65vh] min-h-[380px] laptop:min-h-[480px] overflow-hidden bg-[#0A1628]">
        {/* Media Priority: 1. External Embed (YouTube/Vimeo) -> 2. Uploaded Video File -> 3. Uploaded Image -> 4. Gradient fallback */}
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={pregunta}
            className="absolute inset-0 w-full h-full border-0 opacity-70"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : isVideoFile && mediaUrl ? (
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
            sizes="100vw"
            priority
            className="object-cover opacity-60"
          />
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-[#0F1F3D] via-[#1A2D5A] to-[#0A1628] opacity-90"
            style={{
              backgroundImage: `radial-gradient(circle at 30% 30%, #4A8EFF 0%, transparent 40%), radial-gradient(circle at 70% 70%, #8B5CF6 0%, transparent 40%)`,
            }}
          />
        )}

        {/* Content Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent w-full flex flex-col justify-end pointer-events-none">
          <div className="w-full max-w-[1920px] mx-auto px-4 tablet:px-7.5 laptop:px-20 desktop:px-29.5 pb-6 laptop:pb-10 pt-10 pointer-events-auto">
            <div className="flex items-center gap-2 text-[#4A8EFF] text-xs font-semibold uppercase tracking-widest mb-2">
              <MessageCircle size={14} />
              Debate
            </div>
            <h1 className="text-white text-xl laptop:text-3xl desktop:text-4xl font-bold leading-tight max-w-3xl">
              {pregunta}
            </h1>
          </div>
        </div>

        {/* Dynamic Statistics Badge (Participantes, Opiniones, Likes) */}
        {(totalParticipantes > 0 || totalRespuestas > 0 || totalLikes > 0) && (
          <div className="absolute top-4 right-4 flex items-center gap-3 bg-black/50 backdrop-blur rounded-full px-4 py-2 border border-white/10 z-20">
            <span className="text-white/70 text-xs">
              <strong className="text-white">{totalParticipantes}</strong> participando
            </span>
            <span className="w-px h-3 bg-white/20" />
            <span className="text-white/70 text-xs">
              <strong className="text-white">{totalRespuestas}</strong> {totalRespuestas === 1 ? "opinión" : "opiniones"}
            </span>
            {totalLikes > 0 && (
              <>
                <span className="w-px h-3 bg-white/20" />
                <span className="text-white/70 text-xs flex items-center gap-1">
                  <Heart size={12} className="text-rose-400 fill-rose-400" />
                  <strong className="text-white">{totalLikes}</strong>
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
