export interface Trade {
  symbol: string
  shares: number
  price: number
  date: string
}

export interface Holding {
  symbol: string
  sharesHeld: number
  avgCostBasis: number
  currentPrice: number
  unrealizedGainLoss: number
  unrealizedGainLossPercent: number
  currentValue: number
  sector: string
}

export interface PortfolioMetrics {
  totalValue: number
  totalGainLoss: number
  totalGainLossPercent: number
  topPerformer: Holding | null
  worstPerformer: Holding | null
  uniqueSymbols: number
}

export interface PortfolioData {
  trades: Trade[]
  holdings: Holding[]
  metrics: PortfolioMetrics
  portfolioHistory: { date: string; value: number }[]
}

export interface FilterState {
  sector: string
  dateRange: {
    start: string
    end: string
  }
  searchTerm: string
}
