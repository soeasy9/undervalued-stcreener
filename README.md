# Undervalued Stock Screener

A comprehensive web application built with Next.js, TypeScript, and Tailwind CSS that allows users to screen for potentially undervalued stocks from USA and Cyprus markets based on key financial metrics.

## Features

- **Multi-Market Support**: Screen stocks from USA and Cyprus markets
- **Real-time Filtering**: Filter stocks by P/E Ratio, P/B Ratio, and Dividend Yield
- **Interactive Charts**: TradingView integration for detailed stock analysis
- **Sortable Stock Table**: View and sort stocks by various financial metrics
- **Key Financial Metrics**: 
  - P/E Ratio (Price-to-Earnings)
  - P/B Ratio (Price-to-Book)
  - D/E Ratio (Debt-to-Equity)
  - Dividend Yield
  - PEG Ratio (Price/Earnings-to-Growth)
- **Modern UI**: Dark theme with responsive design
- **Loading States**: Smooth user experience with loading indicators
- **Null Value Handling**: Properly displays "N/A" for missing data

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect, useMemo)
- **Charts**: TradingView Widget
- **Sliders**: rc-slider for filtering
- **API**: Finnhub for financial data

## Project Structure

```
undervalued-screener/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── stock/
│   │       └── [ticker]/
│   │           └── page.tsx
│   ├── components/
│   │   ├── ExchangeSelector.tsx
│   │   ├── FilterBar.tsx
│   │   ├── StockTable.tsx
│   │   ├── TradingViewWidget.tsx
│   │   └── BackButton.tsx
│   └── services/
│       └── fetchStockData.ts
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd undervalued-screener
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory:
```bash
FINNHUB_API_KEY='YOUR_API_KEY_HERE'
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Select Market**: Use the dropdown to choose between USA and Cyprus markets
2. **Filter Stocks**: Use the sliders to filter stocks by P/E Ratio, P/B Ratio, and Dividend Yield
3. **View Stocks**: The table will display stocks for the selected market
4. **Sort Data**: Click on any column header to sort by that metric
5. **View Details**: Click on any stock row to see detailed information and TradingView chart
6. **Analyze Metrics**: Review the financial ratios to identify potentially undervalued stocks

## Financial Metrics Explained

- **P/E Ratio**: Price-to-Earnings ratio - Lower values may indicate undervaluation
- **P/B Ratio**: Price-to-Book ratio - Compares market value to book value
- **D/E Ratio**: Debt-to-Equity ratio - Measures financial leverage
- **Dividend Yield**: Annual dividend as percentage of stock price
- **PEG Ratio**: Price/Earnings-to-Growth ratio - Accounts for growth in valuation

## API Integration

The application integrates with the Finnhub API for real financial data. The service includes:

1. **Market Data**: Fetches stock symbols from USA and Cyprus markets
2. **Company Profiles**: Gets company information and financial metrics
3. **Fallback Data**: Comprehensive mock data when API is unavailable
4. **Error Handling**: Graceful fallbacks and error management

The `fetchUndervaluedStocks` function in `src/services/fetchStockData.ts` handles:
- Stock symbol fetching
- Company profile data
- Financial metrics calculation
- Mock data fallbacks

## Customization

### Adding New Markets
Edit the `exchanges` array in `src/components/ExchangeSelector.tsx`

### Modifying Financial Metrics
Update the `Stock` interface in `src/services/fetchStockData.ts`

### Adding New Filters
Modify the `FilterBar` component and update the filtering logic in `src/app/page.tsx`

### Styling Changes
Modify Tailwind classes or update `tailwind.config.js`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Disclaimer

This application is for educational and informational purposes only. It does not constitute financial advice. Always conduct your own research and consult with financial professionals before making investment decisions.
