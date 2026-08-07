/**
 * Contenido de los 45 cursos de la estructura curricular.
 *
 * ORIGEN Y LÍMITES — importante antes de publicar:
 *
 * Las descripciones, objetivos y el "dirigido a" se derivan del documento
 * "01 ESTRUCTURA CURRICULAR.docx": del título de cada curso, del objetivo de
 * su eje y de las líneas sectoriales que allí se enumeran.
 *
 * Los MÓDULOS y las HABILIDADES no están en ese documento: son una propuesta
 * redactada como punto de partida, no el temario oficial de la escuela. Un
 * temario es un compromiso sobre lo que se enseñará, así que el equipo
 * académico debe revisarlo antes de publicar cada curso.
 *
 * Las duraciones son estimaciones coherentes entre sí, no un plan de estudios
 * aprobado.
 */

const CURSOS = {
  // ─── Eje 1. Identidad sindical, CNUS y acción sociopolítica ────────────────
  'historia-del-movimiento-sindical-dominicano-y-latinoamericano': {
    descripcion:
      'Recorrido por las luchas que dieron forma al sindicalismo dominicano y su vínculo con los movimientos obreros de América Latina, desde las primeras asociaciones mutualistas hasta la CNUS.',
    objetivos:
      'Comprender de dónde viene el movimiento sindical dominicano y por qué adoptó las formas que hoy tiene.\nIdentificar los momentos que marcaron su relación con el Estado, los partidos y la sociedad.\nSituar la experiencia dominicana dentro del sindicalismo latinoamericano.',
    dirigido_a:
      'Dirigentes y afiliados que se inician en la formación sindical, y quienes asumen responsabilidades de dirección por primera vez.',
    habilidades: [
      'Lectura histórica de los conflictos laborales',
      'Ubicación de la CNUS en su contexto regional',
      'Uso de antecedentes para argumentar posiciones',
      'Transmisión de la memoria sindical a nuevas generaciones',
    ],
    modulos: [
      { titulo: 'Los orígenes: mutualismo y primeras asociaciones', descripcion: 'Del socorro mutuo a la organización obrera. Condiciones de trabajo y primeras demandas colectivas.', duracion: '4 horas' },
      { titulo: 'Sindicalismo y poder político en el siglo XX', descripcion: 'La organización obrera frente a la dictadura, la Guerra de Abril y los gobiernos posteriores.', duracion: '5 horas' },
      { titulo: 'Miradas del sindicalismo latinoamericano', descripcion: 'Experiencias de Brasil, Argentina, Chile y Centroamérica: qué se puede aprender de cada una.', duracion: '4 horas' },
      { titulo: 'De la fragmentación a la CNUS', descripcion: 'Procesos de unidad sindical y nacimiento de la central. Qué queda por consolidar.', duracion: '4 horas' },
    ],
  },
  'identidad-mision-y-papel-sociopolitico-de-la-cnus': {
    descripcion:
      'Qué es la CNUS, de dónde viene, cómo se organiza y qué papel se ha propuesto jugar en la vida pública dominicana más allá de la negociación laboral.',
    objetivos:
      'Conocer la estructura, los estatutos y los órganos de decisión de la central.\nEntender el sentido de su carácter sociopolítico y qué implica en la práctica.\nReconocer el lugar de cada organización afiliada dentro del conjunto.',
    dirigido_a:
      'Afiliados de todas las organizaciones que integran la CNUS, en especial quienes van a asumir representación.',
    habilidades: [
      'Manejo de la estructura orgánica de la central',
      'Articulación entre sindicato de base y central',
      'Representación institucional de la CNUS',
      'Explicación de la misión sindical ante terceros',
    ],
    modulos: [
      { titulo: 'Origen y estatutos de la CNUS', descripcion: 'Cómo se constituyó, qué la define y cuáles son sus fines declarados.', duracion: '3 horas' },
      { titulo: 'Estructura y órganos de decisión', descripcion: 'Congreso, consejo, secretarías y federaciones: quién decide qué.', duracion: '4 horas' },
      { titulo: 'El carácter sociopolítico', descripcion: 'Qué distingue a un sindicalismo sociopolítico de uno estrictamente reivindicativo.', duracion: '4 horas' },
      { titulo: 'La central en el escenario nacional', descripcion: 'Relación con el Estado, el empresariado y otras organizaciones sociales.', duracion: '3 horas' },
    ],
  },
  'sindicalismo-sociopolitico-y-transformacion-social': {
    descripcion:
      'El sindicalismo como actor de transformación y no solo de reivindicación: cómo se pasa de defender el salario a disputar el rumbo de las políticas públicas.',
    objetivos:
      'Distinguir entre acción reivindicativa y acción sociopolítica.\nIdentificar los terrenos donde el sindicalismo puede incidir más allá del centro de trabajo.\nFormular propuestas que conecten demandas laborales con transformaciones sociales.',
    dirigido_a:
      'Dirigentes con experiencia que buscan ampliar el alcance de su organización hacia la agenda pública.',
    habilidades: [
      'Formulación de propuestas de alcance social',
      'Vinculación de lo laboral con lo político',
      'Construcción de alianzas con otros movimientos',
      'Argumentación sobre el papel público del sindicalismo',
    ],
    modulos: [
      { titulo: 'Del salario al proyecto de país', descripcion: 'Cómo se amplía la agenda sindical sin perder la base reivindicativa.', duracion: '4 horas' },
      { titulo: 'Actores y terrenos de disputa', descripcion: 'Dónde se deciden hoy las políticas que afectan al trabajo.', duracion: '4 horas' },
      { titulo: 'Alianzas con movimientos sociales', descripcion: 'Puntos de encuentro con organizaciones de mujeres, ambientales, campesinas y comunitarias.', duracion: '4 horas' },
      { titulo: 'Casos de transformación sindical', descripcion: 'Experiencias donde la acción sindical cambió una política pública.', duracion: '4 horas' },
    ],
  },
  'autonomia-sindical-unidad-de-accion-y-fortalecimiento-organizativo': {
    descripcion:
      'Cómo sostener la independencia de la organización frente a partidos, gobiernos y empleadores, y cómo construir unidad de acción sin diluir la identidad de cada sindicato.',
    objetivos:
      'Reconocer las formas en que se erosiona la autonomía sindical.\nDistinguir entre unidad orgánica y unidad de acción.\nFortalecer los mecanismos internos que sostienen la independencia.',
    dirigido_a:
      'Dirigentes de sindicatos de base y federaciones, y responsables de organización.',
    habilidades: [
      'Defensa de la autonomía frente a presiones externas',
      'Construcción de acuerdos entre organizaciones',
      'Fortalecimiento de la democracia interna',
      'Gestión de diferencias sin ruptura',
    ],
    modulos: [
      { titulo: 'Qué es la autonomía sindical', descripcion: 'Independencia frente al Estado, los partidos y el empleador. Marco normativo y práctica real.', duracion: '3 horas' },
      { titulo: 'Riesgos y presiones', descripcion: 'Clientelismo, cooptación y dependencia financiera: cómo se manifiestan y cómo se enfrentan.', duracion: '4 horas' },
      { titulo: 'Unidad de acción', descripcion: 'Construir acuerdos puntuales entre organizaciones distintas sin exigir uniformidad.', duracion: '4 horas' },
      { titulo: 'Fortalecimiento organizativo', descripcion: 'Afiliación, cotización, participación y renovación de cuadros.', duracion: '4 horas' },
    ],
  },

  // ─── Eje 2. Derechos laborales y marco jurídico ────────────────────────────
  'derecho-laboral-dominicano-y-codigo-de-trabajo': {
    descripcion:
      'Recorrido práctico por el Código de Trabajo dominicano: contrato, jornada, salario, terminación y las vías para reclamar cuando se incumple.',
    objetivos:
      'Manejar las disposiciones del Código que más se aplican en el día a día.\nIdentificar incumplimientos y saber ante quién y cómo reclamarlos.\nAcompañar a un trabajador en un conflicto laboral con criterio jurídico.',
    dirigido_a:
      'Delegados sindicales, comités de empresa y quienes atienden reclamaciones de afiliados.',
    habilidades: [
      'Lectura e interpretación del Código de Trabajo',
      'Identificación de incumplimientos laborales',
      'Cálculo de prestaciones y derechos adquiridos',
      'Acompañamiento en procedimientos ante el Ministerio de Trabajo',
    ],
    modulos: [
      { titulo: 'El contrato de trabajo', descripcion: 'Tipos de contrato, período de prueba, modificaciones y sus límites.', duracion: '5 horas' },
      { titulo: 'Jornada, salario y prestaciones', descripcion: 'Horas extras, salario mínimo, regalía, vacaciones y bonificación.', duracion: '6 horas' },
      { titulo: 'Terminación de la relación laboral', descripcion: 'Desahucio, despido, dimisión y cesantía. Cálculo y plazos.', duracion: '6 horas' },
      { titulo: 'Vías de reclamación', descripcion: 'Ministerio de Trabajo, tribunales laborales y papel del sindicato en el proceso.', duracion: '5 horas' },
    ],
  },
  'libertad-sindical-y-negociacion-colectiva': {
    descripcion:
      'El derecho a organizarse y a negociar colectivamente: cómo se constituye un sindicato, cómo se protege frente a represalias y cómo se conduce una negociación.',
    objetivos:
      'Conocer el marco que protege la libertad sindical en República Dominicana.\nSaber constituir y registrar una organización sindical.\nPreparar y conducir una negociación colectiva desde el pliego hasta la firma.',
    dirigido_a:
      'Trabajadores que quieren organizarse, delegados y comisiones negociadoras.',
    habilidades: [
      'Constitución y registro de sindicatos',
      'Defensa frente a prácticas antisindicales',
      'Elaboración de pliegos de peticiones',
      'Conducción de mesas de negociación',
    ],
    modulos: [
      { titulo: 'La libertad sindical como derecho', descripcion: 'Fundamento constitucional, Código de Trabajo y convenios de la OIT.', duracion: '4 horas' },
      { titulo: 'Constituir un sindicato', descripcion: 'Requisitos, asamblea constitutiva, estatutos y registro.', duracion: '5 horas' },
      { titulo: 'Protección frente a represalias', descripcion: 'Fuero sindical, despidos por organizarse y cómo actuar.', duracion: '4 horas' },
      { titulo: 'La negociación colectiva paso a paso', descripcion: 'Del diagnóstico al pliego, de la mesa al convenio y su seguimiento.', duracion: '7 horas' },
    ],
  },
  'seguridad-social-pensiones-y-riesgos-laborales': {
    descripcion:
      'Cómo funciona el sistema dominicano de seguridad social, qué cubre realmente y cuáles son sus vacíos: pensiones, salud y riesgos del trabajo.',
    objetivos:
      'Entender la arquitectura del sistema y el papel de cada institución.\nCalcular y reclamar prestaciones de salud, pensión y riesgos laborales.\nFormular posiciones sindicales sobre la reforma del sistema.',
    dirigido_a:
      'Delegados que atienden casos de salud y pensiones, y quienes participan en espacios de discusión sobre seguridad social.',
    habilidades: [
      'Orientación a afiliados sobre sus prestaciones',
      'Tramitación de reclamaciones ante las AFP y ARS',
      'Análisis crítico del sistema de capitalización individual',
      'Argumentación en debates sobre reforma de pensiones',
    ],
    modulos: [
      { titulo: 'Arquitectura del sistema', descripcion: 'Regímenes, instituciones y flujo de las cotizaciones.', duracion: '5 horas' },
      { titulo: 'Pensiones', descripcion: 'Capitalización individual, comisiones, tasa de reemplazo y el debate sobre su reforma.', duracion: '6 horas' },
      { titulo: 'Salud y riesgos laborales', descripcion: 'Cobertura, copagos, accidentes de trabajo y enfermedades profesionales.', duracion: '5 horas' },
      { titulo: 'La agenda sindical en seguridad social', descripcion: 'Propuestas de la CNUS y espacios donde se decide.', duracion: '4 horas' },
    ],
  },
  'normas-internacionales-del-trabajo-y-convenios-de-la-oit': {
    descripcion:
      'Qué son los convenios de la OIT, cuáles ha ratificado República Dominicana y cómo usarlos como herramienta concreta en la defensa de derechos.',
    objetivos:
      'Conocer los convenios fundamentales y su rango en el ordenamiento nacional.\nIdentificar cuándo una situación local contraviene una norma internacional.\nUsar los mecanismos de control de la OIT cuando corresponda.',
    dirigido_a:
      'Dirigentes con responsabilidad en asuntos jurídicos y quienes participan en instancias internacionales.',
    habilidades: [
      'Manejo de los convenios fundamentales',
      'Fundamentación jurídica con normas internacionales',
      'Preparación de quejas ante la OIT',
      'Seguimiento de las observaciones de los órganos de control',
    ],
    modulos: [
      { titulo: 'Qué es la OIT y cómo funciona', descripcion: 'Estructura tripartita, conferencia y órganos de control.', duracion: '3 horas' },
      { titulo: 'Los convenios fundamentales', descripcion: 'Libertad sindical, negociación colectiva, trabajo forzoso, trabajo infantil y no discriminación.', duracion: '5 horas' },
      { titulo: 'Aplicación en República Dominicana', descripcion: 'Qué se ha ratificado, qué se cumple y dónde están las brechas.', duracion: '4 horas' },
      { titulo: 'Mecanismos de reclamación', descripcion: 'Quejas, reclamaciones y el Comité de Libertad Sindical.', duracion: '4 horas' },
    ],
  },
  'derechos-humanos-derechos-laborales-y-ciudadania-social': {
    descripcion:
      'Los derechos laborales como derechos humanos: el vínculo entre trabajo digno, ciudadanía y la obligación del Estado de garantizarlos.',
    objetivos:
      'Situar los derechos laborales dentro del marco de derechos humanos.\nReconocer el papel de los derechos económicos y sociales en la ciudadanía plena.\nUsar el lenguaje y los mecanismos de derechos humanos en la defensa sindical.',
    dirigido_a:
      'Dirigentes que participan en espacios de incidencia pública y defensa de derechos.',
    habilidades: [
      'Argumentación desde el marco de derechos humanos',
      'Documentación de vulneraciones laborales',
      'Articulación con organizaciones de derechos humanos',
      'Uso de instancias nacionales e internacionales de protección',
    ],
    modulos: [
      { titulo: 'Derechos humanos y trabajo', descripcion: 'De la Declaración Universal a los pactos internacionales.', duracion: '4 horas' },
      { titulo: 'Derechos económicos, sociales y culturales', descripcion: 'Exigibilidad, progresividad y no regresión.', duracion: '4 horas' },
      { titulo: 'Ciudadanía social', descripcion: 'Qué significa ser ciudadano más allá del voto.', duracion: '3 horas' },
      { titulo: 'Documentar y denunciar', descripcion: 'Cómo se registra una vulneración y ante quién se lleva.', duracion: '4 horas' },
    ],
  },

  // ─── Eje 3. Diálogo social, concertación y acuerdos democráticos ───────────
  'dialogo-social-y-concertacion-democratica': {
    descripcion:
      'El diálogo social como método: cuándo sirve, cuándo se convierte en trampa y qué condiciones lo hacen productivo para los trabajadores.',
    objetivos:
      'Distinguir el diálogo social genuino de los espacios meramente formales.\nPreparar la participación sindical con posiciones fundamentadas.\nEvaluar los resultados de un proceso de concertación.',
    dirigido_a:
      'Dirigentes que representan a la CNUS en mesas tripartitas y espacios de concertación.',
    habilidades: [
      'Preparación de posiciones para mesas tripartitas',
      'Lectura de la correlación de fuerzas',
      'Construcción de consensos sin ceder lo esencial',
      'Evaluación de acuerdos alcanzados',
    ],
    modulos: [
      { titulo: 'Qué es y qué no es el diálogo social', descripcion: 'Condiciones mínimas para que sea real y no una formalidad.', duracion: '4 horas' },
      { titulo: 'El tripartismo en República Dominicana', descripcion: 'Espacios existentes, resultados y limitaciones.', duracion: '4 horas' },
      { titulo: 'Preparar la participación', descripcion: 'Diagnóstico, posición, márgenes de negociación y líneas rojas.', duracion: '5 horas' },
      { titulo: 'Del acuerdo al seguimiento', descripcion: 'Cómo se garantiza que lo acordado se cumpla.', duracion: '4 horas' },
    ],
  },
  'negociacion-sindical-y-resolucion-democratica-de-conflictos': {
    descripcion:
      'Técnicas de negociación aplicadas al conflicto laboral: preparación, conducción de la mesa, manejo de la presión y salidas cuando se llega a un punto muerto.',
    objetivos:
      'Preparar una negociación con objetivos, alternativas y límites definidos.\nConducir una mesa manteniendo la cohesión del equipo.\nResolver conflictos internos y externos por vías democráticas.',
    dirigido_a:
      'Comisiones negociadoras, delegados y dirigentes que enfrentan conflictos laborales.',
    habilidades: [
      'Preparación estratégica de negociaciones',
      'Escucha activa y manejo de la mesa',
      'Gestión de la presión y los tiempos',
      'Mediación en conflictos internos',
    ],
    modulos: [
      { titulo: 'Antes de la mesa', descripcion: 'Diagnóstico, objetivos, alternativas y definición de líneas rojas.', duracion: '5 horas' },
      { titulo: 'En la mesa', descripcion: 'Roles del equipo, manejo de propuestas y contrapropuestas, señales y tiempos.', duracion: '6 horas' },
      { titulo: 'Cuando se traba', descripcion: 'Puntos muertos, mediación, y el uso responsable de la medida de fuerza.', duracion: '4 horas' },
      { titulo: 'Conflictos dentro de la organización', descripcion: 'Diferencias internas resueltas sin fracturar el sindicato.', duracion: '4 horas' },
    ],
  },
  'etica-sindical-codificacion-etica-y-responsabilidad-democratica': {
    descripcion:
      'La conducta del dirigente como base de la legitimidad sindical: transparencia, rendición de cuentas y códigos de ética aplicados a la vida de la organización.',
    objetivos:
      'Identificar las prácticas que erosionan la confianza en la dirigencia.\nConstruir e implementar un código de ética en la organización.\nEstablecer mecanismos de rendición de cuentas ante la base.',
    dirigido_a:
      'Dirigentes, comisiones de ética y responsables de finanzas de las organizaciones afiliadas.',
    habilidades: [
      'Elaboración de códigos de ética',
      'Rendición de cuentas ante la asamblea',
      'Manejo transparente de recursos sindicales',
      'Tratamiento de denuncias internas',
    ],
    modulos: [
      { titulo: 'Ética y legitimidad', descripcion: 'Por qué la conducta del dirigente determina la fuerza del sindicato.', duracion: '3 horas' },
      { titulo: 'Prácticas que dañan', descripcion: 'Clientelismo, uso indebido de recursos, perpetuación en cargos.', duracion: '4 horas' },
      { titulo: 'Construir un código de ética', descripcion: 'Contenidos mínimos, proceso participativo y aprobación.', duracion: '4 horas' },
      { titulo: 'Rendición de cuentas', descripcion: 'Informes, auditorías y mecanismos de control desde la base.', duracion: '4 horas' },
    ],
  },
  'construccion-de-pactos-sociales-y-agendas-sindicales-de-pais': {
    descripcion:
      'Cómo se construye una agenda sindical de alcance nacional y cómo se negocian pactos sociales que comprometan al Estado y al empresariado.',
    objetivos:
      'Elaborar una agenda sindical con prioridades y argumentos.\nIdentificar aliados y adversarios en la construcción de un pacto.\nEvaluar qué se gana y qué se cede en un acuerdo nacional.',
    dirigido_a:
      'Dirigencia nacional y responsables de incidencia en políticas públicas.',
    habilidades: [
      'Elaboración de agendas de país',
      'Negociación multiactor',
      'Construcción de alianzas amplias',
      'Evaluación de costos y beneficios de un pacto',
    ],
    modulos: [
      { titulo: 'Qué es un pacto social', descripcion: 'Experiencias comparadas y condiciones para que funcione.', duracion: '4 horas' },
      { titulo: 'Construir la agenda', descripcion: 'De las demandas dispersas a un conjunto priorizado y argumentado.', duracion: '5 horas' },
      { titulo: 'Mapa de actores', descripcion: 'Quién apoya, quién se opone y quién puede moverse.', duracion: '4 horas' },
      { titulo: 'Negociar y sostener el acuerdo', descripcion: 'Firma, implementación y qué hacer cuando se incumple.', duracion: '4 horas' },
    ],
  },

  // ─── Eje 4. Equidad de género, inclusión y diversidad ──────────────────────
  'equidad-de-genero-como-eje-transversal-del-sindicalismo': {
    descripcion:
      'La equidad de género aplicada a la práctica sindical concreta: en la negociación colectiva, en la estructura de la organización y en la agenda pública.',
    objetivos:
      'Reconocer las brechas de género en el mundo del trabajo dominicano.\nIncorporar cláusulas de equidad en la negociación colectiva.\nRevisar la propia organización con perspectiva de género.',
    dirigido_a:
      'Toda la dirigencia sindical, con especial énfasis en comisiones negociadoras y secretarías de la mujer.',
    habilidades: [
      'Diagnóstico de brechas de género en el centro de trabajo',
      'Redacción de cláusulas de equidad',
      'Revisión de estructuras sindicales con perspectiva de género',
      'Argumentación sobre corresponsabilidad de los cuidados',
    ],
    modulos: [
      { titulo: 'Brechas en el mundo del trabajo', descripcion: 'Salario, segregación ocupacional, informalidad y cuidados no remunerados.', duracion: '4 horas' },
      { titulo: 'Género en la negociación colectiva', descripcion: 'Qué cláusulas incorporar y cómo defenderlas en la mesa.', duracion: '5 horas' },
      { titulo: 'La organización por dentro', descripcion: 'Participación de mujeres en cargos, horarios de reunión, lenguaje y prácticas.', duracion: '4 horas' },
      { titulo: 'Cuidados y corresponsabilidad', descripcion: 'El trabajo de cuidados como asunto sindical y como política pública.', duracion: '4 horas' },
    ],
  },
  'liderazgo-sindical-de-las-mujeres-trabajadoras': {
    descripcion:
      'Formación dirigida a fortalecer la participación y el liderazgo de las mujeres en las estructuras sindicales, y a remover los obstáculos que lo dificultan.',
    objetivos:
      'Identificar las barreras concretas a la participación de las mujeres.\nDesarrollar herramientas de liderazgo, vocería y negociación.\nConstruir redes de apoyo entre mujeres sindicalistas.',
    dirigido_a:
      'Mujeres trabajadoras afiliadas, delegadas y dirigentas, y quienes acompañan procesos de equidad en sus organizaciones.',
    habilidades: [
      'Vocería y hablar en público',
      'Negociación y manejo de espacios masculinizados',
      'Construcción de redes y alianzas',
      'Acompañamiento a otras mujeres en la organización',
    ],
    modulos: [
      { titulo: 'Barreras a la participación', descripcion: 'Tiempo, cuidados, prácticas informales y techos no escritos.', duracion: '4 horas' },
      { titulo: 'Herramientas de liderazgo', descripcion: 'Vocería, conducción de reuniones y construcción de autoridad.', duracion: '5 horas' },
      { titulo: 'Negociar en espacios adversos', descripcion: 'Estrategias frente a la descalificación y el desplazamiento.', duracion: '4 horas' },
      { titulo: 'Redes de mujeres sindicalistas', descripcion: 'Construcción y sostenimiento de espacios de apoyo mutuo.', duracion: '3 horas' },
    ],
  },
  'prevencion-de-la-discriminacion-acoso-y-violencia-en-el-trabajo': {
    descripcion:
      'Cómo prevenir, detectar y actuar frente al acoso y la violencia laboral, con atención al marco normativo y al papel del sindicato en la protección de las víctimas.',
    objetivos:
      'Reconocer las formas de discriminación, acoso y violencia en el trabajo.\nConocer el marco legal aplicable y las vías de denuncia.\nEstablecer protocolos de actuación en el centro de trabajo y en el sindicato.',
    dirigido_a:
      'Delegados, comisiones de seguridad y salud, y responsables de atención a afiliados.',
    habilidades: [
      'Detección temprana de situaciones de acoso',
      'Acompañamiento a víctimas',
      'Elaboración de protocolos de prevención',
      'Negociación de cláusulas de protección',
    ],
    modulos: [
      { titulo: 'Formas de violencia laboral', descripcion: 'Acoso sexual, acoso moral, discriminación y violencia por razón de género.', duracion: '4 horas' },
      { titulo: 'Marco normativo', descripcion: 'Legislación dominicana y Convenio 190 de la OIT.', duracion: '4 horas' },
      { titulo: 'Protocolos de actuación', descripcion: 'Qué hacer ante una denuncia, dentro y fuera de la empresa.', duracion: '4 horas' },
      { titulo: 'Prevención desde el sindicato', descripcion: 'Formación, cláusulas y cultura organizativa.', duracion: '3 horas' },
    ],
  },
  'juventud-trabajadora-sindicalismo-e-inclusion-generacional': {
    descripcion:
      'Por qué el sindicalismo pierde presencia entre los jóvenes y cómo revertirlo: precariedad, nuevas formas de empleo y renovación de cuadros.',
    objetivos:
      'Comprender las condiciones laborales específicas de la juventud trabajadora.\nDiseñar estrategias de afiliación y participación juvenil.\nAbrir espacios reales de decisión a nuevas generaciones.',
    dirigido_a:
      'Jóvenes trabajadores y dirigentes responsables de organización y renovación de cuadros.',
    habilidades: [
      'Diagnóstico de la situación laboral juvenil',
      'Diseño de estrategias de afiliación',
      'Comunicación con públicos jóvenes',
      'Facilitación del relevo generacional',
    ],
    modulos: [
      { titulo: 'La juventud en el mercado laboral', descripcion: 'Precariedad, rotación, informalidad y primer empleo.', duracion: '4 horas' },
      { titulo: 'Por qué no se afilian', descripcion: 'Distancia entre la práctica sindical y las expectativas juveniles.', duracion: '3 horas' },
      { titulo: 'Estrategias de organización juvenil', descripcion: 'Formas de participación, lenguajes y espacios propios.', duracion: '4 horas' },
      { titulo: 'Relevo generacional', descripcion: 'Cómo se prepara y por qué suele fallar.', duracion: '4 horas' },
    ],
  },
  'trabajo-informal-sectores-vulnerables-y-nuevas-formas-de-organizacion-sindical': {
    descripcion:
      'Organizar donde no hay contrato: trabajadores informales, por cuenta propia y de plataformas. Formas asociativas más allá del sindicato de empresa.',
    objetivos:
      'Dimensionar la informalidad en la economía dominicana.\nConocer formas organizativas viables fuera de la relación laboral clásica.\nDiseñar estrategias de representación para sectores sin contrato.',
    dirigido_a:
      'Organizaciones que trabajan con sectores informales, vendedores, transportistas y trabajadores de plataformas.',
    habilidades: [
      'Caracterización de sectores informales',
      'Diseño de formas asociativas alternativas',
      'Incidencia por la formalización con derechos',
      'Organización sin centro de trabajo fijo',
    ],
    modulos: [
      { titulo: 'La informalidad dominicana', descripcion: 'Magnitud, sectores y condiciones. Quiénes son y dónde están.', duracion: '4 horas' },
      { titulo: 'Organizarse sin patrón identificable', descripcion: 'Cooperativas, asociaciones y sindicatos de oficio.', duracion: '5 horas' },
      { titulo: 'Trabajo de plataformas', descripcion: 'Repartidores y conductores: la relación laboral encubierta.', duracion: '4 horas' },
      { titulo: 'Agenda de formalización', descripcion: 'Formalizar con derechos, no solo con registro fiscal.', duracion: '4 horas' },
    ],
  },

  // ─── Eje 5. Liderazgo, organización y gestión sindical ─────────────────────
  'liderazgo-sindical-democratico-e-inclusivo': {
    descripcion:
      'Formas de conducción que fortalecen la organización en vez de concentrarla: liderazgo colectivo, delegación real y renovación.',
    objetivos:
      'Distinguir entre liderazgo personalista y conducción democrática.\nDesarrollar capacidades de facilitación y construcción de equipos.\nPromover la participación activa de la base en las decisiones.',
    dirigido_a:
      'Dirigentes en ejercicio y personas que van a asumir responsabilidades de conducción.',
    habilidades: [
      'Conducción de equipos y delegación',
      'Facilitación de asambleas participativas',
      'Escucha y construcción de acuerdos',
      'Formación de nuevos cuadros',
    ],
    modulos: [
      { titulo: 'Modelos de liderazgo sindical', descripcion: 'Caudillismo, liderazgo colectivo y sus consecuencias organizativas.', duracion: '4 horas' },
      { titulo: 'Conducir sin concentrar', descripcion: 'Delegación real, equipos y distribución de responsabilidades.', duracion: '4 horas' },
      { titulo: 'Asambleas que deciden', descripcion: 'Facilitación, participación efectiva y toma de decisiones.', duracion: '4 horas' },
      { titulo: 'Formar quien continúe', descripcion: 'Acompañamiento y preparación del relevo.', duracion: '3 horas' },
    ],
  },
  'planificacion-estrategica-sindical': {
    descripcion:
      'Cómo pasar de reaccionar a los acontecimientos a definir un rumbo: diagnóstico, objetivos, plan de acción y evaluación aplicados a la organización sindical.',
    objetivos:
      'Elaborar un diagnóstico organizativo honesto.\nDefinir objetivos alcanzables con indicadores verificables.\nConstruir y dar seguimiento a un plan de trabajo.',
    dirigido_a:
      'Comités ejecutivos, secretarías de organización y equipos de planificación.',
    habilidades: [
      'Diagnóstico organizativo',
      'Formulación de objetivos e indicadores',
      'Elaboración de planes de acción',
      'Evaluación y ajuste de la estrategia',
    ],
    modulos: [
      { titulo: 'Dónde estamos', descripcion: 'Diagnóstico de fuerzas, debilidades y entorno.', duracion: '5 horas' },
      { titulo: 'A dónde queremos llegar', descripcion: 'Objetivos, metas y priorización realista.', duracion: '4 horas' },
      { titulo: 'Cómo llegamos', descripcion: 'Actividades, responsables, recursos y calendario.', duracion: '5 horas' },
      { titulo: 'Seguimiento y evaluación', descripcion: 'Indicadores, revisión periódica y corrección de rumbo.', duracion: '4 horas' },
    ],
  },
  'gestion-organizativa-y-fortalecimiento-institucional-de-los-sindicatos': {
    descripcion:
      'La administración cotidiana del sindicato: afiliación, cotizaciones, archivo, finanzas y los procedimientos que sostienen una organización funcional.',
    objetivos:
      'Ordenar los procesos administrativos de la organización.\nGestionar las finanzas sindicales con transparencia.\nMantener sistemas de afiliación y comunicación con la base.',
    dirigido_a:
      'Secretarías de organización, finanzas y actas, y personal administrativo de sindicatos.',
    habilidades: [
      'Gestión de padrones de afiliación',
      'Administración financiera transparente',
      'Organización de archivo y documentación',
      'Diseño de procedimientos internos',
    ],
    modulos: [
      { titulo: 'Afiliación y padrón', descripcion: 'Registro, actualización y seguimiento de la membresía.', duracion: '4 horas' },
      { titulo: 'Finanzas sindicales', descripcion: 'Cotizaciones, presupuesto, control de gastos y rendición.', duracion: '5 horas' },
      { titulo: 'Documentación y archivo', descripcion: 'Actas, convenios, correspondencia: qué se guarda y cómo.', duracion: '3 horas' },
      { titulo: 'Procedimientos internos', descripcion: 'Reglamentos que ordenan el funcionamiento cotidiano.', duracion: '4 horas' },
    ],
  },
  'formacion-de-formadores-sindicales': {
    descripcion:
      'Preparación de quienes van a formar a otros: metodologías de educación popular, diseño de talleres y facilitación de procesos de aprendizaje entre trabajadores.',
    objetivos:
      'Manejar los principios de la educación popular aplicada al sindicalismo.\nDiseñar un taller completo con objetivos, técnicas y evaluación.\nFacilitar procesos formativos con grupos de trabajadores.',
    dirigido_a:
      'Responsables de formación en sus organizaciones y quienes replicarán los contenidos de la Escuela.',
    habilidades: [
      'Diseño de talleres y sesiones formativas',
      'Facilitación de grupos',
      'Adaptación de contenidos al público',
      'Evaluación de aprendizajes',
    ],
    modulos: [
      { titulo: 'Educación popular', descripcion: 'Principios, historia y por qué encaja con la formación sindical.', duracion: '4 horas' },
      { titulo: 'Diseñar un taller', descripcion: 'Objetivos, contenidos, técnicas, tiempos y materiales.', duracion: '6 horas' },
      { titulo: 'Facilitar', descripcion: 'Conducción del grupo, manejo de tensiones y participación real.', duracion: '5 horas' },
      { titulo: 'Evaluar y mejorar', descripcion: 'Cómo saber si el taller sirvió y qué ajustar.', duracion: '3 horas' },
    ],
  },
  'comunicacion-sindical-voceria-y-manejo-de-medios': {
    descripcion:
      'Cómo comunicar la posición sindical con eficacia: mensajes claros, relación con la prensa, vocería y presencia en redes sociales.',
    objetivos:
      'Construir mensajes sindicales claros y defendibles.\nManejar una entrevista y una rueda de prensa.\nPlanificar la comunicación de una campaña sindical.',
    dirigido_a:
      'Voceros, secretarías de comunicación y dirigentes que aparecen en medios.',
    habilidades: [
      'Construcción de mensajes clave',
      'Vocería ante medios',
      'Redacción de notas de prensa y comunicados',
      'Gestión de redes sociales sindicales',
    ],
    modulos: [
      { titulo: 'El mensaje', descripcion: 'De la posición compleja al mensaje que se entiende y se recuerda.', duracion: '4 horas' },
      { titulo: 'Relación con los medios', descripcion: 'Cómo funciona una redacción y qué busca un periodista.', duracion: '4 horas' },
      { titulo: 'Vocería', descripcion: 'Entrevistas, ruedas de prensa y preguntas incómodas. Práctica grabada.', duracion: '5 horas' },
      { titulo: 'Redes y campañas', descripcion: 'Planificación de campañas y comunicación digital sindical.', duracion: '4 horas' },
    ],
  },

  // ─── Eje 6. Economía, trabajo y desigualdad social ─────────────────────────
  'economia-politica-del-trabajo-y-desigualdad-en-republica-dominicana': {
    descripcion:
      'Por qué crece la economía dominicana sin que mejoren proporcionalmente los salarios: estructura productiva, distribución del ingreso y participación del trabajo.',
    objetivos:
      'Leer los indicadores económicos con criterio propio.\nExplicar la relación entre crecimiento, productividad y salarios.\nFundamentar demandas salariales con datos.',
    dirigido_a:
      'Dirigentes que participan en negociación salarial y en debates de política económica.',
    habilidades: [
      'Lectura de indicadores económicos',
      'Análisis de la distribución del ingreso',
      'Argumentación salarial con datos',
      'Crítica fundamentada del modelo económico',
    ],
    modulos: [
      { titulo: 'La economía dominicana', descripcion: 'Estructura productiva, sectores y evolución reciente.', duracion: '5 horas' },
      { titulo: 'Crecimiento y desigualdad', descripcion: 'Quién se queda con el producto del crecimiento.', duracion: '5 horas' },
      { titulo: 'Salarios y productividad', descripcion: 'La brecha entre lo que se produce y lo que se paga.', duracion: '4 horas' },
      { titulo: 'Leer los datos', descripcion: 'Fuentes oficiales, indicadores y sus trampas.', duracion: '4 horas' },
    ],
  },
  'trabajo-decente-empleo-digno-y-desarrollo-humano': {
    descripcion:
      'Qué significa trabajo decente en términos medibles y cómo se usa ese marco para evaluar la calidad del empleo en República Dominicana.',
    objetivos:
      'Manejar los componentes del trabajo decente según la OIT.\nEvaluar la calidad del empleo en un sector concreto.\nFormular propuestas de mejora con indicadores.',
    dirigido_a:
      'Dirigentes que elaboran diagnósticos sectoriales y propuestas de política laboral.',
    habilidades: [
      'Aplicación de indicadores de trabajo decente',
      'Diagnóstico de calidad del empleo',
      'Formulación de propuestas de mejora',
      'Vinculación entre trabajo y desarrollo humano',
    ],
    modulos: [
      { titulo: 'Los pilares del trabajo decente', descripcion: 'Empleo, derechos, protección social y diálogo.', duracion: '4 horas' },
      { titulo: 'Medir la calidad del empleo', descripcion: 'Indicadores aplicables a un sector o empresa.', duracion: '5 horas' },
      { titulo: 'El caso dominicano', descripcion: 'Dónde estamos según los propios indicadores.', duracion: '4 horas' },
      { titulo: 'Del diagnóstico a la propuesta', descripcion: 'Convertir hallazgos en demandas concretas.', duracion: '4 horas' },
    ],
  },
  'presupuesto-publico-politicas-sociales-e-incidencia-sindical': {
    descripcion:
      'Cómo se elabora y aprueba el presupuesto del Estado, dónde se decide el gasto social y en qué momentos puede incidir el movimiento sindical.',
    objetivos:
      'Entender el ciclo presupuestario y sus plazos.\nLeer las partidas que afectan a los trabajadores.\nPlanificar incidencia en los momentos en que se decide.',
    dirigido_a:
      'Responsables de incidencia política y dirigentes que participan en debates sobre gasto público.',
    habilidades: [
      'Lectura del presupuesto general del Estado',
      'Identificación de partidas relevantes',
      'Planificación de incidencia presupuestaria',
      'Argumentación sobre prioridades de gasto',
    ],
    modulos: [
      { titulo: 'El ciclo presupuestario', descripcion: 'Formulación, aprobación, ejecución y control. Quién decide en cada etapa.', duracion: '4 horas' },
      { titulo: 'Leer el presupuesto', descripcion: 'Estructura, clasificadores y cómo encontrar lo que importa.', duracion: '5 horas' },
      { titulo: 'El gasto social', descripcion: 'Educación, salud, seguridad social: cuánto, en qué y con qué resultados.', duracion: '4 horas' },
      { titulo: 'Incidir a tiempo', descripcion: 'Calendario, actores y estrategias de incidencia presupuestaria.', duracion: '4 horas' },
    ],
  },
  'sistema-tributario-justicia-fiscal-y-derechos-sociales': {
    descripcion:
      'Quién paga impuestos en República Dominicana y quién no: estructura tributaria, exenciones, evasión y su relación con el financiamiento de los derechos sociales.',
    objetivos:
      'Comprender la estructura del sistema tributario dominicano.\nEvaluar su carácter progresivo o regresivo.\nConstruir posiciones sindicales sobre reforma fiscal.',
    dirigido_a:
      'Dirigencia nacional y responsables de incidencia en política económica y fiscal.',
    habilidades: [
      'Análisis de la estructura tributaria',
      'Evaluación de progresividad fiscal',
      'Argumentación sobre reforma tributaria',
      'Vinculación entre recaudación y derechos',
    ],
    modulos: [
      { titulo: 'Cómo se recauda', descripcion: 'Impuestos directos e indirectos, y el peso de cada uno.', duracion: '4 horas' },
      { titulo: 'Quién paga y quién no', descripcion: 'Exenciones, incentivos, evasión y elusión.', duracion: '5 horas' },
      { titulo: 'Justicia fiscal', descripcion: 'Qué haría más justo el sistema y qué se ha propuesto.', duracion: '4 horas' },
      { titulo: 'La posición sindical', descripcion: 'Construir y defender una propuesta de reforma.', duracion: '4 horas' },
    ],
  },
  'impacto-de-la-tecnologia-automatizacion-e-inteligencia-artificial-en-el-trabajo': {
    descripcion:
      'Cómo la automatización y los sistemas algorítmicos están cambiando el trabajo, y qué puede hacer el sindicalismo ante transformaciones que ya están en curso.',
    objetivos:
      'Identificar los efectos de la automatización en los sectores donde opera la CNUS.\nReconocer las nuevas formas de control algorítmico del trabajo.\nFormular demandas sobre transición tecnológica justa.',
    dirigido_a:
      'Dirigentes de sectores en transformación tecnológica y responsables de negociación colectiva.',
    habilidades: [
      'Evaluación del impacto tecnológico por sector',
      'Negociación de cláusulas sobre cambio tecnológico',
      'Análisis del control algorítmico',
      'Propuestas de recualificación laboral',
    ],
    modulos: [
      { titulo: 'Qué está cambiando', descripcion: 'Automatización, digitalización e inteligencia artificial en términos concretos.', duracion: '4 horas' },
      { titulo: 'Efectos sobre el empleo', descripcion: 'Sustitución, transformación y creación de puestos. Qué sectores y en qué plazo.', duracion: '4 horas' },
      { titulo: 'El algoritmo como jefe', descripcion: 'Vigilancia, asignación de tareas y evaluación automatizada.', duracion: '4 horas' },
      { titulo: 'Transición justa', descripcion: 'Qué negociar: formación, plazos, garantías y participación en la decisión.', duracion: '4 horas' },
    ],
  },

  // ─── Eje 7. Democracia, ciudadanía e incidencia política ───────────────────
  'democracia-estado-social-y-participacion-ciudadana': {
    descripcion:
      'El papel del sindicalismo en la vida democrática: instituciones, mecanismos de participación y la disputa por un Estado que garantice derechos sociales.',
    objetivos:
      'Conocer la arquitectura institucional dominicana y sus vías de participación.\nComprender el concepto de Estado social y su exigibilidad.\nIdentificar espacios donde la voz sindical puede pesar.',
    dirigido_a:
      'Dirigentes que participan o quieren participar en espacios institucionales y consultivos.',
    habilidades: [
      'Manejo de la institucionalidad democrática',
      'Uso de mecanismos de participación ciudadana',
      'Argumentación sobre derechos sociales',
      'Representación en espacios consultivos',
    ],
    modulos: [
      { titulo: 'La institucionalidad dominicana', descripcion: 'Poderes, competencias y dónde se toman las decisiones.', duracion: '4 horas' },
      { titulo: 'Estado social de derecho', descripcion: 'Qué obliga la Constitución y cómo se exige su cumplimiento.', duracion: '4 horas' },
      { titulo: 'Mecanismos de participación', descripcion: 'Consultas, iniciativas, veedurías y consejos.', duracion: '4 horas' },
      { titulo: 'El sindicalismo como actor democrático', descripcion: 'Legitimidad, representación y límites.', duracion: '3 horas' },
    ],
  },
  'incidencia-politica-y-formulacion-de-propuestas-sindicales': {
    descripcion:
      'Cómo se convierte una demanda sindical en una propuesta que llega a quien decide: formulación técnica, mapa de actores y estrategia de incidencia.',
    objetivos:
      'Formular propuestas de política pública técnicamente sólidas.\nMapear a los actores que deciden y a quienes los influyen.\nDiseñar y ejecutar una estrategia de incidencia.',
    dirigido_a:
      'Responsables de incidencia, asesores técnicos y dirigencia con agenda legislativa.',
    habilidades: [
      'Formulación de propuestas de política pública',
      'Mapeo de actores y toma de decisiones',
      'Diseño de estrategias de incidencia',
      'Negociación con autoridades y legisladores',
    ],
    modulos: [
      { titulo: 'De la demanda a la propuesta', descripcion: 'Convertir un reclamo en un documento que se pueda discutir.', duracion: '5 horas' },
      { titulo: 'Mapa de poder', descripcion: 'Quién decide, quién influye y qué le mueve.', duracion: '4 horas' },
      { titulo: 'Estrategias de incidencia', descripcion: 'Cabildeo, movilización, medios y alianzas. Cuándo usar cada una.', duracion: '5 horas' },
      { titulo: 'Seguimiento', descripcion: 'Qué hacer después de presentar la propuesta.', duracion: '3 horas' },
    ],
  },
  'analisis-de-coyuntura-nacional-e-internacional': {
    descripcion:
      'Método para leer el momento político y económico: identificar actores, tendencias y oportunidades, y decidir con criterio cuándo actuar.',
    objetivos:
      'Aplicar un método sistemático de análisis de coyuntura.\nDistinguir lo estructural de lo coyuntural.\nUsar el análisis para decidir el momento de la acción sindical.',
    dirigido_a:
      'Dirigencia nacional y equipos de análisis y planificación estratégica.',
    habilidades: [
      'Análisis sistemático de coyuntura',
      'Identificación de actores y correlación de fuerzas',
      'Lectura de tendencias internacionales',
      'Toma de decisiones basada en el contexto',
    ],
    modulos: [
      { titulo: 'Qué es analizar la coyuntura', descripcion: 'Método, categorías y diferencia con la opinión.', duracion: '4 horas' },
      { titulo: 'Actores y correlación de fuerzas', descripcion: 'Quién tiene poder, quién lo está perdiendo y quién puede aliarse.', duracion: '4 horas' },
      { titulo: 'El contexto internacional', descripcion: 'Cómo afecta lo global a las condiciones laborales locales.', duracion: '4 horas' },
      { titulo: 'Decidir cuándo actuar', descripcion: 'Del análisis a la decisión política.', duracion: '3 horas' },
    ],
  },
  'sindicalismo-derechos-sociales-y-politicas-publicas': {
    descripcion:
      'Las políticas públicas que más afectan a los trabajadores —salud, educación, vivienda, pensiones— y cómo el sindicalismo puede intervenir en su diseño.',
    objetivos:
      'Comprender el ciclo de las políticas públicas.\nIdentificar los puntos de entrada para la voz sindical.\nEvaluar el impacto de una política sobre los trabajadores.',
    dirigido_a:
      'Dirigentes con responsabilidad en agenda social y participación en consejos sectoriales.',
    habilidades: [
      'Análisis del ciclo de políticas públicas',
      'Evaluación de impacto sobre los trabajadores',
      'Participación en consejos y comisiones',
      'Elaboración de propuestas sectoriales',
    ],
    modulos: [
      { titulo: 'El ciclo de las políticas', descripcion: 'Agenda, diseño, implementación y evaluación.', duracion: '4 horas' },
      { titulo: 'Políticas que afectan al trabajo', descripcion: 'Salud, educación, vivienda, transporte y pensiones.', duracion: '5 horas' },
      { titulo: 'Dónde puede entrar el sindicato', descripcion: 'Puntos de entrada reales en cada etapa.', duracion: '4 horas' },
      { titulo: 'Evaluar una política', descripcion: 'Criterios y evidencia para decir si funciona.', duracion: '3 horas' },
    ],
  },

  // ─── Eje 8. Investigación, datos y producción de conocimiento ──────────────
  'investigacion-sindical-aplicada': {
    descripcion:
      'Producir conocimiento propio en lugar de depender del ajeno: cómo diseñar y llevar adelante una investigación útil para la acción sindical.',
    objetivos:
      'Formular una pregunta de investigación pertinente para la organización.\nSeleccionar métodos adecuados y viables.\nProducir un informe que sirva para decidir y para incidir.',
    dirigido_a:
      'Equipos técnicos sindicales y dirigentes que impulsan estudios propios.',
    habilidades: [
      'Diseño de investigaciones aplicadas',
      'Recolección de información en campo',
      'Análisis y triangulación de fuentes',
      'Redacción de informes de investigación',
    ],
    modulos: [
      { titulo: 'Preguntar bien', descripcion: 'De la inquietud difusa a una pregunta investigable y útil.', duracion: '4 horas' },
      { titulo: 'Métodos al alcance', descripcion: 'Encuestas, entrevistas, grupos focales y datos secundarios.', duracion: '5 horas' },
      { titulo: 'Trabajo de campo', descripcion: 'Planificación, acceso, registro y consideraciones éticas.', duracion: '4 horas' },
      { titulo: 'Del dato al informe', descripcion: 'Análisis, hallazgos y recomendaciones accionables.', duracion: '5 horas' },
    ],
  },
  'uso-de-datos-para-la-accion-sindical': {
    descripcion:
      'Encontrar, verificar y usar datos oficiales para respaldar la posición sindical, y presentarlos de forma que se entiendan y convenzan.',
    objetivos:
      'Localizar las fuentes de datos disponibles sobre trabajo y economía.\nVerificar la calidad y las limitaciones de una cifra.\nPresentar datos de manera clara en documentos y ante medios.',
    dirigido_a:
      'Equipos técnicos, responsables de comunicación y dirigentes que argumentan con cifras.',
    habilidades: [
      'Localización de fuentes oficiales',
      'Verificación crítica de cifras',
      'Elaboración de tablas y gráficos claros',
      'Argumentación con evidencia',
    ],
    modulos: [
      { titulo: 'Dónde están los datos', descripcion: 'ONE, Banco Central, Ministerio de Trabajo, TSS y organismos internacionales.', duracion: '4 horas' },
      { titulo: 'Leer una cifra con criterio', descripcion: 'Qué mide, cómo se construyó y qué deja fuera.', duracion: '4 horas' },
      { titulo: 'Presentar datos', descripcion: 'Tablas, gráficos y cómo no mentir sin querer.', duracion: '4 horas' },
      { titulo: 'Datos que convencen', descripcion: 'Del número al argumento en una negociación o ante la prensa.', duracion: '3 horas' },
    ],
  },
  'elaboracion-de-informes-diagnosticos-y-documentos-de-posicion': {
    descripcion:
      'Escribir documentos sindicales que se lean y se usen: informes, diagnósticos sectoriales y documentos de posición con estructura y argumento.',
    objetivos:
      'Estructurar un documento según su propósito y su destinatario.\nRedactar con claridad y precisión argumentativa.\nSostener las afirmaciones con evidencia verificable.',
    dirigido_a:
      'Equipos técnicos, secretarías y quienes redactan documentos en nombre de la organización.',
    habilidades: [
      'Estructuración de documentos técnicos',
      'Redacción clara y argumentada',
      'Uso de evidencia y citación',
      'Adaptación al destinatario',
    ],
    modulos: [
      { titulo: 'Antes de escribir', descripcion: 'Para quién, para qué y qué se quiere lograr.', duracion: '3 horas' },
      { titulo: 'Estructura del documento', descripcion: 'Informe, diagnóstico y documento de posición: cada uno tiene su forma.', duracion: '4 horas' },
      { titulo: 'Escribir con claridad', descripcion: 'Párrafo, argumento, evidencia. Errores frecuentes.', duracion: '5 horas' },
      { titulo: 'Revisar y publicar', descripcion: 'Revisión entre pares, edición y difusión.', duracion: '3 horas' },
    ],
  },
  'sistematizacion-de-experiencias-sindicales': {
    descripcion:
      'Recuperar y ordenar lo aprendido en una lucha, una negociación o una campaña, para que la organización no repita errores ni pierda memoria.',
    objetivos:
      'Comprender qué es sistematizar y en qué se diferencia de narrar.\nReconstruir una experiencia identificando decisiones y sus efectos.\nExtraer aprendizajes transferibles a otras situaciones.',
    dirigido_a:
      'Dirigentes y equipos que han conducido procesos y quieren dejar registro útil.',
    habilidades: [
      'Reconstrucción ordenada de experiencias',
      'Identificación de aprendizajes',
      'Registro y documentación de procesos',
      'Transferencia de conocimiento a otras organizaciones',
    ],
    modulos: [
      { titulo: 'Qué es sistematizar', descripcion: 'Diferencia con la crónica, el informe y la evaluación.', duracion: '3 horas' },
      { titulo: 'Reconstruir la experiencia', descripcion: 'Cronología, actores, decisiones y momentos de quiebre.', duracion: '5 horas' },
      { titulo: 'Interpretar', descripcion: 'Por qué pasó lo que pasó. Aprendizajes más allá del caso.', duracion: '4 horas' },
      { titulo: 'Compartir lo aprendido', descripcion: 'Formatos y canales para que sirva a otros.', duracion: '3 horas' },
    ],
  },

  // ─── Eje 9. Incidencia sectorial y macropolíticas ──────────────────────────
  'analisis-sectorial-para-la-accion-sindical': {
    descripcion:
      'Método para analizar un sector económico concreto —su cadena de valor, sus actores y sus condiciones laborales— como base de una estrategia sindical propia.',
    objetivos:
      'Caracterizar un sector productivo con criterio propio.\nIdentificar los puntos donde la acción sindical tiene más fuerza.\nElaborar un diagnóstico sectorial que sirva para negociar e incidir.',
    dirigido_a:
      'Organizaciones de los sectores que integran la CNUS: educación, alimentación, transporte, construcción, agro, metalurgia, minería, zona franca, cañero y sector público.',
    habilidades: [
      'Caracterización de cadenas productivas',
      'Mapeo de empresas y actores sectoriales',
      'Diagnóstico de condiciones laborales por sector',
      'Identificación de puntos de presión',
    ],
    modulos: [
      { titulo: 'Cómo se analiza un sector', descripcion: 'Cadena de valor, estructura de propiedad y empleo.', duracion: '5 horas' },
      { titulo: 'Mapa de actores', descripcion: 'Empresas, gremios, reguladores y sindicatos presentes.', duracion: '4 horas' },
      { titulo: 'Condiciones laborales del sector', descripcion: 'Empleo, salarios, informalidad y seguridad.', duracion: '4 horas' },
      { titulo: 'Dónde tiene fuerza el sindicato', descripcion: 'Puntos críticos de la cadena y capacidad de presión.', duracion: '4 horas' },
    ],
  },
  'macropoliticas-publicas-y-desarrollo-sectorial': {
    descripcion:
      'Las políticas que determinan el rumbo de cada rama de la economía —incentivos, aranceles, inversión pública— y cómo intervenir en su definición.',
    objetivos:
      'Identificar las políticas que condicionan el desarrollo de un sector.\nEvaluar sus efectos sobre el empleo y las condiciones laborales.\nFormular propuestas sectoriales fundamentadas.',
    dirigido_a:
      'Dirigencia sectorial que participa en consejos, mesas y espacios de política productiva.',
    habilidades: [
      'Análisis de políticas sectoriales',
      'Evaluación de impacto sobre el empleo',
      'Formulación de propuestas de desarrollo productivo',
      'Participación en espacios de política sectorial',
    ],
    modulos: [
      { titulo: 'Qué son las macropolíticas', descripcion: 'Instrumentos con que el Estado orienta un sector.', duracion: '4 horas' },
      { titulo: 'Incentivos y su contrapartida', descripcion: 'Exenciones y beneficios: qué recibe el país a cambio.', duracion: '4 horas' },
      { titulo: 'Efectos sobre el trabajo', descripcion: 'Cómo una política sectorial acaba en la nómina.', duracion: '4 horas' },
      { titulo: 'Propuestas desde el sector', descripcion: 'Construir una posición sindical de desarrollo productivo.', duracion: '4 horas' },
    ],
  },
  'dialogo-social-sectorial-y-negociacion-de-politicas-publicas': {
    descripcion:
      'Llevar el diálogo social al terreno de cada rama: mesas sectoriales, negociación con reguladores y acuerdos que van más allá de una sola empresa.',
    objetivos:
      'Reconocer los espacios de diálogo sectorial existentes y los que faltan.\nPreparar la participación sindical con posiciones de rama.\nNegociar acuerdos que alcancen a todo un sector.',
    dirigido_a:
      'Federaciones sectoriales y dirigentes que negocian por encima del nivel de empresa.',
    habilidades: [
      'Construcción de posiciones de rama',
      'Negociación multiempresa',
      'Interlocución con reguladores sectoriales',
      'Seguimiento de acuerdos sectoriales',
    ],
    modulos: [
      { titulo: 'El nivel sectorial', descripcion: 'Por qué negociar por rama y no solo por empresa.', duracion: '4 horas' },
      { titulo: 'Construir la posición del sector', descripcion: 'Acordar entre sindicatos distintos de una misma rama.', duracion: '5 horas' },
      { titulo: 'La mesa sectorial', descripcion: 'Interlocutores, agenda y dinámica de la negociación.', duracion: '4 horas' },
      { titulo: 'Que el acuerdo se cumpla', descripcion: 'Mecanismos de seguimiento y exigibilidad.', duracion: '3 horas' },
    ],
  },
  'laboratorios-sectoriales-de-propuestas-sindicales': {
    descripcion:
      'Espacio de trabajo aplicado: cada participante desarrolla, con acompañamiento, una propuesta concreta de incidencia para su propio sector.',
    objetivos:
      'Aplicar lo aprendido a un problema real del sector propio.\nElaborar una propuesta completa, con diagnóstico, argumento y ruta de incidencia.\nSometer la propuesta a crítica entre pares.',
    dirigido_a:
      'Participantes que ya cursaron los módulos previos del eje y traen un caso concreto de su organización.',
    habilidades: [
      'Elaboración integral de propuestas',
      'Trabajo colaborativo entre sectores',
      'Presentación y defensa de propuestas',
      'Crítica constructiva entre pares',
    ],
    modulos: [
      { titulo: 'Definir el problema', descripcion: 'Cada grupo delimita el asunto sobre el que va a trabajar.', duracion: '4 horas' },
      { titulo: 'Diagnóstico y evidencia', descripcion: 'Reunir los datos que sostienen la propuesta.', duracion: '6 horas' },
      { titulo: 'Formular la propuesta', descripcion: 'Redacción, ruta de incidencia y actores a convencer.', duracion: '6 horas' },
      { titulo: 'Presentación y crítica', descripcion: 'Defensa ante el grupo y ajuste final.', duracion: '4 horas' },
    ],
  },

  // ─── Eje 10. Educación, sindicalismo e incidencia educativa ────────────────
  'politica-educativa-dominicana-y-derecho-a-la-educacion': {
    descripcion:
      'El derecho a la educación en República Dominicana: marco normativo, financiamiento, resultados y las disputas abiertas sobre su orientación.',
    objetivos:
      'Conocer el marco legal e institucional del sistema educativo.\nEvaluar el estado del derecho a la educación con evidencia.\nSituar las demandas del sindicalismo educativo en ese marco.',
    dirigido_a:
      'Organizaciones sindicales del sector educativo y dirigentes con agenda en política educativa.',
    habilidades: [
      'Manejo del marco normativo educativo',
      'Lectura de indicadores del sistema',
      'Argumentación sobre el derecho a la educación',
      'Participación en debates de política educativa',
    ],
    modulos: [
      { titulo: 'El derecho a la educación', descripcion: 'Constitución, Ley General de Educación y compromisos internacionales.', duracion: '4 horas' },
      { titulo: 'Cómo se financia', descripcion: 'El 4% del PIB, su ejecución y sus resultados.', duracion: '4 horas' },
      { titulo: 'Estado del sistema', descripcion: 'Cobertura, calidad, equidad y las brechas persistentes.', duracion: '4 horas' },
      { titulo: 'Disputas abiertas', descripcion: 'Los debates en curso y la posición del sindicalismo educativo.', duracion: '4 horas' },
    ],
  },
  'educacion-preuniversitaria-calidad-educativa-y-condiciones-laborales': {
    descripcion:
      'La relación entre las condiciones de trabajo docente y la calidad educativa: carga, salario, infraestructura, formación y carrera profesional.',
    objetivos:
      'Documentar las condiciones laborales del personal docente y administrativo.\nArgumentar el vínculo entre condiciones de trabajo y aprendizaje.\nFormular demandas de mejora con base en evidencia.',
    dirigido_a:
      'Docentes y personal del nivel preuniversitario, y dirigentes de sus organizaciones.',
    habilidades: [
      'Diagnóstico de condiciones laborales docentes',
      'Argumentación sobre calidad educativa',
      'Negociación de mejoras en el sector',
      'Documentación de la situación de los centros',
    ],
    modulos: [
      { titulo: 'Condiciones del trabajo docente', descripcion: 'Carga, ratio, infraestructura, salario y estabilidad.', duracion: '4 horas' },
      { titulo: 'Condiciones y aprendizaje', descripcion: 'Qué dice la evidencia sobre esa relación.', duracion: '4 horas' },
      { titulo: 'Carrera docente', descripcion: 'Ingreso, evaluación, ascenso y formación continua.', duracion: '4 horas' },
      { titulo: 'Demandas del sector', descripcion: 'Prioridades y cómo sostenerlas con datos.', duracion: '4 horas' },
    ],
  },
  'educacion-universitaria-investigacion-extension-y-trabajo-decente': {
    descripcion:
      'El trabajo en la universidad dominicana: precariedad académica, contratación por horas, y las funciones de docencia, investigación y extensión.',
    objetivos:
      'Caracterizar las condiciones laborales del personal universitario.\nComprender el vínculo entre financiamiento, autonomía y trabajo decente.\nFormular propuestas para el sector universitario.',
    dirigido_a:
      'Personal docente, investigador y administrativo de instituciones de educación superior.',
    habilidades: [
      'Diagnóstico de la precariedad académica',
      'Análisis del financiamiento universitario',
      'Negociación en el ámbito universitario',
      'Defensa de la autonomía y el trabajo decente',
    ],
    modulos: [
      { titulo: 'La universidad dominicana', descripcion: 'Sistema, financiamiento y gobierno institucional.', duracion: '4 horas' },
      { titulo: 'Trabajo académico precario', descripcion: 'Contratación por horas, inestabilidad y multiempleo.', duracion: '4 horas' },
      { titulo: 'Docencia, investigación y extensión', descripcion: 'Las tres funciones y su reconocimiento real.', duracion: '4 horas' },
      { titulo: 'Agenda del sector', descripcion: 'Propuestas de trabajo decente en la educación superior.', duracion: '4 horas' },
    ],
  },
  'educacion-tecnica-formacion-profesional-y-transicion-al-mundo-del-trabajo': {
    descripcion:
      'La formación técnica y profesional como puente al empleo: pertinencia de la oferta, papel del INFOTEP y participación sindical en su diseño.',
    objetivos:
      'Conocer el sistema dominicano de formación técnico-profesional.\nEvaluar la pertinencia de la oferta frente a las necesidades del trabajo.\nDefinir el papel del sindicalismo en su orientación.',
    dirigido_a:
      'Dirigentes de sectores productivos y organizaciones vinculadas a la formación para el trabajo.',
    habilidades: [
      'Análisis de la oferta formativa',
      'Evaluación de pertinencia y calidad',
      'Participación en espacios de formación profesional',
      'Propuestas de recualificación sectorial',
    ],
    modulos: [
      { titulo: 'El sistema de formación técnica', descripcion: 'Instituciones, oferta y financiamiento. El papel del INFOTEP.', duracion: '4 horas' },
      { titulo: 'Pertinencia de la oferta', descripcion: 'Qué se enseña frente a lo que el trabajo requiere.', duracion: '4 horas' },
      { titulo: 'De la formación al empleo', descripcion: 'Inserción laboral, prácticas y sus condiciones.', duracion: '4 horas' },
      { titulo: 'Voz sindical en la formación', descripcion: 'Cómo participar en el diseño de la oferta.', duracion: '3 horas' },
    ],
  },
  'sindicalismo-educativo-dialogo-social-y-reformas-educativas': {
    descripcion:
      'El papel de las organizaciones docentes en las reformas educativas: cómo participar en el diseño en vez de reaccionar cuando ya están decididas.',
    objetivos:
      'Analizar las reformas educativas recientes y sus resultados.\nIdentificar los espacios de diálogo del sector educativo.\nConstruir una estrategia de participación sindical en las reformas.',
    dirigido_a:
      'Dirigencia de organizaciones docentes y responsables de incidencia en política educativa.',
    habilidades: [
      'Análisis de procesos de reforma',
      'Participación en mesas de diálogo educativo',
      'Construcción de propuestas de reforma',
      'Articulación con comunidad educativa y familias',
    ],
    modulos: [
      { titulo: 'Reformas educativas recientes', descripcion: 'Qué se propuso, qué se hizo y qué resultó.', duracion: '4 horas' },
      { titulo: 'Diálogo social en educación', descripcion: 'Espacios existentes y grado de incidencia real.', duracion: '4 horas' },
      { titulo: 'Participar en el diseño', descripcion: 'Cómo entrar antes de que la reforma esté cerrada.', duracion: '4 horas' },
      { titulo: 'Alianzas con la comunidad educativa', descripcion: 'Familias, estudiantes y organizaciones sociales.', duracion: '4 horas' },
    ],
  },
};

module.exports = { CURSOS };
