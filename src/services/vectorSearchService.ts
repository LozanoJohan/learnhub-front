import type { SIACourse, VectorSearchResult, RelatedCoursesResult } from "../models/courses";

// URL de la API
const API_BASE_URL = "/api"; // Usando URL relativa para que funcione con el proxy

/**
 * Realiza una búsqueda vectorial de cursos basada en la similitud semántica
 * @param query - Texto de la consulta
 * @param topN - Número de resultados a devolver
 * @returns Promesa con los resultados de la búsqueda
 */
export async function searchCoursesByVector(query: string, topN: number = 10): Promise<SIACourse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/vector-search?query=${encodeURIComponent(query)}&top_n=${topN}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error en la búsqueda vectorial: ${response.status}`);
    }

    const data = await response.json() as VectorSearchResult;
    
    // Transformar los resultados al formato esperado por la aplicación
    return data.results.map(course => ({
      title: course.name || "",
      description: course.description || "",
      id: course.code || "",
      code: course.code,
      name: course.name,
      type: course.type,
      credits: parseInt(course.credits?.toString() || "0"),
      score: course.similarity_score || 0,
      difficulty: determineDifficulty(course.similarity_score || 0)
    }));
  } catch (error) {
    console.error('Error en la búsqueda vectorial:', error);
    return [];
  }
}

/**
 * Encuentra cursos relacionados a un curso específico por su código
 * @param courseCode - Código del curso
 * @param topN - Número de cursos relacionados a devolver
 * @returns Promesa con los cursos relacionados
 */
export async function getRelatedCourses(courseCode: string, topN: number = 5): Promise<SIACourse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/related/${courseCode}?top_n=${topN}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error al obtener cursos relacionados: ${response.status}`);
    }

    const data = await response.json() as RelatedCoursesResult;
    
    // Transformar los resultados al formato esperado por la aplicación
    return data.results.map(course => ({
      title: course.name || "",
      description: course.description || "",
      id: course.code || "",
      code: course.code,
      name: course.name,
      type: course.type, 
      credits: parseInt(course.credits?.toString() || "0"),
      score: course.similarity_score || 0,
      difficulty: determineDifficulty(course.similarity_score || 0)
    }));
  } catch (error) {
    console.error('Error al obtener cursos relacionados:', error);
    return [];
  }
}

/**
 * Determina la dificultad del curso basado en su puntuación de similitud
 * @param similarityScore - Puntuación de similitud (0-1)
 * @returns Nivel de dificultad como string
 */
function determineDifficulty(similarityScore: number): "fácil" | "medio" | "dificil" {
  if (similarityScore >= 0.8) return "fácil";
  if (similarityScore >= 0.6) return "medio";
  return "dificil";
} 