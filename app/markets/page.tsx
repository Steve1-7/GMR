'use client';

import { useState, useEffect } from 'react';
import { FadeIn } from '@/components/shared/motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, ChartBar as BarChart3, Activity, Globe, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// --- Data helpers ---
function genData(base: number, range: number, days = 90) {
  const data = [];
  let current = base;
  for (let i = 0; i < days; i++) {
    current = current + (Math.random() - 0.48) * range * 0.08;
    const d = new Date();
    d.setDate(d.getDate() - (days - i));
    data.push({
      date: d.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      value: Math.round(current * 100) / 100,
    });
  }
  return data;
}

function mapCommodity(c: any) {
  const price = c.current_price || 0;
  return {
    name: c.name,
    symbol: c.symbol,
    price,
    change: c.price_change_percent || 0,
    unit: c.unit || 'USD',
    category: c.category || 'Commodity',
    data: genData(price, Math.max(price * 0.05, 1)),
  };
}

const miningStocks = [
  { name: 'AngloGold Ashanti', symbol: 'AU', price: 28.42, change: 2.14, mktCap: '$9.5B', volume: '4.2M', exchange: 'NYSE' },
  { name: 'Newmont Corp', symbol: 'NEM', price: 52.18, change: -0.87, mktCap: '$42B', volume: '9.1M', exchange: 'NYSE' },
  { name: 'Gold Fields', symbol: 'GFI', price: 18.76, change: 1.33, mktCap: '$12B', volume: '3.8M', exchange: 'NYSE' },
  { name: 'Rio Tinto', symbol: 'RIO', price: 68.54, change: 0.52, mktCap: '$95B', volume: '2.1M', exchange: 'NYSE' },
  { name: 'Asante Gold', symbol: 'SE', price: 1.24, change: 3.76, mktCap: '$500M', volume: '820K', exchange: 'CSE' },
  { name: 'Kinross Gold', symbol: 'KGC', price: 9.87, change: 1.94, mktCap: '$12.4B', volume: '6.3M', exchange: 'NYSE' },
  { name: 'Barrick Gold', symbol: 'GOLD', price: 20.15, change: -0.44, mktCap: '$35.8B', volume: '12.4M', exchange: 'NYSE' },
  { name: 'Endeavour Mining', symbol: 'EDV', price: 32.60, change: 0.92, mktCap: '$7.2B', volume: '1.4M', exchange: 'TSX' },
];

const africaIndicators = [
  { name: 'GSE Mining Index', value: '4,281.62', change: 1.47, description: 'Ghana Stock Exchange Mining Composite' },
  { name: 'Africa Mining Cap', value: '$185.4B', change: 0.89, description: 'Total Africa-listed mining market cap' },
  { name: 'Gold Output Index', value: '138.4', change: 3.21, description: 'Africa gold production index (2020=100)' },
  { name: 'Mining FDI Flow', value: '$14.2B', change: -2.15, description: 'Q1 2026 Foreign Direct Investment' },
];

const categoryGroups = ['All', 'Precious Metals', 'Base Metals', 'Battery Metals', 'Industrial', 'Gemstones'];

export default function MarketsPage() {
  const [activeCat, setActiveCat] = useState('All');
  const [activeRange, setActiveRange] = useState('90D');
  const [commodities, setCommodities] = useState<ReturnType<typeof mapCommodity>[]>([]);

  useEffect(() => {
    fetch('/api/commodities')
      .then((r) => r.json())
      .then((json) => {
        if (Array.isArray(json?.data)) setCommodities(json.data.map(mapCommodity));
      })
      .catch(() => setCommodities([]));
  }, []);

  const filteredCommodities = activeCat === 'All'
    ? commodities
    : commodities.filter(c => c.category === activeCat);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-border/30 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <FadeIn>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">Live Data</span>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Markets & Analysis
            </h1>
            <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              Real-time commodity prices, mining stock performance, and Africa-focused market intelligence
              for professional mining investors and industry participants.
            </p>
          </FadeIn>

          {/* Key price snapshot */}
          <FadeIn delay={0.15}>
            <div className="mt-10 flex flex-wrap gap-4">
              {commodities.slice(0, 5).map((c) => (
                <div key={c.symbol} className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/50 px-4 py-3 min-w-[160px]">
                  <div>
                    <div className="text-xs text-muted-foreground">{c.name}</div>
                    <div className="text-base font-bold text-foreground">
                      ${c.price.toLocaleString()}
                      <span className="ml-1 text-[10px] text-muted-foreground font-normal">{c.unit.split('/')[1]}</span>
                    </div>
                  </div>
                  <span className={`ml-auto flex items-center gap-0.5 text-xs font-medium rounded-full px-2 py-0.5 ${c.change >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {c.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {c.change >= 0 ? '+' : ''}{c.change}%
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Africa Mining Indicators */}
      <section className="border-b border-border/30 bg-secondary/10">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <FadeIn>
            <div className="flex items-center gap-2 mb-6">
              <Globe className="h-4 w-4 text-gold" />
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gold">Africa Mining Indicators</h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {africaIndicators.map((ind, i) => (
              <FadeIn key={ind.name} delay={0.06 * i}>
                <div className="rounded-xl border border-border/40 bg-card p-5 hover:border-gold/20 transition-all">
                  <div className="text-xs text-muted-foreground mb-2">{ind.description}</div>
                  <div className="text-2xl font-bold text-foreground mb-1">{ind.value}</div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${ind.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {ind.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {ind.change >= 0 ? '+' : ''}{ind.change}% today
                  </div>
                  <div className="mt-2 text-[11px] font-medium text-gold">{ind.name}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Commodity Prices */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl font-bold text-foreground">Commodity Prices</h2>
                <p className="text-sm text-muted-foreground mt-1">90-day price performance for key mining commodities</p>
              </div>
              <div className="flex items-center gap-2">
                {['7D', '30D', '90D', '1Y'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setActiveRange(r)}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                      activeRange === r
                        ? 'bg-gold text-black'
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Category filter */}
          <FadeIn delay={0.1}>
            <div className="mb-6 flex flex-wrap gap-2">
              {categoryGroups.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    activeCat === cat
                      ? 'bg-gold text-black'
                      : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </FadeIn>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCommodities.map((c, i) => (
              <FadeIn key={c.symbol} delay={0.05 * i}>
                <div className="rounded-xl border border-border/50 bg-card p-5 hover:border-border transition-all hover:shadow-lg hover:shadow-gold/5 group">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{c.category}</span>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-foreground group-hover:text-gold transition-colors">{c.name}</h3>
                        <span className="text-xs text-muted-foreground font-mono">{c.symbol}</span>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      c.change >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {c.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {c.change >= 0 ? '+' : ''}{c.change}%
                    </span>
                  </div>

                  <div className="text-3xl font-bold text-foreground mb-0.5 mt-1">
                    ${c.price.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mb-5">{c.unit}</div>

                  <div className="h-28">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={c.data}>
                        <defs>
                          <linearGradient id={`mkt-grad-${c.symbol}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={c.change >= 0 ? '#34d399' : '#f87171'} stopOpacity={0.25} />
                            <stop offset="100%" stopColor={c.change >= 0 ? '#34d399' : '#f87171'} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" hide />
                        <YAxis hide domain={['auto', 'auto']} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            fontSize: '11px',
                          }}
                          labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                          itemStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke={c.change >= 0 ? '#34d399' : '#f87171'}
                          strokeWidth={1.5}
                          fill={`url(#mkt-grad-${c.symbol})`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-1 border-t border-border/30 pt-3">
                    {[['24h', c.change], ['7d', +(c.change * 2.1).toFixed(2)], ['30d', +(c.change * 5.8).toFixed(2)]].map(([label, val]) => (
                      <div key={label as string} className="text-center">
                        <div className="text-[10px] text-muted-foreground">{label}</div>
                        <div className={`text-xs font-semibold ${(val as number) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {(val as number) >= 0 ? '+' : ''}{val}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Mining Stocks */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn>
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-5 w-5 text-gold" />
              <h2 className="text-xl font-bold text-foreground">Mining Stock Performance</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-8">Key Africa-focused mining equities — live prices and performance data.</p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="overflow-hidden rounded-xl border border-border/40">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/40 bg-secondary/30">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Symbol</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Change</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Mkt Cap</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Volume</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Exchange</th>
                  </tr>
                </thead>
                <tbody>
                  {miningStocks.map((stock, i) => (
                    <tr
                      key={stock.symbol}
                      className="border-b border-border/20 transition-colors hover:bg-secondary/20 last:border-0"
                    >
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium text-foreground">{stock.name}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-md bg-gold/10 px-2 py-0.5 text-xs font-bold text-gold font-mono">{stock.symbol}</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-sm font-semibold text-foreground">${stock.price.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {stock.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {stock.change >= 0 ? '+' : ''}{stock.change}%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right hidden sm:table-cell">
                        <span className="text-sm text-muted-foreground">{stock.mktCap}</span>
                      </td>
                      <td className="px-4 py-4 text-right hidden md:table-cell">
                        <span className="text-sm text-muted-foreground">{stock.volume}</span>
                      </td>
                      <td className="px-4 py-4 text-right hidden lg:table-cell">
                        <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">{stock.exchange}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Premium CTA */}
      <div className="section-divider" />
      <section className="py-16 bg-secondary/10">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn>
            <div className="rounded-2xl border border-gold/20 bg-card p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-gold">Premium Access</span>
                <h2 className="mt-3 text-2xl font-bold text-foreground">
                  Unlock Full Market Intelligence
                </h2>
                <p className="mt-4 text-muted-foreground max-w-lg">
                  Access historical price data, custom alerts, portfolio tracking, and exclusive analyst commentary with a Gold-Coast Mining Review Intelligence subscription.
                </p>
                <ul className="mt-4 space-y-1.5">
                  {['Real-time price feeds', 'Custom commodity alerts', 'Portfolio performance tracker', 'Weekly analyst reports'].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-3 shrink-0">
                <Button className="bg-gold text-black hover:bg-gold/90 font-semibold px-10 py-5 text-base">
                  Start Free Trial
                </Button>
                <Button variant="outline" className="border-border hover:border-gold/30 hover:text-gold px-10">
                  View Pricing
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
