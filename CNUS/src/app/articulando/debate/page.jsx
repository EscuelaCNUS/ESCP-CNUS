import NavbarArticulando from "@/components/NavbarArticulando";
import DebateHero from "@/components/debate/DebateHero";
import DebateGrid from "@/components/debate/DebateGrid";
import { getDebates, getDebateActivo } from "@/lib/strapi";
import { getComentarios, getConteoComentarios } from "@/lib/supabase";

export const metadata = {
  title: "Diálogo, Debate y Opinión | Articulando | ESCP",
  description:
    "Participa en los debates sobre los temas más importantes para el movimiento sindical dominicano. Opina, comparte y construye conocimiento colectivo.",
  alternates: { canonical: "/articulando/debate" },
};

export default async function DebatePage() {
  const [debatesData, activeDebateData] = await Promise.all([
    getDebates(),
    getDebateActivo()
  ]);
  
  const activeDebate = Array.isArray(activeDebateData) ? activeDebateData[0] : null;
  const allDebates = Array.isArray(debatesData) ? debatesData : [];
  // Excluir el debate activo actual de los debates anteriores
  const debatesAnteriores = activeDebate
    ? allDebates.filter((d) => (d.id && d.id !== activeDebate.id) || (d.slug && d.slug !== activeDebate.slug))
    : allDebates;
  // Los comentarios del debate destacado, y de una sola consulta las cifras de
  // los anteriores: la rejilla mostraba un número escrito a mano en Strapi que
  // no se actualizaba nunca.
  const [comentarios, conteos] = await Promise.all([
    activeDebate?.slug ? getComentarios(activeDebate.slug) : [],
    getConteoComentarios(debatesAnteriores.map((d) => d.slug)),
  ]);

  return (
    <main className="flex min-h-screen flex-col w-full bg-[#F2F4F7]">
      <NavbarArticulando />
      <DebateHero activeDebate={activeDebate} comentarios={comentarios ?? []} />
      <DebateGrid debates={debatesAnteriores} conteos={conteos ?? {}} />
    </main>
  );
}
