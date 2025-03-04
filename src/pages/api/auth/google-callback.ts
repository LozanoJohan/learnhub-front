import type { APIRoute } from 'astro';

interface GoogleCallbackBody {
  email: string;
  name: string;
  picture: string;
}

export const POST = (async ({ request, cookies }) => {
  try {
    // Obtener datos del cuerpo de la solicitud
    const body = await request.json() as GoogleCallbackBody;
    const { email, name, picture } = body;
    
    if (!email) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Se requiere email en la respuesta de Google'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Validar que el correo sea institucional (opcional)
    // if (!email.endsWith('@unal.edu.co')) {
    //   return new Response(
    //     JSON.stringify({
    //       success: false,
    //       message: 'Debes usar un correo institucional de la UNAL'
    //     }),
    //     {
    //       status: 403,
    //       headers: { 'Content-Type': 'application/json' }
    //     }
    //   );
    // }
    
    // Establecer cookies con la información del usuario (24h de duración)
    cookies.set('userEmail', email, { path: '/', maxAge: 60 * 60 * 24 });
    cookies.set('userName', name, { path: '/', maxAge: 60 * 60 * 24 });
    cookies.set('userPicture', picture, { path: '/', maxAge: 60 * 60 * 24 });
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Autenticación con Google exitosa'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error en el callback de Google:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error al procesar la autenticación con Google'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}) as unknown as APIRoute; 