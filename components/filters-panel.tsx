"use client"

import { useState } from "react"
import { Calendar, Filter, RotateCcw, TrendingUp, TrendingDown, DollarSign, ChevronDown, ChevronUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useResponsive } from "@/hooks/use-mobile"
import type { FilterState, Holding } from "@/lib/types"

interface FiltersPanelProps {
  filters: FilterState
  holdings: Holding[]
  onFiltersChange: (filters: Partial<FilterState>) => void
}

export function FiltersPanel({ filters, holdings, onFiltersChange }: FiltersPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { isMobile } = useResponsive()
  const uniqueSectors = Array.from(new Set(holdings.map((h) => h.sector))).sort()

  // Calculate min/max values for range filters
  const performanceRange =
    holdings.length > 0
      ? {
          min: Math.floor(Math.min(...holdings.map((h) => h.unrealizedGainLossPercent))),
          max: Math.ceil(Math.max(...holdings.map((h) => h.unrealizedGainLossPercent))),
        }
      : { min: -100, max: 100 }

  const valueRange =
    holdings.length > 0
      ? {
          min: Math.floor(Math.min(...holdings.map((h) => h.currentValue))),
          max: Math.ceil(Math.max(...holdings.map((h) => h.currentValue))),
        }
      : { min: 0, max: 100000 }

  const handleReset = () => {
    onFiltersChange({
      sector: "all",
      dateRange: { start: "", end: "" },
      searchTerm: "",
    })
  }

  const hasActiveFilters =
    filters.sector !== "all" || filters.dateRange.start || filters.dateRange.end || filters.searchTerm

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Card>
      <CardHeader 
        className={`${isMobile ? 'cursor-pointer' : ''} ${isMobile ? 'pb-2' : ''}`}
        onClick={() => isMobile && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
            <CardTitle className="text-base sm:text-lg">Advanced Filters</CardTitle>
          </div>
          {isMobile && (
            <Button variant="ghost" size="sm">
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          )}
        </div>
        {!isMobile && (
          <CardDescription className="text-sm">Filter and analyze your portfolio data</CardDescription>
        )}
      </CardHeader>
      
      {(!isMobile || isExpanded) && (
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Basic Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="sector-filter" className="text-sm">Sector</Label>
              <Select value={filters.sector} onValueChange={(value) => onFiltersChange({ sector: value })}>
                <SelectTrigger id="sector-filter" className="h-9 sm:h-10">
                  <SelectValue placeholder="All sectors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  {uniqueSectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector} ({holdings.filter((h) => h.sector === sector).length})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-date" className="text-sm">Start Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                <Input
                  id="start-date"
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) =>
                    onFiltersChange({
                      dateRange: { ...filters.dateRange, start: e.target.value },
                    })
                  }
                  className="pl-9 sm:pl-10 h-9 sm:h-10 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date" className="text-sm">End Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                <Input
                  id="end-date"
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) =>
                    onFiltersChange({
                      dateRange: { ...filters.dateRange, end: e.target.value },
                    })
                  }
                  className="pl-9 sm:pl-10 h-9 sm:h-10 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              {!isMobile && <Label>&nbsp;</Label>}
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={!hasActiveFilters}
                className="w-full bg-transparent h-9 sm:h-10 text-sm"
              >
                <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="space-y-3">
            <Label className="text-sm">Quick Filters</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onFiltersChange({ sector: "Technology" })}
                className="h-8 text-xs sm:text-sm"
              >
                Tech Stocks
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Filter to show only profitable holdings
                  const profitableHoldings = holdings.filter((h) => h.unrealizedGainLoss > 0)
                  if (profitableHoldings.length > 0) {
                    // This would need additional filter state to work properly
                    // For now, just show a visual indication
                  }
                }}
                className="h-8 text-success border-success/20 hover:bg-success/10 text-xs sm:text-sm"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Winners
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Filter to show only losing holdings
                  const losingHoldings = holdings.filter((h) => h.unrealizedGainLoss < 0)
                  if (losingHoldings.length > 0) {
                    // This would need additional filter state to work properly
                  }
                }}
                className="h-8 text-destructive border-destructive/20 hover:bg-destructive/10 text-xs sm:text-sm"
              >
                <TrendingDown className="h-3 w-3 mr-1" />
                Losers
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Filter to show high-value holdings
                  const highValueHoldings = holdings.filter((h) => h.currentValue > 10000)
                  if (highValueHoldings.length > 0) {
                    // This would need additional filter state to work properly
                  }
                }}
                className="h-8 text-xs sm:text-sm"
              >
                <DollarSign className="h-3 w-3 mr-1" />
                High Value
              </Button>
            </div>
          </div>

          {/* Filter Summary */}
          {hasActiveFilters && (
            <div className="space-y-3 pt-4 border-t">
              <Label className="text-sm">Active Filters</Label>
            <div className="flex flex-wrap gap-2">
              {filters.sector !== "all" && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onFiltersChange({ sector: "all" })}
                  className="h-7 px-3 text-xs"
                >
                  Sector: {filters.sector} ×
                </Button>
              )}
              {filters.dateRange.start && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    onFiltersChange({
                      dateRange: { ...filters.dateRange, start: "" },
                    })
                  }
                  className="h-7 px-3 text-xs"
                >
                  From: {filters.dateRange.start} ×
                </Button>
              )}
              {filters.dateRange.end && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    onFiltersChange({
                      dateRange: { ...filters.dateRange, end: "" },
                    })
                  }
                  className="h-7 px-3 text-xs"
                >
                  To: {filters.dateRange.end} ×
                </Button>
              )}
              {filters.searchTerm && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onFiltersChange({ searchTerm: "" })}
                  className="h-7 px-3 text-xs"
                >
                  Search: "{filters.searchTerm}" ×
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Filter Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{holdings.length}</div>
            <div className="text-xs text-muted-foreground">Total Holdings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">
              {holdings.filter((h) => h.unrealizedGainLoss > 0).length}
            </div>
            <div className="text-xs text-muted-foreground">Profitable</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-destructive">
              {holdings.filter((h) => h.unrealizedGainLoss < 0).length}
            </div>
            <div className="text-xs text-muted-foreground">Losing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{uniqueSectors.length}</div>
            <div className="text-xs text-muted-foreground">Sectors</div>
          </div>
        </div>
      </CardContent>
      )}
    </Card>
  )
}
