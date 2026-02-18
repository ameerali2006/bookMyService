"use client";

import { useEffect, useRef } from "react";


import { cn } from "@/lib/utils";
import { MessageBubble } from "./MessageBubble";
import type { Message } from "@/interface/shared/chat";

interface ChatWindowProps {
  messages: Message[];
  isLoading?: boolean;
  isEmpty?: boolean;
  currentUserId: string;
  showSenderNames?: boolean;
  className?: string;
}

/**
 * Chat window component that displays a list of messages
 * Auto-scrolls to the latest message
 */
export function ChatWindow({
  messages,
  isLoading = false,
  isEmpty = false,
  currentUserId,
  showSenderNames = false,
  className,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  console.log("isOwner:",messages)
  console.log()

  return (
    <div
      className={cn(
        "flex flex-col flex-1 overflow-y-auto bg-white",
        className
      )}
    >
      {isLoading && (
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Loading messages...</div>
        </div>
      )}

      {isEmpty && !isLoading && (
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-400 text-center">
            <p>No messages yet</p>
            <p className="text-sm mt-1">Start a conversation!</p>
          </div>
        </div>
      )}
      
      {messages.length > 0 && (
        <div className="flex flex-col p-4 gap-2">
          {messages.map((message) => (
            <>
            {console.log("iddddd",message.senderId,currentUserId)}
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderId==currentUserId}
              showSenderName={showSenderNames}
            /></>
          ))
          
          }
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
