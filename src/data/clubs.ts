import type { Club } from "../models/clubs";

export const clubs: Club[] = [
    {
        id: "ieee-cs",
        title: "IEEE Computer Society",
        description: "La rama estudiantil de IEEE Computer Society enfocada en el desarrollo de software, inteligencia artificial y nuevas tecnologías.",
        logo: "/images/clubs/ieee-cs.png",
        contact: "3101234567",
        email: "ieee-cs@universidad.edu.co",
        location: "Edificio de Ingeniería, Sala 305",
        meetingSchedule: "Martes y Jueves, 5:00 PM - 7:00 PM",
        tags: ["tecnología", "programación", "inteligencia artificial"],
        events: [
            {
                title: "Introducción a la Inteligencia Artificial",
                description: "Taller práctico sobre fundamentos de IA usando Python y TensorFlow.",
                date: "2023-12-15T17:00:00",
                location: "Auditorio Principal"
            },
            {
                title: "Hackathon Semestral",
                description: "Competencia de desarrollo de 48 horas con premios para los mejores proyectos.",
                date: "2024-02-20T09:00:00",
                location: "Laboratorio de Computación"
            },
            {
                title: "Charla: Carreras en Tecnología",
                description: "Invitados de la industria hablan sobre oportunidades laborales en el sector tech.",
                date: "2023-11-10T15:00:00",
                location: "Sala 201"
            }
        ],
        members: [
            {
                name: "Ana Martínez",
                role: "Presidenta",
                avatar: "/images/members/ana.jpg"
            },
            {
                name: "Carlos Rodríguez",
                role: "Vicepresidente",
                avatar: "/images/members/carlos.jpg"
            },
            {
                name: "Sofía Gómez",
                role: "Tesorera",
                avatar: "/images/members/sofia.jpg"
            },
            {
                name: "Diego López",
                role: "Secretario",
                avatar: "/images/members/diego.jpg"
            },
            {
                name: "Valentina Torres",
                role: "Coordinadora de Eventos",
                avatar: "/images/members/valentina.jpg"
            }
        ]
    },
    {
        id: "1",
        title: "Robotics Club",
        description: "El club de robótica es un espacio para estudiantes interesados en el diseño, construcción y programación de robots. Nuestro objetivo es fomentar la creatividad y el pensamiento crítico.",
        logo: "https://example.com/robotics.png",
        contact: "573142968933",
        tags: ["robótica", "ingeniería", "innovación"],
    },
    {
        id: "2",
        title: "Environmental Club",
        description: "El club de medio ambiente es un grupo de estudiantes comprometidos con la protección del medio ambiente. Nuestro objetivo es promover la conciencia y el cambio positivo.",
        logo: "https://example.com/environment.png",
        contact: "573142968934",
        tags: ["medio ambiente", "sostenibilidad", "ecología"],
    }
]