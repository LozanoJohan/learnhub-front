import React, { useState, useEffect, useRef } from 'react';
import type { ChannelMessage } from '../../models/channels';

interface ClubChatProps {
  clubId: string;
  clubName?: string;
}

export default function ClubChat({ clubId, clubName = 'Club' }: ClubChatProps) {
  const [messages, setMessages] = useState<ChannelMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [channelId, setChannelId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Función para formatear fecha de forma sencilla
  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSecs < 60) return 'hace unos segundos';
      if (diffMins < 60) return `hace ${diffMins} min`;
      if (diffHours < 24) return `hace ${diffHours} hr`;
      if (diffDays < 7) return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
      
      return date.toLocaleDateString();
    } catch {
      return 'fecha desconocida';
    }
  };

  // Obtener/crear canal y verificar autenticación
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        
        // Obtener o crear canal de chat para el club mediante el nuevo endpoint de Astro
        const response = await fetch(`/api/channels/club/${clubId}`);
        
        if (!response.ok) {
          if (response.status === 401) {
            setIsAuthenticated(false);
            throw new Error('No estás autenticado');
          } else {
            throw new Error(`Error al cargar el canal: ${response.status}`);
          }
        }
        
        const data = await response.json();
        
        if (data.success) {
          setChannelId(data.channel.id);
          setIsAuthenticated(true);
          
          // Obtener el nombre de usuario de la cookie (ya gestionado por el servidor)
          const cookies = document.cookie.split(';');
          const userEmailCookie = cookies.find(cookie => cookie.trim().startsWith('userEmail='));
          
          if (userEmailCookie) {
            const userEmail = userEmailCookie.split('=')[1];
            setUserName(userEmail.split('@')[0] || 'Usuario');
          } else {
            setUserName('Usuario');
          }
        } else {
          throw new Error(data.message || 'Error al obtener el canal de chat');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error al inicializar chat:', error);
        if (error instanceof Error && error.message === 'No estás autenticado') {
          setIsAuthenticated(false);
          setError('Debes iniciar sesión para acceder al chat');
        } else {
          setError('Error al cargar el chat. Por favor, intenta nuevamente.');
        }
        setIsLoading(false);
      }
    };

    initializeChat();
  }, [clubId]);

  // Cargar mensajes
  useEffect(() => {
    if (!channelId) return;

    const fetchMessages = async () => {
      try {
        // Usar el nuevo endpoint de Astro para mensajes de canales
        const response = await fetch(`/api/channels/club-messages/${channelId}`);
        
        if (!response.ok) {
          throw new Error(`Error al cargar mensajes: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setMessages(data.messages);
        } else {
          throw new Error(data.message || 'Error al cargar mensajes');
        }
      } catch (error) {
        console.error('Error al cargar mensajes:', error);
        setError('No se pudieron cargar los mensajes');
      }
    };

    // Cargar mensajes iniciales
    fetchMessages();

    // Configurar un intervalo para actualizar mensajes cada 5 segundos
    const intervalId = setInterval(fetchMessages, 5000);
    
    return () => clearInterval(intervalId);
  }, [channelId]);

  // Desplazarse al último mensaje cuando se reciben nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !channelId || !isAuthenticated) return;

    try {
      // Optimistic UI update - Añadir el mensaje inmediatamente en la UI
      const optimisticMessage: ChannelMessage = {
        id: `temp-${Date.now()}`,
        channelId,
        userId: userName,
        userName: userName,
        userAvatar: '',
        content: newMessage.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, optimisticMessage]);
      setNewMessage('');
      
      // Enviar mensaje usando el nuevo endpoint (la autenticación se verifica en el servidor)
      const response = await fetch(`/api/channels/club-messages/${channelId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: newMessage.trim(),
          userName: userName
        })
      });

      if (!response.ok) {
        // Si falla, mostrar error y quitar el mensaje optimista
        setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
        throw new Error(`Error al enviar mensaje: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        // Si falla, mostrar error y quitar el mensaje optimista
        setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
        throw new Error(data.message || 'Error al enviar mensaje');
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setError('No se pudo enviar el mensaje');
      
      // Ocultar el error después de 3 segundos
      setTimeout(() => setError(null), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando chat...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px] border rounded-lg bg-white dark:bg-gray-800">
      <div className="bg-gray-100 dark:bg-gray-700 p-3 border-b border-gray-200 dark:border-gray-600 rounded-t-lg">
        <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          Chat de {clubName}
        </h3>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-2 mx-2 my-1 rounded">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <p>No hay mensajes aún. ¡Sé el primero en escribir!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.userName === userName ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.userName === userName
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">
                    {msg.userName === userName ? 'Tú' : msg.userName}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <div className="text-xs opacity-70 text-right mt-1">
                  {formatDate(msg.createdAt)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-3 border-t border-gray-200 dark:border-gray-600">
        {!isAuthenticated ? (
          <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-900 border rounded text-sm">
            <p className="text-yellow-700 dark:text-yellow-300">
              Debes <a href="/login" className="underline font-bold">iniciar sesión</a> para participar en el chat.
            </p>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={!isAuthenticated}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || !isAuthenticated}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
            >
              Enviar
            </button>
          </div>
        )}
      </form>
    </div>
  );
}