"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface FullWidthAdProps {
  title?: string;
  description?: string;
  ctaText?: string;
  href?: string;
  backgroundImage?: string;
  videoUrl?: string;
  sponsorLogo?: string;
  isPlaceholder?: boolean;
}

export default function FullWidthAd({
  title,
  description,
  ctaText = 'Advertise With Us',
  href = '/advertise',
  backgroundImage,
  videoUrl,
  sponsorLogo,
  isPlaceholder = false,
}: FullWidthAdProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-r from-background/70 to-background/30 p-6`}
    >
      {isPlaceholder ? (
        <div className="flex items-center justify-between gap-6 p-8 md:p-12">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-muted-foreground">Advertise Here</h3>
            <p className="mt-2 text-muted-foreground max-w-2xl">Premium full-width placement available for corporate partners. Reach mining executives, investors and industry leaders.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/advertise">
              <button className="gold-gradient text-black font-semibold px-6 py-3 rounded-lg">Learn More</button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden">
          {/* media */}
          {videoUrl ? (
            <video
              src={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-64 object-cover md:h-96"
            />
          ) : (
            <div
              className="w-full h-64 md:h-96 bg-cover bg-center"
              style={{ backgroundImage: `url('${backgroundImage || '/gold.webp'}')` }}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="absolute left-6 bottom-6 right-6 md:left-12 md:bottom-12 md:right-12">
            <div className="flex items-center justify-between gap-6">
              <div>
                {sponsorLogo && <img src={sponsorLogo} alt="Sponsor" loading="lazy" className="h-10 mb-2" />}
                <h3 className="text-2xl md:text-4xl font-bold text-foreground leading-tight">{title}</h3>
                <p className="mt-2 text-muted-foreground max-w-2xl">{description}</p>
              </div>
              <div className="flex items-center gap-4">
                <Link href={href}>
                  <button className="gold-gradient text-black font-semibold px-6 py-3 rounded-lg">{ctaText}</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
}
