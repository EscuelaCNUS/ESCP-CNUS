import EjesCarousel from "./EjesCarousel";

export default function EjesFormativosSection({ ejes = [] }) {
  if (ejes.length === 0) return null;

  return (
    <section className="w-full max-w-[1920px] mb-[120px] tablet:mb-[200px] mx-auto px-4 tablet:px-[60px] laptop:px-6 py-12 tablet:py-16 laptop:py-16 desktop:h-[595px] flex flex-col justify-center text-center overflow-hidden bg-[#f8f9fa]">
      <h2 className="text-2xl md:text-[34px] desktop:text-[44px] font-black text-[#05162D] tracking-[-0.88px] mb-4">
        Nuestros Ejes Formativos
      </h2>
      <p className="text-gray-600 max-w-full mx-auto mb-12 text-[18px] tablet:text-[25px] laptop:text-[18px] desktop:text-[24px] leading-snug">
        Descubre los pilares que orientan nuestro modelo educativo y forman profesionales íntegros,
        preparados para afrontar los{" "}
        <br className="hidden tablet:block" />
        retos del futuro laboral.
      </p>

      <EjesCarousel items={ejes} />
    </section>
  );
}
