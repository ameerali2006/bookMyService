"use client";

import { useState } from "react";
import { InboxList } from "@/components/shared/Chat/InboxList";
import { ChatWindow } from "@/components/shared/Chat/ChatWindows";
import { MessageInput } from "@/components/shared/Chat/MessageInput";
import { useSocketChat } from "@/hook/useSocketChat";
import type { SocketAuth, Message } from "@/interface/shared/chat";
import { WorkerLayout } from "@/components/worker/Dashboard/WorkerLayout"
import { Navbar } from "@/components/worker/Dashboard/WorkerNavbar"

export default function WorkerMessagesPage() {
  const workerId = "worker-123"; // from auth
  const workerName = "Worker Name";

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const auth: SocketAuth = {
    userId: workerId,
    userType: "worker",
  };

  const socketData = selectedChatId
    ? useSocketChat({ auth, chatId: selectedChatId })
    : null;

  const messages = socketData?.messages ?? [];
  const isConnected = socketData?.isConnected ?? false;
  const sendMessage = socketData?.sendMessage;

  const handleSendMessage = (message: Message) => {
    sendMessage?.(message);
  };

  return (
      <WorkerLayout>
      <Navbar />

      <div className="min-h-screen bg-background">
      <div className="flex h-[calc(100vh-64px)] bg-white">
        {/* LEFT — USERS LIST */}
        <div className="w-60 border-r">
          <InboxList
            userId={workerId}
            role="worker" // 👈 important
            selectedChatId={selectedChatId ?? undefined}
            onSelectChat={setSelectedChatId}
          />
        </div>

        {/* RIGHT — CHAT */}
        <div className="flex-1 flex flex-col">
          {selectedChatId ? (
            <>
              {/* Header */}
              <div className="p-4 border-b">
                <p className="font-semibold">Chat with User</p>
                <p className="text-xs text-gray-500">
                  {isConnected ? "Connected" : "Connecting..."}
                </p>
              </div>

              {/* Messages */}
              <ChatWindow
                messages={messages}
                currentUserId={workerId}
                showSenderNames
              />

              {/* Input */}
              <MessageInput
                onSendMessage={handleSendMessage}
                onSendMedia={handleSendMessage}
                chatId={selectedChatId}
                currentUserId={workerId}
                currentUserName={workerName}
                isConnected={isConnected}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a user to start chatting
            </div>
          )}
        </div>
      </div>
      </div>
    </WorkerLayout>
  );
}
