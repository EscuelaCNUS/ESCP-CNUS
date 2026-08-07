'use strict';

const autorGuard = require('./autor-guard');

module.exports = {
  register({ strapi }) {
    // Reglas de autor/asignación para artículos: autoasigna el autor al editor,
    // impide que un editor edite contenido ajeno y permite al encargado reasignar.
    strapi.documents.use(autorGuard);
  },

  async bootstrap({ strapi }) {
    await setPublicPermissions(strapi);
    await seedInitialContent(strapi);
    await generateApiToken(strapi);
    await ensureEditorRolePermissions(strapi);
  },
};

// ─── ROL EDITOR ────────────────────────────────────────────────────────────────

const EDITOR_ROLE_CODE = 'strapi-editor';

/**
 * Configura el rol Editor (existe por defecto en Strapi) con permisos de
 * Content Manager SOLO para artículos: puede crear/leer/actualizar/borrar
 * y publicar (las reglas de autor las aplica autor-guard.js). Las entidades
 * relacionadas (autor, categoría, tags) quedan en solo lectura.
 */
async function ensureEditorRolePermissions(strapi) {
  try {
    const role = await strapi.db.query('admin::role').findOne({
      where: { code: EDITOR_ROLE_CODE },
    });

    if (!role) {
      strapi.log.warn('[roles] Rol Editor no encontrado, se omite configuración de permisos.');
      return;
    }

    // Actualizar siempre los permisos del rol Editor en el arranque


    const UPLOAD_PERMISSIONS = [
      { action: 'plugin::upload.read', subject: null, properties: {}, conditions: [] },
      { action: 'plugin::upload.configure-view', subject: null, properties: {}, conditions: [] },
      { action: 'plugin::upload.assets.create', subject: null, properties: {}, conditions: [] },
      { action: 'plugin::upload.assets.update', subject: null, properties: {}, conditions: [] },
      { action: 'plugin::upload.assets.download', subject: null, properties: {}, conditions: [] },
      { action: 'plugin::upload.assets.copy-link', subject: null, properties: {}, conditions: [] },
    ];

    const articleAllFields = [
      'titulo',
      'slug',
      'extracto',
      'contenido',
      'imagen_portada',
      'fecha_publicacion',
      'destacado',
      'autor',
      'categoria',
      'tags',
      'articulos_relacionados',
    ];

    // El editor ve el autor pero no puede editarlo (lo asigna autor-guard.js).
    const articleEditableFields = articleAllFields.filter((f) => f !== 'autor');

    const CONTENT_MANAGER_PERMISSIONS = [
      {
        action: 'plugin::content-manager.explorer.create',
        subject: 'api::articulo.articulo',
        properties: { fields: articleEditableFields },
        conditions: [],
      },
      {
        action: 'plugin::content-manager.explorer.read',
        subject: 'api::articulo.articulo',
        properties: { fields: articleAllFields },
        conditions: [],
      },
      {
        action: 'plugin::content-manager.explorer.update',
        subject: 'api::articulo.articulo',
        properties: { fields: articleEditableFields },
        conditions: [],
      },
      {
        action: 'plugin::content-manager.explorer.delete',
        subject: 'api::articulo.articulo',
        properties: {},
        conditions: [],
      },
      {
        action: 'plugin::content-manager.explorer.publish',
        subject: 'api::articulo.articulo',
        properties: {},
        conditions: [],
      },
      // Solo lectura para los selects de relaciones del formulario de artículo
      { action: 'plugin::content-manager.explorer.read', subject: 'api::autor.autor', properties: {}, conditions: [] },
      { action: 'plugin::content-manager.explorer.read', subject: 'api::categoria.categoria', properties: {}, conditions: [] },
      { action: 'plugin::content-manager.explorer.read', subject: 'api::tag.tag', properties: {}, conditions: [] },
    ];

    const permissions = [...UPLOAD_PERMISSIONS, ...CONTENT_MANAGER_PERMISSIONS];

    await strapi.admin.services.role.assignPermissions(role.id, permissions);
    strapi.log.info('[roles] Permisos del rol Editor configurados ✔');
  } catch (err) {
    strapi.log.error('[roles] Error configurando rol Editor:', err.message || err);
  }
}

// ─── API TOKEN ───────────────────────────────────────────────────────────────

async function generateApiToken(strapi) {
  try {
    const TOKEN_NAME = 'Frontend ESCP';

    const existing = await strapi.db.query('admin::api-token').findOne({
      where: { name: TOKEN_NAME },
    });

    if (existing) {
      strapi.log.info('[token] API Token "Frontend ESCP" ya existe.');
      strapi.log.info('[token] Si necesitas el token, regéneralo en: Settings → API Tokens');
      return;
    }

    const tokenService = strapi.service('admin::api-token');
    const token = await tokenService.create({
      name: TOKEN_NAME,
      description: 'Token de lectura para el frontend Next.js de ESCP',
      type: 'read-only',
      lifespan: null,
    });

    strapi.log.info('\n');
    strapi.log.info('╔══════════════════════════════════════════════════════════════╗');
    strapi.log.info('║           🔑  API TOKEN GENERADO — CÓPIALO AHORA            ║');
    strapi.log.info('╠══════════════════════════════════════════════════════════════╣');
    strapi.log.info(`║  ${token.accessKey}  ║`);
    strapi.log.info('╠══════════════════════════════════════════════════════════════╣');
    strapi.log.info('║  Pégalo en cnus/.env.local:                                  ║');
    strapi.log.info('║  STRAPI_API_TOKEN=<el token de arriba>                       ║');
    strapi.log.info('╚══════════════════════════════════════════════════════════════╝');
    strapi.log.info('\n');
  } catch (err) {
    strapi.log.error('[token] Error generando API Token:', err.message);
  }
}

// ─── PERMISOS PÚBLICOS ──────────────────────────────────────────────────────

async function setPublicPermissions(strapi) {
  const publicActions = [
    'api::articulo.articulo.find',
    'api::articulo.articulo.findOne',
    'api::audiencia.audiencia.find',
    'api::audiencia.audiencia.findOne',
    'api::autor.autor.find',
    'api::autor.autor.findOne',
    'api::categoria.categoria.find',
    'api::categoria.categoria.findOne',
    'api::debate.debate.find',
    'api::debate.debate.findOne',
    'api::eje-formativo.eje-formativo.find',
    'api::eje-formativo.eje-formativo.findOne',
    'api::hero-config.hero-config.find',
    'api::programa.programa.find',
    'api::programa.programa.findOne',
    'api::tag.tag.find',
    'api::tag.tag.findOne',
  ];

  try {
    const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' },
    });

    if (!publicRole) {
      strapi.log.warn('[bootstrap] Rol "public" no encontrado');
      return;
    }

    const existingPermissions = await strapi.db.query('plugin::users-permissions.permission').findMany({
      where: { role: publicRole.id },
    });

    const existingSet = new Set(existingPermissions.map((p) => p.action));

    for (const action of publicActions) {
      if (!existingSet.has(action)) {
        await strapi.db.query('plugin::users-permissions.permission').create({
          data: { action, role: publicRole.id },
        });
      }
    }

    strapi.log.info('[bootstrap] Permisos públicos configurados ✅');
  } catch (err) {
    strapi.log.error('[bootstrap] Error configurando permisos:', err.message);
  }
}

// ─── SEED INICIAL ────────────────────────────────────────────────────────────

async function seedInitialContent(strapi) {
  try {
    strapi.log.info('[seed] Verificando contenido inicial...');

    await seedCategorias(strapi);
    await seedTags(strapi);
    await seedEjesFormativos(strapi);
    await seedHeroConfig(strapi);
    await seedAutor(strapi);
    // seedArticulos, seedDebate y seedProgramas removidos: el contenido
    // editorial lo gestiona el equipo desde el panel de Strapi.
    // Los programas reales son los 45 de la estructura curricular, importados
    // con CNUS/scripts/import-programas.js. Mantener el seed recreaba los 4
    // cursos de ejemplo en cada arranque, aunque se borraran.
    await seedAudiencia(strapi);

    strapi.log.info('[seed] ✅ Seed completado correctamente.');
  } catch (err) {
    strapi.log.error('[seed] Error en seed:', err.message || err);
  }
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

async function findOrCreate(strapi, uid, where, data) {
  const existing = await strapi.documents(uid).findFirst({ filters: where });
  if (existing) return existing;
  return strapi.documents(uid).create({ data });
}

// ─── 1. CATEGORÍAS ──────────────────────────────────────────────────────────

async function seedCategorias(strapi) {
  const datos = [
    { nombre: 'Noticias y Eventos',   slug: 'noticias-y-eventos',   orden: 1 },
    { nombre: 'Pensamiento Complejo', slug: 'pensamiento-complejo', orden: 2 },
    { nombre: 'Notas del presidente', slug: 'notas-del-presidente', orden: 3 },
    { nombre: 'Columna del director', slug: 'columna-del-director', orden: 4 },
  ];

  const result = {};
  for (const d of datos) {
    const cat = await findOrCreate(strapi, 'api::categoria.categoria', { slug: { $eq: d.slug } }, d);
    result[d.slug] = cat;
  }
  strapi.log.info('[seed] Categorías listas ✅');
  return result;
}

// ─── 2. TAGS ─────────────────────────────────────────────────────────────────

async function seedTags(strapi) {
  const datos = [
    { nombre: 'Sindicalismo',        slug: 'sindicalismo' },
    { nombre: 'Derechos Laborales',  slug: 'derechos-laborales' },
    { nombre: 'Formación',           slug: 'formacion' },
    { nombre: 'Trabajo Decente',     slug: 'trabajo-decente' },
    { nombre: 'Incidencia Política', slug: 'incidencia-politica' },
    { nombre: 'Liderazgo',           slug: 'liderazgo' },
    { nombre: 'Género',              slug: 'genero' },
  ];

  const result = [];
  for (const d of datos) {
    const tag = await findOrCreate(strapi, 'api::tag.tag', { slug: { $eq: d.slug } }, d);
    result.push(tag);
  }
  strapi.log.info('[seed] Tags listos ✅');
  return result;
}

// ─── 3. EJES FORMATIVOS ──────────────────────────────────────────────────────

async function seedEjesFormativos(strapi) {
  const ejes = [
    { nombre: 'Identidad sindical',    slug: 'identidad-sindical',    color: '#0045A5', orden: 1 },
    { nombre: 'Derechos laborales',    slug: 'derechos-laborales',    color: '#E05A2B', orden: 2 },
    { nombre: 'Diálogo democrático',   slug: 'dialogo-democratico',   color: '#2EAE6D', orden: 3 },
    { nombre: 'Equidad e inclusión',   slug: 'equidad-e-inclusion',   color: '#9B59B6', orden: 4 },
    { nombre: 'Liderazgo sindical',    slug: 'liderazgo-sindical',    color: '#E67E22', orden: 5 },
    { nombre: 'Economía y trabajo',    slug: 'economia-y-trabajo',    color: '#16A085', orden: 6 },
    { nombre: 'Incidencia política',   slug: 'incidencia-politica',   color: '#2980B9', orden: 7 },
    { nombre: 'Investigación sindical', slug: 'investigacion-sindical', color: '#8E44AD', orden: 8 },
    { nombre: 'Desarrollo sectorial',  slug: 'desarrollo-sectorial',  color: '#27AE60', orden: 9 },
    { nombre: 'Políticas educativas',  slug: 'politicas-educativas',  color: '#C0392B', orden: 10 },
  ];

  for (const eje of ejes) {
    await findOrCreate(strapi, 'api::eje-formativo.eje-formativo', { nombre: { $eq: eje.nombre } }, eje);
  }
  strapi.log.info('[seed] Ejes formativos listos ✅');
}

// ─── 4. HERO CONFIG ─────────────────────────────────────────────────────────

async function seedHeroConfig(strapi) {
  const existing = await strapi.documents('api::hero-config.hero-config').findFirst();

  if (existing) {
    strapi.log.info('[seed] Hero Config ya existe, se conserva sin cambios ✅');
    return;
  }

  const data = {
    tipo_media:  'video',
    titulo:      'Formación sindical sociopolítica para transformar la República Dominicana',
    subtitulo:   'Fortalece tu liderazgo y conocimientos para impulsar un trabajo decente y mejores condiciones sociales.',
    boton_texto: 'Conocer más',
    boton_url:   '/programas',
    stat_1:      '10 ejes formativos',
    stat_2:      '8 modalidades',
    stat_3:      '14 líneas sectoriales',
  };

  await strapi.documents('api::hero-config.hero-config').create({ data });
  strapi.log.info('[seed] Hero Config creado ✅');
}

// ─── 5. AUTOR ───────────────────────────────────────────────────────────────

async function seedAutor(strapi) {
  const autor = await findOrCreate(
    strapi,
    'api::autor.autor',
    { nombre: { $eq: 'Redacción' } },
    {
      nombre:    'Redacción',
      apellido:  'ESCP',
      cargo:     'Escuela CNUS de Sindicalismo Sociopolítico',
      biografia: 'Equipo editorial de la Escuela CNUS.',
    }
  );
  strapi.log.info('[seed] Autor listo ✅');
  return autor;
}

// ─── 6. ARTÍCULOS ───────────────────────────────────────────────────────────

async function seedArticulos(strapi, categorias, tags, autor) {
  // Limpiar artículos de prueba antiguos (slugs que inician con 'prueba-')
  try {
    const dummyArticles = await strapi.documents('api::articulo.articulo').findMany({
      filters: { slug: { $startsWith: 'prueba-' } },
    });
    for (const d of dummyArticles) {
      await strapi.documents('api::articulo.articulo').delete({ documentId: d.documentId });
    }
    if (dummyArticles.length > 0) {
      strapi.log.info(`[seed] Se eliminaron ${dummyArticles.length} artículos de prueba antiguos.`);
    }
  } catch (err) {
    strapi.log.warn('[seed] Error al limpiar artículos de prueba:', err.message);
  }

  const articulosData = [
  {
    "titulo": "Pepe Abreu: trayectoria y liderazgo sindical",
    "slug": "pepe-abreu-trayectoria-liderazgo-sindical",
    "extracto": "Sobre el presidente de CNUS Pepe Abreu: trayectoria y trascendencia del liderazgo sindical dominicano Por Asdrubal Sepulveda...",
    "contenido": "Sobre el presidente de CNUS\n\nPepe Abreu: trayectoria y trascendencia del liderazgo sindical dominicano\n\nPor Asdrubal Sepulveda\n\nPensamiento Critico\n\nRafael Francisco Abreu Polanco, conocido públicamente como Pepe Abreu, nació en Tenares, República Dominicana, el 24 de mayo de 1951. A la edad de ocho años se trasladó junto a sus padres y hermanos a la ciudad de Santo Domingo.\n\nDurante esa etapa de su vida, su familia llegó a residir en más de veinte barrios populares de la capital. Esta experiencia le permitió conocer de cerca las condiciones de vida, las necesidades y las luchas cotidianas de los sectores más empobrecidos del pueblo dominicano.\n\nUno de sus primeros empleos, cuando apenas tenía doce años, fue en una ferretería donde debía manipular productos químicos sin contar con la debida protección. Posteriormente trabajó en diversas fábricas, desempeñando faenas intensas y exigentes.\n\nSu disposición para el trabajo, sin rehuir responsabilidades ni poner reparos ante la dureza de las tareas, llamaba la atención de sus superiores. Años más tarde, algunos médicos le indicaron que varias de las enfermedades que ha padecido posiblemente tuvieron su origen en aquellos trabajos realizados a temprana edad y en condiciones laborales inadecuadas.\n\nSus inquietudes sociales comenzaron a manifestarse durante la adolescencia, etapa en la que se incorporó a organizaciones juveniles y participó activamente en clubes culturales de los barrios donde residía.\n\nSus inicios en el movimiento sindical\n\nMás adelante ingresó como trabajador contratado en la empresa Dulcera Dominicana de Bolonotto Hermanos. Al recordar esa experiencia, expresó:\n\n“Yo entré ahí muy joven a trabajar. Es ahí donde nacen mis inquietudes en el aspecto sindical, porque vi cómo se trataba al trabajador en ese tiempo, cómo se le explotaba, todo lo que tenía que trabajar y lo poco que se le pagaba. Eran horas intensas de un trabajo duro. Eso fue despertando mi interés por la organización del movimiento sindical”.\n\nDe esta manera comenzó su trayectoria como sindicalista. En la empresa Bolonotto participó en la estructuración y dirección de los Comités Fabriles, organismos clandestinos vinculados a la confederación sindical de la época, el Frente Obrero Unido Pro Sindicatos Autónomos (FOUPSA).\n\nSobre aquel período, Pepe Abreu ha relatado:\n\n“Ahí comenzamos a crear organizaciones sindicales que en ese tiempo no podían actuar públicamente. Durante los doce años de Balaguer, esas organizaciones eran clandestinas. Uno hacía sus denuncias mediante volantes sobre las condiciones en que trabajaban los asalariados”.\n\nLa combinación de su compromiso sindical y su militancia política en el Movimiento Popular Dominicano (MPD) le ocasionó, junto a su familia, momentos sumamente difíciles.\n\nAl referirse a la persecución política sufrida en aquellos años, explicó:\n\n“La casa de mi familia era allanada constantemente. Mi mamá sufrió los rigores de una Policía que iba a nuestra casa y le decía, por ejemplo: ‘Doña María, vístase de luto, porque donde encontremos a ese muchacho suyo, no habrá vida para él’”. Como consecuencia de esa persecución política y policial, en 1972 fue apresado y permaneció durante dos años y medio encarcelado en condiciones extremadamente difíciles.\n\nConsolidación de su liderazgo sindical\n\nAl salir de la cárcel, asumió inmediatamente responsabilidades como dirigente sindical en el sector de la alimentación y se integró a la dirección de la Central General de Trabajadores (CGT). A partir de entonces, Pepe Abreu ha participado en innumerables jornadas de lucha por la defensa de los derechos laborales, las libertades sindicales, la seguridad social y el mejoramiento de las condiciones de vida de los trabajadores y las trabajadoras de la República Dominicana.\n\nTuvo una participación activa en el proceso de discusión, modificación y aprobación del Código de Trabajo de 1992, una de las principales conquistas institucionales del movimiento sindical dominicano. Asimismo, ha escrito decenas de artículos de opinión y análisis sobre temas laborales, sindicales, sociales, económicos y políticos, contribuyendo a la formación de opinión y al fortalecimiento de la conciencia de la clase trabajadora.\n\nFue también uno de los principales propulsores de la Ley núm. 87-01, que creó el Sistema Dominicano de Seguridad Social. Desde entonces, ha mantenido una defensa constante del derecho de los trabajadores y las trabajadoras a recibir pensiones y jubilaciones dignas.\n\nResponsabilidades institucionales\n\nA lo largo de su trayectoria, Pepe Abreu ha desempeñado importantes funciones de representación sindical e institucional. Entre ellas se encuentran:\n\nPresidente de la Confederación Nacional de Unidad Sindical (CNUS).\n\nRepresentante de los trabajadores en la Comisión Ejecutiva del Consejo Económico y Social (CES).\n\nRepresentante de los trabajadores en la Junta Directiva del Fondo Patrimonial de las Empresas Reformadas (FONPER).\n\nVicepresidente del Consejo de Directores del Instituto Nacional de Formación Técnico Profesional (INFOTEP).\n\nDesde estos espacios ha procurado representar los intereses de la clase trabajadora, defender el diálogo social y promover políticas laborales orientadas hacia la justicia, la equidad y el respeto de los derechos adquiridos.\n\nActualmente, encabeza las luchas que desarrollan los trabajadores y sus organizaciones por la defensa y preservación del auxilio de cesantía, derecho laboral que determinados sectores empresariales pretenden reducir o eliminar de la legislación laboral dominicana.\n\nLegado y trascendencia histórica\n\nEl principal legado que Pepe Abreu ha venido construyendo consiste en su condición de ideólogo, dirigente y conductor de un amplio proceso de adecuación política, institucional, laboral, programática y orgánica del movimiento sindical dominicano.\n\nSu liderazgo ha contribuido a reorientar al sindicalismo en el complejo tránsito desde los modelos productivos, culturales y organizativos propios del período de la gran industria y la bipolaridad, hacia las transformaciones de la posmodernidad, la globalización, la flexibilización laboral y el surgimiento de nuevos paradigmas vinculados con la economía y la producción digital.\n\nEsta labor ha implicado comprender que el sindicalismo no puede limitarse exclusivamente a las reivindicaciones salariales o a la defensa inmediata de las condiciones de trabajo. También debe participar en los debates sobre democracia, seguridad social, formación profesional, políticas públicas, desarrollo económico, protección ambiental, transformación tecnológica y justicia social.\n\nLa trayectoria de Pepe Abreu representa la continuidad de una vida dedicada a la organización de los trabajadores, a la defensa de sus derechos y a la construcción de un sindicalismo con capacidad para interpretar los cambios de la sociedad y responder a las nuevas formas de explotación, desigualdad y exclusión.\n\nSu historia personal y política se encuentra profundamente vinculada con la evolución del movimiento sindical dominicano, sus luchas, sus conquistas y sus desafíos. Desde su temprana incorporación al trabajo fabril hasta sus actuales responsabilidades nacionales, Pepe Abreu ha mantenido un compromiso constante con la dignidad del trabajo, la democracia social y la unidad de la clase trabajadora.",
    "fecha_publicacion": "2026-07-25",
    "destacado": true,
    "categorySlug": "notas-del-presidente"
  },
  {
    "titulo": "El empresariado dominicano y sus privilegios",
    "slug": "critica-razon-empresarial-privilegios",
    "extracto": "El empresariado dominicano y la concentración del privilegio: una crítica necesaria En la República Dominicana existe un debate que rara vez se desarrolla con la profundidad que merece: el papel de las grandes élites empresariales en la economía, la ...",
    "contenido": "El empresariado dominicano y la concentración del privilegio: una crítica necesaria\n\nEn la República Dominicana existe un debate que rara vez se desarrolla con la profundidad que merece: el papel de las grandes élites empresariales en la economía, la política y la distribución de la riqueza. Durante décadas, un reducido grupo de conglomerados ha acumulado un enorme poder económico e influencia sobre las decisiones públicas, mientras amplios sectores de la población continúan enfrentando salarios insuficientes, servicios públicos deficientes y oportunidades limitadas.\n\nLa crítica no consiste en cuestionar la existencia de la empresa privada ni el valor de la inversión. Toda economía necesita empresarios, innovación y generación de empleo. El problema surge cuando una parte del empresariado parece considerar que el crecimiento económico solo tiene sentido si beneficia principalmente a quienes ya concentran el capital, relegando a un segundo plano las necesidades de los trabajadores, las comunidades y el medio ambiente.\n\nCon frecuencia se denuncia que determinados sectores empresariales ejercen una influencia desproporcionada sobre las políticas públicas. Incentivos fiscales prolongados, exenciones tributarias, subsidios, protección frente a la competencia y regulaciones diseñadas para favorecer intereses particulares forman parte de un debate recurrente. Sus defensores sostienen que estas medidas promueven la inversión y el empleo; sus críticos responden que, cuando se prolongan sin una evaluación rigurosa, terminan trasladando recursos públicos hacia actores privados mientras el Estado dispone de menos fondos para educación, salud, infraestructura y protección social.\n\nOtro punto de controversia es la percepción de que el sistema tributario no distribuye las cargas de manera equitativa. Mientras trabajadores y consumidores soportan una parte importante de la recaudación mediante impuestos al consumo y retenciones salariales, algunos críticos argumentan que existen mecanismos legales e ilegales que permiten reducir significativamente la carga fiscal de ciertos grupos empresariales. Si estas prácticas ocurren, debilitan la capacidad del Estado para financiar bienes públicos y erosionan la confianza ciudadana en las instituciones.\n\nTambién preocupa la relación entre desarrollo económico y sostenibilidad ambiental. Diversos proyectos industriales, inmobiliarios, mineros y turísticos han sido objeto de cuestionamientos por sus posibles impactos sobre ecosistemas, fuentes de agua y comunidades locales. El crecimiento económico pierde legitimidad cuando los beneficios se privatizan, pero los costos ambientales y sociales recaen sobre la población.\n\nA ello se suma la marcada desigualdad en la distribución de la riqueza. Mientras algunos grupos empresariales exhiben estilos de vida de enorme lujo y continúan expandiendo sus patrimonios, millones de dominicanos enfrentan dificultades para cubrir necesidades básicas. La existencia de riqueza no constituye un problema en sí misma; la preocupación aparece cuando esa riqueza coexiste con una elevada desigualdad, baja movilidad social y escasas oportunidades para quienes nacen en condiciones desfavorables.\n\nOtro aspecto que alimenta las críticas es la estrecha relación entre poder económico y poder político. Cuando los principales grupos empresariales cuentan con acceso privilegiado a los tomadores de decisiones, financian campañas o ejercen una influencia significativa en la elaboración de políticas públicas, surge la percepción de que las reglas del juego no benefician por igual a toda la sociedad. La democracia requiere instituciones capaces de equilibrar intereses diversos, no de responder de manera desproporcionada a quienes poseen mayor capacidad económica.\n\nSin embargo, sería injusto presentar al empresariado como un bloque homogéneo. Existen empresas que cumplen sus obligaciones tributarias, invierten en innovación, generan empleos de calidad, respetan las normas laborales y desarrollan programas de responsabilidad social y sostenibilidad. La crítica apunta a prácticas y estructuras de poder, no a todas las personas que desarrollan actividades empresariales.\n\nLa República Dominicana necesita una economía dinámica, pero también más justa. Eso implica fortalecer la competencia, combatir la evasión fiscal y la corrupción, revisar periódicamente los incentivos públicos para asegurar que cumplan objetivos claros, proteger el medio ambiente, garantizar condiciones laborales dignas y promover instituciones independientes que actúen en beneficio del interés general.\n\nEl desarrollo no puede medirse únicamente por el crecimiento del producto interno bruto o por las ganancias de un pequeño grupo. Una sociedad verdaderamente próspera es aquella donde la riqueza se crea con reglas transparentes, se distribuyen oportunidades de manera más amplia y el éxito económico convive con la responsabilidad social, el respeto al medio ambiente y el fortalecimiento de las instituciones democráticas.\n\nEl desafío no consiste en enfrentar al empresariado con la sociedad, sino en construir un modelo en el que la prosperidad privada contribuya de manera efectiva al bienestar colectivo. Cuando el poder económico se ejerce con responsabilidad, transparencia y compromiso con el interés público, la empresa privada se convierte en un motor de desarrollo. Cuando se utiliza para preservar privilegios y concentrar beneficios, termina profundizando las desigualdades y debilitando la confianza en el sistema.",
    "fecha_publicacion": "2026-07-20",
    "destacado": true,
    "categorySlug": "pensamiento-complejo"
  },
  {
    "titulo": "La Década del Envejecimiento Saludable en RD",
    "slug": "decada-envejecimiento-saludable-desafios",
    "extracto": "La Década del Envejecimiento Saludable: un compromiso impostergable para República Dominicana En 2020, la Asamblea General de las Naciones Unidas proclamó la Década del Envejecimiento Saludable (2021-2030), bajo el liderazgo de la Organización Mundia...",
    "contenido": "La Década del Envejecimiento Saludable: un compromiso impostergable para República Dominicana\n\nEn 2020, la Asamblea General de las Naciones Unidas proclamó la Década del Envejecimiento Saludable (2021-2030), bajo el liderazgo de la Organización Mundial de la Salud. Esta iniciativa busca transformar la manera en que las sociedades entienden y gestionan el envejecimiento, garantizando que las personas mayores vivan con dignidad, autonomía y participación activa. No se trata únicamente de prolongar la vida, sino de asegurar que esos años adicionales sean plenos y significativos.\n\nEn República Dominicana, este llamado adquiere una relevancia especial. Nuestro país enfrenta un rápido proceso de envejecimiento poblacional: para 2030, más del 15% de la población tendrá más de 60 años. Sin embargo, persisten prácticas de edadismo que limitan la inclusión de los adultos mayores en el trabajo, la política y la vida comunitaria. La Década del Envejecimiento Saludable nos invita a derribar esos prejuicios y a construir entornos que reconozcan la experiencia como un activo, no como una carga.\n\nLas implicaciones son profundas. En el ámbito de la salud, urge garantizar servicios integrados y centrados en la persona, que atiendan tanto enfermedades crónicas como necesidades de bienestar emocional. En lo social, necesitamos comunidades inclusivas que fomenten la solidaridad intergeneracional, donde jóvenes y mayores compartan proyectos, aprendizajes y responsabilidades. En lo político, es indispensable asegurar la representación de todas las edades en los espacios de decisión, evitando que los mayores sean invisibilizados y que los jóvenes sean subestimados.\n\nLos sindicatos y cooperativas tienen un papel clave en esta transformación. En los espacios sindicales, aplicar la Década significa promover la participación de trabajadores mayores en procesos de negociación y formación, al tiempo que se reconoce el liderazgo emergente de los jóvenes. En las cooperativas, implica fomentar proyectos intergeneracionales que combinen la creatividad con la experiencia, fortaleciendo la sostenibilidad y la cohesión comunitaria. Estas organizaciones, por su naturaleza participativa, pueden convertirse en laboratorios de inclusión y en motores de cambio cultural.\n\nLa Década del Envejecimiento Saludable es, en definitiva, una oportunidad para redefinir nuestra sociedad. Nos invita a reconocer que cada etapa de la vida tiene un valor único y que el envejecimiento no debe ser visto como un problema, sino como una fase de contribución y aprendizaje. En República Dominicana, abrazar este compromiso significa apostar por la equidad, la solidaridad intergeneracional y el respeto a los derechos humanos. El reto está en nuestras manos: transformar el envejecimiento en un proceso digno, participativo y saludable para todos.\n\nEl envejecimiento saludable es un concepto promovido por la Organización Mundial de la Salud que se centra en mantener y potenciar la capacidad funcional de las personas mayores, permitiéndoles vivir con bienestar, autonomía y participación activa en la sociedad. No se trata de evitar por completo las enfermedades, sino de asegurar que las personas puedan seguir realizando las actividades que consideran significativas en su vida cotidiana.\n\nEste enfoque reconoce que el envejecimiento es un proceso natural influido por factores biológicos, sociales, culturales y ambientales. Por ello, el envejecimiento saludable implica tanto el cuidado de la capacidad intrínseca (fuerza física, salud mental, energía, resiliencia) como la creación de entornos favorables que faciliten la movilidad, la seguridad, el acceso a servicios de salud y la integración social.\n\nAdemás, el envejecimiento saludable se explica como una interacción entre los hábitos de vida (alimentación equilibrada, ejercicio, sueño adecuado, control del estrés), el acceso a servicios de salud integrados y la posibilidad de participar en actividades sociales, culturales y políticas. La inclusión y la solidaridad intergeneracional son esenciales para que las personas mayores no sean marginadas, sino reconocidas como actores valiosos en la comunidad. En síntesis, el envejecimiento saludable es un proceso colectivo y personal que busca garantizar que las personas mayores puedan seguir contribuyendo, aprendiendo y disfrutando de la vida, en un entorno que respete sus derechos y promueva su bienestar integral.",
    "fecha_publicacion": "2026-07-15",
    "destacado": false,
    "categorySlug": "pensamiento-complejo"
  },
  {
    "titulo": "Apuntes para una nueva Seguridad Social Dominicana",
    "slug": "apuntes-nueva-seguridad-social-dominicana",
    "extracto": "APUNTES PARA UNA NUEVA SEGURIDAD SOCIAL DOMINICANA La seguridad social dominicana necesita una nueva etapa histórica Más de dos décadas después de la Ley 87-01, el país debe pasar de construir instituciones a garantizar derechos efectivos...",
    "contenido": "APUNTES PARA UNA NUEVA SEGURIDAD SOCIAL DOMINICANA\n\nLa seguridad social dominicana necesita una nueva etapa histórica\n\nMás de dos décadas después de la Ley 87-01, el país debe pasar de construir instituciones a garantizar derechos efectivos\n\nLa seguridad social dominicana llegó a un momento decisivo de su historia. Durante más de veinte años, el país ha construido una estructura institucional que significó un avance importante frente a la ausencia de un sistema integral de protección social. La aprobación de la Ley 87-01 representó una transformación profunda al establecer mecanismos organizados para proteger a la población frente a riesgos fundamentales como la enfermedad, la vejez, la discapacidad y los accidentes laborales.\n\nSin embargo, el paso del tiempo obliga a realizar una evaluación seria y responsable. La pregunta que debe hacerse la sociedad dominicana no es solamente cuántas personas aparecen registradas en el sistema, cuántas instituciones existen o cuántos recursos se administran. La pregunta esencial es:\n\n¿Está la seguridad social protegiendo realmente a las personas como fue concebida? Esa es la discusión que debe ocupar el centro del debate nacional.\n\nDe la afiliación al derecho efectivo\n\nUno de los principales desafíos de esta nueva etapa es comprender que la seguridad social no puede reducirse a un proceso administrativo de afiliación. Una persona puede aparecer registrada en un sistema y, al mismo tiempo, enfrentar grandes dificultades para recibir atención médica oportuna, conseguir medicamentos, acceder a tratamientos especializados o alcanzar una pensión suficiente después de una vida de trabajo.\n\nLa verdadera medida del éxito de la seguridad social está en la vida cotidiana de la gente. Está en la familia que no pierde sus ingresos cuando llega una enfermedad. Está en el trabajador que puede retirarse con dignidad después de décadas de esfuerzo. Está en la persona accidentada que recibe atención, rehabilitación y protección. Está en el ciudadano que no queda abandonado por no tener capacidad económica. La seguridad social debe medirse por la protección que garantiza, no solamente por la estructura que administra.\n\nUna reforma necesaria, no una negación del pasado\n\nPlantear una nueva etapa de reforma no significa desconocer los avances alcanzados. La República Dominicana dio un paso histórico al crear el Sistema Dominicano de Seguridad Social. Miles de personas que antes estaban excluidas lograron incorporarse a mecanismos de protección que no existían.\n\nPero las sociedades cambian, el mundo laboral cambia y las necesidades sociales evolucionan. Las instituciones creadas hacen más de veinte años deben ser evaluadas a la luz de la realidad actual. La reforma no debe ser vista como una amenaza. Debe asumirse como una oportunidad para corregir deficiencias, fortalecer derechos y preparar el sistema para las próximas generaciones.\n\nLos países que avanzan son aquellos capaces de revisar sus políticas públicas cuando la realidad demuestra que necesitan transformaciones.\n\nLa deuda pendiente con los trabajadores\n\nUno de los mayores retos continúa siendo garantizar que la clase trabajadora reciba una protección acorde con sus aportes y sacrificios. Durante décadas, los trabajadores dominicanos han contribuido al crecimiento económico nacional.\n\nHan construido empresas, desarrollado servicios, producido bienes y sostenido sectores fundamentales de la economía.Sin embargo, todavía existe una preocupación legítima sobre si el sistema actual garantizará pensiones suficientes para quienes han dedicado su vida al trabajo.\n\nUna sociedad justa no puede aceptar que después de una vida laboral una persona tenga que enfrentar la vejez en condiciones de incertidumbre económica. La pensión digna no es un privilegio. Es un derecho construido mediante años de trabajo y aportes.\n\nLa seguridad social del futuro debe ser más humana\n\nEl debate sobre la seguridad social no puede limitarse a cálculos financieros. Por supuesto que la sostenibilidad económica es necesaria. Todo sistema debe contar con recursos suficientes para mantenerse. Pero la sostenibilidad no puede convertirse en una excusa para reducir derechos o aceptar prestaciones insuficientes.\n\nEl objetivo final de la seguridad social es proteger personas. Los números deben estar al servicio de la sociedad, no la sociedad al servicio de los números. Una seguridad social moderna debe ser: más universal; más solidaria; más transparente; más participativa; más cercana a la ciudadanía.\n\nEl papel del movimiento sindical\n\nEl movimiento sindical tiene una responsabilidad histórica en esta nueva etapa. La defensa de los derechos laborales del presente debe complementarse con la construcción de propuestas para el futuro. Los trabajadores no pueden ser simples usuarios de decisiones tomadas por otros.\n\nDeben participar activamente en la orientación del sistema que ellos mismos contribuyen a financiar. La seguridad social debe ser producto del diálogo social, del consenso democrático y de la participación efectiva.\n\nUn llamado a construir un nuevo pacto social\n\nLa República Dominicana necesita abrir una nueva conversación nacional sobre seguridad social. Una conversación sin prejuicios, pero con claridad. Sin intereses particulares por encima del interés colectivo. Sin miedo a reconocer problemas existentes.\n\nEl país tiene la oportunidad de construir una segunda generación de reformas que coloque nuevamente la dignidad humana en el centro. La seguridad social que necesitamos no es solamente la que administra riesgos. Es la que garantiza tranquilidad.\n\nNo es solamente la que registra afiliados. Es la que protege vidas. No es solamente la que existe en documentos. Es la que funciona cuando una persona más la necesita. Ha llegado el momento de construir esa nueva etapa histórica.\n\nAsdrúbal SepúlvedaSecretario de Política Educativa de CNUS",
    "fecha_publicacion": "2026-07-10",
    "destacado": true,
    "categorySlug": "columna-del-director"
  },
  {
    "titulo": "Signos de rebelión en la sociedad dominicana",
    "slug": "signos-rebelion-sociedad-dominicana",
    "extracto": "Signos de rebelión en la sociedad dominicana La sociedad dominicana vive un desorden que no puede explicarse únicamente por la mala conducta de individuos aislados. La violencia cotidiana, la fragilidad de muchas familias, el irrespeto a las normas, ...",
    "contenido": "Signos de rebelión en la sociedad dominicana\n\nLa sociedad dominicana vive un desorden que no puede explicarse únicamente por la mala conducta de individuos aislados. La violencia cotidiana, la fragilidad de muchas familias, el irrespeto a las normas, la pérdida de autoridad en organizaciones comunitarias, la impunidad, la desconfianza hacia las instituciones y la normalización de prácticas que antes habrían provocado vergüenza son señales de una crisis más profunda. No estamos simplemente ante una suma de transgresiones. Estamos ante el agotamiento de formas de convivencia que ya no logran integrar, orientar ni comprometer a una parte importante de la sociedad.\n\nLa disociación interior del individuo, la pérdida de referencias éticas compartidas y la distancia creciente entre las normas escritas y la vida real revelan que el orden social vigente funciona mal. Las leyes existen, las instituciones existen, las autoridades existen; pero demasiadas veces no producen respeto, confianza ni sentido de pertenencia. Cuando una norma deja de ser reconocida como justa o útil para la vida común, deja de ordenar y comienza a ser percibida como una imposición externa.\n\nEse es uno de los dramas del país: se exige obediencia a ciudadanos que, en muchos casos, no encuentran en el Estado, en el mercado ni en las élites sociales una conducta que merezca ser imitada. No puede pedirse respeto absoluto por la ley mientras autoridades la violentan, funcionarios la utilizan selectivamente y sectores poderosos parecen vivir por encima de sus consecuencias. Tampoco puede reclamarse disciplina social mientras el clientelismo convierte los derechos en favores, la corrupción transforma lo público en botín y la desigualdad obliga a amplios sectores a vivir sin seguridad, sin protección y sin horizonte.\n\nSin embargo, sería un error trasladar toda la responsabilidad a la sociedad o a sus instituciones. El individuo no puede ser despojado de su autonomía moral. Quien roba, agrede, mata, abusa o destruye responde por sus actos. La precariedad, la exclusión o el mal funcionamiento del sistema pueden explicar parte del contexto, pero nunca deben convertirse en excusa para justificar la degradación humana.\n\nLa responsabilidad es doble: individual y colectiva. Cada transgresión expresa la decisión concreta de una persona, pero también revela una sociedad que no ha logrado producir límites eficaces, valores compartidos ni instituciones capaces de prevenir, corregir y sancionar. Culpar solamente al transgresor oculta la responsabilidad del orden que lo rodea. Culpar solamente al sistema borra la capacidad individual de elegir entre el daño y la responsabilidad.\n\nLa crisis dominicana exige asumir ambas verdades al mismo tiempo. La sociedad no surge espontáneamente ni se sostiene por inercia. Antes de que exista un orden social estable, existen conflictos, deseos, frustraciones, desigualdades, aspiraciones y búsquedas de reconocimiento que atraviesan la subjetividad de las personas y los distintos espacios de la vida colectiva. Cuando esas tensiones no encuentran canales de expresión, participación y diálogo, terminan manifestándose de manera desordenada, agresiva o contradictoria.\n\nPor eso, el caos que percibimos no solo cuestiona el orden actual. También indica que se están formando nuevas sensibilidades, nuevos códigos y nuevas maneras de relacionarse que todavía no han encontrado un lenguaje político, institucional y cultural capaz de encauzarlas.\n\nUna parte importante de esos signos aparece en la juventud y en los sectores populares: nuevas formas de hablar, de vestirse, de bailar, de producir música, de usar símbolos, de comunicarse en redes sociales y de expresar inconformidad frente a las jerarquías tradicionales. Estas expresiones suelen ser calificadas apresuradamente como vulgaridad, desviación o simple decadencia por sectores que se consideran cultos.\n\nPero esa reacción revela, muchas veces, más prejuicio social que comprensión cultural. Toda cultura viva incorpora conflictos, rupturas y formas nuevas de lenguaje. Lo que hoy se presenta como lenguaje culto fue, en algún momento, una forma popular, directa y poco reconocida por las élites. Las lenguas, las músicas, los gestos, las modas y las expresiones artísticas no se desarrollan en los salones cerrados de quienes pretenden custodiar la cultura: se alimentan también de la creatividad, la irreverencia y las necesidades expresivas del pueblo.\n\nEl problema no está en que los jóvenes alteren códigos lingüísticos, musicales o estéticos. El problema aparece cuando la sociedad no ofrece espacios para que esa energía se transforme en creación, pensamiento, organización y participación. Cuando la escuela solo corrige, pero no escucha. Cuando la política solo promete, pero no incorpora. Cuando los medios solo explotan la imagen de la juventud, pero no reconocen sus demandas. Cuando el Estado solo reprime, pero no entiende.\n\nEntonces, la rebeldía puede degradarse en desesperación, violencia o nihilismo. No debemos romantizar el caos. La violencia, la misoginia, el irrespeto a la vida, la destrucción de bienes comunes, la delincuencia y la intolerancia no son expresiones liberadoras ni formas legítimas de rebeldía. Son síntomas de un deterioro que debemos enfrentar con firmeza. Pero tampoco podemos combatirlos mediante el moralismo fácil, la estigmatización de los pobres o la nostalgia de un pasado idealizado que nunca existió para todos.\n\nLa verdadera pregunta no es por qué la sociedad se comporta de manera distinta a como las élites esperan. La pregunta es por qué las instituciones tradicionales ya no logran generar respeto, confianza, adhesión ni esperanza. Una sociedad se vuelve peligrosa cuando sus miembros sienten que no tienen nada que defender porque nada les pertenece realmente. Cuando los derechos no se garantizan, el empleo es precario, la justicia parece selectiva, la educación no abre oportunidades y la política se vive como negocio de unos pocos, la convivencia pierde su base moral.\n\nEn esas condiciones, crecen la indiferencia, el resentimiento, la conducta destructiva y la búsqueda de pertenencia en grupos, símbolos o prácticas que ofrecen identidad inmediata, aunque sea a costa de la convivencia colectiva. El filósofo Sigmund Freud llamó “malestar en la cultura” a esa tensión permanente entre los impulsos individuales y las exigencias de la vida social. Ese malestar no es una anomalía ocasional; forma parte de toda civilización. Pero se vuelve explosivo cuando una sociedad carece de mecanismos legítimos para procesarlo: educación crítica, trabajo digno, espacios culturales, organizaciones sociales autónomas, participación política real, justicia efectiva y reconocimiento de la diversidad.\n\nLa República Dominicana necesita nuevas coordenadas políticas para comprender esa complejidad. No bastan las recetas de siempre: más propaganda, más promesas, más leyes sin aplicación, más represión sin prevención o más discursos que culpan a la gente por problemas que también nacen de la desigualdad, el abandono y el mal funcionamiento institucional.\n\nNecesitamos una política que lea las señales profundas de la sociedad, no solo sus expresiones superficiales. Una política capaz de escuchar a la juventud sin idealizarla; de reconocer la creatividad popular sin convertir la vulgaridad en virtud; de sancionar la violencia sin criminalizar la pobreza; y de reconstruir normas comunes sin imponer obediencia ciega. El desafío no es restaurar artificialmente un orden que ya perdió vigencia. El desafío es construir formas nuevas de integración social, donde la autoridad sea legítima porque sirve, la ley sea respetada porque protege, la cultura sea plural porque incluye y la ciudadanía sea activa porque participa.\n\nLos signos de rebelión que atraviesan la sociedad dominicana pueden convertirse en más fragmentación y barbarie, o pueden abrir camino hacia una renovación cultural y política. La diferencia dependerá de si seguimos respondiendo con desprecio, silencio y represión, o si somos capaces de transformar el malestar social en organización, pensamiento, participación y un nuevo compromiso con la vida colectiva. O sea que nos adentremos en los multidimensionales procesos de convertir pasiones en intereses, e intereses en ideales; tema de una próxima entrega\n\nAsdrubal Sepulveda\n\nSecretario política educativa CNUS",
    "fecha_publicacion": "2026-07-05",
    "destacado": false,
    "categorySlug": "pensamiento-complejo"
  },
  {
    "titulo": "El movimiento sindical ante la realidad laboral en RD",
    "slug": "movimiento-sindical-realidad-laboral-social",
    "extracto": "ARTÍCULO LIBRE Por: Rafael-Pepe-Abreu ¿Qué  se propone  el director  de  CORAASAN, ingeniero  Andrés  Cueto,  en  contra...",
    "contenido": "ARTÍCULO LIBRE\n\nPor: Rafael-Pepe-Abreu\n\n¿Qué  se propone  el director  de  CORAASAN, ingeniero  Andrés  Cueto,  en  contra \ndel sindicato de los Trabajadores de esa Empresa?\n\nEstá  interrogante  no surgió por casualidad, pues, desde que se  instaló en el puesto \nde director  nunca  ha  cesado  en  su afán por  destruir  el  sindicato  de  esta  empresa, \nque tiene una trayectoria de 48 años de haber sido constituido y más de 30 años de \nnegociación colectiva.\n\nEl señor Cueto y su equipo, entre los que se destaca Eddy Ortega, no recuerdan que \nla  Corporación  del  Acueducto  y  Alcantarillado  de  Santiago  (CORAASAN) fue \ncreada en 1978 (gobierno del expresidente Antonio Guzmán), posteriormente, en el \ngobierno del expresidente Hipólito Mejía, se creó la cláusula 15 para proteger a los \ntrabajadores con mérito de antigüedad.\n\nEn  la actualidad, gobierna Luis  Abinader, un presidente tan democrático como  los \nanteriores, con la misma raíz ideológica e histórica; sin embargo, el señor Cueto se \nha declarado enemigo acérrimo del sindicato y  violenta las cláusulas del convenio \ntales  como: los  beneficios farmacéuticos,  la  rifa  anual,  los  recursos  para  la \ncelebración del 1.º  de Mayo,  pago  de  horas  extras,  cuota  anual  para  los útiles \nescolares y préstamos de la cooperativa.\n\nEstas violaciones evidencian que el señor director insiste en transformar la empresa \nen  una  entidad  con criterios  distintos  a  los  establecidos  en  el  Código  Laboral, \ndonde se garantizan  los derechos  fundamentales  incluidas  las normas de  higiene  y \nseguridad  industrial y quiere  inducir  a  los  trabajadores  de CORAASAN a  que \npiensen que regidos solo por la ley de Administración Pública.\n\n¿Cuáles  son  sus  fines? eliminar el  sindicato  como  lo  conocemos,  extinguir  el \nconvenio  colectivo  y  hacer representar  a los  trabajadores  por  un  mamotreto,  bajo \nsu dependencia, que le permita imponer las reglas del juego, de manera autocrática.\n\nAnte esta actitud le preguntó: ¿Qué clase de político es usted, Sr. Cueto? ¿Por qué \nprovoca  a  la  Confederación  Nacional  de  Unidad  Sindical  (CNUS),  que nunca  ha \ntenido  una  conducta  confrontativa  con  su  administración? Deténgase un  momento \ny  pregunte  al  presidente  de  la  República,  Luis  Abinader,  quienes  somos  los  que \nconstituimos  esta  central. Él  nos conoce  mucho  mejor  que  usted  y  estamos \nagradecidos del respeto que nos tiene.\n\nEs  cierto  que  los  protegidos  suyos que  conforman  el alegado  sindicato que \npretende  imponer  son paniaguados del embajador en  la República Oriental  del \nUruguay.     Aun     así,     le     advertimos     que detenga     la tropelía contra \nSITRACORAASAN pues no nos quedaremos de brazos cruzados esperando a que \nusted ejecute su malsana obra.\n\nSi  de  algo  le  sirve, me gustaría recordarle que somos  partidarios  de  la  paz.  Sin \nembargo, en este país los problemas caldean los ánimos cada vez más y, si usted se \nconsidera  una  pieza política importante  de  este  gobierno, no  debe  actuar  en \nposición opuesta a la conducta de quien lo preside.\n\n8/7/2026",
    "fecha_publicacion": "2026-07-08",
    "destacado": false,
    "categorySlug": "notas-del-presidente"
  },
  {
    "titulo": "Propuestas y visión estratégica de la CNUS",
    "slug": "propuestas-vision-estrategica-cnus-trabajo-decente",
    "extracto": "Artículo Libre Por: Rafael Pepe Abreu Insistencia del señor Lorenzo Gómez Marín en el Tema de la Cesantía...",
    "contenido": "Artículo Libre\n\nPor: Rafael Pepe Abreu\n\nInsistencia del señor Lorenzo Gómez Marín en el Tema de la Cesantía\n\nRecientemente,      el   empresario   Lorenzo   Gómez   Marín,      conmemoró   el   40 \naniversario  de  su  empresa LOGOMARCA. En  un  desborde  de  entusiasmo,  señaló \nlo  mucho  que  su  marca  ha  crecido  al  tiempo  de  que  anunció  la  puesta  en \ncirculación de un libro con el sugestivo título “El Emprendedor y su Laberinto”.\n\nSus  conclusiones  sobre  la  prestación  eventual  denominada  cesantía, no  pueden \nser  más  desafortunadas  ya  qué,  según  su  criterio,  esta  se  constituye  en  una \nenemiga entre el empleador y sus trabajadores.\n\nEn  ocasiones,  pienso  que  quienes  tenemos  la  oportunidad  de  usar  los  diversos \nmedios  de  comunicación  debemos  ser  cuidadosos,  debido  a  que  el  público  que \nrecibe  la  información  no  está  integrado  por  personas  menos  inteligentes  que \naquellos que la emiten. Entre los que escuchaban este discurso habrá muchos qué \nse preguntarán ¿acaso el señor Gómez Marín no es dueño de un emprendimiento \nqué  ha  crecido durante  cuarenta años  en  este país,  coexistiendo  con  la  cesantía, \nsin qué corriera la suerte de muchas empresas poderosas qué llegan a la quiebra \nen países donde no existe esta prestación?\n\nPara colmo,  el señor Gómez Marín fue entrevistado de manera “sorpresiva” en su \npropio  programa  por  dos  de  sus  acompañantes  habituales  en  la  conducción  del \nmismo.  Como  es  lógico,  aquellos  conductores,  a  quienes  no  cuestionamos  su \ncapacidad, hicieron lo que el sentido común dicta cuando una persona entrevista \na su propio jefe.\n\nSeñor  Gómez  Marín,  la  verdad  es  que  en  14  años,  los  empresarios  de  CONEP, \nCOPARDOM,  Asociación  de  Industria,  hoteleros,  zonas  francas,  construcción, \nsector agropecuario, no han logrado sus objetivos con la reforma laboral.\n\nParece  que  las  bondades  de  propuestas  como  la  suya  no  han  encontrado \ncredibilidad.  No podemos, señor Marín, pretender que todos pensemos igual. Sin \nembargo,    es  preferible  que  una  persona  de  su  perfil  se  dedique  a  promover  el \ndominó,  el  ajedrez  u  otro  deporte,  en  vez  de  dedicarse  a  defender  una  postura \nanti cesantía frente a la opinión pública.\n\nMientras  tanto,    saque    un  tiempecito  para  concientizar  a  los  empleadores  que \nevaden,  eluden,  mantienen  por  largo  tiempo  las  exoneraciones,  exenciones,  los \nbajos  salarios  y  que  se  oponen  a  la  libertad  sindical,  pese  ser  un  derecho \ngarantizado  por  los  convenios  de  la  Organización  Internacional del  Trabajo  (OIT), \npor  la  Constitución  de  la  República  y  por  el  Código  Laboral.    A  lo  mejor,    esta \nmodalidad  de  sociólogo  le  podría  aportar  una  imagen  de  impulsor  de  la  justicia \nsocial, que no es lo que se deriva de su campaña contra la cesantía.\n\n21/7/2026.",
    "fecha_publicacion": "2026-07-21",
    "destacado": false,
    "categorySlug": "notas-del-presidente"
  },
  {
    "titulo": "El diálogo social en la transformación laboral de RD",
    "slug": "dialogo-social-pilar-transformacion-laboral",
    "extracto": "Artículo Libre Por: Rafael-Pepe-Abreu Que  el  proyecto  de  la  reforma  laboral  haya  perimido  es  coherente  con  el...",
    "contenido": "Artículo Libre\n\nPor: Rafael-Pepe-Abreu\n\nQue  el  proyecto  de  la  reforma  laboral  haya  perimido  es  coherente  con  el \nplanteamiento  de  las  confederaciones  sindicales,  quienes  el  pasado  martes  7  de \njulio,  en  rueda  de  prensa  conjunta,  solicitaron al  poder  ejecutivo  el  retiro  de  la \nreferida propuesta que estaba en el congreso.\n\nSin  lugar  a  dudas,  no  debemos  ignorar  lo  que  es  evidente:  el  empresariado \ndominicano,  de  todos  los  niveles,  se  ha  propuesto  como  una  de  sus  metas \nfundamentales   el   reemplazo   de   la   figura   denominada   cesantía.   Para   este \npropósito  se  han  valido  de  todos  los  subterfugios  habidos  y  por  haber  como \ndemuestra el discurrir de los acotecimientos.\n\nHago un paréntesis para señalar que, los ideólogos del empresariado tales como: \nel  reconocido  comunicador  Julio  Martínez  Pozo,  el  acreditado  economista  Andy \nDauhajre,  el  perspicaz  ingeniero  Ramón  Núñez  Ramírez  y  el  sofista- sociólogo \nCándido Mercedes, siempre han enfatizado que sin medida contra la cesantía no \npuede  hablarse  de  transformación  de lo  que  ellos  denominan  “altos  costos \nlaborales’’.  Esta  ideología  explica  las  causas  de  los  intentos  por  eliminar  la \ncesantía que desglosaré a continuación:\n\nPrimero:  En  el  año  2001,  durante  el  gobierno  de  Hipólito  Mejía,  intentaron \nsustituir la cesantía por un seguro de desempleo establecido el artículo 50 de Ley \n87-01.  Ese  gobierno  consensuó  con  los  sectores  tripartito,  estableció  capacidad \nde  veto  para  que  este  hecho  solo  se  produjera  con  la  no  objeción  de  los  tres \nsectores,  lo  que  claramente  fue  y  será altamente  favorable  para  el  movimiento \nsindical.\n\nSegundo: Con el ascenso al poder del presidente Danilo Medina, se restablecieron \nlas  conversaciones  con  relación  a  la  reforma  del  Código  Laboral.  Se  creó  una\n\ncomisión  que  no  funcionó  debido  a  desacuerdos  por  el  tema  de  la  cesantía \ncausados  por  la  intención  de  los  sectores  empresariales  de  imponer  un  proceso \nde votación mayoritaria que fue rechazado por la interlocución sindical.\n\nTercero:  Se  reconvocó  en  la  Universidad  INTEC,  con  la  mediación  de  su  rector \nRolando Guzmán. Hubo conversaciones donde se produjo una nueva rotura entre \nlos sectores participante por desacuerdos en el tema cesantía.\n\nCuarto:  A  raíz  de  la  promulgación  de  la  ley  No.  397-19,  que  crea  el  Instituto \nDominicano   de   Prevención   y   Protección   de   Riesgos   Laborales   (IDOPPRIL), \nintentaron transferir el pago de la cesantía a esta institución, mediante el párrafo \nIV de dicha ley. Esta propuesta recibió el rechazo unánime de las confederaciones \nsindicales.  Realizamos  una  gran  marcha  que  motivó  al  presidente  a  retirar  el \nreferido párrafo. Este hecho marcó una nueva rotura entre los sectores.\n\nQuinto:    El    Ministro    de    Trabajo    Winston    Santos    reconvocó.    Según    sus \ndeclaraciones  estuvo  a  punto  de  conseguir  el  objetivo  empresarial,  pero,  en  el \nmomento en que todos estaban de acuerdo una sola persona lo impidió. Es bueno \nque   el   señor   Santos   explicase   porque   un   acuerdo   con   todo   a   favor   fue \nentorpecido por un solo individuo.\n\nSexto:  Cuando  llegó  al  poder  el  presidente  Luis  Abinader,  muchos  sectores \nempresariales  batieron  palmas.  Publicaciones  de  la  época  señalaban  que  había \nllegado  la  hora  de  disminuir  la  cesantía,  pensando  en  el  origen  del  mandatario.  \nCasi dieron por hecho que lograría su anhelado propósito. Si hacemos honor a la \nhonradez  debemos  señalar  que,  desde  el  primer  día,  Abinader  dejó  claro  que  en \nsu gobierno no se realizaría una reforma que incluya este aspecto, por eso no es \nextraño que  perima y reiteramos que  las confederaciones somos coherentes con \nnuestra petición antes señalada.\n\nEstaremos  vigilantes para  evitar  que  dicha  reforma  sea  reintroducida  debido  a \nque perimió. Continuaremos manejándonos con la Ley 16-92 que es el código\n\nvigente.  Después  de  todo,  las  nuevas  modalidades  de  trabajo  que  surgirán  en  el \nescenario   laboral,   podrán   ser   tratadas   mediante   resoluciones   que,   en   una \ncoyuntura futura más adecuada podrían codificarse.\n\n28/7/2026.",
    "fecha_publicacion": "2026-07-28",
    "destacado": false,
    "categorySlug": "notas-del-presidente"
  },
  {
    "titulo": "Cándido Mercedes y Ramón Núñez: dúo a favor de empresarios",
    "slug": "candido-mercedes-ramon-nunez-ramirez-empresarios",
    "extracto": "ARTICULO LIBRE Por: Rafael-pepe-Abreu Candido Mercedes y Ramón Núñez Ramírez, buen duo a favor de los empresarios...",
    "contenido": "ARTICULO LIBRE\n\nPor: Rafael-pepe-Abreu\n\nCandido Mercedes y Ramón Núñez Ramírez, buen duo a favor de los empresarios \ncontra la Cesantía de los Trabajadores.\n\nEn una comparecencia televisiva, estas dos figuras patrióticas se elogiaban entre sí \nexaltando  cada  uno  las  virtudes  del  otro,  sin  que quedarán  santos  en  los  altares \nque no fueran flagelados por los latigasos de su larga perorata. Repentinamente y \ncomo por arte de magia, trajeron a colación uno de sus temas favorito la Reforma \nLaboral  y  la antipática  palabra  cesantía,  que sectores  empresariales  pretenden \nborrar del diccionario. La mente brillante de los referidos exponentes saco a relucir \nun hecho según ellos, los sindicalistas no le decimos la verdad a los trabajadores y \npor eso el señor Cándido con su fina inteligencia expuso algo que según su criterio \nlos trabajadores no saben y es que “el recorte de la cesantía solo afectará los \ncontratos futuros, no a los trabajadores vigente”.\n\nLa verdad que este señor es digno de que todas las academias del mundo lo tomen \ncomo  referente  de  una  inteligencia  superior,  debido  a  que  descubrió algo  que \ndesde hace 14 años es conocido por todos los interlocutores que intervienen en el \nproceso y más allá, el señor Mercedes fue más lejos y recordó a los que defienden \n“el derecho a la cesantía que en la Estrategia Nacional de Desarrollo, Ley del año \n2012,  esta  consignado  el  seguro  de  desempleo como sustituto de la cesantía” y \npara ser más brillante su intervención recordó “que desde el año 2001, se intentó \nen  la ley  de  seguridad  social  consignar  el  seguro  de  desempleo, tambien  como \nsustituto del pago de la prestación señalada”.\n\nLos  personajes  no  pueden  ser  más  digno  de  emulación,  sobre  todo  Cándido \nMercedes,  pues  él  es  profesor  de  nuestra  entrañable  Universidad Autonoma  de \nSanto Domingo (UASD) y por supuesto, sabe muy bien que en la UASD no existe el \ndesahucio medalaganario, que depende de un poder absoluto que esta en manos \ndel empleador contra el trabajador y se aplica sin tener que alegar causa, solo que \nel  empleador  debe  cumplir  con  el  pago  eventual  denominado  cesantía,  pero  la \n“candidez de Cándido” no  le  permite  tampoco  apreciar  que  los  profesores \nuniversitarios  gracias  al  sentido  de  justicia  social  que  predomina  en  la  UASD, \nreciben en su retiro una pensión vitalicia.\n\nMientras que el trabajador que depende del sistema de Administradora de Fondos \nde  Pensiones  (AFP),  que  el  elogia  sin  ser  parte  del  mismo,  recibirá como  mucho \ncuando llegue a la edad de retiro una tasa de reemplazo de un 30% del salario que \npercibia   cuando   era   trabajador activo.   El   señor   Mercedes,   atraido   por   su \nreacionario  interlocutor ni  siquiera  se  ubica  en  que  las  organizaciones  Uasdianas \ntales como; Asociacion de Empleados Universitarios (ASODEMU), la Federación de \nProfesores    Universitarios (FAPROUASD),    y    la    Federación    de    Estudiantes \nDominicanos  (FED),  han apoyado  a  los  trabajadores en  su  lucha  por  preservar  la \ncesantía.\n\nFinalmente,  lamentamos  decirle  a  los  señores  Ramón  Núñez  Ramírez  y  Cándido \nMercedes,  que  el  proyecto  sobre  la  reforma  laboral  acaba  de  perimir en el \nCongreso, nosotros esperamos que nadie lo reintroduzca para que el Código del 92 \npermanezca  como  está, tiene  ya  34  años,  la  UASD  tiene  más  de  100  y  nosotros \ndesde fuera nos opusimos y seguimos oponiendonos a cualquier intento de fusión, \npues señor Mercedes, hay avances que como los que usted propone para el código \nlaboral junto a los empresarios, son retroceso.\n\n29/7/2026.",
    "fecha_publicacion": "2026-07-29",
    "destacado": true,
    "categorySlug": "notas-del-presidente"
  }
];
  const creados = [];

  for (const item of articulosData) {
    // En Strapi v5 con D&P, findFirst sin status devuelve el draft.
    // Buscar explícitamente la versión publicada para evitar recrearla.
    const existingDraft = await strapi.documents('api::articulo.articulo').findFirst({
      filters: { slug: { $eq: item.slug } },
    });
    if (existingDraft) {
      creados.push(existingDraft);
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
}

// ─── 7. DEBATE ──────────────────────────────────────────────────────────────

async function seedDebate(strapi, articulos) {
  // Mantener solo un debate activo principal si se requiere
  const debatesData = [
    {
      slug: 'indexacion-salario-minimo',
      pregunta: '¿Debería el salario mínimo en República Dominicana indexarse automáticamente a la inflación?',
      contexto: 'Actualmente el salario mínimo se revisa cada dos años mediante negociación tripartita.',
      participantes: 0,
      respuestas: 0,
      activo: true,
      fecha_cierre: new Date().toISOString().split('T')[0],
    },
  ];

  for (const d of debatesData) {
    const existing = await strapi.documents('api::debate.debate').findFirst({
      filters: { slug: { $eq: d.slug } },
    });
    if (existing) continue;
    await strapi.documents('api::debate.debate').create({ data: d });
  }

  strapi.log.info('[seed] Debate activo listo ✅');
}

// ─── 9. AUDIENCIA ────────────────────────────────────────────────────────────

async function seedAudiencia(strapi) {
  try {
    const existing = await strapi.documents('api::audiencia.audiencia').findFirst();
    if (existing) {
      strapi.log.info('[seed] Audiencia ya existe, se conserva sin cambios ✅');
      return;
    }

    const slides = [
      {
        numero: '01.',
        titulo: 'Dirigentes / Delegados',
        descripcion: 'Dirigentes y delegados sindicales comprometidos con la defensa de los derechos laborales y la justicia social.',
      },
      {
        numero: '02.',
        titulo: 'Mujeres trabajadoras',
        descripcion: 'Mujeres líderes que buscan fortalecer su participación en espacios sindicales y de decisión política.',
      },
      {
        numero: '03.',
        titulo: 'Jóvenes trabajadores',
        descripcion: 'Nuevas generaciones laborales con vocación de transformación social y compromiso sindical.',
      },
      {
        numero: '04.',
        titulo: 'Equipos técnicos / Jurídicos',
        descripcion: 'Profesionales que brindan asesoría técnica y jurídica a las organizaciones sindicales afiliadas.',
      },
    ];

    await strapi.documents('api::audiencia.audiencia').create({
      data: { slides },
    });
    strapi.log.info('[seed] Audiencia creada ✅');
  } catch (err) {
    strapi.log.error('[seed] Error creando Audiencia:', err.message || err);
  }
}
