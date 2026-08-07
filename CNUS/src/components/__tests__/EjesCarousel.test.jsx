import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import EjesCarousel from "@/components/EjesCarousel";

const mockItems = [
  { nombre: "Eje 1" },
  { nombre: "Eje 2" },
  { nombre: "Eje 3" },
];

beforeEach(() => {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});

describe("EjesCarousel", () => {
  it("returns null when items is empty", () => {
    const { container } = render(<EjesCarousel items={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders item names", () => {
    render(<EjesCarousel items={mockItems} />);
    expect(screen.getAllByText("Eje 1")).toHaveLength(2);
    expect(screen.getAllByText("Eje 2")).toHaveLength(2);
    expect(screen.getAllByText("Eje 3")).toHaveLength(2);
  });

  it("renders with animation by default", () => {
    render(<EjesCarousel items={mockItems} />);
    expect(
      screen.getByLabelText("Carrusel de ejes formativos"),
    ).toBeInTheDocument();
  });

  it("renders without animation when prefers-reduced-motion is set", () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    render(<EjesCarousel items={mockItems} />);
    expect(
      screen.getByLabelText("Lista de ejes formativos"),
    ).toBeInTheDocument();
  });
});
