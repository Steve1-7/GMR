'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/shared/motion';
import { Calendar, MapPin, Users, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

import { useState, useEffect } from 'react';

const eventsSample: any[] = [];

// will fetch from /api/events

const categoryColors: Record<string, string> = {
  Conference: 'bg-gold/20 text-gold',
  Exhibition: 'bg-emerald-500/20 text-emerald-400',
  Convention: 'bg-blue-500/20 text-blue-400',
  Summit: 'bg-purple-500/20 text-purple-400',
};

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>(eventsSample);

  useEffect(() => {
    let mounted = true;
    fetch('/api/events')
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        setEvents(Array.isArray(json.data) ? json.data : json.data || []);
      })
      .catch(() => {});
    return () => { mounted = false };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-border/30 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <FadeIn>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">Calendar</span>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Events</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              Mining Industry Calendar — key conferences, summits, and exhibitions shaping Africa&apos;s mining sector.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Events */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4">
          {/* Featured event (guarded) */}
          {events && events.length > 0 && (
            <FadeIn>
              <Link href={events[0].url ? events[0].url : '#'} className="block mb-8">
                <div className="rounded-2xl border border-gold/20 bg-gold/5 p-8 hover:border-gold/40 transition-colors">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="text-[10px] bg-gold/20 text-gold">{events[0].category}</Badge>
                    <span className="text-xs font-medium text-gold">Featured Event</span>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-3">{events[0].title}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl">{events[0].description}</p>
                  <div className="flex flex-wrap items-center gap-6 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 text-gold" />
                      <span>{events[0].date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-gold" />
                      <span>{events[0].location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4 text-gold" />
                      <span>{events[0].attendees} attendees</span>
                    </div>
                  </div>
                  <Button className="bg-gold text-black hover:bg-gold/90 gap-2">
                    Visit Event Website <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </Link>
            </FadeIn>
          )}

          {/* Other events grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.slice(1).map((event, i) => (
              <FadeIn key={event.title} delay={0.1 * i}>
                {event.url ? (
                  <Link href={event.url} className="block group flex flex-col rounded-xl border border-border/30 bg-secondary/10 p-6 hover:border-border hover:shadow-lg hover:shadow-gold/5 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={`text-[10px] ${categoryColors[event.category] || ''}`}>{event.category}</Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" /> {event.attendees}
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-foreground group-hover:text-gold transition-colors mb-2">{event.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{event.description}</p>
                    <div className="mt-4 space-y-2 pt-4 border-t border-border/20">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 shrink-0" /> {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0" /> {event.location}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-4 border-border/50 hover:border-gold/30 hover:text-gold gap-1.5 text-xs">
                      Visit Website <ExternalLink className="h-3 w-3" />
                    </Button>
                  </Link>
                ) : (
                  <div className="group flex flex-col rounded-xl border border-border/30 bg-secondary/10 p-6 hover:border-border hover:shadow-lg hover:shadow-gold/5 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={`text-[10px] ${categoryColors[event.category] || ''}`}>{event.category}</Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" /> {event.attendees}
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-foreground group-hover:text-gold transition-colors mb-2">{event.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{event.description}</p>
                    <div className="mt-4 space-y-2 pt-4 border-t border-border/20">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 shrink-0" /> {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0" /> {event.location}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-4 border-border/50 hover:border-gold/30 hover:text-gold gap-1.5 text-xs">
                      Register <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </FadeIn>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" className="border-border hover:border-gold/30 hover:text-gold">
              View Full Calendar
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
