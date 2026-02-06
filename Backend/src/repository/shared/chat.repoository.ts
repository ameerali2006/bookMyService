import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repository";
import { ChatModel } from "../../model/chat.model";
import { IChat } from "../../interface/model/chat.model.interface";
import { IChatRepository } from "../../interface/repository/chat.repository.interface";

@injectable()
export class ChatRepository
  extends BaseRepository<IChat>
  implements IChatRepository
{
  constructor() {
    super(ChatModel);
  }

  async createChat(data: Partial<IChat>): Promise<IChat> {
    return await ChatModel.create(data);
  }

  async findById(chatId: string): Promise<IChat | null> {
    return await ChatModel.findById(chatId);
  }

  async findByBookingId(bookingId: string): Promise<IChat | null> {
    return await ChatModel.findOne({ bookingId });
  }
}
