'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/shared/motion';
import { Lock, Download, FileText, ShieldCheck } from 'lucide-react';

const categoryColors: Record<string, string> = {
  Gold: 'bg-gold/20 text-gold',
  Lithium: 'bg-emerald-500/20 text-emerald-400',
  ESG: 'bg-cyan-500/20 text-cyan-400',
  Investment: 'bg-blue-500/20 text-blue-400',
  Copper: 'bg-orange-500/20 text-orange-400',
  Forecast: 'bg-purple-500/20 text-purple-400',
};

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch('/api/reports')
      .then((r) => r.json())
      .then((json) => { if (mounted) setReports(Array.isArray(json?.data) ? json.data : []); })
      .catch(() => { if (mounted) setReports([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen">
      <section className="border-b border-border/30 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <FadeIn>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">Research</span>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Premium Reports</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              Institutional-grade research and intelligence reports from Africa&apos;s leading mining analysts.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading reports...</p>
          ) : reports.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No reports published yet.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reports.map((report, i) => (
                <FadeIn key={report.id || report.slug} delay={0.05 * i}>
                  <div className="rounded-xl border border-border/40 bg-card/50 p-6 hover:border-gold/30 transition-colors h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <FileText className="h-8 w-8 text-gold/50" />
                      {report.is_premium && (
                        <Badge className="bg-gold/10 text-gold text-[10px]"><Lock className="h-2.5 w-2.5 mr-1" />PREMIUM</Badge>
                      )}
                    </div>
                    <Badge className={`w-fit mb-3 ${categoryColors[report.category] || 'bg-secondary'}`}>{report.category}</Badge>
                    <h3 className="text-lg font-bold text-foreground mb-2">{report.title}</h3>
                    <p className="text-sm text-muted-foreground flex-1 line-clamp-3">{report.description}</p>
                    <div className="mt-4 pt-4 border-t border-border/30">
                      <Button variant="outline" size="sm" className={report.is_premium ? 'border-gold/30 text-gold' : ''}>
                        <Download className="mr-1 h-3 w-3" />
                        {report.is_premium ? 'Premium Access' : 'Download'}
                      </Button>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          )}

          <FadeIn delay={0.3}>
            <div className="mt-12 rounded-2xl border border-gold/20 bg-gold/5 p-8 text-center">
              <ShieldCheck className="mx-auto h-10 w-10 text-gold mb-4" />
              <h3 className="text-xl font-bold mb-2">Subscribe for Full Access</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">Get unlimited access to all premium reports and intelligence.</p>
              <Link href="/subscribe">
                <Button className="gold-gradient text-black font-semibold">View Subscription Plans</Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
