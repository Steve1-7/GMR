'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/shared/motion';
import { Check, Lock, Zap, Crown } from 'lucide-react';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Essential news and market data for casual readers.',
    icon: null,
    cta: 'Get Started',
    ctaVariant: 'outline' as const,
    highlight: false,
    features: [
      '5 articles per month',
      'Daily newsletter',
      'Commodity price snapshot',
      'Breaking news alerts',
      'Community forum access',
    ],
    locked: [
      'Premium reports',
      'AI intelligence tools',
      'Full article archive',
      'Investor data feeds',
    ],
  },
  {
    name: 'Premium',
    price: '$29',
    period: 'per month',
    description: 'Unlimited access to intelligence for serious professionals.',
    icon: Zap,
    cta: 'Start Free Trial',
    ctaVariant: 'default' as const,
    highlight: true,
    features: [
      'Unlimited articles',
      'All premium reports (74+)',
      'AI intelligence tools',
      'Full article archive',
      'Priority newsletter',
      'Podcast transcripts',
      'Video library access',
    ],
    locked: [
      'Real-time data feeds',
      'Custom alerts',
    ],
  },
  {
    name: 'Investor',
    price: '$99',
    period: 'per month',
    description: 'Institutional-grade data and tools for investors.',
    icon: Crown,
    cta: 'Contact Sales',
    ctaVariant: 'outline' as const,
    highlight: false,
    features: [
      'Everything in Premium',
      'Real-time commodity data',
      'Project database API access',
      'Custom alerts & watchlists',
      'Company financial models',
      'Weekly analyst briefings',
      'Direct analyst access',
    ],
    locked: [],
  },
];

export default function SubscribePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-border/30 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <FadeIn>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">Plans</span>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Subscribe</h1>
            <p className="mt-4 max-w-xl mx-auto text-muted-foreground leading-relaxed">
              Unlock Premium Mining Intelligence — choose the plan that fits your needs.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Pricing tiers */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-6 lg:grid-cols-3">
            {tiers.map((tier, i) => {
              const Icon = tier.icon;
              return (
                <FadeIn key={tier.name} delay={0.1 * i}>
                  <div className={`relative flex flex-col rounded-2xl border p-7 h-full transition-all ${
                    tier.highlight
                      ? 'border-gold/40 bg-gold/5 shadow-lg shadow-gold/10'
                      : 'border-border/30 bg-secondary/10'
                  }`}>
                    {tier.highlight && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-black text-[10px] px-3">
                        Most Popular
                      </Badge>
                    )}
                    <div className="flex items-center gap-3 mb-4">
                      {Icon && (
                        <div className={`rounded-lg p-2 ${tier.highlight ? 'bg-gold/20' : 'bg-secondary'}`}>
                          <Icon className={`h-4 w-4 ${tier.highlight ? 'text-gold' : 'text-muted-foreground'}`} />
                        </div>
                      )}
                      <h3 className="text-lg font-bold text-foreground">{tier.name}</h3>
                    </div>
                    <div className="mb-2">
                      <span className="text-3xl font-bold text-foreground">{tier.price}</span>
                      <span className="text-sm text-muted-foreground ml-1">{tier.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">{tier.description}</p>

                    <Button
                      variant={tier.ctaVariant}
                      className={`mb-6 ${tier.highlight ? 'bg-gold text-black hover:bg-gold/90' : 'border-border hover:border-gold/30 hover:text-gold'}`}
                    >
                      {tier.cta}
                    </Button>

                    <div className="flex-1 space-y-2.5">
                      {tier.features.map((f) => (
                        <div key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                          <Check className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                      {tier.locked.map((f) => (
                        <div key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground/50">
                          <Lock className="h-4 w-4 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>

          <FadeIn delay={0.4}>
            <p className="mt-8 text-center text-xs text-muted-foreground">
              All plans include a 14-day free trial. Cancel anytime. Annual billing saves 20%.
            </p>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
