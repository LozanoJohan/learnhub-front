import { getUserDataFromFirebase, validateFirebaseToken } from '../lib/firebase-auth';

// Modelo de datos de usuario
export interface UserData {
  email: string;
  name: string;
  picture: string;
}

/**
 * Obtiene los datos del usuario actual
 * Primero intenta obtener los datos de Firebase, luego de las cookies
 */
export async function getUserData(): Promise<UserData | null> {
  try {
    // Primero intentar obtener datos de Firebase (si estamos en el cliente)
    if (typeof window !== 'undefined') {
      const firebaseUser = await getUserDataFromFirebase();
      if (firebaseUser) {
        return firebaseUser;
      }
      
      // Si no hay usuario en Firebase, intentar obtener de cookies
      const cookies = document.cookie.split(';').map(c => c.trim());
      const userEmailCookie = cookies.find(c => c.startsWith('userEmail='));
      const userNameCookie = cookies.find(c => c.startsWith('userName='));
      const userPictureCookie = cookies.find(c => c.startsWith('userPicture='));
      
      if (userEmailCookie) {
        const email = userEmailCookie.split('=')[1];
        const name = userNameCookie ? userNameCookie.split('=')[1] : email.split('@')[0];
        const picture = userPictureCookie ? userPictureCookie.split('=')[1] : '';
        
        return { email, name, picture };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    return null;
  }
}

/**
 * Valida el token de autenticación
 */
export async function validateToken(): Promise<boolean> {
  try {
    return await validateFirebaseToken();
  } catch (error) {
    console.error('Error al validar token:', error);
    return false;
  }
}

/**
 * Cierra la sesión del usuario
 */
export function logout() {
  window.location.href = '/api/auth/logout';
} 