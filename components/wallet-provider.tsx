"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-provider"

interface Token {
  symbol: string
  name: string
  amount: number
  price: number
  change24h: number
  icon: string
  contractAddress?: string
}

interface Transaction {
  id: string
  type: "onramp" | "swap" | "send" | "receive"
  amount: number
  token: string
  timestamp: Date
  status: "completed" | "pending" | "failed"
  hash?: string
}

interface WalletContextType {
  tokens: Token[]
  transactions: Transaction[]
  totalBalance: number
  currency: "USD" | "VND"
  setCurrency: (currency: "USD" | "VND") => void
  formatCurrency: (amount: number) => string
  truncateAddress: (address: string) => string
  addTransaction: (transaction: Omit<Transaction, "id" | "timestamp">) => void
  updateTokenBalance: (symbol: string, newAmount: number) => void
  getTokenBySymbol: (symbol: string) => Token | undefined
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

const MOCK_TOKENS: Token[] = [
  {
    symbol: "SOL",
    name: "Solana",
    amount: 1.234,
    price: 98.45,
    change24h: 2.3,
    icon: "◎",
    contractAddress: "So11111111111111111111111111111111111111112",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    amount: 75.0,
    price: 1.0,
    change24h: 0.1,
    icon: "💵",
    contractAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
  {
    symbol: "USDT",
    name: "Tether",
    amount: 0.0,
    price: 1.0,
    change24h: -0.05,
    icon: "₮",
    contractAddress: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  },
  {
    symbol: "BONK",
    name: "Bonk",
    amount: 120000,
    price: 0.000012,
    change24h: 15.2,
    icon: "🐕",
    contractAddress: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  },
  {
    symbol: "XYZ",
    name: "XYZ Token",
    amount: 42.0,
    price: 0.85,
    change24h: -3.1,
    icon: "⚡",
    contractAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  },
]

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    type: "onramp",
    amount: 50,
    token: "USDC",
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    status: "completed",
    hash: "abc123...def456",
  },
  {
    id: "tx-2",
    type: "swap",
    amount: 0.5,
    token: "SOL",
    timestamp: new Date(Date.now() - 172800000), // 2 days ago
    status: "completed",
    hash: "ghi789...jkl012",
  },
]

export function WalletProvider({ children }: { children: ReactNode }) {
  const { userState, currency: authCurrency } = useAuth()
  const [currency, setCurrency] = useState<"USD" | "VND">("USD")
  const [tokens, setTokens] = useState<Token[]>(MOCK_TOKENS)
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS)

  // Sync currency with auth provider
  useEffect(() => {
    if (authCurrency) {
      setCurrency(authCurrency)
    }
  }, [authCurrency])

  const totalBalance = tokens.reduce((sum, token) => sum + token.amount * token.price, 0)

  const formatCurrency = (amount: number) => {
    if (currency === "VND") {
      return `₫${(amount * 27000).toLocaleString("vi-VN")}`
    }
    return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const truncateAddress = (address: string) => {
    if (address.length <= 10) return address
    return `${address.slice(0, 5)}...${address.slice(-3)}`
  }

  const addTransaction = (transaction: Omit<Transaction, "id" | "timestamp">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `tx-${Date.now()}`,
      timestamp: new Date(),
    }
    setTransactions((prev) => [newTransaction, ...prev])
  }

  const updateTokenBalance = (symbol: string, newAmount: number) => {
    setTokens((prev) => prev.map((token) => (token.symbol === symbol ? { ...token, amount: newAmount } : token)))
  }

  const getTokenBySymbol = (symbol: string) => {
    return tokens.find((token) => token.symbol === symbol)
  }

  return (
    <WalletContext.Provider
      value={{
        tokens,
        transactions,
        totalBalance,
        currency,
        setCurrency,
        formatCurrency,
        truncateAddress,
        addTransaction,
        updateTokenBalance,
        getTokenBySymbol,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
