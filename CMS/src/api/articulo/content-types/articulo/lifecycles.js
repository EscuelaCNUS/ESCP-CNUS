'use strict';

const UID = 'api::articulo.articulo';

/**
 * Solo puede haber un artículo destacado: al marcar uno, se desmarcan los demás.
 *
 * `strapi.db.query` trabaja sobre filas, y en Strapi v5 cada documento tiene
 * dos: borrador y publicado. Excluir el artículo en curso por `id` dejaba a su
 * versión gemela dentro del barrido, así que al marcar un artículo podía
 * desmarcarse a sí mismo. Se excluye por `documentId`, que cubre ambas.
 *
 * El `where.documentId` que usaba el código anterior tampoco servía: se
 * comparaba una cadena contra la columna `id`, que es numérica.
 */
async function desmarcarOtros(excluirDocumentId) {
  await strapi.db.query(UID).updateMany({
    where: {
      destacado: true,
      ...(excluirDocumentId ? { documentId: { $ne: excluirDocumentId } } : {}),
    },
    data: { destacado: false },
  });
}

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    if (data.destacado !== true) return;
    await desmarcarOtros(null);
  },

  async beforeUpdate(event) {
    const { data, where } = event.params;
    if (data.destacado !== true) return;

    // `where.id` identifica una fila; hay que resolver su documento para no
    // desmarcar la otra versión del mismo artículo.
    let documentId = where?.documentId ?? null;
    if (!documentId && where?.id) {
      const fila = await strapi.db.query(UID).findOne({
        where: { id: where.id },
        select: ['documentId'],
      });
      documentId = fila?.documentId ?? null;
    }

    await desmarcarOtros(documentId);
  },
};
