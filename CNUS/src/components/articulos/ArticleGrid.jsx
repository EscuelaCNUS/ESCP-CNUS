import ArticleCard from "./ArticleCard";
import PaginationLinks from "@/components/ui/PaginationLinks";

export default function ArticleGrid({
  articles = [],
  currentPage = 1,
  pageCount = 1,
  total = 0,
  basePath = "",
  category = "Artículo",
  title = "Todos los artículos",
  countLabel = "artículos publicados",
}) {
  if (articles.length === 0) return <p className="text-gray-400 text-center py-10">No hay artículos publicados en esta categoría.</p>;

  return (
    <section className="w-full px-4 tablet:px-7.5 laptop:px-20 desktop:px-29.5 max-w-[1920px] mx-auto pb-[120px] tablet:pb-[200px]">
      <div className="flex flex-col laptop:flex-row laptop:items-end justify-between gap-4 mb-10 laptop:mb-14">
        <div>
          <h2 className="text-3xl laptop:text-[44px] desktop:text-[52px] font-black text-[#05162D] tracking-tight leading-none">
            {title}
          </h2>
        </div>
        <span className="text-[#667085] text-sm laptop:text-[16px]">
          {total} {countLabel}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 laptop:grid-cols-3 gap-5 laptop:gap-6 desktop:gap-8 mb-12 laptop:mb-16">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} category={category} />
        ))}
      </div>

      <PaginationLinks currentPage={currentPage} pageCount={pageCount} basePath={basePath} />
    </section>
  );
}
