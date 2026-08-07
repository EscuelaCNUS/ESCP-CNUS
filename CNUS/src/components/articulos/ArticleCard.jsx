import Link from "next/link";
import { formatDate } from "@/lib/strapi";
import { getArticuloUrl } from "@/lib/articleUrl";

export default function ArticleCard({ article, category = "Artículo" }) {
  return (
    <Link
      href={getArticuloUrl(article)}
      className="group flex flex-col bg-white border border-[#E8ECF0] rounded-[20px] laptop:rounded-[28px] overflow-hidden hover:shadow-[0_12px_48px_rgba(5,22,45,0.10)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <div className="w-full h-1 bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex flex-col flex-1 p-5 laptop:p-7 desktop:p-8">
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="inline-block text-[11px] laptop:text-[13px] font-semibold px-3 py-1 rounded-full bg-[#06B6D4]/10 text-[#0891B2]">
            {article.categoria?.nombre || category}
          </span>
        </div>

        <h3 className="font-bold text-[#05162D] text-base laptop:text-[20px] desktop:text-[22px] leading-snug tracking-tight mb-3 line-clamp-3 group-hover:text-[#0891B2] transition-colors">
          {article.titulo}
        </h3>

        <p className="text-[#555B63] text-sm laptop:text-[15px] leading-relaxed line-clamp-3 flex-1">
          {article.extracto}
        </p>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#F0F2F5]">
          <span className="text-[#667085] text-xs laptop:text-[14px]">
            {article.fecha_publicacion ? formatDate(article.fecha_publicacion) : ""}
          </span>
          <span className="flex items-center gap-1 text-[#0891B2] font-semibold text-xs laptop:text-[14px] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Leer
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
