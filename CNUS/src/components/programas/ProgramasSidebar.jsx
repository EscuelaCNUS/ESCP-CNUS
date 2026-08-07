export default function ProgramasSidebar({ ejes = [] }) {
  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <h2 className="text-xl font-bold text-[#0a1a3a] mb-6 leading-tight">
        Lista de <br /> programas
      </h2>

      {ejes.length > 0 ? (
        <ul className="space-y-3">
          {ejes.map((eje) => (
            <li key={eje.id || eje.documentId}>
              <a
                href={`/programas?eje=${eje.slug || eje.nombre}`}
                className="text-sm text-[#0a1a3a] font-medium hover:text-primary transition-colors block py-1"
              >
                {eje.nombre}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">Cargando ejes...</p>
      )}
    </aside>
  );
}
