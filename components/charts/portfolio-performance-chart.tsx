"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PortfolioPerformanceChartProps {
  data: { date: string; value: number }[]
}

export function PortfolioPerformanceChart({ data }: PortfolioPerformanceChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{new Date(label).toLocaleDateString()}</p>
          <p className="text-sm text-primary">Portfolio Value: {formatCurrency(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
          <CardDescription>Value over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">No data available</div>
        </CardContent>
      </Card>
    )
  }

  // Calculate if portfolio is up or down
  const firstValue = data[0]?.value || 0
  const lastValue = data[data.length - 1]?.value || 0
  const isPositive = lastValue >= firstValue

  return (
    <Card className="bg-card/50 backdrop-blur-sm border border-border/50 hover:border-orange-400/30 transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              Portfolio Performance
            </CardTitle>
            <CardDescription className="text-muted-foreground/80">
              Value over time • {data.length} data points
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              isPositive 
                ? 'bg-green-400/20 text-green-400 border border-green-400/30' 
                : 'bg-red-400/20 text-red-400 border border-red-400/30'
            }`}>
              {isPositive ? '↗️' : '↘️'} {((lastValue - firstValue) / firstValue * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(lastValue)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="100%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                className="text-xs fill-muted-foreground"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatCurrency}
                className="text-xs fill-muted-foreground"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#f97316"
                strokeWidth={3}
                fill="url(#performanceGradient)"
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#f97316"
                strokeWidth={3}
                dot={false}
                activeDot={{ 
                  r: 6, 
                  fill: "#f97316",
                  stroke: "#1e293b",
                  strokeWidth: 2
                }}
                filter="drop-shadow(0 0 6px rgba(249, 115, 22, 0.4))"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
