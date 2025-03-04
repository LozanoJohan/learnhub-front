import type { SIACourse } from "../models/courses";

// Datos de prueba para desarrollo local
const mockSiaCourses: SIACourse[] = [
  {
      "name": "Acercamiento a los estudios de fronteras",
      "code": "2028055",
      "type": "LIBRE ELECCI\u00d3N (L)",
      "credits": "3",
      "description": "Introducir a los estudiantes al estudio de las fronteras ofreciendo un panorama de las discusiones recientes a partir de diversos enfoques te\u00f3ricos y estudios de caso. Fomentar actividades de investigaci\u00f3n en torno a las din\u00e1micas fronterizas de Colombia con sus vecinos, as\u00ed como iniciativas de an\u00e1lisis comparado con otras \u00e1reas o regiones fronterizas a partir de las iniciativas de cooperaci\u00f3n entre el Grupo de Estudios Transfronterizos y Grupo de Relaciones Internacionales y Asuntos Globales."
  },
  {
      "name": "Alternativas de aprendizaje aut\u00f3nomo en la educaci\u00f3n superior",
      "code": "2028684",
      "type": "LIBRE ELECCI\u00d3N (L)",
      "credits": "3",
      "description": "Teor\u00edas, modelos y experiencias concretas de Alternativas de Aprendizaje Aut\u00f3nomo en la Educaci\u00f3n Superior. Estudiar trayectorias de aprendizaje y educaci\u00f3n que permiten comprender aspectos fundamentales en la construcci\u00f3n del conocimiento. Dar herramientas para mejorar la capacidad de aprender en los estudiantes, que incrementen su nivel de satisfacci\u00f3n con la vida universitaria y su competencia en el proceso de formaci\u00f3n profesional. C\u00f3mo los entusiasmos y las motivaciones intr\u00ednsecas determinan el aprendizaje y la educaci\u00f3n. Este curso contribuye expl\u00edcitamente a entender y reducir la procrastinaci\u00f3n."
  },
  {
      "name": "Am\u00e9rica latina y la teolog\u00eda pol\u00edtica",
      "code": "2027725",
      "type": "LIBRE ELECCI\u00d3N (L)",
      "credits": "3",
      "description": "El seminario tiene como prop\u00f3sito discutir y animar la investigaci\u00f3n en torno a las diversas relaciones entre Am\u00e9rica Latina y la Teolog\u00eda Pol\u00edtica: comienza con un conjunto de reflexiones introductorias sobre los fundamentos teol\u00f3gicos de la pol\u00edtica y del Estado moderno, as\u00ed como con una breve exploraci\u00f3n referente a la consolidaci\u00f3n acad\u00e9mica de la Teolog\u00eda Pol\u00edtica, para luego desplazarse hacia temas y problemas caracter\u00edsticamente latinoamericanos de notoria actualidad, como el semblante teol\u00f3gico de nuestros \u00f3rdenes pol\u00edtico-raciales, los cristianismos de la opci\u00f3n preferencial por los excluidos y su novedosa lectura de la cr\u00edtica de toda idolatr\u00eda, la inmanencia de Dios en el naturalismo teol\u00f3gico feminista, el pontificado de Jorge Mario Bergoglio, la creciente fuerza del protestantismo carism\u00e1tico, entre otros."
  },
  {
      "name": "An\u00e1lisis cr\u00edtico de medios de comunicaci\u00f3n y redes digitales",
      "code": "2029102",
      "type": "LIBRE ELECCI\u00d3N (L)",
      "credits": "4",
      "description": "Ofrecer elementos te\u00f3ricos y conceptuales para la comprensi\u00f3n del funcionamiento de los sistemas de medios de comunicaci\u00f3n, sus interacciones medi\u00e1ticas y su articulaci\u00f3n con las redes sociales. Conceptos Previos: Metodolog\u00eda: Clases magistrales, Ejercicios y talleres de recepci\u00f3n activa de medios, Trabajo colectivo sobre lecturas te\u00f3ricas y metodol\u00f3gicas, Presentaci\u00f3n y an\u00e1lisis de experiencias pr\u00e1cticas de recepci\u00f3n cr\u00edtica y de producci\u00f3n alternativa de medios."
  },
  {
      "name": "An\u00e1lisis de la pol\u00edtica criminal colombiana desde la resocializaci\u00f3n y el pospenado",
      "code": "2028683",
      "type": "LIBRE ELECCI\u00d3N (L)",
      "credits": "3",
      "description": "Desarrollar una asignatura que permita un di\u00e1logo interdisciplinario entre Ciencias Pol\u00edticas y Derecho, en la cual la poblaci\u00f3n estudiantil tenga un primer acercamiento a la recomprensi\u00f3n de la pol\u00edtica criminal colombiana y la resocializaci\u00f3n desde los actores que han sido afectados directamente por este, siendo estos los pospenados. Conceptos Previos: Preferiblemente con alg\u00fan acercamiento inicial a la teor\u00eda pol\u00edtica b\u00e1sica, la administraci\u00f3n p\u00fablica y las pol\u00edticas p\u00fablicas. Pero en general est\u00e1 abierto a la comunidad estudiantil del departamento, tanto de pregrado como de posgrado."
  },
  {
      "name": "An\u00e1l\u00edsis de procesos de planeaci\u00f3n p\u00fablica",
      "code": "2028580",
      "type": "LIBRE ELECCI\u00d3N (L)",
      "credits": "3",
      "description": "Proporcionar elementos conceptuales, te\u00f3ricos y metodol\u00f3gicos que permiten entender los procesos de planeaci\u00f3n p\u00fablica con relaci\u00f3n al ciclo de pol\u00edticas publicas en Colombia."
  },
  {
      "name": "An\u00e1lisis estrat\u00e9gico de informaci\u00f3n para pol\u00edticas p\u00fablicas",
      "code": "2028058",
      "type": "LIBRE ELECCI\u00d3N (L)",
      "credits": "3",
      "description": "La asignatura An\u00e1lisis Estrat\u00e9gico de Informaci\u00f3n para Pol\u00edticas P\u00fablicas pretende ofrecer herramientas pr\u00e1cticas que permitan a los futuros polit\u00f3logos abordar las pol\u00edticas p\u00fablicas y en general los estudios sociales combinando un an\u00e1lisis cuantitativo y cualitativo de informaci\u00f3n, con una aplicaci\u00f3n estrat\u00e9gica del conocimiento para alcanzar las soluciones de mayor impacto social posible en un contexto determinado. Lo anterior a partir de un abordaje desde el ciclo de las pol\u00edticas p\u00fablicas e involucrando en cada etapa un an\u00e1lisis de estad\u00edstica b\u00e1sica, combinado con un an\u00e1lisis cr\u00edtico de la situaci\u00f3n socialmente problem\u00e1tica."
  },
  {
      "name": "Antropolog\u00eda cr\u00edtica de las transiciones pol\u00edticas: cotidianidad y construcci\u00f3n de la experiencia.",
      "code": "2028576",
      "type": "LIBRE ELECCI\u00d3N (L)",
      "credits": "3",
      "description": "Brindar elementos para una problematizaci\u00f3n antropol\u00f3gica de las transiciones pol\u00edticas desde la perspectiva de las dimensiones cotidianas de la experiencia de los trabajadores de los derechos humanos y para el desarrollo, y de las personas que han atravesado por hechos dolorosos en el marco de los conflictos social, pol\u00edtico y armado."
  },
  {
      "name": "Apreciacion del sonido",
      "code": "2022165",
      "type": "LIBRE ELECCI\u00d3N (L)",
      "credits": "3",
      "description": ""
  },
  {
      "name": "Asignatura por convenio con Universidad de los Andes I - PREGRADO",
      "code": "2011302",
      "type": "LIBRE ELECCI\u00d3N (L)",
      "credits": "0",
      "description": "La Gesti\u00f3n Acadd\u00e9mica de este Convenio es cordinada por la Divisi\u00f3n de Registro"
  }
].map(course => ({
  ...course,
  credits: parseInt(course.credits),
  title: course.name,
  id: course.code,
  score: 0,
  difficulty: "fácil"
}));

// Antes de la función filterMockSiaCourses, agrego la función normalizeString
function normalizeString(input: string): string {
  return input.normalize('NFD').replace(/\p{Diacritic}/gu, ''); // También se puede usar [\u0300-\u036f] si es necesario
}

// Función para filtrar cursos SIA mock según la consulta
function filterMockSiaCourses(query: string): SIACourse[] {
  if (!query) return mockSiaCourses;
  
  const normalizedQuery = normalizeString(query).toLowerCase();
  return mockSiaCourses.filter(course => 
    normalizeString(course.title).toLowerCase().includes(normalizedQuery) ||
    normalizeString(course.description).toLowerCase().includes(normalizedQuery) ||
    course.id.toLowerCase().includes(normalizedQuery)
  );
}

export function getSiaCourses(query: string = ""): Promise<SIACourse[]> {
  // Si estamos en desarrollo local, usar datos mock
    // Simulamos una petición asíncrona
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(filterMockSiaCourses(query));
      }, 700); // Pequeño retraso para simular tiempo de carga
    });
  

  // // En producción, usar la API real
  // return fetch(`${API_BASE_URL}/courses/sia?query=${encodeURIComponent(query)}`, {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Accept': 'application/json'
  //   },
  //   mode: 'cors',
  //   credentials: 'include'
  // })
  //   .then((res) => {
  //     if (!res.ok) {
  //       throw new Error(`Error al obtener cursos del SIA: ${res.status}`);
  //     }
  //     return res.json();
  //   })
  //   .then((data) => {
  //     return data as SIACourse[];
  //   })
  //   .catch(error => {
  //     console.error('Error fetching SIA courses:', error);
  //     return [];
  //   });
} 
