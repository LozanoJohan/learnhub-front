import type { APIRoute } from 'astro';
import { getChannelsByClubId, createChannel } from '../../../../services/channelService';
import { getUserFromRequest } from '../../../../middleware/auth';
import type { Channel } from '../../../../models/channels';

/**
 * Endpoint para obtener o crear un canal para un club específico
 * Si el canal ya existe, lo devuelve
 * Si no existe, crea uno nuevo
 */
export const GET: APIRoute = async ({ params, request }) => {
  try {
    // Autenticación - Verificar si el usuario está autenticado
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'No autorizado. Debes iniciar sesión para acceder a este recurso.'
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    const clubId = params.clubId;
    
    if (!clubId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'ID de club no proporcionado'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Buscar canales existentes para el club
    const channels = await getChannelsByClubId(clubId);
    
    if (channels && channels.length > 0) {
      // Si ya existe un canal, lo devolvemos
      return new Response(
        JSON.stringify({
          success: true,
          channel: channels[0],
          isNew: false
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    } else {
      // Si no existe, creamos uno nuevo
      const newChannel: Omit<Channel, 'id'> = {
        name: `Chat de Club ${clubId}`,
        description: `Canal de chat para el club ${clubId}`,
        ownerId: user.email || 'system',
        type: 'public',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        clubId: clubId,
        tags: ['club']
      };
      
      const channel = await createChannel(newChannel);
      
      return new Response(
        JSON.stringify({
          success: true,
          channel,
          isNew: true
        }),
        {
          status: 201,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  } catch (error) {
    console.error(`Error al obtener/crear canal para el club ${params.clubId}:`, error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error al procesar la solicitud',
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