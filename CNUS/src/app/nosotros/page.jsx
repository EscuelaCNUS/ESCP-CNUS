import Navbar from "@/components/Navbar";
import NosotrosTabs from "@/components/nosotros/NosotrosTabs";

export default function NosotrosPage() {
  return (
    <main className="w-full bg-white flex flex-col min-h-screen overflow-x-hidden">
      <section className="relative w-full h-[360px] tablet:h-[440px] laptop:h-[480px] flex flex-col overflow-hidden mb-[200px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')` }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <Navbar />
        <div className="relative z-10 flex-1 flex items-center justify-center text-center px-4">
          <h1 className="text-4xl tablet:text-5xl laptop:text-6xl font-light tracking-tight text-white text-center mt-12 tablet:mt-0">
            Sobre nosotros
          </h1>
        </div>
      </section>

      <NosotrosTabs />
    </main>
  );
}