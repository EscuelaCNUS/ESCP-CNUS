"use client";
import { useRef, useEffect, useSyncExternalStore } from "react";

function usePrefersReducedMotion() {
  const subscribe = (callback) => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", callback);
    return () => mq.removeEventListener("change", callback);
  };
  const getSnapshot = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export default function EjesCarousel({ items = [] }) {
  const reduced = usePrefersReducedMotion();
  const duplicated = items.length > 0 ? [...items, ...items] : [];

  const trackRef = useRef(null);
  const posRef = useRef(0);
  const rafRef = useRef(null);
  const isPausedRef = useRef(false);
  const speed = 0.8;

  useEffect(() => {
    const track = trackRef.current;
    if (!track || duplicated.length === 0 || reduced) return;

    let half = 0;
    const animate = () => {
      if (half === 0) half = track.scrollWidth / 2;
      if (!isPausedRef.current && half > 0) {
        posRef.current -= speed;
        if (posRef.current <= -half) posRef.current += half;
        track.style.transform = `translateX(${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [duplicated.length, reduced]);

  if (items.length === 0) return null;

  return (
    <div
      className="relative w-full overflow-hidden py-8"
      style={{
        WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}
      onMouseEnter={() => { isPausedRef.current = true; }}
      onMouseLeave={() => { isPausedRef.current = false; }}
      aria-label={reduced ? "Lista de ejes formativos" : "Carrusel de ejes formativos"}
    >
      <div
        ref={trackRef}
        className="flex gap-6"
        style={{ width: "max-content", willChange: reduced ? "auto" : "transform" }}
      >
        {(reduced ? items : duplicated).map((eje, index) => (
          <div
            key={index}
            className="w-[200px] sm:w-[240px] tablet:w-[280px] laptop:w-[320px] h-[120px] sm:h-[150px] tablet:h-[180px] laptop:h-[200px] bg-gray-100 rounded-2xl hover:bg-gray-200 hover:-translate-y-2 transition-all duration-300 cursor-pointer flex items-center justify-center p-4 sm:p-6 shrink-0 shadow-sm"
          >
            <h3 className="font-bold text-gray-900 text-[16px] sm:text-[18px] tablet:text-[20px] laptop:text-[22px] leading-tight">
              {eje.nombre}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
