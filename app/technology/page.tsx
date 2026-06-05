'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FadeIn } from '@/components/shared/motion';
import { Badge } from '@/components/ui/badge';
import { Clock, Filter } from 'lucide-react';

const categories = ['All', 'Technology', 'AI & Automation', 'Equipment', 'Safety', 'Sustainability'];

export default function TechnologyPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    let mounted = true;
    fetch('/api/articles?limit=50')
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        const tech = (json?.data || []).filter((a: any) =>
          ['Technology', 'AI & Automation', 'Equipment', 'Safety', 'Sustainability'].includes(a.category) ||
          a.category?.toLowerCase().includes('tech')
        );
        setArticles(tech.length ? tech : (json?.data || []));
      })
      .catch(() => { if (mounted) setArticles([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filtered = activeCategory === 'All'
    ? articles
    : articles.filter((a) => a.category === activeCategory);

  return (
    <div className="min-h-screen">
      <section className="border-b border-border/30 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <FadeIn>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">Innovation</span>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Mining Technology</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              AI, automation, equipment, safety, and sustainability innovations shaping Africa&apos;s mining future.
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${activeCategory === cat ? 'bg-gold text-black' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>{cat}</button>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading articles...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No technology articles published yet.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((article, i) => (
                <FadeIn key={article.id || article.slug} delay={0.05 * i}>
                  <Link href={`/article/${article.slug}`} className="group block rounded-xl border border-border/30 overflow-hidden hover:border-gold/30 transition-colors">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={article.featured_image || '/news/Research Services.jpeg'} alt={article.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-5">
                      <Badge className="text-[10px] mb-2">{article.category}</Badge>
                      <h3 className="font-semibold text-foreground group-hover:text-gold transition-colors line-clamp-2">{article.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {article.reading_time || 5} min read
                      </div>
                    </div>
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
