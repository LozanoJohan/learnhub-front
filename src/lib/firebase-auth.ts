import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import type { User } from "firebase/auth";
import { app } from './firebase';
import type { UserData } from '../services/auth';

// Inicializar Firebase Auth
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

// Proveedor para autenticación con Google
const googleProvider = new GoogleAuthProvider();

/**
 * Inicia sesión con correo electrónico y contraseña
 */
export async function loginWithEmail(email: string, password: string): Promise<UserData> {
  try {
    // Asegurarse de que la persistencia esté configurada
    await setPersistence(auth, browserLocalPersistence);
    
    // Iniciar sesión con Firebase
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Obtener token de usuario para verificación del servidor
    const token = await user.getIdToken();
    
    const userData = {
      email: user.email || '',
      name: user.displayName || user.email?.split('@')[0] || '',
      picture: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email || '')}&background=random`,
      token
    };
    
    return userData;
  } catch (error) {
    console.error('Error al iniciar sesión con email:', error);
    throw error;
  }
}

/**
 * Inicia sesión con Google
 */
export async function loginWithGoogle(): Promise<UserData> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    const userData = {
      email: user.email || '',
      name: user.displayName || user.email?.split('@')[0] || '',
      picture: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email || '')}&background=random`,
    };
    
    return userData;
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error);
    throw error;
  }
}

/**
 * Registra un nuevo usuario con correo electrónico y contraseña
 */
export async function registerWithEmail(email: string, password: string): Promise<UserData> {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    const userData = {
      email: user.email || '',
      name: user.displayName || user.email?.split('@')[0] || '',
      picture: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email || '')}&background=random`,
    };
    
    return userData;
  } catch (error) {
    console.error('Error al registrar usuario con email:', error);
    throw error;
  }
}

/**
 * Cierra la sesión del usuario actual
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
    // Limpiar cookies al cerrar sesión
    document.cookie = "userEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "userPicture=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
}

/**
 * Obtiene el usuario actual
 */
export function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

/**
 * Obtiene los datos del usuario actual
 */
export async function getUserDataFromFirebase(): Promise<UserData | null> {
  try {
    const user = await getCurrentUser();
    
    if (!user) return null;
    
    return {
      email: user.email || '',
      name: user.displayName || user.email?.split('@')[0] || '',
      picture: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email || '')}&background=random`,
    };
  } catch (error) {
    console.error('Error al obtener datos de usuario:', error);
    return null;
  }
}

/**
 * Valida si el token del usuario es válido
 */
export async function validateFirebaseToken(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    
    if (!user) return false;
    
    // Aquí podríamos agregar validaciones adicionales si es necesario
    return true;
  } catch (error) {
    console.error('Error al validar token:', error);
    return false;
  }
} 