import { IMessage } from "../model/message.model.interface";
import { IBaseRepository } from "./base.repository.interface";

export interface IMessageRepository extends IBaseRepository<IMessage>{
  createMessage(data: Partial<IMessage>): Promise<IMessage>;
  findByChatId(
    chatId: string,
    limit: number,
    skip: number
  ): Promise<IMessage[]>;
  markMessagesAsRead(chatId: string, userId: string): Promise<void>;
}
