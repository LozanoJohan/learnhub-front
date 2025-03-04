export interface Channel {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    imageUrl?: string;
    ownerId: string;
    members?: string[]; // IDs de usuarios miembros
    type: 'public' | 'private';
    tags?: string[];
    clubId?: string; // ID del club asociado al canal
}

export interface ChannelMessage {
    id: string;
    channelId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    attachments?: string[];
}

export interface ChannelMember {
    userId: string;
    channelId: string;
    role: 'admin' | 'moderator' | 'member';
    joinedAt: string;
}

export interface ChannelResponse {
    channel: Channel;
    success: boolean;
    message?: string;
}

export interface ChannelsResponse {
    channels: Channel[];
    count: number;
    success: boolean;
    message?: string;
}

export interface ChannelMessagesResponse {
    messages: ChannelMessage[];
    count: number;
    success: boolean;
    message?: string;
}

export interface ChannelMembersResponse {
    members: ChannelMember[];
    count: number;
    success: boolean;
    message?: string;
} 