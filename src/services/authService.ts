import { API_BASE_URL } from '../config/constants';

export interface UserData {
  email: string;
  name: string;
  picture: string;
  token?: string;
}

// Obtener datos del usuario autenticado
export async function getUserData(): Promise<UserData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/session/dataUser`, {
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error('Error al obtener datos del usuario:', response.status);
      return null;
    }

    const data = await response.json();
    return {
      email: data.email,
      name: data.name,
      picture: data.picture
    };
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    return null;
  }
}

// Validar el token de autenticación
export async function validateToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/session/user`, {
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data['es valido?'] || false;
  } catch (error) {
    console.error('Error al validar token:', error);
    return false;
  }
}

// Mock del token para entorno de desarrollo
function getMockToken(): string {
  return 'mock-token-for-development-environment';
}

// Obtener el token para usar en peticiones
export async function getAuthToken(): Promise<string | null> {
  // Si estamos en desarrollo local, usamos un token mock para pruebas
  if (window.location.hostname === 'localhost') {
    console.log('Usando token mock para desarrollo local');
    return getMockToken();
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/session/user`, {
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data['token by google'] || null;
  } catch (error) {
    console.error('Error al obtener token:', error);
    // Si hay un error de CORS en desarrollo, devolvemos un token mock
    if (window.location.hostname === 'localhost') {
      console.log('Error de CORS en desarrollo, usando token mock');
      return getMockToken();
    }
    return null;
  }
}

// Cerrar sesión
export function logout() {
  window.location.href = `${API_BASE_URL}/logout`;
} 