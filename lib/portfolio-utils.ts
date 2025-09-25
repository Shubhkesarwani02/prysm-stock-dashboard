import type { Trade, Holding, PortfolioMetrics, PortfolioData } from "./types"
import { CSVParseError, StorageError, ValidationError } from "./error-utils"

// Mock current prices for demonstration
const MOCK_CURRENT_PRICES: Record<string, number> = {
  AAPL: 185.5,
  TSLA: 240.8,
  GOOGL: 142.3,
  MSFT: 378.9,
  AMZN: 145.2,
  NVDA: 875.4,
  META: 485.6,
  NFLX: 445.3,
  AMD: 142.8,
  INTC: 43.2,
}

// Mock sectors for demonstration
const MOCK_SECTORS: Record<string, string> = {
  AAPL: "Technology",
  TSLA: "Automotive",
  GOOGL: "Technology",
  MSFT: "Technology",
  AMZN: "E-commerce",
  NVDA: "Technology",
  META: "Technology",
  NFLX: "Entertainment",
  AMD: "Technology",
  INTC: "Technology",
}

export function parseCSV(csvContent: string): Trade[] {
  try {
    const lines = csvContent.trim().split("\n")

    if (lines.length === 0) {
      throw new CSVParseError("CSV file is empty")
    }

    const header = lines[0].toLowerCase()

    // Validate header
    const expectedColumns = ["symbol", "shares", "price", "date"]
    const headerColumns = header.split(",").map((col) => col.trim())

    if (!expectedColumns.every((col) => headerColumns.includes(col))) {
      throw new CSVParseError(
        `Invalid CSV format. Expected columns: ${expectedColumns.join(", ")}. Found: ${headerColumns.join(", ")}`,
      )
    }

    const trades: Trade[] = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      try {
        const values = line.split(",").map((val) => val.trim())

        if (values.length !== 4) {
          throw new CSVParseError(`Expected 4 columns, got ${values.length}`, i + 1)
        }

        const [symbol, sharesStr, priceStr, date] = values

        // Validate symbol
        if (!symbol || symbol.length === 0) {
          throw new CSVParseError("Symbol cannot be empty", i + 1, "symbol")
        }

        // Validate and parse shares
        const shares = Number.parseFloat(sharesStr)
        if (isNaN(shares)) {
          throw new CSVParseError(`Invalid shares value: "${sharesStr}"`, i + 1, "shares")
        }

        // Validate and parse price
        const price = Number.parseFloat(priceStr)
        if (isNaN(price) || price <= 0) {
          throw new CSVParseError(`Invalid price value: "${priceStr}". Price must be positive.`, i + 1, "price")
        }

        // Validate date
        const parsedDate = new Date(date)
        if (isNaN(parsedDate.getTime())) {
          throw new CSVParseError(`Invalid date format: "${date}". Use YYYY-MM-DD format.`, i + 1, "date")
        }

        // Check if date is not in the future
        if (parsedDate > new Date()) {
          throw new CSVParseError(`Date cannot be in the future: "${date}"`, i + 1, "date")
        }

        trades.push({
          symbol: symbol.toUpperCase(),
          shares,
          price,
          date,
        })
      } catch (error) {
        if (error instanceof CSVParseError) {
          throw error
        }
        throw new CSVParseError(`Error parsing row ${i + 1}: ${error}`, i + 1)
      }
    }

    if (trades.length === 0) {
      throw new CSVParseError("No valid trades found in CSV file")
    }

    return trades
  } catch (error) {
    if (error instanceof CSVParseError) {
      throw error
    }
    throw new CSVParseError(`Failed to parse CSV: ${error}`)
  }
}

export function calculateHoldings(trades: Trade[]): Holding[] {
  const holdingsMap = new Map<string, { totalShares: number; totalCost: number; trades: Trade[] }>()

  // Aggregate trades by symbol
  trades.forEach((trade) => {
    const existing = holdingsMap.get(trade.symbol) || { totalShares: 0, totalCost: 0, trades: [] }
    existing.totalShares += trade.shares
    existing.totalCost += trade.shares * trade.price
    existing.trades.push(trade)
    holdingsMap.set(trade.symbol, existing)
  })

  const holdings: Holding[] = []

  holdingsMap.forEach((data, symbol) => {
    if (data.totalShares <= 0) return // Skip if no shares held

    const avgCostBasis = data.totalCost / data.totalShares
    const currentPrice = MOCK_CURRENT_PRICES[symbol] || avgCostBasis
    const currentValue = data.totalShares * currentPrice
    const unrealizedGainLoss = currentValue - data.totalShares * avgCostBasis
    const unrealizedGainLossPercent = (unrealizedGainLoss / (data.totalShares * avgCostBasis)) * 100

    holdings.push({
      symbol,
      sharesHeld: data.totalShares,
      avgCostBasis,
      currentPrice,
      unrealizedGainLoss,
      unrealizedGainLossPercent,
      currentValue,
      sector: MOCK_SECTORS[symbol] || "Unknown",
    })
  })

  return holdings.sort((a, b) => b.currentValue - a.currentValue)
}

export function calculatePortfolioMetrics(holdings: Holding[]): PortfolioMetrics {
  const totalValue = holdings.reduce((sum, holding) => sum + holding.currentValue, 0)
  const totalGainLoss = holdings.reduce((sum, holding) => sum + holding.unrealizedGainLoss, 0)
  const totalGainLossPercent = totalValue > 0 ? (totalGainLoss / (totalValue - totalGainLoss)) * 100 : 0

  const topPerformer = holdings.reduce(
    (best, current) => (!best || current.unrealizedGainLossPercent > best.unrealizedGainLossPercent ? current : best),
    null as Holding | null,
  )

  const worstPerformer = holdings.reduce(
    (worst, current) =>
      !worst || current.unrealizedGainLossPercent < worst.unrealizedGainLossPercent ? current : worst,
    null as Holding | null,
  )

  return {
    totalValue,
    totalGainLoss,
    totalGainLossPercent,
    topPerformer,
    worstPerformer,
    uniqueSymbols: holdings.length,
  }
}

export function generatePortfolioHistory(trades: Trade[], holdings: Holding[]): { date: string; value: number }[] {
  if (trades.length === 0) return []

  const sortedTrades = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const history: { date: string; value: number }[] = []

  const startDate = new Date(sortedTrades[0].date)
  const endDate = new Date()
  const dayMs = 24 * 60 * 60 * 1000

  // Create a running portfolio state
  const runningHoldings = new Map<string, { shares: number; totalCost: number }>()
  let tradeIndex = 0

  for (let date = new Date(startDate); date <= endDate; date.setTime(date.getTime() + dayMs)) {
    const dateStr = date.toISOString().split("T")[0]

    // Process all trades for this date
    while (tradeIndex < sortedTrades.length && sortedTrades[tradeIndex].date <= dateStr) {
      const trade = sortedTrades[tradeIndex]
      const existing = runningHoldings.get(trade.symbol) || { shares: 0, totalCost: 0 }

      existing.shares += trade.shares
      existing.totalCost += trade.shares * trade.price

      if (existing.shares <= 0) {
        runningHoldings.delete(trade.symbol)
      } else {
        runningHoldings.set(trade.symbol, existing)
      }

      tradeIndex++
    }

    // Calculate portfolio value for this date
    let totalValue = 0
    runningHoldings.forEach((data, symbol) => {
      const currentPrice = MOCK_CURRENT_PRICES[symbol] || data.totalCost / data.shares
      totalValue += data.shares * currentPrice
    })

    if (totalValue > 0) {
      history.push({ date: dateStr, value: totalValue })
    }
  }

  return history
}

export function processPortfolioData(trades: Trade[]): PortfolioData {
  const holdings = calculateHoldings(trades)
  const metrics = calculatePortfolioMetrics(holdings)
  const portfolioHistory = generatePortfolioHistory(trades, holdings)

  return {
    trades,
    holdings,
    metrics,
    portfolioHistory,
  }
}

export function savePortfolioData(data: PortfolioData): void {
  try {
    if (!data || !data.trades || !data.holdings) {
      throw new StorageError("Invalid portfolio data structure", "save")
    }

    const serializedData = JSON.stringify(data)
    const timestamp = new Date().toISOString()

    localStorage.setItem("portfolio-data", serializedData)
    localStorage.setItem("portfolio-timestamp", timestamp)
    localStorage.setItem("portfolio-version", "1.0")

    // Verify the save was successful
    const saved = localStorage.getItem("portfolio-data")
    if (!saved) {
      throw new StorageError("Failed to verify data was saved", "save")
    }
  } catch (error) {
    if (error instanceof StorageError) {
      throw error
    }

    // Handle quota exceeded error
    if (error instanceof DOMException && error.code === 22) {
      throw new StorageError("Storage quota exceeded. Please clear some data.", "save")
    }

    throw new StorageError(`Failed to save portfolio data: ${error}`, "save")
  }
}

export function loadPortfolioData(): PortfolioData | null {
  try {
    const data = localStorage.getItem("portfolio-data")
    const timestamp = localStorage.getItem("portfolio-timestamp")
    const version = localStorage.getItem("portfolio-version")

    if (!data) {
      return null
    }

    const parsed = JSON.parse(data)

    // Validate the structure
    if (!parsed || typeof parsed !== "object") {
      throw new StorageError("Invalid data format in storage", "load")
    }

    if (!parsed.trades || !Array.isArray(parsed.trades)) {
      throw new StorageError("Invalid trades data in storage", "load")
    }

    if (!parsed.holdings || !Array.isArray(parsed.holdings)) {
      throw new StorageError("Invalid holdings data in storage", "load")
    }

    if (!parsed.metrics || typeof parsed.metrics !== "object") {
      throw new StorageError("Invalid metrics data in storage", "load")
    }

    // Check if data is too old (optional - could warn user)
    if (timestamp) {
      const savedDate = new Date(timestamp)
      const daysSinceUpdate = (Date.now() - savedDate.getTime()) / (1000 * 60 * 60 * 24)

      if (daysSinceUpdate > 30) {
        console.warn("Portfolio data is more than 30 days old")
      }
    }

    return parsed as PortfolioData
  } catch (error) {
    if (error instanceof StorageError) {
      throw error
    }

    if (error instanceof SyntaxError) {
      throw new StorageError("Corrupted data in storage", "load")
    }

    throw new StorageError(`Failed to load portfolio data: ${error}`, "load")
  }
}

export function clearPortfolioData(): void {
  try {
    localStorage.removeItem("portfolio-data")
    localStorage.removeItem("portfolio-timestamp")
    localStorage.removeItem("portfolio-version")
  } catch (error) {
    throw new StorageError(`Failed to clear portfolio data: ${error}`, "clear")
  }
}

export function calculateSectorAllocation(
  holdings: Holding[],
): { sector: string; value: number; percentage: number }[] {
  const sectorMap = new Map<string, number>()
  const totalValue = holdings.reduce((sum, holding) => sum + holding.currentValue, 0)

  holdings.forEach((holding) => {
    const currentValue = sectorMap.get(holding.sector) || 0
    sectorMap.set(holding.sector, currentValue + holding.currentValue)
  })

  return Array.from(sectorMap.entries())
    .map(([sector, value]) => ({
      sector,
      value,
      percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value)
}

export function calculateRiskMetrics(holdings: Holding[]): {
  concentration: number
  diversificationScore: number
  volatilityScore: number
} {
  if (holdings.length === 0) {
    return { concentration: 0, diversificationScore: 0, volatilityScore: 0 }
  }

  const totalValue = holdings.reduce((sum, holding) => sum + holding.currentValue, 0)
  const weights = holdings.map((holding) => holding.currentValue / totalValue)

  // Concentration (Herfindahl Index)
  const concentration = weights.reduce((sum, weight) => sum + weight * weight, 0)

  // Diversification Score (inverse of concentration, normalized)
  const diversificationScore = Math.max(0, (1 - concentration) * 100)

  // Volatility Score (based on gain/loss variance)
  const avgGainLoss = holdings.reduce((sum, holding) => sum + holding.unrealizedGainLossPercent, 0) / holdings.length
  const variance =
    holdings.reduce((sum, holding) => {
      const diff = holding.unrealizedGainLossPercent - avgGainLoss
      return sum + diff * diff
    }, 0) / holdings.length
  const volatilityScore = Math.sqrt(variance)

  return {
    concentration: concentration * 100,
    diversificationScore,
    volatilityScore,
  }
}

export function validateTrade(trade: Partial<Trade>): Trade {
  if (!trade.symbol || typeof trade.symbol !== "string") {
    throw new ValidationError("Symbol is required and must be a string", "symbol", trade.symbol)
  }

  if (typeof trade.shares !== "number" || isNaN(trade.shares)) {
    throw new ValidationError("Shares must be a valid number", "shares", trade.shares)
  }

  if (typeof trade.price !== "number" || isNaN(trade.price) || trade.price <= 0) {
    throw new ValidationError("Price must be a positive number", "price", trade.price)
  }

  if (!trade.date || isNaN(new Date(trade.date).getTime())) {
    throw new ValidationError("Date must be a valid date string", "date", trade.date)
  }

  return {
    symbol: trade.symbol.toUpperCase(),
    shares: trade.shares,
    price: trade.price,
    date: trade.date,
  }
}
