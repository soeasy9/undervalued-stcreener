'use client'

import { useState, useEffect, useMemo } from 'react';
import ExchangeSelector from '@/components/ExchangeSelector';
import FilterBar from '@/components/FilterBar';
import StockTable from '@/components/StockTable';
import { fetchUndervaluedStocks, Stock } from '@/services/fetchStockData';

export default function Home() {
  const [selectedExchange, setSelectedExchange] = useState<string>('US');
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({
    peRatio: [0, 100] as [number, number],
    pbRatio: [0, 20] as [number, number],
    dividendYield: [0, 15] as [number, number],
  });

  useEffect(() => {
    const loadStocks = async () => {
      setIsLoading(true);
      try {
        console.log(`Loading stocks for exchange: ${selectedExchange}`);
        const stockData = await fetchUndervaluedStocks(selectedExchange);
        console.log(`Received ${stockData.length} stocks:`, stockData);
        setStocks(stockData);
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setStocks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadStocks();
  }, [selectedExchange]);

  const handleExchangeChange = (exchange: string) => {
    setSelectedExchange(exchange);
  };

  // Filter stocks based on current filter settings
  const filteredStocks = useMemo(() => {
    return stocks.filter(stock => {
      const { peRatio, pbRatio, dividendYield } = filters;
      
      // Check if stock meets filter criteria for metrics that have values
      let meetsPe = true;
      let meetsPb = true;
      let meetsYield = true;
      
      // Only apply P/E filter if stock has a P/E ratio
      if (stock.peRatio !== null) {
        meetsPe = stock.peRatio >= peRatio[0] && stock.peRatio <= peRatio[1];
      }
      
      // Only apply P/B filter if stock has a P/B ratio
      if (stock.pbRatio !== null) {
        meetsPb = stock.pbRatio >= pbRatio[0] && stock.pbRatio <= pbRatio[1];
      }
      
      // Only apply Dividend Yield filter if stock has a dividend yield
      if (stock.dividendYield !== null) {
        meetsYield = stock.dividendYield >= dividendYield[0] && stock.dividendYield <= dividendYield[1];
      }
      
      return meetsPe && meetsPb && meetsYield;
    });
  }, [stocks, filters]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Find Undervalued Stocks in {selectedExchange === 'US' ? 'USA' : 'Cyprus'}
        </h2>
        <p className="text-gray-400 mb-6">
          Select a market and use the filters below to find potentially undervalued stocks based on key financial metrics.
        </p>
      </div>

      <div className="mb-8">
        <ExchangeSelector 
          onExchangeChange={handleExchangeChange}
          selectedExchange={selectedExchange}
        />
      </div>

      <FilterBar onFilterChange={setFilters} />

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading stock data...</p>
            <p className="text-gray-500 text-sm mt-2">This may take a few minutes for US markets</p>
          </div>
        </div>
      ) : (
        <div>
          {stocks.length > 0 ? (
            <div>
              <div className="mb-4">
                <p className="text-gray-400">
                  Showing {filteredStocks.length} of {stocks.length} stocks in {selectedExchange === 'US' ? 'USA' : 'Cyprus'}
                  {filteredStocks.length !== stocks.length && (
                    <span className="ml-2 text-blue-400">
                      ({stocks.length - filteredStocks.length} filtered out)
                    </span>
                  )}
                </p>
              </div>
              {filteredStocks.length > 0 ? (
                <StockTable stocks={filteredStocks} />
              ) : (
                <div className="text-center py-12 bg-gray-800 border border-gray-700 rounded-lg">
                  <p className="text-gray-400 mb-2">No stocks match your current filter criteria.</p>
                  <p className="text-gray-500 text-sm">Try adjusting the filter ranges to see more results.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">No stock data available for this market.</p>
            </div>
          )}
        </div>
       )}
     </div>
   );
 }
