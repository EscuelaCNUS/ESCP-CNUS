// El dominio canónico del sitio. Alimenta sitemap, robots, canonical y OpenGraph:
// si apunta al dominio equivocado, Google indexa ése en lugar del real.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.escuelacnus.com";

export function siteUrl(path = "") {
  return `${SITE_URL}${path}`;
}
