import type { APIRoute } from 'astro';
import { getChannelMessages, addChannelMessage } from '../../../../services/channelService';

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const channelId = params.channelId;
    
    if (!channelId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'ID de canal no proporcionado'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    const url = new URL(request.url);
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 50;
    
    const messages = await getChannelMessages(channelId, limit);
    
    return new Response(
      JSON.stringify({
        success: true,
        messages,
        count: messages.length,
        channelId
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error(`Error al obtener mensajes del canal ${params.channelId}:`, error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error al obtener mensajes',
        error: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};

export const POST: APIRoute = async ({ params, request }) => {
  try {
    const channelId = params.channelId;
    
    if (!channelId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'ID de canal no proporcionado'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    const messageData = await request.json();
    
    // Validación básica
    if (!messageData.content || !messageData.userId || !messageData.userName) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Datos incompletos. Se requiere al menos contenido, ID de usuario y nombre de usuario'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Asegurar que el channelId en la URL coincida con el del cuerpo
    const message = {
      ...messageData,
      channelId
    };
    
    const newMessage = await addChannelMessage(message);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: newMessage
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error(`Error al añadir mensaje al canal ${params.channelId}:`, error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error al añadir mensaje',
        error: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}; 