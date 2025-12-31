
import { IWalletTransaction } from "../model/wallet-transactions.modal.interface";
import { IBaseRepository } from "./base.repository.interface";


export interface IWalletTransactionRepository extends IBaseRepository<IWalletTransaction> {
  createTransaction(data: Partial<IWalletTransaction>): Promise<IWalletTransaction>;
  findById(id: string): Promise<IWalletTransaction | null>;
  findByWalletId(walletId: string): Promise<IWalletTransaction[]>;
  findLatestTransaction(walletId: string): Promise<IWalletTransaction | null>;
  findByType(walletId: string, type: string): Promise<IWalletTransaction[]>;
  deleteTransaction(id: string): Promise<IWalletTransaction | null>;
}