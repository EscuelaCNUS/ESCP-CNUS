"use client";
import { useState, useRef, useEffect } from "react";

const COOLDOWN_MS = 5_000;
const MAX_CHARS = 500;

export default function OpinionForm({ articuloSlug }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [cooldown, setCooldown] = useState(0);
  const lastSentRef = useRef(0);
  const cooldownTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    };
  }, []);

  const validate = () => {
    const errors = {};
    const trimmedNombre = nombre.trim();
    const trimmedTexto = texto.trim();

    if (!trimmedNombre) errors.nombre = "El nombre es obligatorio";
    else if (trimmedNombre.length > 100) errors.nombre = "Máximo 100 caracteres";

    if (!trimmedTexto) errors.texto = "La respuesta es obligatoria";
    else if (trimmedTexto.length > MAX_CHARS) errors.texto = `Máximo ${MAX_CHARS} caracteres`;

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const now = Date.now();
    const elapsed = now - lastSentRef.current;
    if (elapsed < COOLDOWN_MS) {
      const remaining = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
      setCooldown(remaining);
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
      cooldownTimerRef.current = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(cooldownTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return;
    }

    setLoading(true);
    setError(false);

    let res;
    try {
      res = await fetch("/api/comentarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articulo_slug: articuloSlug,
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          texto: texto.trim(),
        }),
      });
    } catch {
      res = null;
    }

    setLoading(false);
    if (res && res.ok) {
      lastSentRef.current = Date.now();
      setSuccess(true);
      setNombre("");
      setApellido("");
      setTexto("");
    } else {
      setError(true);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-[800px] mx-auto mt-20 mb-32 px-6 text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 className="text-2xl font-bold text-[#05162D] mb-2">¡Gracias por tu opinión!</h2>
        <p className="text-gray-500 mb-6">Tu comentario ha sido publicado.</p>
        <button
          onClick={() => setSuccess(false)}
          className="text-[#0E52C6] font-medium hover:underline"
        >
          Escribir otro comentario
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[800px] mx-auto mt-20 mb-32 px-6">
      <h2 className="text-center text-3xl md:text-[40px] font-bold text-[#05162D] mb-12">
        ¿Qué opinas sobre el tema?
      </h2>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-[#05162D] font-medium ml-1">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ejemplo: Pedro"
              required
              maxLength={100}
              className={`w-full h-[60px] rounded-full border px-6 text-[#05162D] placeholder:text-[#98A2B3] focus:outline-none transition ${
                fieldErrors.nombre ? "border-red-400" : "border-[#D0D5DD] focus:border-primary"
              }`}
            />
            {fieldErrors.nombre && <p className="text-red-500 text-xs ml-2">{fieldErrors.nombre}</p>}
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-[#05162D] font-medium ml-1">Apellido</label>
            <input
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              placeholder="Ejemplo: Martínez"
              maxLength={100}
              className="w-full h-[60px] rounded-full border border-[#D0D5DD] px-6 text-[#05162D] placeholder:text-[#98A2B3] focus:outline-none focus:border-primary transition"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[#05162D] font-medium ml-1">
            Respuesta <span className="text-gray-400 font-normal">({texto.length}/{MAX_CHARS})</span>
          </label>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribe tu opinión sobre el tema..."
            required
            maxLength={MAX_CHARS}
            className={`w-full h-[150px] rounded-[24px] border p-6 text-[#05162D] placeholder:text-[#98A2B3] focus:outline-none transition resize-none ${
              fieldErrors.texto ? "border-red-400" : "border-[#D0D5DD] focus:border-primary"
            }`}
          />
          {fieldErrors.texto && <p className="text-red-500 text-xs ml-2">{fieldErrors.texto}</p>}
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">
            Hubo un error al enviar tu comentario. Intenta de nuevo.
          </p>
        )}

        {cooldown > 0 && (
          <p className="text-amber-600 text-sm text-center">
            Espera {cooldown}s antes de enviar otro comentario.
          </p>
        )}

        <div className="flex justify-center mt-4">
          <button
            type="submit"
            disabled={loading || cooldown > 0}
            className="w-[200px] h-[60px] bg-[#0E52C6] hover:bg-blue-800 disabled:opacity-50 text-white rounded-full font-medium text-lg transition-colors"
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </form>
    </div>
  );
}
