'use client';

import { useEffect, useState } from 'react';
import { FadeIn } from '@/components/shared/motion';
import { Shield, Globe, Users, Award, BookOpen, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const values = [
  { icon: Shield, title: 'Editorial Independence', description: 'Our reporting is free from commercial or political influence. We hold ourselves to the highest standards of journalistic integrity.' },
  { icon: Globe, title: 'Pan-African Perspective', description: "We cover the entire African continent, not just the largest markets. Every nation's mining story deserves to be told." },
  { icon: Users, title: 'Industry Expertise', description: 'Our team combines decades of mining journalism, financial analysis, and on-the-ground reporting experience.' },
  { icon: Award, title: 'Trusted Intelligence', description: 'Mining executives, investors, and policymakers rely on our data-driven insights and exclusive reporting.' },
  { icon: BookOpen, title: 'Premium Publications', description: 'Our quarterly magazine and research reports deliver in-depth analysis unavailable anywhere else.' },
  { icon: TrendingUp, title: 'Investment Focus', description: 'We connect capital with opportunity, providing the intelligence investors need to make informed decisions.' },
];

export default function AboutPage() {
  const [team, setTeam] = useState<any[]>([]);
  const [stats, setStats] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from('authors').select('*').order('name'),
      fetch('/api/stats'),
    ])
      .then(async ([authorsRes, statsRes]) => {
        if (authorsRes.data?.length) {
          setTeam(authorsRes.data.map((a: any) => ({
            name: a.name,
            role: a.title || 'Contributor',
            initials: a.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2),
            bio: a.bio || '',
          })));
        }
        const statsJson = await statsRes.json();
        const counts = statsJson?.data?.counts || {};
        setStats([
          { label: 'Articles Published', value: (counts.articles || 0).toString() },
          { label: 'Companies Tracked', value: (counts.companies || 0).toString() },
          { label: 'Magazine Issues', value: (counts.magazines || 0).toString() },
          { label: 'Events Listed', value: (counts.events || 0).toString() },
        ]);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      <section className="border-b border-border/30 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <FadeIn>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">Our Story</span>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">About Gold-Coast Mining Review</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              Africa&apos;s leading mining intelligence and media platform — delivering news, data, and insights to mining investors and industry leaders.
            </p>
          </FadeIn>
        </div>
      </section>

      {stats.length > 0 && (
        <section className="py-12 border-b border-border/30">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((stat, i) => (
                <FadeIn key={stat.label} delay={i * 0.1}>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold">{stat.value}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn>
            <h2 className="text-2xl font-bold mb-8">Our Values</h2>
          </FadeIn>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <FadeIn key={v.title} delay={i * 0.1}>
                <div className="rounded-xl border border-border/30 p-6">
                  <v.icon className="h-8 w-8 text-gold mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {team.length > 0 && (
        <section className="py-16 border-t border-border/30">
          <div className="mx-auto max-w-7xl px-4">
            <FadeIn><h2 className="text-2xl font-bold mb-8">Editorial Team</h2></FadeIn>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member, i) => (
                <FadeIn key={member.name} delay={i * 0.1}>
                  <div className="rounded-xl border border-border/30 p-6 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 text-gold font-bold text-xl">{member.initials}</div>
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    <p className="text-sm text-gold mb-2">{member.role}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{member.bio}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
