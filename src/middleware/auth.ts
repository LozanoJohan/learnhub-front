import type { APIRoute } from 'astro';
import { validateFirebaseToken } from '../lib/firebase-auth';
import { app } from '../lib/firebase';

export const onRequest = (async ({ cookies, redirect }) => {
  const userEmail = cookies.get('userEmail')?.value;

  if (!userEmail) {
    return redirect('/login');
  }

  const isValid = await validateFirebaseToken();
  if (!isValid) {
    cookies.delete('userEmail', { path: '/' });
    cookies.delete('userName', { path: '/' });
    cookies.delete('userPicture', { path: '/' });
    return redirect('/login');
  }

  return;
}) as unknown as APIRoute;

/**
 * Obtiene los datos del usuario a partir de la solicitud
 */
export async function getUserFromRequest(request: Request): Promise<{ email: string; name?: string; picture?: string } | null> {
  try {
    // Obtener cookies de la solicitud
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) return null;
    
    // Analizar las cookies
    const cookies = cookieHeader.split(';').map(c => c.trim());
    const userEmailCookie = cookies.find(c => c.startsWith('userEmail='));
    const userNameCookie = cookies.find(c => c.startsWith('userName='));
    const userPictureCookie = cookies.find(c => c.startsWith('userPicture='));
    
    if (!userEmailCookie) return null;
    
    // Extraer valores
    const email = userEmailCookie.split('=')[1];
    const name = userNameCookie ? userNameCookie.split('=')[1] : undefined;
    const picture = userPictureCookie ? userPictureCookie.split('=')[1] : undefined;
    
    // Verificar que el token de Firebase sea válido
    const isValid = await validateFirebaseToken();
    if (!isValid) return null;
    
    return { email, name, picture };
  } catch (error) {
    console.error('Error al obtener usuario de la solicitud:', error);
    return null;
  }
}

/**
 * Verifica si un usuario es miembro de un club
 */
export async function isClubMember(userEmail: string, clubId: string): Promise<boolean> {
  try {
    // Aquí implementaríamos la lógica para verificar si el usuario es miembro del club
    // Por ahora, retornamos true para pruebas
    return true;
  } catch (error) {
    console.error('Error al verificar membresía de club:', error);
    return false;
  }
} 