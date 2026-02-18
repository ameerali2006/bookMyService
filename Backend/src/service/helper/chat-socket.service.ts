import type { Server as IOServer } from "socket.io";
import { inject, injectable } from "tsyringe";

import { ISocketHandler } from "../../interface/service/socket-handler.service.interface";
import { CustomSocket } from "../../types/socket";
import { TYPES } from "../../config/constants/types";

import { IChatRepository } from "../../interface/repository/chat.repository.interface";
import { IMessageRepository } from "../../interface/repository/message.repoository.interface";


@injectable()
export class ChatSocketHandler implements ISocketHandler {
  constructor(
    @inject(TYPES.ChatRepository)
    private _chatRepo: IChatRepository,

    @inject(TYPES.MessageRepository)
    private _messageRepo: IMessageRepository
  ) {}

  public registerEvents(
    io: IOServer,
    onlineUsers: Map<string, { socketId: string; userType: string }>
  ) {
    io.on("connection", (socket) => {
      const customSocket = socket as CustomSocket;

      /* ---------------- JOIN CHAT ---------------- */
      socket.on("chat:join", async ({ chatId }) => {
        console.log('dfdfdfdf meesdsge')

        const chat = await this._chatRepo.findById(chatId);
        if (!chat) return;

        // 🔐 SECURITY CHECK
        if (
          chat.userId.toString() !== customSocket.userId &&
          chat.workerId.toString() !== customSocket.userId
        ) {
          console.log("🚫 Unauthorized chat join attempt");
          socket.disconnect();
          return;
        }

        socket.join(chatId);
        console.log(
          `💬 ${customSocket.userType} ${customSocket.userId} joined chat ${chatId}`
        );
      });

      /* ---------------- SEND MESSAGE ---------------- */
      socket.on("chat:send", async ({ chatId, message }) => {
        const chat = await this._chatRepo.findById(chatId);
        if (!chat) return;

        // 🔐 SECURITY CHECK AGAIN
        if (
          chat.userId.toString() !== customSocket.userId &&
          chat.workerId.toString() !== customSocket.userId
        ) {
          return;
        }

        // 💾 SAVE MESSAGE
        const savedMessage = await this._messageRepo.create({
          chatId,
          senderId: customSocket.userId,
          role:customSocket.userType,
          type: message.type,
          content: message.content,
          metadata: message.metadata,
        });

        // 📡 EMIT TO BOTH SIDES
        io.to(chatId).emit("chat:receive", savedMessage);
      });
    });
  }
}
