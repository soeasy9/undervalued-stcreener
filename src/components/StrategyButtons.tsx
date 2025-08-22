'use client'

interface StrategyButtonsProps {
  activeStrategy: string;
  onStrategyChange: (strategy: string) => void;
}

const strategies = [
  { id: 'Default', name: 'Default', description: 'Original order' },
  { id: 'Value', name: 'Value Investing', description: 'Low P/E ratios first' },
  { id: 'High Dividend', name: 'High Dividend', description: 'Highest dividend yields' },
  { id: 'Growth', name: 'Growth', description: 'High P/E growth stocks' },
  { id: 'Quality', name: 'Quality', description: 'Low P/B ratios' }
];

export default function StrategyButtons({ activeStrategy, onStrategyChange }: StrategyButtonsProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-300 mb-3">
        Investment Strategy
      </label>
      <div className="flex flex-wrap gap-2">
        {strategies.map((strategy) => (
          <button
            key={strategy.id}
            onClick={() => onStrategyChange(strategy.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 ${
              activeStrategy === strategy.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
            }`}
            title={strategy.description}
          >
            {strategy.name}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Click a strategy to instantly sort stocks by that investment approach
      </p>
    </div>
  );
}
