export interface SIACourse {
    title: string;
    description: string;
    id: string;
    credits: number;
    score: number;
    difficulty: "fácil" | "medio" | "dificil"
    places?: number | null
}

export interface CourseraCourse {
    title: string;
    description: string;
    id: string;
    author: string;
    score: number;
}
   