import type { Club } from '../models/clubs';
import { API_BASE_URL } from '../config/constants';
import { getAuthToken } from './authService';

// Datos de prueba para desarrollo local
const mockClubs: Club[] = [
    {
        id: 'club1',
        nombre: 'Club de Programación',
        area: 'Desarrollo de Software',
        capacity: 30,
        currentSize: 18,
        descripcion: 'Grupo de estudiantes interesados en aprender y practicar programación competitiva y desarrollo de software.'
    },
    {
        id: 'club2',
        nombre: 'Club de Robótica',
        area: 'Ingeniería',
        capacity: 25,
        currentSize: 15,
        descripcion: 'Espacio para entusiastas de la robótica y la automatización. Desarrollamos proyectos con Arduino, Raspberry Pi y más.'
    },
    {
        id: 'club3',
        nombre: 'Grupo de Estudio Matemáticas',
        area: 'Ciencias Exactas',
        capacity: 20,
        currentSize: 12,
        descripcion: 'Grupo dedicado a la resolución de problemas matemáticos y preparación para olimpiadas matemáticas.'
    },
    {
        id: 'club4',
        nombre: 'Club de Debate',
        area: 'Humanidades',
        capacity: 15,
        currentSize: 10,
        descripcion: 'Espacio para desarrollar habilidades de argumentación, oratoria y pensamiento crítico mediante debates estructurados.'
    }
];

// Función para filtrar clubs mock según la consulta
function filterMockClubs(query: string): Club[] {
    if (!query) return mockClubs;

    const normalizedQuery = query.toLowerCase();
    return mockClubs.filter(club =>
        club.nombre.toLowerCase().includes(normalizedQuery) ||
        club.area.toLowerCase().includes(normalizedQuery) ||
        club.descripcion.toLowerCase().includes(normalizedQuery)
    );
}

export async function getClubs(query: string): Promise<Club[]> {
    //   // Si estamos en desarrollo local, usar datos mock
    //   if (window.location.hostname === 'localhost') {
    //     console.log('Usando datos mock para clubs en desarrollo local');
    //     // Simulamos una petición asíncrona
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(filterMockClubs(query));
        }, 800); // Pequeño retraso para simular tiempo de carga
    });
    //   }

    try {
        // Intentar obtener el token de autenticación
        const token = await getAuthToken();

        console.log("token", token);

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'No-Access-Control-Allow-Origin': '*',
            'Accept': 'application/json'
        };

        // Agregar el token a los headers si está disponible
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/api/canales/search?q=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers,
            credentials: 'include',
            mode: 'cors'
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error en la respuesta: ${response.status} - ${errorText}`);
            throw new Error(`Error al buscar clubs: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching clubs:', error);
        return [];
    }
}

export async function getClubById(id: string): Promise<Club | null> {
    try {
        // Intentar obtener el token de autenticación
        const token = await getAuthToken();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'No-Access-Control-Allow-Origin': '*',
            'Accept': 'application/json'
        };

        // Agregar el token a los headers si está disponible
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/api/canales/${id}`, {
            method: 'GET',
            headers,
            credentials: 'include',
            mode: 'cors'
        });

        if (!response.ok) {
            // Si el club no se encuentra, revisamos si está en los datos mock
            if (response.status === 404) {
                const mockClub = mockClubs.find(club => club.id === id);
                if (mockClub) return mockClub;
            }
            
            const errorText = await response.text();
            console.error(`Error en la respuesta: ${response.status} - ${errorText}`);
            throw new Error(`Error al obtener club: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching club with id ${id}:`, error);
        
        // Para pruebas, devolver datos mock si está disponible
        const mockClub = mockClubs.find(club => club.id === id);
        return mockClub || null;
    }
} 