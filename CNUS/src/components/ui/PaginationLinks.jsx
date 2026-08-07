import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * Paginación server-side usando <Link> — no necesita JS para funcionar.
 * Los links cambian el query param ?page=N y Next.js recarga la página en el servidor.
 */
export default function PaginationLinks({ currentPage, pageCount, basePath }) {
  if (pageCount <= 1) return null;

  const makeHref = (page) => `${basePath}?page=${page}`;

  // Mostrar máximo 5 páginas alrededor de la actual
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pageCount || Math.abs(p - currentPage) <= 2
  );

  return (
    <div className="flex items-center justify-center gap-2 laptop:gap-3">
      {/* Prev */}
      {currentPage > 1 ? (
        <Link
          href={makeHref(currentPage - 1)}
          aria-label="Página anterior"
          className="flex items-center justify-center w-10 h-10 laptop:w-12 laptop:h-12 rounded-full border border-[#E0E4EA] text-[#05162D] hover:border-[#0891B2] hover:text-[#0891B2] transition-all"
        >
          <ArrowLeft size={18} />
        </Link>
      ) : (
        <span className="flex items-center justify-center w-10 h-10 laptop:w-12 laptop:h-12 rounded-full border border-[#E0E4EA] text-[#05162D] opacity-30 cursor-not-allowed">
          <ArrowLeft size={18} />
        </span>
      )}

      {/* Page numbers */}
      {pages.map((page, idx) => {
        const prev = pages[idx - 1];
        return (
          <span key={page} className="flex items-center gap-2 laptop:gap-3">
            {/* Ellipsis */}
            {prev && page - prev > 1 && (
              <span className="text-[#98A2B3] text-sm px-1">…</span>
            )}
            <Link
              href={makeHref(page)}
              aria-label={`Página ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
              className={`flex items-center justify-center w-10 h-10 laptop:w-12 laptop:h-12 rounded-full font-semibold text-sm laptop:text-[16px] transition-all duration-200 ${
                currentPage === page
                  ? "bg-[#0891B2] text-white shadow-md shadow-cyan-200 pointer-events-none"
                  : "border border-[#E0E4EA] text-[#05162D] hover:border-[#0891B2] hover:text-[#0891B2]"
              }`}
            >
              {page}
            </Link>
          </span>
        );
      })}

      {/* Next */}
      {currentPage < pageCount ? (
        <Link
          href={makeHref(currentPage + 1)}
          aria-label="Página siguiente"
          className="flex items-center justify-center w-10 h-10 laptop:w-12 laptop:h-12 rounded-full border border-[#E0E4EA] text-[#05162D] hover:border-[#0891B2] hover:text-[#0891B2] transition-all"
        >
          <ArrowRight size={18} />
        </Link>
      ) : (
        <span className="flex items-center justify-center w-10 h-10 laptop:w-12 laptop:h-12 rounded-full border border-[#E0E4EA] text-[#05162D] opacity-30 cursor-not-allowed">
          <ArrowRight size={18} />
        </span>
      )}
    </div>
  );
}
