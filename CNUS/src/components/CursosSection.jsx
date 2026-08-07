import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CourseCard from "@/components/programas/CourseCard";

export default function CursosSection({ cursos = [] }) {
  if (cursos.length === 0) return <p className="text-gray-400 text-center py-10">Próximamente publicaremos nuevos programas.</p>;

  return (
    <section className="w-full h-auto min-h-[902px] laptop:min-h-0 bg-[#f8f9fa] py-12 tablet:py-20 mb-[120px] tablet:mb-[200px]">
      <div className="max-w-[1728px] mx-auto px-4 tablet:px-7.5 laptop:px-[80px] desktop:px-6">
        {/* Header */}
        <div className="flex flex-row items-center justify-between mb-12">
          <h2 className="text-2xl md:text-[44px] font-black text-gray-900 tracking-[-0.88px]">Cursos</h2>
          <Link
            href="/programas"
            className="text-primary font-medium flex items-center gap-2 hover:underline shrink-0 ml-4 text-base md:text-[20px]"
          >
            Ver todos <ArrowRight size={18} />
          </Link>
        </div>

        {/* Courses Grid: USA EL MISMO DISEÑO DE CARDS QUE EN PROGRAMAS */}
        <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 gap-6">
          {cursos.map((curso, index) => (
            <div
              key={curso.id}
              className={`w-full ${index === 3 ? "laptop:hidden desktop:flex" : ""}`}
            >
              <CourseCard
                titulo={curso.titulo}
                descripcion={curso.descripcion}
                modalidad={curso.modalidad}
                slug={curso.slug}
                imagen={curso.imagen}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
