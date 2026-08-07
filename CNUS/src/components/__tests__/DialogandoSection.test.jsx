import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import DialogandoSection from "@/components/DialogandoSection";

vi.mock("next/image", () => ({
  default: (props) => {
    const { fill, ...rest } = props;
    // Doble de prueba de next/image: el alt llega en `rest`, pero eslint no
    // puede verlo a través del spread.
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...rest} data-fill={fill ? "true" : undefined} />;
  },
}));

vi.mock("@/lib/strapi", () => ({
  getStrapiImageUrl: vi.fn((data) => data?.url || null),
  formatDate: vi.fn(() => "15 de julio de 2026"),
  getAutorNombre: vi.fn(() => "Autor de prueba"),
}));

const mockArticle = (id, overrides = {}) => ({
  id,
  slug: `articulo-${id}`,
  titulo: `Artículo ${id}`,
  extracto: `Extracto del artículo ${id}`,
  fecha_publicacion: "2026-07-15T10:00:00Z",
  imagen_portada: { url: `/uploads/img-${id}.jpg` },
  categoria: { nombre: "Pensamiento Complejo" },
  autor: { nombre: "Autor", apellido: "Prueba" },
  ...overrides,
});

const mockArticles = [
  mockArticle(1, { titulo: "Artículo Principal" }),
  mockArticle(2),
  mockArticle(3),
  mockArticle(4),
  mockArticle(5),
];

describe("DialogandoSection", () => {
  it('renders "Próximamente" message when articulos is empty', () => {
    render(<DialogandoSection articulos={[]} />);
    expect(
      screen.getByText("Próximamente publicaremos nuevos artículos."),
    ).toBeInTheDocument();
  });

  it("renders main article as the first article", () => {
    render(<DialogandoSection articulos={mockArticles} />);
    expect(screen.getByText("Artículo Principal")).toBeInTheDocument();
  });

  it("renders up to 3 secondary articles", () => {
    render(<DialogandoSection articulos={mockArticles} />);
    expect(screen.getByText("Artículo 2")).toBeInTheDocument();
    expect(screen.getByText("Artículo 3")).toBeInTheDocument();
    expect(screen.getByText("Artículo 4")).toBeInTheDocument();
  });

  it("filters out null articles and renders the rest", () => {
    render(
      <DialogandoSection
        articulos={[null, mockArticle(2), null, mockArticle(4)]}
      />,
    );
    expect(screen.getByText("Artículo 2")).toBeInTheDocument();
    expect(screen.getByText("Artículo 4")).toBeInTheDocument();
    const mainLink = screen.getByRole("link", { name: /Artículo 2/ });
    expect(mainLink).toHaveAttribute("href", "/articulando/articulo-2");
  });

  it("renders at most 3 secondary articles even when more are provided", () => {
    const manyArticles = Array.from({ length: 10 }, (_, i) =>
      mockArticle(i + 1),
    );
    render(<DialogandoSection articulos={manyArticles} />);
    expect(screen.getByText("Artículo 2")).toBeInTheDocument();
    expect(screen.getByText("Artículo 3")).toBeInTheDocument();
    expect(screen.getByText("Artículo 4")).toBeInTheDocument();
    expect(screen.queryByText("Artículo 6")).not.toBeInTheDocument();
  });

  it("main article links to correct slug", () => {
    render(<DialogandoSection articulos={mockArticles} />);
    const mainLink = screen.getByRole("link", { name: /Artículo Principal/ });
    expect(mainLink).toHaveAttribute("href", "/articulando/articulo-1");
  });

  it('renders "Ver todas" link with href to /articulando', () => {
    render(<DialogandoSection articulos={mockArticles} />);
    const verTodas = screen.getByText("Ver todas →");
    expect(verTodas.closest("a")).toHaveAttribute("href", "/articulando");
  });
});
