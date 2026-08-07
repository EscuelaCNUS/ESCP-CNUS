/**
 * Rellena los 45 cursos de la estructura curricular en Strapi.
 *
 * ATENCIÓN: el contenido queda PUBLICADO. Se probó a escribir solo sobre el
 * borrador pasando ?status=draft en el PUT, pero Strapi v5 no lo respeta en una
 * actualización: el documento ya está publicado y la escritura llega a la
 * versión visible. Lo que se escriba aquí se ve en la web de inmediato.
 *
 * El equipo académico debe revisar y corregir después, no antes.
 *
 * Es conservador por defecto: si un campo ya tiene contenido, no lo pisa.
 * Con --force sobrescribe todo.
 *
 * Uso:
 *   node scripts/rellenar-cursos.js --dry-run
 *   node scripts/rellenar-cursos.js
 *   node scripts/rellenar-cursos.js --force
 *
 * Requiere STRAPI_WRITE_TOKEN en CNUS/.env.local con permisos find y update
 * sobre Programa. Revócalo al terminar.
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const { CURSOS } = require('./contenido-cursos');

const STRAPI_URL = process.env.STRAPI_WRITE_URL || 'https://escp-cnus-production.up.railway.app';
const TOKEN = process.env.STRAPI_WRITE_TOKEN;
const DRY = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');

if (!TOKEN && !DRY) {
  console.error('Falta STRAPI_WRITE_TOKEN en CNUS/.env.local');
  process.exit(1);
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
    throw new Error(`${res.status} ${json?.error?.message || res.statusText} — ${options.method || 'GET'} /api/${pathname}`);
  }
  return json;
}

const vacio = (v) => v == null || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0);

async function run() {
  const slugs = Object.keys(CURSOS);
  console.log(`Contenido preparado para ${slugs.length} cursos`);
  console.log(`Destino: ${STRAPI_URL}`);
  console.log(DRY ? 'MODO PRUEBA — no se escribe nada\n' : 'Escribiendo contenido PUBLICADO\n');

  let actualizados = 0, omitidos = 0, noEncontrados = 0;

  for (const slug of slugs) {
    const contenido = CURSOS[slug];

    if (DRY) {
      console.log(`· ${slug}`);
      console.log(`    ${contenido.modulos.length} módulos, ${contenido.habilidades.length} habilidades`);
      continue;
    }

    const encontrado = await api(
      `programas?filters[slug][$eq]=${encodeURIComponent(slug)}&status=draft` +
      `&populate[modulos][populate]=*&populate[habilidades][populate]=*`
    );
    const programa = encontrado?.data?.[0];

    if (!programa) {
      noEncontrados++;
      console.log(`· NO EXISTE: ${slug}`);
      continue;
    }

    const data = {};
    if (FORCE || vacio(programa.descripcion)) data.descripcion = contenido.descripcion;
    if (FORCE || vacio(programa.objetivos)) data.objetivos = contenido.objetivos;
    if (FORCE || vacio(programa.dirigido_a)) data.dirigido_a = contenido.dirigido_a;
    if (FORCE || vacio(programa.habilidades)) {
      data.habilidades = contenido.habilidades.map((nombre) => ({ nombre }));
    }
    if (FORCE || vacio(programa.modulos)) data.modulos = contenido.modulos;
    if (FORCE || vacio(programa.duracion)) {
      const horas = contenido.modulos.reduce((t, m) => t + (parseInt(m.duracion, 10) || 0), 0);
      if (horas > 0) data.duracion = `${horas} horas`;
    }

    if (Object.keys(data).length === 0) {
      omitidos++;
      console.log(`· ya completo: ${programa.titulo.slice(0, 50)}`);
      continue;
    }

    await api(`programas/${programa.documentId}`, {
      method: 'PUT',
      body: JSON.stringify({ data }),
    });
    actualizados++;
    console.log(`· ${programa.titulo.slice(0, 52)}  [${Object.keys(data).join(', ')}]`);
  }

  console.log('\n─────────────────────────────');
  console.log(`Actualizados : ${actualizados}`);
  console.log(`Ya completos : ${omitidos}`);
  if (noEncontrados) console.log(`No encontrados: ${noEncontrados}`);
  if (!DRY) {
    console.log('\nEl contenido quedó PUBLICADO y visible en la web.');
    console.log('El equipo académico debe revisarlo y corregir desde el panel.');
    console.log('Los módulos y habilidades son una propuesta, no el temario oficial.');
  }
}

run().catch((err) => {
  console.error('\nError:', err.message);
  process.exit(1);
});
