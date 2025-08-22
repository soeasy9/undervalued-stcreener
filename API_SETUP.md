# Finnhub API Setup Guide

## Step 1: Get Your Finnhub API Key

1. Go to [Finnhub.io](https://finnhub.io/)
2. Sign up for a free account
3. Get your API key from the dashboard

## Step 2: Create Environment File

Create a `.env.local` file in the root directory of your project with:

```
FINNHUB_API_KEY=your_actual_api_key_here
```

Replace `your_actual_api_key_here` with your real Finnhub API key.

## Step 3: Restart the Development Server

After adding the API key, restart your development server:

```bash
npm run dev
```

## API Features

The application now uses real Finnhub data with:

- **Stock Symbols**: Fetches all US stocks and filters by sector
- **Company Profiles**: Gets company names and basic info
- **Financial Metrics**: P/E Ratio, P/B Ratio, Dividend Yield
- **Rate Limiting**: Limited to top 10 stocks per industry to avoid API limits

## Available Metrics

- ✅ P/E Ratio (Price-to-Earnings)
- ✅ P/B Ratio (Price-to-Book)
- ✅ Dividend Yield
- ❌ D/E Ratio (Not available in free tier)
- ❌ PEG Ratio (Not available in free tier)

## Error Handling

If you see empty results, check:
1. API key is correct
2. API key is in `.env.local` file
3. No network connectivity issues
4. API rate limits (free tier has limits)

## Free Tier Limitations

- 60 API calls per minute
- Limited financial metrics
- Some advanced ratios not available
