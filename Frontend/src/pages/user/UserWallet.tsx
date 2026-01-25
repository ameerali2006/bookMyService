import { userService } from "@/api/UserService"
import { WalletPage, type Wallet, type WalletTransaction } from "@/components/shared/Wallet/WalletPage"
import userAxios from "@/config/axiosSevice/UserAxios"
import type { WalletTransactionQuery, WalletTransactionResponse } from "@/interface/shared/wallet"
import { useEffect, useState } from "react"


// Mock data - Replace with real API calls
const mockWallet: Wallet = {
  balance: 2500.75,
  isFrozen: false,
  lastActivityAt: new Date("2024-01-15T10:30:00"),
  role: "User",
}

const mockTransactions: WalletTransaction[] = [
  {
    id: "1",
    type: "TOPUP",
    direction: "CREDIT",
    amount: 500.0,
    balanceBefore: 2000.75,
    balanceAfter: 2500.75,
    status: "SUCCESS",
    createdAt: new Date("2024-01-15T10:30:00"),
    description: "Card payment",
  },
  {
    id: "2",
    type: "HOLD",
    direction: "DEBIT",
    amount: 150.0,
    balanceBefore: 2150.75,
    balanceAfter: 2000.75,
    status: "PENDING",
    createdAt: new Date("2024-01-14T14:20:00"),
    description: "Service booking hold",
  },
  {
    id: "3",
    type: "COMMISSION",
    direction: "CREDIT",
    amount: 75.5,
    balanceBefore: 2075.25,
    balanceAfter: 2150.75,
    status: "SUCCESS",
    createdAt: new Date("2024-01-13T09:15:00"),
    description: "Commission from referral",
  },
  {
    id: "4",
    type: "REFUND",
    direction: "CREDIT",
    amount: 100.0,
    balanceBefore: 1975.25,
    balanceAfter: 2075.25,
    status: "SUCCESS",
    createdAt: new Date("2024-01-12T16:45:00"),
    description: "Booking cancellation refund",
  },
  {
    id: "5",
    type: "PENALTY",
    direction: "DEBIT",
    amount: 25.0,
    balanceBefore: 2000.25,
    balanceAfter: 1975.25,
    status: "SUCCESS",
    createdAt: new Date("2024-01-10T11:00:00"),
    description: "Late cancellation fee",
  },
  {
    id: "6",
    type: "ADJUSTMENT",
    direction: "CREDIT",
    amount: 50.0,
    balanceBefore: 1950.25,
    balanceAfter: 2000.25,
    status: "SUCCESS",
    createdAt: new Date("2024-01-08T13:30:00"),
    description: "Admin adjustment - correction",
  },
  {
    id: "7",
    type: "TOPUP",
    direction: "CREDIT",
    amount: 300.0,
    balanceBefore: 1650.25,
    balanceAfter: 1950.25,
    status: "FAILED",
    createdAt: new Date("2024-01-05T10:00:00"),
    description: "Bank transfer",
  },
]

export const metadata = {
  title: "Wallet - Service Booking App",
  description: "Manage your wallet and view transaction history",
}

 export default function UserWallet() {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [loading, setLoading] = useState(true)
    useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await userService.userWalletData()
        console.log(res.data)
        setWallet(res.data.data)
      } catch (err) {
        console.error("Failed to load wallet", err)
      } finally {
        setLoading(false)
      }
    }

    fetchWallet()
  }, [])

  const fetchUserTransactions = async (
    query: WalletTransactionQuery
  ): Promise<WalletTransactionResponse> => {
    const res = await userService.getUserTransactions(query)
    console.log(res.data.data)
    return res.data.data
  }

  if (loading || !wallet) {
    return <div className="p-8">Loading wallet...</div>
  }
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">    
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Wallet Management</h1>
          <p className="mt-2 text-muted-foreground">Manage your funds and view your transaction history</p>
        </div>      
        <WalletPage role={"User"} wallet={wallet} fetchTransactions={fetchUserTransactions} />
      </div>
    </main>
  )
}