import NavbarArticulando from "@/components/NavbarArticulando";
import ArticleHero from "@/components/articulos/ArticleHero";
import ArticleGrid from "@/components/articulos/ArticleGrid";
import { getArticulosPorCategoriaPaginado, getArticulosPorCategoria } from "@/lib/strapi";

export const metadata = {
  title: "Noticias y Eventos | Articulando | ESCP",
  description:
    "Últimas noticias, eventos y actividades de la Escuela Sindical del Caribe y Postgraduados (ESCP) y del movimiento sindical dominicano e internacional.",
  alternates: { canonical: "/articulando/noticias-y-eventos" },
};

const PAGE_SIZE = 6;

export default async function NoticiasPage({ searchParams }) {
  const params = await searchParams;
  const page = Math.min(10000, Math.max(1, parseInt(params?.page ?? '1', 10)));

  const [featuredData, pageData] = await Promise.all([
    getArticulosPorCategoria("noticias-y-eventos", 1),
    getArticulosPorCategoriaPaginado("noticias-y-eventos", page, PAGE_SIZE),
  ]);

  const featured = Array.isArray(featuredData) ? featuredData[0] ?? null : null;

  return (
    <main className="flex min-h-screen flex-col w-full bg-white">
      <NavbarArticulando />
      <ArticleHero featuredNote={featured} categorySlug="noticias-y-eventos" />
      <ArticleGrid
        articles={pageData.data}
        currentPage={page}
        pageCount={pageData.pageCount}
        total={pageData.total}
        basePath="/articulando/noticias-y-eventos"
        title="Todas las noticias"
        countLabel="noticias publicadas"
        category="Noticias y Eventos"
      />
    </main>
  );
}
