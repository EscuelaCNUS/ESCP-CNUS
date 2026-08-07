import ProgramasHero from "@/components/programas/ProgramasHero";
import CursosList from "@/components/programas/CursosList";
import { getProgramas, getEjesFormativos } from "@/lib/strapi";

export const metadata = {
  title: "Programas - Escuela CNUS",
  description: "Explora nuestros programas y cursos de formación sindical",
  alternates: { canonical: "/programas" },
};

export default async function ProgramasPage({ searchParams }) {
  const [programas, ejes, params] = await Promise.all([
    getProgramas(),
    getEjesFormativos(),
    searchParams,
  ]);

  // Leer ?eje= aquí vuelve la ruta dinámica, pero es lo que permite que el
  // listado se renderice en el servidor. Las llamadas a Strapi siguen
  // cacheadas, así que el coste es el render, no las consultas.
  const ejeInicial = typeof params?.eje === "string" ? params.eje : "";

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <ProgramasHero />
      <section className="w-full max-w-[1680px] mx-auto px-4 tablet:px-7.5 laptop:px-20 laptop:px-[80px] pt-[120px] tablet:pt-[200px] mb-[120px] tablet:mb-[200px]">
        <CursosList cursos={programas ?? []} ejes={ejes ?? []} ejeInicial={ejeInicial} />
      </section>
    </main>
  );
}
