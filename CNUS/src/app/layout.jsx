import "./globals.css";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Escuela CNUS - Formación Sindical Sociopolítica",
  description: "Formación sindical sociopolítica para transformar la República Dominicana",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Escuela CNUS - Formación Sindical Sociopolítica",
    description: "Formación sindical sociopolítica para transformar la República Dominicana",
    type: "website",
    locale: "es_DO",
    siteName: "Escuela CNUS",
  },
  twitter: {
    card: "summary_large_image",
    title: "Escuela CNUS - Formación Sindical Sociopolítica",
    description: "Formación sindical sociopolítica para transformar la República Dominicana",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-white text-gray-900" suppressHydrationWarning>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:text-[#0045A5] focus:px-4 focus:py-2 focus:rounded-full focus:font-semibold focus:shadow-lg">
          Ir al contenido principal
        </a>
        <div id="main-content" className="grow">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
