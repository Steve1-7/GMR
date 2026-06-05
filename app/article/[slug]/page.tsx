'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FadeIn } from '@/components/shared/motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Share2, Bookmark, ArrowLeft } from 'lucide-react';

export default function ArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [article, setArticle] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let mounted = true;

    async function load() {
      try {
        const res = await fetch(`/api/articles?slug=${encodeURIComponent(slug)}`);
        const json = await res.json();
        if (mounted) {
          setArticle(json?.data?.[0] ?? null);
        }
      } catch {
        if (mounted) setArticle(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [slug]);

  if (loading) {
    return <div className="p-12 text-center text-muted-foreground">Loading article...</div>;
  }

  if (!article) {
    return (
      <div className="p-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-6">This article may have been removed or is not yet published.</p>
        <Link href="/news">
          <Button variant="outline">Back to News</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="relative">
        <div className="aspect-[21/9] w-full overflow-hidden">
          <img
            src={article.featured_image || article.image || '/news/Latest News.jpeg'}
            alt={article.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <div className="mx-auto max-w-3xl px-4 pb-8">
            <FadeIn>
              <Link href="/news" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold mb-4">
                <ArrowLeft className="h-4 w-4" /> Back to News
              </Link>
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-gold text-black text-[10px]">{article.category}</Badge>
                <span className="text-xs text-muted-foreground">
                  {article.published_at ? new Date(article.published_at).toLocaleDateString() : ''}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />{article.reading_time || article.readingTime || 5} min read
                </span>
              </div>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {article.title}
              </h1>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4">
          <FadeIn>
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold font-bold text-lg">
                {(article.author || 'Staff').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div className="font-semibold text-foreground">{article.author || 'Staff'}</div>
                <div className="text-xs text-muted-foreground">{article.author_title || ''}</div>
              </div>
            </div>

            <div className="mb-8 flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => navigator.share?.({ title: article.title, url: window.location.href })}
              >
                <Share2 className="mr-1 h-3 w-3" /> Share
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                <Bookmark className="mr-1 h-3 w-3" /> Save
              </Button>
            </div>

            {article.excerpt && (
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{article.excerpt}</p>
            )}

            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content || '<p>No content available.</p>' }}
            />

            {(article.tags?.length > 0) && (
              <div className="mt-12 border-t border-border/50 pt-8">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag: string) => (
                    <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
