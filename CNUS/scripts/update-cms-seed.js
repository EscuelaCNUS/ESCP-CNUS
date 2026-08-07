const fs = require('fs');
const path = require('path');

const realArticlesPath = path.join(__dirname, 'real-articles.json');
const cmsIndexPath = path.join(__dirname, '..', '..', 'CMS', 'src', 'index.js');

const realArticles = JSON.parse(fs.readFileSync(realArticlesPath, 'utf-8'));
const cmsIndexCode = fs.readFileSync(cmsIndexPath, 'utf-8');

const newSeedArticulosCode = `async function seedArticulos(strapi, categorias, tags, autor) {
  // Limpiar artículos de prueba antiguos (slugs que inician con 'prueba-')
  try {
    const dummyArticles = await strapi.documents('api::articulo.articulo').findMany({
      filters: { slug: { $startsWith: 'prueba-' } },
    });
    for (const d of dummyArticles) {
      await strapi.documents('api::articulo.articulo').delete({ documentId: d.documentId });
    }
    if (dummyArticles.length > 0) {
      strapi.log.info(\`[seed] Se eliminaron \${dummyArticles.length} artículos de prueba antiguos.\`);
    }
  } catch (err) {
    strapi.log.warn('[seed] Error al limpiar artículos de prueba:', err.message);
  }

  const articulosData = ${JSON.stringify(realArticles, null, 2)};
  const creados = [];

  for (const item of articulosData) {
    const existing = await strapi.documents('api::articulo.articulo').findFirst({
      filters: { slug: { $eq: item.slug } },
    });
    if (existing) {
      creados.push(existing);
      continue;
    }

    const cat = categorias[item.categorySlug];
    const selectedTags = Array.isArray(tags) ? tags.slice(0, 2) : [];

    const data = {
      titulo: item.titulo,
      slug: item.slug,
      extracto: item.extracto,
      contenido: item.contenido,
      fecha_publicacion: item.fecha_publicacion,
      destacado: item.destacado,
      categoria: cat?.documentId,
      autor: autor?.documentId,
      tags: selectedTags.length > 0
        ? { connect: selectedTags.map(t => ({ documentId: t.documentId })) }
        : undefined,
    };

    const art = await strapi.documents('api::articulo.articulo').create({
      data,
      status: 'published',
    });
    creados.push(art);
  }

  strapi.log.info('[seed] 9 artículos reales inyectados correctamente ✅');
  return creados;
}`;

const regex = /async function seedArticulos\(strapi, categorias, tags, autor\) \{[\s\S]*?\n\}/;
const updatedCmsIndex = cmsIndexCode.replace(regex, newSeedArticulosCode);

fs.writeFileSync(cmsIndexPath, updatedCmsIndex, 'utf-8');
console.log('✅ CMS/src/index.js actualizado exitosamente con la eliminación de dummies y los 9 artículos reales!');
