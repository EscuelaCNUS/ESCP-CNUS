# Guía del panel de contenidos — Escuela CNUS

Esta guía explica cómo publicar y editar el contenido de **escuelacnus.com** sin
necesidad de saber programar. Si sabes usar Word y el correo, sabes usar esto.

---

## 1. Entrar al panel

**Dirección:** https://escp-cnus-production.up.railway.app/admin

Entra con el correo y la contraseña que te dieron. Guarda la página en favoritos:
la vas a usar a menudo y la dirección es difícil de recordar.

Si olvidas la contraseña, pide a quien administra el sistema que te la
restablezca. No hay recuperación automática por correo.

### Qué ves al entrar

A la izquierda hay un menú. Lo que usarás casi siempre es:

| Menú | Para qué sirve |
|---|---|
| **Content Manager** | Escribir y editar todo el contenido de la web |
| **Media Library** | Las imágenes y vídeos que has subido |
| **Settings** | Configuración. Normalmente no hace falta tocarla |

Dentro de **Content Manager** están los tipos de contenido: Artículo, Programa,
Debate, Autor, Categoría, Etiqueta, Eje Formativo y dos configuraciones de la
portada.

---

## 2. Tres cosas que conviene entender antes de empezar

### Borrador y publicado

Los **artículos** y los **programas** tienen dos estados. Arriba de la pantalla
verás dos pestañas: `DRAFT` (borrador) y `PUBLISHED` (publicado).

- **Borrador**: solo lo ves tú en el panel. Nadie más.
- **Publicado**: está en la web, a la vista de todo el mundo.

Guardar **no** es publicar. Son dos botones distintos:

- **Save** guarda tus cambios en el borrador
- **Publish** los pone en la web

Si escribes un artículo, pulsas Save y cierras, ese artículo **no está en la
web**. Falta pulsar Publish.

Los **debates**, **autores**, **categorías**, **etiquetas** y **ejes** no tienen
esa distinción: en cuanto los guardas, están activos.

### Los cambios aparecen en segundos

Cuando publicas algo, la web tarda **unos 4 segundos** en mostrarlo. Si no lo
ves, espera un momento y recarga con `Ctrl + F5` (o `Cmd + Shift + R` en Mac),
que fuerza al navegador a pedir la versión nueva en vez de mostrarte la que tenía
guardada.

### Lo que se borra, se borra

No hay papelera. Si eliminas un artículo, un curso o una imagen, desaparece y no
se puede recuperar. Ante la duda, **despublica en vez de borrar**: el contenido
sale de la web pero se conserva en el panel.

---

## 3. Publicar un artículo

Los artículos son las publicaciones de la sección **Articulando**.

1. Menú izquierdo → **Content Manager** → **Artículo**
2. Botón **Create new entry**, arriba a la derecha
3. Rellena los campos (abajo se explica cada uno)
4. **Save**
5. **Publish**

### Los campos, uno a uno

**Título** *(obligatorio, máximo 60 caracteres)*
El titular. Es lo que se ve grande en la web y en Google. Que se entienda solo,
sin contexto.

El campo lleva un contador debajo que va marcando cuánto llevas escrito. Al
llegar a 60 no deja seguir: es el punto a partir del cual Google empieza a
recortar los titulares en los resultados de búsqueda, y un titular cortado a la
mitad pierde fuerza. Si no cabe, casi siempre sobra alguna palabra.

**Slug** *(obligatorio)*
La dirección web del artículo. Se genera solo a partir del título; hay un botón
con una flecha circular para regenerarlo.

> ⚠️ **Importante:** una vez publicado, **no cambies el slug**. La dirección del
> artículo cambiaría y cualquier enlace compartido dejaría de funcionar.

**Extracto**
Un resumen de dos o tres líneas. Aparece en las tarjetas del listado y es lo que
se ve cuando alguien comparte el enlace por WhatsApp. Si lo dejas vacío, la
tarjeta se ve incompleta.

**Contenido**
El texto del artículo. Puedes darle formato con marcas sencillas:

| Escribes | Se ve |
|---|---|
| `## Un subtítulo` | Un subtítulo grande |
| `### Otro más pequeño` | Un subtítulo pequeño |
| `**palabra**` | **palabra** en negrita |
| `*palabra*` | *palabra* en cursiva |
| `[texto del enlace](https://ejemplo.com)` | Un enlace |

Deja una línea en blanco entre párrafos para que se separen bien.

**Imagen de portada**
La foto grande del artículo. Ver el apartado 8 sobre imágenes.

**Fecha de publicación**
La fecha que se muestra al lector. Puedes ponerla distinta del día en que
publicas, por ejemplo si el texto se escribió antes.

**Destacado**
Marca el artículo que aparece en primer lugar en la portada de Articulando.

> Solo puede haber **uno** destacado. Al marcar uno nuevo, el anterior se
> desmarca automáticamente. No hace falta que lo hagas tú.

**Autor**
Quién firma el artículo. Si la persona no está en la lista, créala primero en
**Autor** (apartado 6).

**Categoría**
A qué sección pertenece: Notas del presidente, Columna del director,
Pensamiento complejo, o Noticias y eventos. Determina en qué página aparece.

**Etiquetas**
Los temas del artículo. Se muestran en la ficha con almohadilla: #Sindicalismo,
#Derechos Laborales. Puedes poner varias. Si falta alguna, créala en
**Etiqueta**.

---

## 4. Crear o editar un curso

Los cursos son la sección **Programas**. Hay 45 cargados, uno por cada curso de
la estructura curricular.

> ⚠️ **Los cursos ya publicados tienen descripciones y temarios provisionales**
> que se generaron automáticamente como punto de partida. **Hay que revisarlos**:
> los módulos y las habilidades son una propuesta, no el plan aprobado por la
> escuela.

**Content Manager** → **Programa** → elige uno o crea uno nuevo.

### Los campos

**Título** y **Slug** — igual que en los artículos.

**Descripción**
Dos o tres líneas sobre de qué va el curso. Se ve en la tarjeta del listado.

**Imagen**
La portada del curso.

> Las imágenes actuales son fotografías de banco puestas como provisionales.
> Conviene cambiarlas por fotos de la escuela: asambleas, talleres,
> movilizaciones. Se nota mucho la diferencia.

**Modalidad**
Virtual, Presencial o Híbrido.

**Duración**
Texto libre: "40 horas", "3 meses", lo que corresponda.

**Destacado**
Los cursos que salen en la portada del sitio.

> Solo caben **cuatro**. Si intentas marcar un quinto, el sistema te avisa y te
> pide que desmarques otro primero.

**Eje**
A cuál de los diez ejes formativos pertenece. Es lo que alimenta el filtro
desplegable de la página de programas.

**Instructor**
Quién lo imparte. Se elige de la lista de Autores.

**Objetivos**
Qué se propone lograr el curso. Escribe uno por línea.

**Dirigido a**
A quién va destinado: delegados, dirigentes de tal sector, etc.

**Fecha de inicio** y **Fecha de fin**
Si el curso tiene convocatoria con fechas concretas. Si no, déjalas vacías y no
se muestra nada.

**Módulos**
El temario. Cada módulo es un bloque con tres datos:

- **Título** del módulo
- **Descripción** de lo que se ve en él
- **Duración**, por ejemplo "4 horas"

Para añadir uno, pulsa **Add an entry**. Para reordenarlos, arrastra el
manojo de puntos que aparece a la izquierda de cada bloque.

**Habilidades**
Lo que el participante sabrá hacer al terminar. Una por bloque.

---

## 5. Crear un debate

Los debates son las preguntas abiertas de la sección Articulando, donde la gente
opina.

**Content Manager** → **Debate** → **Create new entry**

**Pregunta** *(obligatorio)*
La pregunta que se lanza al debate. Es el título y lo único imprescindible.

**Slug** *(obligatorio)*
Se genera solo.

**Imagen de portada** / **Archivo media**
La foto o el vídeo de fondo. Si subes un vídeo, se reproduce automáticamente y
sin sonido.

**URL de vídeo**
Si prefieres enlazar un vídeo de YouTube o Vimeo en vez de subir el archivo,
pega aquí la dirección.

### Dos cosas sobre los debates

**El debate destacado es el más reciente.** No hay que marcar nada: el último
que crees pasa automáticamente al primer lugar de la página, y el anterior baja
a "Debates anteriores".

**Los contadores se calculan solos.** El número de participantes y de opiniones
sale de los comentarios reales. Cuentan *personas*, no mensajes: si alguien
escribe tres veces, suma uno. No hay nada que rellenar a mano.

---

## 6. Autores, categorías, etiquetas y ejes

Son listas de apoyo. Se crean una vez y luego se eligen desde los artículos y
los cursos.

### Autor

Quien firma artículos o imparte cursos.

- **Nombre** *(obligatorio)* y **Apellido**
- **Correo** — no se muestra en la web. Sirve para vincular a cada editor con su
  ficha, así que **no lo borres ni lo cambies** si esa persona escribe en el
  panel.
- **Cargo** — "Presidente CNUS", "Coordinadora académica"…
- **Biografía** — un párrafo breve que aparece bajo sus artículos
- **Avatar** — foto de perfil, preferiblemente cuadrada

### Categoría

Las cuatro secciones de Articulando. Ya están creadas y **no conviene tocarlas**:
cambiar el slug de una categoría rompe las direcciones de todos sus artículos.

El campo **Orden** decide en qué posición aparece en los menús.

### Etiqueta

Los temas: Sindicalismo, Derechos Laborales, Formación, Trabajo Decente,
Incidencia Política, Liderazgo, Género. Puedes crear más cuando haga falta.

### Eje Formativo

Los diez ejes de la estructura curricular. Los nombres son cortos a propósito,
porque se muestran en el filtro desplegable de la página de programas: si les
pones el título completo, el desplegable se descuadra.

El campo **Orden** define su posición en el filtro.

---

## 7. La portada

Dos apartados especiales que no son listas, sino una única configuración.

### Hero Config

La franja grande de arriba del todo en la página de inicio.

- **Tipo media** — si el fondo es imagen o vídeo
- **Archivo media** — el fondo
- **Poster media** — imagen que se ve mientras el vídeo carga
- **Título** y **Subtítulo**
- **Texto del botón** y **URL del botón**
- **Programa destacado** — el curso al que apunta
- **Stat 1, 2 y 3** — las tres cifras de la franja blanca ("10 ejes formativos",
  "14 líneas sectoriales"…)

### Audiencia

La sección "¿A quién está dirigida la Escuela?". Es una lista de diapositivas;
cada una tiene número, título, descripción e imagen.

---

## 8. Imágenes: cómo subirlas bien

Las imágenes se guardan en **Media Library** y desde ahí se usan en cualquier
contenido.

**Antes de subir:**

- **Tamaño**: entre 1200 y 2000 píxeles de ancho está bien. Más grande no mejora
  nada y hace la web más lenta.
- **Peso**: por debajo de 1 MB. Si tu foto pesa 8 MB, redúcela antes.
- **Formato**: JPG para fotografías, PNG si necesitas fondo transparente.
- **Nombre del archivo**: ponle un nombre descriptivo antes de subirla.
  `asamblea-cnus-2026.jpg` es útil; `IMG_20260806.jpg` no le sirve a nadie.

**Texto alternativo.** Al subir una imagen, Strapi pide un *alternative text*.
Escribe en una frase lo que se ve: "Trabajadores en asamblea en el local de la
CNUS". Lo leen las personas ciegas que navegan con lector de pantalla, y también
ayuda a que Google entienda la foto.

**Reutilizar.** Si una imagen ya está subida, no la subas otra vez: búscala en
Media Library y selecciónala. Subirla dos veces ocupa espacio y crea confusión.

---

## 9. Lo que NO se gestiona desde el panel

Hay cosas de la web que no están en Strapi. Conviene saberlo para no buscarlas
sin encontrarlas:

| Qué | Dónde está |
|---|---|
| Los comentarios de artículos y debates | En Supabase, otra base de datos |
| Los mensajes del formulario de contacto | Llegan por correo a la escuela |
| Los suscriptores del boletín | En Resend, el sistema de envío de correos |

> ⚠️ **No hay moderación de comentarios.** Cualquiera puede publicar y aparece al
> instante, sin revisión previa. Para borrar uno inapropiado hay que pedírselo a
> quien administra el sistema: no se puede desde el panel.

---

## 10. Problemas frecuentes

**Publiqué algo y no aparece en la web**
Espera unos segundos y recarga con `Ctrl + F5`. Si sigue sin verse, comprueba que
pulsaste **Publish** y no solo **Save**: mira la pestaña de arriba, tiene que
decir `PUBLISHED`.

**Me sale "Ya hay 4 programas destacados"**
Es el límite de la portada. Desmarca uno antes de destacar otro.

**Marqué un artículo como destacado y se desmarcó otro**
Es lo esperado. Solo puede haber uno.

**No puedo editar un artículo**
Si tu usuario tiene el rol de Editor, solo puedes modificar los artículos de los
que figuras como autor. Es intencional. Pide a un administrador que te lo asigne.

**Subí una imagen y la web va lenta**
Probablemente pesa demasiado. Mira su tamaño en Media Library y sustitúyela por
una más ligera.

**Borré algo sin querer**
No hay papelera. Habrá que volver a crearlo. Por eso conviene despublicar en vez
de borrar.

---

## 11. Buenas costumbres

**Antes de publicar, léelo en la web.** Guarda, publica y abre la página real.
En el panel las cosas se ven distintas.

**Escribe el extracto siempre.** Es lo que la gente ve en los listados y al
compartir por WhatsApp. Sin él, la tarjeta queda coja.

**Pon imagen a todo.** Un artículo o un curso sin foto se ve incompleto.

**Revisa en el móvil.** La mayoría de las visitas llegan desde un teléfono.

**No cambies slugs de contenido ya publicado.** Rompe los enlaces que la gente
haya compartido.

---

*Última actualización: agosto de 2026*
