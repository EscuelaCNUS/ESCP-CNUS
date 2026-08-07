import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PaginationLinks from "@/components/ui/PaginationLinks";

describe("PaginationLinks", () => {
  it("renders nothing when pageCount is 1", () => {
    const { container } = render(<PaginationLinks currentPage={1} pageCount={1} basePath="/test" />);
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when pageCount is 0", () => {
    const { container } = render(<PaginationLinks currentPage={1} pageCount={0} basePath="/test" />);
    expect(container.innerHTML).toBe("");
  });

  it("renders page numbers", () => {
    render(<PaginationLinks currentPage={1} pageCount={3} basePath="/test" />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders next button", () => {
    render(<PaginationLinks currentPage={1} pageCount={3} basePath="/test" />);
    expect(screen.getByLabelText("Página siguiente")).toBeInTheDocument();
  });

  it("does not render prev button on first page", () => {
    render(<PaginationLinks currentPage={1} pageCount={3} basePath="/test" />);
    expect(screen.queryByLabelText("Página anterior")).not.toBeInTheDocument();
  });

  it("renders prev button when not on first page", () => {
    render(<PaginationLinks currentPage={2} pageCount={3} basePath="/test" />);
    expect(screen.getByLabelText("Página anterior")).toBeInTheDocument();
  });

  it("does not render next button on last page", () => {
    render(<PaginationLinks currentPage={3} pageCount={3} basePath="/test" />);
    expect(screen.queryByLabelText("Página siguiente")).not.toBeInTheDocument();
  });

  it("highlights current page with aria-current", () => {
    render(<PaginationLinks currentPage={2} pageCount={5} basePath="/test" />);
    const current = screen.getByText("2");
    expect(current.closest("a")).toHaveAttribute("aria-current", "page");
  });

  it("generates correct hrefs", () => {
    render(<PaginationLinks currentPage={2} pageCount={3} basePath="/articulando" />);
    const page1 = screen.getByText("1");
    expect(page1.closest("a")).toHaveAttribute("href", "/articulando?page=1");
  });

  it("shows ellipsis for large page counts", () => {
    render(<PaginationLinks currentPage={5} pageCount={20} basePath="/test" />);
    const ellipsis = screen.getAllByText("…");
    expect(ellipsis.length).toBeGreaterThan(0);
  });
});