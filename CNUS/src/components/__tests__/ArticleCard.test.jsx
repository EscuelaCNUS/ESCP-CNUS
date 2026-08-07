import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ArticleCard from "@/components/articulos/ArticleCard";

const mockArticle = {
  id: 1,
  slug: "test-article",
  titulo: "Artículo de prueba",
  extracto: "Este es un extracto de prueba",
  fecha_publicacion: "2026-07-15T10:00:00Z",
  categoria: { nombre: "Pensamiento Complejo" },
};

describe("ArticleCard", () => {
  it("renders the article title", () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText("Artículo de prueba")).toBeInTheDocument();
  });

  it("renders the article excerpt", () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText("Este es un extracto de prueba")).toBeInTheDocument();
  });

  it("renders the category badge", () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText("Pensamiento Complejo")).toBeInTheDocument();
  });

  it("links to the correct article URL", () => {
    render(<ArticleCard article={mockArticle} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/articulando/test-article");
  });

  it("uses fallback category when none provided", () => {
    const articleNoCat = { ...mockArticle, categoria: null };
    render(<ArticleCard article={articleNoCat} category="Artículo" />);
    expect(screen.getByText("Artículo")).toBeInTheDocument();
  });
});
