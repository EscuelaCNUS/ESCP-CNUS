const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const pdf = require('pdf-parse');

const docsDir = path.join(__dirname, '..', 'documentos');

async function inspectDocs() {
  const files = fs.readdirSync(docsDir).filter(f => !f.startsWith('~$') && (f.endsWith('.docx') || f.endsWith('.pdf')));
  console.log('Archivos encontrados:', files.length);

  for (const file of files) {
    const filePath = path.join(docsDir, file);
    const ext = path.extname(file).toLowerCase();
    let text = '';

    if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
    } else if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      text = data.text;
    }

    console.log(`\n========================================`);
    console.log(`ARCHIVO: ${file}`);
    console.log(`LONGITUD DE TEXTO: ${text.length} caracteres`);
    const lines = text.trim().split('\n').filter(l => l.trim().length > 0);
    console.log(`TÍTULO ESTIMADO: ${lines[0] || 'Sin título'}`);
    console.log(`MUESTRA DE TEXTO: ${lines.slice(0, 3).join(' ')}`);
  }
}

inspectDocs().catch(console.error);
