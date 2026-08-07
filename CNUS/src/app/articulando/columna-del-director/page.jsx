import NavbarArticulando from "@/components/NavbarArticulando";
import ArticleHero from "@/components/articulos/ArticleHero";
import ArticleGrid from "@/components/articulos/ArticleGrid";
import { getArticulosPorCategoriaPaginado, getArticulosPorCategoria } from "@/lib/strapi";

export const metadata = {
  title: "La Columna del Director | Articulando | ESCP",
  description:
    "Artículos, reflexiones y posicionamientos personales del director de la Escuela Sindical del Caribe y Postgraduados (ESCP).",
  alternates: { canonical: "/articulando/columna-del-director" },
};

const PAGE_SIZE = 6;

export default async function ColumnaDirectorPage({ searchParams }) {
  const params = await searchParams;
  const page = Math.min(10000, Math.max(1, parseInt(params?.page ?? '1', 10)));

  const [featuredData, pageData] = await Promise.all([
    getArticulosPorCategoria("columna-del-director", 1),
    getArticulosPorCategoriaPaginado("columna-del-director", page, PAGE_SIZE),
  ]);

  const featured = Array.isArray(featuredData) ? featuredData[0] ?? null : null;

  return (
    <main className="flex min-h-screen flex-col w-full bg-white">
      <NavbarArticulando />
      <ArticleHero featuredNote={featured} categorySlug="columna-del-director" />
      <ArticleGrid
        articles={pageData.data}
        currentPage={page}
        pageCount={pageData.pageCount}
        total={pageData.total}
        basePath="/articulando/columna-del-director"
        title="Todas las columnas"
        countLabel="columnas publicadas"
        category="Columna del Director"
      />
    </main>
  );
}
