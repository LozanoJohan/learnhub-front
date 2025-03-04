import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Channel, ChannelMessage, ChannelMember } from '../models/channels';

// Colecciones de Firestore
const CHANNELS_COLLECTION = 'channels';
const MESSAGES_COLLECTION = 'channelMessages';
const MEMBERS_COLLECTION = 'channelMembers';

// Funciones para canales
export async function getAllChannels(): Promise<Channel[]> {
  try {
    const channelsCollection = collection(db, CHANNELS_COLLECTION);
    const channelsSnapshot = await getDocs(channelsCollection);
    return channelsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Channel));
  } catch (error) {
    console.error('Error al obtener canales:', error);
    throw error;
  }
}

export async function getPublicChannels(): Promise<Channel[]> {
  try {
    const channelsCollection = collection(db, CHANNELS_COLLECTION);
    const publicChannelsQuery = query(
      channelsCollection,
      where('type', '==', 'public'),
      orderBy('createdAt', 'desc')
    );
    const channelsSnapshot = await getDocs(publicChannelsQuery);
    return channelsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Channel));
  } catch (error) {
    console.error('Error al obtener canales públicos:', error);
    throw error;
  }
}

export async function getChannelById(channelId: string): Promise<Channel | null> {
  try {
    const channelDoc = doc(db, CHANNELS_COLLECTION, channelId);
    const channelSnapshot = await getDoc(channelDoc);
    
    if (!channelSnapshot.exists()) {
      return null;
    }
    
    return {
      id: channelSnapshot.id,
      ...channelSnapshot.data()
    } as Channel;
  } catch (error) {
    console.error(`Error al obtener canal con ID ${channelId}:`, error);
    throw error;
  }
}

export async function createChannel(channelData: Omit<Channel, 'id'>): Promise<Channel> {
  try {
    const channelsCollection = collection(db, CHANNELS_COLLECTION);
    const docRef = await addDoc(channelsCollection, {
      ...channelData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return {
      id: docRef.id,
      ...channelData
    } as Channel;
  } catch (error) {
    console.error('Error al crear canal:', error);
    throw error;
  }
}

export async function updateChannel(channelId: string, channelData: Partial<Channel>): Promise<void> {
  try {
    const channelDoc = doc(db, CHANNELS_COLLECTION, channelId);
    await updateDoc(channelDoc, {
      ...channelData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error al actualizar canal con ID ${channelId}:`, error);
    throw error;
  }
}

export async function deleteChannel(channelId: string): Promise<void> {
  try {
    const channelDoc = doc(db, CHANNELS_COLLECTION, channelId);
    await deleteDoc(channelDoc);
  } catch (error) {
    console.error(`Error al eliminar canal con ID ${channelId}:`, error);
    throw error;
  }
}

// Funciones para mensajes de canales
export async function getChannelMessages(channelId: string, limit = 50): Promise<ChannelMessage[]> {
  try {
    const messagesCollection = collection(db, MESSAGES_COLLECTION);
    const messagesQuery = query(
      messagesCollection,
      where('channelId', '==', channelId),
      orderBy('createdAt', 'desc'),
      limit(limit)
    );
    
    const messagesSnapshot = await getDocs(messagesQuery);
    return messagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ChannelMessage));
  } catch (error) {
    console.error(`Error al obtener mensajes para el canal ${channelId}:`, error);
    throw error;
  }
}

export async function addChannelMessage(messageData: Omit<ChannelMessage, 'id'>): Promise<ChannelMessage> {
  try {
    const messagesCollection = collection(db, MESSAGES_COLLECTION);
    const now = new Date().toISOString();
    
    const docRef = await addDoc(messagesCollection, {
      ...messageData,
      createdAt: now,
      updatedAt: now
    });
    
    return {
      id: docRef.id,
      ...messageData,
      createdAt: now,
      updatedAt: now
    };
  } catch (error) {
    console.error('Error al añadir mensaje al canal:', error);
    throw error;
  }
}

export async function deleteChannelMessage(messageId: string): Promise<void> {
  try {
    const messageDoc = doc(db, MESSAGES_COLLECTION, messageId);
    await deleteDoc(messageDoc);
  } catch (error) {
    console.error(`Error al eliminar mensaje con ID ${messageId}:`, error);
    throw error;
  }
}

// Funciones para miembros de canales
export async function getChannelMembers(channelId: string): Promise<ChannelMember[]> {
  try {
    const membersCollection = collection(db, MEMBERS_COLLECTION);
    const membersQuery = query(
      membersCollection,
      where('channelId', '==', channelId)
    );
    
    const membersSnapshot = await getDocs(membersQuery);
    return membersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as unknown as ChannelMember));
  } catch (error) {
    console.error(`Error al obtener miembros para el canal ${channelId}:`, error);
    throw error;
  }
}

export async function addChannelMember(memberData: ChannelMember): Promise<void> {
  try {
    const membersCollection = collection(db, MEMBERS_COLLECTION);
    await addDoc(membersCollection, {
      ...memberData,
      joinedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al añadir miembro al canal:', error);
    throw error;
  }
}

export async function removeChannelMember(channelId: string, userId: string): Promise<void> {
  try {
    const membersCollection = collection(db, MEMBERS_COLLECTION);
    const memberQuery = query(
      membersCollection,
      where('channelId', '==', channelId),
      where('userId', '==', userId)
    );
    
    const memberSnapshot = await getDocs(memberQuery);
    
    if (!memberSnapshot.empty) {
      await deleteDoc(doc(db, MEMBERS_COLLECTION, memberSnapshot.docs[0].id));
    }
  } catch (error) {
    console.error(`Error al eliminar miembro con ID ${userId} del canal ${channelId}:`, error);
    throw error;
  }
}

export async function updateChannelMemberRole(channelId: string, userId: string, role: 'admin' | 'moderator' | 'member'): Promise<void> {
  try {
    const membersCollection = collection(db, MEMBERS_COLLECTION);
    const memberQuery = query(
      membersCollection,
      where('channelId', '==', channelId),
      where('userId', '==', userId)
    );
    
    const memberSnapshot = await getDocs(memberQuery);
    
    if (!memberSnapshot.empty) {
      await updateDoc(
        doc(db, MEMBERS_COLLECTION, memberSnapshot.docs[0].id),
        { role }
      );
    }
  } catch (error) {
    console.error(`Error al actualizar rol del miembro ${userId} en el canal ${channelId}:`, error);
    throw error;
  }
}

// Nueva función para obtener canales por clubId
export async function getChannelsByClubId(clubId: string): Promise<Channel[]> {
  try {
    const channelsCollection = collection(db, CHANNELS_COLLECTION);
    const clubChannelsQuery = query(
      channelsCollection,
      where('clubId', '==', clubId),
      orderBy('createdAt', 'desc')
    );
    
    const channelsSnapshot = await getDocs(clubChannelsQuery);
    return channelsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Channel));
  } catch (error) {
    console.error(`Error al obtener canales para el club ${clubId}:`, error);
    throw error;
  }
} 