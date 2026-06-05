'use client';

import { useState, useEffect, useMemo } from 'react';
import { FadeIn } from '@/components/shared/motion';
import { Badge } from '@/components/ui/badge';
import { Filter, MapPin, Building2, Gem } from 'lucide-react';

const statusColors: Record<string, string> = {
  Operating: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Development: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  Expansion: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  Exploration: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCountry, setActiveCountry] = useState('All Countries');
  const [activeStatus, setActiveStatus] = useState('All Statuses');

  useEffect(() => {
    let mounted = true;
    fetch('/api/projects')
      .then((r) => r.json())
      .then((json) => {
        if (mounted) setProjects(Array.isArray(json?.data) ? json.data : []);
      })
      .catch(() => { if (mounted) setProjects([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const countries = useMemo(() => ['All Countries', ...Array.from(new Set(projects.map((p) => p.country).filter(Boolean)))], [projects]);
  const statuses = useMemo(() => ['All Statuses', ...Array.from(new Set(projects.map((p) => p.status).filter(Boolean)))], [projects]);

  const filtered = projects.filter((p) => {
    const countryMatch = activeCountry === 'All Countries' || p.country === activeCountry;
    const statusMatch = activeStatus === 'All Statuses' || p.status === activeStatus;
    return countryMatch && statusMatch;
  });

  const stats = [
    { label: 'Active Projects', value: projects.filter((p) => p.status === 'Operating').length.toString() },
    { label: 'In Development', value: projects.filter((p) => p.status === 'Development').length.toString() },
    { label: 'Expansions', value: projects.filter((p) => p.status === 'Expansion').length.toString() },
    { label: 'Total Projects', value: projects.length.toString() },
  ];

  return (
    <div className="min-h-screen">
      <section className="border-b border-border/30 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <FadeIn>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">Intelligence</span>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Mining Projects</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              Comprehensive intelligence on Africa&apos;s most significant mining projects — from exploration to production.
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl border border-border/40 bg-card/50 px-4 py-4">
                  <div className="text-2xl font-bold text-gold">{s.value}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>

          {countries.length > 1 && (
            <FadeIn delay={0.25}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Filter className="h-4 w-4 text-muted-foreground" />
                {countries.map((c) => (
                  <button key={c} onClick={() => setActiveCountry(c)} className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${activeCountry === c ? 'bg-gold text-black' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>{c}</button>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {statuses.map((s) => (
                  <button key={s} onClick={() => setActiveStatus(s)} className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${activeStatus === s ? 'bg-gold text-black' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>{s}</button>
                ))}
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading projects...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No projects found. Add projects via the admin dashboard.</p>
          ) : (
            <>
              <FadeIn>
                <p className="mb-6 text-sm text-muted-foreground">
                  Showing <span className="text-foreground font-medium">{filtered.length}</span> of {projects.length} projects
                </p>
              </FadeIn>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((project, i) => (
                  <FadeIn key={project.id || project.slug} delay={0.05 * i}>
                    <div className="rounded-xl border border-border/40 bg-card/50 p-5 hover:border-gold/30 transition-colors h-full flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-foreground leading-snug">{project.name}</h3>
                        <Badge className={`text-[10px] shrink-0 ${statusColors[project.status] || 'bg-secondary'}`}>{project.status}</Badge>
                      </div>
                      <div className="space-y-2 text-xs text-muted-foreground flex-1">
                        <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3" />{project.country}{project.region ? `, ${project.region}` : ''}</div>
                        <div className="flex items-center gap-1.5"><Building2 className="h-3 w-3" />{project.companies?.name || project.company || 'N/A'}</div>
                        {project.minerals?.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Gem className="h-3 w-3 shrink-0" />
                            {project.minerals.map((m: string) => <span key={m} className="text-gold">{m}</span>)}
                          </div>
                        )}
                      </div>
                      {project.description && <p className="mt-3 text-xs text-muted-foreground line-clamp-3">{project.description}</p>}
                      {project.investment_value && (
                        <div className="mt-4 pt-3 border-t border-border/30 text-sm font-semibold text-gold">{project.investment_value}</div>
                      )}
                    </div>
                  </FadeIn>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
