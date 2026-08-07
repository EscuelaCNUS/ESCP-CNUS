import { getAllProgramaSlugs, getAllArticuloSlugs, getDebates } from "@/lib/strapi";
import { SITE_URL } from "@/lib/site";

const BASE_URL = SITE_URL;

export default async function sitemap() {
  const staticRoutes = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "monthly", priority: 1.0 },
    { url: `${BASE_URL}/nosotros`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/programas`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/contacto`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/articulando`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/articulando/pensamiento-complejo`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/articulando/noticias-y-eventos`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/articulando/notas-del-presidente`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/articulando/columna-del-director`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/articulando/debate`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  ];

  const [programaSlugs, articuloSlugs, debates] = await Promise.all([
    getAllProgramaSlugs(),
    getAllArticuloSlugs(),
    getDebates(),
  ]);

  const programaRoutes = (programaSlugs || []).map(({ slug }) => ({
    url: `${BASE_URL}/programas/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const articuloRoutes = (articuloSlugs || []).map(({ slug, categoria }) => ({
    url: categoria
      ? `${BASE_URL}/articulando/${categoria}/${slug}`
      : `${BASE_URL}/articulando/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const debateRoutes = (debates || [])
    .map((debate) => {
      const slug = debate.slug ?? debate?.attributes?.slug;
      return slug ? { slug: String(slug) } : null;
    })
    .filter(Boolean)
    .map(({ slug }) => ({
      url: `${BASE_URL}/articulando/debate/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  return [...staticRoutes, ...programaRoutes, ...articuloRoutes, ...debateRoutes];
}
