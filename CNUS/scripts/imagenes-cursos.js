/**
 * Imágenes de portada de los 45 cursos.
 *
 * Fuente: Unsplash. Su licencia permite uso comercial sin atribución
 * obligatoria (https://unsplash.com/license).
 *
 * Son fotografías de banco, NO archivo de la CNUS. Se eligieron por su
 * relación temática con cada curso —aulas para los de educación, obra para los
 * sectoriales, mesa de negociación para los de diálogo social— y se descartaron
 * las que mostraban banderas o consignas de otros países.
 *
 * Lo suyo es sustituirlas por fotos propias de asambleas, movilizaciones y
 * formaciones de la central en cuanto haya archivo disponible: cuentan la
 * historia real de la escuela y estas no.
 *
 * Cuando varios cursos comparten tema, comparten imagen. Cada una se sube una
 * sola vez a Strapi y se reutiliza.
 */

// Catálogo temático: cada entrada se sube una vez a Cloudinary vía Strapi.
const IMAGENES = {
  movilizacion:   { id: 'photo-1520785145672-94e9abd8b121', alt: 'Trabajadores concentrados en una movilización' },
  marcha:         { id: 'photo-1485223377494-a570d9cd68a6', alt: 'Manifestación frente a un edificio público' },
  justicia:       { id: 'photo-1618771623063-6c3faa854a61', alt: 'Mazo y libro de leyes sobre una mesa' },
  biblioteca:     { id: 'photo-1519452575417-564c1401ecc0', alt: 'Estantería con volúmenes jurídicos' },
  negociacion:    { id: 'photo-1517048676732-d65bc937f952', alt: 'Personas reunidas en torno a una mesa de trabajo' },
  firma:          { id: 'photo-1562564055-71e051d33c19', alt: 'Firma de un acuerdo entre dos partes' },
  asamblea:       { id: 'photo-1591607586643-803d76ec687a', alt: 'Grupo de personas reunidas al aire libre' },
  trabajadoras:   { id: 'photo-1741183397795-324643563b7f', alt: 'Trabajadoras en una planta de producción' },
  fabrica:        { id: 'photo-1739863306341-1737ff4614b1', alt: 'Grupo de personas trabajando en una fábrica' },
  obra:           { id: 'photo-1640101086894-7d70c3e70179', alt: 'Trabajadores de la construcción en obra' },
  aula:           { id: 'photo-1509062522246-3755977927d7', alt: 'Aula con docente y participantes' },
  taller:         { id: 'photo-1719498861257-44589f1d6b73', alt: 'Personas sentadas en pupitres durante una formación' },
  universidad:    { id: 'photo-1574130303188-31a915382726', alt: 'Sala de clases universitaria' },
  datos:          { id: 'photo-1551288049-bebda4e38f71', alt: 'Gráficos de análisis en una pantalla' },
  economia:       { id: 'photo-1618044733300-9472054094ee', alt: 'Prensa financiera con gráficos económicos' },
  documentos:     { id: 'photo-1543286386-2e659306cd6c', alt: 'Documento de trabajo y bolígrafo' },
  microfono:      { id: 'photo-1581548708095-7158f2e63857', alt: 'Micrófono preparado para una intervención pública' },
  institucional:  { id: 'photo-1688415506915-3e32a04c6ff5', alt: 'Edificio institucional' },
  automatizacion: { id: 'photo-1716191299980-a6e8827ba10b', alt: 'Brazo robótico industrial en una fábrica' },
  equipo:         { id: 'photo-1622675363311-3e1904dc1885', alt: 'Equipo de trabajo en sesión conjunta' },
};

// Curso → imagen. La elección atiende al contenido concreto de cada uno.
const ASIGNACION = {
  // Eje 1 — Identidad sindical
  'historia-del-movimiento-sindical-dominicano-y-latinoamericano': 'marcha',
  'identidad-mision-y-papel-sociopolitico-de-la-cnus': 'asamblea',
  'sindicalismo-sociopolitico-y-transformacion-social': 'movilizacion',
  'autonomia-sindical-unidad-de-accion-y-fortalecimiento-organizativo': 'asamblea',

  // Eje 2 — Derechos laborales y marco jurídico
  'derecho-laboral-dominicano-y-codigo-de-trabajo': 'justicia',
  'libertad-sindical-y-negociacion-colectiva': 'negociacion',
  'seguridad-social-pensiones-y-riesgos-laborales': 'documentos',
  'normas-internacionales-del-trabajo-y-convenios-de-la-oit': 'biblioteca',
  'derechos-humanos-derechos-laborales-y-ciudadania-social': 'justicia',

  // Eje 3 — Diálogo social
  'dialogo-social-y-concertacion-democratica': 'negociacion',
  'negociacion-sindical-y-resolucion-democratica-de-conflictos': 'firma',
  'etica-sindical-codificacion-etica-y-responsabilidad-democratica': 'documentos',
  'construccion-de-pactos-sociales-y-agendas-sindicales-de-pais': 'firma',

  // Eje 4 — Equidad de género, inclusión y diversidad
  'equidad-de-genero-como-eje-transversal-del-sindicalismo': 'trabajadoras',
  'liderazgo-sindical-de-las-mujeres-trabajadoras': 'trabajadoras',
  'prevencion-de-la-discriminacion-acoso-y-violencia-en-el-trabajo': 'justicia',
  'juventud-trabajadora-sindicalismo-e-inclusion-generacional': 'taller',
  'trabajo-informal-sectores-vulnerables-y-nuevas-formas-de-organizacion-sindical': 'fabrica',

  // Eje 5 — Liderazgo, organización y gestión
  'liderazgo-sindical-democratico-e-inclusivo': 'asamblea',
  'planificacion-estrategica-sindical': 'equipo',
  'gestion-organizativa-y-fortalecimiento-institucional-de-los-sindicatos': 'equipo',
  'formacion-de-formadores-sindicales': 'aula',
  'comunicacion-sindical-voceria-y-manejo-de-medios': 'microfono',

  // Eje 6 — Economía, trabajo y desigualdad
  'economia-politica-del-trabajo-y-desigualdad-en-republica-dominicana': 'economia',
  'trabajo-decente-empleo-digno-y-desarrollo-humano': 'fabrica',
  'presupuesto-publico-politicas-sociales-e-incidencia-sindical': 'datos',
  'sistema-tributario-justicia-fiscal-y-derechos-sociales': 'economia',
  'impacto-de-la-tecnologia-automatizacion-e-inteligencia-artificial-en-el-trabajo': 'automatizacion',

  // Eje 7 — Democracia, ciudadanía e incidencia
  'democracia-estado-social-y-participacion-ciudadana': 'institucional',
  'incidencia-politica-y-formulacion-de-propuestas-sindicales': 'institucional',
  'analisis-de-coyuntura-nacional-e-internacional': 'datos',
  'sindicalismo-derechos-sociales-y-politicas-publicas': 'documentos',

  // Eje 8 — Investigación, datos y conocimiento
  'investigacion-sindical-aplicada': 'datos',
  'uso-de-datos-para-la-accion-sindical': 'datos',
  'elaboracion-de-informes-diagnosticos-y-documentos-de-posicion': 'documentos',
  'sistematizacion-de-experiencias-sindicales': 'documentos',

  // Eje 9 — Incidencia sectorial
  'analisis-sectorial-para-la-accion-sindical': 'fabrica',
  'macropoliticas-publicas-y-desarrollo-sectorial': 'obra',
  'dialogo-social-sectorial-y-negociacion-de-politicas-publicas': 'negociacion',
  'laboratorios-sectoriales-de-propuestas-sindicales': 'equipo',

  // Eje 10 — Educación
  'politica-educativa-dominicana-y-derecho-a-la-educacion': 'aula',
  'educacion-preuniversitaria-calidad-educativa-y-condiciones-laborales': 'aula',
  'educacion-universitaria-investigacion-extension-y-trabajo-decente': 'universidad',
  'educacion-tecnica-formacion-profesional-y-transicion-al-mundo-del-trabajo': 'obra',
  'sindicalismo-educativo-dialogo-social-y-reformas-educativas': 'taller',
};

/** URL de descarga: 1600px de ancho, calidad 80, recorte apaisado. */
function urlDescarga(id) {
  return `https://images.unsplash.com/${id}?w=1600&q=80&auto=format&fit=crop`;
}

module.exports = { IMAGENES, ASIGNACION, urlDescarga };
