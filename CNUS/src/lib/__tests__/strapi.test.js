import { describe, it, expect } from "vitest";

const STRAPI_URL = "http://localhost:1337";

function getStrapiImageUrl(imageData) {
  if (!imageData) return null;
  const url = imageData.url || imageData?.attributes?.url;
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${STRAPI_URL}${url}`;
}

function formatDate(dateString) {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString("es-DO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function getAutorNombre(autor) {
  if (!autor) return null;
  const nombre = autor.nombre || autor?.attributes?.nombre;
  const apellido = autor.apellido || autor?.attributes?.apellido;
  if (!nombre) return null;
  return [nombre, apellido].filter(Boolean).join(" ");
}

describe("getStrapiImageUrl", () => {
  it("returns null for null input", () => {
    expect(getStrapiImageUrl(null)).toBeNull();
  });

  it("returns null for undefined input", () => {
    expect(getStrapiImageUrl(undefined)).toBeNull();
  });

  it("builds full URL from relative path", () => {
    const result = getStrapiImageUrl({ url: "/uploads/image.jpg" });
    expect(result).toBe("http://localhost:1337/uploads/image.jpg");
  });

  it("returns absolute URL as-is", () => {
    const result = getStrapiImageUrl({ url: "https://res.cloudinary.com/image.jpg" });
    expect(result).toBe("https://res.cloudinary.com/image.jpg");
  });

  it("handles Strapi v4 attributes format", () => {
    const result = getStrapiImageUrl({ attributes: { url: "/uploads/photo.png" } });
    expect(result).toBe("http://localhost:1337/uploads/photo.png");
  });
});

describe("formatDate", () => {
  it("returns empty string for null", () => {
    expect(formatDate(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(formatDate(undefined)).toBe("");
  });

  it("formats a valid date string", () => {
    const result = formatDate("2026-07-15T10:00:00Z");
    expect(result).toContain("julio");
    expect(result).toContain("2026");
  });
});

describe("getAutorNombre", () => {
  it("returns null for null autor", () => {
    expect(getAutorNombre(null)).toBeNull();
  });

  it("combines nombre and apellido", () => {
    const result = getAutorNombre({ nombre: "Juan", apellido: "Pérez" });
    expect(result).toBe("Juan Pérez");
  });

  it("returns just nombre if no apellido", () => {
    const result = getAutorNombre({ nombre: "Carlos" });
    expect(result).toBe("Carlos");
  });

  it("handles Strapi v4 attributes format", () => {
    const result = getAutorNombre({ attributes: { nombre: "Ana", apellido: "López" } });
    expect(result).toBe("Ana López");
  });
});
