"use client";
import { useState } from "react";
import Image from "next/image";
import { Mail } from "lucide-react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterSection() {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email.value.trim();
    if (!EMAIL_REGEX.test(email)) {
      setErrorMsg("Por favor ingresa un correo electrónico válido.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data?.message || "No se pudo procesar tu suscripción. Intenta de nuevo.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("No se pudo procesar tu suscripción. Intenta de nuevo.");
      setStatus("error");
    }
  };

  return (
    <section id="newsletter" className="max-w-[1680px] w-full mx-auto px-4 tablet:px-15 laptop:px-20 desktop:px-6 py-20 laptop:pt-0 laptop:pb-0 mb-[120px] tablet:mb-[200px]">
      <div className="flex flex-col laptop:flex-row rounded-3xl overflow-hidden bg-[#0045A5] laptop:h-[719px]">
        
        {/* Left Side: Image */}
        <div className="laptop:w-1/2 relative h-70 tablet:h-90 laptop:h-full">
          <Image 
            src="/imagenes/nwslate.png" 
            alt="Mantente conectado"
            fill
            className="object-cover object-left-top"
          />
        </div>

        {/* Right Side: Form */}
        <div className="laptop:w-1/2 p-10 tablet:p-16 laptop:py-8 laptop:px-10 flex flex-col justify-center items-center text-white">
          <div className="w-full max-w-146.5 flex flex-col text-left">
            <h2 className="text-3xl tablet:text-4xl laptop:text-3xl laptop:text-5xl font-bold mb-4 laptop:mb-2">Mantente conectado</h2>
            <p className="text-blue-100 mb-10 laptop:mb-5 text-[16px] tablet:text-[18px] laptop:text-[20px] laptop:text-[15px] leading-relaxed">
              Suscríbete a nuestro boletín y recibe las noticias más importantes, eventos, recursos exclusivos y oportunidades directamente en tu bandeja de entrada.
            </p>

            {status === "idle" || status === "error" ? (
              <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit} noValidate>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    id="newsletter-email"
                    type="email" 
                    name="email"
                    placeholder="Ejemplo@correo.com" 
                    aria-label="Correo electrónico para boletín"
                    aria-invalid={status === "error"}
                    className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                    required
                  />
                </div>
                {status === "error" && (
                  <p className="text-red-300 text-sm text-center" role="alert">{errorMsg}</p>
                )}
                <button 
                  type="submit" 
                  disabled={status === "loading"}
                  className="w-full bg-transparent border border-white hover:bg-white hover:text-black text-white font-semibold py-4 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? "Enviando..." : "Suscribirme"}
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center gap-4 py-6 text-center">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">¡Gracias por suscribirte!</h3>
                <p className="text-blue-100 text-[16px] leading-relaxed">
                  Te mantendremos al tanto de las novedades.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-2 border border-white text-white hover:bg-white hover:text-blue-800 font-semibold py-3 px-8 rounded-full transition"
                >
                  Volver
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
