export interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  createdAt?: Date
  lastLoginAt?: Date
  preferences?: UserPreferences
}

export interface UserPreferences {
  favoriteMarkets: string[]
  defaultCurrency: string
  notifications: boolean
  theme: 'light' | 'dark'
}

export interface MarketData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  market: 'MY' | 'US' | 'CN' | 'HK' | 'SG'
  lastUpdated: Date
}

export interface CryptoData {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
  changePercent24h: number
  marketCap: number
  volume24h: number
  lastUpdated: Date
}

export interface ForexData {
  pair: string
  rate: number
  change: number
  changePercent: number
  lastUpdated: Date
}

export interface CommodityData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  unit: string
  lastUpdated: Date
}

export interface ClickEvent {
  elementId: string
  action: string
  timestamp: Date
  userId?: string
  page: string
  metadata?: Record<string, any>
}

export interface MarketSummary {
  market: string
  index: string
  value: number
  change: number
  changePercent: number
  status: 'open' | 'closed' | 'pre-market' | 'after-hours'
}