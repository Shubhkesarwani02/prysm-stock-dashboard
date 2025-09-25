export const APP_CONFIG = {
  name: "prysm-stock-dashboard",
  version: "1.0.0",
  maxFileSize: 10 * 1024 * 1024, // 10MB
  supportedFormats: [".csv"],
  defaultDateFormat: "YYYY-MM-DD",
  currency: "USD",
  precision: {
    percentage: 2,
    currency: 2,
    shares: 4,
  },
} as const

export const CHART_COLORS = {
  primary: "hsl(var(--chart-1))",
  secondary: "hsl(var(--chart-2))",
  tertiary: "hsl(var(--chart-3))",
  quaternary: "hsl(var(--chart-4))",
  quinary: "hsl(var(--chart-5))",
  positive: "hsl(142 76% 36%)",
  negative: "hsl(0 84% 60%)",
  neutral: "hsl(var(--muted-foreground))",
} as const

export const SECTORS = [
  "Technology",
  "Healthcare",
  "Financial Services",
  "Consumer Cyclical",
  "Communication Services",
  "Industrials",
  "Consumer Defensive",
  "Energy",
  "Utilities",
  "Real Estate",
  "Basic Materials",
  "Other",
] as const

export const KEYBOARD_SHORTCUTS = {
  clearData: "Escape",
  exportData: "Ctrl+E",
  focusSearch: "Ctrl+F",
} as const
