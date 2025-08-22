// Stock interface definition
export interface Stock {
  ticker: string;
  name: string;
  peRatio: number | null;
  pbRatio: number | null;
  deRatio: number | null;
  dividendYield: number | null;
  pegRatio: number | null;
}



export async function fetchUndervaluedStocks(exchange: string = 'US'): Promise<Stock[]> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || process.env.FINNHUB_API_KEY;
    
    if (!apiKey) {
      console.error('Finnhub API key not found. Please add FINNHUB_API_KEY to your .env.local file');
      console.log('Using mock data as fallback');
      return getMockStocks(exchange);
    }

    console.log(`Fetching stocks for exchange: ${exchange}`);

    // Step 1: Fetch stocks by exchange
    // Configure exchange-specific parameters
    const exchangeConfig = {
      'US': { exchange: 'US', mic: 'XNYS', currency: 'USD' },
      'CY': { exchange: 'CY', mic: '', currency: 'EUR' }
    };
    
    const config = exchangeConfig[exchange as keyof typeof exchangeConfig] || exchangeConfig['US'];
    const symbolsUrl = `https://finnhub.io/api/v1/stock/symbol?exchange=${config.exchange}${config.mic ? `&mic=${config.mic}` : ''}&securityType=Common%20Stock&currency=${config.currency}&token=${apiKey}`;
    
    console.log('Fetching from URL:', symbolsUrl);
    
    const symbolsResponse = await fetch(symbolsUrl, { next: { revalidate: 3600 } });
    const symbolsData = await symbolsResponse.json();

    console.log('API Response:', symbolsData);
    console.log('Response type:', typeof symbolsData);
    console.log('Is array:', Array.isArray(symbolsData));
    console.log('Response length:', symbolsData?.length);

    if (!Array.isArray(symbolsData)) {
      console.error('Failed to fetch stock symbols - response is not an array');
      return [];
    }

    if (symbolsData.length === 0) {
      console.log(`No stocks returned from API for exchange: ${exchange}`);
      return [];
    }

    // Get all available tickers from the exchange (or limit to a reasonable number for performance)
    const maxStocks = exchange === 'US' ? 100 : 50; // More US stocks, fewer Cyprus stocks for performance
    const exchangeStocks = symbolsData
      .slice(0, maxStocks)
      .map((stock: any) => stock.symbol)
      .filter(Boolean); // Remove any undefined/null symbols

    console.log(`Found ${exchangeStocks.length} stocks:`, exchangeStocks);

    if (exchangeStocks.length === 0) {
      console.log(`No valid stock symbols found for exchange: ${exchange}`);
      return [];
    }

    // Step 2: Fetch metrics for each stock
    const stockPromises = exchangeStocks.map(async (ticker: string) => {
      try {
        const [profileResponse, metricsResponse] = await Promise.all([
          fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${apiKey}`, { next: { revalidate: 3600 } }),
          fetch(`https://finnhub.io/api/v1/stock/metric?symbol=${ticker}&metric=all&token=${apiKey}`, { next: { revalidate: 3600 } })
        ]);

        const profileData = await profileResponse.json();
        const metricsData = await metricsResponse.json();

        return {
          ticker,
          profile: profileData,
          metrics: metricsData
        };
      } catch (error) {
        console.error(`Error fetching data for ${ticker}:`, error);
        return null;
      }
    });

    const stockData = await Promise.all(stockPromises);
    const validStockData = stockData.filter(data => data !== null);

    // Step 3: Combine and format the data
    const formattedStocks: Stock[] = validStockData.map((data: any) => {
      const profile = data.profile;
      const metrics = data.metrics;

      return {
        ticker: data.ticker,
        name: profile?.name || data.ticker,
        peRatio: metrics?.metric?.peNormalizedAnnual || null,
        pbRatio: metrics?.metric?.pbAnnual || null,
        deRatio: null, // Not available in free tier
        dividendYield: metrics?.metric?.dividendYieldIndicatedAnnual || null,
        pegRatio: null // Not available in free tier
      };
    });

    // If we have no valid stocks, provide some mock data for demonstration
    if (formattedStocks.length === 0) {
      console.log('No valid stocks found from API, providing mock data');
      return getMockStocks(exchange);
    }

    console.log(`Successfully formatted ${formattedStocks.length} stocks from API`);
    return formattedStocks;
  } catch (error) {
    console.error('Error fetching undervalued stocks:', error);
    console.log('API failed, using mock data as fallback');
    // Fallback to mock data if API fails
    return getMockStocks(exchange);
  }
}

// Mock data function for fallback
function getMockStocks(exchange: string): Stock[] {
  if (exchange === 'CY') {
    return [
      // Banking & Financial Services
      {
        ticker: 'BOC',
        name: 'Bank of Cyprus Holdings',
        peRatio: 8.5,
        pbRatio: 0.75,
        deRatio: null,
        dividendYield: 2.1,
        pegRatio: null
      },
      {
        ticker: 'HB',
        name: 'Hellenic Bank',
        peRatio: 12.3,
        pbRatio: 0.9,
        deRatio: null,
        dividendYield: 1.8,
        pegRatio: null
      },
      {
        ticker: 'CCB',
        name: 'Cyprus Cooperative Bank',
        peRatio: 6.8,
        pbRatio: 0.45,
        deRatio: null,
        dividendYield: 3.2,
        pegRatio: null
      },
      {
        ticker: 'ANC',
        name: 'Ancoria Bank',
        peRatio: 14.2,
        pbRatio: 1.1,
        deRatio: null,
        dividendYield: 1.5,
        pegRatio: null
      },
      // Real Estate & Development
      {
        ticker: 'ARISTO',
        name: 'Aristo Developers',
        peRatio: 15.2,
        pbRatio: 1.2,
        deRatio: null,
        dividendYield: 0.5,
        pegRatio: null
      },
      {
        ticker: 'KYPROS',
        name: 'Kypros Development',
        peRatio: 11.9,
        pbRatio: 0.95,
        deRatio: null,
        dividendYield: 3.1,
        pegRatio: null
      },
      {
        ticker: 'PAPHOS',
        name: 'Paphos Development',
        peRatio: 18.7,
        pbRatio: 1.8,
        deRatio: null,
        dividendYield: 1.9,
        pegRatio: null
      },
      {
        ticker: 'LARNACA',
        name: 'Larnaca Development',
        peRatio: 16.4,
        pbRatio: 1.4,
        deRatio: null,
        dividendYield: 2.3,
        pegRatio: null
      },
      {
        ticker: 'LIMASSOL',
        name: 'Limassol Marina',
        peRatio: 22.1,
        pbRatio: 2.6,
        deRatio: null,
        dividendYield: 0.8,
        pegRatio: null
      },
      // Investment & Holdings
      {
        ticker: 'DEMETRA',
        name: 'Demetra Holdings',
        peRatio: 14.7,
        pbRatio: 1.5,
        deRatio: null,
        dividendYield: 2.5,
        pegRatio: null
      },
      {
        ticker: 'CYPRUS',
        name: 'Cyprus Investment Holdings',
        peRatio: 13.8,
        pbRatio: 1.3,
        deRatio: null,
        dividendYield: 2.8,
        pegRatio: null
      },
      {
        ticker: 'EUROBANK',
        name: 'Eurobank Cyprus',
        peRatio: 9.2,
        pbRatio: 0.8,
        deRatio: null,
        dividendYield: 2.9,
        pegRatio: null
      },
      // Industrial & Materials
      {
        ticker: 'VASSILIKO',
        name: 'Vassiliko Cement Works',
        peRatio: 13.2,
        pbRatio: 1.1,
        deRatio: null,
        dividendYield: 2.8,
        pegRatio: null
      },
      {
        ticker: 'ASTRO',
        name: 'Astromeritis Mines',
        peRatio: 22.1,
        pbRatio: 1.8,
        deRatio: null,
        dividendYield: 1.2,
        pegRatio: null
      },
      {
        ticker: 'CLARIDGE',
        name: 'Claridge Public Limited',
        peRatio: 18.4,
        pbRatio: 2.1,
        deRatio: null,
        dividendYield: 0.8,
        pegRatio: null
      },
      {
        ticker: 'CEMENT',
        name: 'Cyprus Cement',
        peRatio: 12.6,
        pbRatio: 1.0,
        deRatio: null,
        dividendYield: 3.4,
        pegRatio: null
      },
      {
        ticker: 'MARBLE',
        name: 'Cyprus Marble',
        peRatio: 19.3,
        pbRatio: 2.3,
        deRatio: null,
        dividendYield: 1.1,
        pegRatio: null
      },
      // Technology & Services
      {
        ticker: 'LOGICOM',
        name: 'Logicom Public Ltd',
        peRatio: 19.8,
        pbRatio: 2.4,
        deRatio: null,
        dividendYield: 1.6,
        pegRatio: null
      },
      {
        ticker: 'ELMA',
        name: 'Elma Electronics',
        peRatio: 26.3,
        pbRatio: 3.2,
        deRatio: null,
        dividendYield: null,
        pegRatio: null
      },
      {
        ticker: 'CYTA',
        name: 'Cyprus Telecommunications Authority',
        peRatio: 11.4,
        pbRatio: 1.6,
        deRatio: null,
        dividendYield: 4.2,
        pegRatio: null
      },
      {
        ticker: 'CYBER',
        name: 'Cyprus Cyber Security',
        peRatio: 28.7,
        pbRatio: 4.1,
        deRatio: null,
        dividendYield: null,
        pegRatio: null
      },
      // Tourism & Hospitality
      {
        ticker: 'HOTELS',
        name: 'Cyprus Hotels Group',
        peRatio: 16.9,
        pbRatio: 1.7,
        deRatio: null,
        dividendYield: 2.7,
        pegRatio: null
      },
      {
        ticker: 'RESORT',
        name: 'Aphrodite Resort',
        peRatio: 24.5,
        pbRatio: 2.9,
        deRatio: null,
        dividendYield: 1.3,
        pegRatio: null
      },
      {
        ticker: 'CRUISE',
        name: 'Cyprus Cruise Lines',
        peRatio: 21.3,
        pbRatio: 2.2,
        deRatio: null,
        dividendYield: 1.8,
        pegRatio: null
      },
      // Shipping & Transportation
      {
        ticker: 'SHIPPING',
        name: 'Cyprus Shipping',
        peRatio: 8.9,
        pbRatio: 0.7,
        deRatio: null,
        dividendYield: 5.1,
        pegRatio: null
      },
      {
        ticker: 'MARITIME',
        name: 'Maritime Cyprus',
        peRatio: 15.6,
        pbRatio: 1.9,
        deRatio: null,
        dividendYield: 2.4,
        pegRatio: null
      },
      {
        ticker: 'PORTS',
        name: 'Cyprus Ports Authority',
        peRatio: 12.8,
        pbRatio: 1.2,
        deRatio: null,
        dividendYield: 3.6,
        pegRatio: null
      },
      // Energy & Utilities
      {
        ticker: 'EAC',
        name: 'Electricity Authority of Cyprus',
        peRatio: 10.7,
        pbRatio: 0.9,
        deRatio: null,
        dividendYield: 4.8,
        pegRatio: null
      },
      {
        ticker: 'SOLAR',
        name: 'Cyprus Solar Energy',
        peRatio: 31.2,
        pbRatio: 3.8,
        deRatio: null,
        dividendYield: 0.6,
        pegRatio: null
      },
      {
        ticker: 'WIND',
        name: 'Cyprus Wind Power',
        peRatio: 18.9,
        pbRatio: 2.1,
        deRatio: null,
        dividendYield: 2.2,
        pegRatio: null
      },
      // Food & Beverages
      {
        ticker: 'WINERY',
        name: 'Cyprus Winery',
        peRatio: 14.3,
        pbRatio: 1.4,
        deRatio: null,
        dividendYield: 2.9,
        pegRatio: null
      },
      {
        ticker: 'DAIRY',
        name: 'Cyprus Dairy Products',
        peRatio: 17.6,
        pbRatio: 2.0,
        deRatio: null,
        dividendYield: 2.1,
        pegRatio: null
      },
      {
        ticker: 'OLIVE',
        name: 'Cyprus Olive Oil',
        peRatio: 20.4,
        pbRatio: 2.5,
        deRatio: null,
        dividendYield: 1.7,
        pegRatio: null
      },
      // Healthcare & Pharmaceuticals
      {
        ticker: 'PHARMA',
        name: 'Cyprus Pharmaceuticals',
        peRatio: 25.8,
        pbRatio: 3.4,
        deRatio: null,
        dividendYield: 1.4,
        pegRatio: null
      },
      {
        ticker: 'MEDICAL',
        name: 'Cyprus Medical Devices',
        peRatio: 29.1,
        pbRatio: 4.2,
        deRatio: null,
        dividendYield: 0.9,
        pegRatio: null
      },
      {
        ticker: 'HOSPITAL',
        name: 'Cyprus General Hospital',
        peRatio: 13.5,
        pbRatio: 1.6,
        deRatio: null,
        dividendYield: 3.3,
        pegRatio: null
      },
      // Insurance & Financial Services
      {
        ticker: 'INSURANCE',
        name: 'Cyprus Insurance Group',
        peRatio: 11.8,
        pbRatio: 1.3,
        deRatio: null,
        dividendYield: 3.7,
        pegRatio: null
      },
      {
        ticker: 'PENSION',
        name: 'Cyprus Pension Fund',
        peRatio: 9.6,
        pbRatio: 0.8,
        deRatio: null,
        dividendYield: 4.1,
        pegRatio: null
      },
      {
        ticker: 'INVESTMENT',
        name: 'Cyprus Investment Fund',
        peRatio: 16.2,
        pbRatio: 1.8,
        deRatio: null,
        dividendYield: 2.6,
        pegRatio: null
      },
      // Education & Media
      {
        ticker: 'UNIVERSITY',
        name: 'Cyprus University',
        peRatio: 22.7,
        pbRatio: 2.8,
        deRatio: null,
        dividendYield: 1.2,
        pegRatio: null
      },
      {
        ticker: 'MEDIA',
        name: 'Cyprus Broadcasting Corporation',
        peRatio: 15.1,
        pbRatio: 1.7,
        deRatio: null,
        dividendYield: 2.8,
        pegRatio: null
      },
      {
        ticker: 'NEWSPAPER',
        name: 'Cyprus Daily News',
        peRatio: 18.3,
        pbRatio: 2.2,
        deRatio: null,
        dividendYield: 2.0,
        pegRatio: null
      },
      // Construction & Engineering
      {
        ticker: 'CONSTRUCTION',
        name: 'Cyprus Construction',
        peRatio: 12.4,
        pbRatio: 1.1,
        deRatio: null,
        dividendYield: 3.0,
        pegRatio: null
      },
      {
        ticker: 'ENGINEERING',
        name: 'Cyprus Engineering',
        peRatio: 19.6,
        pbRatio: 2.4,
        deRatio: null,
        dividendYield: 1.8,
        pegRatio: null
      },
      {
        ticker: 'ARCHITECTURE',
        name: 'Cyprus Architecture',
        peRatio: 23.8,
        pbRatio: 3.1,
        deRatio: null,
        dividendYield: 1.1,
        pegRatio: null
      }
    ];
  } else {
    return [
      // Technology Giants
      {
        ticker: 'AAPL',
        name: 'Apple Inc.',
        peRatio: 28.5,
        pbRatio: 45.2,
        deRatio: null,
        dividendYield: 0.6,
        pegRatio: null
      },
      {
        ticker: 'MSFT',
        name: 'Microsoft Corp.',
        peRatio: 35.1,
        pbRatio: 12.8,
        deRatio: null,
        dividendYield: 0.8,
        pegRatio: null
      },
      {
        ticker: 'GOOGL',
        name: 'Alphabet Inc.',
        peRatio: 25.3,
        pbRatio: 7.1,
        deRatio: null,
        dividendYield: null,
        pegRatio: null
      },
      {
        ticker: 'NVDA',
        name: 'NVIDIA Corp.',
        peRatio: 75.8,
        pbRatio: 60.3,
        deRatio: null,
        dividendYield: 0.03,
        pegRatio: null
      },
      {
        ticker: 'TSLA',
        name: 'Tesla Inc.',
        peRatio: 58.2,
        pbRatio: 15.4,
        deRatio: null,
        dividendYield: null,
        pegRatio: null
      },
      {
        ticker: 'META',
        name: 'Meta Platforms Inc.',
        peRatio: 22.7,
        pbRatio: 6.8,
        deRatio: null,
        dividendYield: 0.4,
        pegRatio: null
      },
      {
        ticker: 'AMZN',
        name: 'Amazon.com Inc.',
        peRatio: 42.3,
        pbRatio: 8.1,
        deRatio: null,
        dividendYield: null,
        pegRatio: null
      },
      {
        ticker: 'NFLX',
        name: 'Netflix Inc.',
        peRatio: 35.9,
        pbRatio: 5.2,
        deRatio: null,
        dividendYield: null,
        pegRatio: null
      },
      // Financial Sector
      {
        ticker: 'JPM',
        name: 'JPMorgan Chase & Co.',
        peRatio: 11.2,
        pbRatio: 1.6,
        deRatio: null,
        dividendYield: 2.8,
        pegRatio: null
      },
      {
        ticker: 'BAC',
        name: 'Bank of America Corp.',
        peRatio: 13.4,
        pbRatio: 1.2,
        deRatio: null,
        dividendYield: 3.1,
        pegRatio: null
      },
      {
        ticker: 'WFC',
        name: 'Wells Fargo & Company',
        peRatio: 12.8,
        pbRatio: 1.1,
        deRatio: null,
        dividendYield: 2.9,
        pegRatio: null
      },
      {
        ticker: 'GS',
        name: 'Goldman Sachs Group Inc.',
        peRatio: 10.5,
        pbRatio: 1.0,
        deRatio: null,
        dividendYield: 2.4,
        pegRatio: null
      },
      // Healthcare
      {
        ticker: 'JNJ',
        name: 'Johnson & Johnson',
        peRatio: 15.6,
        pbRatio: 5.8,
        deRatio: null,
        dividendYield: 3.0,
        pegRatio: null
      },
      {
        ticker: 'PFE',
        name: 'Pfizer Inc.',
        peRatio: 13.2,
        pbRatio: 1.9,
        deRatio: null,
        dividendYield: 4.1,
        pegRatio: null
      },
      {
        ticker: 'ABBV',
        name: 'AbbVie Inc.',
        peRatio: 14.8,
        pbRatio: 4.3,
        deRatio: null,
        dividendYield: 3.8,
        pegRatio: null
      },
      {
        ticker: 'MRK',
        name: 'Merck & Co. Inc.',
        peRatio: 16.1,
        pbRatio: 6.2,
        deRatio: null,
        dividendYield: 2.7,
        pegRatio: null
      },
      // Consumer Goods
      {
        ticker: 'KO',
        name: 'Coca-Cola Company',
        peRatio: 25.4,
        pbRatio: 9.8,
        deRatio: null,
        dividendYield: 3.2,
        pegRatio: null
      },
      {
        ticker: 'PEP',
        name: 'PepsiCo Inc.',
        peRatio: 26.7,
        pbRatio: 12.1,
        deRatio: null,
        dividendYield: 2.9,
        pegRatio: null
      },
      {
        ticker: 'PG',
        name: 'Procter & Gamble Co.',
        peRatio: 24.3,
        pbRatio: 7.9,
        deRatio: null,
        dividendYield: 2.5,
        pegRatio: null
      },
      {
        ticker: 'WMT',
        name: 'Walmart Inc.',
        peRatio: 27.8,
        pbRatio: 5.1,
        deRatio: null,
        dividendYield: 1.5,
        pegRatio: null
      },
      // Energy
      {
        ticker: 'XOM',
        name: 'Exxon Mobil Corp.',
        peRatio: 14.2,
        pbRatio: 1.8,
        deRatio: null,
        dividendYield: 5.9,
        pegRatio: null
      },
      {
        ticker: 'CVX',
        name: 'Chevron Corp.',
        peRatio: 15.3,
        pbRatio: 1.9,
        deRatio: null,
        dividendYield: 3.4,
        pegRatio: null
      },
      // Industrial
      {
        ticker: 'BA',
        name: 'Boeing Company',
        peRatio: null,
        pbRatio: 8.2,
        deRatio: null,
        dividendYield: null,
        pegRatio: null
      },
      {
        ticker: 'CAT',
        name: 'Caterpillar Inc.',
        peRatio: 16.8,
        pbRatio: 5.4,
        deRatio: null,
        dividendYield: 2.1,
        pegRatio: null
      },
      {
        ticker: 'GE',
        name: 'General Electric Co.',
        peRatio: 18.9,
        pbRatio: 2.3,
        deRatio: null,
        dividendYield: 0.4,
        pegRatio: null
      },
      // Telecommunications
      {
        ticker: 'VZ',
        name: 'Verizon Communications',
        peRatio: 8.9,
        pbRatio: 1.9,
        deRatio: null,
        dividendYield: 6.8,
        pegRatio: null
      },
      {
        ticker: 'T',
        name: 'AT&T Inc.',
        peRatio: 7.2,
        pbRatio: 1.1,
        deRatio: null,
        dividendYield: 7.1,
        pegRatio: null
      },
      // Real Estate & Utilities
      {
        ticker: 'NEE',
        name: 'NextEra Energy Inc.',
        peRatio: 21.4,
        pbRatio: 2.8,
        deRatio: null,
        dividendYield: 3.1,
        pegRatio: null
      },
      {
        ticker: 'DUK',
        name: 'Duke Energy Corp.',
        peRatio: 18.6,
        pbRatio: 1.4,
        deRatio: null,
        dividendYield: 4.2,
        pegRatio: null
      },
      // Retail & Entertainment
      {
        ticker: 'HD',
        name: 'Home Depot Inc.',
        peRatio: 24.1,
        pbRatio: 13.2,
        deRatio: null,
        dividendYield: 2.4,
        pegRatio: null
      },
      {
        ticker: 'DIS',
        name: 'Walt Disney Company',
        peRatio: 39.7,
        pbRatio: 1.5,
        deRatio: null,
        dividendYield: 0.0,
        pegRatio: null
      }
    ];
  }
}

export async function fetchStockDetails(ticker: string): Promise<{
  logo?: string;
  description?: string;
  chartData?: Array<{ date: string; price: number }>;
}> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || process.env.FINNHUB_API_KEY;
    
    if (!apiKey) {
      console.error('Finnhub API key not found');
      return {};
    }

    // Fetch company profile for logo and description
    const profileUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${apiKey}`;
    const profileResponse = await fetch(profileUrl, { next: { revalidate: 3600 } });
    const profileData = await profileResponse.json();

    // Fetch historical price data for the last year
    const oneYearAgo = Math.floor((Date.now() - 365 * 24 * 60 * 60 * 1000) / 1000);
    const now = Math.floor(Date.now() / 1000);
    
    const candleUrl = `https://finnhub.io/api/v1/stock/candle?symbol=${ticker}&resolution=D&from=${oneYearAgo}&to=${now}&token=${apiKey}`;
    const candleResponse = await fetch(candleUrl, { next: { revalidate: 3600 } });
    const candleData = await candleResponse.json();

    // Format chart data
    let chartData: Array<{ date: string; price: number }> = [];
    if (candleData.s === 'ok' && candleData.t && candleData.c) {
      chartData = candleData.t.map((timestamp: number, index: number) => ({
        date: new Date(timestamp * 1000).toISOString().split('T')[0],
        price: candleData.c[index]
      }));
    }

    return {
      logo: profileData?.logo || undefined,
      description: profileData?.finnhubIndustry || profileData?.weburl ? 
        `${profileData.finnhubIndustry || 'Company'}${profileData.weburl ? ` - ${profileData.weburl}` : ''}` : 
        undefined,
      chartData: chartData.length > 0 ? chartData : undefined
    };
  } catch (error) {
    console.error(`Error fetching stock details for ${ticker}:`, error);
    return {};
  }
}
