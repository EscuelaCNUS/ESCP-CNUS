/**
 * Pruebas de las rutas de API.
 *
 * Importan los handlers reales y simulan solo sus dependencias externas
 * (Supabase, Resend, la caché de Next y el limitador). Lo que se verifica es la
 * capa que protege la base de datos: validación de entrada, límites de
 * longitud, códigos de estado y qué llega finalmente a la capa de datos.
 *
 * Next excluye del enrutado las carpetas que empiezan por guion bajo, así que
 * `__tests__` no se publica como ruta.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Las rutas leen estas variables al cargarse y abortan pronto si faltan, así
// que se definen antes de cualquier import dinámico de un handler.
process.env.RESEND_API_KEY = "re_test";
process.env.CONTACT_EMAIL = "destino@ejemplo.com";
process.env.REVALIDATE_SECRET = "secreto-de-prueba";

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true })),
}));

vi.mock("@/lib/supabase", () => ({
  insertComentario: vi.fn(async (d) => ({ id: 1, ...d })),
  postContacto: vi.fn(async () => true),
  postSuscriptor: vi.fn(async () => true),
  adjustLikes: vi.fn(async (id, delta) => ({ id, likes: delta > 0 ? 1 : 0 })),
}));

const enviarResend = vi.fn(async () => ({ error: null }));
const crearContacto = vi.fn(async () => ({ error: null }));
vi.mock("resend", () => ({
  Resend: class {
    constructor() {
      this.emails = { send: enviarResend };
      this.contacts = { create: crearContacto };
    }
  },
}));

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
}));

import { checkRateLimit } from "@/lib/rate-limit";
import { insertComentario, postContacto, postSuscriptor, adjustLikes } from "@/lib/supabase";

function peticion(cuerpo, headers = {}) {
  return new Request("http://localhost/api/x", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: typeof cuerpo === "string" ? cuerpo : JSON.stringify(cuerpo),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  checkRateLimit.mockResolvedValue({ allowed: true });
});

// ─── /api/comentarios ─────────────────────────────────────────────────────────

describe("POST /api/comentarios", () => {
  const cargar = () => import("../comentarios/route.js");
  const valido = {
    articulo_slug: "mi-articulo",
    nombre: "Ana",
    apellido: "García",
    texto: "Un comentario.",
  };

  it("publica un comentario válido", async () => {
    const { POST } = await cargar();
    const res = await POST(peticion(valido));
    expect(res.status).toBe(201);
    expect((await res.json()).comment).toBeTruthy();
  });

  it("devuelve 429 cuando el limitador bloquea", async () => {
    checkRateLimit.mockResolvedValue({ allowed: false, retryAfter: 42 });
    const { POST } = await cargar();
    const res = await POST(peticion(valido));
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("42");
    expect(insertComentario).not.toHaveBeenCalled();
  });

  it("rechaza un cuerpo que no es JSON", async () => {
    const { POST } = await cargar();
    expect((await POST(peticion("{roto"))).status).toBe(400);
  });

  it("rechaza slugs con caracteres de ruta o consulta", async () => {
    const { POST } = await cargar();
    for (const slug of ["../etc/passwd", "slug&select=*", "con espacio", ""]) {
      const res = await POST(peticion({ ...valido, articulo_slug: slug }));
      expect(res.status, `slug: ${slug}`).toBe(400);
    }
    expect(insertComentario).not.toHaveBeenCalled();
  });

  it("exige nombre y texto", async () => {
    const { POST } = await cargar();
    expect((await POST(peticion({ ...valido, nombre: "  " }))).status).toBe(400);
    expect((await POST(peticion({ ...valido, texto: "" }))).status).toBe(400);
  });

  it("corta por longitud: 100 en nombre, 500 en texto", async () => {
    const { POST } = await cargar();
    expect((await POST(peticion({ ...valido, nombre: "A".repeat(101) }))).status).toBe(400);
    expect((await POST(peticion({ ...valido, apellido: "A".repeat(101) }))).status).toBe(400);
    expect((await POST(peticion({ ...valido, texto: "A".repeat(501) }))).status).toBe(400);
  });

  it("rechaza un id de comentario padre que no sea entero positivo", async () => {
    const { POST } = await cargar();
    for (const id of [0, -1, 1.5, "abc"]) {
      const res = await POST(peticion({ ...valido, comentario_padre_id: id }));
      expect(res.status, `id: ${id}`).toBe(400);
    }
  });

  it("guarda el texto sin escapar: React escapa al renderizar", async () => {
    const { POST } = await cargar();
    await POST(peticion({ ...valido, nombre: "O'Neill", texto: 'Uno & "dos"' }));
    const guardado = insertComentario.mock.calls[0][0];
    expect(guardado.nombre).toBe("O'Neill");
    expect(guardado.texto).toBe('Uno & "dos"');
    expect(guardado.texto).not.toContain("&amp;");
  });

  it("devuelve 500 si la inserción falla", async () => {
    insertComentario.mockResolvedValue(null);
    const { POST } = await cargar();
    expect((await POST(peticion(valido))).status).toBe(500);
  });
});

// ─── /api/likes ───────────────────────────────────────────────────────────────

describe("POST /api/likes", () => {
  const cargar = () => import("../likes/route.js");

  it("acepta +1 y -1", async () => {
    const { POST } = await cargar();
    for (const delta of [1, -1]) {
      const res = await POST(peticion({ commentId: 2, delta }));
      expect(res.status, `delta: ${delta}`).toBe(200);
    }
  });

  it("rechaza cualquier delta que no sea +1 o -1", async () => {
    const { POST } = await cargar();
    for (const delta of [0, 2, -5, 9999, "abc", null]) {
      const res = await POST(peticion({ commentId: 2, delta }));
      expect(res.status, `delta: ${delta}`).toBe(400);
    }
    expect(adjustLikes).not.toHaveBeenCalled();
  });

  it('convierte el delta numérico en texto: "1" cuenta como +1', async () => {
    const { POST } = await cargar();
    expect((await POST(peticion({ commentId: 2, delta: "1" }))).status).toBe(200);
  });

  it("rechaza identificadores de comentario inválidos", async () => {
    const { POST } = await cargar();
    for (const id of [0, -3, 1.5, "abc", null]) {
      const res = await POST(peticion({ commentId: id, delta: 1 }));
      expect(res.status, `id: ${id}`).toBe(400);
    }
  });

  it("devuelve 500 si el comentario no existe", async () => {
    adjustLikes.mockResolvedValue(null);
    const { POST } = await cargar();
    expect((await POST(peticion({ commentId: 999, delta: 1 }))).status).toBe(500);
  });
});

// ─── /api/contacto ────────────────────────────────────────────────────────────

describe("POST /api/contacto", () => {
  const cargar = () => import("../contacto/route.js");
  const valido = {
    nombre: "Ana",
    apellido: "García",
    email: "ana@ejemplo.com",
    motivo: "Quiero información.",
  };

  it("acepta un mensaje válido", async () => {
    const { POST } = await cargar();
    expect((await POST(peticion(valido))).status).toBe(200);
    expect(postContacto).toHaveBeenCalled();
  });

  it("valida el formato del correo", async () => {
    const { POST } = await cargar();
    for (const email of ["sinarroba", "a@b", "a b@c.com", "", "a@".padEnd(260, "x")]) {
      const res = await POST(peticion({ ...valido, email }));
      expect(res.status, `email: ${email}`).toBe(400);
    }
  });

  it("exige nombre y motivo, y acota su longitud", async () => {
    const { POST } = await cargar();
    expect((await POST(peticion({ ...valido, nombre: "" }))).status).toBe(400);
    expect((await POST(peticion({ ...valido, nombre: "A".repeat(101) }))).status).toBe(400);
    expect((await POST(peticion({ ...valido, motivo: "" }))).status).toBe(400);
    expect((await POST(peticion({ ...valido, motivo: "A".repeat(501) }))).status).toBe(400);
  });

  it("sigue devolviendo 200 si Supabase falla pero el correo sale", async () => {
    postContacto.mockResolvedValue(false);
    const { POST } = await cargar();
    expect((await POST(peticion(valido))).status).toBe(200);
  });

  it("devuelve 500 solo cuando fallan las dos vías", async () => {
    postContacto.mockResolvedValue(false);
    enviarResend.mockResolvedValue({ error: { message: "caído" } });
    const { POST } = await cargar();
    expect((await POST(peticion(valido))).status).toBe(500);
  });

  it("respeta el limitador", async () => {
    checkRateLimit.mockResolvedValue({ allowed: false, retryAfter: 10 });
    const { POST } = await cargar();
    expect((await POST(peticion(valido))).status).toBe(429);
    expect(postContacto).not.toHaveBeenCalled();
  });
});

// ─── /api/newsletter ──────────────────────────────────────────────────────────

describe("POST /api/newsletter", () => {
  const cargar = () => import("../newsletter/route.js");

  it("valida el correo antes de tocar nada", async () => {
    const { POST } = await cargar();
    for (const email of ["", "sinarroba", "a b@c.com"]) {
      const res = await POST(peticion({ email }));
      expect(res.status, `email: ${email}`).toBe(400);
    }
    expect(postSuscriptor).not.toHaveBeenCalled();
  });

  it("acota nombre y apellido a 100 caracteres", async () => {
    const { POST } = await cargar();
    await POST(peticion({
      email: "ana@ejemplo.com",
      nombre: "A".repeat(300),
      apellido: "B".repeat(300),
    }));
    const enviado = crearContacto.mock.calls[0]?.[0];
    expect(enviado.firstName).toHaveLength(100);
    expect(enviado.lastName).toHaveLength(100);
  });

  it("respeta el limitador", async () => {
    checkRateLimit.mockResolvedValue({ allowed: false, retryAfter: 5 });
    const { POST } = await cargar();
    expect((await POST(peticion({ email: "ana@ejemplo.com" }))).status).toBe(429);
  });
});

// ─── /api/revalidate ──────────────────────────────────────────────────────────

describe("POST /api/revalidate", () => {
  const cargar = () => import("../revalidate/route.js");

  it("rechaza sin secreto", async () => {
    const { POST } = await cargar();
    expect((await POST(peticion({ model: "articulo" }))).status).toBe(401);
  });

  it("rechaza con un secreto incorrecto", async () => {
    const { POST } = await cargar();
    const res = await POST(peticion({ model: "articulo" }, { "x-revalidate-secret": "no-es" }));
    expect(res.status).toBe(401);
  });

  it("rechaza un secreto de longitud distinta sin filtrarla por tiempo", async () => {
    const { POST } = await cargar();
    const corto = await POST(peticion({}, { "x-revalidate-secret": "x" }));
    const largo = await POST(peticion({}, { "x-revalidate-secret": "x".repeat(200) }));
    expect(corto.status).toBe(401);
    expect(largo.status).toBe(401);
  });

  it("acepta el secreto correcto e invalida la caché", async () => {
    const { POST } = await cargar();
    const { revalidateTag } = await import("next/cache");
    const res = await POST(
      peticion({ model: "articulo" }, { "x-revalidate-secret": "secreto-de-prueba" })
    );
    expect(res.status).toBe(200);
    expect((await res.json()).revalidated).toBe(true);
    expect(revalidateTag).toHaveBeenCalledWith("articulos");
  });

  it("un modelo desconocido invalida todo por precaución", async () => {
    const { POST } = await cargar();
    const { revalidateTag } = await import("next/cache");
    await POST(peticion({ model: "loquesea" }, { "x-revalidate-secret": "secreto-de-prueba" }));
    const etiquetas = revalidateTag.mock.calls.flat();
    expect(etiquetas).toEqual(expect.arrayContaining(["articulos", "debates", "programas"]));
  });

  it("el GET de comprobación responde", async () => {
    const { GET } = await cargar();
    const res = await GET();
    expect(res.status).toBe(200);
    expect((await res.json()).status).toBe("ok");
  });
});
