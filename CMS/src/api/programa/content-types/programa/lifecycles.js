const { errors } = require('@strapi/utils');
const { ApplicationError } = errors;

const UID = 'api::programa.programa';
const MAX_PROGRAMAS_DESTACADOS = 4;

const MENSAJE =
  `Ya hay ${MAX_PROGRAMAS_DESTACADOS} programas destacados para la página de Inicio. ` +
  `Desmarca uno de los programas anteriores antes de destacar este.`;

/**
 * Cuenta los programas destacados que realmente salen en la portada.
 *
 * `strabi.db.query` trabaja sobre filas, y en Strapi v5 cada documento tiene
 * dos: la versión borrador y la publicada. Contarlas todas duplicaba el
 * resultado, así que el límite de 4 se agotaba con 2 cursos.
 *
 * Se cuentan solo las filas publicadas —que son las que lee la portada— y se
 * excluye el documento en curso por `documentId`, no por `id`: excluir una
 * sola fila dejaba a su gemela sumando.
 */
async function contarDestacadosPublicados(excluirDocumentId) {
  return strapi.db.query(UID).count({
    where: {
      destacado: true,
      publishedAt: { $notNull: true },
      ...(excluirDocumentId ? { documentId: { $ne: excluirDocumentId } } : {}),
    },
  });
}

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    if (data.destacado !== true) return;

    if ((await contarDestacadosPublicados()) >= MAX_PROGRAMAS_DESTACADOS) {
      throw new ApplicationError(MENSAJE);
    }
  },

  async beforeUpdate(event) {
    const { data, where } = event.params;
    if (data.destacado !== true) return;

    // `where.id` identifica una fila; necesitamos su documento para excluir
    // también a la otra versión del mismo curso.
    let documentId = null;
    if (where?.id) {
      const fila = await strapi.db.query(UID).findOne({
        where: { id: where.id },
        select: ['documentId'],
      });
      documentId = fila?.documentId ?? null;
    }

    if ((await contarDestacadosPublicados(documentId)) >= MAX_PROGRAMAS_DESTACADOS) {
      throw new ApplicationError(MENSAJE);
    }
  },
};
