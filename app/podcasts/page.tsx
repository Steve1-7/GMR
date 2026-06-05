'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/shared/motion';
import { Play, Clock, Mic, Headphones, Film } from 'lucide-react';

export default function PodcastsPage() {
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetch('/api/podcasts'),
      fetch('/api/videos?podcasts=false'),
    ])
      .then(async ([pRes, vRes]) => {
        const pJson = await pRes.json();
        const vJson = await vRes.json();
        if (!mounted) return;
        setPodcasts(Array.isArray(pJson?.data) ? pJson.data : []);
        setVideos(Array.isArray(vJson?.data) ? vJson.data : []);
      })
      .catch(() => {
        if (mounted) { setPodcasts([]); setVideos([]); }
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const featured = podcasts[0] || null;
  const featuredVideo = videos[0] || null;

  return (
    <div className="min-h-screen">
      <section className="border-b border-border/30 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <FadeIn>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">Media</span>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Podcasts & Video</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              In-depth conversations and documentaries from Africa&apos;s mining industry.
            </p>
          </FadeIn>
        </div>
      </section>

      {loading ? (
        <p className="text-center text-muted-foreground py-12">Loading media...</p>
      ) : (
        <>
          {(featured || featuredVideo) && (
            <section className="py-12 border-b border-border/30">
              <div className="mx-auto max-w-7xl px-4 grid gap-8 lg:grid-cols-2">
                {featured && (
                  <FadeIn>
                    <div className="glass rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Headphones className="h-5 w-5 text-gold" />
                        <span className="text-xs font-semibold uppercase text-gold">Featured Podcast</span>
                      </div>
                      {featured.episode_number && <Badge className="mb-2">Episode {featured.episode_number}</Badge>}
                      <h2 className="text-2xl font-bold mb-2">{featured.title}</h2>
                      <p className="text-muted-foreground mb-4">{featured.description}</p>
                      {featured.duration && <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{featured.duration}</span>}
                      {featured.audio_url && (
                        <Button className="mt-4 gold-gradient text-black" onClick={() => window.open(featured.audio_url, '_blank')}>
                          <Play className="mr-2 h-4 w-4" /> Listen Now
                        </Button>
                      )}
                    </div>
                  </FadeIn>
                )}
                {featuredVideo && (
                  <FadeIn delay={0.1}>
                    <div className="glass rounded-2xl overflow-hidden">
                      <div className="aspect-video relative">
                        <img src={featuredVideo.thumbnail_url || featuredVideo.featured_image || '/news/Latest News.jpeg'} alt={featuredVideo.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <Button className="gold-gradient text-black rounded-full h-14 w-14" onClick={() => window.open(featuredVideo.video_url, '_blank')}>
                            <Play className="h-6 w-6" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-2"><Film className="h-4 w-4 text-gold" /><span className="text-xs text-gold">Featured Video</span></div>
                        <h3 className="text-xl font-bold">{featuredVideo.title}</h3>
                        <p className="text-sm text-muted-foreground mt-2">{featuredVideo.description}</p>
                      </div>
                    </div>
                  </FadeIn>
                )}
              </div>
            </section>
          )}

          <section className="py-12">
            <div className="mx-auto max-w-7xl px-4">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Mic className="h-5 w-5 text-gold" /> All Episodes</h2>
              {podcasts.length === 0 ? (
                <p className="text-muted-foreground">No podcast episodes published yet.</p>
              ) : (
                <div className="grid gap-4">
                  {podcasts.map((ep, i) => (
                    <FadeIn key={ep.id} delay={0.05 * i}>
                      <div className="flex items-center gap-4 rounded-xl border border-border/30 p-4 hover:border-gold/30 transition-colors">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/10"><Mic className="h-5 w-5 text-gold" /></div>
                        <div className="flex-1 min-w-0">
                          {ep.episode_number && <span className="text-xs text-gold">Episode {ep.episode_number}</span>}
                          <h3 className="font-semibold truncate">{ep.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">{ep.description}</p>
                        </div>
                        {ep.duration && <span className="text-xs text-muted-foreground shrink-0">{ep.duration}</span>}
                        {ep.audio_url && (
                          <Button size="sm" variant="outline" onClick={() => window.open(ep.audio_url, '_blank')}><Play className="h-3 w-3" /></Button>
                        )}
                      </div>
                    </FadeIn>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
