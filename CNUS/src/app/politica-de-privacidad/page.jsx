import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Política de privacidad | Escuela CNUS",
  description:
    "Qué datos personales recoge escuelacnus.com, para qué se usan, con quién se comparten y cómo ejercer tus derechos.",
  alternates: { canonical: "/politica-de-privacidad" },
};

const ACTUALIZADO = "7 de agosto de 2026";

function Seccion({ id, numero, titulo, children }) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="flex items-baseline gap-3 text-[22px] tablet:text-[26px] font-bold text-[#05162D] tracking-[-0.02em] mb-4">
        <span className="shrink-0 text-[13px] font-bold text-[#0045A5] border border-[#E0E4EA] rounded-full px-2.5 py-0.5 tabular-nums relative -top-0.5">
          {numero}
        </span>
        {titulo}
      </h2>
      <div className="flex flex-col gap-4 text-[16px] tablet:text-[17px] leading-[1.75] text-[#3D4E63]">
        {children}
      </div>
    </section>
  );
}

function Tabla({ cabeceras, filas }) {
  return (
    <div className="overflow-x-auto border border-[#E0E4EA] rounded-[14px]">
      <table className="w-full border-collapse text-[15px]">
        <thead>
          <tr>
            {cabeceras.map((c) => (
              <th
                key={c}
                scope="col"
                className="text-left bg-[#F7F9FB] text-[#667085] text-[12px] font-bold uppercase tracking-[0.06em] px-4 py-3 border-b border-[#EEF1F5]"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila, i) => (
            <tr key={i}>
              {fila.map((celda, j) => (
                <td
                  key={j}
                  className={`px-4 py-3 align-top text-[#3D4E63] ${
                    i < filas.length - 1 ? "border-b border-[#EEF1F5]" : ""
                  } ${j === 0 ? "font-semibold text-[#05162D] whitespace-nowrap" : ""}`}
                >
                  {celda}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PoliticaPrivacidadPage() {
  return (
    <main className="w-full bg-white flex flex-col min-h-screen overflow-x-hidden">
      {/* Cabecera */}
      <section className="relative w-full bg-[#05162D] flex flex-col overflow-hidden">
        <Navbar />
        <div className="relative z-10 w-full max-w-[1680px] mx-auto px-4 tablet:px-7.5 laptop:px-20 pt-36 tablet:pt-44 pb-14 tablet:pb-20">
          <p className="text-[#22D3EE] text-[13px] font-bold uppercase tracking-[0.14em] mb-3">
            Información legal
          </p>
          <h1 className="text-white text-[32px] tablet:text-[44px] laptop:text-[52px] font-bold leading-[1.08] tracking-[-0.03em] text-balance max-w-[20ch]">
            Política de privacidad
          </h1>
          <p className="text-[#C6D2E2] text-[16px] tablet:text-[18px] leading-relaxed mt-5 max-w-[60ch]">
            Qué datos recogemos cuando usas este sitio, para qué los usamos y
            cómo puedes pedirnos que los eliminemos.
          </p>
          <p className="text-[#8FA3BC] text-[14px] mt-6">
            Última actualización: {ACTUALIZADO}
          </p>
        </div>
      </section>

      {/* Contenido */}
      <div className="w-full max-w-[1680px] mx-auto px-4 tablet:px-7.5 laptop:px-20 py-16 tablet:py-24 mb-[120px] tablet:mb-[160px]">
        <div className="max-w-[68ch] flex flex-col gap-12 tablet:gap-14">

          <Seccion id="responsable" numero="1" titulo="Quién trata tus datos">
            <p>
              El responsable de este sitio es la{" "}
              <strong className="text-[#05162D]">
                Escuela CNUS de Sindicalismo Sociopolítico (ESCP)
              </strong>
              , de la Confederación Nacional de Unidad Sindical, en República
              Dominicana.
            </p>
            <p>
              Para cualquier asunto relacionado con tus datos personales puedes
              escribir a{" "}
              <a href="mailto:info@escuelacnus.com" className="text-[#0045A5] underline underline-offset-2 hover:text-[#003380]">
                info@escuelacnus.com
              </a>{" "}
              o llamar al{" "}
              <a href="tel:+18097892158" className="text-[#0045A5] underline underline-offset-2 hover:text-[#003380]">
                809-789-2158
              </a>
              .
            </p>
          </Seccion>

          <Seccion id="datos" numero="2" titulo="Qué datos recogemos">
            <p>
              Solo recogemos datos cuando tú decides dárnoslos rellenando alguno
              de los tres formularios del sitio. No hay ningún otro momento en
              que se recojan datos personales.
            </p>
            <Tabla
              cabeceras={["Cuándo", "Qué pedimos"]}
              filas={[
                ["Al comentar", "Nombre, apellido (opcional) y el texto de tu comentario"],
                ["Al escribirnos", "Nombre, apellido, correo electrónico y el motivo de tu mensaje"],
                ["Al suscribirte al boletín", "Correo electrónico y, si los indicas, nombre y apellido"],
              ]}
            />
            <p>
              Los campos marcados como obligatorios son los mínimos para que el
              formulario cumpla su función. El resto puedes dejarlos en blanco.
            </p>
          </Seccion>

          <Seccion id="comentarios" numero="3" titulo="Tus comentarios son públicos">
            <p>
              Cuando comentas en un artículo o respondes a un debate, tu{" "}
              <strong className="text-[#05162D]">nombre y tu comentario quedan visibles</strong>{" "}
              para cualquier visitante. No es un mensaje privado.
            </p>
            <p>
              Piénsalo antes de escribir información personal que no quieras que
              otros lean. No pedimos tu correo para comentar, precisamente para
              no vincular tu comentario a una dirección de contacto.
            </p>
          </Seccion>

          <Seccion id="uso" numero="4" titulo="Para qué usamos tus datos">
            <Tabla
              cabeceras={["Dato", "Uso"]}
              filas={[
                ["Comentarios", "Publicarlos en el artículo o debate correspondiente"],
                ["Mensajes de contacto", "Leer tu consulta y responderte"],
                ["Correo del boletín", "Enviarte las novedades de la Escuela"],
              ]}
            />
            <p>
              <strong className="text-[#05162D]">No vendemos ni cedemos tus datos</strong>{" "}
              a terceros con fines comerciales, ni los usamos para publicidad, ni
              elaboramos perfiles con ellos.
            </p>
          </Seccion>

          <Seccion id="cookies" numero="5" titulo="No usamos cookies ni rastreadores">
            <p>
              Este sitio{" "}
              <strong className="text-[#05162D]">no instala cookies</strong> en tu
              navegador. Tampoco usamos Google Analytics, píxeles de redes
              sociales ni ninguna herramienta que siga tu actividad dentro o
              fuera de la web.
            </p>
            <p>
              Por eso no verás el típico aviso de cookies: no hay nada que
              aceptar.
            </p>
          </Seccion>

          <Seccion id="tecnicos" numero="6" titulo="Datos técnicos">
            <p>
              Como cualquier sitio en internet, nuestros servidores registran de
              forma automática datos técnicos de las visitas —dirección IP,
              navegador, páginas solicitadas— durante un periodo corto. Sirven
              para detectar errores y ataques, y se descartan después.
            </p>
            <p>
              Para evitar el envío masivo de formularios limitamos cuántas veces
              se puede enviar cada uno por minuto. Ese control usa tu dirección
              IP{" "}
              <strong className="text-[#05162D]">
                convertida en un código irreversible
              </strong>
              : no guardamos la IP original, y el código se descarta al cabo de
              un minuto.
            </p>
          </Seccion>

          <Seccion id="terceros" numero="7" titulo="Con quién compartimos los datos">
            <p>
              Para que el sitio funcione nos apoyamos en proveedores de servicio.
              Acceden a los datos únicamente para prestarnos su servicio y no
              pueden usarlos para otra cosa.
            </p>
            <Tabla
              cabeceras={["Proveedor", "Qué hace"]}
              filas={[
                ["Supabase", "Guarda los comentarios, los mensajes de contacto y la lista de suscriptores"],
                ["Resend", "Entrega los correos y mantiene la lista del boletín"],
                ["Vercel", "Aloja y sirve la página web"],
                ["Railway", "Aloja el sistema donde el equipo redacta los contenidos"],
                ["Cloudinary", "Guarda y optimiza las imágenes"],
              ]}
            />
            <p>
              Sus servidores están fuera de República Dominicana, principalmente
              en Estados Unidos y Europa, así que tus datos se almacenan y
              procesan allí.
            </p>
          </Seccion>

          <Seccion id="conservacion" numero="8" titulo="Cuánto tiempo los guardamos">
            <Tabla
              cabeceras={["Dato", "Plazo"]}
              filas={[
                ["Comentarios", "Mientras el artículo o debate siga publicado"],
                ["Mensajes de contacto", "El tiempo necesario para atender la consulta y dejar constancia"],
                ["Boletín", "Hasta que te des de baja"],
                ["Registros técnicos", "Días, y se descartan automáticamente"],
              ]}
            />
            <p>
              Si nos pides que eliminemos tus datos, lo hacemos aunque no se haya
              cumplido el plazo.
            </p>
          </Seccion>

          <Seccion id="derechos" numero="9" titulo="Tus derechos">
            <p>
              De acuerdo con la Ley No. 172-13 sobre Protección de Datos de
              Carácter Personal de República Dominicana, puedes pedirnos en
              cualquier momento que:
            </p>
            <ul className="flex flex-col gap-2 pl-5 list-disc marker:text-[#98A2B3]">
              <li>Te digamos qué datos tuyos tenemos</li>
              <li>Corrijamos los que estén equivocados</li>
              <li>Eliminemos los que ya no quieras que conservemos</li>
              <li>Dejemos de usarlos para una finalidad concreta</li>
            </ul>
            <p>
              Escribe a{" "}
              <a href="mailto:info@escuelacnus.com" className="text-[#0045A5] underline underline-offset-2 hover:text-[#003380]">
                info@escuelacnus.com
              </a>{" "}
              indicando qué necesitas. Te responderemos lo antes posible.
            </p>
            <div className="bg-[#F7F9FB] border-l-[3px] border-[#0045A5] rounded-r-[10px] px-5 py-4 text-[#3D4E63]">
              <p>
                Para darte de baja del boletín no hace falta escribirnos: cada
                correo que enviamos incluye un enlace para cancelar la
                suscripción de un clic.
              </p>
            </div>
          </Seccion>

          <Seccion id="seguridad" numero="10" titulo="Cómo protegemos tus datos">
            <p>
              La conexión con el sitio va cifrada de extremo a extremo. Los
              mensajes de contacto y la lista de suscriptores están configurados
              para que no puedan leerse desde fuera: solo el equipo de la Escuela
              tiene acceso.
            </p>
            <p>
              Ningún sistema es infalible. Si alguna vez ocurriera un incidente
              que afecte a tus datos, te informaríamos.
            </p>
          </Seccion>

          <Seccion id="menores" numero="11" titulo="Menores de edad">
            <p>
              Este sitio se dirige a personas trabajadoras y dirigentes
              sindicales, es decir, mayores de edad. No recogemos datos de
              menores de forma consciente. Si detectas que un menor nos ha
              facilitado datos, escríbenos y los eliminaremos.
            </p>
          </Seccion>

          <Seccion id="cambios" numero="12" titulo="Cambios en esta política">
            <p>
              Si cambiamos la forma en que tratamos los datos, actualizaremos
              esta página y la fecha que aparece arriba. Te recomendamos
              revisarla de vez en cuando.
            </p>
          </Seccion>

        </div>
      </div>
    </main>
  );
}
