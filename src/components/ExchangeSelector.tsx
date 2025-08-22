'use client'

interface ExchangeSelectorProps {
  onExchangeChange: (exchange: string) => void;
  selectedExchange: string;
}

const exchanges = [
  { name: 'USA (S&P 500, NYSE, NASDAQ)', code: 'US' },
  { name: 'Cyprus Stock Exchange', code: 'CY' },
];

export default function ExchangeSelector({ onExchangeChange, selectedExchange }: ExchangeSelectorProps) {
  return (
    <div className="mb-6">
      <label htmlFor="exchange-select" className="block text-sm font-medium text-gray-300 mb-2">
        Select Market
      </label>
      <select
        id="exchange-select"
        value={selectedExchange}
        onChange={(e) => onExchangeChange(e.target.value)}
        className="w-full max-w-md px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-500 transition-colors"
      >
        {exchanges.map((exchange) => (
          <option key={exchange.code} value={exchange.code}>
            {exchange.name}
          </option>
        ))}
      </select>
    </div>
  );
}
