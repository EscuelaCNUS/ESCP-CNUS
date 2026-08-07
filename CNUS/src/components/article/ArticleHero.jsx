import Image from "next/image";

export default function ArticleHero({ category, title, imageUrl }) {
  return (
    <div className="relative w-full h-[420px] md:h-[500px] desktop:h-[560px] mt-[90px] md:mt-[116px] overflow-hidden bg-[#05162D]">

      {/* Fondo desenfocado de la misma imagen para rellenar sin espacios negros */}
      {imageUrl && (
        <div
          className="absolute inset-0 scale-110 blur-xl opacity-60"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      {/* Imagen principal centrada, completa, sin recortes */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title || "Artículo"}
          fill
          priority
          sizes="100vw"
          className="object-contain object-center"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#05162D] via-[#0E52C6] to-[#0A1628]" />
      )}

      {/* Degradado para legibilidad del texto */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#05162D] via-[#05162D]/30 to-transparent pointer-events-none z-10" />

      {/* Categoría y Título superpuestos al fondo */}
      <div className="absolute bottom-0 left-0 right-0 pb-8 md:pb-14 px-6 md:px-[118px] w-full z-20 pointer-events-none">
        <div className="max-w-[1680px] flex flex-col justify-end pointer-events-auto">
          {category && (
            <span className="text-[#22D3EE] text-base md:text-lg font-semibold mb-2 tracking-wide block uppercase drop-shadow">
              {category}
            </span>
          )}
          <h1 className="text-white text-[28px] sm:text-[36px] md:text-[46px] desktop:text-[52px] font-bold leading-tight drop-shadow-lg max-w-5xl">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
}
