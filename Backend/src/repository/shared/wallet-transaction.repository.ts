// src/repository/implementation/wallet-transaction.repository.ts
import { injectable } from "inversify";

import { BaseRepository } from "./base.repository";

import { IWalletTransactionRepository } from "../../interface/repository/wallet-transaction.repository.interface";
import { IWalletTransaction } from "../../interface/model/wallet-transactions.modal.interface";
import { WalletTransactionModel } from "../../model/transactions.model";

@injectable()
export class WalletTransactionRepository
  extends BaseRepository<IWalletTransaction>
  implements IWalletTransactionRepository
{
  constructor() {
    super(WalletTransactionModel);
  }

  async createTransaction(data: Partial<IWalletTransaction>): Promise<IWalletTransaction> {
    return await WalletTransactionModel.create(data);
  }

  async findById(id: string): Promise<IWalletTransaction | null> {
    return await WalletTransactionModel.findById(id)
      .populate("walletId")
      .exec();
  }

  async findByWalletId(walletId: string): Promise<IWalletTransaction[]> {
    return await WalletTransactionModel.find({ walletId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findLatestTransaction(walletId: string): Promise<IWalletTransaction | null> {
    return await WalletTransactionModel.findOne({ walletId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByType(walletId: string, type: string): Promise<IWalletTransaction[]> {
    return await WalletTransactionModel.find({ walletId, type })
      .sort({ createdAt: -1 })
      .exec();
  }

  async deleteTransaction(id: string): Promise<IWalletTransaction | null> {
    return await WalletTransactionModel.findByIdAndDelete(id);
  }
}
