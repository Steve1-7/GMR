'use client';

import { useState, useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/shared/motion';
import { MapPin, Briefcase, DollarSign, Building2, ArrowRight } from 'lucide-react';

type JobType = string;

const typeColors: Record<string, string> = {
  'Full-Time': 'bg-emerald-500/20 text-emerald-400',
  'Contract': 'bg-blue-500/20 text-blue-400',
  'Part-Time': 'bg-purple-500/20 text-purple-400',
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('All');

  useEffect(() => {
    let mounted = true;
    fetch('/api/jobs')
      .then((r) => r.json())
      .then((json) => { if (mounted) setJobs(Array.isArray(json?.data) ? json.data : []); })
      .catch(() => { if (mounted) setJobs([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filters = useMemo(() => ['All', ...Array.from(new Set(jobs.map((j) => j.type).filter(Boolean)))], [jobs]);
  const filtered = active === 'All' ? jobs : jobs.filter((j) => j.type === active);

  return (
    <div className="min-h-screen">
      <section className="border-b border-border/30 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <FadeIn>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">Careers</span>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Mining Jobs</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              Career opportunities in African mining — connect with leading mining companies across the continent.
            </p>
          </FadeIn>

          {filters.length > 1 && (
            <FadeIn delay={0.15}>
              <div className="mt-8 flex flex-wrap gap-2">
                {filters.map((f) => (
                  <button key={f} onClick={() => setActive(f)} className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${active === f ? 'bg-gold text-black' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>{f}</button>
                ))}
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading jobs...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No job listings available. Check back soon.</p>
          ) : (
            <div className="grid gap-4">
              {filtered.map((job, i) => (
                <FadeIn key={job.id} delay={0.05 * i}>
                  <div className="rounded-xl border border-border/40 bg-card/50 p-6 hover:border-gold/30 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={typeColors[job.type] || 'bg-secondary'}>{job.type}</Badge>
                        </div>
                        <h3 className="text-lg font-bold text-foreground">{job.title}</h3>
                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{job.company}</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                          {job.salary_range && <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{job.salary_range}</span>}
                        </div>
                        {job.description && <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{job.description}</p>}
                      </div>
                      <Button variant="outline" className="shrink-0 border-gold/30 text-gold hover:bg-gold/10">
                        <Briefcase className="mr-2 h-4 w-4" />
                        Apply
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
