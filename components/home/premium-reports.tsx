'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FadeIn } from '@/components/shared/motion';
import { Download, Lock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categoryColors: Record<string, string> = {
  Gold: 'from-yellow-600/20 to-yellow-800/20 border-yellow-600/30',
  Lithium: 'from-green-600/20 to-green-800/20 border-green-600/30',
  ESG: 'from-emerald-600/20 to-emerald-800/20 border-emerald-600/30',
  Copper: 'from-orange-600/20 to-orange-800/20 border-orange-600/30',
  Investment: 'from-blue-600/20 to-blue-800/20 border-blue-600/30',
  Forecast: 'from-cyan-600/20 to-cyan-800/20 border-cyan-600/30',
};

export default function PremiumReports() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch('/api/reports')
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        setReports(Array.isArray(json?.data) ? json.data.slice(0, 6) : []);
      })
      .catch(() => setReports([]));
    return () => { mounted = false; };
  }, []);

  if (reports.length === 0) return null;

  return (
    <section className="py-20 border-t border-border/30">
      <div className="mx-auto max-w-7xl px-4">
        <FadeIn>
          <div className="mb-12 flex items-end justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">Intelligence</span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Premium Reports</h2>
            </div>
            <Link href="/reports" className="text-sm font-medium text-gold hover:text-gold-bright transition-colors">
              View all reports
            </Link>
          </div>
        </FadeIn>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report, i) => (
            <FadeIn key={report.id || report.slug} delay={0.1 + i * 0.05}>
              <div className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br p-6 transition-all hover:scale-[1.02] ${
                categoryColors[report.category] || 'from-secondary/20 to-secondary/10 border-border/50'
              }`}>
                {report.is_premium && (
                  <div className="absolute top-4 right-4">
                    <span className="flex items-center gap-1 rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-semibold text-gold">
                      <Lock className="h-2.5 w-2.5" />
                      PREMIUM
                    </span>
                  </div>
                )}
                <FileText className="h-8 w-8 text-muted-foreground/50 mb-4" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{report.category}</span>
                <h3 className="mt-2 text-lg font-bold text-foreground leading-snug group-hover:text-gold transition-colors">{report.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">{report.description}</p>
                <div className="mt-4">
                  <Link href={`/reports`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`text-xs ${report.is_premium ? 'border-gold/30 text-gold hover:bg-gold/10 hover:text-gold' : 'hover:border-foreground/30'}`}
                    >
                      <Download className="mr-1 h-3 w-3" />
                      {report.is_premium ? 'Premium Access' : 'View Report'}
                    </Button>
                  </Link>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
