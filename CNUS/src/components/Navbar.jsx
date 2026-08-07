"use client";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar({ logoClassName = "" }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleSubscribe = () => {
    setIsMenuOpen(false);
    const el = document.getElementById("newsletter");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/#newsletter");
    }
  };

  return (
    <>
      <nav className={`w-full z-50 text-white flex items-center justify-center transition-all duration-300 px-4 tablet:px-7.5 laptop:px-20 desktop:px-29.5
      ${isScrolled
        ? 'fixed top-0 bg-[#05162D]/90 backdrop-blur-md shadow-xl h-17.5 tablet:h-19.75'
        : 'absolute top-0 bg-transparent h-22.5 tablet:h-29'
      }`}
    >
      <div className="w-full max-w-[1920px] flex items-center justify-between">

        {/* Logo */}
        <Link href="/" aria-label="Ir al inicio" className="flex items-center shrink-0">
            <div className={`relative transition-all duration-300 ${logoClassName} ${
                isScrolled
                  ? 'w-25 h-11.5 tablet:w-38.25 tablet:h-17.25'
                  : 'w-40 h-18 tablet:w-63.75 tablet:h-29'
              }`}>
              <Image
                src="/logos/logo.svg"
                alt="Logo Escuela CNUS"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
        </Link>

        {/* Desktop Links — only visible at 1200px+ */}
        <div className={`hidden laptop:flex flex-1 items-center justify-center desktop:justify-between text-[#FFFFFF] font-medium transition-all duration-300
          ${isScrolled
            ? 'gap-8 desktop:gap-0 ml-6 mr-6 desktop:ml-52.25 desktop:mr-41.75 text-[14px] desktop:text-[16px]'
            : 'gap-6 desktop:gap-0 ml-10 mr-10 desktop:ml-38 desktop:mr-41.75 text-[15px] desktop:text-[20px]'
          }`}
        >
          <Link href="/" className="hover:text-blue-200 transition whitespace-nowrap">Inicio</Link>
          <Link href="/nosotros" className="hover:text-blue-200 transition whitespace-nowrap">Sobre Nosotros</Link>
          <Link href="/programas" className="hover:text-blue-200 transition whitespace-nowrap">Programas</Link>
          <Link href="/articulando" className="hover:text-blue-200 transition whitespace-nowrap">Articulando</Link>
          <Link href="/contacto" className="hover:text-blue-200 transition whitespace-nowrap">Contacto</Link>
        </div>

        {/* Action Button & Mobile/Tablet Menu */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Suscríbete al boletín"
            onClick={handleSubscribe}
            className={`hidden laptop:flex items-center justify-center gap-2.5 w-47 bg-primary hover:bg-primary-dark text-[#FFFFFF] rounded-full font-medium transition-all duration-300
            ${isScrolled ? 'h-13.75 text-[16px]' : 'h-17.25 text-[20px]'}`}
          >
            Suscríbete
          </button>

          {/* Hamburger — hidden at 1200px+ */}
          <button 
            className="laptop:hidden z-50 relative"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMenuOpen ? (
              <X size={isScrolled ? 28 : 36} className="transition-all duration-300" />
            ) : (
              <Menu size={isScrolled ? 28 : 36} className="transition-all duration-300" />
            )}
          </button>
        </div>
      </div>
    </nav>

      {/* Mobile/Tablet Menu Overlay — hidden at 1200px+ */}
      <div 
        id="mobile-navigation"
        aria-hidden={!isMenuOpen}
        className={`fixed inset-0 bg-[#05162D] text-white z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-300 laptop:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <Link href="/" onClick={() => setIsMenuOpen(false)} tabIndex={isMenuOpen ? 0 : -1} className="text-2xl font-medium hover:text-blue-300 transition">Inicio</Link>
        <Link href="/nosotros" onClick={() => setIsMenuOpen(false)} tabIndex={isMenuOpen ? 0 : -1} className="text-2xl font-medium hover:text-blue-300 transition">Sobre Nosotros</Link>
        <Link href="/programas" onClick={() => setIsMenuOpen(false)} tabIndex={isMenuOpen ? 0 : -1} className="text-2xl font-medium hover:text-blue-300 transition">Programas</Link>
        <Link href="/articulando" onClick={() => setIsMenuOpen(false)} tabIndex={isMenuOpen ? 0 : -1} className="text-2xl font-medium hover:text-blue-300 transition">Articulando</Link>
        <Link href="/contacto" onClick={() => setIsMenuOpen(false)} tabIndex={isMenuOpen ? 0 : -1} className="text-2xl font-medium hover:text-blue-300 transition">Contacto</Link>
        <button type="button" aria-label="Suscríbete al boletín" onClick={handleSubscribe} className="mt-8 bg-primary hover:bg-primary-dark text-white rounded-full font-medium h-15 px-10 text-[20px] transition-all">
          Suscríbete
        </button>
      </div>
    </>
  );
}
