"use client"

import { useState } from "react"
import { Download, Trash2, BarChart3, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PortfolioSummary } from "./portfolio-summary"
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-balance">Portfolio Dashboard</h1>
            <p className="text-muted-foreground">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span>{portfolioData.holdings.length} holdings</span>
              <span>•</span>
              <span>{portfolioData.trades.length} trades</span>
              <span>•</span>
              <span>{portfolioData.metrics.uniqueSymbols} symbols</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleExportData}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download portfolio data as JSON file</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleClearData}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Data
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove all portfolio data (cannot be undone)</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Portfolio Summary - shows filtered metrics when filters are active */}
        <PortfolioSummary metrics={displayMetrics} />

        {/* Filters */}
        <FiltersPanel filters={filters} holdings={portfolioData.holdings} onFiltersChange={updateFilters} />

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
        </Tabs>

        <div className="mt-12 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-3">
            <HelpCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium">Tips for better analysis:</p>
              <ul className="space-y-1 list-disc list-inside ml-2">
                <li>Use filters to analyze specific sectors or time periods</li>
                <li>Export your data to keep historical records</li>
                <li>Monitor your risk metrics to maintain a balanced portfolio</li>
                <li>Regular updates help track performance trends over time</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
