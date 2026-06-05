'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

interface SidebarAdProps {
  title: string;
  description: string;
  company: string;
  href: string;
  image?: string;
  isPremium?: boolean;
}

export default function SidebarAd({
  title,
  description,
  company,
  href,
  image,
  isPremium = false,
}: SidebarAdProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-xl border ${
        isPremium ? 'border-gold/40 bg-gradient-to-br from-gold/10 to-gold/5' : 'border-border bg-card'
      } backdrop-blur-sm hover:border-gold/60 transition-all duration-300 group`}
    >
      <Link href={href} className="block">
        {isPremium && (
          <Badge className="absolute top-3 right-3 bg-gold text-black text-xs font-semibold">
            Featured
          </Badge>
        )}

        <div className="p-6">
          {image && (
            <div className="mb-4 relative overflow-hidden rounded-lg">
              <img
                src={image}
                alt={company}
                loading="lazy"
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          <div className="text-xs text-gold font-semibold mb-2 uppercase tracking-wider">
            {company}
          </div>

          <h4 className="text-lg font-bold text-foreground mb-2 group-hover:text-gold transition-colors">
            {title}
          </h4>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {description}
          </p>

          <div className="flex items-center text-xs font-medium text-gold group-hover:translate-x-1 transition-transform">
            Learn More <ExternalLink className="ml-1 h-3 w-3" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
