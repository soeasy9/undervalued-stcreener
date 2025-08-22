import { fetchStockDetails } from '@/services/fetchStockData';
import TradingViewWidget from '@/components/TradingViewWidget';
import BackButton from '@/components/BackButton';
import { notFound } from 'next/navigation';

interface StockPageProps {
  params: {
    ticker: string;
  };
}

export default async function StockPage({ params }: StockPageProps) {
  const { ticker } = params;
  
  try {
    const stockDetails = await fetchStockDetails(ticker);
    
    if (!stockDetails) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <BackButton />
          
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              {stockDetails.logo && (
                <img
                  src={stockDetails.logo}
                  alt={`${ticker} logo`}
                  className="w-16 h-16 rounded-lg object-contain bg-white p-2"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-white">{ticker}</h1>
                {stockDetails.description && (
                  <p className="text-gray-400 text-lg">
                    {stockDetails.description.split(' - ')[0]}
                  </p>
                )}
              </div>
            </div>
            
            {stockDetails.description && (
              <p className="text-gray-300 text-sm leading-relaxed">
                {stockDetails.description}
              </p>
            )}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* TradingView Chart */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Price Chart</h2>
                <TradingViewWidget ticker={ticker} />
              </div>
            </div>

            {/* Financial Metrics */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Financial Metrics</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-300">Ticker</span>
                    <span className="font-semibold">{ticker}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-300">Exchange</span>
                    <span className="font-semibold">NASDAQ</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-300">Currency</span>
                    <span className="font-semibold">USD</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-300">Timezone</span>
                    <span className="font-semibold">UTC</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Chart Settings</h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>• Interactive price chart</p>
                    <p>• Multiple timeframes available</p>
                    <p>• Technical indicators</p>
                    <p>• Drawing tools</p>
                    <p>• Dark theme optimized</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {stockDetails.description && (
            <div className="mt-8">
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Company Information</h2>
                <p className="text-gray-300 leading-relaxed">
                  {stockDetails.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching stock details:', error);
    notFound();
  }
}
