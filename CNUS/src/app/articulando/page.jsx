import NavbarArticulando from "@/components/NavbarArticulando";
import ArticulandoHero from "@/components/articulando/ArticulandoHero";
import CategoryRow from "@/components/articulando/CategoryRow";
import CategoryGrid from "@/components/articulando/CategoryGrid";
import NewsletterSection from "@/components/NewsletterSection";
import { getArticuloUrl } from "@/lib/articleUrl";
import {
  getArticuloDestacado,
  getDebateActivo,
  getArticulosPorCategoria,
  getStrapiImageUrl,
} from "@/lib/strapi";

export const metadata = {
  title: "Articulando | Escuela CNUS",
  description: "Explora artículos, debates y análisis sobre pensamiento complejo, notas del presidente y más en la Escuela CNUS.",
  alternates: { canonical: "/articulando" },
};

export default async function ArticulandoPage() {
  const [
    destacadosData,
    debateData,
    notasPresidenteData,
    pensamientoComplejoData,
    columnaDirectorData,
    noticiasEventosData,
  ] = await Promise.all([
    getArticuloDestacado(),
    getDebateActivo(),
    getArticulosPorCategoria("notas-del-presidente", 4),
    getArticulosPorCategoria("pensamiento-complejo", 4),
    getArticulosPorCategoria("columna-del-director", 4),
    getArticulosPorCategoria("noticias-y-eventos", 4),
  ]);

  const articuloDestacado = Array.isArray(destacadosData) ? destacadosData[0] : null;
  const debate = Array.isArray(debateData) ? debateData[0] : null;

  const notasPresidente = Array.isArray(notasPresidenteData) ? notasPresidenteData : [];
  const mainNota = notasPresidente[0] ?? null;
  const secundariasNota = notasPresidente.slice(1);

  const columnaDirector = Array.isArray(columnaDirectorData) ? columnaDirectorData : [];
  const mainColumna = columnaDirector[0] ?? null;
  const secundariasColumna = columnaDirector.slice(1);

  const heroImageUrl = getStrapiImageUrl(articuloDestacado?.imagen_portada);

  return (
    <main className="flex min-h-screen flex-col w-full bg-white">
      <NavbarArticulando />
      <ArticulandoHero
        tag={articuloDestacado?.categoria?.nombre}
        title={articuloDestacado?.titulo}
        excerpt={articuloDestacado?.extracto}
        image={heroImageUrl}
        articleUrl={articuloDestacado ? getArticuloUrl(articuloDestacado) : null}
      />
      {/* Sin padding inferior: el banner de newsletter ya trae su propio
          margen, y sumar ambos dejaba el doble de espacio antes del pie que en
          la portada, donde ese banner cuelga directamente del main. */}
      <div className="flex flex-col pt-0 gap-[120px] tablet:gap-[200px]">
        {/* 1. Notas del presidente */}
        <CategoryGrid
          id="notas-del-presidente"
          sectionTitle="Notas del presidente"
          mainArticle={mainNota}
          secondaryArticles={secundariasNota}
          verTodasHref="/articulando/notas-del-presidente"
        />

        {/* 2. Pensamiento complejo */}
        <CategoryRow
          id="pensamiento-complejo"
          sectionTitle="Pensamiento complejo"
          categoryArticles={Array.isArray(pensamientoComplejoData) ? pensamientoComplejoData : []}
          verTodasHref="/articulando/pensamiento-complejo"
        />

        {/* 3. Columna del director */}
        <CategoryGrid
          id="columna-del-director"
          sectionTitle="Columna del director"
          mainArticle={mainColumna}
          secondaryArticles={secundariasColumna}
          verTodasHref="/articulando/columna-del-director"
        />

        {/* 4. Noticias y eventos */}
        <CategoryRow
          id="noticias-y-eventos"
          sectionTitle="Noticias y eventos"
          categoryArticles={Array.isArray(noticiasEventosData) ? noticiasEventosData : []}
          bgColor="bg-[#F2F4F7]"
          verTodasHref="/articulando/noticias-y-eventos"
        />

        {/* 5. Newsletter */}
        <NewsletterSection />
      </div>
    </main>
  );
}
