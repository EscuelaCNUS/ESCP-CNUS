import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HeroSection from "@/components/HeroSection";

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
}));

const baseConfig = {
  titulo: "Título de prueba",
  subtitulo: "Subtítulo de prueba",
  boton_texto: "Botón de prueba",
};

describe("HeroSection", () => {
  it("returns null when heroConfig is null", () => {
    const { container } = render(<HeroSection heroConfig={null} />);
    expect(container.innerHTML).toBe("");
  });

  it("returns null when heroConfig is undefined", () => {
    const { container } = render(<HeroSection />);
    expect(container.innerHTML).toBe("");
  });

  it("renders video element when tipo_media is video", () => {
    const config = {
      ...baseConfig,
      tipo_media: "video",
      archivo_media: { url: "/uploads/test-video.mp4", mime: "video/mp4" },
    };
    const { container } = render(<HeroSection heroConfig={config} />);
    expect(container.querySelector("video")).toBeInTheDocument();
    expect(container.querySelector("source")).toHaveAttribute(
      "src",
      "/uploads/test-video.mp4",
    );
  });

  it("renders image when tipo_media is imagen", () => {
    const config = {
      ...baseConfig,
      tipo_media: "imagen",
      archivo_media: { url: "/uploads/test-image.jpg" },
    };
    const { container } = render(<HeroSection heroConfig={config} />);
    expect(container.querySelector("img")).toBeInTheDocument();
  });

  it("renders title and subtitle from heroConfig", () => {
    const config = {
      ...baseConfig,
      tipo_media: "imagen",
      archivo_media: { url: "/uploads/test-image.jpg" },
    };
    render(<HeroSection heroConfig={config} />);
    expect(screen.getByText("Título de prueba")).toBeInTheDocument();
    expect(screen.getByText("Subtítulo de prueba")).toBeInTheDocument();
  });

  it("button links to programa_destacado slug when provided", () => {
    const config = {
      ...baseConfig,
      tipo_media: "imagen",
      archivo_media: { url: "/uploads/test-image.jpg" },
      programa_destacado: { slug: "curso-liderazgo" },
    };
    render(<HeroSection heroConfig={config} />);
    const links = screen.getAllByRole("link");
    const btnLink = links.find((l) => l.textContent === "Botón de prueba");
    expect(btnLink).toHaveAttribute("href", "/programas/curso-liderazgo");
  });

  it("button links to boton_url when no programa_destacado", () => {
    const config = {
      ...baseConfig,
      tipo_media: "imagen",
      archivo_media: { url: "/uploads/test-image.jpg" },
      programa_destacado: null,
      boton_url: "/ruta-personalizada",
    };
    render(<HeroSection heroConfig={config} />);
    const links = screen.getAllByRole("link");
    const btnLink = links.find((l) => l.textContent === "Botón de prueba");
    expect(btnLink).toHaveAttribute("href", "/ruta-personalizada");
  });

  it("button defaults to /programas when no links provided", () => {
    const config = {
      titulo: "Título de prueba",
      subtitulo: "Subtítulo de prueba",
      tipo_media: "imagen",
      archivo_media: { url: "/uploads/test-image.jpg" },
    };
    render(<HeroSection heroConfig={config} />);
    const links = screen.getAllByRole("link");
    const btnLink = links.find((l) => l.textContent === "Conocer más");
    expect(btnLink).toHaveAttribute("href", "/programas");
  });
});
