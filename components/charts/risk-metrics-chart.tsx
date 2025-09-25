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
      fill: "hsl(var(--success))",
    },
    {
      name: "Concentration Risk",
      value: Math.min(riskMetrics.concentration, 100),
      fill: "hsl(var(--warning))",
    },
    {
      name: "Volatility",
      value: Math.min(riskMetrics.volatilityScore, 100),
      fill: "hsl(var(--destructive))",
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
    <Card>
      <CardHeader>
        <CardTitle>Risk Metrics</CardTitle>
        <CardDescription>Portfolio risk analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={data}>
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar
                minAngle={15}
                label={{ position: "insideStart", fill: "#fff" }}
                background
                clockWise
                dataKey="value"
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {data.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold" style={{ color: metric.fill }}>
                {metric.value.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">{metric.name}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
