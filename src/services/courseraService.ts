import type { CourseraCourse } from "../models/courses";
import { API_BASE_URL } from '../config/constants';

// Datos de prueba para desarrollo local
const mockCourseraCourses: CourseraCourse[] = [
  {
    id: 'coursera1',
    title: 'Introducción a la Inteligencia Artificial',
    url: 'https://www.coursera.org/learn/ai-intro',
    skills: 'Machine Learning, Python, Redes Neuronales, Estadística',
    score: 4.8,
    reviews: '24582'
  },
  {
    id: 'coursera2',
    title: 'Desarrollo Web Full Stack',
    url: 'https://www.coursera.org/learn/web-development',
    skills: 'HTML, CSS, JavaScript, React, Node.js, MongoDB',
    score: 4.6,
    reviews: '18734'
  },
  {
    id: 'coursera3',
    title: 'Ciencia de Datos para Principiantes',
    url: 'https://www.coursera.org/learn/data-science-basics',
    skills: 'Python, Pandas, NumPy, Visualización de Datos, SQL',
    score: 4.7,
    reviews: '32145'
  },
  {
    id: 'coursera4',
    title: 'Fundamentos de Ciberseguridad',
    url: 'https://www.coursera.org/learn/cybersecurity-basics',
    skills: 'Seguridad de Red, Criptografía, Análisis de Vulnerabilidades',
    score: 4.5,
    reviews: '12987'
  }
];

// Función para filtrar cursos mock según la consulta
function filterMockCourses(query: string): CourseraCourse[] {
  if (!query) return mockCourseraCourses;
  
  const normalizedQuery = query.toLowerCase();
  return mockCourseraCourses.filter(course => 
    course.title.toLowerCase().includes(normalizedQuery) ||
    course.skills.toLowerCase().includes(normalizedQuery)
  );
}

export function getCourseraCourses(query: string = ""): Promise<CourseraCourse[]> {
  // Si estamos en desarrollo local, usar datos mock
  if (window.location.hostname === 'localhost') {
    console.log('Usando datos mock para Coursera en desarrollo local');
    // Simulamos una petición asíncrona
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(filterMockCourses(query));
      }, 600); // Pequeño retraso para simular tiempo de carga
    });
  }

  // En producción, usar la API real
  return fetch(`${API_BASE_URL}/courses/coursera?query=${encodeURIComponent(query)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    mode: 'cors',
    credentials: 'include'
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Error al obtener cursos de Coursera: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      return data as CourseraCourse[];
    })
    .catch(error => {
      console.error('Error fetching Coursera courses:', error);
      return [];
    });
}
