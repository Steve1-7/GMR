'use client';

import { useState } from 'react';
import { FadeIn } from '@/components/shared/motion';
import { Button } from '@/components/ui/button';
import { Mail, Check, ArrowRight } from 'lucide-react';

export default function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/newsletter_subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
        body: JSON.stringify({ email }),
      });
      if (res.ok || res.status === 409) {
        setSubmitted(true);
      }
    } catch {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-20 border-t border-border/30">
      <div className="mx-auto max-w-7xl px-4">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-gold/5 via-card to-gold/5 p-8 sm:p-16">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 h-1 w-full gold-gradient" />
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gold/5 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-gold/5 blur-3xl" />

            <div className="relative text-center max-w-2xl mx-auto">
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">
                Stay Informed
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Get Africa&apos;s Mining Intelligence Weekly
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Join 12,000+ mining professionals, investors, and industry leaders who receive our
                weekly intelligence briefing covering market analysis, project updates, and investment insights.
              </p>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                  <div className="relative flex-1 max-w-md">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-xl border border-border bg-background/50 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="gold-gradient text-black font-semibold hover:opacity-90 transition-opacity h-12 px-8"
                  >
                    Subscribe
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <div className="mt-8 flex items-center justify-center gap-2 text-emerald-400">
                  <Check className="h-5 w-5" />
                  <span className="font-medium">You&apos;re subscribed! Check your inbox for confirmation.</span>
                </div>
              )}

              <p className="mt-4 text-xs text-muted-foreground">
                Free newsletter. Unsubscribe anytime. No spam, ever.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
