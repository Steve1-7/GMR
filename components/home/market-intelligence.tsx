'use client';

import { FadeIn, CountUp } from '@/components/shared/motion';
import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, ChartBar as BarChart3, Activity, ArrowUpRight } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import Link from 'next/link';

const ICON_MAP: Record<string, typeof BarChart3> = {
  BarChart3,
  Activity,
  TrendingUp,
  ArrowUpRight,
};

function generateChartData(base: number, range: number) {
  const data = [];
  let current = base;
  for (let i = 0; i < 30; i++) {
    current = current + (Math.random() - 0.48) * range * 0.15;
    data.push({ name: `D${i + 1}`, value: Math.round(current * 100) / 100 });
  }
  return data;
}

function MiniChart({ data, positive }: { data: { name: string; value: number }[]; positive: boolean }) {
  return (
    <ResponsiveContainer width="100%" height={50}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`gradient-${positive ? 'up' : 'down'}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={positive ? '#34d399' : '#f87171'} stopOpacity={0.3} />
            <stop offset="100%" stopColor={positive ? '#34d399' : '#f87171'} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={positive ? '#34d399' : '#f87171'}
          strokeWidth={1.5}
          fill={`url(#gradient-${positive ? 'up' : 'down'})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function MarketIntelligence() {
  const [commoditiesState, setCommoditiesState] = useState<any[]>([]);
  const [marketIndicators, setMarketIndicators] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetch('/api/commodities'),
      fetch('/api/settings?key=market_indicators'),
    ])
      .then(async ([commoditiesRes, indicatorsRes]) => {
        const commoditiesJson = await commoditiesRes.json();
        const indicatorsJson = await indicatorsRes.json();
        if (!mounted) return;

        if (Array.isArray(commoditiesJson?.data) && commoditiesJson.data.length > 0) {
          const mapped = commoditiesJson.data.slice(0, 4).map((c: any) => {
            const price = typeof c.current_price === 'number' ? c.current_price : (c.price || 0);
            const change = typeof c.price_change_percent === 'number' ? c.price_change_percent : (c.change || 0);
            return { name: c.name || c.symbol || 'N/A', price, change, data: generateChartData(price || 0, Math.max(Math.abs(price) * 0.05, 1)) };
          });
          setCommoditiesState(mapped);
        }

        if (Array.isArray(indicatorsJson?.data) && indicatorsJson.data.length > 0) {
          setMarketIndicators(indicatorsJson.data);
        }
      })
      .catch(() => {});
    return () => { mounted = false };
  }, []);

  if (commoditiesState.length === 0 && marketIndicators.length === 0) return null;

  return (
    <section className="py-20 border-t border-border/30">
      <div className="mx-auto max-w-7xl px-4">
        <FadeIn>
          <div className="mb-12 flex items-end justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">
                Live Data
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Market Intelligence
              </h2>
            </div>
            <Link
              href="/markets"
              className="text-sm font-medium text-gold hover:text-gold-bright transition-colors"
            >
              Full market dashboard
            </Link>
          </div>
        </FadeIn>

        {/* Commodity cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {commoditiesState.map((c, i) => (
            <FadeIn key={c.name} delay={0.1 + i * 0.05}>
              <div className="rounded-xl border border-border/50 bg-card p-4 hover:border-border transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-foreground">{c.name}</span>
                  <span className={`flex items-center gap-1 text-xs ${c.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {c.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {c.change >= 0 ? '+' : ''}{c.change}%
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground mb-3">
                  ${c.price.toLocaleString()}
                </div>
                <MiniChart data={c.data} positive={c.change >= 0} />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
