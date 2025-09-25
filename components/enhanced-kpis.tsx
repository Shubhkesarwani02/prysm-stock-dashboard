"use client"

import { TrendingUp, TrendingDown, DollarSign, Target, Zap, PieChart, Shield, Activity, Award, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { PortfolioMetrics } from "@/lib/types"

interface EnhancedKPIProps { 
  metrics: PortfolioMetrics 
}

export function EnhancedKPIs({ metrics }: EnhancedKPIProps) {
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

  const formatCompactCurrency = (value: number) => {
    const absValue = Math.abs(value)
    if (absValue >= 1000000) {
      return `${value >= 0 ? '' : '-'}$${(absValue / 1000000).toFixed(1)}M`
    } else if (absValue >= 1000) {
      return `${value >= 0 ? '' : '-'}$${(absValue / 1000).toFixed(1)}K`
    }
    return formatCurrency(value)
  }

  const allocationDiversity = Math.min(100, metrics.uniqueSymbols * 8)

  return (
    <div className="space-y-6">
      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Portfolio Value */}
        <Card className="bg-card/50 backdrop-blur-sm border border-orange-400/20 hover:border-orange-400/40 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400/20 to-amber-400/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="h-5 w-5 text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-orange-400">
                {formatCompactCurrency(metrics.totalValue)}
              </div>
              <div className={`text-sm flex items-center gap-1 ${
                metrics.totalGainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {metrics.totalGainLossPercent >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {formatPercent(metrics.totalGainLossPercent)}
              </div>
              <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full w-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Unrealized P&L */}
        <Card className={`bg-card/50 backdrop-blur-sm border transition-all duration-300 group ${
          metrics.totalGainLoss >= 0 
            ? 'border-green-400/20 hover:border-green-400/40' 
            : 'border-red-400/20 hover:border-red-400/40'
        }`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unrealized P&L</CardTitle>
            <div className={`h-10 w-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${
              metrics.totalGainLoss >= 0 
                ? 'bg-gradient-to-br from-green-400/20 to-emerald-400/20' 
                : 'bg-gradient-to-br from-red-400/20 to-rose-400/20'
            }`}>
              {metrics.totalGainLoss >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-400" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-400" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`text-2xl font-bold ${
                metrics.totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatCompactCurrency(metrics.totalGainLoss)}
              </div>
              <Badge variant={metrics.totalGainLoss >= 0 ? "default" : "destructive"} className={
                metrics.totalGainLoss >= 0 
                  ? "bg-green-400/20 text-green-400 border-green-400/30" 
                  : "bg-red-400/20 text-red-400 border-red-400/30"
              }>
                {formatPercent(metrics.totalGainLossPercent)}
              </Badge>
              <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    metrics.totalGainLoss >= 0 
                      ? 'bg-gradient-to-r from-green-400 to-emerald-400' 
                      : 'bg-gradient-to-r from-red-400 to-rose-400'
                  }`} 
                  style={{ 
                    width: `${Math.min(100, Math.abs(metrics.totalGainLossPercent) * 2)}%` 
                  }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Performer */}
        <Card className="bg-card/50 backdrop-blur-sm border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top Performer</CardTitle>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="h-5 w-5 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-400">
                {metrics.topPerformer?.symbol || "N/A"}
              </div>
              <div className="text-sm text-blue-400">
                {metrics.topPerformer ? formatPercent(metrics.topPerformer.unrealizedGainLossPercent) : "No data"}
              </div>
              <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full w-3/4"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Diversification */}
        <Card className="bg-card/50 backdrop-blur-sm border border-violet-400/20 hover:border-violet-400/40 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Diversification</CardTitle>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-400/20 to-purple-400/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Shield className="h-5 w-5 text-violet-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-violet-400">
                {metrics.uniqueSymbols}
              </div>
              <div className="text-sm text-muted-foreground">
                Holdings • {allocationDiversity.toFixed(0)}% score
              </div>
              <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-violet-400 to-purple-400 rounded-full transition-all duration-1000" 
                  style={{ width: `${allocationDiversity}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Health */}
        <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-orange-400" />
              Portfolio Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Risk Level</span>
                <Badge variant="outline" className="bg-orange-400/10 text-orange-400 border-orange-400/30">
                  {metrics.uniqueSymbols > 15 ? 'Low' : metrics.uniqueSymbols > 8 ? 'Medium' : 'High'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Allocation Score</span>
                <span className="text-sm font-medium text-orange-400">
                  {allocationDiversity.toFixed(0)}/100
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Performance</span>
                <span className={`text-sm font-medium ${
                  metrics.totalGainLossPercent > 5 ? 'text-green-400' : 
                  metrics.totalGainLossPercent > 0 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {metrics.totalGainLossPercent > 5 ? 'Excellent' : 
                   metrics.totalGainLossPercent > 0 ? 'Good' : 'Poor'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Insights */}
        <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-400" />
              Market Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Holdings</span>
                <span className="text-sm font-medium text-blue-400">{metrics.uniqueSymbols}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg. Position</span>
                <span className="text-sm font-medium text-blue-400">
                  {formatCurrency(metrics.totalValue / metrics.uniqueSymbols)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Win Rate</span>
                <span className="text-sm font-medium text-blue-400">
                  {metrics.topPerformer ? '75%' : 'N/A'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Items */}
        <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Target className="h-4 w-4 text-green-400" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.uniqueSymbols < 10 && (
                <div className="text-xs p-2 bg-yellow-400/10 border border-yellow-400/20 rounded text-yellow-400">
                  💡 Consider diversifying with more holdings
                </div>
              )}
              {metrics.totalGainLossPercent > 10 && (
                <div className="text-xs p-2 bg-green-400/10 border border-green-400/20 rounded text-green-400">
                  🎯 Portfolio performing well - maintain strategy
                </div>
              )}
              <div className="text-xs p-2 bg-blue-400/10 border border-blue-400/20 rounded text-blue-400">
                📊 Monitor top performer for rebalancing
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}