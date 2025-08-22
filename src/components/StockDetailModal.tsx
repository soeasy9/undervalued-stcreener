'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Stock } from '@/services/fetchStockData'

// Extended interface for detailed stock data
export interface DetailedStock extends Stock {
  logo?: string;
  description?: string;
  chartData?: Array<{ date: string; price: number }>;
}

interface StockDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: DetailedStock | null;
}

export default function StockDetailModal({ isOpen, onClose, stock }: StockDetailModalProps) {
  if (!stock) return null;

  const formatValue = (value: number | null) => {
    if (value === null || value === undefined) return 'N/A';
    return typeof value === 'number' ? value.toFixed(2) : value.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    {stock.logo && (
                      <img 
                        src={stock.logo} 
                        alt={`${stock.name} logo`}
                        className="w-12 h-12 rounded-lg object-contain bg-white p-1"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <div>
                      <Dialog.Title as="h3" className="text-2xl font-bold text-white">
                        {stock.name}
                      </Dialog.Title>
                      <p className="text-blue-400 font-mono text-lg">{stock.ticker}</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Company Description */}
                {stock.description && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-2">About {stock.name}</h4>
                    <p className="text-gray-300 leading-relaxed">{stock.description}</p>
                  </div>
                )}

                {/* Financial Metrics Table */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Financial Metrics</h4>
                  <div className="bg-gray-700 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b border-gray-600">
                          <td className="px-4 py-3 text-gray-300 font-medium">P/E Ratio</td>
                          <td className="px-4 py-3 text-white">{formatValue(stock.peRatio)}</td>
                        </tr>
                        <tr className="border-b border-gray-600">
                          <td className="px-4 py-3 text-gray-300 font-medium">P/B Ratio</td>
                          <td className="px-4 py-3 text-white">{formatValue(stock.pbRatio)}</td>
                        </tr>
                        <tr className="border-b border-gray-600">
                          <td className="px-4 py-3 text-gray-300 font-medium">D/E Ratio</td>
                          <td className="px-4 py-3 text-white">{formatValue(stock.deRatio)}</td>
                        </tr>
                        <tr className="border-b border-gray-600">
                          <td className="px-4 py-3 text-gray-300 font-medium">Dividend Yield</td>
                          <td className="px-4 py-3 text-white">{formatValue(stock.dividendYield)}%</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-300 font-medium">PEG Ratio</td>
                          <td className="px-4 py-3 text-white">{formatValue(stock.pegRatio)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Price Chart */}
                {stock.chartData && stock.chartData.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Price History (1 Year)</h4>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={stock.chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={formatDate}
                            stroke="#9CA3AF"
                            fontSize={12}
                          />
                          <YAxis 
                            stroke="#9CA3AF"
                            fontSize={12}
                            tickFormatter={(value) => `$${value.toFixed(2)}`}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: '#374151',
                              border: 'none',
                              borderRadius: '8px',
                              color: '#F9FAFB'
                            }}
                            labelFormatter={formatDate}
                            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="price" 
                            stroke="#3B82F6" 
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
