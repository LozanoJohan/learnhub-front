const BACKEND_URL = 'http://localhost:8080';

export interface UserData {
  email: string;
  name: string;
  picture: string;
}

export async function getUserData(): Promise<UserData | null> {
  try {
    const response = await fetch(`${BACKEND_URL}/session/dataUser`, {
      credentials: 'include'
    });
    
    if (!response.ok) {
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

export async function validateToken(): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_URL}/session/user`, {
      credentials: 'include'
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

export function logout() {
  window.location.href = `${BACKEND_URL}/logout`;
} 