"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import type { PortfolioData, Trade, FilterState } from "@/lib/types"
import { processPortfolioData, savePortfolioData, loadPortfolioData, clearPortfolioData } from "@/lib/portfolio-utils"

export function usePortfolio() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    sector: "all",
    dateRange: { start: "", end: "" },
    searchTerm: "",
  })

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = loadPortfolioData()
    if (savedData) {
      setPortfolioData(savedData)
    }
    setIsLoading(false)
  }, [])

  const updatePortfolioData = useCallback((trades: Trade[]) => {
    const data = processPortfolioData(trades)
    setPortfolioData(data)
    savePortfolioData(data)
  }, [])

  const clearData = useCallback(() => {
    setPortfolioData(null)
    clearPortfolioData()
    // Reset filters when clearing data
    setFilters({
      sector: "all",
      dateRange: { start: "", end: "" },
      searchTerm: "",
    })
  }, [])

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }, [])

  // Apply filters to holdings with memoization for performance
  const filteredHoldings = useMemo(() => {
    if (!portfolioData) return []

    return portfolioData.holdings.filter((holding) => {
      // Sector filter
      if (filters.sector !== "all" && holding.sector !== filters.sector) {
        return false
      }

      // Search filter
      if (filters.searchTerm && !holding.symbol.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false
      }

      return true
    })
  }, [portfolioData, filters.sector, filters.searchTerm])

  // Apply date range filter to trades with memoization
  const filteredTrades = useMemo(() => {
    if (!portfolioData) return []

    return portfolioData.trades.filter((trade) => {
      if (filters.dateRange.start && trade.date < filters.dateRange.start) {
        return false
      }
      if (filters.dateRange.end && trade.date > filters.dateRange.end) {
        return false
      }
      return true
    })
  }, [portfolioData, filters.dateRange])

  // Calculate filtered portfolio metrics
  const filteredMetrics = useMemo(() => {
    if (filteredHoldings.length === 0) {
      return {
        totalValue: 0,
        totalGainLoss: 0,
        totalGainLossPercent: 0,
        topPerformer: null,
        worstPerformer: null,
        uniqueSymbols: 0,
      }
    }

    const totalValue = filteredHoldings.reduce((sum, holding) => sum + holding.currentValue, 0)
    const totalGainLoss = filteredHoldings.reduce((sum, holding) => sum + holding.unrealizedGainLoss, 0)
    const totalGainLossPercent = totalValue > 0 ? (totalGainLoss / (totalValue - totalGainLoss)) * 100 : 0

    const topPerformer = filteredHoldings.reduce(
      (best, current) => (!best || current.unrealizedGainLossPercent > best.unrealizedGainLossPercent ? current : best),
      null as any,
    )

    const worstPerformer = filteredHoldings.reduce(
      (worst, current) =>
        !worst || current.unrealizedGainLossPercent < worst.unrealizedGainLossPercent ? current : worst,
      null as any,
    )

    return {
      totalValue,
      totalGainLoss,
      totalGainLossPercent,
      topPerformer,
      worstPerformer,
      uniqueSymbols: filteredHoldings.length,
    }
  }, [filteredHoldings])

  return {
    portfolioData,
    filteredHoldings,
    filteredTrades,
    filteredMetrics,
    filters,
    isLoading,
    updatePortfolioData,
    updateFilters,
    clearData,
  }
}
