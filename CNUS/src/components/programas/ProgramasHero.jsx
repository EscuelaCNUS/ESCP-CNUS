import Image from "next/image";
import Navbar from "../Navbar";

export default function ProgramasHero() {
  return (
    <section className="relative w-full h-[280px] md:h-[450px] flex flex-col">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Estudiantes en clase"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        {/* Dark Overlay with subtle gradient */}
        <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      <Navbar />

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-light tracking-wide mt-10 md:mt-0">
          Programas
        </h1>
      </div>
    </section>
  );
}
