'use client';

import { useState, useEffect } from 'react';
import { FadeIn } from '@/components/shared/motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, Globe, TrendingUp, TrendingDown, ExternalLink, Building2 } from 'lucide-react';


const categories = ['All Categories', 'Mining Services', 'Equipment Providers', 'Logistics Companies', 'Engineering Firms', 'Exploration Companies', 'Consulting Firms', 'Energy & Infrastructure', 'Suppliers', 'Subcontractors'];
const countriesFilter = ['All Countries', 'Ghana', 'South Africa', 'UK', 'USA', 'Denmark'];

const categoryColors: Record<string, string> = {
  'Mining Services': 'bg-gold/10 text-gold border-gold/20',
  'Equipment Providers': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Logistics Companies': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Engineering Firms': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Exploration Companies': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'Consulting Firms': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'Energy & Infrastructure': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  Suppliers: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Subcontractors: 'bg-red-500/10 text-red-400 border-red-500/20',
};

function InitialsAvatar({ initials, size = 'lg' }: { initials: string; size?: 'sm' | 'lg' }) {
  const sz = size === 'lg' ? 'h-14 w-14 text-lg' : 'h-10 w-10 text-sm';
  return (
    <div className={`${sz} shrink-0 rounded-full gold-gradient flex items-center justify-center font-bold text-black`}>
      {initials}
    </div>
  );
}

export default function CompaniesPage() {
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [activeCountry, setActiveCountry] = useState('All Countries');
  const [companies, setCompanies] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch('/api/companies')
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        setCompanies(Array.isArray(json.data) ? json.data : json.data || []);
      })
      .catch(() => {});
    return () => { mounted = false };
  }, []);

  const filtered = companies.filter((c) => {
    const categoryMatch = activeCategory === 'All Categories' || c.category === activeCategory;
    const countryMatch = activeCountry === 'All Countries' || c.country === activeCountry;
    return categoryMatch && countryMatch;
  });

  const totalMktCap = companies.reduce((sum, c) => sum + c.marketCapNum, 0).toFixed(1);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-border/30 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <FadeIn>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">Directory</span>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Mining Companies
            </h1>
            <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              The definitive directory of mining companies operating across the African continent — from global majors to emerging junior explorers.
            </p>
          </FadeIn>

          {/* Summary stats */}
          <FadeIn delay={0.15}>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: 'Listed Companies', value: companies.length.toString() },
                { label: 'Combined Market Cap', value: `$${totalMktCap}B` },
                { label: 'Active Countries', value: '4' },
                { label: 'Total Projects', value: companies.reduce((s, c) => s + c.projects, 0).toString() },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border/40 bg-card/50 px-4 py-4">
                  <div className="text-2xl font-bold text-gold">{s.value}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Filters */}
          <FadeIn delay={0.25}>
            <div className="mt-8 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-medium">Category:</span>
                </div>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                      activeCategory === cat
                        ? 'bg-gold text-black'
                        : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-medium">Country:</span>
                </div>
                {countriesFilter.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveCountry(c)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                      activeCountry === c
                        ? 'bg-gold text-black'
                        : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Companies Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn>
            <p className="mb-6 text-sm text-muted-foreground">
              Showing <span className="text-foreground font-medium">{filtered.length}</span> of {companies.length} companies
            </p>
          </FadeIn>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((company, i) => (
              <FadeIn key={company.name} delay={0.05 * i}>
                <div className="group relative flex flex-col rounded-xl border border-border/40 bg-card transition-all duration-300 hover:border-gold/30 hover:shadow-xl hover:shadow-gold/5 overflow-hidden h-full">
                  {/* Subtle gradient top */}
                  <div className="h-0.5 w-full gold-gradient opacity-40 group-hover:opacity-100 transition-opacity" />

                  <div className="flex flex-col flex-1 p-6">
                    {/* Header row */}
                    <div className="flex items-start gap-4 mb-4">
                      <InitialsAvatar initials={company.initials} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-foreground leading-tight group-hover:text-gold transition-colors">
                            {company.name}
                          </h3>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${categoryColors[company.category] || 'bg-secondary text-muted-foreground border-border'}`}>
                            {company.category}
                          </span>
                          {company.featured && <span className="rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-gold text-black border-gold">Featured</span>}
                          <span className="text-[10px] text-muted-foreground">{company.hq}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stock info */}
                    <div className="mb-4 flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2.5">
                      <div>
                        <div className="text-xs text-muted-foreground">Ticker</div>
                        <div className="text-sm font-bold text-gold">{company.stockSymbol}</div>
                        <div className="text-[10px] text-muted-foreground">{company.exchange}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Market Cap</div>
                        <div className="text-sm font-bold text-foreground">{company.marketCap}</div>
                        {company.change !== 0 && (
                          <div className={`text-[10px] font-medium flex items-center justify-end gap-0.5 ${company.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {company.change >= 0
                              ? <TrendingUp className="h-2.5 w-2.5" />
                              : <TrendingDown className="h-2.5 w-2.5" />
                            }
                            {company.change >= 0 ? '+' : ''}{company.change}%
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1 mb-4">
                      {company.description}
                    </p>

                    {/* Regions */}
                    <div className="mb-4 flex flex-wrap gap-1">
                      {company.regions.map((r: any) => (
                        <span key={r} className="rounded-md bg-secondary/60 px-2 py-0.5 text-[10px] text-muted-foreground">
                          {r}
                        </span>
                      ))}
                    </div>

                    {/* Contact information */}
                    <div className="border-t border-border/30 pt-3 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium">Email:</span>
                        <a href={`mailto:${company.email}`} className="text-gold hover:underline truncate">{company.email}</a>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium">Website:</span>
                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline truncate flex items-center gap-1">
                          {company.website.replace('https://', '').replace('http://', '')}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Hover action */}
                  <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200 border-t border-gold/20 bg-gold/5 px-6 py-3">
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 text-xs font-semibold text-gold">
                      <ExternalLink className="h-3 w-3" />
                      Visit Website
                    </a>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {filtered.length === 0 && (
            <FadeIn>
              <div className="py-24 text-center">
                <Building2 className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No companies match your current filters.</p>
                <Button
                  variant="outline"
                  className="mt-4 border-border hover:border-gold/30 hover:text-gold"
                  onClick={() => { setActiveCategory('All Categories'); setActiveCountry('All Countries'); }}
                >
                  Reset Filters
                </Button>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* List your company CTA */}
      <div className="section-divider" />
      <section className="py-16 bg-secondary/10">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn>
            <div className="rounded-2xl border border-gold/20 bg-card p-8 md:p-12 text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">For Companies</span>
              <h2 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">
                List Your Company
              </h2>
              <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
                Reach 50,000+ mining professionals, investors, and government stakeholders. Add your company to the Gold-Coast Mining Review directory.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Button className="bg-gold text-black hover:bg-gold/90 font-semibold px-8">
                  Submit Your Company
                </Button>
                <Button variant="outline" className="border-border hover:border-gold/30 hover:text-gold">
                  Advertise with Us
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
