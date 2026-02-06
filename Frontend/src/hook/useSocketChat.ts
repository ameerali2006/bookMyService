'use client';

import { ENV } from "@/config/env/env";
import type { Message, SocketAuth } from "@/interface/shared/chat";
import { useEffect, useRef, useState, useCallback } from "react";
import io from "socket.io-client";

interface UseSocketChatOptions {
  auth: SocketAuth;
  chatId: string;
  onMessageReceived?: (message: Message) => void;
  onConnectionChange?: (connected: boolean) => void;
}

interface UseSocketChatReturn {
  socket: ReturnType<typeof io> | null;
  isConnected: boolean;
  sendMessage: (message: Message) => void;
  messages: Message[];
  addMessageToLocal: (message: Message) => void;
}


export function useSocketChat({
  auth,
  chatId,
  onMessageReceived,
  onConnectionChange,
}: UseSocketChatOptions): UseSocketChatReturn {

  // ✅ ONLY socket ref you need
  const socketRef = useRef<ReturnType<typeof io> | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const socketUrl = ENV.VITE_SERVER_BASEURL;

   

    const socket = io(socketUrl, {
      auth: {
        userId: auth.userId,
        userType: auth.userType,
      },
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      onConnectionChange?.(true);
      socket.emit("chat:join", { chatId });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      onConnectionChange?.(false);
    });

    socket.on("chat:receive", (message: Message) => {
      
      onMessageReceived?.(message);
    });

    socket.on("connect_error", (error: Error) => {
      console.error("[Socket] Connection error:", error.message);
      setIsConnected(true);
      onConnectionChange?.(true);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [auth, chatId, onMessageReceived, onConnectionChange]);

  const sendMessage = useCallback(
  (message: Message) => {
    socketRef.current?.emit("chat:send", {
      chatId,
      message: {
        type: message.type,
        content: message.content,
        metadata: message.metadata,
      },
    });
  },
  [chatId]
);


  const addMessageToLocal = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    sendMessage,
    messages,
    addMessageToLocal,
  };
}
