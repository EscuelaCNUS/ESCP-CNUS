/**
 * Importa la estructura curricular de la ESCP a Strapi.
 *
 * Crea los 45 cursos del documento "01 ESTRUCTURA CURRICULAR.docx" y enlaza
 * cada uno con su eje formativo, que es lo que alimenta el filtro de
 * /programas. Los ejes NO se crean ni se modifican: ya existen.
 *
 * Es idempotente: identifica por slug, así que se puede ejecutar varias veces
 * sin duplicar. Nunca modifica un curso que ya exista.
 *
 * Uso:
 *   node scripts/import-programas.js --dry-run    (no escribe, solo muestra)
 *   node scripts/import-programas.js
 *
 * Requiere STRAPI_WRITE_TOKEN en CNUS/.env.local (nunca en el código).
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Destino explícito y separado de NEXT_PUBLIC_STRAPI_URL: esa apunta a
// localhost en desarrollo, y una importación no debe cambiar de servidor sola.
const STRAPI_URL = process.env.STRAPI_WRITE_URL || 'https://escp-cnus-production.up.railway.app';
const TOKEN = process.env.STRAPI_WRITE_TOKEN;
const DRY = process.argv.includes('--dry-run');

if (!TOKEN && !DRY) {
  console.error('Falta STRAPI_WRITE_TOKEN en CNUS/.env.local');
  process.exit(1);
}

// ─── Estructura curricular ────────────────────────────────────────────────────
// Transcrita literalmente del documento. Los títulos van sin el punto final.
//
// `nombre` y `objetivo` son solo referencia: los ejes ya existen en Strapi con
// nombres cortos para el filtro de /programas y este script no los modifica.
// El enlace curso↔eje se hace por `orden`.

const EJES = [
  {
    orden: 1,
    nombre: 'Identidad sindical, CNUS y acción sociopolítica',
    objetivo:
      'Fortalecer la identidad sindical, histórica, política y organizativa de la CNUS y sus organizaciones afiliadas, reconociendo su papel como sujeto principal de la acción sindical y sociopolítica.',
    cursos: [
      'Historia del movimiento sindical dominicano y latinoamericano',
      'Identidad, misión y papel sociopolítico de la CNUS',
      'Sindicalismo sociopolítico y transformación social',
      'Autonomía sindical, unidad de acción y fortalecimiento organizativo',
    ],
  },
  {
    orden: 2,
    nombre: 'Derechos laborales y marco jurídico',
    objetivo:
      'Desarrollar capacidades jurídicas, laborales y organizativas para la defensa efectiva de los derechos de trabajadores y trabajadoras.',
    cursos: [
      'Derecho laboral dominicano y Código de Trabajo',
      'Libertad sindical y negociación colectiva',
      'Seguridad social, pensiones y riesgos laborales',
      'Normas internacionales del trabajo y convenios de la OIT',
      'Derechos humanos, derechos laborales y ciudadanía social',
    ],
  },
  {
    orden: 3,
    nombre: 'Diálogo social, concertación y acuerdos democráticos',
    objetivo:
      'Formar dirigentes sindicales capaces de utilizar el diálogo social como medio fundamental de debate democrático, codificación ética, construcción de consensos y acuerdos políticos y sociales.',
    cursos: [
      'Diálogo social y concertación democrática',
      'Negociación sindical y resolución democrática de conflictos',
      'Ética sindical, codificación ética y responsabilidad democrática',
      'Construcción de pactos sociales y agendas sindicales de país',
    ],
  },
  {
    orden: 4,
    nombre: 'Equidad de género, inclusión y diversidad',
    objetivo:
      'Colocar la equidad de género como eje fundamental de la Escuela, fortaleciendo la participación, representación y liderazgo de las mujeres trabajadoras.',
    cursos: [
      'Equidad de género como eje transversal del sindicalismo',
      'Liderazgo sindical de las mujeres trabajadoras',
      'Prevención de la discriminación, acoso y violencia en el trabajo',
      'Juventud trabajadora, sindicalismo e inclusión generacional',
      'Trabajo informal, sectores vulnerables y nuevas formas de organización sindical',
    ],
  },
  {
    orden: 5,
    nombre: 'Liderazgo, organización y gestión sindical',
    objetivo:
      'Fortalecer las capacidades de liderazgo, organización, planificación, comunicación y gestión democrática de la CNUS y sus organizaciones afiliadas.',
    cursos: [
      'Liderazgo sindical democrático e inclusivo',
      'Planificación estratégica sindical',
      'Gestión organizativa y fortalecimiento institucional de los sindicatos',
      'Formación de formadores sindicales',
      'Comunicación sindical, vocería y manejo de medios',
    ],
  },
  {
    orden: 6,
    nombre: 'Economía, trabajo y desigualdad social',
    objetivo:
      'Desarrollar capacidades de análisis económico, laboral y social que permitan comprender las causas estructurales de la desigualdad dominicana y formular propuestas sindicales.',
    cursos: [
      'Economía política del trabajo y desigualdad en República Dominicana',
      'Trabajo decente, empleo digno y desarrollo humano',
      'Presupuesto público, políticas sociales e incidencia sindical',
      'Sistema tributario, justicia fiscal y derechos sociales',
      'Impacto de la tecnología, automatización e inteligencia artificial en el trabajo',
    ],
  },
  {
    orden: 7,
    nombre: 'Democracia, ciudadanía e incidencia política',
    objetivo:
      'Fortalecer la capacidad de la CNUS y sus organizaciones para participar en la vida democrática nacional e incidir en políticas públicas.',
    cursos: [
      'Democracia, Estado social y participación ciudadana',
      'Incidencia política y formulación de propuestas sindicales',
      'Análisis de coyuntura nacional e internacional',
      'Sindicalismo, derechos sociales y políticas públicas',
    ],
  },
  {
    orden: 8,
    nombre: 'Investigación, datos y producción de conocimiento sindical',
    objetivo:
      'Promover la producción de conocimiento sindical propio mediante herramientas de investigación, análisis de datos, sistematización de experiencias y elaboración de propuestas.',
    cursos: [
      'Investigación sindical aplicada',
      'Uso de datos para la acción sindical',
      'Elaboración de informes, diagnósticos y documentos de posición',
      'Sistematización de experiencias sindicales',
    ],
  },
  {
    orden: 9,
    nombre: 'Incidencia sectorial y macropolíticas de desarrollo productivo, económico y social',
    objetivo:
      'Fortalecer las capacidades de las organizaciones sindicales afiliadas a la CNUS para analizar la realidad económica, productiva, laboral, social y política de sus respectivos sectores, con el propósito de formular propuestas sindicales e incidir en las macropolíticas públicas y privadas que determinan el desarrollo de cada rama de la economía nacional.',
    cursos: [
      'Análisis sectorial para la acción sindical',
      'Macropolíticas públicas y desarrollo sectorial',
      'Diálogo social sectorial y negociación de políticas públicas',
      'Laboratorios sectoriales de propuestas sindicales',
    ],
  },
  {
    orden: 10,
    nombre: 'Educación preuniversitaria y universitaria, sindicalismo e incidencia en políticas educativas',
    objetivo:
      'Fortalecer las capacidades de las organizaciones sindicales vinculadas al sector educativo para analizar, debatir y formular propuestas de incidencia en las políticas públicas de la educación preuniversitaria y universitaria, colocando en el centro la calidad educativa, el trabajo decente, la equidad de género, la democracia, la formación ciudadana, la justicia social y el desarrollo nacional.',
    cursos: [
      'Política educativa dominicana y derecho a la educación',
      'Educación preuniversitaria, calidad educativa y condiciones laborales',
      'Educación universitaria, investigación, extensión y trabajo decente',
      'Educación técnica, formación profesional y transición al mundo del trabajo',
      'Sindicalismo educativo, diálogo social y reformas educativas',
    ],
  },
];

// ─── Utilidades ───────────────────────────────────────────────────────────────

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 90);
}

async function api(pathname, options = {}) {
  const res = await fetch(`${STRAPI_URL}/api/${pathname}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
      ...options.headers,
    },
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const detail = json?.error?.message || res.statusText;
    throw new Error(`${res.status} ${detail} — ${options.method || 'GET'} /api/${pathname}`);
  }
  return json;
}

async function findBySlug(collection, slug) {
  const json = await api(`${collection}?filters[slug][$eq]=${encodeURIComponent(slug)}`);
  return json?.data?.[0] ?? null;
}

// ─── Importación ──────────────────────────────────────────────────────────────

async function run() {
  const totalCursos = EJES.reduce((n, e) => n + e.cursos.length, 0);
  console.log(`Estructura curricular: ${EJES.length} ejes, ${totalCursos} cursos`);
  console.log(`Destino: ${STRAPI_URL}`);
  if (DRY) console.log('MODO PRUEBA — no se escribe nada\n');

  let cursosCreados = 0, cursosOmitidos = 0;

  for (const eje of EJES) {
    // Los ejes NO se crean ni se renombran: ya existen con nombres cortos
    // pensados para los chips del filtro de /programas. Aquí solo se consultan
    // por `orden` para enlazar cada curso con el suyo.
    let ejeDoc = null;
    if (!DRY) {
      const porOrden = await api(`eje-formativos?filters[orden][$eq]=${eje.orden}`);
      ejeDoc = porOrden?.data?.[0] ?? null;
      if (!ejeDoc) {
        throw new Error(
          `No existe ningún eje formativo con orden=${eje.orden} ("${eje.nombre}"). ` +
          `Créalo en Strapi antes de importar.`
        );
      }
      console.log(`[eje ${eje.orden}] ${ejeDoc.nombre}`);
    } else {
      console.log(`[eje ${eje.orden}] ${eje.nombre}`);
    }

    for (const titulo of eje.cursos) {
      const slug = slugify(titulo);

      if (DRY) {
        console.log(`    · ${titulo}  (${slug})`);
        continue;
      }

      const existente = await findBySlug('programas', slug);
      if (existente) {
        cursosOmitidos++;
        console.log(`    · ya existe: ${titulo}`);
        continue;
      }

      // Solo título, slug y eje: el documento no aporta descripción, duración
      // ni temario por curso, y no se inventan.
      //
      // `status=draft` es obligatorio: Strapi v5 PUBLICA al crear vía API si no
      // se le indica lo contrario, y un curso vacío no debe salir al sitio.
      await api('programas?status=draft', {
        method: 'POST',
        body: JSON.stringify({
          data: { titulo, slug, eje: ejeDoc.documentId, modalidad: 'Virtual' },
        }),
      });
      cursosCreados++;
      console.log(`    · creado: ${titulo}`);
    }
  }

  console.log('\n─────────────────────────────');
  console.log(`Cursos creados:    ${cursosCreados}`);
  console.log(`Cursos ya exist.:  ${cursosOmitidos}`);
  console.log('Ejes: sin cambios (solo consultados para enlazar).');
  if (!DRY) {
    console.log('\nLos cursos quedan como BORRADOR y sin descripción.');
    console.log('Hay que completarlos y publicarlos desde el panel de Strapi.');
  }
}

run().catch((err) => {
  console.error('\nError:', err.message);
  process.exit(1);
});
