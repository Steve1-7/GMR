'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/shared/motion';
import { Users, Globe, TrendingUp, Mail, Megaphone, Monitor, Newspaper, Calendar, ArrowRight } from 'lucide-react';

const audienceStats = [
  { icon: Users, label: 'Monthly Readers', value: '180,000+' },
  { icon: Globe, label: 'Countries', value: '92' },
  { icon: TrendingUp, label: 'Email Subscribers', value: '45,000+' },
  { icon: Monitor, label: 'Monthly Page Views', value: '620,000+' },
];

const options = [
  {
    icon: Newspaper,
    title: 'Sponsored Content',
    description: 'Long-form sponsored articles crafted by our editorial team, distributed across our platform and newsletter. Clearly labeled, deeply trusted.',
    price: 'From $3,500',
    tag: 'Most Popular',
  },
  {
    icon: Monitor,
    title: 'Display Advertising',
    description: 'Premium banner and sidebar placements across the Gold-Coast Mining Review site, targeted by section, geography, or audience segment.',
    price: 'From $1,200/mo',
    tag: null,
  },
  {
    icon: Mail,
    title: 'Newsletter Sponsorship',
    description: 'Reach 45,000+ mining professionals directly in their inbox. Exclusive category sponsorships and dedicated sends available.',
    price: 'From $2,000',
    tag: null,
  },
  {
    icon: Calendar,
    title: 'Events Partnership',
    description: 'Co-brand with Gold-Coast Mining Review at industry events, conferences, and summits. Title sponsorships and speaking slots available.',
    price: 'From $5,000',
    tag: 'Premium',
  },
];

const audience = [
  'Mine executives and operators (31%)',
  'Institutional and retail investors (27%)',
  'Government and regulatory officials (14%)',
  'Mining service providers (18%)',
  'Analysts and consultants (10%)',
];

export default function AdvertisePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-border/30 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <FadeIn>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">Partnerships</span>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Advertise With Us</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              Reach Africa&apos;s most influential mining professionals, investors, and policymakers through Gold-Coast Mining Review.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Audience stats */}
      <section className="border-b border-border/30">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {audienceStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <FadeIn key={stat.label} delay={0.1 * i}>
                  <div className="flex items-center gap-4 rounded-xl border border-border/30 bg-secondary/10 p-5">
                    <div className="rounded-lg bg-gold/10 p-2.5 shrink-0">
                      <Icon className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Audience breakdown */}
      <section className="py-14 border-b border-border/30">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-start">
            <FadeIn>
              <h2 className="text-2xl font-bold text-foreground mb-6">Our Audience</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Gold-Coast Mining Review readers are decision-makers. Our audience spans the full mining value chain — from boardroom to exploration camp.
              </p>
              <ul className="space-y-3">
                {audience.map((a) => (
                  <li key={a} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </FadeIn>

            {/* Advertising options */}
            <div className="space-y-4">
              {options.map((opt, i) => {
                const Icon = opt.icon;
                return (
                  <FadeIn key={opt.title} delay={0.1 * i}>
                    <div className="group rounded-xl border border-border/30 bg-secondary/10 p-5 hover:border-border transition-all">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-gold/10 p-2 shrink-0">
                            <Icon className="h-4 w-4 text-gold" />
                          </div>
                          <h3 className="font-semibold text-foreground">{opt.title}</h3>
                        </div>
                        {opt.tag && (
                          <Badge className="text-[10px] bg-gold/20 text-gold shrink-0">{opt.tag}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed ml-11">{opt.description}</p>
                      <div className="mt-3 ml-11 text-sm font-medium text-gold">{opt.price}</div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn>
            <div className="rounded-2xl border border-gold/20 bg-gold/5 p-10 text-center">
              <Megaphone className="mx-auto h-8 w-8 text-gold mb-4" />
              <h2 className="text-2xl font-bold text-foreground">Ready to Reach Mining Decision-Makers?</h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Our advertising team will work with you to build a package that meets your objectives and budget.
              </p>
              <div className="mt-6 flex items-center justify-center gap-4">
                <Link href="/contact">
                  <Button className="bg-gold text-black hover:bg-gold/90 gap-2">
                    Get in Touch <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href="mailto:advertising@ghanaminingjournal.com">
                  <Button variant="outline" className="border-border hover:border-gold/30 hover:text-gold gap-2">
                    <Mail className="h-4 w-4" /> Email Us
                  </Button>
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
