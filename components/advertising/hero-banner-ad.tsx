'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface HeroBannerAdProps {
  title: string;
  description: string;
  ctaText: string;
  href: string;
  backgroundColor?: string;
  sponsorLogo?: string;
  isPremium?: boolean;
}

export default function HeroBannerAd({
  title,
  description,
  ctaText,
  href,
  backgroundColor = 'bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20',
  sponsorLogo,
  isPremium = true,
}: HeroBannerAdProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-2xl border border-gold/30 ${backgroundColor} backdrop-blur-sm`}
    >
      {/* Gold accent border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-gold/20 pointer-events-none" />
      
      {/* Premium badge */}
      {isPremium && (
        <Badge className="absolute top-4 right-4 bg-gold text-black font-semibold">
          Sponsored
        </Badge>
      )}

      <div className="relative p-8 md:p-12">
        <div className="max-w-3xl">
          {/* Sponsor logo if provided */}
          {sponsorLogo && (
            <div className="mb-6">
              <img
                src={sponsorLogo}
                alt="Sponsor"
                loading="lazy"
                className="h-12 w-auto opacity-80"
              />
            </div>
          )}

          {/* Content */}
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            {title}
          </h3>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl">
            {description}
          </p>

          {/* CTA */}
          <Link href={href}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="gold-gradient text-black font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              {ctaText}
            </motion.button>
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-20 w-32 h-32 bg-gold/10 rounded-full blur-2xl" />
      </div>
    </motion.div>
  );
}
