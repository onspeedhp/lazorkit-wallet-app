import { TokenHolding } from './types';

// Sample token data
export const sampleTokens: TokenHolding[] = [
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
