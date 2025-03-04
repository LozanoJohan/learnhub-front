import type { APIRoute } from 'astro';
import { getAuth, createUserWithEmailAndPassword, type AuthError } from 'firebase/auth';
import { app } from '../../../lib/firebase';

const auth = getAuth(app);

interface RegisterRequestBody {
  email: string;
  password: string;
}

export const POST = (async ({ request, cookies }) => {
  try {
    // Obtener datos del cuerpo de la solicitud
    const body = await request.json() as RegisterRequestBody;
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
    
    // Validar que la contraseña tenga al menos 6 caracteres
    if (password.length < 6) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'La contraseña debe tener al menos 6 caracteres'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    console.log(`Intentando registrar usuario: ${email}`);
    
    try {
      // Intentar registrar usuario con Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log(`Registro exitoso para: ${email}`);
      
      // Si el registro es exitoso, establecer cookies
      const userData = {
        email: user.email || '',
        name: user.displayName || email.split('@')[0] || '',
        picture: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=random`
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
          status: 201,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (authError) {
      console.error('Error de Firebase al registrar usuario:', authError);
      
      let errorMessage = 'Error al registrar usuario';
      let errorCode = '';
      
      if (authError instanceof Error) {
        const firebaseError = authError as AuthError;
        errorCode = firebaseError.code || '';
        
        if (errorCode.includes('auth/email-already-in-use')) {
          errorMessage = 'Este correo electrónico ya está registrado.';
        } else if (errorCode.includes('auth/invalid-email')) {
          errorMessage = 'El formato de email no es válido.';
        } else if (errorCode.includes('auth/weak-password')) {
          errorMessage = 'La contraseña es demasiado débil.';
        } else if (errorCode.includes('auth/network-request-failed')) {
          errorMessage = 'Error de red. Verifica tu conexión e intenta de nuevo.';
        }
      }
      
      return new Response(
        JSON.stringify({
          success: false,
          message: errorMessage,
          code: errorCode
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('Error general en el endpoint de registro:', error);
    
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