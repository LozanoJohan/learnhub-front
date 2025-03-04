export interface Club {
    id: string;
    nombre: string;
    area: string;
    capacity: number;
    currentSize: number;
    descripcion: string;
}

export interface ClubEvent {
    title: string;
    description: string;
    date: string;
    location: string;
    duration?: string;
}

export interface ClubMember {
    name: string;
    role: string;
    avatar?: string;
    bio?: string;
}
   