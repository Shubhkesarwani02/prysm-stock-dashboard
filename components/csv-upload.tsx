"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, FileText, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { parseCSV } from "@/lib/portfolio-utils"
import { CSVParseError, getErrorMessage } from "@/lib/error-utils"
import type { Trade } from "@/lib/types"

interface CSVUploadProps {
  onDataParsed: (trades: Trade[]) => void
}

export function CSVUpload({ onDataParsed }: CSVUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const resetState = useCallback(() => {
    setError(null)
    setWarning(null)
    setSuccess(null)
    setUploadProgress(0)
  }, [])

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith(".csv")) {
        setError("Please upload a CSV file (.csv extension required)")
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setError("File size too large. Please upload a file smaller than 10MB.")
        return
      }

      setIsProcessing(true)
      resetState()

      try {
        // Simulate progress for better UX
        setUploadProgress(10)

        const content = await file.text()
        setUploadProgress(30)

        if (!content.trim()) {
          throw new CSVParseError("CSV file is empty")
        }

        setUploadProgress(50)

        const trades = parseCSV(content)
        setUploadProgress(80)

        if (trades.length === 0) {
          throw new CSVParseError("No valid trades found in the CSV file")
        }

        // Check for potential issues
        const warnings: string[] = []
        const uniqueSymbols = new Set(trades.map((t) => t.symbol))
        const dateRange = {
          earliest: new Date(Math.min(...trades.map((t) => new Date(t.date).getTime()))),
          latest: new Date(Math.max(...trades.map((t) => new Date(t.date).getTime()))),
        }

        if (uniqueSymbols.size === 1) {
          warnings.push("Portfolio contains only one symbol - consider diversification")
        }

        if (trades.length > 1000) {
          warnings.push("Large number of trades detected - processing may take longer")
        }

        const daysSinceLastTrade = (Date.now() - dateRange.latest.getTime()) / (1000 * 60 * 60 * 24)
        if (daysSinceLastTrade > 365) {
          warnings.push("Latest trade is more than a year old")
        }

        setUploadProgress(100)

        onDataParsed(trades)
        setSuccess(
          `Successfully parsed ${trades.length} trades from ${file.name}. Found ${uniqueSymbols.size} unique symbols.`,
        )

        if (warnings.length > 0) {
          setWarning(warnings.join(". "))
        }
      } catch (err) {
        console.error("CSV parsing error:", err)

        if (err instanceof CSVParseError) {
          let errorMessage = err.message
          if (err.row) {
            errorMessage += ` (Row ${err.row})`
          }
          if (err.column) {
            errorMessage += ` (Column: ${err.column})`
          }
          setError(errorMessage)
        } else {
          setError(`Failed to parse CSV file: ${getErrorMessage(err)}`)
        }
      } finally {
        setIsProcessing(false)
        setTimeout(() => setUploadProgress(0), 1000)
      }
    },
    [onDataParsed, resetState],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 1) {
        setError("Please upload only one CSV file at a time")
        return
      }

      if (files.length > 0) {
        handleFile(files[0])
      }
    },
    [handleFile],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length > 0) {
        handleFile(files[0])
      }
      // Reset input value to allow re-uploading the same file
      e.target.value = ""
    },
    [handleFile],
  )

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Upload Portfolio Data
        </CardTitle>
        <CardDescription>
          Upload a CSV file with your stock trades to analyze your portfolio performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
            ${isProcessing ? "opacity-50 pointer-events-none" : ""}
          `}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
        >
          <div className="flex flex-col items-center gap-4">
            <div
              className={`
              p-3 rounded-full transition-colors
              ${isDragging ? "bg-primary text-primary-foreground" : "bg-muted"}
            `}
            >
              <Upload className="h-6 w-6" />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">
                {isProcessing ? "Processing..." : "Drop your CSV file here, or click to browse"}
              </p>
              <p className="text-xs text-muted-foreground">Expected format: symbol, shares, price, date</p>
              <p className="text-xs text-muted-foreground">Maximum file size: 10MB</p>
            </div>

            <input
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isProcessing}
            />

            <Button variant="outline" size="sm" disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Browse Files"}
            </Button>
          </div>
        </div>

        {isProcessing && uploadProgress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing CSV...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {warning && (
          <Alert className="border-warning text-warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{warning}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-success text-success">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-2">CSV Format Example:</h4>
          <pre className="text-xs text-muted-foreground font-mono">
            {`symbol,shares,price,date
AAPL,10,172.35,2024-06-12
TSLA,5,225.40,2024-06-13
AAPL,-3,180.00,2024-07-01`}
          </pre>
          <div className="mt-2 text-xs text-muted-foreground">
            <p>• Symbol: Stock ticker (e.g., AAPL, TSLA)</p>
            <p>• Shares: Number of shares (positive for buy, negative for sell)</p>
            <p>• Price: Price per share in USD</p>
            <p>• Date: Trade date in YYYY-MM-DD format</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
