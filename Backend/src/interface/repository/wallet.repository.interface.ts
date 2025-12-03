// src/interface/repository/wallet.repository.interface.ts
import { IWallet } from "../model/wallet.model.interface";

export interface IWalletRepository {
  createWallet(data: Partial<IWallet>): Promise<IWallet>;
  findById(id: string): Promise<IWallet | null>;
  findByUser(userId: string, role: string): Promise<IWallet | null>;
  updateBalance(id: string, balance: number): Promise<IWallet | null>;
  freezeWallet(id: string): Promise<IWallet | null>;
  unfreezeWallet(id: string): Promise<IWallet | null>;
  updateLastActivity(id: string): Promise<IWallet | null>;
  deleteWallet(id: string): Promise<IWallet | null>;
  findByRole(role: string): Promise<IWallet[]>;
}
