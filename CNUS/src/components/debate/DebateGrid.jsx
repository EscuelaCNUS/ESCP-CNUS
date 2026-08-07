"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MessageCircle, Users } from "lucide-react";
import { formatDate } from "@/lib/strapi";
import CommunityCTA from "./CommunityCTA";

const ITEMS_PER_PAGE = 6;

function DebateCard({ debate, conteo }) {
  const { participantes = 0, respuestas = 0 } = conteo ?? {};
  return (
    <Link
      href={`/articulando/debate/${debate.slug}`}
      className="group flex flex-col bg-white border border-[#E8ECF0] rounded-[20px] laptop:rounded-[28px] overflow-hidden hover:shadow-[0_12px_48px_rgba(5,22,45,0.10)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Color accent top bar */}
      <div className="w-full h-1 bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5 laptop:p-7 desktop:p-8">
        {/* Meta row */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="inline-block text-[11px] laptop:text-[13px] font-semibold px-3 py-1 rounded-full bg-[#F0F2F5] text-[#667085]">
            Debate
          </span>
          <span className="text-[#A0A4A8] text-[11px] laptop:text-[13px] flex items-center gap-1">
            <MessageCircle size={12} aria-hidden="true" />
            <span>{respuestas} {respuestas === 1 ? "opinión" : "opiniones"}</span>
          </span>
          {participantes > 0 && (
            <span className="text-[#A0A4A8] text-[11px] laptop:text-[13px] flex items-center gap-1">
              <Users size={12} aria-hidden="true" />
              <span>{participantes} {participantes === 1 ? "participante" : "participantes"}</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-[#05162D] text-base laptop:text-[20px] desktop:text-[22px] leading-snug tracking-tight mb-3 line-clamp-3 group-hover:text-[#0891B2] transition-colors">
          {debate.pregunta || debate.titulo || "Debate"}
        </h3>

        {/* Space filler since no extract in debate */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#F0F2F5]">
          <span className="text-[#667085] text-xs laptop:text-[14px]">
            {debate.createdAt ? formatDate(debate.createdAt) : ""}
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

export default function DebateGrid({ debates = [], conteos = {} }) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(debates.length / ITEMS_PER_PAGE);

  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleDebates = debates.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handlePage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="w-full px-4 tablet:px-7.5 laptop:px-20 desktop:px-29.5 max-w-[1920px] mx-auto pb-[120px] tablet:pb-[200px] mt-20 laptop:mt-28">

      {/* Section header */}
      <div className="flex flex-col laptop:flex-row laptop:items-end justify-between gap-4 mb-10 laptop:mb-14">
        <div>
          <h2 className="text-3xl laptop:text-[44px] desktop:text-[52px] font-black text-[#05162D] tracking-tight leading-none">
            Debates anteriores
          </h2>
        </div>
        <span className="text-[#667085] text-sm laptop:text-[16px]">
          {debates.length} debates
        </span>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 laptop:grid-cols-3 gap-5 laptop:gap-6 desktop:gap-8 mb-12 laptop:mb-16">
        {visibleDebates.map((debate) => (
          <DebateCard
            key={debate.id || debate.documentId}
            debate={debate}
            conteo={conteos[debate.slug]}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 laptop:gap-3">
          {/* Prev */}
          <button
            onClick={() => handlePage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Página anterior"
            className="flex items-center justify-center w-10 h-10 laptop:w-12 laptop:h-12 rounded-full border border-[#E0E4EA] text-[#05162D] hover:border-[#0891B2] hover:text-[#0891B2] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePage(page)}
              aria-label={`Página ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
              className={`flex items-center justify-center w-10 h-10 laptop:w-12 laptop:h-12 rounded-full font-semibold text-sm laptop:text-[16px] transition-all duration-200 ${
                currentPage === page
                  ? "bg-[#0891B2] text-white shadow-md shadow-cyan-200"
                  : "border border-[#E0E4EA] text-[#05162D] hover:border-[#0891B2] hover:text-[#0891B2]"
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() => handlePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Página siguiente"
            className="flex items-center justify-center w-10 h-10 laptop:w-12 laptop:h-12 rounded-full border border-[#E0E4EA] text-[#05162D] hover:border-[#0891B2] hover:text-[#0891B2] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Community CTA */}
      <div className="mt-[100px]">
        <CommunityCTA />
      </div>

    </section>
  );
}
