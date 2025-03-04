import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import type { QuerySnapshot, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getUserData, logout } from '../services/auth';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
}

interface ChatProps {
  channelId: string;
}

export default function Chat({ channelId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userData, setUserData] = useState<{ email: string; name: string; picture: string } | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      const data = await getUserData();
      if (!data) {
        logout();
        return;
      }
      setUserData(data);
    };

    loadUserData();
  }, []);

  useEffect(() => {
    if (!userData) return;

    const messagesRef = collection(db, 'canales', channelId, 'chat');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const newMessages = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })) as Message[];
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [channelId, userData]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userData) return;

    try {
      await addDoc(collection(db, 'canales', channelId, 'chat'), {
        text: newMessage,
        sender: userData.email,
        timestamp: serverTimestamp()
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  if (!userData) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === userData.email ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === userData.email
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p className="text-sm font-semibold mb-1">{message.sender}</p>
              <p>{message.text}</p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
} 