

import { cn } from "@/lib/utils";
import { MessageRenderer } from "./MessageRender";
import type { Message } from "@/interface/shared/chat";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showSenderName?: boolean;
}

/**
 * Wrapper component for a single message with optional sender info
 */
export function MessageBubble({
  message,
  isOwn,
  showSenderName = false,
}: MessageBubbleProps) {
  return (
    <div className={cn("flex mb-3", isOwn ? "justify-end" : "justify-start")}>
      <div>
        {showSenderName && message.senderName && !isOwn && (
          <p className="text-xs text-gray-600 mb-1 px-4">
            {message.senderName}
          </p>
        )}
        <MessageRenderer message={message} isOwn={isOwn} />
      </div>
    </div>
  );
}
