import type { APIRoute } from 'astro';
import { getChannelMembers, addChannelMember, removeChannelMember } from '../../../../services/channelService';
import type { ChannelMember } from '../../../../models/channels';

export const GET: APIRoute = async ({ params }) => {
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
    
    const members = await getChannelMembers(channelId);
    
    return new Response(
      JSON.stringify({
        success: true,
        members,
        count: members.length,
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
    console.error(`Error al obtener miembros del canal ${params.channelId}:`, error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error al obtener miembros',
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
    
    const memberData = await request.json();
    
    // Validación básica
    if (!memberData.userId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Datos incompletos. Se requiere al menos ID de usuario'
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
    const member: ChannelMember = {
      ...memberData,
      channelId,
      role: memberData.role || 'member',
      joinedAt: new Date().toISOString()
    };
    
    await addChannelMember(member);
    
    return new Response(
      JSON.stringify({
        success: true,
        member,
        message: 'Miembro añadido exitosamente'
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error(`Error al añadir miembro al canal ${params.channelId}:`, error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error al añadir miembro',
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

export const DELETE: APIRoute = async ({ params, request }) => {
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
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'ID de usuario no proporcionado'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    await removeChannelMember(channelId, userId);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Miembro eliminado exitosamente'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error(`Error al eliminar miembro del canal ${params.channelId}:`, error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error al eliminar miembro',
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