'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FadeIn } from '@/components/shared/motion';
import { Play, Clock, Headphones, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VideoPodcasts() {
  const [videos, setVideos] = useState<any[]>([]);
  const [podcasts, setPodcasts] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetch('/api/videos?podcasts=false'),
      fetch('/api/podcasts'),
    ])
      .then(async ([videosRes, podcastsRes]) => {
        const videosJson = await videosRes.json();
        const podcastsJson = await podcastsRes.json();
        if (!mounted) return;
        setVideos(Array.isArray(videosJson?.data) ? videosJson.data.slice(0, 3) : []);
        setPodcasts(Array.isArray(podcastsJson?.data) ? podcastsJson.data.slice(0, 3) : []);
      })
      .catch(() => {
        if (mounted) {
          setVideos([]);
          setPodcasts([]);
        }
      });
    return () => { mounted = false; };
  }, []);

  if (videos.length === 0 && podcasts.length === 0) return null;

  return (
    <section className="py-20 border-t border-border/30">
      <div className="mx-auto max-w-7xl px-4">
        <FadeIn>
          <div className="mb-12 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">Media</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Video & Podcasts</h2>
          </div>
        </FadeIn>

        <div className="grid gap-8 lg:grid-cols-2">
          {videos.length > 0 && (
            <div>
              <FadeIn>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Play className="h-5 w-5 text-gold" />
                    Featured Videos
                  </h3>
                  <Link href="/podcasts" className="text-xs font-medium text-gold hover:text-gold-bright transition-colors">View all</Link>
                </div>
              </FadeIn>
              <div className="grid gap-4">
                {videos.map((video, i) => (
                  <FadeIn key={video.id} delay={0.1 + i * 0.05}>
                    <Link href={video.video_url || '/podcasts'} className="group block">
                      <div className="flex gap-4 rounded-xl border border-border/30 p-3 transition-colors hover:border-border hover:bg-secondary/30">
                        <div className="relative h-28 w-44 shrink-0 overflow-hidden rounded-lg">
                          <img
                            src={video.thumbnail_url || video.featured_image || '/news/Latest News.jpeg'}
                            alt={video.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/90 text-black">
                              <Play className="h-4 w-4 ml-0.5" />
                            </div>
                          </div>
                          {video.duration && (
                            <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white">{video.duration}</span>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col justify-between py-1">
                          <div>
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{video.category || 'Video'}</span>
                            <h4 className="mt-1 text-sm font-semibold leading-snug text-foreground group-hover:text-gold transition-colors line-clamp-2">{video.title}</h4>
                            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{video.description}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            </div>
          )}

          {podcasts.length > 0 && (
            <div>
              <FadeIn>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Headphones className="h-5 w-5 text-gold" />
                    Latest Podcasts
                  </h3>
                  <Link href="/podcasts" className="text-xs font-medium text-gold hover:text-gold-bright transition-colors">View all</Link>
                </div>
              </FadeIn>
              <div className="grid gap-4">
                {podcasts.map((podcast, i) => (
                  <FadeIn key={podcast.id} delay={0.1 + i * 0.05}>
                    <Link href={podcast.audio_url || '/podcasts'} className="group block">
                      <div className="flex items-center gap-4 rounded-xl border border-border/30 p-4 transition-colors hover:border-border hover:bg-secondary/30">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold/10">
                          <Mic className="h-6 w-6 text-gold" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {podcast.episode_number && (
                              <span className="text-[10px] font-semibold text-gold">Episode {podcast.episode_number}</span>
                            )}
                            {podcast.duration && (
                              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <Clock className="h-2.5 w-2.5" />
                                {podcast.duration}
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-semibold text-foreground group-hover:text-gold transition-colors truncate">{podcast.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{podcast.description}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8">
                          <Play className="h-4 w-4 text-foreground" />
                        </Button>
                      </div>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
