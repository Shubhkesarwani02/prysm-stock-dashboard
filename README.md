# Prysm Stock Dashboard

A comprehensive portfolio analytics platform built with Next.js, TypeScript, and React. Upload CSV trading data and analyze portfolio performance through interactive visualizations and detailed metrics.

**🔗 Live Demo**: [https://prysm-stock-dashboard.vercel.app/](https://prysm-stock-dashboard.vercel.app/)

## Features

- **Portfolio Analytics**: Real-time valuation, performance tracking, and detailed position analysis
- **Interactive Visualizations**: Dynamic charts for allocation, performance trends, and risk metrics using Recharts
- **CSV Data Import**: Seamless upload and validation of trading data from brokerages
- **Risk Assessment**: Volatility analysis, sector concentration, and portfolio risk metrics
- **Responsive Design**: Mobile-first design optimized for all devices (phones, tablets, desktops)
- **Modern UI/UX**: Professional interface with shadcn/ui components and dark/light mode support

## Technology Stack

- **Next.js 14** with App Router for modern React development
- **TypeScript** for type safety and better developer experience
- **Tailwind CSS + shadcn/ui** for consistent, accessible component design
- **Recharts** for interactive data visualizations
- **Client-side processing** for data privacy and security

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/Shubhkesarwani02/prysm-stock-dashboard.git
cd prysm-stock-dashboard

# Install dependencies
npm install
# or
pnpm install

# Run development server
npm run dev
# or
pnpm dev
```

Access the application at `http://localhost:3000`

### Production Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

## CSV Data Format

Expected format for portfolio data upload:

```csv
Symbol,Shares,Purchase_Price,Current_Price,Purchase_Date,Sector
AAPL,100,150.00,175.00,2023-01-15,Technology
MSFT,50,280.00,320.00,2023-02-01,Technology
```

**Required columns**: Symbol, Shares, Purchase_Price, Current_Price, Purchase_Date (YYYY-MM-DD), Sector

## Architecture Decisions

**Client-Side Data Processing**: All portfolio calculations and CSV parsing occur in the browser to ensure data privacy and eliminate server costs.

**TypeScript Implementation**: Comprehensive type safety across components, hooks, and utilities for better maintainability and developer experience.

**Component Architecture**: Modular design with reusable UI components, custom hooks for state management, and separation of concerns between data processing and presentation layers.

**Recharts Integration**: Chosen for robust charting capabilities with good TypeScript support and customization options for financial data visualization.

## Extra Features Implemented

- **Enhanced Error Handling**: Comprehensive error boundaries and validation with user-friendly error messages
- **Keyboard Shortcuts**: Quick actions with `Esc` for data clearing and export functionality
- **Advanced Filtering**: Multi-criteria filtering and sorting in holdings table with search capabilities
- **Theme Support**: Complete dark/light mode implementation with system preference detection
- **Export Functionality**: Portfolio data export with formatted JSON output
- **Comprehensive Responsive Design**: 
  - **Mobile-First Approach**: Card-based layouts for mobile devices (< 768px)
  - **Tablet Optimization**: Balanced 2-column grids for tablets (768px-1023px)
  - **Desktop Experience**: Full-featured multi-column layouts for desktops (≥ 1024px)
  - **Touch-Friendly Interactions**: Minimum 44px touch targets and gesture support
  - **Adaptive Components**: Tables transform to cards on mobile, collapsible navigation
  - **Custom Responsive Hooks**: `useResponsive()` and enhanced `useIsMobile()` for device detection
- **Performance Optimization**: Efficient re-rendering with React hooks and memoization
- **Accessibility**: WCAG-compliant components with proper ARIA labels and keyboard navigation

## License

MIT License - see [LICENSE](LICENSE) for details.
