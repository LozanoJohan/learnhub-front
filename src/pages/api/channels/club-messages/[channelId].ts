import type { APIRoute } from 'astro';
import { getUserFromRequest } from '../../../../middleware/auth';
import { getChannelMessages, addChannelMessage, getChannelById } from '../../../../services/channelService';
import type { ChannelMessage } from '../../../../models/channels';

// Endpoint para obtener mensajes
export const GET: APIRoute = async ({ params, request }) => {
  try {
    // Verificar autenticación
    const user = await getUserFromRequest(request);
    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'No autorizado. Debes iniciar sesión para acceder a este recurso.'
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const { channelId } = params;
    if (!channelId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'ID de canal no proporcionado'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Verificar que el canal existe
    const channel = await getChannelById(channelId);
    if (!channel) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Canal no encontrado'
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Obtener mensajes del canal
    const url = new URL(request.url);
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 50;
    
    const messages = await getChannelMessages(channelId, limit);
    
    return new Response(
      JSON.stringify({
        success: true,
        messages,
        count: messages.length
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error(`Error al obtener mensajes del canal ${params.channelId}:`, error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error al procesar la solicitud',
        error: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

// Endpoint para enviar mensajes
export const POST: APIRoute = async ({ params, request }) => {
  try {
    // Verificar autenticación
    const user = await getUserFromRequest(request);
    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'No autorizado. Debes iniciar sesión para enviar mensajes.'
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const { channelId } = params;
    if (!channelId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'ID de canal no proporcionado'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Verificar que el canal existe
    const channel = await getChannelById(channelId);
    if (!channel) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Canal no encontrado'
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Obtener datos del mensaje del cuerpo de la solicitud
    const messageData = await request.json();
    
    if (!messageData.content || !messageData.content.trim()) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'El contenido del mensaje no puede estar vacío'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Crear objeto de mensaje con datos del usuario autenticado
    const newMessage: Omit<ChannelMessage, 'id'> = {
      channelId,
      userId: user.email,
      userName: messageData.userName || user.email,
      userAvatar: messageData.userAvatar || '',
      content: messageData.content.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attachments: messageData.attachments || []
    };

    // Guardar mensaje en la base de datos
    const savedMessage = await addChannelMessage(newMessage);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: savedMessage
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error(`Error al enviar mensaje al canal ${params.channelId}:`, error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error al procesar la solicitud',
        error: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}; 