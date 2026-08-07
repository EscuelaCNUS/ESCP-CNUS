import NavbarArticulando from "@/components/NavbarArticulando";
import ArticleHero from "@/components/articulos/ArticleHero";
import ArticleGrid from "@/components/articulos/ArticleGrid";
import { getArticulosPorCategoriaPaginado, getArticulosPorCategoria } from "@/lib/strapi";

export const metadata = {
  title: "Pensamiento Complejo | Articulando | ESCP",
  description:
    "Artículos de opinión, análisis y reflexión elaborados por la comunidad académica y líderes sindicales sobre los temas que definen la agenda sociopolítica del país.",
  alternates: { canonical: "/articulando/pensamiento-complejo" },
};

const PAGE_SIZE = 6;

export default async function ArticulosPage({ searchParams }) {
  const params = await searchParams;
  const page = Math.min(10000, Math.max(1, parseInt(params?.page ?? '1', 10)));

  const [featuredData, pageData] = await Promise.all([
    getArticulosPorCategoria("pensamiento-complejo", 1),
    getArticulosPorCategoriaPaginado("pensamiento-complejo", page, PAGE_SIZE),
  ]);

  const featured = Array.isArray(featuredData) ? featuredData[0] ?? null : null;

  return (
    <main className="flex min-h-screen flex-col w-full bg-white">
      <NavbarArticulando />
      <ArticleHero featuredNote={featured} categorySlug="pensamiento-complejo" />
      <ArticleGrid
        articles={pageData.data}
        currentPage={page}
        pageCount={pageData.pageCount}
        total={pageData.total}
        basePath="/articulando/pensamiento-complejo"
        title="Todos los artículos"
        countLabel="artículos publicados"
        category="Pensamiento Complejo"
      />
    </main>
  );
}
