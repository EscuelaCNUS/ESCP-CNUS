export default function CommunityCTA() {
  return (
    <div className="w-full px-4 tablet:px-7.5 laptop:px-20 desktop:px-29.5 max-w-[1920px] mx-auto pb-16 laptop:pb-20">
      <div className="bg-gradient-to-r from-[#0A1628] via-[#1A2D5A] to-[#0A1628] rounded-[28px] p-8 laptop:p-12 text-center">
        <h3 className="text-2xl laptop:text-[32px] font-bold text-white mb-4">
          ¿Tienes un tema para debatir?
        </h3>
        <p className="text-white/60 text-sm laptop:text-[16px] max-w-[600px] mx-auto mb-6">
          Propón un tema de discusión y la comunidad votará para incluirlo en nuestros próximos debates.
        </p>
        <a href="mailto:info@escuela-cnus.com" className="inline-block h-[52px] px-8 bg-[#06B6D4] hover:bg-[#0891B2] text-white font-semibold text-[15px] rounded-full transition-all leading-[52px]">
          Proponer tema
        </a>
      </div>
    </div>
  );
}
