'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Clock, TrendingUp } from 'lucide-react';

interface NewsItem {
  id: string;
  slug?: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  date: string;
  readTime: string;
  trending?: boolean;
}

export default function NewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch('/api/articles?limit=4');
        const json = await res.json();
        if (mounted && json?.data) {
          setNewsItems(json.data.map((a: any) => ({
            id: a.id,
            slug: a.slug,
            title: a.title,
            excerpt: a.excerpt,
            category: a.category,
            image: a.featured_image || '/news/Latest News.jpeg',
            date: a.published_at || a.created_at,
            readTime: (a.reading_time || 5) + ' min read',
            trending: false,
          })));
        }
      } catch (err) {
        console.error('Failed to load articles for carousel', err);
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  // newsItems loaded from API

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % newsItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + newsItems.length) % newsItems.length);
  };

  const currentItem = newsItems[currentIndex] || ({} as NewsItem);

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              <span className="gold-gradient-text">Featured</span> News
            </h2>
            <p className="text-muted-foreground">
              Stay updated with the latest mining industry developments
            </p>
          </div>
          <Link href="/news">
            <Button variant="outline" className="border-gold text-gold hover:bg-gold/10 hidden md:flex">
              View All News
            </Button>
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden rounded-2xl border border-border/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="relative h-[400px] md:h-[500px]"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${currentItem.image || '/home/11.jpg'}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />

              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="mx-auto max-w-7xl px-4 w-full">
                  <div className="max-w-2xl">
                    {/* Category Badge */}
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className="bg-gold text-black font-semibold">
                        {currentItem.category}
                      </Badge>
                      {currentItem.trending && (
                        <Badge variant="outline" className="border-gold/30 text-gold flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Trending
                        </Badge>
                      )}
                    </div>

                    {/* Title */}
                    <Link href={currentItem.slug ? `/article/${currentItem.slug}` : '/news'}>
                      <h3 className="text-2xl md:text-4xl font-bold text-foreground mb-4 hover:text-gold transition-colors cursor-pointer">
                        {currentItem.title}
                      </h3>
                    </Link>

                    {/* Excerpt */}
                    <p className="text-muted-foreground text-lg mb-6 line-clamp-2 md:line-clamp-3">
                      {currentItem.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {currentItem.date ? new Date(currentItem.date).toLocaleDateString() : ''}
                      </div>
                      <div>{currentItem.readTime}</div>
                    </div>

                    {/* CTA */}
                    <Link href="/news">
                      <Button className="gold-gradient text-black font-semibold hover:opacity-90 transition-opacity">
                        Read Full Story
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-gold hover:text-black transition-all z-10"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-gold hover:text-black transition-all z-10"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {newsItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-gold w-8' : 'bg-gold/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mobile View All Button */}
        <div className="mt-6 text-center md:hidden">
          <Link href="/news">
            <Button variant="outline" className="border-gold text-gold hover:bg-gold/10 w-full">
              View All News
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
