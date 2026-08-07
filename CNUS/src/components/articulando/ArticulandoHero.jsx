import Image from "next/image";

export default function ArticulandoHero({ tag, title, excerpt, image, articleUrl }) {
  return (
    <section className="relative w-full overflow-hidden h-[calc(100vh-90px)] md:h-[calc(100vh-116px)] mt-22.5 md:mt-29 mb-50 flex items-end justify-center pb-15 md:pb-30">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image 
          src={image || "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"} 
          alt="Hero background" 
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-[rgba(0,0,0,0.7)] to-[rgba(102,102,102,0)]"></div>
      </div>

      {/* Content */}
      {/* En fila hay que dejar hueco entre el cuadro y el botón: con md:gap-0
          y un ancho fijo de 725px para el cuadro más 260px del botón, a partir
          de 768px no cabían y se montaban uno sobre otro. El cuadro pasa a
          encogerse hasta su ancho máximo. */}
      <div className="relative w-full max-w-[1920px] mx-auto px-4 tablet:px-7.5 laptop:px-20 desktop:px-29.5 flex flex-col md:flex-row md:justify-between items-stretch md:items-end gap-4 md:gap-6 laptop:gap-8">
        {title && (
          <>
            <div className="flex flex-col justify-center w-full md:flex-1 md:max-w-181.25 md:min-w-0 md:h-79.5 bg-white/15 backdrop-blur-[9px] border border-white rounded-[20px] p-5 md:px-10 text-white">
              <span className="text-sm md:text-[20px] font-light md:leading-7.5 md:tracking-[-0.4px] mb-1 md:mb-2">
                {tag || "Categoría"}
              </span>
              <h1 className="text-xl sm:text-2xl md:text-[36px] lg:text-[40px] font-bold leading-tight mb-2 md:mb-3 tracking-tight md:tracking-[-0.8px] line-clamp-3">
                {title}
              </h1>
              <p className="text-sm md:text-[20px] font-light md:leading-7.5 md:tracking-[-0.4px] line-clamp-2">
                {excerpt}
              </p>
            </div>

            <a href={articleUrl || "#"} className="flex items-center justify-center w-full md:w-65 h-12.5 md:h-17.25 border border-white text-white rounded-full font-medium text-base md:text-[20px] hover:bg-white/20 transition-all shrink-0">
              Leer más
            </a>
          </>
        )}
      </div>
    </section>
  );
}

