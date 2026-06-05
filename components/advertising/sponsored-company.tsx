'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Building2, TrendingUp, Globe } from 'lucide-react';

interface SponsoredCompanyProps {
  name: string;
  tagline: string;
  description: string;
  href: string;
  logo?: string;
  location?: string;
  sector?: string;
  featured?: boolean;
}

export default function SponsoredCompany({
  name,
  tagline,
  description,
  href,
  logo,
  location,
  sector,
  featured = false,
}: SponsoredCompanyProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className={`relative overflow-hidden rounded-xl border ${
        featured
          ? 'border-gold/40 bg-gradient-to-br from-gold/10 via-gold/5 to-gold/10'
          : 'border-border bg-card'
      } backdrop-blur-sm hover:border-gold/60 transition-all duration-300 group`}
    >
      <Link href={href} className="block">
        {featured && (
          <Badge className="absolute top-4 right-4 bg-gold text-black font-semibold z-10">
            Featured Partner
          </Badge>
        )}

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            {logo ? (
              <img
                src={logo}
                alt={name}
                loading="lazy"
                className="w-16 h-16 object-contain rounded-lg bg-background/50 p-2"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gold/10 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-gold" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground group-hover:text-gold transition-colors">
                {name}
              </h3>
              <p className="text-sm text-gold font-medium">{tagline}</p>
            </div>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap gap-3 mb-4 text-xs text-muted-foreground">
            {location && (
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {location}
              </div>
            )}
            {sector && (
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {sector}
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {description}
          </p>

          {/* CTA */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gold group-hover:translate-x-1 transition-transform">
              View Profile →
            </span>
          </div>
        </div>

        {/* Decorative glow */}
        {featured && (
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl group-hover:bg-gold/20 transition-colors" />
        )}
      </Link>
    </motion.div>
  );
}
