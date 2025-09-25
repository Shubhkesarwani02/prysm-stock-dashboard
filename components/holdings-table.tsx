"use client"

import { useState, useMemo } from "react"
import { ArrowUpDown, ArrowUp, ArrowDown, Search, TrendingUp, TrendingDown } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Holding } from "@/lib/types"

interface HoldingsTableProps {
  holdings: Holding[]
  searchTerm: string
  onSearchChange: (term: string) => void
}

type SortField = keyof Holding
type SortDirection = "asc" | "desc"

const ITEMS_PER_PAGE = 10

export function HoldingsTable({ holdings, searchTerm, onSearchChange }: HoldingsTableProps) {
  const [sortField, setSortField] = useState<SortField>("currentValue")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [currentPage, setCurrentPage] = useState(1)

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

  const totalPages = Math.ceil(sortedAndFilteredHoldings.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedHoldings = sortedAndFilteredHoldings.slice(startIndex, startIndex + ITEMS_PER_PAGE)

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
    <Card>
      <CardHeader>
        <CardTitle>Holdings</CardTitle>
        <CardDescription>Your current stock positions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search holdings..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {sortedAndFilteredHoldings.length} of {holdings.length} holdings
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 p-0 font-medium"
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
                    className="h-8 p-0 font-medium"
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
                    className="h-8 p-0 font-medium"
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
                    className="h-8 p-0 font-medium"
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
                    className="h-8 p-0 font-medium"
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
                    className="h-8 p-0 font-medium"
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
                    className="h-8 p-0 font-medium"
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

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, sortedAndFilteredHoldings.length)} of{" "}
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
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
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
