import Image from "next/image";
import Link from "next/link";
import { getStrapiImageUrl, formatDate, getAutorNombre } from "@/lib/strapi";
import { getArticuloUrl } from "@/lib/articleUrl";

export default function DialogandoSection({ articulos = [] }) {
  const articles = articulos.filter(Boolean);

  if (articles.length === 0) {
    return <p className="text-gray-400 text-center py-10">Próximamente publicaremos nuevos artículos.</p>;
  }

  const mainArticle = articles[0];
  const secondaryArticles = articles.slice(1, 4);
  const mainImageUrl = getStrapiImageUrl(mainArticle.imagen_portada);

  return (
    <section id="dialogando" className="w-full px-4 tablet:px-7.5 laptop:px-20 desktop:px-29.5 max-w-[1920px] mx-auto flex flex-col mb-[120px] tablet:mb-[200px]">
      <div className="flex justify-between items-center mb-6 md:mb-10">
        <h2 className="text-2xl md:text-[44px] font-black text-[#05162D] tracking-[-0.88px]">
          Dialogando
        </h2>
        <Link href="/articulando" className="text-[#043F9F] font-semibold hover:underline text-base md:text-[20px] shrink-0 ml-4">
          Ver todas →
        </Link>
      </div>

      <div className="flex flex-col laptop:flex-row gap-6">
        <Link
          href={getArticuloUrl(mainArticle)}
          className="cat-grid-main-wrap flex flex-col group cursor-pointer w-full laptop:w-[58%] desktop:w-[970px] shrink-0 relative"
          style={{ minHeight: "300px" }}
        >
          {/*
            laptop:h-[727px] cubre el rango 1200-1279px.
            xl:h-[727px] ya compilado cubre 1280px+.
          */}
          <div className="cat-grid-main-card w-full h-[260px] sm:h-[380px] md:h-[500px] xl:h-[727px] relative bg-[#05162D] rounded-[20px] md:rounded-[40px] overflow-hidden">
            {mainImageUrl ? (
              <Image
                src={mainImageUrl}
                alt={mainArticle.titulo}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition duration-700"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#0E52C6] via-[#043F9F] to-[#05162D] flex items-center justify-center">
                <span className="text-white/10 text-[200px] font-black leading-none select-none">
                  {mainArticle.titulo?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.8)] via-[rgba(0,0,0,0.2)] to-transparent" />
            <div className="relative z-10 flex flex-col justify-end p-6 md:p-[50px] h-full text-white">
              <div className="flex items-center gap-1.5 sm:gap-3 mb-2 md:mb-3 whitespace-nowrap overflow-hidden">
                {mainArticle.categoria?.nombre && (
                  <span className="text-[11px] sm:text-sm md:text-[20px] font-medium opacity-90 truncate">
                    {mainArticle.categoria.nombre}
                  </span>
                )}
                {mainArticle.categoria?.nombre && mainArticle.fecha_publicacion && (
                  <span className="text-[11px] sm:text-sm md:text-[20px] font-medium opacity-90 shrink-0">•</span>
                )}
                {mainArticle.fecha_publicacion && (
                  <span className="text-[11px] sm:text-sm md:text-[20px] font-medium opacity-90 shrink-0">
                    {formatDate(mainArticle.fecha_publicacion)}
                  </span>
                )}
              </div>
              <h3 className="cat-grid-main-title text-xl md:text-[40px] font-bold leading-tight mb-2 group-hover:text-gray-200 transition-colors tracking-tight md:tracking-[-0.96px]">
                {mainArticle.titulo}
              </h3>
            </div>
          </div>
        </Link>

        {/*
          laptop:flex-1 cubre 1200-1279px. xl:flex-1 ya compilado cubre 1280px+.
          justify-between sin prefijo aplica siempre.
        */}
        <div className="cat-grid-secondary flex flex-col gap-4 md:gap-6 w-full xl:flex-1 justify-between">
          {secondaryArticles.map((article) => {
            const imgUrl = getStrapiImageUrl(article.imagen_portada);
            const autorNombre = getAutorNombre(article.autor);
            return (
              <Link
                key={article.id}
                href={getArticuloUrl(article)}
                className="flex items-center gap-4 md:gap-[30px] group cursor-pointer"
              >
                {/*
                  laptop:w/h cubre 1200-1279px. xl:w/h ya compilado cubre 1280px+.
                */}
                <div className="cat-grid-thumb w-[120px] h-[90px] sm:w-[180px] sm:h-[130px] md:w-[260px] md:h-[180px] xl:w-[320px] xl:h-[226px] rounded-[16px] md:rounded-[30px] bg-[#05162D] overflow-hidden shrink-0 relative">
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt={article.titulo}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0E52C6] to-[#05162D] flex items-center justify-center">
                      <span className="text-white/20 text-5xl font-black select-none">
                        {article.titulo?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-1 justify-center py-1">
                  {article.categoria?.nombre && (
                    <span className="text-xs md:text-[16px] font-medium text-[#667085] mb-1 md:mb-[8px]">
                      {article.categoria.nombre}
                    </span>
                  )}
                  <h4 className="cat-grid-title font-bold text-[#05162D] text-sm md:text-[22px] xl:text-[28px] leading-tight tracking-tight md:tracking-[-0.56px] group-hover:text-[#043F9F] transition-colors mb-1 md:mb-3">
                    {article.titulo}
                  </h4>
                  {(autorNombre || article.fecha_publicacion) && (
                    <span className="text-xs md:text-[16px] text-[#667085] hidden sm:block">
                      {autorNombre && `Publicado por ${autorNombre}`}
                      {autorNombre && article.fecha_publicacion && " | "}
                      {article.fecha_publicacion && formatDate(article.fecha_publicacion)}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}