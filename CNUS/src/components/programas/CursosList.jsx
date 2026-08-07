"use client";
import { useState } from "react";
import { Search, ChevronDown, ArrowLeft, ArrowRight } from "lucide-react";
import CourseCard from "./CourseCard";

const ITEMS_PER_PAGE = 9;

/**
 * `ejeInicial` lo resuelve la página en el servidor a partir de ?eje=.
 *
 * Antes se leía aquí con useSearchParams, y eso hacía que Next renderizara la
 * lista solo en el navegador: el HTML llegaba sin tarjetas, sin enlaces a los
 * cursos y sin las opciones del filtro, que es justo lo que rastrean los
 * buscadores.
 */
export default function CursosList({ cursos = [], ejes = [], ejeInicial = "" }) {
  const [selectedEje, setSelectedEje] = useState(ejeInicial);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageInput, setPageInput] = useState(1);

  const filteredCursos = cursos.filter((curso) => {
    // Se filtra por slug, no por nombre: el nombre del eje es una etiqueta que
    // el equipo puede reescribir desde Strapi, y hacerlo no debe romper el
    // filtro ni los enlaces /programas?eje=... ya compartidos.
    const matchesEje = selectedEje
      ? curso.eje?.slug === selectedEje
      : true;

    const matchesSearch = searchTerm
      ? curso.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        curso.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return matchesEje && matchesSearch;
  });

  const totalPages = Math.ceil(filteredCursos.length / ITEMS_PER_PAGE);
  const currentPage = Math.min(Math.max(1, pageInput), totalPages || 1);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleCursos = filteredCursos.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handleEjeChange = (e) => {
    setSelectedEje(e.target.value);
    setPageInput(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPageInput(1);
  };

  const handlePage = (page) => {
    setPageInput(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <div className="w-full">
      {/* Control Bar: Dropdown de Ejes + Buscador juntos al lado derecho en laptop */}
      <div className="flex flex-col sm:flex-row items-center justify-between laptop:justify-end mb-12 gap-4">
        
        {/* Dropdown de Ejes (Izquierda del Buscador) */}
        <div className="relative w-full sm:w-80 shrink-0">
          <select
            value={selectedEje}
            onChange={handleEjeChange}
            aria-label="Filtrar cursos por eje formativo"
            className="w-full bg-[#05162D] text-white font-medium appearance-none py-3.5 px-5 pr-12 rounded-full text-sm sm:text-base cursor-pointer outline-none focus:ring-2 focus:ring-primary transition-all"
          >
            <option value="">Todos los ejes formativos</option>
            {ejes.map((eje) => (
              <option key={eje.id || eje.documentId} value={eje.slug}>
                {eje.nombre}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
        </div>

        {/* Buscador (Derecha) */}
        <div className="relative w-full sm:w-80 shrink-0">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Buscar por nombre..."
            className="w-full pl-5 pr-12 py-3.5 rounded-full border border-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm sm:text-base bg-white transition-all"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>

      </div>

      {/* Grid de Cursos (4 por fila, igual que en el Home) */}
      {filteredCursos.length === 0 ? (
        <div className="bg-gray-50 rounded-3xl p-16 text-center text-gray-500 my-10">
          No se encontraron cursos que coincidan con la búsqueda.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 laptop:grid-cols-3 gap-6 laptop:gap-8 gap-y-10 laptop:gap-y-12">
          {visibleCursos.map((curso) => (
            <CourseCard
              key={curso.id}
              titulo={curso.titulo}
              descripcion={curso.descripcion}
              modalidad={curso.modalidad}
              slug={curso.slug}
              imagen={curso.imagen}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 laptop:gap-3 mt-16 mb-8">
          <button
            onClick={() => handlePage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Página anterior"
            className="flex items-center justify-center w-10 h-10 laptop:w-12 laptop:h-12 rounded-full border border-[#E0E4EA] text-[#05162D] hover:border-[#0891B2] hover:text-[#0891B2] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ArrowLeft size={18} />
          </button>

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

    </div>
  );
}
