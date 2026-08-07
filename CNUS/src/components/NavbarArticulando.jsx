"use client";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function NavbarArticulando() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const handleSubscribe = () => {
    setIsMenuOpen(false);
    router.push("/#newsletter");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  return (
    <>
      {/*
        Escala fluida entre laptop (1200px) y desktop (1610px):
        - Altura nav:   clamp(90→116px) / clamp(70→79px)
        - Padding nav:  clamp(80→118px)
        - Logo:         clamp(180→255px) / clamp(100→153px)
        - Font links:   clamp(15→20px)  / clamp(14→16px)
        - Margins links: clamp para ml/mr
      */}
      <nav
        className={`w-full z-50 text-[#05162D] flex items-center justify-center transition-all duration-300
          px-4 tablet:px-7.5
          laptop:px-[clamp(80px,_calc(9.27vw_-_31.2px),_118px)]
          ${isScrolled
            ? 'fixed top-0 left-0 right-0 bg-[#F2F4F7]/90 backdrop-blur-md shadow-xl h-17.5 tablet:h-[clamp(70px,_5.5vw,_79px)]'
            : 'absolute top-0 left-0 right-0 bg-[#F2F4F7] h-22.5 tablet:h-[clamp(90px,_8vw,_116px)]'
          }`}
      >
        <div className="w-full max-w-[1920px] flex items-center justify-between">

          {/* Logo — izquierda, tamaño fluido */}
          <Link href="/articulando" aria-label="Ir al inicio de Articulando" className="flex items-center shrink-0">
            <div className={`relative transition-all duration-300 ${
                isScrolled
                  ? 'w-25 h-11.5 tablet:w-[clamp(100px,_9.5vw,_153px)] tablet:h-[clamp(45px,_4.3vw,_69px)]'
                  : 'w-40 h-18 tablet:w-[clamp(180px,_15.8vw,_255px)] tablet:h-[clamp(82px,_7.2vw,_116px)]'
              }`}>
              <Image
                src="/logos/logocolor.svg"
                alt="Logo Escuela CNUS Color"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Links — font size, márgenes y gap fluidos */}
          <div
            className={`hidden laptop:flex flex-1 items-center justify-center text-[#05162D] font-medium transition-all duration-300
              ${isScrolled
                ? [
                    // gap: 32px (1200px) → 48px (1610px)
                    'gap-[clamp(32px,_calc(3.9vw_-_14.83px),_48px)]',
                    'ml-[clamp(24px,_calc(45.1vw_-_517px),_209px)]',
                    'mr-[clamp(24px,_calc(34.9vw_-_394.5px),_167px)]',
                    'text-[clamp(14px,_1.1vw,_16px)]',
                  ].join(' ')
                : [
                    // gap: 24px (1200px) → 60px (1610px)
                    'gap-[clamp(24px,_calc(8.78vw_-_81.37px),_60px)]',
                    'ml-[clamp(40px,_calc(27.3vw_-_288px),_152px)]',
                    'mr-[clamp(40px,_calc(31vw_-_332px),_167px)]',
                    'text-[clamp(15px,_1.25vw,_20px)]',
                  ].join(' ')
              }`}
          >
            <Link href="/" className="hover:text-primary transition whitespace-nowrap">Inicio</Link>
            <Link href="/articulando/debate" className="hover:text-primary transition whitespace-nowrap">Debate</Link>

            {/* Dropdown Destacados */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 hover:text-primary transition whitespace-nowrap cursor-pointer"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                Destacados
                <ChevronDown size={14} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-64 z-50">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                    <Link
                      href="/articulando/notas-del-presidente"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-5 py-3 hover:bg-gray-50 hover:text-primary transition text-sm"
                    >
                      Notas del presidente
                    </Link>
                    <Link
                      href="/articulando/columna-del-director"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-5 py-3 hover:bg-gray-50 hover:text-primary transition text-sm"
                    >
                      Columna del director
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/articulando/pensamiento-complejo" className="hover:text-primary transition whitespace-nowrap">Pensamiento</Link>
            <Link href="/articulando/noticias-y-eventos" className="hover:text-primary transition whitespace-nowrap">Noticias y eventos</Link>
          </div>

          {/* Botón + Hamburger */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleSubscribe}
              className={`hidden laptop:flex items-center justify-center w-47 bg-primary hover:bg-primary-dark text-white rounded-full font-medium transition-all duration-300
                ${isScrolled
                  ? 'h-[clamp(50px,_4.3vw,_55px)] text-[clamp(14px,_1.1vw,_16px)]'
                  : 'h-[clamp(55px,_4.3vw,_69px)] text-[clamp(15px,_1.25vw,_20px)]'
                }`}
            >
              Suscríbete
            </button>

            {/* Hamburger — solo visible <1200px */}
            <button
              className="laptop:hidden z-50 relative"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation-articulando"
            >
              {isMenuOpen ? (
                <X size={isScrolled ? 28 : 36} className="transition-all duration-300 text-[#05162D]" />
              ) : (
                <Menu size={isScrolled ? 28 : 36} className="transition-all duration-300 text-[#05162D]" />
              )}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile/Tablet Menu Overlay */}
      <div
        id="mobile-navigation-articulando"
        aria-hidden={!isMenuOpen}
        className={`fixed inset-0 bg-[#F2F4F7] text-[#05162D] z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-300 laptop:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <Link href="/" onClick={() => setIsMenuOpen(false)} tabIndex={isMenuOpen ? 0 : -1} className="text-2xl font-medium hover:text-primary transition">Inicio</Link>
        <Link href="/articulando/debate" onClick={() => setIsMenuOpen(false)} tabIndex={isMenuOpen ? 0 : -1} className="text-2xl font-medium hover:text-primary transition">Debate</Link>
        <Link href="/articulando/notas-del-presidente" onClick={() => setIsMenuOpen(false)} tabIndex={isMenuOpen ? 0 : -1} className="text-2xl font-medium hover:text-primary transition">Notas del presidente</Link>
        <Link href="/articulando/columna-del-director" onClick={() => setIsMenuOpen(false)} tabIndex={isMenuOpen ? 0 : -1} className="text-2xl font-medium hover:text-primary transition">Columna del director</Link>
        <Link href="/articulando/pensamiento-complejo" onClick={() => setIsMenuOpen(false)} tabIndex={isMenuOpen ? 0 : -1} className="text-2xl font-medium hover:text-primary transition">Pensamiento</Link>
        <Link href="/articulando/noticias-y-eventos" onClick={() => setIsMenuOpen(false)} tabIndex={isMenuOpen ? 0 : -1} className="text-2xl font-medium hover:text-primary transition">Noticias y eventos</Link>
        <button
          type="button"
          onClick={handleSubscribe}
          tabIndex={isMenuOpen ? 0 : -1}
          className="mt-8 bg-primary hover:bg-primary-dark text-white rounded-full font-medium h-15 px-10 text-[20px] flex items-center justify-center transition-all cursor-pointer"
        >
          Suscríbete
        </button>
      </div>
    </>
  );
}
