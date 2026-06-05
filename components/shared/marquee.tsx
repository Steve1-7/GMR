'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const BRAND_FALLBACK = [
  'Gold-Coast Mining Review',
  '•',
  "Your Gateway to Africa's Mining Excellence",
  '•',
  'Intelligence • News • Investment',
];

export default function PremiumMarquee() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [breakingRes, settingsRes] = await Promise.all([
          fetch('/api/breaking-news'),
          fetch('/api/settings?key=general'),
        ]);

        const breakingJson = await breakingRes.json();
        const settingsJson = await settingsRes.json();
        if (!mounted) return;

        const motto = settingsJson?.data?.motto || "Your Gateway to Africa's Mining Excellence";
        const headlines = Array.isArray(breakingJson?.data)
          ? breakingJson.data.map((n: { headline?: string }) => n.headline).filter(Boolean)
          : [];

        if (headlines.length > 0) {
          const sequence = [
            'Gold-Coast Mining Review',
            '•',
            motto,
            '•',
            ...headlines.flatMap((h: string) => [h, '•']),
          ];
          setItems([...sequence, ...sequence]);
        } else {
          setItems([...BRAND_FALLBACK, ...BRAND_FALLBACK]);
        }
      } catch {
        if (mounted) setItems([...BRAND_FALLBACK, ...BRAND_FALLBACK]);
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  const content = items.length ? items : BRAND_FALLBACK;

  return (
    <div className="relative w-full overflow-hidden border-b border-gold/30 bg-gradient-to-r from-background via-background to-background">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="flex items-center">
        <motion.div
          className="flex whitespace-nowrap py-3"
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          {content.map((item, index) => (
            <span
              key={index}
              className={`mx-6 text-sm font-medium ${item === '•' ? 'text-gold/60' : 'text-foreground'}`}
            >
              {item}
            </span>
          ))}
        </motion.div>

        <motion.div
          className="flex whitespace-nowrap py-3 absolute"
          animate={{ x: [1000, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          {content.map((item, index) => (
            <span
              key={`dup-${index}`}
              className={`mx-6 text-sm font-medium ${item === '•' ? 'text-gold/60' : 'text-foreground'}`}
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent" />
    </div>
  );
}
