'use client';

import { useState } from 'react';
import { FadeIn } from '@/components/shared/motion';
import Link from 'next/link';
import { MapPin, Building2, Newspaper, TrendingUp } from 'lucide-react';

interface CountryData {
  name: string;
  code: string;
  x: number;
  y: number;
  minerals: string[];
  projects: number;
  companies: number;
  investment: string;
}

const africanCountries: CountryData[] = [
  { name: 'Ghana', code: 'GH', x: 38, y: 48, minerals: ['Gold', 'Manganese', 'Bauxite'], projects: 23, companies: 14, investment: '$4.2B' },
  { name: 'South Africa', code: 'ZA', x: 52, y: 80, minerals: ['Gold', 'Platinum', 'Diamonds'], projects: 45, companies: 32, investment: '$8.1B' },
  { name: 'DRC', code: 'CD', x: 50, y: 56, minerals: ['Copper', 'Cobalt', 'Diamonds'], projects: 34, companies: 18, investment: '$6.3B' },
  { name: 'Zambia', code: 'ZM', x: 52, y: 64, minerals: ['Copper', 'Cobalt'], projects: 19, companies: 12, investment: '$3.1B' },
  { name: 'Mali', code: 'ML', x: 30, y: 38, minerals: ['Gold', 'Lithium'], projects: 15, companies: 8, investment: '$2.4B' },
  { name: 'Tanzania', code: 'TZ', x: 52, y: 52, minerals: ['Gold', 'Tanzanite'], projects: 12, companies: 7, investment: '$1.8B' },
  { name: 'Botswana', code: 'BW', x: 50, y: 74, minerals: ['Diamonds', 'Copper'], projects: 8, companies: 5, investment: '$2.1B' },
  { name: 'Namibia', code: 'NA', x: 38, y: 74, minerals: ['Diamonds', 'Uranium'], projects: 7, companies: 4, investment: '$1.2B' },
  { name: 'Nigeria', code: 'NG', x: 38, y: 38, minerals: ['Gold', 'Tin', 'Columbite'], projects: 9, companies: 6, investment: '$0.9B' },
  { name: 'Cameroon', code: 'CM', x: 42, y: 44, minerals: ['Bauxite', 'Iron Ore'], projects: 6, companies: 3, investment: '$3.5B' },
  { name: 'Morocco', code: 'MA', x: 34, y: 18, minerals: ['Phosphate', 'Cobalt'], projects: 11, companies: 8, investment: '$1.6B' },
  { name: 'Mozambique', code: 'MZ', x: 56, y: 64, minerals: ['Coal', 'Ruby'], projects: 8, companies: 5, investment: '$2.8B' },
  { name: 'Madagascar', code: 'MG', x: 62, y: 68, minerals: ['Nickel', 'Cobalt', 'Ilmenite'], projects: 6, companies: 4, investment: '$1.1B' },
  { name: 'Ivory Coast', code: 'CI', x: 32, y: 44, minerals: ['Gold', 'Manganese'], projects: 10, companies: 6, investment: '$1.4B' },
  { name: 'Senegal', code: 'SN', x: 24, y: 34, minerals: ['Gold', 'Phosphate'], projects: 7, companies: 4, investment: '$0.8B' },
];

export default function AfricaMiningMap() {
  const [selected, setSelected] = useState<CountryData | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="py-20 border-t border-border/30">
      <div className="mx-auto max-w-7xl px-4">
        <FadeIn>
          <div className="mb-12 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">
              Interactive
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Africa Mining Map
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Explore mining projects, companies, and investment opportunities across the African continent.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="relative rounded-2xl border border-border/50 bg-card overflow-hidden">
            {/* Map container */}
            <div className="relative aspect-[4/3] sm:aspect-[16/9] bg-gradient-to-br from-secondary/30 to-background">
              {/* Simplified Africa outline */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-20">
                {/* Africa landmass approximation */}
                <path
                  d="M 30 15 L 38 12 L 45 14 L 50 12 L 55 15 L 58 20 L 60 25 L 62 30 L 58 35 L 55 38 L 52 40 L 50 42 L 48 46 L 46 48 L 42 50 L 40 48 L 38 45 L 36 42 L 34 44 L 32 42 L 28 38 L 24 34 L 22 30 L 20 26 L 22 22 L 25 18 L 28 16 Z"
                  fill="hsl(var(--gold) / 0.1)"
                  stroke="hsl(var(--gold) / 0.3)"
                  strokeWidth="0.3"
                />
                <path
                  d="M 48 46 L 50 48 L 52 50 L 55 52 L 58 54 L 60 56 L 62 58 L 64 60 L 62 64 L 60 66 L 58 68 L 56 70 L 54 72 L 52 76 L 50 80 L 48 84 L 46 82 L 44 78 L 42 74 L 40 72 L 38 74 L 36 72 L 34 70 L 36 66 L 38 62 L 40 58 L 42 54 L 44 50 L 46 48 Z"
                  fill="hsl(var(--gold) / 0.1)"
                  stroke="hsl(var(--gold) / 0.3)"
                  strokeWidth="0.3"
                />
                {/* Madagascar */}
                <path
                  d="M 60 62 L 62 64 L 63 68 L 62 72 L 60 70 L 59 66 L 60 62 Z"
                  fill="hsl(var(--gold) / 0.1)"
                  stroke="hsl(var(--gold) / 0.3)"
                  strokeWidth="0.3"
                />
              </svg>

              {/* Country dots */}
              {africanCountries.map((country) => (
                <button
                  key={country.code}
                  className="absolute z-10 group"
                  style={{ left: `${country.x}%`, top: `${country.y}%` }}
                  onMouseEnter={() => setHovered(country.code)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(selected?.code === country.code ? null : country)}
                >
                  {/* Pulse ring */}
                  <span className="absolute -inset-3 rounded-full bg-gold/20 animate-ping opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Dot */}
                  <span
                    className={`relative flex h-3 w-3 items-center justify-center rounded-full transition-all ${
                      selected?.code === country.code
                        ? 'h-5 w-5 bg-gold shadow-lg shadow-gold/30'
                        : hovered === country.code
                        ? 'h-4 w-4 bg-gold/80'
                        : 'bg-gold/60'
                    }`}
                  >
                    <span className="absolute h-6 w-6 rounded-full border border-gold/30" />
                  </span>

                  {/* Country label */}
                  <span className={`absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs font-medium transition-opacity ${
                    hovered === country.code || selected?.code === country.code
                      ? 'opacity-100 text-foreground'
                      : 'opacity-60 text-muted-foreground'
                  }`}>
                    {country.name}
                  </span>
                </button>
              ))}

              {/* Grid overlay */}
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
                backgroundSize: '5% 5%',
              }} />
            </div>

            {/* Info panel */}
            {selected && (
              <div className="border-t border-border/50 bg-secondary/30 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{selected.name}</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selected.minerals.map((m) => (
                        <span key={m} className="rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <MapPin className="mx-auto h-4 w-4 text-muted-foreground mb-1" />
                      <div className="text-lg font-bold text-foreground">{selected.projects}</div>
                      <div className="text-[10px] text-muted-foreground">Projects</div>
                    </div>
                    <div className="text-center">
                      <Building2 className="mx-auto h-4 w-4 text-muted-foreground mb-1" />
                      <div className="text-lg font-bold text-foreground">{selected.companies}</div>
                      <div className="text-[10px] text-muted-foreground">Companies</div>
                    </div>
                    <div className="text-center">
                      <TrendingUp className="mx-auto h-4 w-4 text-muted-foreground mb-1" />
                      <div className="text-lg font-bold text-foreground">{selected.investment}</div>
                      <div className="text-[10px] text-muted-foreground">Investment</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/projects?country=${selected.code}`}
                    className="text-xs font-medium text-gold hover:text-gold-bright transition-colors"
                  >
                    View Projects
                  </Link>
                  <Link
                    href={`/news?country=${selected.code}`}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <Newspaper className="h-3 w-3" />
                    Related News
                  </Link>
                </div>
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
