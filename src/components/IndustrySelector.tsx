'use client'

interface IndustrySelectorProps {
  onIndustryChange: (industry: string) => void;
  selectedIndustry: string;
}

const industries = [
  "Communication Services",
  "Consumer Discretionary",
  "Consumer Staples",
  "Energy",
  "Financials",
  "Health Care",
  "Industrials",
  "Information Technology",
  "Materials",
  "Real Estate",
  "Utilities"
];

export default function IndustrySelector({ onIndustryChange, selectedIndustry }: IndustrySelectorProps) {
  return (
    <div className="mb-8">
      <label htmlFor="industry-select" className="block text-sm font-medium text-gray-300 mb-2">
        Select Industry
      </label>
      <select
        id="industry-select"
        value={selectedIndustry}
        onChange={(e) => onIndustryChange(e.target.value)}
        className="w-full max-w-md px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-500 transition-colors"
      >
        {industries.map((industry) => (
          <option key={industry} value={industry}>
            {industry}
          </option>
        ))}
      </select>
    </div>
  );
}
