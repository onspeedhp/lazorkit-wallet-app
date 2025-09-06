// Utilities to generate rich demo data deterministically (no real integrations)
import { AppCard, Activity, ActivityKind, Device, TokenHolding, TokenSym, useWalletStore } from '@/lib/store/wallet'

type SeedOptions = {
  minimal?: boolean
  seed?: string
}

// Simple LCG for deterministic randomness from a string seed
function createSeededRandom(seed: string) {
  let h = 2166136261 >>> 0
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  let state = h >>> 0
  return () => {
    state = Math.imul(48271, state) % 0x7fffffff
    return (state & 0x7fffffff) / 0x7fffffff
  }
}

function pick<T>(rand: () => number, arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)]
}

function generateSparkline(rand: () => number, points = 7, base = 1, volatility = 0.03): number[] {
  const data: number[] = []
  let value = base
  for (let i = 0; i < points; i++) {
    const change = (rand() - 0.5) * 2 * volatility
    value = Math.max(0.0001, value * (1 + change))
    data.push(Number(value.toFixed(4)))
  }
  return data
}

export type DemoData = {
  pubkey: string
  tokens: TokenHolding[]
  devices: Device[]
  apps: AppCard[]
  activity: Activity[]
}

export function generateDemoData(options: SeedOptions = {}): DemoData {
  const { minimal = false, seed = 'lazorkit-demo-seed' } = options
  const rand = createSeededRandom(seed)

  // Wallet pubkey (fake but looks plausible)
  const pubkey = '7gfV' + Math.random().toString(36).slice(2, 26) + 'x9A'

  // Tokens per spec
  const tokenDefs: Array<[
    TokenSym | string,
    number,
    number,
    number,
    string,
    number
  ]> = [
    ['SOL', 3.21, 182.1, 2.3, 'So11111111111111111111111111111111111111112', 1000000000],
    ['USDC', 248.56, 1.0, 0.0, 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', 100000000000],
    ['USDT', 50.0, 1.0, -0.1, 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', 100000000000],
    ['BONK', 128420, 0.000014, 4.8, 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', 100000000000000],
    ['RAY', 210.3, 0.32, 1.5, '4k3Dyjzvzp8eMZWUXbBC7o7DqjP9r6o9S1h1E4Nxxawy', 555000000],
    ['JUP', 145.7, 0.82, 3.2, 'JUP2jxv5wF9vA2r1xQv6u8JUP2jxv5wF9vA2r1xQv6u8', 1000000000],
    ['ORCA', 92.5, 1.42, -0.8, 'orcaEKTdK7fJ7P6RD2G8E3d4Dk5s6j7k8l9m0n1o2p', 100000000],
    ['mSOL', 1.02, 202.3, 1.1, 'mSoLz11111111111111111111111111111111111111', 10000000],
    ['JitoSOL', 0.65, 205.9, 0.9, 'JitoSo1111111111111111111111111111111111111', 8000000],
    ['PYTH', 312.0, 0.42, 2.7, 'Pyth111111111111111111111111111111111111111', 10000000000],
  ]

  const tokens: TokenHolding[] = tokenDefs
    .slice(0, minimal ? 4 : tokenDefs.length)
    .map(([symbol, amount, priceUsd, change24hPct, mint, totalSupply]) => ({
      symbol: symbol as TokenSym,
      amount,
      priceUsd,
      change24hPct,
      mint,
      totalSupply,
    }))

  // Devices 3–5
  const devicePool: Omit<Device, 'id'>[] = [
    { name: 'iPhone 15 Pro • iOS', platform: 'iOS', lastActive: '2h ago', location: 'Ho Chi Minh City' },
    { name: 'Pixel 8 • Android', platform: 'Android', lastActive: 'yesterday', location: 'Hanoi' },
    { name: 'Safari • Web', platform: 'Web', lastActive: '3d ago', location: 'Singapore' },
    { name: 'MacBook Pro • Web', platform: 'Web', lastActive: '5d ago', location: 'Da Nang' },
  ]
  const deviceCount = minimal ? 2 : 4
  const devices: Device[] = Array.from({ length: deviceCount }).map((_, i) => {
    const d = devicePool[i % devicePool.length]
    return { id: `dev_${i + 1}`, ...d }
  })

  // Apps 24+
  const appNames = [
    'SolPay Mini','Orbit DEX','Nova Games','RippleChat','Keystone Tools','Driftboard','MintMuse','LootLands','TipTap Social','Radiant Swap','Juno Mail','Tide Vault','Aurora Lens','Nebula Notes','Torus ID','Glacier Finance','Prism Bridge','Zest Markets','Echo Streams','Quanta Labs','Mango Mail','Nova Wallet Connect','Helios Scan','Anchor Cloud',
  ]
  const categories: AppCard['category'][] = ['DeFi','Social','Games','Tools']
  const tagsPool = ['Payments','DEX','Trading','NFT','Gaming','Tools','Wallet','Bridge','Analytics','Social']
  const appCount = minimal ? 8 : Math.max(24, appNames.length)
  const apps: AppCard[] = Array.from({ length: appCount }).map((_, i) => {
    const name = appNames[i % appNames.length]
    const category = categories[i % categories.length]
    const verified = (i % 3) === 0
    const rating = Number((4.1 + (i % 8) * 0.1).toFixed(1))
    const installs = `${(10 + (i * 1.3)).toFixed(1)}k`
    const updatedAt = new Date(Date.now() - (i + 1) * 86400000).toISOString()
    const tags = Array.from({ length: 3 }).map(() => pick(createSeededRandom(`${seed}-app-${i}`), tagsPool))
    return {
      id: String(i + 1),
      name,
      intro: 'Discover rich features powered by Solana (demo)'.replace('demo', verified ? 'demo • Verified' : 'demo'),
      category,
      tags,
      image: '/placeholder.svg',
      website: 'https://example.com',
      verified,
      rating,
      installs,
      updatedAt,
      version: `1.${i % 10}.${(i * 3) % 10}`,
    } as AppCard
  })

  // Activity 30–50
  const kinds: ActivityKind[] = ['onramp','swap','send','deposit']
  const activityCount = minimal ? 12 : 40
  const now = Date.now()
  const activity: Activity[] = Array.from({ length: activityCount }).map((_, i) => {
    const kind = kinds[i % kinds.length]
    const ts = new Date(now - (i * (86400000 / 3))).toISOString()
    const token = tokens[i % tokens.length].symbol
    const amountBase = Math.max(1, Math.round((createSeededRandom(`${seed}-act-${i}`)() * 100) * 100) / 100)
    let summary = ''
    let counterparty: string | undefined
    let orderId: string | undefined
    const statusRoll = Math.floor(createSeededRandom(`${seed}-status-${i}`)() * 100)
    const status: Activity['status'] = statusRoll < 5 ? 'Failed' : statusRoll < 15 ? 'Pending' : 'Success'
    if (kind === 'onramp') {
      const usd = amountBase.toFixed(2)
      summary = `Bought ${amountBase} ${token} with $${usd}`
      orderId = `ord_${(now - i).toString(36)}`
    } else if (kind === 'swap') {
      summary = `Swapped ${amountBase} ${token} for ${(amountBase * 0.97).toFixed(2)} USDC`
    } else if (kind === 'send') {
      counterparty = `${Math.random().toString(36).slice(2, 6)}...${Math.random().toString(36).slice(2, 6)}`
      summary = `Sent ${amountBase} ${token} to ${counterparty}`
    } else {
      summary = `Deposited ${amountBase} ${token}`
    }
    return {
      id: `act_${i + 1}`,
      kind,
      ts,
      summary,
      amount: amountBase,
      token: token as TokenSym,
      counterparty,
      orderId,
      status,
    }
  })

  return { pubkey, tokens, devices, apps, activity }
}

export function applyDemoData(data: DemoData) {
  useWalletStore.setState({
    hasPasskey: true,
    hasWallet: true,
    pubkey: data.pubkey,
    fiat: 'USD',
    rateUsdToVnd: 27000,
    tokens: data.tokens,
    devices: data.devices,
    apps: data.apps,
    activity: data.activity,
  })
}

export function reseedDemo(minimal = false) {
  const data = generateDemoData({ minimal })
  applyDemoData(data)
}


