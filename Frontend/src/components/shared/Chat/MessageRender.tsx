
import type { Message } from "@/interface/shared/chat";
import { cn } from "@/lib/utils";

interface MessageRendererProps {
  message: Message;
  isOwn: boolean;
}

/**
 * Renders a message based on its type (TEXT, IMAGE, VIDEO, AUDIO)
 * Styles differently for sender vs receiver
 */
export function MessageRenderer({ message, isOwn }: MessageRendererProps) {
  const baseStyles = "max-w-xs px-4 py-2 rounded-lg break-words";
  const containerStyles = cn(
    baseStyles,
    isOwn
      ? "bg-blue-500 text-white rounded-br-none"
      : "bg-gray-200 text-gray-900 rounded-bl-none"
  );

  const formatTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <div
      className={cn(
        "flex gap-2 items-end",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      <div className={containerStyles}>
        {message.type === "TEXT" && (
          <p className="text-sm">{message.content}</p>
        )}

        {message.type === "IMAGE" && (
          <div className="flex flex-col gap-2">
            <img
              src={message.content || "/placeholder.svg"}
              alt="Shared image"
              className="max-w-xs h-auto rounded"
              loading="lazy"
            />
            {message.metadata?.fileName && (
              <p className="text-xs opacity-75">{message.metadata.fileName}</p>
            )}
          </div>
        )}

        {message.type === "VIDEO" && (
          <div className="flex flex-col gap-2">
            <video
              src={message.content}
              controls
              className="max-w-xs h-auto rounded"
            />
            {message.metadata?.fileName && (
              <p className="text-xs opacity-75">{message.metadata.fileName}</p>
            )}
          </div>
        )}

        {message.type === "AUDIO" && (
          <div className="flex flex-col gap-2">
            <audio src={message.content} controls className="max-w-xs" />
            {message.metadata?.fileName && (
              <p className="text-xs opacity-75">{message.metadata.fileName}</p>
            )}
          </div>
        )}

        <p className="text-xs mt-1 opacity-75">
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
