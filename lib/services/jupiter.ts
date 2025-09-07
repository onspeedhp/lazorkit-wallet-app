export interface JupiterToken {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  decimals: number;
  fdv?: number;
  mcap?: number;
  usdPrice?: number;
  liquidity?: number;
  holderCount?: number;
  isVerified?: boolean;
  tags?: string[];
}

// Common token addresses on Solana
const TOKEN_ADDRESSES = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
} as const;

// Cache for token data
const tokenCache = new Map<string, JupiterToken>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const lastFetchTime = new Map<string, number>();

export async function fetchTokenData(
  symbolOrAddress: string
): Promise<JupiterToken | null> {
  // Check cache first
  const cacheKey = symbolOrAddress.toUpperCase();
  const cached = tokenCache.get(cacheKey);
  const lastFetch = lastFetchTime.get(cacheKey) || 0;

  if (cached && Date.now() - lastFetch < CACHE_DURATION) {
    return cached;
  }

  try {
    // Use the address if we have it, otherwise search by symbol
    const query =
      TOKEN_ADDRESSES[cacheKey as keyof typeof TOKEN_ADDRESSES] ||
      symbolOrAddress;

    const response = await fetch(
      `https://lite-api.jup.ag/tokens/v2/search?query=${query}`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch token data: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      console.warn(`No token data found for ${symbolOrAddress}`);
      return null;
    }

    // Take the first result
    const token = data[0];

    const result: JupiterToken = {
      id: token.id,
      name: token.name,
      symbol: token.symbol,
      icon: token.icon,
      decimals: token.decimals,
      fdv: token.fdv,
      mcap: token.mcap,
      usdPrice: token.usdPrice,
      liquidity: token.liquidity,
      holderCount: token.holderCount,
      isVerified: token.isVerified,
      tags: token.tags,
    };

    // Update cache
    tokenCache.set(cacheKey, result);
    lastFetchTime.set(cacheKey, Date.now());

    return result;
  } catch (error) {
    console.error(`Error fetching token data for ${symbolOrAddress}:`, error);
    return null;
  }
}

export async function fetchCommonTokens(): Promise<Map<string, JupiterToken>> {
  const tokens = new Map<string, JupiterToken>();

  // Fetch data for common tokens in parallel
  const symbols = ['SOL', 'USDC', 'USDT'];
  const promises = symbols.map((symbol) => fetchTokenData(symbol));
  const results = await Promise.all(promises);

  results.forEach((token, index) => {
    if (token) {
      tokens.set(symbols[index], token);
    }
  });

  return tokens;
}
