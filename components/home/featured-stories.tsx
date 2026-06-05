 'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { FadeIn } from '@/components/shared/motion';
import { Clock, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';

const categoryColors: Record<string, string> = {
  News: 'bg-gold text-black',
  Analysis: 'bg-blue-500/20 text-blue-400',
  Interview: 'bg-emerald-500/20 text-emerald-400',
  Technology: 'bg-cyan-500/20 text-cyan-400',
  Investigation: 'bg-red-500/20 text-red-400',
};

export default function FeaturedStories() {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch('/api/articles?limit=5')
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        setArticles(Array.isArray(json.data) ? json.data : []);
      })
      .catch(() => setArticles([]));
    return () => { mounted = false };
  }, []);

  const featured = articles[0] || null;
  const rest = articles.slice(1);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section header */}
        <FadeIn>
          <div className="mb-12 flex items-end justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">
                Featured
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Top Stories
              </h2>
            </div>
            <Link href="/news" className="text-sm font-medium text-gold hover:text-gold-bright transition-colors">View all stories</Link>
          </div>
        </FadeIn>

        {/* Featured grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Main featured */}
          {featured ? (
            <FadeIn delay={0.1}>
              <Link href={`/article/${featured.slug || ''}`} className="group block">
                <div className="relative overflow-hidden rounded-2xl border border-border/50">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={featured.featured_image || featured.image || '/news/Latest News.jpeg'} alt={featured.title || 'Featured'} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <Badge className={`mb-3 ${categoryColors[featured.category] || 'bg-secondary text-foreground'}`}>{featured.category}</Badge>
                    <h3 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl group-hover:text-gold transition-colors">{featured.title}</h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-2">{featured.excerpt}</p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{featured.author}</span>
                      <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{featured.reading_time || featured.readingTime || 3} min read</span>
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ) : (
            <div className="text-center py-12">No featured stories available</div>
          )}

          {/* Side articles */}
          <div className="grid gap-4 sm:grid-cols-1">
            {rest.map((article, i) => (
              <FadeIn key={article.id || i} delay={0.15 + i * 0.1}>
                <Link href={`/article/${article.slug || ''}`} className="group block">
                  <div className="flex gap-4 rounded-xl border border-border/30 p-3 transition-colors hover:border-border hover:bg-secondary/30">
                    <div className="h-24 w-32 shrink-0 overflow-hidden rounded-lg sm:h-28 sm:w-40">
                      <img src={article.featured_image || article.image || '/news/Market reports.jpg'} alt={article.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className={`text-[10px] px-2 py-0 ${categoryColors[article.category] || ''}`}>{article.category}</Badge>
                          {article.isPremium && (<Lock className="h-3 w-3 text-gold" />)}
                        </div>
                        <h4 className="text-sm font-semibold leading-snug text-foreground group-hover:text-gold transition-colors line-clamp-2">{article.title}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span>{article.author}</span>
                        <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                        <span>{article.reading_time || article.readingTime || 3} min</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
