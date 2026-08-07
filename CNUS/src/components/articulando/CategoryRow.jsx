import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getStrapiImageUrl, formatDate, getAutorNombre } from "@/lib/strapi";
import { getArticuloUrl } from "@/lib/articleUrl";

export default function CategoryRow({ id, sectionTitle, categoryArticles = [], bgColor = "bg-[#EFF3F4]", verTodasHref = "/articulando" }) {
  if (categoryArticles.length === 0) return null;

  return (
    <section id={id} className={`w-full h-auto flex flex-col py-10 md:py-[78px] ${bgColor}`}>
      <div className="w-full px-4 tablet:px-7.5 laptop:px-20 desktop:px-29.5 max-w-[1920px] mx-auto">

        {/* Título */}
        <div className="flex justify-between items-center mb-6 md:mb-10">
          <h2 className="text-2xl md:text-[34px] desktop:text-[44px] font-black text-[#05162D] tracking-[-0.88px]">
            {sectionTitle}
          </h2>
          <Link href={verTodasHref} className="text-[#0E52C6] text-sm md:text-[20px] font-medium flex items-center gap-1 md:gap-2 hover:underline shrink-0 ml-4">
            Ver todo <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categoryArticles.slice(0, 4).map((article) => {
            const imgUrl = getStrapiImageUrl(article.imagen_portada);
            const autorNombre = getAutorNombre(article.autor);
            return (
              <Link
                key={article.id}
                href={getArticuloUrl(article)}
                className="flex flex-col group cursor-pointer"
              >
                <div className="w-full aspect-[4/3] md:h-[220px] laptop:h-[250px] desktop:h-[290px] rounded-[16px] md:rounded-[30px] overflow-hidden relative mb-3 md:mb-[16px] bg-gray-200">
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt={article.titulo}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0E52C6] via-[#043F9F] to-[#05162D] flex items-center justify-center">
                      <span className="text-white/20 text-[80px] font-black leading-none select-none">
                        {article.titulo?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-grow">
                  {article.categoria?.nombre && (
                    <span className="text-xs tablet:text-[16px] laptop:text-[13px] desktop:text-[16px] font-medium text-[#667085] mb-1 md:mb-[8px]">
                      {article.categoria.nombre}
                    </span>
                  )}
                  <h4 className="font-bold text-[#05162D] text-sm tablet:text-[18px] desktop:text-[28px] tracking-tight md:tracking-[-0.64px] leading-tight mb-2 md:mb-3 group-hover:text-[#043F9F] transition-colors">
                    {article.titulo}
                  </h4>
                  {(autorNombre || article.fecha_publicacion) && (
                    <span className="text-xs tablet:text-[13px] laptop:text-[13px] desktop:text-[16px] text-[#667085] hidden sm:block">
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
