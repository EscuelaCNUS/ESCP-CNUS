/**
 * Descarga las portadas de Unsplash, las sube a Strapi y las asigna a cada curso.
 *
 * Cada imagen del catálogo se sube UNA sola vez —van a Cloudinary a través del
 * proveedor de subida de Strapi— y luego se reutiliza en todos los cursos que
 * comparten tema.
 *
 * No pisa un curso que ya tenga imagen, salvo con --force.
 *
 * Uso:
 *   node scripts/subir-imagenes-cursos.js --dry-run
 *   node scripts/subir-imagenes-cursos.js
 *
 * Requiere STRAPI_WRITE_TOKEN con permisos de subida y de update sobre Programa.
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const { IMAGENES, ASIGNACION, urlDescarga } = require('./imagenes-cursos');

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
    headers: { Authorization: `Bearer ${TOKEN}`, ...options.headers },
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new Error(`${res.status} ${json?.error?.message || res.statusText} — ${options.method || 'GET'} /api/${pathname}`);
  }
  return json;
}

/** Descarga la foto y la sube a Strapi. Devuelve el id del archivo. */
async function subirImagen(clave, meta) {
  const nombre = `curso-${clave}.jpg`;

  // Si ya se subió en una ejecución anterior, se reutiliza.
  const existentes = await api(`upload/files?filters[name][$eq]=${encodeURIComponent(nombre)}`);
  const lista = Array.isArray(existentes) ? existentes : (existentes?.results ?? []);
  if (lista.length > 0) {
    console.log(`  ya estaba subida: ${nombre}`);
    return lista[0].id;
  }

  const res = await fetch(urlDescarga(meta.id));
  if (!res.ok) throw new Error(`No se pudo descargar ${clave}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());

  const form = new FormData();
  form.append('files', new Blob([buffer], { type: 'image/jpeg' }), nombre);
  form.append('fileInfo', JSON.stringify({
    name: nombre,
    alternativeText: meta.alt,
    caption: 'Fotografía de Unsplash — sustituir por archivo propio de la CNUS',
  }));

  const subida = await api('upload', { method: 'POST', body: form });
  const archivo = Array.isArray(subida) ? subida[0] : subida;
  console.log(`  subida: ${nombre}  (${Math.round(buffer.length / 1024)} KB)`);
  return archivo.id;
}

async function run() {
  const claves = [...new Set(Object.values(ASIGNACION))];
  console.log(`${Object.keys(ASIGNACION).length} cursos · ${claves.length} imágenes distintas`);
  console.log(`Destino: ${STRAPI_URL}\n`);

  if (DRY) {
    for (const clave of claves) {
      const cursos = Object.entries(ASIGNACION).filter(([, k]) => k === clave);
      console.log(`· ${clave} — ${IMAGENES[clave].alt}`);
      console.log(`   ${cursos.length} curso(s): ${cursos.map(([s]) => s.slice(0, 34)).join(', ')}`);
    }
    return;
  }

  console.log('Subiendo imágenes…');
  const ids = {};
  for (const clave of claves) {
    ids[clave] = await subirImagen(clave, IMAGENES[clave]);
  }

  console.log('\nAsignando a los cursos…');
  let asignados = 0, omitidos = 0;

  for (const [slug, clave] of Object.entries(ASIGNACION)) {
    const encontrado = await api(`programas?filters[slug][$eq]=${encodeURIComponent(slug)}&populate[imagen][populate]=*`);
    const programa = encontrado?.data?.[0];
    if (!programa) {
      console.log(`  NO EXISTE: ${slug}`);
      continue;
    }
    if (programa.imagen && !FORCE) {
      omitidos++;
      continue;
    }
    await api(`programas/${programa.documentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { imagen: ids[clave] } }),
    });
    asignados++;
    console.log(`  ${programa.titulo.slice(0, 48)} → ${clave}`);
  }

  console.log('\n─────────────────────────────');
  console.log(`Imágenes subidas : ${claves.length}`);
  console.log(`Cursos asignados : ${asignados}`);
  if (omitidos) console.log(`Ya tenían imagen : ${omitidos}`);
  console.log('\nSon fotos de banco. Conviene sustituirlas por archivo propio de la CNUS.');
}

run().catch((err) => {
  console.error('\nError:', err.message);
  process.exit(1);
});
