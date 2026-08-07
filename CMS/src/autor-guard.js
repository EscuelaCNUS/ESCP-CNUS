'use strict';

const { errors } = require('@strapi/utils');

const ARTICLE_UID = 'api::articulo.articulo';
const AUTOR_UID = 'api::autor.autor';

// Roles con poder de encargado: pueden editar/reasignar cualquier artículo.
// El Super Admin por defecto siempre puede. Añade aquí el `code` de un rol
// "Encargado" custom si creas uno en el admin (Settings → Administrators → Roles).
const MANAGER_ROLE_CODES = new Set(['strapi-super-admin']);

// Si true, los editores pueden publicar sus propios artículos.
// Si false, solo el encargado publica.
const EDITORS_CAN_PUBLISH_OWN = true;

// Acciones sobre documentos existentes donde el editor solo puede tocar lo suyo.
const OWNER_ACTIONS = new Set(['update', 'delete', 'unpublish', 'discardDraft', 'deleteDraft', 'clone']);

function getCurrentAdminUser() {
  try {
    const state = strapi.requestContext?.get?.()?.state;
    if (state?.auth?.strategy?.name !== 'admin') return null;
    return state.user ?? null;
  } catch {
    return null;
  }
}

function isManager(user) {
  const codes = (user?.roles ?? []).map((r) => r.code);
  return codes.some((c) => MANAGER_ROLE_CODES.has(c));
}

/**
 * Devuelve el documentId del autor vinculado al usuario admin.
 * Si el editor aún no tiene autor, lo crea con su nombre y correo.
 *
 * El enlace va por correo porque es único por usuario administrador. Si algún
 * día se retira ese campo del tipo Autor, hay que darle otro identificador o
 * la comprobación de propiedad deja de funcionar.
 */
async function getOrCreateAutorForUser(user) {
  const email = user.email;
  const existing = await strapi.documents(AUTOR_UID).findFirst({
    filters: { email: { $eq: email } },
  });
  if (existing) return existing.documentId;

  const created = await strapi.documents(AUTOR_UID).create({
    data: {
      nombre: user.firstname,
      apellido: user.lastname ?? '',
      email,
    },
  });
  return created.documentId;
}

async function getArticleAutorId(documentId) {
  if (!documentId) return null;
  // `populate` es imprescindible: en Strapi v5 findOne no trae las relaciones,
  // así que sin esto `article.autor` era siempre undefined, requireOwnership
  // nunca lanzaba y cualquier editor podía tocar artículos ajenos.
  const article = await strapi.documents(ARTICLE_UID).findOne({
    documentId,
    populate: { autor: true },
  });
  return article?.autor?.documentId ?? null;
}

/**
 * Lanza ForbiddenError si el editor no es el autor asignado del artículo.
 * Devuelve el documentId del autor del editor.
 *
 * Un artículo sin autor asignado se considera adoptable: cualquier editor
 * puede tomarlo, y al guardarlo queda a su nombre. Es intencional, para que el
 * contenido heredado no quede bloqueado. Hoy los 12 artículos tienen autor.
 */
async function requireOwnership(ctx, user) {
  const ownAutorId = await getOrCreateAutorForUser(user);
  const articleAutorId = await getArticleAutorId(ctx.params?.documentId);
  if (articleAutorId && articleAutorId !== ownAutorId) {
    throw new errors.ForbiddenError(
      'Solo el autor asignado o el encargado puede modificar este contenido.'
    );
  }
  return ownAutorId;
}

const autorGuard = async (ctx, next) => {
  if (ctx.uid !== ARTICLE_UID) return next();

  const user = getCurrentAdminUser();
  if (!user || isManager(user)) return next();

  const { action, params } = ctx;

  if (action === 'create') {
    const autorId = await getOrCreateAutorForUser(user);
    params.data = { ...(params.data ?? {}), autor: { set: [autorId] } };
    return next();
  }

  if (action === 'publish') {
    if (!EDITORS_CAN_PUBLISH_OWN) {
      throw new errors.ForbiddenError('Solo el encargado puede publicar contenidos.');
    }
    await requireOwnership(ctx, user);
    return next();
  }

  if (OWNER_ACTIONS.has(action)) {
    const ownAutorId = await requireOwnership(ctx, user);
    if (action === 'update') {
      params.data = { ...(params.data ?? {}), autor: { set: [ownAutorId] } };
    }
  }

  return next();
};

module.exports = autorGuard;
