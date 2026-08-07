"use client";

import { useState } from "react";
import Image from "next/image";
import TabNav from "@/components/ui/TabNav";
import { TargetIcon, EyeIcon, CheckCircleIcon, ValorIcon } from "./icons";

const TABS = [
  { id: "quienes-somos", label: "¿Quiénes somos?" },
  { id: "perfil-sociopolitico", label: "Perfil Sociopolítico" },
  { id: "vision-formativa", label: "Visión y enfoque" },
];

const valores = [
  { icono: "Users", titulo: "Justicia Social", descripcion: "Defensa de una sociedad más justa, con mejores condiciones de vida y trabajo para la clase trabajadora." },
  { icono: "HeartHandshake", titulo: "Equidad de Género", descripcion: "Promoción de la igualdad real entre mujeres y hombres en el mundo laboral, sindical, social, educativo y político." },
  { icono: "Vote", titulo: "Democracia Sindical", descripcion: "Participación, consulta, transparencia, rendición de cuentas y toma colectiva de decisiones." },
  { icono: "ShieldCheck", titulo: "Ética Sindical", descripcion: "Actuación coherente, responsable y transparente en la defensa del interés colectivo." },
  { icono: "Layers", titulo: "Solidaridad", descripcion: "Compromiso colectivo entre trabajadores, organizaciones sindicales y sectores sociales vulnerables." },
  { icono: "Megaphone", titulo: "Incidencia Sociopolítica", descripcion: "Capacidad de transformar demandas laborales en propuestas de país y políticas públicas." },
];

const objetivos = [
  "Fortalecer a la CNUS y sus organizaciones sindicales como sujetos principales de la acción sindical, sociopolítica y democrática.",
  "Incorporar la equidad de género como eje transversal en todos los contenidos, metodologías y procesos formativos.",
  "Promover el liderazgo de las mujeres trabajadoras en los espacios sindicales, de negociación, diálogo e incidencia.",
  "Desarrollar capacidades en derecho laboral, libertad sindical, negociación colectiva y seguridad social.",
  "Impulsar el diálogo social como medio para el debate, la codificación ética, el consenso y los acuerdos democráticos.",
  "Fortalecer la capacidad de incidencia de la CNUS en políticas públicas nacionales y sectoriales.",
  "Construir agendas sindicales sectoriales que articulen trabajo decente, desarrollo productivo, justicia social y equidad de género.",
];

const esquemas = [
  { icono: "GraduationCap", titulo: "Educación Popular y Participativa", descripcion: "Metodología participativa, crítica y democrática vinculada a la realidad concreta de los trabajadores. Cada proceso produce resultados prácticos: diagnósticos, documentos de posición, agendas sectoriales y planes de incidencia." },
  { icono: "BookOpen", titulo: "Flexibilidad de Modalidades", descripcion: "Modalidades presenciales, virtuales, híbridas y modulares adaptadas a los horarios laborales y a la dispersión geográfica. Incluye diplomado sindical sociopolítico, círculos de estudio y mesas sectoriales de formación." },
  { icono: "Lightbulb", titulo: "Enfoque Sectorial", descripcion: "La Escuela incorpora un enfoque sectorial que permite a cada organización analizar su realidad específica, construir diagnósticos y formular propuestas de incidencia en las macropolíticas de su sector." },
];

const pilares = [
  "Talleres, exposiciones dialogadas y debates democráticos",
  "Simulaciones de negociación colectiva y mediación",
  "Análisis de coyuntura y laboratorios sectoriales",
  "Investigación aplicada y sistematización de experiencias",
  "Acompañamiento tutorial continuo en plataforma virtual",
  "Elaboración de propuestas y evaluación participativa",
];

export default function NosotrosTabs() {
  const [activeTab, setActiveTab] = useState("quienes-somos");

  return (
    <>
      <TabNav tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "quienes-somos" && <QuienesSomosTab />}
      {activeTab === "perfil-sociopolitico" && <PerfilSociopoliticoTab />}
      {activeTab === "vision-formativa" && <VisionFormativaTab />}
    </>
  );
}

function QuienesSomosTab() {
  return (
    <div>
      <section className="w-full max-w-[1680px] mx-auto px-4 tablet:px-[60px] laptop:px-20 mb-[200px]">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-[166px]">
          <div className="w-full lg:w-[420px] h-[340px] tablet:h-[440px] lg:h-[541px] flex items-center justify-center shrink-0 relative">
            <Image
              src="/logos/logocolor.svg"
              alt="Escuela CNUS de Sindicalismo Sociopolítico"
              fill
              unoptimized
              className="object-contain"
            />
          </div>
          <div className="flex-1 flex flex-col justify-center text-left">
            <h2 className="text-3xl tablet:text-4xl laptop:text-[44px] font-bold text-[#05162D] leading-tight mb-8">
              Un espacio de formación, reflexión y transformación
            </h2>
            <p className="text-gray-600 text-base tablet:text-lg leading-relaxed mb-6">
              La Escuela CNUS de Sindicalismo Sociopolítico (ECSP) se concibe como un espacio institucional de formación, reflexión, articulación e incidencia al servicio de la Confederación Nacional de Unidad Sindical (CNUS) y de sus organizaciones afiliadas, de la que actúa como un mecanismo auxiliar destinado a fortalecerlos como sujetos principales de la acción sindical, social, política y democrática en República Dominicana.
            </p>
            <p className="text-gray-600 text-base tablet:text-lg leading-relaxed">
              Su creación responde a la necesidad de renovar y fortalecer el sindicalismo dominicano ante los desafíos actuales: desigualdades sociales, altos niveles de informalidad laboral, precarización del empleo, brechas salariales, debilidades en la seguridad social y limitada participación de los trabajadores en la definición de políticas públicas.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full bg-[#f4f6f8] py-20 mb-[200px]">
        <div className="max-w-[1680px] mx-auto px-4 tablet:px-[60px] laptop:px-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-[32px] p-8 tablet:p-12 shadow-sm border border-gray-100 flex flex-col gap-6">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-[#0045A5] flex items-center justify-center shrink-0">
              <TargetIcon />
            </div>
            <div>
              <h3 className="text-2xl tablet:text-3xl font-bold text-[#05162D] mb-4">Nuestra Misión</h3>
              <p className="text-gray-600 text-base tablet:text-lg leading-relaxed">
                Formar trabajadores, trabajadoras, dirigentes sindicales y líderes sociales vinculados a la CNUS y sus organizaciones afiliadas, con conciencia crítica, ética democrática, perspectiva de género, conocimiento jurídico-laboral, capacidad sectorial y visión sociopolítica, para fortalecer la acción sindical, promover el diálogo social, construir consensos e incidir en las políticas públicas nacionales y sectoriales en defensa de los derechos de la clase trabajadora y de una sociedad dominicana más justa, democrática, equitativa e inclusiva.
              </p>
            </div>
          </div>

          <div className="bg-[#0045A5] rounded-[32px] p-8 tablet:p-12 text-white flex flex-col gap-6 shadow-md">
            <div className="w-14 h-14 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
              <EyeIcon />
            </div>
            <div>
              <h3 className="text-2xl tablet:text-3xl font-bold text-white mb-4">Nuestra Visión</h3>
              <p className="text-blue-100 text-base tablet:text-lg leading-relaxed">
                Ser una Escuela de referencia nacional en formación sindical sociopolítica, reconocida por fortalecer a la CNUS y a sus organizaciones afiliadas como sujetos principales de la acción laboral, social, sectorial y democrática, promoviendo liderazgos éticos, inclusivos, con equidad de género y capacidad de incidencia en la transformación de la realidad dominicana.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-[1680px] mx-auto px-4 tablet:px-[60px] laptop:px-20 mb-[200px]">
        <div className="text-center mb-16">
          <h2 className="text-3xl tablet:text-4xl laptop:text-5xl font-bold text-[#05162D]">Nuestros valores</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {valores.map(({ icono, titulo, descripcion }) => (
            <div key={titulo} className="bg-white border border-gray-100 shadow-sm rounded-[24px] p-8 flex flex-col items-start text-left hover:border-blue-200 hover:shadow-md transition duration-300">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0045A5] flex items-center justify-center mb-6">
                <ValorIcon icono={icono} />
              </div>
              <h3 className="text-xl font-bold text-[#05162D] mb-3">{titulo}</h3>
              <p className="text-gray-600 text-sm tablet:text-base leading-relaxed">{descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full bg-[#0B1426] py-20 text-white mb-[200px]">
        <div className="max-w-[1680px] mx-auto px-4 tablet:px-[60px] laptop:px-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl tablet:text-4xl laptop:text-5xl font-bold text-white">Objetivos Específicos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {objetivos.map((objetivo, index) => (
              <div key={index} className="bg-white rounded-full py-4 px-8 text-gray-900 flex items-center gap-6 shadow-md">
                <span className="text-[#0045A5] font-bold text-xl tablet:text-2xl shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-gray-800 text-sm tablet:text-base font-medium leading-snug">{objetivo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function PerfilSociopoliticoTab() {
  return (
    <div>
      <section className="w-full max-w-[1680px] mx-auto px-4 tablet:px-[60px] laptop:px-20 mb-[200px]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl tablet:text-4xl laptop:text-5xl font-bold text-[#05162D] mb-6">
            Perfil Sociopolítico e Identidad
          </h2>
          <p className="text-gray-600 text-base tablet:text-lg leading-relaxed">
            Entendemos que las reivindicaciones laborales van de la mano de la transformación social, económica e institucional del país.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {[
            {
              icono: "Scale",
              titulo: "Propósito Central",
              descripcion: "El propósito de la ECSP es fortalecer las capacidades de la CNUS y de sus organizaciones afiliadas para defender derechos laborales, formular propuestas, participar en el diálogo social, construir consensos e incidir en las políticas públicas nacionales y sectoriales."
            },
            {
              icono: "HeartHandshake",
              titulo: "Enfoque Sociopolítico",
              descripcion: "Entendemos que los problemas laborales no están aislados, sino vinculados a la estructura económica, social, educativa, productiva e institucional del país. La acción sindical debe articular la defensa de los derechos con la participación en los debates sobre modelo de desarrollo y políticas públicas."
            },
          ].map((item) => (
            <div key={item.titulo} className="bg-[#f8f9fa] border border-gray-100 rounded-[28px] p-8 tablet:p-10 flex gap-6 items-start">
              <div className="w-14 h-14 rounded-2xl bg-[#0045A5] text-white flex items-center justify-center shrink-0 shadow-md">
                <ValorIcon icono={item.icono} />
              </div>
              <div>
                <h3 className="text-xl tablet:text-2xl font-bold text-[#05162D] mb-3">{item.titulo}</h3>
                <p className="text-gray-600 leading-relaxed text-sm tablet:text-base">{item.descripcion}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {[
            {
              icono: "Vote",
              titulo: "Equidad de Género como Eje Fundamental",
              descripcion: "La equidad de género es un eje esencial y transversal de la ECSP, presente en todos los contenidos, metodologías, procesos de dirección y evaluación. La Escuela promoverá el liderazgo de las mujeres trabajadoras en la toma de decisiones sindicales, la negociación colectiva y la incidencia política."
            },
            {
              icono: "Megaphone",
              titulo: "Diálogo Social y Construcción Democrática",
              descripcion: "El diálogo social es uno de los pilares metodológicos y políticos de la Escuela. Formaremos dirigentes con capacidad para participar en espacios de diálogo con el Estado, empleadores y organizaciones sociales, defendiendo los intereses de la clase trabajadora y promoviendo acuerdos orientados a la equidad."
            },
          ].map((item) => (
            <div key={item.titulo} className="bg-[#f8f9fa] border border-gray-100 rounded-[28px] p-8 tablet:p-10 flex gap-6 items-start">
              <div className="w-14 h-14 rounded-2xl bg-[#0045A5] text-white flex items-center justify-center shrink-0 shadow-md">
                <ValorIcon icono={item.icono} />
              </div>
              <div>
                <h3 className="text-xl tablet:text-2xl font-bold text-[#05162D] mb-3">{item.titulo}</h3>
                <p className="text-gray-600 leading-relaxed text-sm tablet:text-base">{item.descripcion}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#0B1426] rounded-[32px] p-8 tablet:p-14 text-white shadow-xl text-center">
          <h3 className="text-2xl tablet:text-3xl font-bold text-white mb-6">Sentido Estratégico de la ECSP</h3>
          <p className="text-gray-300 text-base tablet:text-lg max-w-3xl mx-auto leading-relaxed">
            La Escuela CNUS de Sindicalismo Sociopolítico representa una apuesta estratégica para fortalecer el movimiento sindical dominicano. Busca formar dirigentes y trabajadores con conciencia crítica, capacidad de diálogo, compromiso ético, visión democrática y preparación técnica para incidir en la transformación de la realidad nacional y construir una República Dominicana más justa, inclusiva, solidaria y socialmente equitativa.
          </p>
        </div>
      </section>
    </div>
  );
}

function VisionFormativaTab() {
  return (
    <div>
      <section className="w-full max-w-[1680px] mx-auto px-4 tablet:px-[60px] laptop:px-20 mb-[200px]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl tablet:text-4xl laptop:text-5xl font-bold text-[#05162D] mb-6">
            Visión Formativa y Enfoque Metodológico
          </h2>
          <p className="text-gray-600 text-base tablet:text-lg leading-relaxed">
            La ECSP concibe el ejercicio formativo como una herramienta al servicio de los trabajadores, sus dirigentes, bases, sectores, territorios y agendas de lucha. Toda capacitación debe responder a una necesidad real y producir resultados concretos para la gestión colectiva.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-[200px]">
          {esquemas.map((item) => (
            <div key={item.titulo} className="bg-white border border-gray-200 rounded-[28px] p-8 shadow-sm flex flex-col gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0045A5] flex items-center justify-center">
                <ValorIcon icono={item.icono} />
              </div>
              <h3 className="text-xl font-bold text-[#05162D]">{item.titulo}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.descripcion}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#0B1426] rounded-[32px] p-8 tablet:p-12 text-white mb-16">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Modalidades de Formación</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { titulo: "Presencial", desc: "Talleres, liderazgo, negociación, diálogo social y formación de formadores." },
              { titulo: "Virtual", desc: "Cursos teóricos, conferencias, seguimiento y participación territorial." },
              { titulo: "Híbrida", desc: "Combinación de sesiones presenciales y virtuales según las necesidades." },
              { titulo: "Diplomado Sindical", desc: "Ruta formativa integral con certificación en sindicalismo sociopolítico." },
            ].map((m) => (
              <div key={m.titulo} className="bg-white/10 rounded-2xl p-6 border border-white/10">
                <h4 className="text-white font-bold text-lg mb-2">{m.titulo}</h4>
                <p className="text-blue-200 text-sm leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#f8f9fa] rounded-[32px] p-8 tablet:p-12 border border-gray-200">
          <h3 className="text-2xl font-bold text-[#05162D] mb-8 text-center">Ejes Metodológicos Fundamentales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pilares.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm">
                <CheckCircleIcon />
                <p className="text-gray-800 text-sm font-semibold">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}