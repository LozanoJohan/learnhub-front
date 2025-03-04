import type { APIRoute } from 'astro';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../../../lib/firebase';

const auth = getAuth(app);

export const POST = (async ({ cookies }) => {
  try {
    // Intentar cerrar sesión en Firebase
    await signOut(auth);
    
    // Eliminar cookies de sesión
    cookies.delete('userEmail', { path: '/' });
    cookies.delete('userName', { path: '/' });
    cookies.delete('userPicture', { path: '/' });
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Sesión cerrada correctamente'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error al cerrar sesión'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}) as unknown as APIRoute;

export const GET = (async ({ cookies, redirect }) => {
  try {
    // Intentar cerrar sesión en Firebase
    await signOut(auth);
    
    // Eliminar cookies de sesión
    cookies.delete('userEmail', { path: '/' });
    cookies.delete('userName', { path: '/' });
    cookies.delete('userPicture', { path: '/' });
    
    // Redirigir a la página de inicio de sesión
    return redirect('/login');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return redirect('/login?error=logout');
  }
}) as unknown as APIRoute; 