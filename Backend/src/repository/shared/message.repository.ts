import { injectable } from "tsyringe";

import { IMessage, IMessagePopulated } from "../../interface/model/message.model.interface";
import { BaseRepository } from "./base.repository";
import { MessageModel } from "../../model/message.model";
import { IMessageRepository } from "../../interface/repository/message.repoository.interface";

@injectable()
export class MessageRepository
  extends BaseRepository<IMessage>
  implements IMessageRepository
{
  constructor() {
    super(MessageModel);
  }

  async createMessage(data: Partial<IMessage>): Promise<IMessage> {
    return await MessageModel.create({
      ...data,
      readBy: data.senderId ? [data.senderId] : [],
    });
  }

  async findByChatId(
    chatId: string,
    limit = 50,
    skip = 0
  ): Promise<IMessagePopulated[]> {
    return await MessageModel.find({ chatId })
      .sort({ createdAt: 1 }) // oldest → newest
      .skip(skip)
      .limit(limit)
      .populate("senderId chatId")   // 👈 populate here
    .lean<IMessagePopulated[]>();
  }

  async markMessagesAsRead(
    chatId: string,
    userId: string
  ): Promise<void> {
    await MessageModel.updateMany(
      { chatId, readBy: { $ne: userId } },
      { $addToSet: { readBy: userId } }
    );
  }
}
