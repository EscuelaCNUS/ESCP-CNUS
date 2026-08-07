import Link from "next/link";
import Image from "next/image";
import { FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0B1426] text-white py-14 mt-20 laptop:mt-0">
      <div className="max-w-[1680px] mx-auto px-4 tablet:px-7.5 laptop:px-20 desktop:px-6 grid grid-cols-1 tablet:grid-cols-12 gap-10 tablet:gap-4 laptop:gap-16">

        {/* Column 1: Logo & Description */}
        <div className="tablet:col-span-4 laptop:col-span-5 space-y-4 laptop:space-y-6">
          <Link href="/" aria-label="Ir al inicio">
            <div className="relative w-full max-w-50 laptop:max-w-70 h-22.5 laptop:h-31.5">
              <Image src="/logos/logo.svg" alt="Logo Escuela CNUS" fill unoptimized className="object-contain" />
            </div>
          </Link>
          <p className="text-[16px] text-gray-300 leading-relaxed max-w-md">
            La Escuela CNUS de Sindicalismo Sociopolítico (ECSP) es un espacio de formación, reflexión e incidencia al servicio de la Confederación Nacional de Unidad Sindical y sus organizaciones afiliadas.
          </p>
          <div className="flex items-center gap-2">
            <a href="https://wa.me/18097892158" target="_blank" rel="noopener noreferrer" aria-label="Contáctanos por WhatsApp" className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center hover:bg-white hover:text-[#0B1426] transition">
              <FaWhatsapp size={18} aria-hidden="true" />
            </a>
            <a href="https://www.instagram.com/escuelacnus?igsh=MXRrc3h5dDVzeXFjMg==" target="_blank" rel="noopener noreferrer" aria-label="Síguenos en Instagram" className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center hover:bg-white hover:text-[#0B1426] transition">
              <FaInstagram size={18} aria-hidden="true" />
            </a>
            <a href="https://x.com/escuelacnus" target="_blank" rel="noopener noreferrer" aria-label="Síguenos en X (Twitter)" className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center hover:bg-white hover:text-[#0B1426] transition">
              <FaTwitter size={18} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Columns 2-4: Mapa del sitio, Articulando, Contáctanos */}
        <div className="tablet:col-span-8 laptop:col-span-7 flex flex-col tablet:flex-row gap-10 tablet:gap-6 laptop:gap-16">
          <div className="flex-1">
            <h4 className="font-bold text-[16px] mb-4 laptop:mb-6 whitespace-nowrap">Mapa del sitio</h4>
            <ul className="space-y-2 laptop:space-y-4 text-[16px] text-gray-300">
              <li><Link href="/" className="hover:text-white transition">Inicio</Link></li>
              <li><Link href="/nosotros" className="hover:text-white transition">Nosotros</Link></li>
              <li><Link href="/programas" className="hover:text-white transition">Programas</Link></li>
            </ul>
          </div>

          <div className="flex-1">
            <h4 className="font-bold text-[16px] mb-4 laptop:mb-6">Articulando</h4>
            <ul className="space-y-2 laptop:space-y-4 text-[16px] text-gray-300">
              <li><Link href="/articulando/debate" className="hover:text-white transition">Debate</Link></li>
              <li><Link href="/articulando/notas-del-presidente" className="hover:text-white transition">Notas del presidente</Link></li>
              <li><Link href="/articulando/columna-del-director" className="hover:text-white transition">Columna del director</Link></li>
              <li><Link href="/articulando/pensamiento-complejo" className="hover:text-white transition">Pensamiento</Link></li>
              <li><Link href="/articulando/noticias-y-eventos" className="hover:text-white transition">Noticias y eventos</Link></li>
            </ul>
          </div>

          <div className="flex-1">
            <h4 className="font-bold text-[16px] mb-4 laptop:mb-6">Contáctanos</h4>
            <ul className="space-y-2 laptop:space-y-4 text-[16px] text-gray-300">
              <li>
                <a href="mailto:info@escuelacnus.com" className="hover:text-white transition">info@escuelacnus.com</a>
              </li>
              <li>
                <a href="tel:+18097892158" className="hover:text-white transition">809-789-2158</a>
              </li>
              <li>
                <a href="https://wa.me/18097892158" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">WhatsApp</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-[1680px] mx-auto px-4 tablet:px-7.5 tablet:gap-5 laptop:px-20 desktop:px-6 mt-16 pt-8 border-t border-gray-600 flex flex-col tablet:flex-row items-center justify-between text-[16px] text-gray-400">
        <p className="text-center tablet:text-left tablet:mr-2">© {new Date().getFullYear()} Escuela CNUS de Sindicalismo Sociopolítico | Todos los derechos reservados.</p>
        <div className="mt-4 tablet:mt-0">
          <Link href="/" className="hover:text-white transition">Políticas de privacidad</Link>
        </div>
      </div>
    </footer>
  );
}
