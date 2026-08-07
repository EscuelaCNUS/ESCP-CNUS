const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const pdf = require('pdf-parse');

const docsDir = path.join(__dirname, '..', 'documentos');

function textToMarkdown(text) {
  return text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean)
    .join('\n\n');
}

function cleanArticleText(text) {
  return text
    // Limpiar encabezados de membrete CNUS
    .replace(/Confederación Nacional de Unidad Sindical[\s\S]*?RNC 430055311/gi, '')
    .replace(/Fundada el 3 de Diciembre 2005\.-?/gi, '')
    .replace(/Calle Juan Erazo No\. 14, Edificio Centrales Sindicales, Villa Juana/gi, '')
    .replace(/Santo Domingo, D\.N\., República Dominicana\./gi, '')
    .replace(/Tels: 221-2158, E-mail : cnus\.cnus@gmail\.com cnus@cnus\.info/gi, '')
    // Limpiar indicativos de sección en los documentos
    .replace(/Sección:\s*(La columna del director|Pensamiento complejo|Notas del presidente|Noticias y eventos)/gi, '')
    .replace(/SECCION DEBABTE|Sección debate|SECCIÓN DEBATE/gi, '')
    .replace(/CRITICA A LA RAZON EMPRESARIAL/gi, '')
    .replace(/ARTICULO 1|ARTÍCULO 1/gi, '')
    .trim();
}

async function generateSeedCode() {
  const docMapping = [
    {
      file: 'ARTICULO sobre TRAYECTORIA DE PEPE (3).docx',
      categorySlug: 'notas-del-presidente',
      title: 'Pepe Abreu: trayectoria y liderazgo sindical',
      slug: 'pepe-abreu-trayectoria-liderazgo-sindical',
      fecha: '2026-07-25',
      destacado: true
    },
    {
      file: 'EL EMPRESARIADO Y SUS PRIVILEGIOS.docx',
      categorySlug: 'pensamiento-complejo',
      title: 'El empresariado dominicano y sus privilegios',
      slug: 'critica-razon-empresarial-privilegios',
      fecha: '2026-07-20',
      destacado: true
    },
    {
      file: 'LA DECADA DEL ENVEJECIMIENTO SALUDABLE Y DESAFIOS.docx',
      categorySlug: 'pensamiento-complejo',
      title: 'La Década del Envejecimiento Saludable en RD',
      slug: 'decada-envejecimiento-saludable-desafios',
      fecha: '2026-07-15',
      destacado: false
    },
    {
      file: 'SEGURIDAD SOCIAL.docx',
      categorySlug: 'columna-del-director',
      title: 'Apuntes para una nueva Seguridad Social Dominicana',
      slug: 'apuntes-nueva-seguridad-social-dominicana',
      fecha: '2026-07-10',
      destacado: true
    },
    {
      file: 'SIGNO DE REBELION en la SOCIEDAD.docx',
      categorySlug: 'pensamiento-complejo',
      title: 'Signos de rebelión en la sociedad dominicana',
      slug: 'signos-rebelion-sociedad-dominicana',
      fecha: '2026-07-05',
      destacado: false
    },
    {
      file: 'ARTICULO LIBRE 8-7-2026.pdf',
      categorySlug: 'notas-del-presidente',
      title: 'El movimiento sindical ante la realidad laboral en RD',
      slug: 'movimiento-sindical-realidad-laboral-social',
      fecha: '2026-07-08',
      destacado: false
    },
    {
      file: 'Articulo Libre 21-7-2026.pdf',
      categorySlug: 'notas-del-presidente',
      title: 'Propuestas y visión estratégica de la CNUS',
      slug: 'propuestas-vision-estrategica-cnus-trabajo-decente',
      fecha: '2026-07-21',
      destacado: false
    },
    {
      file: 'ARTICULO LIBRE 28-7-2026.pdf',
      categorySlug: 'notas-del-presidente',
      title: 'El diálogo social en la transformación laboral de RD',
      slug: 'dialogo-social-pilar-transformacion-laboral',
      fecha: '2026-07-28',
      destacado: false
    },
    {
      file: 'ARTICULO LIBRE 29-7-2026.pdf',
      categorySlug: 'notas-del-presidente',
      title: 'Cándido Mercedes y Ramón Núñez: dúo a favor de empresarios',
      slug: 'candido-mercedes-ramon-nunez-ramirez-empresarios',
      fecha: '2026-07-29',
      destacado: true
    }
  ];

  const articlesData = [];

  for (const item of docMapping) {
    const filePath = path.join(docsDir, item.file);
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

    const cleanedText = cleanArticleText(rawText);
    const lines = cleanedText.split('\n').map(l => l.trim()).filter(Boolean);
    const extracto = lines.slice(0, 3).join(' ').slice(0, 250) + '...';

    articlesData.push({
      titulo: item.title,
      slug: item.slug,
      extracto: extracto,
      contenido: textToMarkdown(cleanedText),
      fecha_publicacion: item.fecha,
      destacado: item.destacado,
      categorySlug: item.categorySlug
    });
  }

  fs.writeFileSync(
    path.join(__dirname, 'real-articles.json'),
    JSON.stringify(articlesData, null, 2),
    'utf-8'
  );

  console.log(`✅ ${articlesData.length} artículos procesados y limpiados de encabezados!`);
}

generateSeedCode().catch(console.error);
