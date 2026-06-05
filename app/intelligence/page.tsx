'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FadeIn } from '@/components/shared/motion';
import { Search, TrendingUp, ChartBar as BarChart2, Building2, Cpu, ChartLine as LineChart, Lock, Zap } from 'lucide-react';

const intelligenceCards = [
  {
    icon: BarChart2,
    title: 'Market Analysis',
    description: 'Real-time market data, price forecasts, and supply-demand dynamics for gold, lithium, copper, and other key African minerals.',
    category: 'Markets',
    premium: false,
    color: 'text-gold',
    bg: 'bg-gold/10',
  },
  {
    icon: Cpu,
    title: 'Project Intelligence',
    description: 'Comprehensive project tracking from exploration through production across 54 African nations with detailed risk scoring.',
    category: 'Projects',
    premium: true,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Building2,
    title: 'Company Profiles',
    description: 'Deep-dive financial and operational profiles of major mining companies operating across the continent.',
    category: 'Companies',
    premium: true,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: LineChart,
    title: 'Commodity Forecasts',
    description: '12-month price forecasts for 20+ commodities with scenario analysis and confidence intervals.',
    category: 'Forecasts',
    premium: true,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
];

const trending = [
  'Gold Q2 outlook', 'Obuasi expansion', 'Lithium West Africa', 'ESG ratings 2026',
  'Copper demand surge', 'Junior miners', 'DRC cobalt', 'Ghana royalties',
];

export default function IntelligencePage() {
  const [query, setQuery] = useState('');

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-border/30 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <FadeIn>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">Premium</span>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Intelligence</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              Mining Insights — navigate Africa&apos;s complex mining landscape with comprehensive data and analysis.
            </p>
          </FadeIn>

          {/* AI Search */}
          <FadeIn delay={0.2}>
            <div className="mt-8 relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask Gold-Coast Mining Review..."
                className="h-14 pl-12 pr-32 rounded-xl bg-background border-border/50 text-base focus:border-gold/50"
              />
              <Button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gold text-black hover:bg-gold/90 h-10 gap-2">
                <Search className="h-4 w-4" /> Search
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Trending */}
      <section className="border-b border-border/30">
        <div className="mx-auto max-w-7xl px-4 py-5">
          <div className="flex items-center gap-4 overflow-x-auto">
            <span className="flex items-center gap-1.5 shrink-0 text-xs font-semibold text-gold">
              <TrendingUp className="h-3.5 w-3.5" /> Trending
            </span>
            {trending.map((t) => (
              <button key={t} className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors">
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Intelligence cards */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn>
            <h2 className="text-2xl font-bold text-foreground mb-2">Featured Intelligence</h2>
            <p className="text-muted-foreground mb-8">Premium data products for serious mining professionals and investors.</p>
          </FadeIn>
          <div className="grid gap-6 sm:grid-cols-2">
            {intelligenceCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <FadeIn key={card.title} delay={0.1 * i}>
                  <div className="group rounded-xl border border-border/30 p-6 bg-secondary/10 hover:border-border hover:shadow-lg hover:shadow-gold/5 transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`rounded-lg p-3 ${card.bg}`}>
                        <Icon className={`h-6 w-6 ${card.color}`} />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="text-[10px] bg-secondary text-muted-foreground">{card.category}</Badge>
                        {card.premium && <Lock className="h-3.5 w-3.5 text-gold" />}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-gold transition-colors">{card.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                    <div className="mt-4 flex items-center gap-3">
                      <Button size="sm" variant="outline" className="border-border/50 hover:border-gold/30 hover:text-gold text-xs">
                        {card.premium ? 'Unlock Access' : 'Explore'}
                      </Button>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Premium CTA */}
      <section className="py-14 border-t border-border/30">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn>
            <div className="rounded-2xl border border-gold/20 bg-gold/5 p-10 text-center">
              <Lock className="mx-auto h-8 w-8 text-gold mb-4" />
              <h2 className="text-2xl font-bold text-foreground">Unlock Full Intelligence Access</h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Get unrestricted access to all intelligence products, real-time data feeds, and expert analysis with a Premium subscription.
              </p>
              <div className="mt-6 flex items-center justify-center gap-4">
                <Link href="/subscribe">
                  <Button className="bg-gold text-black hover:bg-gold/90">Start Free Trial</Button>
                </Link>
                <Link href="/subscribe">
                  <Button variant="outline" className="border-border hover:border-gold/30 hover:text-gold">View Plans</Button>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
