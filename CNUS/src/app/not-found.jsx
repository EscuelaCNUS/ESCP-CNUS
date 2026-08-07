import Link from "next/link";

export const metadata = {
  title: "P\u00e1gina no encontrada | Escuela CNUS",
  description: "La p\u00e1gina que buscas no existe o ha sido movida.",
};

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-[#05162D] mb-2">P\u00e1gina no encontrada</h1>
        <p className="text-8xl font-black text-[#0045A5] mb-4" aria-hidden="true">404</p>
        <p className="text-gray-500 mb-8">La p\u00e1gina que buscas no existe o ha sido movida.</p>
        <Link
          href="/"
          className="bg-[#0045A5] text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-800 transition inline-block"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
