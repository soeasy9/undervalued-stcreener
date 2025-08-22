'use client'

import { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface FilterBarProps {
  onFilterChange: (filters: {
    peRatio: [number, number];
    pbRatio: [number, number];
    dividendYield: [number, number];
  }) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [peRatio, setPeRatio] = useState<[number, number]>([0, 100]);
  const [pbRatio, setPbRatio] = useState<[number, number]>([0, 20]);
  const [dividendYield, setDividendYield] = useState<[number, number]>([0, 15]);

  const handlePeChange = (value: number | number[]) => {
    const newValue = Array.isArray(value) ? value as [number, number] : [0, value];
    setPeRatio(newValue);
    onFilterChange({
      peRatio: newValue,
      pbRatio,
      dividendYield,
    });
  };

  const handlePbChange = (value: number | number[]) => {
    const newValue = Array.isArray(value) ? value as [number, number] : [0, value];
    setPbRatio(newValue);
    onFilterChange({
      peRatio,
      pbRatio: newValue,
      dividendYield,
    });
  };

  const handleDividendYieldChange = (value: number | number[]) => {
    const newValue = Array.isArray(value) ? value as [number, number] : [0, value];
    setDividendYield(newValue);
    onFilterChange({
      peRatio,
      pbRatio,
      dividendYield: newValue,
    });
  };

  const resetFilters = () => {
    const defaultFilters = {
      peRatio: [0, 100] as [number, number],
      pbRatio: [0, 20] as [number, number],
      dividendYield: [0, 15] as [number, number],
    };
    
    setPeRatio(defaultFilters.peRatio);
    setPbRatio(defaultFilters.pbRatio);
    setDividendYield(defaultFilters.dividendYield);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Filter Stocks</h3>
        <button
          onClick={resetFilters}
          className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
        >
          Reset Filters
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* P/E Ratio Filter */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            P/E Ratio: {peRatio[0]} - {peRatio[1]}
          </label>
          <div className="px-3 py-2">
            <Slider
              range
              min={0}
              max={100}
              step={1}
              value={peRatio}
              onChange={handlePeChange}
              trackStyle={[{ backgroundColor: '#3B82F6' }]}
              handleStyle={[
                { borderColor: '#3B82F6', backgroundColor: '#3B82F6' },
                { borderColor: '#3B82F6', backgroundColor: '#3B82F6' }
              ]}
              railStyle={{ backgroundColor: '#4B5563' }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>0</span>
            <span>100</span>
          </div>
        </div>

        {/* P/B Ratio Filter */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            P/B Ratio: {pbRatio[0]} - {pbRatio[1]}
          </label>
          <div className="px-3 py-2">
            <Slider
              range
              min={0}
              max={20}
              step={0.1}
              value={pbRatio}
              onChange={handlePbChange}
              trackStyle={[{ backgroundColor: '#10B981' }]}
              handleStyle={[
                { borderColor: '#10B981', backgroundColor: '#10B981' },
                { borderColor: '#10B981', backgroundColor: '#10B981' }
              ]}
              railStyle={{ backgroundColor: '#4B5563' }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>0</span>
            <span>20</span>
          </div>
        </div>

        {/* Dividend Yield Filter */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            Dividend Yield (%): {dividendYield[0]} - {dividendYield[1]}
          </label>
          <div className="px-3 py-2">
            <Slider
              range
              min={0}
              max={15}
              step={0.1}
              value={dividendYield}
              onChange={handleDividendYieldChange}
              trackStyle={[{ backgroundColor: '#F59E0B' }]}
              handleStyle={[
                { borderColor: '#F59E0B', backgroundColor: '#F59E0B' },
                { borderColor: '#F59E0B', backgroundColor: '#F59E0B' }
              ]}
              railStyle={{ backgroundColor: '#4B5563' }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>0%</span>
            <span>15%</span>
          </div>
        </div>
      </div>

             <div className="mt-4 pt-4 border-t border-gray-700">
         <p className="text-sm text-gray-400">
           Drag the slider handles to set minimum and maximum values for each metric. 
           Filters only apply to stocks that have values for those metrics.
         </p>
       </div>
    </div>
  );
}
