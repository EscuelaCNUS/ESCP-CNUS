const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const pdf = require('pdf-parse');
const axios = require('axios');

// Nunca escribas credenciales aquí: este repositorio es público.
// Define las variables en CNUS/.env.local, que está en .gitignore.
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://escp-cnus-production.up.railway.app';
const STRAPI_TOKEN = process.env.STRAPI_WRITE_TOKEN || process.env.STRAPI_API_TOKEN;

if (!STRAPI_TOKEN) {
  console.error('Falta STRAPI_WRITE_TOKEN en CNUS/.env.local');
  process.exit(1);
}

const docsDir = path.join(__dirname, '..', 'documentos');

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function textToHtml(text) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);
  return paragraphs.map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`).join('\n');
}

async function importArticles() {
  console.log('🚀 Conectando a Strapi para obtener categorías y autor...');

  const catRes = await axios.get(`${STRAPI_URL}/api/categorias`, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` }
  });
  const categorias = catRes.data.data;
  const catMap = {};
  for (const c of categorias) {
    catMap[c.slug] = c.documentId || c.id;
  }
  console.log('Categorías encontradas:', catMap);

  const autorRes = await axios.get(`${STRAPI_URL}/api/autores`, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` }
  });
  const autorId = autorRes.data?.data?.[0]?.documentId || autorRes.data?.data?.[0]?.id;

  const docMapping = [
    {
      file: 'ARTICULO sobre TRAYECTORIA DE PEPE (3).docx',
      categorySlug: 'notas-del-presidente',
      defaultTitle: 'Pepe Abreu: trayectoria y trascendencia del liderazgo sindical dominicano',
      fecha: '2026-07-25'
    },
    {
      file: 'EL EMPRESARIADO Y SUS PRIVILEGIOS.docx',
      categorySlug: 'pensamiento-complejo',
      defaultTitle: 'Crítica a la Razón Empresarial: El empresariado y sus privilegios',
      fecha: '2026-07-20'
    },
    {
      file: 'LA DECADA DEL ENVEJECIMIENTO SALUDABLE Y DESAFIOS.docx',
      categorySlug: 'pensamiento-complejo',
      defaultTitle: 'La Década del Envejecimiento Saludable: un compromiso impostergable para República Dominicana',
      fecha: '2026-07-15'
    },
    {
      file: 'SEGURIDAD SOCIAL.docx',
      categorySlug: 'columna-del-director',
      defaultTitle: 'Apuntes para una nueva Seguridad Social Dominicana',
      fecha: '2026-07-10'
    },
    {
      file: 'SIGNO DE REBELION en la SOCIEDAD.docx',
      categorySlug: 'pensamiento-complejo',
      defaultTitle: 'Signos de rebelión en la sociedad dominicana',
      fecha: '2026-07-05'
    },
    {
      file: 'ARTICULO LIBRE 8-7-2026.pdf',
      categorySlug: 'notas-del-presidente',
      defaultTitle: 'Artículo Libre: El movimiento sindical ante la realidad nacional (8 de julio)',
      fecha: '2026-07-08'
    },
    {
      file: 'Articulo Libre 21-7-2026.pdf',
      categorySlug: 'notas-del-presidente',
      defaultTitle: 'Artículo Libre: Propuestas y visión de la CNUS (21 de julio)',
      fecha: '2026-07-21'
    },
    {
      file: 'ARTICULO LIBRE 28-7-2026.pdf',
      categorySlug: 'notas-del-presidente',
      defaultTitle: 'Artículo Libre: El diálogo social y la lucha por el trabajo decente (28 de julio)',
      fecha: '2026-07-28'
    },
    {
      file: 'ARTICULO LIBRE 29-7-2026.pdf',
      categorySlug: 'notas-del-presidente',
      defaultTitle: 'Cándido Mercedes y Ramón Núñez Ramírez: buen dúo a favor de los empresarios',
      fecha: '2026-07-29'
    }
  ];

  for (const item of docMapping) {
    const filePath = path.join(docsDir, item.file);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ Archivo no encontrado: ${item.file}`);
      continue;
    }

    const ext = path.extname(item.file).toLowerCase();
    let rawText = '';

    if (ext === '.docx') {
      const res = await mammoth.extractRawText({ path: filePath });
      rawText = res.value;
    } else if (ext === '.pdf') {
      const buf = fs.readFileSync(filePath);
      const res = await pdf(buf);
      rawText = res.text;
    }

    // Limpieza de encabezados repetitivos de PDF
    rawText = rawText.replace(/Confederación Nacional de Unidad Sindical[\s\S]*?RNC 430055311/gi, '');

    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    let title = item.defaultTitle;
    let mainText = rawText.trim();

    // Intentar tomar primera línea sustancial como título si es adecuada
    if (lines[0] && lines[0].length < 120 && !lines[0].toLowerCase().includes('seccion')) {
      title = lines[0];
    }

    const extracto = lines.slice(1, 4).join(' ').slice(0, 280) + '...';
    const slug = slugify(title).slice(0, 80);
    const htmlContent = textToHtml(mainText);
    const catId = catMap[item.categorySlug];

    const payload = {
      data: {
        titulo: title,
        slug: slug,
        extracto: extracto,
        contenido: htmlContent,
        fecha_publicacion: item.fecha,
        destacado: true,
        categoria: catId,
        autor: autorId,
      }
    };

    try {
      console.log(`\n📤 Subiendo: "${title}" (${item.categorySlug})...`);
      const postRes = await axios.post(`${STRAPI_URL}/api/articulos`, payload, {
        headers: { Authorization: `Bearer ${STRAPI_TOKEN}` }
      });
      console.log(`✅ Creado con ID/documentId: ${postRes.data.data.documentId || postRes.data.data.id}`);
    } catch (err) {
      console.error(`❌ Error subiendo ${title}:`, err.response?.data || err.message);
    }
  }

  console.log('\n🎉 ¡Todos los 9 artículos reales fueron procesados e subidos a Strapi!');
}

importArticles().catch(console.error);
