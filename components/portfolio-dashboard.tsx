"use client"

import { useState } from "react"
import { Download, Trash2, BarChart3, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PortfolioSummary } from "./portfolio-summary"
import { PortfolioOverview } from "./portfolio-overview"
import { EnhancedKPIs } from "./enhanced-kpis"
import { PortfolioAllocationChart } from "./charts/portfolio-allocation-chart"
import { PortfolioPerformanceChart } from "./charts/portfolio-performance-chart"
import { HoldingsPerformanceChart } from "./charts/holdings-performance-chart"
import { RiskMetricsChart } from "./charts/risk-metrics-chart"
import { HoldingsTable } from "./holdings-table"
import { FiltersPanel } from "./filters-panel"
import { usePortfolio } from "@/hooks/use-portfolio"
import type { PortfolioData } from "@/lib/types"

interface PortfolioDashboardProps {
  portfolioData: PortfolioData
  onClearData: () => void
}

export function PortfolioDashboard({ portfolioData, onClearData }: PortfolioDashboardProps) {
  const { filteredHoldings, filteredMetrics, filters, updateFilters } = usePortfolio()
  const [searchTerm, setSearchTerm] = useState("")

  const handleExportData = () => {
    const dataStr = JSON.stringify(portfolioData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `portfolio-data-${new Date().toISOString().split("T")[0]}.json`
    link.setAttribute("aria-label", "Download portfolio data as JSON file")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleClearData = () => {
    const confirmed = window.confirm("Are you sure you want to clear all portfolio data? This action cannot be undone.")
    if (confirmed) {
      onClearData()
    }
  }

  // Use filtered data when filters are active, otherwise use full data
  const displayHoldings =
    filteredHoldings.length > 0 || filters.sector !== "all" || filters.searchTerm
      ? filteredHoldings
      : portfolioData.holdings

  const displayMetrics =
    filteredHoldings.length > 0 || filters.sector !== "all" || filters.searchTerm
      ? filteredMetrics
      : portfolioData.metrics

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-6 py-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-xl">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                Portfolio Tracker
              </h1>
              <p className="text-muted-foreground mt-2">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <span className="bg-orange-400/20 border border-orange-400/30 px-3 py-1 rounded-full text-orange-400 font-medium">
                  {portfolioData.holdings.length} holdings
                </span>
                <span className="bg-green-400/20 border border-green-400/30 px-3 py-1 rounded-full text-green-400 font-medium">
                  {portfolioData.trades.length} trades
                </span>
                <span className="bg-blue-400/20 border border-blue-400/30 px-3 py-1 rounded-full text-blue-400 font-medium">
                  {portfolioData.metrics.uniqueSymbols} symbols
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleExportData} className="border-orange-400/20 text-orange-400 hover:bg-orange-400/10">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleClearData} className="border-red-400/20 text-red-400 hover:bg-red-400/10">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          {/* Portfolio Overview */}
          <PortfolioOverview metrics={displayMetrics} />

          {/* Filters */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-4 rounded-xl">
            <FiltersPanel filters={filters} holdings={portfolioData.holdings} onFiltersChange={updateFilters} />
          </div>

          {/* Main Content */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-xl">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 bg-card/50 backdrop-blur-sm border border-border/50">
                <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-orange-400/20 data-[state=active]:text-orange-400">
                  <BarChart3 className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="performance" className="data-[state=active]:bg-orange-400/20 data-[state=active]:text-orange-400">
                  Performance
                </TabsTrigger>
                <TabsTrigger value="holdings" className="data-[state=active]:bg-orange-400/20 data-[state=active]:text-orange-400">
                  Holdings
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-orange-400/20 data-[state=active]:text-orange-400">
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="enhanced" className="data-[state=active]:bg-orange-400/20 data-[state=active]:text-orange-400">
                  Enhanced ✨
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PortfolioAllocationChart holdings={displayHoldings} />
                  <PortfolioPerformanceChart data={portfolioData.portfolioHistory} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <HoldingsPerformanceChart holdings={displayHoldings} />
                  <RiskMetricsChart holdings={displayHoldings} />
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <PortfolioPerformanceChart data={portfolioData.portfolioHistory} />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <HoldingsPerformanceChart holdings={displayHoldings} />
                    <RiskMetricsChart holdings={displayHoldings} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="holdings" className="space-y-6">
                <HoldingsTable holdings={displayHoldings} searchTerm={searchTerm} onSearchChange={setSearchTerm} />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PortfolioAllocationChart holdings={displayHoldings} />
                  <RiskMetricsChart holdings={displayHoldings} />
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <HoldingsPerformanceChart holdings={displayHoldings} />
                </div>
              </TabsContent>

              <TabsContent value="enhanced" className="space-y-8">
                <div className="space-y-6">
                  <EnhancedKPIs metrics={displayMetrics} />
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <HoldingsTable holdings={displayHoldings} searchTerm="" onSearchChange={() => {}} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}