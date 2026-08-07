import Image from "next/image";
import NavbarArticulando from "@/components/NavbarArticulando";
import ArticleHero from "@/components/article/ArticleHero";
import CommentsSection from "@/components/article/CommentsSection";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import {
  getArticuloPorSlug,
  getAllArticuloSlugs,
  getStrapiImageUrl,
  formatDate,
  getAutorNombre,
  getArticulosPorCategoria,
} from "@/lib/strapi";
import { getComentarios } from "@/lib/supabase";
import { escapeHtml } from "@/lib/sanitize";

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllArticuloSlugs();
  return slugs
    .filter((item) => item.categoria)
    .map((item) => ({ categoria: item.categoria, slug: item.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getArticuloPorSlug(slug);
  const article = Array.isArray(data) ? data[0] : null;
  // Ver nota en programas/[slug]: el soft 404 de las rutas prerenderizadas se
  // compensa marcándolas noindex.
  if (!article) {
    return {
      title: "Artículo no encontrado",
      robots: { index: false, follow: false },
    };
  }

  const cat = article.categoria?.slug ?? "articulando";

  return {
    title: `${article.titulo} | Articulando ESCP`,
    description: article.extracto ?? "",
    alternates: { canonical: `/articulando/${cat}/${slug}` },
    openGraph: {
      title: article.titulo,
      description: article.extracto ?? "",
      images: getStrapiImageUrl(article.imagen_portada)
        ? [{ url: getStrapiImageUrl(article.imagen_portada) }]
        : [],
    },
  };
}

/** Solo se permiten enlaces a destinos inofensivos: nada de javascript: ni data:. */
const URL_SEGURA = /^(?:https?:\/\/|mailto:|tel:|\/|#)/i;

/**
 * Convierte el markdown del CMS a HTML.
 *
 * El texto de entrada se escapa ANTES de aplicar ninguna conversión, así que
 * el HTML resultante solo contiene las etiquetas que genera esta función. Lo
 * que un editor pegue en crudo se muestra como texto, no se ejecuta.
 *
 * Antes esto se saneaba después con DOMPurify, pero esa librería arrastra jsdom
 * al servidor y su cadena de dependencias se rompió: las páginas de artículo
 * dejaron de regenerarse en producción. Escapar en origen no necesita ninguna
 * dependencia y deja menos margen de error.
 */
function convertMarkdownToHtml(markdownStr) {
  if (!markdownStr) return "";

  let html = escapeHtml(markdownStr);

  // En encabezados (### H3, ## H2)
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-[#05162D] mt-5 mb-2">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-[#05162D] mt-6 mb-3">$1</h2>');

  // Convertir negritas (**texto** o __texto__)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

  // Convertir cursivas (*texto* o _texto_)
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');

  // Convertir enlaces [texto](url). Un destino que no supere URL_SEGURA se
  // queda como texto plano, sin enlace.
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, (completo, texto, url) => {
    const limpia = url.trim();
    if (!URL_SEGURA.test(limpia)) return texto;
    return `<a href="${limpia}" target="_blank" rel="noopener noreferrer">${texto}</a>`;
  });

  // Si no contiene etiquetas HTML de bloque, envolver párrafos
  if (!/<(p|div|h[1-6]|ul|ol|li|blockquote)[^>]*>/i.test(html)) {
    const paragraphs = html.split(/\n\s*\n/).filter(Boolean);
    html = paragraphs
      .map((p) => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
      .join('');
  }

  return html;
}

function renderContent(content) {
  if (!content) return null;

  // convertMarkdownToHtml escapa la entrada antes de convertirla, así que el
  // resultado solo lleva las etiquetas que genera él mismo.
  const htmlContent = convertMarkdownToHtml(content);

  return (
    <div
      className="w-full text-[#05162D] text-[16px] desktop:text-[18px] font-light desktop:font-normal tracking-[-0.02em] leading-[30px] desktop:leading-[32px] max-w-none [&_p]:w-full [&_p]:mb-4 [&_strong]:font-bold [&_strong]:text-[#05162D] [&_b]:font-bold [&_b]:text-[#05162D] [&_em]:italic [&_i]:italic [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-5 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4 [&_li]:mb-1 [&_a]:text-primary [&_a]:underline"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}

export default async function ArticlePage({ params }) {
  const { categoria, slug } = await params;

  let articuloData = null;
  let comentarios = [];

  try {
    articuloData = await getArticuloPorSlug(slug);
  } catch (err) {
    console.error("[article] Error fetching article:", err);
  }

  try {
    comentarios = await getComentarios(slug);
  } catch (err) {
    console.error("[article] Error fetching comments:", err);
  }

  const article = Array.isArray(articuloData) ? articuloData[0] : null;
  if (!article) notFound();

  const autorNombre = getAutorNombre(article.autor);
  const tags = Array.isArray(article.tags) ? article.tags.filter((t) => t?.nombre) : [];
  const portadaUrl = getStrapiImageUrl(article.imagen_portada);
  const avatarUrl = getStrapiImageUrl(article.autor?.avatar);
  let relacionados = [];

  if (article.categoria?.slug) {
    try {
      const catArts = await getArticulosPorCategoria(article.categoria.slug, 5);
      if (Array.isArray(catArts)) {
        relacionados = catArts.filter((a) => a.slug !== slug).slice(0, 4);
      }
    } catch (err) {
      console.error("[article] Error fetching related articles:", err);
    }
  }

  return (
    <main className="flex min-h-screen flex-col w-full bg-white">
      <NavbarArticulando />
      <ArticleHero
        category={article.categoria?.nombre}
        title={article.titulo}
        imageUrl={portadaUrl}
      />

      <div className="w-full max-w-[1920px] mx-auto px-6 md:px-[118px] py-16 flex flex-col lg:flex-row justify-between gap-8">

        {/* Columna izquierda: Autor y meta (Fija al hacer scroll) */}
        <div className="w-full lg:w-[280px] shrink-0 flex flex-col order-2 lg:order-1 lg:sticky lg:top-28 lg:self-start">
          <div className="mb-6">
            <div className="flex items-center gap-[14px] mb-3">
              <div className="w-[64px] h-[64px] rounded-full bg-[#E5E7EB] shrink-0 overflow-hidden relative self-start mt-1">
                {avatarUrl && (
                  <Image src={avatarUrl} alt={autorNombre} fill sizes="64px" className="object-cover" />
                )}
              </div>
              <div className="flex flex-col justify-center min-h-[64px] min-w-0 flex-1">
                <span className="text-[#05162D] text-xs font-normal block">Publicado por</span>
                <h3 className="text-[#05162D] text-[17px] font-semibold leading-tight mt-0.5 whitespace-nowrap truncate">
                  {autorNombre}
                </h3>
                {article.autor?.cargo && (
                  <p className="text-[#0E52C6] text-[13px] font-medium leading-snug mt-0.5">
                    {article.autor.cargo}
                  </p>
                )}
              </div>
            </div>
            {article.autor?.biografia && (
              <p className="text-[#445163] text-[14px] leading-[24px] mt-4">
                {article.autor.biografia}
              </p>
            )}
          </div>

          <div className="w-full md:w-[284px] flex flex-col">
            {article.fecha_publicacion && (
              <div className="pb-4 border-b border-gray-300 mb-4">
                <span className="text-[#667085] text-[16px] font-medium block">
                  Publicado el {formatDate(article.fecha_publicacion)}
                </span>
              </div>
            )}

            {/* Etiquetas del artículo. La consulta ya las traía, pero no había
                nada que las pintara, así que nunca llegaban a verse. */}
            {tags.length > 0 && (
              <div className="pb-4 border-b border-gray-300 mb-4">
                <span className="text-[#667085] text-[13px] font-medium block mb-2">
                  Etiquetas
                </span>
                <ul className="flex flex-wrap gap-2" role="list">
                  {tags.map((tag) => (
                    <li key={tag.slug ?? tag.nombre}>
                      <span className="inline-block text-[13px] font-medium text-[#0E52C6] bg-[#EEF3FC] px-3 py-1 rounded-full">
                        #{tag.nombre}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Redes sociales institucionales (mismas del Footer) */}
            <div className="flex gap-3 items-center pt-1">
              <a
                href="https://wa.me/18097892158"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contáctanos por WhatsApp"
                className="w-[44px] h-[44px] rounded-full bg-[#98A2B3] flex items-center justify-center text-white hover:bg-primary transition-colors"
              >
                <FaWhatsapp size={20} aria-hidden="true" />
              </a>
              <a
                href="https://www.instagram.com/escuelacnus?igsh=MXRrc3h5dDVzeXFjMg=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Síguenos en Instagram"
                className="w-[44px] h-[44px] rounded-full bg-[#98A2B3] flex items-center justify-center text-white hover:bg-primary transition-colors"
              >
                <FaInstagram size={20} aria-hidden="true" />
              </a>
              <a
                href="https://x.com/escuelacnus"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Síguenos en X (Twitter)"
                className="w-[44px] h-[44px] rounded-full bg-[#98A2B3] flex items-center justify-center text-white hover:bg-primary transition-colors"
              >
                <FaTwitter size={20} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Columna central: Contenido */}
        <div className="flex-1 max-w-[800px] w-full min-w-0 order-1 lg:order-2">
          {renderContent(article.contenido)}
        </div>

        {/* Columna derecha: Relacionados (Fija al hacer scroll) */}
        {relacionados.length > 0 && (
          <div className="w-full lg:w-[300px] xl:w-[350px] shrink-0 order-3 lg:sticky lg:top-28 lg:self-start">
            <h3 className="text-[#05162D] text-xl font-bold mb-8">
              Conoce más de {article.categoria?.nombre ?? "esta categoría"}
            </h3>
            <div className="flex flex-col gap-6">
              {relacionados.map((item, index) => {
                const relImgUrl = getStrapiImageUrl(item.imagen_portada);
                const relCat = item.categoria?.slug ?? categoria;
                return (
                  <Link
                    href={`/articulando/${relCat}/${item.slug}`}
                    key={item.id ?? index}
                    className="group flex gap-4 items-start"
                  >
                    <span className="text-[#F2F4F7] text-[56px] font-bold leading-none -mt-2 group-hover:text-primary transition-colors">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 flex flex-col gap-2">
                      {relImgUrl && (
                        <div className="w-[120px] h-[70px] bg-gray-200 rounded overflow-hidden relative shrink-0">
                          <Image src={relImgUrl} alt={item.titulo} fill sizes="120px" className="object-cover" />
                        </div>
                      )}
                      <h4 className="text-[#05162D] text-sm font-medium leading-tight group-hover:text-primary transition-colors">
                        {item.titulo}
                      </h4>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <CommentsSection comentarios={comentarios ?? []} articuloSlug={slug} />
    </main>
  );
}
