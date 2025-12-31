import { responsePart } from "../../dto/shared/responsePart";

export interface IAddBalanceInput {
  userId: string;
  role: "User" | "Worker" | "Admin";
  amount: number;
  description?: string;
}
export interface IWalletService{
    addBalance(data: IAddBalanceInput): Promise<responsePart>;
}