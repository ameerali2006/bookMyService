import { inject, injectable } from "tsyringe";
import { TYPES } from "../../config/constants/types";
import { IWalletRepository } from "../../interface/repository/wallet.repository.interface";
import { IWalletTransactionRepository } from "../../interface/repository/walletTransaction.repository.interface";
import { IAddBalanceInput, IWalletService } from "../../interface/service/wallet.service.interface";

@injectable()
export class WalletService implements IWalletService{
    constructor(
        @inject(TYPES.WalletRepository) private walletRepo:IWalletRepository,
        @inject(TYPES.WalletTransactionRepository) private walletTransaction:IWalletTransactionRepository
    ){}
    async addBalance(data: IAddBalanceInput): Promise<{success:boolean,message:string}> {
        try {
            const { userId, amount, description } = data;
            const wallet =
            (await this.walletRepo.findByUser(userId, "User")) ||
            (await this.walletRepo.findByUser(userId, "Worker")) ||
            (await this.walletRepo.findByUser(userId, "Admin"));

            if (!wallet) return {success:false,message:"Wallet not found"}

            if (wallet.isFrozen) return {success:false,message:"Wallet is frozen"}

            const balanceBefore = wallet.balance;
            const balanceAfter = wallet.balance + amount;

            
            const transactionPayload = {
                walletId: wallet._id.toString(),
                type: "REFUND",
                amount,
                direction: "CREDIT",
                balanceBefore,
                balanceAfter,
                description: description || "Balance credited",
                status: "SUCCESS",
            } as const;

           
            await Promise.all([
                this.walletRepo.updateBalance(wallet._id.toString(), balanceAfter),
                this.walletTransaction.createTransaction(transactionPayload),
            ]);

            return { success: true, message: "Balance credited successfully" };
        } catch (error) {
            return {success:false,message:"Something went wrong"}
        }
    }
    
}