import type { APIRoute } from 'astro';
import { getChannelById, updateChannel, deleteChannel } from '../../../services/channelService';

export const GET: APIRoute = async ({ params }) => {
  try {
    const channelId = params.id;
    
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
    
    const channel = await getChannelById(channelId);
    
    if (!channel) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `Canal con ID ${channelId} no encontrado`
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        channel
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error al obtener canal:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error al obtener canal',
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

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const channelId = params.id;
    
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
    
    // Verificar si el canal existe
    const existingChannel = await getChannelById(channelId);
    
    if (!existingChannel) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `Canal con ID ${channelId} no encontrado`
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    const updateData = await request.json();
    
    await updateChannel(channelId, updateData);
    
    // Obtener el canal actualizado
    const updatedChannel = await getChannelById(channelId);
    
    return new Response(
      JSON.stringify({
        success: true,
        channel: updatedChannel,
        message: 'Canal actualizado exitosamente'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error al actualizar canal:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error al actualizar canal',
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

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const channelId = params.id;
    
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
    
    // Verificar si el canal existe
    const existingChannel = await getChannelById(channelId);
    
    if (!existingChannel) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `Canal con ID ${channelId} no encontrado`
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    await deleteChannel(channelId);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Canal eliminado exitosamente'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error al eliminar canal:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error al eliminar canal',
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