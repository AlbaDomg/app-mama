export const DEFAULT_TASKS = [
  {
    id: 'task-1',
    title: 'Crear cartel para el Viernes de Concierto',
    category: 'Diseño en Canva',
    description: 'Diseñar el cartel promocional para el concierto de "Jazz & Blues Trío" de este viernes.',
    dueDate: '2026-05-29',
    status: 'pending',
    points: 15,
    tutorialId: 'tut-canva-poster',
    canvaTemplateUrl: 'https://www.canva.com/templates/',
    deliveryInfo: null,
  },
  {
    id: 'task-2',
    title: 'Publicar el cartel en el feed de Instagram',
    category: 'Redes Sociales',
    description: 'Subir el cartel del concierto del viernes al perfil de Instagram del local.',
    dueDate: '2026-05-29',
    status: 'pending',
    points: 10,
    tutorialId: 'tut-instagram-post',
    deliveryInfo: null,
  },
  {
    id: 'task-3',
    title: 'Subir Historia de "Programación de la Semana"',
    category: 'Redes Sociales',
    description: 'Subir una historia atractiva a Instagram mostrando los eventos del viernes y sábado.',
    dueDate: '2026-05-27',
    status: 'pending',
    points: 10,
    tutorialId: 'tut-instagram-story',
    deliveryInfo: null,
  },
  {
    id: 'task-4',
    title: 'Crear cartel para el Sábado de Dj Set',
    category: 'Diseño en Canva',
    description: 'Crear el cartel promocional para el Dj Set del sábado por la noche ("Vibras de Primavera").',
    dueDate: '2026-05-30',
    status: 'pending',
    points: 15,
    tutorialId: 'tut-canva-poster',
    canvaTemplateUrl: 'https://www.canva.com/templates/',
    deliveryInfo: null,
  },
  {
    id: 'task-5',
    title: 'Publicar recordatorio del evento en Facebook',
    category: 'Redes Sociales',
    description: 'Publicar una invitación rápida y el cartel en la página oficial de Facebook del local.',
    dueDate: '2026-05-28',
    status: 'pending',
    points: 10,
    tutorialId: 'tut-facebook-post',
    deliveryInfo: null,
  }
];

export const DEFAULT_EVENTS = [
  {
    id: 'event-1',
    title: 'Jazz & Blues Trío',
    type: 'Concierto en Vivo',
    date: '2026-05-29',
    time: '21:30',
    artist: 'Jazz & Blues Trío',
    description: 'Noche de música en directo, swing y buena vibra en la terraza de nuestro local.',
    tasksLinked: ['task-1', 'task-2']
  },
  {
    id: 'event-2',
    title: 'Vibras de Primavera (Dj Set)',
    type: 'Dj de la Casa',
    date: '2026-05-30',
    time: '23:00',
    artist: 'Dj Carlotta',
    description: 'Sesión especial de música house y éxitos de los 80/90 para bailar toda la noche.',
    tasksLinked: ['task-4']
  }
];

export const TUTORIALS = [
  {
    id: 'tut-canva-poster',
    title: 'Cómo crear un cartel para eventos en Canva',
    difficulty: 'Fácil',
    duration: '10 minutos',
    category: 'Diseño en Canva',
    steps: [
      {
        num: 1,
        title: 'Abrir la plantilla en Canva',
        desc: 'Haz clic en el gran botón dorado "Abrir Canva" para abrir el diseño base que ya tiene los logos y la tipografía de nuestro local.'
      },
      {
        num: 2,
        title: 'Cambiar el Nombre del Artista y Fecha',
        desc: 'Haz doble clic sobre el texto que dice "Nombre del Artista" y escribe el nombre del grupo de esta semana (ej. "Jazz & Blues Trío"). Haz lo mismo con el día y la hora.'
      },
      {
        num: 3,
        title: 'Cambiar la foto (Opcional)',
        desc: 'Si tienes una foto del artista, ve a la izquierda en "Subidos" -> "Subir archivos", selecciona la foto en tu ordenador y arrástrala encima del cuadro de la foto anterior para cambiarla automáticamente.'
      },
      {
        num: 4,
        title: 'Descargar el cartel',
        desc: 'En la esquina de arriba a la derecha, haz clic en "Compartir" -> "Descargar". Selecciona el formato "PNG" y pulsa el botón morado de "Descargar". Se guardará en la carpeta Descargas de tu ordenador.'
      }
    ],
    tips: [
      '💡 Revisa siempre que la fecha escrita en el cartel coincida con el día real del concierto.',
      '💡 Intenta no mover de sitio el logotipo del local para mantener una imagen limpia.',
      '💡 Si te equivocas haciendo algo, pulsa las teclas "Ctrl + Z" (o Cmd + Z en Mac) para deshacer.'
    ]
  },
  {
    id: 'tut-instagram-post',
    title: 'Cómo publicar el cartel en el feed de Instagram',
    difficulty: 'Muy Fácil',
    duration: '5 minutos',
    category: 'Redes Sociales',
    steps: [
      {
        num: 1,
        title: 'Entrar en Instagram',
        desc: 'Abre la aplicación de Instagram en tu móvil o escribe instagram.com en tu ordenador y accede a la cuenta del local.'
      },
      {
        num: 2,
        title: 'Crear publicación (+)',
        desc: 'Presiona el botón con el símbolo "+" (Crear) y selecciona la foto del cartel (el archivo PNG) que acabas de descargar de Canva.'
      },
      {
        num: 3,
        title: 'Escribir el texto descriptivo',
        desc: 'Escribe un mensaje entusiasta invitando a la gente. Ejemplo: "¡Este viernes tenemos noche mágica! 🎶 Jazz & Blues Trío en concierto en directo. Ven a disfrutar de la mejor música, cócteles y buen ambiente. Reserva tu mesa por mensaje directo 📩"'
      },
      {
        num: 4,
        title: 'Añadir Hashtags y Ubicación',
        desc: 'Escribe la ubicación del local y pega los hashtags que te dejamos en los consejos de abajo para llegar a más gente.'
      },
      {
        num: 5,
        title: 'Compartir',
        desc: 'Haz clic en el botón azul "Compartir". Una vez se suba, copia el enlace (link) de la publicación para entregarlo aquí en tu Dashboard.'
      }
    ],
    tips: [
      '📌 Hashtags recomendados: #MusicaEnVivo #ConciertoViernes #TerrazaLocal #JazzNight #CervezaFria',
      '📌 Las mejores horas para publicar en feed son a las 14:00 (hora de comer) o a las 20:30 de la tarde.'
    ]
  },
  {
    id: 'tut-instagram-story',
    title: 'Cómo subir una Historia a Instagram',
    difficulty: 'Fácil',
    duration: '3 minutos',
    category: 'Redes Sociales',
    steps: [
      {
        num: 1,
        title: 'Abrir Instagram en el Móvil',
        desc: 'Las historias son más fáciles de subir directamente desde tu teléfono móvil. Abre la aplicación.'
      },
      {
        num: 2,
        title: 'Deslizar para abrir la Cámara',
        desc: 'Desliza tu dedo hacia la derecha en la pantalla principal de Instagram para abrir la cámara de Historias.'
      },
      {
        num: 3,
        title: 'Seleccionar la foto del cartel',
        desc: 'Pulsa el cuadrito pequeño que ves abajo a la izquierda para abrir tu galería de fotos y selecciona el cartel vertical.'
      },
      {
        num: 4,
        title: 'Añadir música e interactivos',
        desc: 'Pulsa el icono de la carita cuadrada sonriente arriba (Stickers) y selecciona "Música" para buscar una canción de Jazz o del estilo del evento. ¡Hará la historia mucho más atractiva!'
      },
      {
        num: 5,
        title: 'Publicar',
        desc: 'Presiona el botón redondo abajo a la izquierda que dice "Tu historia". ¡Ya la verá todo el mundo!'
      }
    ],
    tips: [
      '✨ Poner música de fondo alegre e invitar a la acción mediante stickers como el de "Ubicación" aumentará mucho las visitas.',
      '✨ Sube una historia el miércoles para anunciar la semana, y otra el mismo viernes por la mañana como recordatorio final.'
    ]
  },
  {
    id: 'tut-facebook-post',
    title: 'Cómo publicar el recordatorio en Facebook',
    difficulty: 'Muy Fácil',
    duration: '4 minutos',
    category: 'Redes Sociales',
    steps: [
      {
        num: 1,
        title: 'Entrar en Facebook del local',
        desc: 'Entra en facebook.com o abre la app de Facebook y ve al perfil o página oficial del local.'
      },
      {
        num: 2,
        title: 'Hacer clic en "¿Qué tienes en mente?"',
        desc: 'Pulsa en el cuadro de texto para crear una nueva publicación en la página.'
      },
      {
        num: 3,
        title: 'Subir la foto y escribir el texto',
        desc: 'Pulsa el botón verde de "Foto/Video" y sube el cartel de Canva. Después, escribe el mensaje invitando a los clientes (puedes copiar y pegar el mismo texto que usaste en Instagram).'
      },
      {
        num: 4,
        title: 'Publicar',
        desc: 'Haz clic en el botón azul "Publicar" para que aparezca en el muro del local. ¡Trabajo terminado!'
      }
    ],
    tips: [
      '💡 Puedes vincular tu cuenta de Instagram con Facebook para que lo que publiques en Instagram se comparta en Facebook automáticamente.'
    ]
  }
];
