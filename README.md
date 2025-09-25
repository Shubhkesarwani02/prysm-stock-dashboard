# prysm-stock-dashboard

A professional, comprehensive stock portfolio analytics platform built with Next.js, TypeScript, and React. Upload your trading data and gain deep insights into your portfolio performance through interactive charts, detailed analytics, and risk assessment tools.

## 🚀 Features

### Portfolio Analytics
- **Comprehensive Performance Tracking** - Real-time portfolio valuation and performance metrics
- **Interactive Charts** - Dynamic visualization of portfolio allocation, performance trends, and risk metrics
- **Holdings Analysis** - Detailed breakdown of individual positions and their contribution to portfolio performance
- **Risk Assessment** - Advanced risk metrics including volatility analysis and sector concentration

### Data Management
- **CSV Upload Support** - Seamless import of trading data from popular brokerages
- **Data Validation** - Robust error handling and data integrity checks
- **Export Functionality** - Export analysis results and portfolio summaries
- **Real-time Processing** - Instant analytics updates as data is uploaded

### User Experience
- **Professional UI/UX** - Clean, modern interface built with shadcn/ui components
- **Responsive Design** - Optimized for desktop and mobile viewing
- **Dark/Light Mode** - Theme support for comfortable viewing in any environment
- **Keyboard Shortcuts** - Efficient navigation and data management shortcuts

## 🛠️ Technology Stack

- **Frontend Framework**: Next.js 14 with App Router
- **Type Safety**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Charts**: Recharts for interactive data visualization
- **State Management**: React Hooks with custom portfolio management
- **Data Processing**: Client-side CSV parsing and validation
- **Build Tool**: Next.js built-in bundler
- **Package Manager**: pnpm (recommended) / npm

## 📦 Installation

### Prerequisites
- Node.js 18.0 or higher
- pnpm (recommended) or npm

### Setup
```bash
# Clone the repository
git clone https://github.com/Shubhkesarwani02/prysm-stock-dashboard.git
cd prysm-stock-dashboard

# Install dependencies
pnpm install
# or
npm install

# Run the development server
pnpm dev
# or
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🚀 Getting Started

### 1. Upload Your Data
- Click the upload area on the home page
- Select your CSV file containing trading data
- The system supports standard brokerage export formats

### 2. Review Your Portfolio
- Automatic parsing and validation of your trading data
- Instant generation of portfolio analytics and visualizations
- Interactive charts for performance, allocation, and risk analysis

### 3. Analyze Performance
- **Portfolio Summary**: Overview of total value, gains/losses, and key metrics
- **Holdings Table**: Detailed view of individual positions with sorting and filtering
- **Performance Charts**: Historical performance tracking with multiple timeframes
- **Risk Metrics**: Volatility analysis, sector allocation, and concentration metrics

## 📊 CSV Data Format

The platform accepts CSV files with the following expected columns:

```csv
Symbol,Shares,Purchase_Price,Current_Price,Purchase_Date,Sector
AAPL,100,150.00,175.00,2023-01-15,Technology
MSFT,50,280.00,320.00,2023-02-01,Technology
```

### Required Fields
- **Symbol**: Stock ticker symbol
- **Shares**: Number of shares held
- **Purchase_Price**: Price per share at purchase
- **Current_Price**: Current market price per share
- **Purchase_Date**: Date of purchase (YYYY-MM-DD format)
- **Sector**: Industry sector classification

## 🎯 Key Components

### Portfolio Dashboard
- Real-time portfolio valuation and performance metrics
- Interactive charts for data visualization
- Holdings table with advanced filtering and sorting
- Risk analysis and sector allocation breakdown

### Data Processing
- Robust CSV parsing with error handling
- Data validation and integrity checks
- Support for multiple date formats
- Automatic sector classification

### Chart Components
- **Portfolio Allocation**: Pie chart showing sector/stock distribution
- **Performance Tracking**: Line charts for historical performance
- **Risk Metrics**: Bar charts for volatility and risk analysis
- **Holdings Performance**: Individual stock performance visualization

## ⌨️ Keyboard Shortcuts

- `Esc` - Clear all portfolio data (with confirmation)
- `Ctrl+E` - Export portfolio data
- `Ctrl+F` - Focus search/filter functionality

## 🏗️ Project Structure

```
prysm-stock-dashboard/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── charts/           # Chart components
│   ├── csv-upload.tsx    # Data upload component
│   ├── portfolio-dashboard.tsx
│   └── ...
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and constants
│   ├── constants.ts      # Application constants
│   ├── portfolio-utils.ts # Portfolio calculation utilities
│   ├── types.ts          # TypeScript type definitions
│   └── utils.ts          # General utilities
└── public/               # Static assets
```

## 🧪 Development

### Available Scripts
```bash
# Development server
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Linting
pnpm lint
```

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting (recommended)
- Strict type checking enabled

## 🔧 Configuration

### Environment Variables
No environment variables are required for basic functionality. The application runs entirely client-side for data privacy and security.

### Customization
- Modify `lib/constants.ts` for application settings
- Update chart colors in `lib/constants.ts` under `CHART_COLORS`
- Customize sectors in the `SECTORS` constant
- Adjust precision settings for currency and percentage display

## 🛡️ Security & Privacy

- **Client-Side Processing**: All data processing occurs in the browser
- **No Data Transmission**: Your portfolio data never leaves your device
- **No External APIs**: No third-party services for data processing
- **Local Storage**: Optional local caching for improved performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain component modularity
- Write descriptive commit messages
- Update documentation for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, questions, or feature requests:
- Open an issue on GitHub
- Review the documentation
- Check existing issues for similar problems

## 🎯 Roadmap

- [ ] Multi-currency support
- [ ] Advanced risk metrics (Sharpe ratio, Beta, etc.)
- [ ] Portfolio comparison tools
- [ ] Export to PDF reports
- [ ] Integration with popular brokerages
- [ ] Real-time price updates
- [ ] Advanced charting options
- [ ] Portfolio optimization suggestions

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
