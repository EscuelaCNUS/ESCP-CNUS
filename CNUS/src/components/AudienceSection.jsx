"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getStrapiImageUrl } from "@/lib/strapi";

const SLIDE_COUNT = 5;

const TITLE_SLIDE = {
  type: "title",
  image: "/imagenes/dirigido.png"
};

const DEFAULT_SLIDES = [
  {
    type: "audience",
    number: "01.",
    title: "Dirigentes / Delegados",
    description: "Dirigentes y delegados sindicales comprometidos con la defensa de los derechos laborales y la justicia social.",
    image: "/imagenes/dirigentes.jpeg"
  },
  {
    type: "audience",
    number: "02.",
    title: "Mujeres trabajadoras",
    description: "Mujeres líderes que buscan fortalecer su participación en espacios sindicales y de decisión política.",
    image: "/imagenes/mujeres.png"
  },
  {
    type: "audience",
    number: "03.",
    title: "Jóvenes trabajadores",
    description: "Nuevas generaciones laborales con vocación de transformación social y compromiso sindical.",
    image: "/imagenes/jovenes.png"
  },
  {
    type: "audience",
    number: "04.",
    title: "Equipos técnicos / Jurídicos",
    description: "Profesionales que brindan asesoría técnica y jurídica a las organizaciones sindicales afiliadas.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"
  }
];

const createInitialSizes = () => Array.from({ length: SLIDE_COUNT }, (_, index) => ({
  width: index === 0 ? 1218 : 1051,
  height: index === 0 ? 663 : 571,
  opacity: index === 0 ? 1 : 0.5,
  bannerWidth: index === 0 ? 882 : 715,
  bannerHeight: index === 0 ? 278 : 140,
  descOpacity: index === 0 ? 1 : 0,
  descHeight: index === 0 ? 28 : 0,
  descMargin: index === 0 ? 8 : 0,
}));

const computeDims = () => {
  if (typeof window === "undefined") {
    return {
      activeW: 1218, inactiveW: 1051, activeH: 663, inactiveH: 571,
      maxDistance: 1175, activeBannerW: 882, inactiveBannerW: 715,
      activeBannerH: 278, inactiveBannerH: 140, pad: 587.5
    };
  }
  const vw = window.innerWidth;
  if (vw < 1200 || vw >= 1610) {
    return {
      activeW: 1218, inactiveW: 1051, activeH: 663, inactiveH: 571,
      maxDistance: 1175, activeBannerW: 882, inactiveBannerW: 715,
      activeBannerH: 278, inactiveBannerH: 140, pad: 587.5
    };
  }
  const activeW = Math.min(1218, Math.max(900, vw - 160));
  const scale = activeW / 1218;
  return {
    activeW,
    inactiveW: 1051 * scale,
    activeH: 663 * scale,
    inactiveH: 571 * scale,
    maxDistance: activeW - 43,
    activeBannerW: 882 * scale,
    inactiveBannerW: 715 * scale,
    activeBannerH: 278 * scale,
    inactiveBannerH: 140 * scale,
    pad: activeW / 2
  };
};

export default function AudienceSection({ slides: externalSlides = [] }) {
  const scrollRef = useRef(null);
  const cardsRef = useRef([]);
  const bannersRef = useRef([]);
  const descriptionsRef = useRef([]);
  const sectionRef = useRef(null);
  const isVisibleRef = useRef(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  const DEFAULT_DIMS = {
    activeW: 1218, inactiveW: 1051, activeH: 663, inactiveH: 571,
    maxDistance: 1175, activeBannerW: 882, inactiveBannerW: 715,
    activeBannerH: 278, inactiveBannerH: 140, pad: 587.5
  };
  const dimsRef = useRef(DEFAULT_DIMS);

  useEffect(() => {
    const handleResize = () => {
      dimsRef.current = computeDims();
      if (scrollRef.current) {
        const { pad } = dimsRef.current;
        scrollRef.current.style.paddingLeft = `max(1rem, calc(50vw - ${pad}px))`;
        scrollRef.current.style.paddingRight = `max(1rem, calc(50vw - ${pad}px))`;
      }
      cardsRef.current.forEach((_, i) => {
        const container = cardsRef.current[i]?.parentElement;
        if (container) {
          container.style.width = `${dimsRef.current.maxDistance}px`;
        }
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentSizes = useRef(createInitialSizes());
  const targetSizes = useRef(createInitialSizes());
  const rafId = useRef(null);

  const updateTargets = useCallback(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    
    const rects = cardsRef.current.map(card => card ? card.getBoundingClientRect() : null);
    
    let closestIndex = 0;
    let minDistance = Infinity;

    const {
      activeW, inactiveW, activeH, inactiveH,
      maxDistance, activeBannerW, inactiveBannerW,
      activeBannerH, inactiveBannerH
    } = dimsRef.current;

    rects.forEach((cardRect, index) => {
      if (!cardRect) return;
      const card = cardsRef.current[index];
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(containerCenter - cardCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }

      const progress = 1 - Math.min(distance / maxDistance, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      targetSizes.current[index] = {
        width: inactiveW + (activeW - inactiveW) * easeProgress,
        height: inactiveH + (activeH - inactiveH) * easeProgress,
        opacity: 0.5 + 0.5 * easeProgress,
        bannerWidth: inactiveBannerW + (activeBannerW - inactiveBannerW) * easeProgress,
        bannerHeight: inactiveBannerH + (activeBannerH - inactiveBannerH) * easeProgress,
        descOpacity: easeProgress,
        descHeight: 28 * easeProgress,
        descMargin: 8 * easeProgress
      };
    });

    if (closestIndex !== activeIndexRef.current) {
      activeIndexRef.current = closestIndex;
      setActiveIndex(closestIndex);
    }
  }, []);

  const renderLoopRef = useRef(null);

  useEffect(() => {
    const renderLoop = () => {
      if (!isVisibleRef.current) {
        rafId.current = null;
        return;
      }
      updateTargets();

      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        const target = targetSizes.current[index];
        const current = currentSizes.current[index];

        if (!target || !current) return;

        current.width += (target.width - current.width) * 0.4;
        current.height += (target.height - current.height) * 0.4;
        current.opacity += (target.opacity - current.opacity) * 0.4;
        current.bannerWidth += (target.bannerWidth - current.bannerWidth) * 0.4;
        current.bannerHeight += (target.bannerHeight - current.bannerHeight) * 0.4;
        current.descOpacity += (target.descOpacity - current.descOpacity) * 0.4;
        current.descHeight += (target.descHeight - current.descHeight) * 0.4;
        current.descMargin += (target.descMargin - current.descMargin) * 0.4;

        card.style.width = `${current.width}px`;
        card.style.height = `${current.height}px`;
        card.style.opacity = current.opacity;

        const banner = bannersRef.current[index];
        if (banner) {
          banner.style.width = `${current.bannerWidth}px`;
          banner.style.height = `${current.bannerHeight}px`;
        }

        const desc = descriptionsRef.current[index];
        if (desc) {
          desc.style.opacity = current.descOpacity;
          desc.style.height = `${current.descHeight}px`;
          desc.style.marginTop = `${current.descMargin}px`;
        }
      });

      rafId.current = requestAnimationFrame(renderLoop);
    };

    renderLoopRef.current = renderLoop;
    rafId.current = requestAnimationFrame(renderLoop);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [updateTargets]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !rafId.current) {
          rafId.current = requestAnimationFrame(() => renderLoopRef.current());
        }
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollRafId = useRef(null);

  // SCROLL PERSONALIZADO PARA CONTROLAR LA VELOCIDAD DE TRANSICIÓN ENTRE SLIDES
  const smoothScrollTo = (targetLeft, duration = 1000) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const startLeft = container.scrollLeft;
    const distance = targetLeft - startLeft;
    let startTime = null;

    if (scrollRafId.current) {
      cancelAnimationFrame(scrollRafId.current);
    }

    // Quitamos temporalmente el snap obligatorio para que no pelee con nuestra animación
    container.style.scrollSnapType = 'none';

    const animation = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Función de aceleración (Ease in-out cúbica) para un movimiento súper elegante
      const ease = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      container.scrollLeft = startLeft + distance * ease;
      
      if (timeElapsed < duration) {
        scrollRafId.current = requestAnimationFrame(animation);
      } else {
        // Restauramos el snap al finalizar
        container.style.scrollSnapType = 'x mandatory';
        scrollRafId.current = null;
      }
    };
    
    scrollRafId.current = requestAnimationFrame(animation);
  };

  const scrollNext = () => {
    if (!scrollRef.current) return;
    const isTabletOrSmaller = window.innerWidth < 1200;
    const slideWidth = isTabletOrSmaller ? window.innerWidth : dimsRef.current.maxDistance;
    const nextIndex = Math.min(activeIndexRef.current + 1, slides.length - 1);
    smoothScrollTo(nextIndex * slideWidth, 1000);
  };

  const scrollPrev = () => {
    if (!scrollRef.current) return;
    const isTabletOrSmaller = window.innerWidth < 1200;
    const slideWidth = isTabletOrSmaller ? window.innerWidth : dimsRef.current.maxDistance;
    const prevIndex = Math.max(activeIndexRef.current - 1, 0);
    smoothScrollTo(prevIndex * slideWidth, 1000);
  };

  const hasExternal = Array.isArray(externalSlides) && externalSlides.length > 0;
  const baseSlides = hasExternal ? externalSlides : DEFAULT_SLIDES;

  const slides = [
    TITLE_SLIDE,
    ...baseSlides.map((s, i) => ({
      type: "audience",
      number: s.numero || `${String(i + 1).padStart(2, "0")}.`,
      title: s.titulo || DEFAULT_SLIDES[i]?.title || "",
      description: s.descripcion || DEFAULT_SLIDES[i]?.description || "",
      image: getStrapiImageUrl(s.imagen) || DEFAULT_SLIDES[i]?.image || "",
    })),
  ];

  return (
    <section className="w-full mb-[120px] tablet:mb-[200px]">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto pb-10 snap-x snap-mandatory items-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none max-laptop:px-4!"
        style={{
          paddingLeft: `max(1rem, calc(50vw - 587.5px))`,
          paddingRight: `max(1rem, calc(50vw - 587.5px))`,
        }}
      >
        {slides.map((slide, i) => (
          <div 
            key={i} 
            className="flex items-center justify-center shrink-0 snap-center h-175 max-laptop:w-screen! max-laptop:h-125!"
            style={{ width: `1175px` }}
          >
            {/* TARJETA ANIMADA: Cambia de tamaño libremente dentro de su contenedor fijo */}
            <div 
              ref={el => cardsRef.current[i] = el}
              className="relative rounded-[40px] overflow-hidden shadow-xl origin-center will-change-[width,height,opacity] max-laptop:w-[90vw]! max-laptop:h-112.5!"
              style={{
                width: i === 0 ? '1218px' : '1051px',
                height: i === 0 ? '663px' : '571px',
                opacity: i === 0 ? 1 : 0.5,
              }}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              ></div>
              <div className="absolute inset-0 bg-black/50"></div>

              {slide.type === "title" ? (
                <div className="absolute inset-0 flex items-center justify-center p-6 tablet:p-10">
                  <h2 className="text-[36px] tablet:text-[65px] font-bold text-white leading-tight text-center drop-shadow-lg">
                    ¿A quién está dirigida<br />la Escuela?
                  </h2>
                </div>
              ) : (
                <>
                  <div 
                    ref={el => bannersRef.current[i] = el}
                    className="absolute bottom-6 left-6 tablet:bottom-8 tablet:left-8 bg-[#05162D] p-6 tablet:p-10 rounded-3xl tablet:rounded-4xl flex flex-row gap-4 tablet:gap-8 items-center shadow-2xl will-change-[width,height] max-laptop:w-[calc(100%-3rem)]! max-laptop:h-auto!"
                    style={{
                      width: i === 0 ? '882px' : '715px',
                      height: i === 0 ? '278px' : '140px',
                    }}
                  >
                    <div className="bg-white text-black w-12.5 h-12.5 tablet:w-17.5 tablet:h-17.5 rounded-full flex items-center justify-center font-bold text-xl tablet:text-3xl shrink-0">
                      {slide.number}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-[22px] tablet:text-[32px] leading-tight mb-2 tablet:mb-0">{slide.title}</h3>
                      <p 
                        ref={el => descriptionsRef.current[i] = el}
                        className="text-gray-300 text-[14px] tablet:text-[18px] line-clamp-2 overflow-hidden will-change-[height,opacity,margin] max-laptop:h-auto! max-laptop:opacity-100! max-laptop:mt-0!"
                        style={{
                          opacity: i === 0 ? 1 : 0,
                          height: i === 0 ? '28px' : '0px',
                          marginTop: i === 0 ? '8px' : '0px'
                        }}
                      >
                        {slide.description}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Anterior"
          className="w-14 h-14 rounded-full bg-white shadow-md hover:bg-gray-100 flex items-center justify-center text-[#05162D] transition cursor-pointer"
        >
          <ChevronLeft size={28} aria-hidden="true" />
        </button>
        <div className="flex gap-4" role="tablist" aria-label="Navegación de diapositivas">
          {slides.map((_, i) => (
            <button
              type="button"
              key={i}
              role="tab"
              aria-selected={activeIndex === i}
              aria-label={`Ir a diapositiva ${i + 1}`}
              onClick={() => {
                if (scrollRef.current) {
                  const isTabletOrSmaller = window.innerWidth < 1200;
                  const slideWidth = isTabletOrSmaller ? window.innerWidth : 1175;
                  const scrollPos = i === 0 ? 0 : (i * slideWidth);
                  smoothScrollTo(scrollPos, 1200);
                }
              }}
              className={`h-3 rounded-full cursor-pointer transition-all duration-500 ${activeIndex === i ? 'w-10 bg-[#05162D]' : 'w-3 bg-gray-300'}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={scrollNext}
          aria-label="Siguiente"
          className="w-14 h-14 rounded-full bg-white shadow-md hover:bg-gray-100 flex items-center justify-center text-[#05162D] transition cursor-pointer"
        >
          <ChevronRight size={28} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
