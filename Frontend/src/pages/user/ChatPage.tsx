import { useEffect, useState, useCallback } from "react";
import { ChatWindow } from "@/components/shared/Chat/ChatWindows";
import { MessageInput } from "@/components/shared/Chat/MessageInput";
import type { Message, SocketAuth } from "@/interface/shared/chat";
import { useSocketChat } from "@/hook/useSocketChat";
import { userService } from "@/services/userService";

interface UserChatPageProps {
  bookingId: string; // pass from route or parent
}

export default function UserChatPage({ bookingId }: UserChatPageProps) {
  // 🔐 replace with real auth later
  const currentUserId = "user-123";
  const currentUserName = "John Doe";
  const userType = "user" as const;

  const [chatId, setChatId] = useState<string>("");
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // 1️⃣ Load booking → get chatId
  useEffect(() => {
    const loadBooking = async () => {
      const res = await userService.getBookingDetails(bookingId);
      setChatId(res.data.chatId);
    };

    loadBooking();
  }, [bookingId]);

  // 2️⃣ Socket auth
  const auth: SocketAuth = {
    userId: currentUserId,
    userType,
  };

  const {
    isConnected,
    messages: socketMessages,
    sendMessage,
    addMessageToLocal,
  } = useSocketChat({
    auth,
    chatId,
  });

  // 3️⃣ Load chat history
  useEffect(() => {
    if (!chatId) return;

    const loadHistory = async () => {
      setIsLoadingHistory(true);
      const res = await fetchChatHistory(chatId, 50, 0);

      if (res.success) {
        setInitialMessages(res.data);
      }
      setIsLoadingHistory(false);
    };

    loadHistory();
  }, [chatId]);

  const allMessages = [...initialMessages, ...socketMessages];

  const handleSendMessage = useCallback(
    (message: Message) => {
      addMessageToLocal({ ...message, isOwn: true });
      sendMessage(message);
    },
    [addMessageToLocal, sendMessage]
  );

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <p className="font-semibold">Chat with Worker</p>
          <p className="text-xs text-gray-500">
            {isConnected ? "Connected" : "Connecting..."}
          </p>
        </div>

        {/* Messages */}
        <ChatWindow
          messages={allMessages}
          isLoading={isLoadingHistory}
          isEmpty={!allMessages.length}
          currentUserId={currentUserId}
        />

        {/* Input */}
        <MessageInput
          onSendMessage={handleSendMessage}
          onSendMedia={handleSendMessage}
          chatId={chatId}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          isConnected={isConnected}
        />
      </div>
    </div>
  );
}
