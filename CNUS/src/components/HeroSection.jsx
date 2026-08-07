import Link from "next/link";
import Image from "next/image";
import { getStrapiImageUrl } from "@/lib/strapi";

export default function HeroSection({ heroConfig = null }) {
  if (!heroConfig) return null;

  const {
    tipo_media,
    archivo_media,
    titulo,
    subtitulo,
    boton_texto,
    boton_url,
    programa_destacado,
    stat_1,
    stat_2,
    stat_3,
    poster_media, // imagen estática de portada del video (súbela en Strapi → hero-config)
  } = heroConfig;

  const mediaUrl = getStrapiImageUrl(archivo_media);
  const posterUrl = getStrapiImageUrl(poster_media);

  const mimeType = archivo_media?.mime || '';
  const isVideo = mimeType.startsWith('video') || (mediaUrl && mediaUrl.endsWith('.mp4'));
  const effectiveTipoMedia = tipo_media || (isVideo ? 'video' : 'imagen');

  // URL del botón: si hay un programa destacado va a su slug, si no usa boton_url o /programas
  const btnHref = programa_destacado?.slug
    ? `/programas/${programa_destacado.slug}`
    : (boton_url || '/programas');
  const btnText = boton_texto || 'Conocer más';

  return (
    <section className="relative w-full bg-white">
      <div className="relative w-full h-[100dvh] min-h-[500px] bg-slate-800 flex flex-col justify-between overflow-hidden">

        {/* Background Media */}
        {effectiveTipoMedia === "video" && mediaUrl ? (
          <>
            {posterUrl && (
              <Image
                src={posterUrl}
                alt=""
                aria-hidden="true"
                fetchPriority="high"
                fill
                sizes="100vw"
                className="object-cover opacity-60"
              />
            )}
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              {...(posterUrl && { poster: posterUrl })}
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            >
              <source src={mediaUrl} type="video/mp4" />
            </video>
          </>
        ) : mediaUrl ? (
          <Image
            src={mediaUrl}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            fill
            sizes="100vw"
            className="object-cover opacity-60"
          />
        ) : null}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/30" />

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-[1920px] mx-auto h-full flex flex-col items-start laptop:items-center justify-center text-left laptop:text-center px-4 tablet:px-[60px] laptop:px-[118px] pt-28 tablet:pt-40 pb-32">
          {titulo && (
            <h1 className="text-3xl sm:text-4xl tablet:text-5xl laptop:text-6xl font-bold text-white mb-6 leading-tight max-w-[1000px] laptop:max-w-[1000px] laptop:mx-auto mt-10 tablet:mt-0">
              {titulo}
            </h1>
          )}
          {subtitulo && (
            <p className="text-lg tablet:text-xl text-gray-200 mb-6 tablet:mb-10 max-w-[700px] laptop:max-w-[900px] laptop:mx-auto">
              {subtitulo}
            </p>
          )}

          {/* Botones del Hero */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4 tablet:mt-8 w-full">
            <Link
              href={btnHref}
              className="bg-primary hover:bg-primary-dark text-white w-full sm:w-[260px] h-[60px] sm:h-[70px] text-[18px] sm:text-[22px] rounded-full font-semibold transition flex items-center justify-center shadow-lg"
            >
              {btnText}
            </Link>
            <Link
              href="/contacto"
              className="border-2 border-white hover:bg-white/20 text-white w-full sm:w-[260px] h-[60px] sm:h-[70px] text-[18px] sm:text-[22px] rounded-full font-semibold transition flex items-center justify-center backdrop-blur-sm"
            >
              Contáctanos
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Stats Card */}
      {(stat_1 || stat_2 || stat_3) && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[95%] tablet:w-[90%] max-w-4xl h-auto bg-white z-20 flex flex-row items-center justify-around py-3 tablet:py-6 px-2 tablet:px-4 rounded-t-[24px] tablet:rounded-t-[56px]">
          <div
            className="absolute pointer-events-none"
            style={{
              width: "24px", height: "24px", left: "-24px", bottom: "0",
              background: "radial-gradient(circle at 0% 0%, transparent 24px, #ffffff 24.5px)",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              width: "24px", height: "24px", right: "-24px", bottom: "0",
              background: "radial-gradient(circle at 100% 0%, transparent 24px, #ffffff 24.5px)",
            }}
          />
          {stat_1 && (
            <div className="text-center flex-1">
              <p className="font-bold text-gray-900 text-xs sm:text-sm tablet:text-lg laptop:text-[20px]">{stat_1}</p>
            </div>
          )}
          {stat_1 && stat_2 && <div className="w-px h-6 laptop:h-8 bg-gray-200 shrink-0" />}
          {stat_2 && (
            <div className="text-center flex-1">
              <p className="font-bold text-gray-900 text-xs sm:text-sm tablet:text-lg laptop:text-[20px]">{stat_2}</p>
            </div>
          )}
          {stat_2 && stat_3 && <div className="w-px h-6 laptop:h-8 bg-gray-200 shrink-0" />}
          {stat_3 && (
            <div className="text-center flex-1">
              <p className="font-bold text-gray-900 text-xs sm:text-sm tablet:text-lg laptop:text-[20px]">{stat_3}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
