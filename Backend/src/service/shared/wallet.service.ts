import { inject, injectable } from "tsyringe";
import { TYPES } from "../../config/constants/types";
import { IWalletRepository } from "../../interface/repository/wallet.repository.interface";
import { IWalletTransactionRepository } from "../../interface/repository/wallet-transaction.repository.interface";
import { IAddBalanceInput, IWalletService } from "../../interface/service/wallet.service.interface";

@injectable()
export class WalletService implements IWalletService{
    constructor(
        @inject(TYPES.WalletRepository) private walletRepo:IWalletRepository,
        @inject(TYPES.WalletTransactionRepository) private walletTransaction:IWalletTransactionRepository
    ){}
    private async getOrCreateWallet(userId: string, role: "User" | "Worker" | "Admin") {
        
        let wallet = await this.walletRepo.findByUser(userId, role);

       
        if (!wallet) {
        wallet = await this.walletRepo.create({
            userId,
            role,
            balance: 0,
            isFrozen: false,
        });
        }

        return wallet;
    }
    async addBalance(data: IAddBalanceInput): Promise<{success:boolean,message:string}> {
        try {
            const { userId,role, amount, description } = data;
           
             const wallet = await this.getOrCreateWallet(userId, role);

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