import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgramaDetailTabs from "@/components/programas/ProgramaDetailTabs";
import { notFound } from "next/navigation";
import {
  getProgramaPorSlug,
  getAllProgramaSlugs,
  getStrapiImageUrl,
  getAutorNombre,
} from "@/lib/strapi";

export async function generateStaticParams() {
  const slugs = await getAllProgramaSlugs();
  return slugs;
}

/** "12 de julio de 2026" · "12 de julio – 30 de agosto de 2026" · null */
function formatRangoFechas(inicio, fin) {
  if (!inicio && !fin) return null;
  const fmt = (d) =>
    new Date(d).toLocaleDateString("es-DO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  if (inicio && fin) return `${fmt(inicio)} — ${fmt(fin)}`;
  return `Desde el ${fmt(inicio || fin)}`;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getProgramaPorSlug(slug);
  const programa = Array.isArray(data) ? data[0] : null;
  // La ruta está prerenderizada, así que notFound() se sirve como estático con
  // 200 en vez de 404. Marcarla noindex evita que Google indexe direcciones
  // muertas, que es el único daño real del soft 404.
  if (!programa) {
    return {
      title: "Programa no encontrado",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${programa.titulo} | Programas — Escuela CNUS`,
    description: programa.descripcion ?? "",
    alternates: { canonical: `/programas/${slug}` },
    openGraph: { type: "article" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function ProgramaDetailPage({ params }) {
  const { slug } = await params;

  const data = await getProgramaPorSlug(slug);
  const programa = Array.isArray(data) ? data[0] : null;
  if (!programa) notFound();

  const imagenUrl = getStrapiImageUrl(programa.imagen);
  const instructorNombre = getAutorNombre(programa.instructor);
  const avatarUrl = getStrapiImageUrl(programa.instructor?.avatar);

  const ejeNombre = programa.eje?.nombre ?? null;
  const ejeSlug = programa.eje?.slug ?? null;

  // El temario y las habilidades vienen de componentes repetibles de Strapi.
  // Si están vacíos, su sección no se renderiza: antes había listas de respaldo
  // escritas a mano que se mostraban idénticas en todos los cursos.
  const modulos = Array.isArray(programa.modulos)
    ? programa.modulos.filter((m) => m?.titulo)
    : [];

  const habilidadesList = Array.isArray(programa.habilidades)
    ? programa.habilidades.map((h) => h?.nombre).filter(Boolean)
    : [];

  const fechas = formatRangoFechas(programa.fecha_inicio, programa.fecha_fin);

  return (
    <main className="flex min-h-screen flex-col w-full bg-white">
      <Navbar logoClassName="tablet:mt-3.5" />

      {/* ── BANNER HEADER ──────────────────────────────────────── */}
      <section className="relative w-full bg-[#05162D] pt-32 pb-10 md:pt-44 md:pb-14 px-4 tablet:px-7.5 desktop:px-20 min-[1610px]:px-[118px]">
        {/* Breadcrumb */}
        <nav aria-label="Ruta de navegación" className="flex items-center gap-2 text-sm text-gray-400 mb-4 flex-wrap tablet:mt-2.5">
          <Link href="/programas" className="hover:text-white transition-colors">
            Programas
          </Link>
          <span aria-hidden="true">/</span>
          {ejeNombre && (
            <>
              {ejeSlug ? (
                <Link href={`/programas?eje=${encodeURIComponent(ejeSlug)}`} className="hover:text-white transition-colors">
                  {ejeNombre}
                </Link>
              ) : (
                <span>{ejeNombre}</span>
              )}
              <span aria-hidden="true">/</span>
            </>
          )}
          <span className="text-gray-300 truncate max-w-[200px] sm:max-w-none">
            {programa.titulo}
          </span>
        </nav>

        {/* Title */}
        <h1 className="text-2xl tablet:text-4xl desktop:text-5xl font-bold text-white leading-tight max-w-4xl">
          {programa.titulo}
        </h1>

        {/* Description / Subtitle */}
        {programa.descripcion && (
          <p className="text-gray-300 text-base md:text-lg mt-3 max-w-3xl leading-relaxed font-light">
            {programa.descripcion}
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-3 mt-6">
          {programa.modalidad && (
            <span className="inline-flex items-center gap-1.5 bg-white/10 text-white text-sm font-medium px-4 py-1.5 rounded-full border border-white/20">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
              </svg>
              {programa.modalidad}
            </span>
          )}
          {programa.duracion && (
            <span className="inline-flex items-center gap-1.5 bg-white/10 text-white text-sm font-medium px-4 py-1.5 rounded-full border border-white/20">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
              </svg>
              {programa.duracion}
            </span>
          )}
          {fechas && (
            <span className="inline-flex items-center gap-1.5 bg-white/10 text-white text-sm font-medium px-4 py-1.5 rounded-full border border-white/20">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" />
              </svg>
              {fechas}
            </span>
          )}
          {ejeNombre && (
            <span className="inline-flex items-center bg-[#0045A5]/60 text-blue-200 text-sm font-medium px-4 py-1.5 rounded-full border border-blue-400/30">
              {ejeNombre}
            </span>
          )}
        </div>
      </section>

      {/* ── MAIN CONTENT ───────────────────────────────────────── */}
      <section className="w-full max-w-[1400px] mx-auto px-4 tablet:px-7.5 desktop:px-20 py-12 md:py-16 desktop:mb-[120px] flex flex-col lg:flex-row gap-10 lg:gap-14">

        {/* ── LEFT COLUMN ─────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Course image */}
          <div className="w-full aspect-video bg-[#D1D9E6] rounded-2xl mb-8 relative overflow-hidden">
            {imagenUrl ? (
              <Image
                src={imagenUrl}
                alt={programa.titulo}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a2f54] to-[#0a1929]">
                <span className="text-[#8A9BB8] text-base font-medium tracking-wide">Sin imagen</span>
              </div>
            )}
          </div>

          {/* Tabs */}
          <ProgramaDetailTabs
            descripcion={programa.descripcion}
            objetivos={programa.objetivos}
            habilidades={habilidadesList}
            instructor={programa.instructor}
            instructorNombre={instructorNombre}
            avatarUrl={avatarUrl}
          />
        </div>

        {/* ── RIGHT COLUMN — Contenido temático ───────── */}
        <aside className="w-full lg:w-[340px] xl:w-[380px] shrink-0">
          <div className="bg-[#05162D] rounded-2xl p-6 md:p-8 text-white sticky top-24">
            {modulos.length > 0 ? (
              <>
                <h2 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-4">
                  Contenido temático
                </h2>

                <ol className="flex flex-col gap-5" role="list">
                  {modulos.map((modulo, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span
                        className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-[#0045A5] text-white text-[11px] font-bold flex items-center justify-center tabular-nums"
                        aria-hidden="true"
                      >
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[14px] text-white font-semibold leading-snug">
                          {modulo.titulo}
                        </p>
                        {modulo.descripcion && (
                          <p className="text-[13px] text-gray-300 leading-relaxed mt-1">
                            {modulo.descripcion}
                          </p>
                        )}
                        {modulo.duracion && (
                          <p className="text-[12px] text-blue-300 mt-1.5">{modulo.duracion}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </>
            ) : (
              <h2 className="text-xl font-bold text-white">
                ¿Te interesa este programa?
              </h2>
            )}

            {programa.dirigido_a && (
              <div className={modulos.length > 0 ? "mt-8 pt-6 border-t border-white/10" : "mt-4"}>
                <h3 className="text-[13px] font-bold text-blue-300 uppercase tracking-wide mb-2">
                  Dirigido a
                </h3>
                <p className="text-[14px] text-gray-200 leading-relaxed">{programa.dirigido_a}</p>
              </div>
            )}

            <Link
              href="/contacto"
              className="mt-8 w-full flex items-center justify-center h-12 bg-[#0045A5] hover:bg-blue-700 text-white font-semibold rounded-full transition-colors text-sm"
            >
              Inscríbete ahora
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
