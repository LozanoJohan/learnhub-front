import type { APIRoute } from 'astro';
import { getAllChannels, createChannel } from '../../../services/channelService';
import type { Channel } from '../../../models/channels';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const clubId = url.searchParams.get('clubId');
    
    const channels = await getAllChannels();
    
    // Si se proporciona un clubId, filtrar canales por ese club
    const filteredChannels = clubId 
      ? channels.filter(channel => channel.clubId === clubId)
      : channels;
    
    return new Response(
      JSON.stringify({
        success: true,
        channels: filteredChannels,
        count: filteredChannels.length
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error al obtener canales:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error al obtener canales',
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

export const POST: APIRoute = async ({ request }) => {
  try {
    const channelData = await request.json() as Omit<Channel, 'id'>;
    
    // Validación básica
    if (!channelData.name || !channelData.ownerId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Datos incompletos. Se requiere al menos nombre y propietario'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    const newChannel = await createChannel(channelData);
    
    return new Response(
      JSON.stringify({
        success: true,
        channel: newChannel,
        message: 'Canal creado exitosamente'
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error al crear canal:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error al crear canal',
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