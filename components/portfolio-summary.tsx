"use client"

import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PortfolioMetrics } from "@/lib/types"

interface PortfolioSummaryProps {
  metrics: PortfolioMetrics
}

export function PortfolioSummary({ metrics }: PortfolioSummaryProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(metrics.totalValue)}</div>
          <p className="text-xs text-muted-foreground">{formatPercent(metrics.totalGainLossPercent)} overall</p>
        </CardContent>
      </Card>

      <Card
        className={`bg-gradient-to-br ${
          metrics.totalGainLoss >= 0
            ? "from-success/10 to-success/5 border-success/20"
            : "from-destructive/10 to-destructive/5 border-destructive/20"
        }`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unrealized P&L</CardTitle>
          {metrics.totalGainLoss >= 0 ? (
            <TrendingUp className="h-4 w-4 text-success" />
          ) : (
            <TrendingDown className="h-4 w-4 text-destructive" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${metrics.totalGainLoss >= 0 ? "text-success" : "text-destructive"}`}>
            {formatCurrency(metrics.totalGainLoss)}
          </div>
          <p className="text-xs text-muted-foreground">{formatPercent(metrics.totalGainLossPercent)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
          <TrendingUp className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.topPerformer?.symbol || "N/A"}</div>
          <p className="text-xs text-muted-foreground">
            {metrics.topPerformer ? formatPercent(metrics.topPerformer.unrealizedGainLossPercent) : "No data"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Holdings</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.uniqueSymbols}</div>
          <p className="text-xs text-muted-foreground">Unique symbols</p>
        </CardContent>
      </Card>
    </div>
  )
}
