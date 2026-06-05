'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RotatingBannerAd {
  id: string;
  title: string;
  description: string;
  company: string;
  href: string;
  backgroundColor?: string;
  videoUrl?: string;
  imageUrl?: string;
}

interface RotatingBannerProps {
  ads: RotatingBannerAd[];
  autoPlay?: boolean;
  interval?: number;
}

export default function RotatingBanner({
  ads,
  autoPlay = true,
  interval = 5000,
}: RotatingBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, interval);

    return () => clearInterval(timer);
  }, [ads.length, autoPlay, interval]);

  const nextAd = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  const prevAd = () => {
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const currentAd = ads[currentIndex];

  return (
    <div className="relative overflow-hidden rounded-xl border border-gold/30 bg-gradient-to-r from-gold/15 via-gold/10 to-gold/15 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="relative p-6 md:p-8"
        >
          <Link href={currentAd.href} className="relative overflow-hidden rounded-lg block">
            <Badge className="absolute top-4 right-4 bg-gold text-black text-xs font-semibold z-10">
              Featured
            </Badge>

            {/* media */}
            {currentAd.videoUrl ? (
              <video
                src={currentAd.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-48 md:h-64 lg:h-80 object-cover rounded-lg"
              />
            ) : (
              <div
                className="w-full h-48 md:h-64 lg:h-80 bg-cover bg-center rounded-lg"
                style={{ backgroundImage: `url('${currentAd.imageUrl || '/gold.webp'}')` }}
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-lg" />

            <div className="absolute left-6 right-6 bottom-6 md:left-8 md:right-8 md:bottom-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="text-xs text-gold font-semibold mb-2 uppercase tracking-wider">
                    {currentAd.company}
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold text-foreground mb-2">
                    {currentAd.title}
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
                    {currentAd.description}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="gold-gradient text-black font-semibold px-5 py-2 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
                  >
                    Learn More
                  </motion.button>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <button
        onClick={prevAd}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-gold hover:text-black transition-colors z-10"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={nextAd}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-gold hover:text-black transition-colors z-10"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {ads.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-gold' : 'bg-gold/30'
            }`}
          />
        ))}
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl" />
    </div>
  );
}
