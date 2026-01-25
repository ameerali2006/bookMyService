import { responsePart } from "../../dto/shared/responsePart";
import { IWallet } from "../model/wallet.model.interface";

export interface IAddBalanceInput {
  userId: string;
  role: "user" | "worker" | "admin";
  amount: number;
  description?: string;
}
export interface IWalletService {
  addBalance(data: IAddBalanceInput): Promise<responsePart>;
  getWalletData(
    ownerId: string,
    role: "user" | "admin" | "worker",
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      balance: number;
      isFrozen: boolean;
      lastActivityAt: Date;
      role: "user" | "admin" | "worker";
    };
  }>;
  creditAdminWallet(paymentIntentId: string) :Promise<IWallet|null>
}
