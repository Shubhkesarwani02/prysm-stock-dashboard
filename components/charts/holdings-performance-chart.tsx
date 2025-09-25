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
    <Card>
      <CardHeader>
        <CardTitle>Holdings Performance</CardTitle>
        <CardDescription>Top performers by percentage change</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topHoldings} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="symbol" className="text-xs fill-muted-foreground" axisLine={false} tickLine={false} />
              <YAxis
                tickFormatter={formatPercent}
                className="text-xs fill-muted-foreground"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="unrealizedGainLossPercent"
                fill={(entry: any) => (entry >= 0 ? "hsl(var(--success))" : "hsl(var(--destructive))")}
                radius={[2, 2, 0, 0]}
              >
                {topHoldings.map((entry, index) => (
                  <Bar
                    key={index}
                    fill={entry.unrealizedGainLossPercent >= 0 ? "hsl(var(--success))" : "hsl(var(--destructive))"}
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
