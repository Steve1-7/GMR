'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CountUp } from '@/components/shared/motion';

interface BreakingNewsItem {
  id: string;
  headline: string;
  summary?: string;
  article_url?: string;
}

interface HomepageStat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  color?: string;
}

const STAT_COLORS = ['text-gold', 'text-emerald-400', 'text-blue-400', 'text-foreground'];

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [showAd, setShowAd] = useState(true);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [breakingNewsItems, setBreakingNewsItems] = useState<BreakingNewsItem[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [stats, setStats] = useState<HomepageStat[]>([]);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const [breakingRes, adsRes, bannersRes, statsRes] = await Promise.all([
          fetch('/api/breaking-news'),
          fetch('/api/ads?type=banner'),
          fetch('/api/banners'),
          fetch('/api/settings?key=homepage_stats'),
        ]);

        if (!mounted) return;

        const breakingJson = await breakingRes.json();
        if (breakingJson?.data) setBreakingNewsItems(breakingJson.data);

        const adsJson = await adsRes.json();
        if (adsJson?.data) setAds(adsJson.data);

        const bannersJson = await bannersRes.json();
        if (bannersJson?.data?.length) {
          const imgs = bannersJson.data.map((b: { image_url: string }) => b.image_url).filter(Boolean);
          if (imgs.length) setHeroImages(imgs);
        }

        const statsJson = await statsRes.json();
        if (statsJson?.data) {
          const s = statsJson.data;
          const mapped: HomepageStat[] = [
            s.goldExports,
            s.miningGrowth,
            s.activeProjects,
            s.companiesTracked,
          ].filter(Boolean).map((stat: HomepageStat, i: number) => ({
            ...stat,
            color: STAT_COLORS[i % STAT_COLORS.length],
          }));
          if (mapped.length) setStats(mapped);
        }
      } catch {
        // empty states handled in render
      }
    }

    fetchData();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    if (ads.length <= 1) return;
    const adInterval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(adInterval);
  }, [ads.length]);

  useEffect(() => {
    if (breakingNewsItems.length <= 1) return;
    const newsInterval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % breakingNewsItems.length);
    }, 8000);
    return () => clearInterval(newsInterval);
  }, [breakingNewsItems.length]);

  const currentNews = breakingNewsItems[currentNewsIndex] || null;
  const bgImage = heroImages[currentImageIndex] || '/home/11.jpg';

  return (
    <>
      {showAd && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="relative bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 border-b border-gold/30"
        >
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="flex items-center justify-between gap-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAdIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-6 flex-1 group"
                >
                  {ads.length > 0 ? (
                    <Link href={ads[currentAdIndex]?.url || ads[currentAdIndex]?.link_url || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 flex-1 group">
                      <div className="relative w-44 h-28 shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={ads[currentAdIndex]?.image || ads[currentAdIndex]?.image_url || '/gold.webp'}
                          alt={ads[currentAdIndex]?.title || 'Advertisement'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gold mb-1">{ads[currentAdIndex]?.title}</div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{ads[currentAdIndex]?.description || ads[currentAdIndex]?.company_name}</p>
                      </div>
                      <Button size="sm" className="gold-gradient text-black font-semibold hover:opacity-90 transition-opacity shrink-0">
                        Visit Website
                      </Button>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-4 w-full">
                      <div className="relative w-44 h-28 shrink-0 overflow-hidden rounded-lg bg-secondary/20 flex items-center justify-center text-xs text-muted-foreground">
                        Advertise Here
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gold mb-1">Advertise With Us</div>
                        <p className="text-sm text-muted-foreground line-clamp-2">Reach mining executives and investors across Africa.</p>
                      </div>
                      <Link href="/advertise">
                        <Button size="sm" className="gold-gradient text-black font-semibold shrink-0">Get Started</Button>
                      </Link>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              <button
                onClick={() => setShowAd(false)}
                className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close ad"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {ads.length > 1 && (
              <div className="flex justify-center gap-2 mt-3">
                {ads.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentAdIndex(index)}
                    className={`h-2 w-2 rounded-full transition-all ${
                      currentAdIndex === index ? 'bg-gold w-6' : 'bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Go to ad ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      <section className="relative min-h-[90vh] overflow-hidden">
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${bgImage}')` }}
              />
            </motion.div>
          </AnimatePresence>
          <div className="hero-gradient absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-gold/6 to-black/60 opacity-90 mix-blend-overlay" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:py-32">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 flex items-center gap-2"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest text-red-400">Breaking</span>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentNews?.id || 'fallback'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                  {currentNews?.headline || 'Mining Intelligence for Africa'}
                </h1>
                <p className="mt-6 max-w-3xl text-lg text-muted-foreground leading-relaxed">
                  {currentNews?.summary || 'Stay informed with the latest updates from across African mining, expert analysis, and industry intelligence.'}
                </p>
              </motion.div>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              {currentNews?.article_url ? (
                <Link href={currentNews.article_url}>
                  <Button className="gold-gradient text-black font-semibold hover:opacity-90 transition-opacity h-12 px-8 text-base">
                    Read Story
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link href="/news">
                  <Button className="gold-gradient text-black font-semibold hover:opacity-90 transition-opacity h-12 px-8 text-base">
                    Explore Intelligence
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
              <Link href="/magazines">
                <Button variant="outline" className="h-12 px-8 text-base border-border hover:border-gold/50 hover:text-gold">
                  Read Magazine
                </Button>
              </Link>
              <Link href="/news">
                <Button variant="outline" className="h-12 px-8 text-base border-border hover:border-gold/50 hover:text-gold">
                  Latest Mining News
                </Button>
              </Link>
              <Link href="/advertise">
                <Button variant="outline" className="h-12 px-8 text-base border-gold text-gold hover:bg-gold/10">
                  Advertise With Us
                </Button>
              </Link>
            </motion.div>
          </div>

          {stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="glass rounded-xl p-4 sm:p-6">
                  <div className={`text-2xl font-bold sm:text-3xl ${stat.color || 'text-foreground'}`}>
                    <CountUp end={stat.value} prefix={stat.prefix || ''} suffix={stat.suffix || ''} />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-8 flex items-center gap-4 overflow-hidden border-t border-border/50 pt-6"
          >
            <span className="shrink-0 text-xs font-semibold uppercase tracking-widest text-gold">Latest</span>
            <div className="flex gap-8 overflow-x-auto scrollbar-hide">
              {breakingNewsItems.length > 0 ? (
                breakingNewsItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.article_url || '/news'}
                    className="shrink-0 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.headline}
                  </Link>
                ))
              ) : (
                <div className="shrink-0 text-sm text-muted-foreground">No breaking news at this time</div>
              )}
            </div>
          </motion.div>

          {heroImages.length > 1 && (
            <div className="absolute bottom-8 right-8 flex gap-2">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    currentImageIndex === index ? 'bg-gold w-8' : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
