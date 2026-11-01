// Contenido personalizado. Cambia los textos entre comillas por los tuyos.
// Fotos: copia tus imágenes a assets/images/ y pon el nombre en `img` (ej. 'assets/images/playa.jpg').
const DATA = {
  bienvenida: {
    titulo: 'Hola, Chaparra. ♡',
    texto: 'Hice este pequeño lugar pensando en ti. Aquí guardé algunas cositas que quiero compartir contigo.',
    pregunta: '¿Te gustaría descubrirlas?'
  },

  cartas: [
    { id: 'triste', titulo: 'Cuando estés triste',
      texto: 'Chaparra, quisiera poder estar ahí para abrazarte y hacer que todo lo malo desaparezca, aunque sé que no siempre es tan sencillo. Quiero que recuerdes que no tienes que estar bien todo el tiempo, que también tienes derecho a sentirte mal y a tener días difíciles. No estás sola, mi niña. Siempre voy a querer escucharte, acompañarte y recordarte lo increíble que eres. Te quiero muchísimo. ❤️' },
    { id: 'extranes', titulo: 'Cuando me extrañes',
      texto: 'Si estás leyendo esto porque me extrañas, quiero que sepas que probablemente yo también estoy pensando en ti. Ojalá pudiera aparecer de repente para darte un abrazo de esos que hacen que todo lo demás deje de importar. Mientras llega ese momento, recuerda que hay alguien que sonríe con solo pensar en ti. Te mando muchos besitos, Chaparra. ❤️' },
    { id: 'maldia', titulo: 'Cuando tengas un mal día',
      texto: 'Hoy quizá las cosas no salieron como esperabas, pero eso no significa que mañana será igual. No dejes que un día difícil te haga olvidar todas las cosas bonitas que hay en ti. Respira, descansa y date un poquito de cariño. No tienes que resolverlo todo hoy. Y si necesitas distraerte, hablar o simplemente compañía, aquí tienes a alguien que quiere estar contigo.' },
    { id: 'reir', titulo: 'Cuando quieras reír',
      texto: 'JAJAJA, Chaparra, si llegaste hasta aquí es porque necesitas una sonrisa, así que tengo una misión importante: recordarte que eres una niña preciosa, aunque a veces tengas tus momentos de locura. 😂 Espero que estés sonriendo mientras lees esto. Y si no, te debo un abrazo, un beso y probablemente alguna tontería para hacerte reír. Te quiero, enojoncita. ❤️' },
    { id: 'dudes', titulo: 'Cuando dudes de ti misma',
      texto: 'Ojalá pudieras verte por un momento desde mis ojos. Quizá entenderías por qué pienso que eres tan especial. No necesitas ser perfecta, ni compararte con nadie, ni demostrarle nada al mundo para valer muchísimo. Me encanta que seas tú, con tus virtudes, tus ocurrencias y hasta esas pequeñas cosas que quizá tú no notas. Nunca olvides lo mucho que vales, Chaparra.' },
    { id: 'porque', titulo: 'Simplemente porque sí',
      texto: 'No necesitas una razón especial para recibir una carta, un abrazo o un recordatorio de cuánto te quiero. Simplemente quería que tuvieras algo bonito para leer hoy. Me gusta tenerte en mi vida, compartir momentos contigo y seguir conociéndote cada día. Si pudiera elegir nuevamente a alguien con quien crear recuerdos, me seguiría haciendo ilusión que fueras tú. ❤️' }
  ],

  // Vacío = se muestra "Próximamente". Formato de cada recuerdo:
  // { img: 'assets/images/foto.jpg', fecha: '14 feb 2025', titulo: 'Nuestra primera foto', texto: 'Una anécdota.' },
  recuerdos: [],

  // Cinco razones por las que la quieres: una por flor.
  flores: [
    { color: '#C97889', nombre: 'Flor del cariño', razon: 'Porque hasta los días más normales se sienten especiales cuando estás en ellos.' },
    { color: '#762D42', nombre: 'Flor de tu sonrisa', razon: 'Porque tu sonrisa tiene esa habilidad de mejorar cualquier momento.' },
    { color: '#E9B9B9', nombre: 'Flor de tu forma de ser', razon: 'Porque no quisiera que cambiaras esas pequeñas cosas que te hacen ser tú.' },
    { color: '#D98E5F', nombre: 'Flor de los momentos', razon: 'Porque hasta los momentos más sencillos contigo terminan convirtiéndose en recuerdos bonitos.' },
    { color: '#B05A7A', nombre: 'Flor favorita', razon: 'Porque entre tantas flores bonitas, yo siempre elegiría regalarte una a ti. 🌷' }
  ],

  // Vacío = se muestra "Próximamente". Formato de cada momento:
  // { fecha: '3 mar 2025', titulo: 'El día que nos conocimos', texto: 'Cuéntalo aquí.' },
  historia: [],

  sorpresa: {
    titulo: 'Para mi Chaparra ❤️',
    // Cada párrafo va separado por una línea en blanco.
    texto: `Si llegaste hasta aquí, significa que recorriste este pequeño lugar que preparé para ti.

Quizá encontraste algunas cartas, plantaste flores, viste fotografías y recordaste algunos momentos. Pero hay algo que quiero que sepas: cada una de estas pequeñas cosas tiene un propósito, y es recordarte lo mucho que significas para mí.

No hice todo esto porque sea una fecha especial, ni porque necesitara una excusa para demostrarte cariño. Lo hice porque quería regalarte algo diferente, algo que pudieras abrir cuando quisieras y que te recordara que hay alguien que piensa en ti.

Sé que una página web no puede contener todo lo que quisiera decirte, pero al menos puede guardar un pedacito de lo que siento.

Gracias por ser tú, por los momentos que hemos compartido y por permitirme formar parte de tu vida.

Espero que todavía nos queden muchísimas fotografías por tomar, lugares por conocer, risas por compartir y recuerdos por construir.

Y si algún día vuelves a abrir esta página, quiero que recuerdes que fue creada especialmente para ti.`,
    firma: 'Con todo mi amor ♡'
  },

  // Objetivos para desbloquear la sorpresa. Sube `recuerdos` a 3 cuando agregues fotos.
  metas: { cartas: 4, flores: 3, recuerdos: 0, corazones: 7 }
};
