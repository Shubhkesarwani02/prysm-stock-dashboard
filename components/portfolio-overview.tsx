"use client"

import { TrendingUp, TrendingDown, DollarSign, Target, Zap, PieChart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PortfolioMetrics } from "@/lib/types"

interface PortfolioOverviewProps {
  metrics: PortfolioMetrics
}

export function PortfolioOverview({ metrics }: PortfolioOverviewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Portfolio Value */}
      <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border border-orange-400/20">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-amber-400/5"></div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-orange-400/20 rounded-full blur-xl"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Portfolio Value</CardTitle>
          <DollarSign className="h-5 w-5 text-orange-400" />
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold text-orange-400">
            {formatCurrency(metrics.totalValue)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatPercent(metrics.totalGainLossPercent)} overall
          </p>
        </CardContent>
      </Card>

      {/* Unrealized P&L */}
      <Card className={`relative overflow-hidden bg-card/50 backdrop-blur-sm border ${
        metrics.totalGainLoss >= 0 ? 'border-green-400/20' : 'border-red-400/20'
      }`}>
        <div className={`absolute inset-0 ${
          metrics.totalGainLoss >= 0 ? 'bg-gradient-to-br from-green-400/10 to-green-400/5' : 'bg-gradient-to-br from-red-400/10 to-red-400/5'
        }`}></div>
        <div className={`absolute top-0 right-0 w-24 h-24 ${
          metrics.totalGainLoss >= 0 ? 'success-gradient' : 'danger-gradient'
        } opacity-25 rounded-full blur-xl`}></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-muted-foreground">Unrealized P&L</CardTitle>
          {metrics.totalGainLoss >= 0 ? (
            <TrendingUp className="h-5 w-5 text-green-400" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-400" />
          )}
        </CardHeader>
        <CardContent className="relative z-10">
          <div className={`text-3xl font-bold ${
            metrics.totalGainLoss >= 0 ? "text-green-400" : "text-red-400"
          }`}>
            {formatCurrency(metrics.totalGainLoss)}
          </div>
          <p className={`text-xs mt-1 ${
            metrics.totalGainLossPercent >= 0 ? "text-green-400" : "text-red-400"
          }`}>
            {formatPercent(metrics.totalGainLossPercent)}
          </p>
        </CardContent>
      </Card>

      {/* Top Performer */}
      <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border border-blue-400/20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-blue-400/5"></div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-muted-foreground">Top Performer</CardTitle>
          <Zap className="h-5 w-5 text-blue-400" />
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold text-blue-400">
            {metrics.topPerformer?.symbol || "N/A"}
          </div>
          <p className="text-xs text-blue-400 mt-1">
            {metrics.topPerformer ? formatPercent(metrics.topPerformer.unrealizedGainLossPercent) : "No data"}
          </p>
        </CardContent>
      </Card>

      {/* Holdings Count */}
      <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border border-violet-400/20">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-400/10 to-violet-400/5"></div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-violet-400/20 rounded-full blur-xl"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-muted-foreground">Diversification</CardTitle>
          <PieChart className="h-5 w-5 text-violet-400" />
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold text-violet-400">
            {metrics.uniqueSymbols}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Unique symbols
          </p>
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-400 to-purple-400 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, metrics.uniqueSymbols * 5)}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}