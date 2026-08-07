import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DialogandoSection from "@/components/DialogandoSection";
import EjesFormativosSection from "@/components/EjesFormativosSection";
import AudienceSection from "@/components/AudienceSection";
import CursosSection from "@/components/CursosSection";
import NewsletterSection from "@/components/NewsletterSection";
import {
  getHeroConfig,
  getAudiencia,
  getEjesFormativos,
  getProgramasDestacados,
  getArticulosDialogando,
} from "@/lib/strapi";

export const metadata = {
  title: "Escuela CNUS - Formación Sindical Sociopolítica",
  description: "Formación sindical sociopolítica para transformar la República Dominicana",
  openGraph: {
    title: "Escuela CNUS - Formación Sindical Sociopolítica",
    description: "Formación sindical sociopolítica para transformar la República Dominicana",
  },
};

export default async function Home() {
  const [heroConfig, audiencia, ejes, cursosDestacados, dialogando] = await Promise.all([
    getHeroConfig(),
    getAudiencia(),
    getEjesFormativos(),
    getProgramasDestacados(),
    getArticulosDialogando(),
  ]);

  return (
    <main className="flex min-h-screen flex-col w-full overflow-hidden bg-white">
      <Navbar />
      <HeroSection heroConfig={heroConfig} />
      <div className="mt-[120px] tablet:mt-[200px]">
        <DialogandoSection articulos={dialogando ?? []} />
      </div>
      <EjesFormativosSection ejes={ejes ?? []} />
      <AudienceSection slides={audiencia?.slides ?? []} />
      <CursosSection cursos={cursosDestacados ?? []} />
      <NewsletterSection />
    </main>
  );
}
