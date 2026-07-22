import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';

const MessagesContext = createContext(null);

const STORAGE_KEY = 'dariuni_messages';

const loadMessages = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const conversationId = (userIdA, userIdB) => [userIdA, userIdB].sort((a, b) => a - b).join('-');

export function MessagesProvider({ children }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState(loadMessages);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const sendMessage = (receiverId, content) => {
    if (!user || !content.trim()) return;
    const newMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      conversationId: conversationId(user.id, receiverId),
      senderId: user.id,
      receiverId,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    setMessages(current => [...current, newMessage]);
  };

  const getMessagesWith = otherUserId => {
    if (!user) return [];
    const cid = conversationId(user.id, otherUserId);
    return messages
      .filter(message => message.conversationId === cid)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  };

  const markConversationRead = otherUserId => {
    if (!user) return;
    const cid = conversationId(user.id, otherUserId);
    setMessages(current =>
      current.map(message =>
        message.conversationId === cid && message.receiverId === user.id && !message.read
          ? { ...message, read: true }
          : message
      )
    );
  };

  const getConversations = () => {
    if (!user) return [];
    const otherUserIds = new Set();
    messages.forEach(message => {
      if (message.senderId === user.id) otherUserIds.add(message.receiverId);
      if (message.receiverId === user.id) otherUserIds.add(message.senderId);
    });

    return Array.from(otherUserIds)
      .map(otherId => {
        const thread = getMessagesWith(otherId);
        const lastMessage = thread[thread.length - 1];
        const unread = thread.filter(m => m.receiverId === user.id && !m.read).length;
        return { otherId, lastMessage, unread };
      })
      .sort((a, b) => new Date(b.lastMessage?.createdAt || 0) - new Date(a.lastMessage?.createdAt || 0));
  };

  const unreadTotal = useMemo(() => {
    if (!user) return 0;
    return messages.filter(message => message.receiverId === user.id && !message.read).length;
  }, [messages, user]);

  //changes:

  const value = useMemo(
    () => ({ sendMessage, getMessagesWith, getConversations, markConversationRead, unreadTotal }),
    [messages, user, unreadTotal,sendMessage,getMessagesWith,getConversations,markConversationRead,]
  );

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}

export function useMessages() {
  return useContext(MessagesContext);
}