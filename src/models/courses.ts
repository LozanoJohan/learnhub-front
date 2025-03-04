export interface SIACourse {
    title: string;
    description: string;
    id: string;
    credits: number;
    score: number; // score is out of 5
    difficulty: "fácil" | "medio" | "dificil"
    places?: number | null // numero de cupos disponibles
    code?: string;
    name?: string;
    type?: string;
    similarity_score?: number; // Puntuación de similitud para búsqueda vectorial
}

export interface CourseraCourse {
    title: string;
    id: string;
    score: number; // score is out of 5 que tan recomendado es
    reviews: string; // numero de reviews
    skills: string; // skills que se aprenden en el curso
    url: string; // url del curso
    description: string;
    professor: string;
    difficulty: string;
    name?: string;
    similarity_score?: number; // Puntuación de similitud para búsqueda vectorial
}

export interface VectorSearchResult {
    results: SIACourse[];
    count: number;
    query: string;
    search_time_seconds: number;
    search_type: 'vector';
}

export interface RelatedCoursesResult {
    results: SIACourse[];
    count: number;
    course_code: string;
    search_time_seconds: number;
}
