import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Fiat = 'USD' | 'VND';
export type TokenSym =
  | 'SOL'
  | 'USDC'
  | 'USDT'
  | 'BONK'
  | 'RAY'
  | 'JUP'
  | 'ORCA'
  | 'mSOL'
  | 'JitoSOL'
  | 'PYTH'
  | 'XYZ';
export type PaymentMethod = 'card' | 'applepay' | 'vnpay';
export type ActivityKind = 'onramp' | 'swap' | 'send' | 'deposit';

export interface TokenHolding {
  symbol: TokenSym;
  amount: number;
  priceUsd: number;
  change24hPct: number;
  mint: string;
  totalSupply?: number;
}

export interface Device {
  id: string;
  name: string;
  platform: 'iOS' | 'Android' | 'Web';
  lastActive: string;
  location?: string;
}

export interface AppCard {
  id: string;
  name: string;
  intro: string;
  category: 'DeFi' | 'Social' | 'Games' | 'Tools';
  tags: string[];
  image: string;
  website: string;
  verified?: boolean;
  rating?: number;
  installs?: string;
  updatedAt?: string;
  version?: string;
}

export interface Activity {
  id: string;
  kind: ActivityKind;
  ts: string;
  summary: string;
  amount?: number;
  token?: TokenSym;
  counterparty?: string;
  orderId?: string;
  status?: 'Success' | 'Failed' | 'Pending';
}

export interface WalletState {
  hasPasskey: boolean;
  hasWallet: boolean;
  pubkey?: string;
  fiat: Fiat;
  rateUsdToVnd: number;
  tokens: TokenHolding[];
  devices: Device[];
  apps: AppCard[];
  activity: Activity[];

  // Mutators
  setHasPasskey: (hasPasskey: boolean) => void;
  setHasWallet: (hasWallet: boolean) => void;
  setPubkey: (pubkey: string) => void;
  setFiat: (fiat: Fiat) => void;
  onrampFake: (
    amount: number,
    fiat: Fiat,
    token: TokenSym,
    orderId: string
  ) => void;
  swapFake: (fromToken: TokenSym, toToken: TokenSym, amount: number) => void;
  sendFake: (token: TokenSym, amount: number, recipient: string) => void;
  depositFake: (token: TokenSym, amount: number) => void;
  addDevice: (device: Device) => void;
  removeDevice: (deviceId: string) => void;
  addActivity: (activity: Activity) => void;
  resetDemoData: () => void;
}

// Sample seed data
const sampleTokens: TokenHolding[] = [
  {
    symbol: 'SOL',
    amount: 1.234,
    priceUsd: 95.5,
    change24hPct: 2.3,
    mint: 'So11111111111111111111111111111111111111112',
  },
  {
    symbol: 'USDC',
    amount: 75,
    priceUsd: 1.0,
    change24hPct: 0.1,
    mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  },
  {
    symbol: 'USDT',
    amount: 0,
    priceUsd: 1.0,
    change24hPct: -0.1,
    mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  },
  {
    symbol: 'BONK',
    amount: 120000,
    priceUsd: 0.000012,
    change24hPct: 5.2,
    mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  },
  {
    symbol: 'XYZ',
    amount: 42,
    priceUsd: 0.85,
    change24hPct: -1.8,
    mint: 'XYZ1234567890123456789012345678901234567890',
  },
];

const sampleDevices: Device[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    platform: 'iOS',
    lastActive: '2 hours ago',
    location: 'San Francisco, CA',
  },
  {
    id: '2',
    name: 'Pixel 8',
    platform: 'Android',
    lastActive: 'Yesterday',
    location: 'Ho Chi Minh City, VN',
  },
];

const sampleApps: AppCard[] = [
  {
    id: '1',
    name: 'SolPay Mini',
    intro: 'Fast and secure payments on Solana',
    category: 'DeFi',
    tags: ['Payments', 'Wallet'],
    image: '/placeholder.svg',
    website: 'https://solpay.com',
    verified: true,
  },
  {
    id: '2',
    name: 'Orbit Dex',
    intro: 'Decentralized exchange for Solana tokens',
    category: 'DeFi',
    tags: ['DEX', 'Trading'],
    image: '/placeholder.svg',
    website: 'https://orbitdex.com',
    verified: true,
  },
  {
    id: '3',
    name: 'Nova Games',
    intro: 'Play-to-earn gaming platform',
    category: 'Games',
    tags: ['Gaming', 'NFT'],
    image: '/placeholder.svg',
    website: 'https://novagames.com',
    verified: false,
  },
  {
    id: '4',
    name: 'RippleChat',
    intro: 'Decentralized social messaging',
    category: 'Social',
    tags: ['Chat', 'Social'],
    image: '/placeholder.svg',
    website: 'https://ripplechat.com',
    verified: true,
  },
  {
    id: '5',
    name: 'Keystone Tools',
    intro: 'Developer tools for Solana',
    category: 'Tools',
    tags: ['Developer', 'Tools'],
    image: '/placeholder.svg',
    website: 'https://keystonetools.com',
    verified: true,
  },
  {
    id: '6',
    name: 'Yield Farm Pro',
    intro: 'Maximize your DeFi yields',
    category: 'DeFi',
    tags: ['Yield', 'Farming'],
    image: '/placeholder.svg',
    website: 'https://yieldfarmpro.com',
    verified: false,
  },
  {
    id: '7',
    name: 'Solana Social',
    intro: 'Social network on Solana',
    category: 'Social',
    tags: ['Social', 'Network'],
    image: '/placeholder.svg',
    website: 'https://solanasocial.com',
    verified: true,
  },
  {
    id: '8',
    name: 'Crypto Quest',
    intro: 'Adventure RPG with crypto rewards',
    category: 'Games',
    tags: ['RPG', 'Adventure'],
    image: '/placeholder.svg',
    website: 'https://cryptoquest.com',
    verified: false,
  },
];

const sampleActivity: Activity[] = [
  {
    id: '1',
    kind: 'onramp',
    ts: '2024-01-15T10:30:00Z',
    summary: 'Bought 75 USDC with $75.00',
    amount: 75,
    token: 'USDC',
    orderId: 'ord_123456789',
  },
  {
    id: '2',
    kind: 'swap',
    ts: '2024-01-14T15:45:00Z',
    summary: 'Swapped 0.5 SOL for 47.5 USDC',
    amount: 0.5,
    token: 'SOL',
  },
  {
    id: '3',
    kind: 'send',
    ts: '2024-01-13T09:20:00Z',
    summary: 'Sent 10 USDC to 8x3A...kL9Z',
    amount: 10,
    token: 'USDC',
    counterparty: '8x3A...kL9Z',
  },
];

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      hasPasskey: false,
      hasWallet: false,
      pubkey: undefined,
      fiat: 'USD',
      rateUsdToVnd: 27000,
      tokens: sampleTokens,
      devices: sampleDevices,
      apps: sampleApps,
      activity: sampleActivity,

      setHasPasskey: (hasPasskey) => set({ hasPasskey }),
      setHasWallet: (hasWallet) => set({ hasWallet }),
      setPubkey: (pubkey) => set({ pubkey }),
      setFiat: (fiat) => set({ fiat }),

      onrampFake: (amount, fiat, token, orderId) => {
        const state = get();
        const tokenIndex = state.tokens.findIndex((t) => t.symbol === token);
        if (tokenIndex >= 0) {
          const newTokens = [...state.tokens];
          newTokens[tokenIndex] = {
            ...newTokens[tokenIndex],
            amount: newTokens[tokenIndex].amount + amount,
          };
          set({ tokens: newTokens });
        }

        const newActivity: Activity = {
          id: Date.now().toString(),
          kind: 'onramp',
          ts: new Date().toISOString(),
          summary: `Bought ${amount} ${token} with ${
            fiat === 'USD' ? '$' : '₫'
          }${amount.toFixed(2)}`,
          amount,
          token,
          orderId,
        };

        set({ activity: [newActivity, ...state.activity] });
      },

      swapFake: (fromToken, toToken, amount) => {
        const state = get();
        const fromIndex = state.tokens.findIndex((t) => t.symbol === fromToken);
        const toIndex = state.tokens.findIndex((t) => t.symbol === toToken);

        if (fromIndex >= 0 && toIndex >= 0) {
          const newTokens = [...state.tokens];
          newTokens[fromIndex] = {
            ...newTokens[fromIndex],
            amount: newTokens[fromIndex].amount - amount,
          };
          // Simulate swap rate (simplified)
          const swapAmount = amount * 0.95; // 5% slippage
          newTokens[toIndex] = {
            ...newTokens[toIndex],
            amount: newTokens[toIndex].amount + swapAmount,
          };
          set({ tokens: newTokens });
        }

        const newActivity: Activity = {
          id: Date.now().toString(),
          kind: 'swap',
          ts: new Date().toISOString(),
          summary: `Swapped ${amount} ${fromToken} for ${(
            amount * 0.95
          ).toFixed(2)} ${toToken}`,
          amount,
          token: fromToken,
        };

        set({ activity: [newActivity, ...state.activity] });
      },

      sendFake: (token, amount, recipient) => {
        const state = get();
        const tokenIndex = state.tokens.findIndex((t) => t.symbol === token);
        if (tokenIndex >= 0) {
          const newTokens = [...state.tokens];
          newTokens[tokenIndex] = {
            ...newTokens[tokenIndex],
            amount: newTokens[tokenIndex].amount - amount,
          };
          set({ tokens: newTokens });
        }

        const newActivity: Activity = {
          id: Date.now().toString(),
          kind: 'send',
          ts: new Date().toISOString(),
          summary: `Sent ${amount} ${token} to ${recipient.slice(
            0,
            4
          )}...${recipient.slice(-4)}`,
          amount,
          token,
          counterparty: recipient,
        };

        set({ activity: [newActivity, ...state.activity] });
      },

      depositFake: (token, amount) => {
        const state = get();
        const tokenIndex = state.tokens.findIndex((t) => t.symbol === token);
        if (tokenIndex >= 0) {
          const newTokens = [...state.tokens];
          newTokens[tokenIndex] = {
            ...newTokens[tokenIndex],
            amount: newTokens[tokenIndex].amount + amount,
          };
          set({ tokens: newTokens });
        }

        const newActivity: Activity = {
          id: Date.now().toString(),
          kind: 'deposit',
          ts: new Date().toISOString(),
          summary: `Deposited ${amount} ${token}`,
          amount,
          token,
        };

        set({ activity: [newActivity, ...state.activity] });
      },

      addDevice: (device) => {
        const state = get();
        set({ devices: [...state.devices, device] });
      },

      removeDevice: (deviceId) => {
        const state = get();
        set({ devices: state.devices.filter((d) => d.id !== deviceId) });
      },

      addActivity: (activity) => {
        const state = get();
        set({ activity: [activity, ...state.activity] });
      },

      resetDemoData: () => {
        set({
          hasPasskey: false,
          hasWallet: false,
          pubkey: undefined,
          fiat: 'USD',
          tokens: sampleTokens,
          devices: sampleDevices,
          apps: sampleApps,
          activity: sampleActivity,
        });
      },
    }),
    {
      name: 'lazorkit-wallet-storage',
    }
  )
);
