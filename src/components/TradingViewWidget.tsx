'use client'

import { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
  ticker: string;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

export default function TradingViewWidget({ ticker }: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if TradingView script is already loaded
    if (window.TradingView) {
      createWidget();
      return;
    }

    // Load TradingView script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = createWidget;
    document.head.appendChild(script);

    return () => {
      // Cleanup: remove script if component unmounts
      const existingScript = document.querySelector('script[src="https://s3.tradingview.com/tv.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [ticker]);

  const createWidget = () => {
    if (!containerRef.current || !window.TradingView) return;

    // Clear existing content
    containerRef.current.innerHTML = '';

    // Create new widget
    new window.TradingView.widget({
      autosize: true,
      symbol: `NASDAQ:${ticker}`, // Default to NASDAQ, can be made dynamic
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      enable_publishing: false,
      allow_symbol_change: true,
      container_id: containerRef.current.id,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      backgroundColor: '#1a1a1a',
      gridColor: '#2a2a2a',
      width: '100%',
      height: '600px',
    });
  };

  return (
    <div className="w-full h-[600px] bg-gray-900 rounded-lg overflow-hidden">
      <div
        ref={containerRef}
        id={`tradingview_${ticker}`}
        className="w-full h-full"
      />
    </div>
  );
}
