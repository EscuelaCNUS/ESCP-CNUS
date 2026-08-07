import Image from "next/image";
import Link from "next/link";
import { formatDate, getAutorNombre, getStrapiImageUrl } from "@/lib/strapi";
import { getArticuloUrl } from "@/lib/articleUrl";

const FALLBACK_AVATARS = {
  "p": <span className="text-white/10 text-[120px] laptop:text-[160px] font-black leading-none select-none">P</span>,
  "pen": (
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white/20 laptop:w-[120px] laptop:h-[120px] desktop:w-[140px] desktop:h-[140px]">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  "newspaper": (
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white/20 laptop:w-[120px] laptop:h-[120px] desktop:w-[140px] desktop:h-[140px]">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9h2"/>
      <path d="M18 14h-8"/>
      <path d="M15 18h-5"/>
      <path d="M10 6h8v4h-8V6Z"/>
    </svg>
  ),
  "default": (
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white/20 laptop:w-[120px] laptop:h-[120px] desktop:w-[140px] desktop:h-[140px]">
      <path d="M12 20h9"/>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  ),
};

const HERO_CONFIGS = {
  "pensamiento-complejo": {
    title: "Pensamiento",
    gradientText: "complejo",
    linkText: "Leer artículo completo",
    defaultAuthor: "Biblioteca ESCP",
    defaultCargo: "Artículos académicos",
    avatarType: "pen",
  },
  "columna-del-director": {
    title: "La voz del",
    gradientText: "director",
    linkText: "Leer columna completa",
    defaultAuthor: "Juan Carlos Hernández",
    defaultCargo: "Director — ESCP",
    avatarType: "default",
  },
  "notas-del-presidente": {
    title: "Palabras",
    gradientText: "del presidente",
    linkText: "Leer nota completa",
    defaultAuthor: "Rafael Peña Rodríguez",
    defaultCargo: "Presidente — ESCP",
    avatarType: "p",
  },
  "noticias-y-eventos": {
    title: "Actualidad",
    gradientText: "sindical",
    linkText: "Leer noticia completa",
    defaultAuthor: "Actualidad Sindical",
    defaultCargo: "ESCP — Noticias",
    avatarType: "newspaper",
  },
};

export default function ArticleHero({ featuredNote = null, categorySlug = "articulos" }) {
  const config = HERO_CONFIGS[categorySlug] || HERO_CONFIGS["pensamiento-complejo"];
  const autorNombre = getAutorNombre(featuredNote?.autor) || config.defaultAuthor;
  const avatarUrl = getStrapiImageUrl(featuredNote?.autor?.avatar);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#05162D] via-[#1A2A3A] to-[#2D4A5E] mb-16 laptop:mb-32 desktop:mb-50">
      <div className="w-full h-1.5 bg-gradient-to-r from-[#06B6D4] via-[#22D3EE] to-[#06B6D4]" />

      <div className="relative w-full max-w-[1920px] mx-auto px-4 tablet:px-7.5 laptop:px-20 desktop:px-29.5 mt-22.5 tablet:mt-29">
        <div className="flex flex-col laptop:flex-row items-center gap-10 laptop:gap-16 desktop:gap-24 py-14 laptop:py-20 desktop:py-28">
          <div className="flex flex-col flex-1 text-white order-2 laptop:order-1">
            <h1 className="text-4xl laptop:text-[56px] desktop:text-[72px] font-black leading-none tracking-[-1.5px] desktop:tracking-[-2px] mb-6 laptop:mb-8">
              {config.title} <br className="hidden laptop:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] to-[#67E8F9]">
                {config.gradientText}
              </span>
            </h1>

            {featuredNote ? (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[24px] p-6 laptop:p-8 desktop:p-10 hover:bg-white/10 transition-all duration-300 group">
                <div className="flex items-center gap-1.5 sm:gap-3 mb-4 whitespace-nowrap overflow-hidden">
                  <span className="text-[11px] sm:text-xs laptop:text-[14px] font-semibold text-[#22D3EE] uppercase tracking-wider truncate">
                    {featuredNote.categoria?.nombre || config.gradientText}
                  </span>
                  <span className="text-white/30 shrink-0">•</span>
                  <span className="text-[11px] sm:text-xs laptop:text-[14px] text-white/50 shrink-0">
                    {featuredNote.fecha_publicacion ? formatDate(featuredNote.fecha_publicacion) : ""}
                  </span>
                </div>
                <h2 className="text-xl laptop:text-[28px] desktop:text-[32px] font-bold leading-tight tracking-tight text-white mb-3 laptop:mb-4 group-hover:text-[#22D3EE] transition-colors line-clamp-2">
                  {featuredNote.titulo}
                </h2>
                <p className="text-white/60 text-sm laptop:text-[17px] leading-relaxed mb-6 line-clamp-3">
                  {featuredNote.extracto}
                </p>
                <Link
                  href={getArticuloUrl(featuredNote)}
                  className="inline-flex items-center gap-2 text-[#22D3EE] font-semibold text-sm laptop:text-[16px] hover:gap-4 transition-all duration-200"
                >
                  {config.linkText}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[24px] p-6 laptop:p-8 desktop:p-10">
                <p className="text-white/70 text-base laptop:text-lg font-light">
                  Próximamente publicaremos nuevos contenidos en esta sección.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center shrink-0 order-1 laptop:order-2">
            <div className="relative w-[200px] h-[200px] laptop:w-[270px] laptop:h-[270px] desktop:w-[340px] desktop:h-[340px] rounded-full overflow-hidden border-4 border-[#22D3EE] shadow-[0_0_60px_rgba(6,182,212,0.3)] bg-gradient-to-br from-[#06B6D4] via-[#0891B2] to-[#0E7490] flex items-center justify-center shrink-0">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={autorNombre} fill className="object-cover" />
              ) : (
                FALLBACK_AVATARS[config.avatarType]
              )}
            </div>

            <div className="mt-5 flex flex-col items-center text-center">
              <span className="text-white font-bold text-lg laptop:text-[22px] desktop:text-[26px] tracking-tight">
                {autorNombre}
              </span>
              <span className="text-[#22D3EE] font-medium text-sm laptop:text-[16px] desktop:text-[18px] mt-1">
                {featuredNote?.autor?.cargo || config.defaultCargo}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
