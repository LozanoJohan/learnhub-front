import type { APIRoute } from 'astro';
import { getAuth, signInWithEmailAndPassword, type AuthError } from 'firebase/auth';
import { app } from '../../../lib/firebase';

const auth = getAuth(app);

interface LoginRequestBody {
  email: string;
  password: string;
}

export const POST = (async ({ request, cookies }) => {
  try {
    // Obtener datos del cuerpo de la solicitud
    const body = await request.json() as LoginRequestBody;
    const { email, password } = body;
    
    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Se requiere email y contraseña'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    console.log(`Intentando iniciar sesión con: ${email}`);
    
    try {
      // Intentar iniciar sesión con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log(`Inicio de sesión exitoso para: ${email}`);
      
      // Si el inicio de sesión es exitoso, establecer cookies
      const userData = {
        email: user.email || '',
        name: user.displayName || user.email?.split('@')[0] || '',
        picture: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email || '')}&background=random`,
      };
      
      // Establecer cookies con la información del usuario (24h de duración)
      cookies.set('userEmail', userData.email, { path: '/', maxAge: 60 * 60 * 24 });
      cookies.set('userName', userData.name, { path: '/', maxAge: 60 * 60 * 24 });
      cookies.set('userPicture', userData.picture, { path: '/', maxAge: 60 * 60 * 24 });
      
      return new Response(
        JSON.stringify({
          success: true,
          user: userData
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (authError) {
      console.error('Error de autenticación con Firebase:', authError);
      
      let errorMessage = 'Error al iniciar sesión';
      let errorCode = '';
      
      if (authError instanceof Error) {
        const firebaseError = authError as AuthError;
        errorCode = firebaseError.code || '';
        
        if (errorCode.includes('auth/invalid-credential') || errorCode.includes('auth/wrong-password')) {
          errorMessage = 'Credenciales incorrectas. Revisa tu email y contraseña.';
        } else if (errorCode.includes('auth/invalid-email')) {
          errorMessage = 'El formato de email no es válido.';
        } else if (errorCode.includes('auth/user-disabled')) {
          errorMessage = 'Este usuario ha sido deshabilitado.';
        } else if (errorCode.includes('auth/user-not-found')) {
          errorMessage = 'No existe una cuenta con este email.';
        } else if (errorCode.includes('auth/too-many-requests')) {
          errorMessage = 'Demasiados intentos fallidos. Intenta de nuevo más tarde.';
        }
      }
      
      return new Response(
        JSON.stringify({
          success: false,
          message: errorMessage,
          code: errorCode
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('Error general en el endpoint de login:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error interno del servidor'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}) as unknown as APIRoute; 