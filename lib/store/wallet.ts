import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ENV_CONFIG } from '@/lib/config/env';
import {
  Fiat,
  TokenSym,
  PaymentMethod,
  ActivityKind,
  TokenHolding,
  Device,
  AppCard,
  Activity,
} from '@/lib/mock-data/types';

// Re-export types for backward compatibility
export type {
  Fiat,
  TokenSym,
  PaymentMethod,
  ActivityKind,
  TokenHolding,
  Device,
  AppCard,
  Activity,
};
import { sampleTokens } from '@/lib/mock-data/tokens';
import { sampleDevices } from '@/lib/mock-data/devices';
import { sampleApps } from '@/lib/mock-data/apps';
import { sampleActivity } from '@/lib/mock-data/activity';

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
  // Derived selectors (stable lambdas preferred in components)
  getTokenAmount?: (symbol: TokenSym) => number;
  getPortfolioValueUsd?: () => number;
  hasAssets?: () => boolean;
  hasNoAssets?: () => boolean;
  getNumTokens?: () => number;
  getNumNonZeroTokens?: () => number;
  getTokenValueUsd?: (symbol: TokenSym) => number;
  getEffectivePriceUsd?: (symbol: TokenSym) => number;
  getVisibleTokens?: (hideZero: boolean) => TokenHolding[];

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

// Only use mock data if demo mode is enabled
const getInitialData = () => {
  if (ENV_CONFIG.ENABLE_DEMO) {
    return {
      pubkey: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', // Fake Solana pubkey for demo
      tokens: sampleTokens,
      devices: sampleDevices,
      apps: sampleApps,
      activity: sampleActivity,
    };
  }
  return {
    pubkey: undefined,
    tokens: [],
    devices: [],
    apps: [],
    activity: [],
  };
};

// Check if we need to clear localStorage due to environment change
const checkEnvironmentChange = () => {
  if (typeof window === 'undefined') return;

  const storageKey = 'lazorkit-wallet-storage';
  const envKey = 'lazorkit-env-config';
  const currentEnv = ENV_CONFIG.ENABLE_DEMO.toString();
  const storedEnv = localStorage.getItem(envKey);

  if (storedEnv && storedEnv !== currentEnv) {
    // Environment changed, clear the wallet storage
    localStorage.removeItem(storageKey);
    console.log('Environment changed, cleared wallet storage');
  }

  // Store current environment
  localStorage.setItem(envKey, currentEnv);
};

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => {
      // Check for environment changes and clear storage if needed
      checkEnvironmentChange();

      const initialData = getInitialData();
      return {
        hasPasskey: ENV_CONFIG.ENABLE_DEMO,
        hasWallet: ENV_CONFIG.ENABLE_DEMO,
        pubkey: initialData.pubkey,
        fiat: 'USD',
        rateUsdToVnd: 27000,
        tokens: initialData.tokens,
        devices: initialData.devices,
        apps: initialData.apps,
        activity: initialData.activity,

        // Derived selectors
        getTokenAmount: (symbol: TokenSym) => {
          const state = get();
          const found = state.tokens.find((t) => t.symbol === symbol);
          return found ? found.amount : 0;
        },
        getPortfolioValueUsd: () => {
          const state = get();
          return state.tokens.reduce((sum, token) => sum + token.amount * token.priceUsd, 0);
        },
        hasAssets: () => {
          const state = get();
          return state.tokens.some((t) => t.amount > 0);
        },
        hasNoAssets: () => {
          const state = get();
          return !state.tokens.some((t) => t.amount > 0);
        },
        getNumTokens: () => {
          const state = get();
          return state.tokens.length;
        },
        getNumNonZeroTokens: () => {
          const state = get();
          return state.tokens.filter((t) => t.amount > 0).length;
        },
        getTokenValueUsd: (symbol: TokenSym) => {
          const state = get();
          const found = state.tokens.find((t) => t.symbol === symbol);
          return found ? found.amount * found.priceUsd : 0;
        },
        getEffectivePriceUsd: (symbol: TokenSym) => {
          const state = get();
          const found = state.tokens.find((t) => t.symbol === symbol);
          return found ? found.priceUsd : 0;
        },
        getVisibleTokens: (hideZero: boolean) => {
          const state = get();
          return hideZero ? state.tokens.filter((t) => t.amount > 0) : state.tokens;
        },

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
          const fromIndex = state.tokens.findIndex(
            (t) => t.symbol === fromToken
          );
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
          const data = getInitialData();
          set({
            hasPasskey: ENV_CONFIG.ENABLE_DEMO,
            hasWallet: ENV_CONFIG.ENABLE_DEMO,
            pubkey: data.pubkey,
            fiat: 'USD',
            tokens: data.tokens,
            devices: data.devices,
            apps: data.apps,
            activity: data.activity,
          });
        },
      };
    },
    {
      name: 'lazorkit-wallet-storage',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        // If migrating from version 0 (no version) or if demo mode is disabled,
        // reset the wallet state to match the environment configuration
        if (version === 0 || !ENV_CONFIG.ENABLE_DEMO) {
          const initialData = getInitialData();
          return {
            ...persistedState,
            hasPasskey: ENV_CONFIG.ENABLE_DEMO,
            hasWallet: ENV_CONFIG.ENABLE_DEMO,
            pubkey: initialData.pubkey,
            tokens: initialData.tokens,
            devices: initialData.devices,
            apps: initialData.apps,
            activity: initialData.activity,
          };
        }
        return persistedState;
      },
    }
  )
);
