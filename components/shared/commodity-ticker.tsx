'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Commodity {
  name: string;
  symbol: string;
  current_price: number;
  price_change: number;
  price_change_percent: number;
  unit: string;
}

const fallbackCommodities: Commodity[] = [
  { name: 'Gold', symbol: 'XAU', current_price: 2341.50, price_change: 12.30, price_change_percent: 0.53, unit: 'USD/oz' },
  { name: 'Copper', symbol: 'XCU', current_price: 4.32, price_change: -0.05, price_change_percent: -1.14, unit: 'USD/lb' },
  { name: 'Lithium', symbol: 'LI', current_price: 13500, price_change: -420, price_change_percent: -3.01, unit: 'USD/t' },
  { name: 'Platinum', symbol: 'XPT', current_price: 1012, price_change: 8.50, price_change_percent: 0.85, unit: 'USD/oz' },
  { name: 'Cobalt', symbol: 'CO', current_price: 28500, price_change: 350, price_change_percent: 1.24, unit: 'USD/t' },
  { name: 'Iron Ore', symbol: 'FE', current_price: 118.50, price_change: 2.30, price_change_percent: 1.98, unit: 'USD/t' },
  { name: 'Silver', symbol: 'XAG', current_price: 29.40, price_change: 0.65, price_change_percent: 2.26, unit: 'USD/oz' },
  { name: 'Manganese', symbol: 'MN', current_price: 4.85, price_change: 0.12, price_change_percent: 2.54, unit: 'USD/dmtu' },
];

export default function CommodityTicker() {
  const [commodities, setCommodities] = useState<Commodity[]>(fallbackCommodities);

  useEffect(() => {
    const fetchCommodities = async () => {
      try {
        const res = await fetch('/api/commodities');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) setCommodities(data);
        }
      } catch {
        // use fallback
      }
    };
    fetchCommodities();
  }, []);

  return (
    <div className="w-full overflow-hidden border-b border-border/50 bg-secondary/30">
      <div className="flex animate-[scroll_60s_linear_infinite] whitespace-nowrap">
        <div className="flex items-center gap-8 py-2 px-4">
          {commodities.map((c) => (
            <div key={c.symbol} className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-foreground">{c.name}</span>
              <span className="text-muted-foreground">
                ${c.current_price.toLocaleString()}
              </span>
              <span className={`flex items-center gap-0.5 ${c.price_change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {c.price_change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {c.price_change_percent >= 0 ? '+' : ''}{c.price_change_percent.toFixed(2)}%
              </span>
            </div>
          ))}
          {/* Duplicate for seamless scroll */}
          {commodities.map((c) => (
            <div key={`${c.symbol}-dup`} className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-foreground">{c.name}</span>
              <span className="text-muted-foreground">
                ${c.current_price.toLocaleString()}
              </span>
              <span className={`flex items-center gap-0.5 ${c.price_change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {c.price_change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {c.price_change_percent >= 0 ? '+' : ''}{c.price_change_percent.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
