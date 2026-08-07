"use client";
import { useState } from "react";
import Image from "next/image";

const TABS = [
  { id: "curso",  label: "Sobre el curso" },
  { id: "autor",  label: "Autor" },
];

export default function ProgramaDetailTabs({
  descripcion,
  objetivos,
  habilidades,
  instructor,
  instructorNombre,
  avatarUrl,
}) {
  const [activeTab, setActiveTab] = useState("curso");

  // Sin habilidades cargadas no se muestra la sección. Antes había una lista
  // de respaldo escrita a mano, idéntica en todos los cursos.
  const habilidadesRender = Array.isArray(habilidades) ? habilidades : [];

  return (
    <div className="w-full">
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-gray-200 mb-8" role="tablist" aria-label="Secciones del programa">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-colors -mb-px border-b-2 ${
              activeTab === tab.id
                ? "border-[#0045A5] text-[#0045A5] bg-blue-50/60"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Sobre el curso ──────────────────────── */}
      <div
        id="tabpanel-curso"
        role="tabpanel"
        aria-labelledby="tab-curso"
        hidden={activeTab !== "curso"}
      >
        {activeTab === "curso" && (
          <div className="flex flex-col gap-8">
            {/* Descripción */}
            {descripcion ? (
              <p className="text-[#05162D] text-[16px] leading-[1.8] tracking-[-0.01em] font-light whitespace-pre-line">
                {descripcion}
              </p>
            ) : (
              <p className="text-gray-400 italic text-sm">
                Este programa aún no tiene descripción disponible.
              </p>
            )}

            {/* Objetivos */}
            {objetivos && (
              <div>
                <h3 className="text-lg font-bold text-[#05162D] mb-3">
                  Objetivos del programa
                </h3>
                <p className="text-[#05162D] text-[15px] leading-[1.8] font-light whitespace-pre-line">
                  {objetivos}
                </p>
              </div>
            )}

            {/* Habilidades */}
            {habilidadesRender.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-[#05162D] mb-4">
                  Habilidades que dominarás
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2">
                  {habilidadesRender.map((habilidad, i) => (
                    <div key={i} className="flex items-center gap-2 py-1">
                      <svg
                        className="w-4 h-4 text-[#0045A5] shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[#05162D] text-sm leading-snug">{habilidad}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Tab: Autor ───────────────────────────────── */}
      <div
        id="tabpanel-autor"
        role="tabpanel"
        aria-labelledby="tab-autor"
        hidden={activeTab !== "autor"}
      >
        {activeTab === "autor" && (
          <div>
            {instructor ? (
              <div className="flex flex-col sm:flex-row gap-6 items-start bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">
                {/* Avatar */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#D1D9E6] shrink-0 overflow-hidden relative">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={instructorNombre}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#0045A5]">
                      <span className="text-white text-2xl font-bold">
                        {instructorNombre?.charAt(0)?.toUpperCase() ?? "?"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#05162D] mb-1">
                    {instructorNombre}
                  </h3>
                  {instructor.cargo && (
                    <p className="text-[#0045A5] text-sm font-medium mb-4">
                      {instructor.cargo}
                    </p>
                  )}
                  {instructor.biografia && (
                    <p className="text-gray-600 text-[15px] leading-relaxed">
                      {instructor.biografia}
                    </p>
                  )}
                  {!instructor.biografia && (
                    <p className="text-gray-400 italic text-sm">
                      Sin biografía disponible.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-400 italic text-sm">
                No hay información del instructor disponible.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
