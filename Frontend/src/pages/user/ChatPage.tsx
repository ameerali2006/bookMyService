import { useEffect, useState, useCallback } from "react";
import { ChatWindow } from "@/components/shared/Chat/ChatWindows";
import { MessageInput } from "@/components/shared/Chat/MessageInput";
import type { Message, SocketAuth } from "@/interface/shared/chat";
import { useSocketChat } from "@/hook/useSocketChat";

import { useParams } from "react-router-dom";
import { userService } from "@/api/UserService";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import Header from "@/components/user/shared/Header";



export default function UserChatPage() {
  const user=useSelector((state:RootState)=>state.userTokenSlice.user)
  const currentUserId = user?._id;
  const currentUserName = user?.name;
  const userType = "User" as const;
  const { bookingId } = useParams<{ bookingId: string }>();
  console.log(user)


  const [chatId, setChatId] = useState<string>("");
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  
  useEffect(() => {
    const loadBooking = async () => {
      if(!bookingId)return
      const res = await userService.getChatId(bookingId);
      console.log(res.data)
      setChatId(res.data.chatId);

    };

    loadBooking();
  }, [bookingId]);
  
  if (!currentUserId) {
  return <div>Loading...</div>;
}

  const auth: SocketAuth = {
    userId: currentUserId,
    userType,
  };
  console.log("chatId",chatId)
  const {
    isConnected,
    messages: socketMessages,
    sendMessage,
    addMessageToLocal,
  } = useSocketChat({
    auth,
    chatId:chatId ?? "",
  });

  
  useEffect(() => {
    console.log(chatId)
    if (!chatId) return;

    const loadHistory = async () => {
      setIsLoadingHistory(true);
      const res = await userService.chatHistory(chatId, 50, 0);
      console.log(res.data)

      if (res.data.success) {
        setInitialMessages(res.data.messages);
      }
      setIsLoadingHistory(false);
    };

    loadHistory();
  }, [chatId]);

  const allMessages = [...initialMessages, ...socketMessages];

  const handleSendMessage = useCallback(
    (message: Message) => {
      // addMessageToLocal({ ...message, isOwn: true });
      sendMessage(message);
    },
    [addMessageToLocal, sendMessage]
  );

  return (
    
    <div className="flex h-screen bg-white">
       <Header />
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
