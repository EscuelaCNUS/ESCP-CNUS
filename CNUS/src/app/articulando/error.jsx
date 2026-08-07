"use client";
import { useEffect } from "react";

export default function ArticulandoError({ error, reset }) {
  useEffect(() => {
    console.error("[ErrorBoundary Articulando]", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[50vh] bg-white px-4" role="alert">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#05162D] mb-2">Error al cargar</h2>
        <p className="text-gray-500 mb-6">No se pudieron cargar los art\u00edculos. Intenta de nuevo.</p>
        <button type="button" onClick={reset} className="bg-[#0045A5] text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-800 transition">
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
