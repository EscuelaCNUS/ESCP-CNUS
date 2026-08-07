import Image from "next/image";
import Link from "next/link";
import { getStrapiImageUrl } from "@/lib/strapi";

export default function CourseCard({ titulo, descripcion, modalidad, slug, imagen }) {
  const imagenUrl = getStrapiImageUrl(imagen);
  const href = slug ? `/programas/${slug}` : "#";

  return (
    <div className="w-full h-[604px] bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col border border-transparent hover:border-primary transition-all duration-300 cursor-pointer group">
      {/* Imagen del curso */}
      <div className="w-full h-1/2 mx-auto bg-gray-200 rounded-2xl mb-4 shrink-0 overflow-hidden relative">
        {imagenUrl && (
          <Image
            src={imagenUrl}
            alt={titulo || "Curso"}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 text-left min-h-0">
        {modalidad && (
          <span className="block text-xs font-semibold text-primary uppercase tracking-wide mb-2 shrink-0">
            {modalidad}
          </span>
        )}
        <h3 className="font-bold text-[20px] sm:text-[22px] laptop:text-[24px] text-[#05162D] mb-3 leading-snug group-hover:text-primary transition-colors shrink-0 line-clamp-2">
          {titulo}
        </h3>
        {descripcion && (
          <p className="text-[#445163] text-[14px] sm:text-[15px] mb-4 line-clamp-2 shrink-0">
            {descripcion}
          </p>
        )}
        <Link
          href={href}
          className="w-full h-[48px] laptop:h-[50px] bg-primary hover:bg-primary-dark text-white font-medium text-[14px] laptop:text-[15px] rounded-full transition flex items-center justify-center text-center shrink-0 mt-auto"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
}
