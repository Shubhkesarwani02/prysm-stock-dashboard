"use client"

import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateRiskMetrics } from "@/lib/portfolio-utils"
import type { Holding } from "@/lib/types"

interface RiskMetricsChartProps {
  holdings: Holding[]
}

export function RiskMetricsChart({ holdings }: RiskMetricsChartProps) {
  const riskMetrics = calculateRiskMetrics(holdings)

  const data = [
    {
      name: "Diversification",
      value: riskMetrics.diversificationScore,
      fill: "#f97316",
    },
    {
      name: "Concentration Risk",
      value: Math.min(riskMetrics.concentration, 100),
      fill: "#fbbf24",
    },
    {
      name: "Volatility",
      value: Math.min(riskMetrics.volatilityScore, 100),
      fill: "#fb923c",
    },
  ]

  if (holdings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Risk Metrics</CardTitle>
          <CardDescription>Portfolio risk analysis</CardDescription>
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
              Risk Analytics
            </CardTitle>
            <CardDescription className="text-muted-foreground/80">
              Portfolio risk assessment and diversification metrics
            </CardDescription>
          </div>
          <div className="h-8 w-8 rounded-full bg-orange-400/20 flex items-center justify-center">
            <div className="h-4 w-4 rounded-full bg-orange-400"></div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="85%" data={data}>
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar
                label={{ position: "insideStart", fill: "#fff", fontSize: 12, fontWeight: "bold" }}
                background={{ fill: "rgba(255,255,255,0.05)" }}
                clockWise
                dataKey="value"
                cornerRadius={4}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          {/* Center Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">
                {((data[0]?.value + data[1]?.value + data[2]?.value) / 3).toFixed(0)}
              </div>
              <div className="text-xs text-muted-foreground">Risk Score</div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Metrics Grid */}
        <div className="grid grid-cols-3 gap-4">
          {data.map((metric, index) => (
            <div key={index} className="relative group">
              <div className="bg-gradient-to-br from-card/50 to-card/30 border border-border/30 rounded-lg p-4 hover:border-orange-400/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {metric.name}
                  </div>
                  <div 
                    className="h-2 w-2 rounded-full" 
                    style={{ backgroundColor: metric.fill }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold" style={{ color: metric.fill }}>
                    {metric.value.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {metric.value > 70 ? "High" : metric.value > 40 ? "Medium" : "Low"}
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-2 h-1 bg-muted/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${metric.value}%`,
                      backgroundColor: metric.fill
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Risk Assessment Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-orange-400/10 via-amber-400/5 to-orange-400/10 border border-orange-400/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-orange-400 animate-pulse"></div>
            <div className="text-sm font-medium text-orange-400">Portfolio Risk Assessment</div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground leading-relaxed">
            {data[0]?.value > 60 ? "✅ Well diversified portfolio" : "⚠️ Consider increasing diversification"} • 
            {data[1]?.value < 50 ? " Low concentration risk" : " Monitor concentration levels"} • 
            {data[2]?.value < 60 ? " Moderate volatility" : " High volatility detected"}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
