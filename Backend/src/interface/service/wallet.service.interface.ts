export interface IAddBalanceInput {
  userId: string;
  role: "User" | "Worker" | "Admin";
  amount: number;
  description?: string;
}
export interface IWalletService{
    addBalance(data: IAddBalanceInput): Promise<{success:boolean,message:string}>;
}