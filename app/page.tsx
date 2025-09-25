"use client"
import { CSVUpload } from "@/components/csv-upload"
import { PortfolioDashboard } from "@/components/portfolio-dashboard"
import { usePortfolio } from "@/hooks/use-portfolio"
import { useEffect } from "react"

export default function HomePage() {
  const { portfolioData, isLoading, updatePortfolioData, clearData } = usePortfolio()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Allow Escape key to clear data when portfolio is loaded
      if (event.key === "Escape" && portfolioData && !isLoading) {
        const confirmed = window.confirm("Are you sure you want to clear all portfolio data?")
        if (confirmed) {
          clearData()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [portfolioData, isLoading, clearData])

  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        role="status"
        aria-label="Loading portfolio data"
      >
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading portfolio data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-8">
        {!portfolioData ? (
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center px-4 sm:px-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance mb-3 sm:mb-4 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                Portfolio Analytics Dashboard
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground text-pretty max-w-2xl mx-auto px-2 sm:px-0">
                Upload your trading data and get comprehensive insights into your portfolio performance with interactive
                charts and detailed analytics.
              </p>
              <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-muted/50">
                  <span className="w-2 h-2 bg-chart-1 rounded-full"></span>
                  Interactive Charts
                </div>
                <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-muted/50">
                  <span className="w-2 h-2 bg-chart-2 rounded-full"></span>
                  Performance Analytics
                </div>
                <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-muted/50 sm:col-span-2 lg:col-span-1">
                  <span className="w-2 h-2 bg-chart-3 rounded-full"></span>
                  Risk Assessment
                </div>
              </div>
            </div>
            <CSVUpload onDataParsed={updatePortfolioData} />
          </div>
        ) : (
          <PortfolioDashboard portfolioData={portfolioData} onClearData={clearData} />
        )}
      </div>
      {portfolioData && (
        <div className="fixed bottom-2 sm:bottom-4 right-2 sm:right-4 text-xs text-muted-foreground bg-muted/80 backdrop-blur-sm px-2 py-1 rounded z-50">
          Press <kbd className="px-1 py-0.5 bg-background rounded text-xs">Esc</kbd> to clear data
        </div>
      )}
    </div>
  )
}
