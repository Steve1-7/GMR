 'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/shared/motion';
import { Clock, Lock, Filter, TrendingUp, Search as SearchIcon } from 'lucide-react';

const categories = ['All', 'Mining News', 'Gold Industry', 'African Mining', 'Business & Investment', 'Technology', 'Energy & Resources'];

const categoryColors: Record<string, string> = {
  'Mining News': 'bg-gold text-black',
  'Gold Industry': 'bg-amber-500/20 text-amber-400',
  'African Mining': 'bg-emerald-500/20 text-emerald-400',
  'Business & Investment': 'bg-blue-500/20 text-blue-400',
  Technology: 'bg-cyan-500/20 text-cyan-400',
  'Energy & Resources': 'bg-purple-500/20 text-purple-400',
};

 export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [query]);

  const [items, setItems] = useState<any[]>([]);
  const [breaking, setBreaking] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    async function loadArticles() {
      try {
        const res = await fetch('/api/articles?limit=24');
        const json = await res.json();
        if (mounted && json?.data) setItems(json.data);
      } catch (err) {
        console.error('Failed to load articles', err);
      }
    }

    async function loadBreaking() {
      try {
        const res = await fetch('/api/breaking-news');
        const json = await res.json();
        if (mounted && json?.data) setBreaking(json.data.map((d:any) => d.headline));
      } catch (err) {
        console.error('Failed to load breaking news', err);
      }
    }

    loadArticles();
    loadBreaking();
    return () => { mounted = false; };
  }, []);

  const filtered = items.filter((a) => {
    const matchesCategory = activeCategory === 'All' ? true : a.category === activeCategory;
    const matchesQuery = debouncedQuery
      ? [a.title, a.excerpt, (a.author || ''), a.category].join(' ').toLowerCase().includes(debouncedQuery)
      : true;
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-border/30 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <FadeIn>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">Journal</span>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">News</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              The latest mining news, analysis, and intelligence from across the African continent.
            </p>
          </FadeIn>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <FadeIn delay={0.15}>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full max-w-md">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    aria-label="Search news"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search headlines, authors, topics..."
                    className="w-full pl-10 pr-4 py-2 rounded-full border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
                  />
                </div>
              </div>
            </FadeIn>

            {/* Category filters */}
            <FadeIn delay={0.2}>
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground mr-2" />
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                      activeCategory === cat
                        ? 'bg-gold text-black'
                        : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Breaking ticker */}
      <section className="border-b border-border/30 bg-background/80">
        <div className="mx-auto max-w-7xl px-4 py-2 overflow-hidden">
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-red-400">Breaking</span>
            <div className="overflow-hidden whitespace-nowrap text-sm text-muted-foreground">
              <div className="animate-marquee inline-block">
                {(breaking.length > 0 ? breaking : ['No breaking news']).map((t, i) => (
                  <span key={i} className="mx-8">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="border-b border-border/30">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center gap-4 overflow-x-auto">
            <span className="flex items-center gap-1 shrink-0 text-xs font-semibold text-gold">
              <TrendingUp className="h-3 w-3" /> Trending
            </span>
            {items.slice(0, 5).map((a) => (
              <Link key={a.id || a.slug} href={`/article/${a.slug}`} className="shrink-0 text-xs text-muted-foreground hover:text-foreground transition-colors">
                {a.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Articles grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No articles found. Publish content via the admin dashboard.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((article, i) => (
                <FadeIn key={article.id || article.slug} delay={0.05 * i}>
                  <Link href={`/article/${article.slug}`} className="group block">
                    <article className="overflow-hidden rounded-xl border border-border/30 transition-all hover:border-border hover:shadow-lg hover:shadow-gold/5">
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={article.featured_image || article.image || '/news/Latest News.jpeg'}
                          alt={article.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={`text-[10px] ${categoryColors[article.category] || ''}`}>
                            {article.category}
                          </Badge>
                          {article.is_premium && (
                            <Lock className="h-3 w-3 text-gold" />
                          )}
                        </div>
                        <h3 className="text-base font-semibold leading-snug text-foreground group-hover:text-gold transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{article.author || 'Staff'}</span>
                          <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                          <span>{article.published_at ? new Date(article.published_at).toLocaleDateString() : ''}</span>
                          <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                          <span className="flex items-center gap-0.5">
                            <Clock className="h-3 w-3" />
                            {article.reading_time || 5}m
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
