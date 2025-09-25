"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Holding } from "@/lib/types"

interface HoldingsPerformanceChartProps {
  holdings: Holding[]
}

export function HoldingsPerformanceChart({ holdings }: HoldingsPerformanceChartProps) {
  // Sort holdings by performance and take top 10
  const topHoldings = [...holdings]
    .sort((a, b) => Math.abs(b.unrealizedGainLossPercent) - Math.abs(a.unrealizedGainLossPercent))
    .slice(0, 10)

  const formatPercent = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">Performance: {formatPercent(data.unrealizedGainLossPercent)}</p>
          <p className="text-sm text-muted-foreground">
            Value: {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(data.currentValue)}
          </p>
        </div>
      )
    }
    return null
  }

  if (topHoldings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Holdings Performance</CardTitle>
          <CardDescription>Top performers by percentage change</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">No data available</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border border-border/50 hover:border-orange-400/30 transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              Holdings Performance
            </CardTitle>
            <CardDescription className="text-muted-foreground/80">
              Top performers by percentage change
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs bg-orange-400/20 text-orange-400 px-2 py-1 rounded-full border border-orange-400/30">
              Top {topHoldings.length}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topHoldings} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="positiveBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0.4}/>
                </linearGradient>
                <linearGradient id="negativeBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.4}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis 
                dataKey="symbol" 
                className="text-xs fill-muted-foreground" 
                axisLine={false} 
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tickFormatter={formatPercent}
                className="text-xs fill-muted-foreground"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="unrealizedGainLossPercent"
                radius={[4, 4, 0, 0]}
              >
                {topHoldings.map((entry, index) => (
                  <Bar
                    key={index}
                    fill={entry.unrealizedGainLossPercent >= 0 ? "url(#positiveBar)" : "url(#negativeBar)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
