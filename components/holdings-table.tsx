"use client"

import { useState, useMemo } from "react"
import { ArrowUpDown, ArrowUp, ArrowDown, Search, TrendingUp, TrendingDown, MoreVertical } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useIsMobile, useResponsive } from "@/hooks/use-mobile"
import type { Holding } from "@/lib/types"

interface HoldingsTableProps {
  holdings: Holding[]
  searchTerm: string
  onSearchChange: (term: string) => void
}

type SortField = keyof Holding
type SortDirection = "asc" | "desc"

const ITEMS_PER_PAGE = 10
const MOBILE_ITEMS_PER_PAGE = 5

export function HoldingsTable({ holdings, searchTerm, onSearchChange }: HoldingsTableProps) {
  const [sortField, setSortField] = useState<SortField>("currentValue")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const isMobile = useIsMobile()
  const { isMobile: isResponsiveMobile } = useResponsive()
  
  const itemsPerPage = isResponsiveMobile ? MOBILE_ITEMS_PER_PAGE : ITEMS_PER_PAGE

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
    setCurrentPage(1)
  }

  const sortedAndFilteredHoldings = useMemo(() => {
    const filtered = holdings.filter((holding) => holding.symbol.toLowerCase().includes(searchTerm.toLowerCase()))

    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return 0
    })

    return filtered
  }, [holdings, searchTerm, sortField, sortDirection])

  const totalPages = Math.ceil(sortedAndFilteredHoldings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedHoldings = sortedAndFilteredHoldings.slice(startIndex, startIndex + itemsPerPage)

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

  const formatShares = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    }).format(value)
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />
    }
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  const getSectorColor = (sector: string) => {
    const colors: Record<string, string> = {
      Technology: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Automotive: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      "E-commerce": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      Entertainment: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      Unknown: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    }
    return colors[sector] || colors.Unknown
  }

  // Mobile card view component
  const MobileHoldingCard = ({ holding }: { holding: Holding }) => (
    <Card className="bg-card/50 backdrop-blur-sm border border-border/50 hover:border-orange-400/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">{holding.symbol}</span>
            {holding.unrealizedGainLossPercent >= 0 ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
          </div>
          <Badge variant="secondary" className={getSectorColor(holding.sector)}>
            {holding.sector}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Shares:</span>
            <div className="font-mono font-medium">{formatShares(holding.sharesHeld)}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Avg Cost:</span>
            <div className="font-mono font-medium">{formatCurrency(holding.avgCostBasis)}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Current Price:</span>
            <div className="font-mono font-medium">{formatCurrency(holding.currentPrice)}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Market Value:</span>
            <div className="font-mono font-bold">{formatCurrency(holding.currentValue)}</div>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="text-center">
            <span className="text-muted-foreground text-sm">Unrealized P&L:</span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span
                className={`font-mono font-bold text-lg ${
                  holding.unrealizedGainLoss >= 0 ? "text-success" : "text-destructive"
                }`}
              >
                {formatCurrency(holding.unrealizedGainLoss)}
              </span>
              <span
                className={`text-sm font-medium ${
                  holding.unrealizedGainLossPercent >= 0 ? "text-success" : "text-destructive"
                }`}
              >
                ({formatPercent(holding.unrealizedGainLossPercent)})
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (holdings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
          <CardDescription>Your current stock positions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">No holdings to display</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass hover-lift">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Holdings</CardTitle>
        <CardDescription>Your current stock positions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-success" />
            <Input
              placeholder="Search holdings..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 glass border-success/30 focus:border-success/60"
            />
          </div>
          <div className="text-sm text-muted-foreground glass px-3 py-2 rounded-lg text-center sm:text-left whitespace-nowrap">
            {sortedAndFilteredHoldings.length} of {holdings.length} holdings
          </div>
        </div>

        {/* Mobile View - Cards */}
        {isResponsiveMobile ? (
          <div className="space-y-4">
            {/* Mobile Sort Controls */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button
                variant={sortField === "currentValue" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSort("currentValue")}
                className="whitespace-nowrap"
              >
                Market Value {getSortIcon("currentValue")}
              </Button>
              <Button
                variant={sortField === "unrealizedGainLoss" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSort("unrealizedGainLoss")}
                className="whitespace-nowrap"
              >
                P&L {getSortIcon("unrealizedGainLoss")}
              </Button>
              <Button
                variant={sortField === "symbol" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSort("symbol")}
                className="whitespace-nowrap"
              >
                Symbol {getSortIcon("symbol")}
              </Button>
            </div>
            
            {/* Mobile Cards */}
            <div className="space-y-3">
              {paginatedHoldings.map((holding) => (
                <MobileHoldingCard key={holding.symbol} holding={holding} />
              ))}
            </div>
          </div>
        ) : (
          /* Desktop View - Table */
          <div className="rounded-md glass overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/30">
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 p-0 font-medium hover:text-success"
                        onClick={() => handleSort("symbol")}
                      >
                        Symbol
                        {getSortIcon("symbol")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 p-0 font-medium hover:text-info"
                        onClick={() => handleSort("sector")}
                      >
                        Sector
                        {getSortIcon("sector")}
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 p-0 font-medium hover:text-accent"
                        onClick={() => handleSort("sharesHeld")}
                      >
                        Shares
                        {getSortIcon("sharesHeld")}
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 p-0 font-medium hover:text-warning"
                        onClick={() => handleSort("avgCostBasis")}
                      >
                        Avg Cost
                        {getSortIcon("avgCostBasis")}
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 p-0 font-medium hover:text-success"
                        onClick={() => handleSort("currentPrice")}
                      >
                        Current Price
                        {getSortIcon("currentPrice")}
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 p-0 font-medium hover:text-info"
                        onClick={() => handleSort("currentValue")}
                      >
                        Market Value
                        {getSortIcon("currentValue")}
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 p-0 font-medium hover:text-accent"
                        onClick={() => handleSort("unrealizedGainLoss")}
                      >
                        Unrealized P&L
                        {getSortIcon("unrealizedGainLoss")}
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedHoldings.map((holding) => (
                    <TableRow key={holding.symbol} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {holding.symbol}
                          {holding.unrealizedGainLossPercent >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-success" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getSectorColor(holding.sector)}>
                          {holding.sector}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">{formatShares(holding.sharesHeld)}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(holding.avgCostBasis)}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(holding.currentPrice)}</TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        {formatCurrency(holding.currentValue)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <span
                            className={`font-mono font-medium ${
                              holding.unrealizedGainLoss >= 0 ? "text-success" : "text-destructive"
                            }`}
                          >
                            {formatCurrency(holding.unrealizedGainLoss)}
                          </span>
                          <span
                            className={`text-xs ${
                              holding.unrealizedGainLossPercent >= 0 ? "text-success" : "text-destructive"
                            }`}
                          >
                            {formatPercent(holding.unrealizedGainLossPercent)}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground text-center sm:text-left">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedAndFilteredHoldings.length)} of{" "}
              {sortedAndFilteredHoldings.length} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(isResponsiveMobile ? 3 : 5, totalPages) }, (_, i) => {
                  const maxPages = isResponsiveMobile ? 3 : 5
                  const pageNum = Math.max(1, Math.min(totalPages - (maxPages - 1), currentPage - Math.floor(maxPages / 2))) + i
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
