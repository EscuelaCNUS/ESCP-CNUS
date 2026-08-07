"use client";
import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const COOLDOWN_MS = 5_000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactoPage() {
  const [formData, setFormData] = useState({ nombre: "", apellido: "", email: "", motivo: "" });
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  const lastSentRef = useRef(0);
  const cooldownTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    };
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    }
  };

  const validate = () => {
    const errors = {};
    const nombre = formData.nombre.trim();
    const email = formData.email.trim();
    const motivo = formData.motivo.trim();

    if (!nombre) errors.nombre = "El nombre es obligatorio";
    else if (nombre.length > 100) errors.nombre = "Máximo 100 caracteres";

    if (!email) errors.email = "El correo es obligatorio";
    else if (!EMAIL_REGEX.test(email)) errors.email = "Correo electrónico no válido";

    if (!motivo) errors.motivo = "El motivo es obligatorio";
    else if (motivo.length > 500) errors.motivo = "Máximo 500 caracteres";

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const now = Date.now();
    if (now - lastSentRef.current < COOLDOWN_MS) {
      const remaining = Math.ceil((COOLDOWN_MS - (now - lastSentRef.current)) / 1000);
      setCooldown(remaining);
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
      cooldownTimerRef.current = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) { clearInterval(cooldownTimerRef.current); return 0; }
          return prev - 1;
        });
      }, 1000);
      return;
    }

    setSending(true);
    setSendError(false);

    let ok = false;
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          apellido: formData.apellido.trim(),
          email: formData.email.trim(),
          motivo: formData.motivo.trim(),
        }),
      });
      ok = res.ok;
    } catch {
      ok = false;
    }

    setSending(false);
    if (ok) {
      lastSentRef.current = Date.now();
      setSubmitted(true);
    } else {
      setSendError(true);
    }
  };

  const inputClass = (field) =>
    `w-full h-[60px] md:h-[79px] px-5 rounded-full text-gray-900 bg-white focus:outline-none focus:ring-2 ${
      fieldErrors[field] ? "ring-2 ring-red-400" : "focus:ring-blue-500"
    }`;

  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleEmailClick = (e) => {
    try {
      navigator.clipboard.writeText("info@escuelacnus.com");
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 3000);
    } catch {
      // fallback
    }
  };

  return (
    <main className="w-full bg-white relative">
      {copiedEmail && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0045A5] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 animate-bounce">
          <span className="font-semibold">¡Correo copiado al portapapeles!</span>
          <span className="text-blue-200 text-sm">(info@escuelacnus.com)</span>
        </div>
      )}
      <section className="relative w-full h-[280px] md:h-[450px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('/imagenes/contacto%20banner.png')` }} />
        <div className="absolute inset-0 bg-black/50" aria-label="Fondo de banner" />
        <Navbar />
        <div className="relative z-10 h-full flex flex-col items-center justify-center pb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-white text-center mt-20">Contáctanos</h1>
        </div>
      </section>

      <section className="max-w-[1680px] mx-auto px-4 tablet:px-7.5 laptop:px-20 pt-[200px] mb-[200px] pb-16 md:pb-24 flex flex-col lg:flex-row gap-10 lg:gap-[24px]">
        <div className="w-full lg:w-1/2 shrink-0 bg-[#0B1426] rounded-[32px] md:rounded-[40px] p-8 md:p-14 py-12 text-white flex flex-col items-center justify-center">
          <div className="w-full max-w-[697px] flex flex-col">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 md:mb-14">Tu formación comienza con una conversación</h2>

            {!submitted ? (
              <form className="flex flex-col gap-[24px]" onSubmit={handleSubmit} noValidate>
                <div className="flex flex-col md:flex-row gap-[15px]">
                  <div className="flex flex-col gap-[15px] flex-1">
                    <label className="text-md font-medium" htmlFor="nombre">Nombre</label>
                    <input id="nombre" name="nombre" type="text" autoComplete="given-name" value={formData.nombre} onChange={handleChange} placeholder="Ejemplo: Pedro" className={inputClass("nombre")} required maxLength={100} />
                    {fieldErrors.nombre && <p className="text-red-400 text-xs ml-2">{fieldErrors.nombre}</p>}
                  </div>
                  <div className="flex flex-col gap-[15px] flex-1">
                    <label className="text-sm font-medium" htmlFor="apellido">Apellido</label>
                    <input id="apellido" name="apellido" type="text" autoComplete="family-name" value={formData.apellido} onChange={handleChange} placeholder="Ejemplo: Martinez" className="w-full h-[60px] md:h-[79px] px-5 rounded-full text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" maxLength={100} />
                  </div>
                </div>

                <div className="flex flex-col gap-[15px]">
                  <label className="text-sm font-medium" htmlFor="email">Correo electrónico</label>
                  <input id="email" name="email" type="email" autoComplete="email" value={formData.email} onChange={handleChange} placeholder="Ejemplo@correo.com" className={inputClass("email")} required />
                  {fieldErrors.email && <p className="text-red-400 text-xs ml-2">{fieldErrors.email}</p>}
                </div>

                <div className="flex flex-col gap-[15px]">
                  <label className="text-sm font-medium" htmlFor="motivo">Motivo</label>
                  <textarea id="motivo" name="motivo" value={formData.motivo} onChange={handleChange} placeholder="Ejemplo: Recibir información sobre futuros programas" maxLength={500} className={`w-full h-[150px] md:h-[190px] p-5 rounded-[24px] md:rounded-[32px] text-gray-900 bg-white focus:outline-none focus:ring-2 resize-none ${fieldErrors.motivo ? "ring-2 ring-red-400" : "focus:ring-blue-500"}`} required />
                  {fieldErrors.motivo && <p className="text-red-400 text-xs ml-2">{fieldErrors.motivo}</p>}
                </div>

                {cooldown > 0 && <p className="text-amber-300 text-sm text-center">Espera {cooldown}s antes de enviar otro mensaje.</p>}
                {sendError && <p className="text-red-400 text-sm text-center">Error al enviar. Intenta de nuevo.</p>}

                <button type="submit" disabled={sending || cooldown > 0} className="w-full h-[70px] md:h-[89px] bg-[#0045A5] hover:bg-blue-700 disabled:opacity-50 text-white text-lg tablet:text-2xl laptop:text-2xl font-semibold rounded-full transition cursor-pointer flex items-center justify-center gap-2">
                  <Send size={20} /> {sending ? "Enviando..." : "Enviar"}
                </button>
              </form>
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">¡Mensaje enviado!</h3>
                <p className="text-blue-100">Gracias por contactarnos. Te responderemos pronto.</p>
                <button onClick={() => { setSubmitted(false); setFormData({ nombre: "", apellido: "", email: "", motivo: "" }); setFieldErrors({}); }} className="mt-6 border border-white text-white hover:bg-white hover:text-blue-800 font-semibold py-3 px-8 rounded-full transition cursor-pointer">
                  Enviar otro mensaje
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col pt-4">
          <h3 className="text-xl md:text-[22px] text-gray-800 mb-10 max-w-full leading-relaxed">
           Si necesitas información sobre nuestros programas de formación, inscripciones, horarios o cualquier otro tema, no dudes en comunicarte con nosotros. Nuestro equipo estará encantado de atenderte y brindarte la orientación que necesites.
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            <a href="tel:+18097892158" className="flex items-center gap-4 p-6 rounded-3xl border border-gray-800 hover:border-blue-600 hover:bg-blue-50/50 transition cursor-pointer group">
              <div className="flex flex-col"><span className="font-semibold text-gray-900 text-sm">Número de teléfono</span><span className="text-gray-700 group-hover:text-blue-600 text-sm font-medium">809-789-2158</span></div>
            </a>
            <a href="mailto:info@escuelacnus.com" onClick={handleEmailClick} className="flex items-center gap-4 p-6 rounded-3xl border border-gray-800 hover:border-blue-600 hover:bg-blue-50/50 transition cursor-pointer group">
              <div className="flex flex-col"><span className="font-semibold text-gray-900 text-sm">Correo</span><span className="text-gray-700 group-hover:text-blue-600 text-sm font-medium">info@escuelacnus.com</span></div>
            </a>
            <a href="https://wa.me/18097892158" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-6 rounded-3xl border border-gray-800 hover:border-green-600 hover:bg-green-50/50 transition cursor-pointer group">
              <div className="flex flex-col"><span className="font-semibold text-gray-900 text-sm">WhatsApp</span><span className="text-gray-700 group-hover:text-green-600 text-sm font-medium">809-789-2158</span></div>
            </a>
            <a href="https://www.google.com/maps/dir/?api=1&destination=Confederacion+Nacional+Unidad+Sindical+CNUS" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-6 rounded-3xl border border-gray-800 hover:border-blue-600 hover:bg-blue-50/50 transition cursor-pointer group">
              <div className="flex flex-col"><span className="font-semibold text-gray-900 text-sm">Dirección</span><span className="text-gray-700 group-hover:text-blue-600 text-sm leading-tight mt-1">Calle Juan Erazo No. 14, Edificio Centrales Sindicales, Villa Juana, Santo Domingo, D.N.</span></div>
            </a>
          </div>
          <div className="w-full h-[350px] lg:h-auto lg:flex-grow bg-gray-200 rounded-[32px] overflow-hidden">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.018921616773!2d-69.90707139999999!3d18.4828021!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf89929175acc5%3A0x1351b1636dd07019!2sConfederaci%C3%B3n%20Nacional%20Unidad%20Sindical%20-%20CNUS!5e0!3m2!1ses-419!2sdo!4v1783715132501!5m2!1ses-419!2sdo" width="100%" height="100%" style={{ minHeight: '350px' }} className="border-0" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" title="Ubicación CNUS" />
          </div>
        </div>
      </section>
    </main>
  );
}
