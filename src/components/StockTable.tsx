'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Stock } from '@/services/fetchStockData';

interface StockTableProps {
  stocks: Stock[];
}

type SortField = keyof Stock;
type SortDirection = 'asc' | 'desc';

export default function StockTable({ stocks }: StockTableProps) {
  const router = useRouter();
  const [sortField, setSortField] = useState<SortField>('ticker');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const stocksPerPage = 50;

  // Reset to first page when stocks change (e.g., when strategy changes)
  useEffect(() => {
    setCurrentPage(1);
  }, [stocks]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedStocks = [...stocks].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    // Handle null values by placing them at the bottom
    if (aValue === null && bValue === null) return 0;
    if (aValue === null) return 1;
    if (bValue === null) return -1;

    // Handle string comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sortDirection === 'asc' ? comparison : -comparison;
    }

    // Handle number comparison
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      const comparison = aValue - bValue;
      return sortDirection === 'asc' ? comparison : -comparison;
    }

    return 0;
  });

  const formatValue = (value: number | null) => {
    if (value === null || value === undefined) return 'N/A';
    return value.toFixed(2);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  // Pagination logic
  const totalPages = Math.ceil(sortedStocks.length / stocksPerPage);
  const startIndex = (currentPage - 1) * stocksPerPage;
  const endIndex = startIndex + stocksPerPage;
  const currentStocks = sortedStocks.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <thead className="bg-gray-700">
          <tr>
            <th 
              className="px-4 py-3 text-left text-sm font-medium text-gray-300 cursor-pointer hover:bg-gray-600 transition-colors"
              onClick={() => handleSort('ticker')}
            >
              Ticker {getSortIcon('ticker')}
            </th>
            <th 
              className="px-4 py-3 text-left text-sm font-medium text-gray-300 cursor-pointer hover:bg-gray-600 transition-colors"
              onClick={() => handleSort('name')}
            >
              Company Name {getSortIcon('name')}
            </th>
            <th 
              className="px-4 py-3 text-left text-sm font-medium text-gray-300 cursor-pointer hover:bg-gray-600 transition-colors"
              onClick={() => handleSort('peRatio')}
            >
              P/E Ratio {getSortIcon('peRatio')}
            </th>
            <th 
              className="px-4 py-3 text-left text-sm font-medium text-gray-300 cursor-pointer hover:bg-gray-600 transition-colors"
              onClick={() => handleSort('pbRatio')}
            >
              P/B Ratio {getSortIcon('pbRatio')}
            </th>
            <th 
              className="px-4 py-3 text-left text-sm font-medium text-gray-300 cursor-pointer hover:bg-gray-600 transition-colors"
              onClick={() => handleSort('deRatio')}
            >
              D/E Ratio {getSortIcon('deRatio')}
            </th>
            <th 
              className="px-4 py-3 text-left text-sm font-medium text-gray-300 cursor-pointer hover:bg-gray-600 transition-colors"
              onClick={() => handleSort('dividendYield')}
            >
              Dividend Yield (%) {getSortIcon('dividendYield')}
            </th>
            <th 
              className="px-4 py-3 text-left text-sm font-medium text-gray-300 cursor-pointer hover:bg-gray-600 transition-colors"
              onClick={() => handleSort('pegRatio')}
            >
              PEG Ratio {getSortIcon('pegRatio')}
            </th>
          </tr>
        </thead>
        <tbody>
          {currentStocks.map((stock, index) => (
            <tr 
              key={stock.ticker} 
              className={`${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'} hover:bg-gray-700 transition-colors cursor-pointer`}
              onClick={() => router.push(`/stock/${stock.ticker}`)}
            >
              <td className="px-4 py-3 text-sm font-medium text-blue-400">
                {stock.ticker}
              </td>
              <td className="px-4 py-3 text-sm text-gray-300">
                {stock.name}
              </td>
              <td className="px-4 py-3 text-sm text-gray-300">
                {formatValue(stock.peRatio)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-300">
                {formatValue(stock.pbRatio)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-300">
                {formatValue(stock.deRatio)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-300">
                {formatValue(stock.dividendYield)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-300">
                {formatValue(stock.pegRatio)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing {startIndex + 1} to {Math.min(endIndex, sortedStocks.length)} of {sortedStocks.length} stocks
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
