'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PDFFlip from '@/components/magazine/pdf-flip';
import { BookOpen, Calendar, Download, Eye } from 'lucide-react';

interface Magazine {
  id: string;
  title: string;
  issue: string;
  date: string;
  coverImage: string;
  pdfUrl: string;
  description: string;
  featured?: boolean;
  categories: string[];
}

function mapMagazine(m: Record<string, unknown>): Magazine {
  return {
    id: m.id as string,
    title: m.title as string,
    issue: m.issue as string,
    date: m.date as string,
    coverImage: (m.cover_image as string) || '/news/Quarterly Magazines.webp',
    pdfUrl: (m.pdf_url as string) || '',
    description: (m.description as string) || '',
    featured: m.featured as boolean,
    categories: (m.categories as string[]) || [],
  };
}

export default function MagazineShowcase() {
  const [selectedMagazine, setSelectedMagazine] = useState<Magazine | null>(null);
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch('/api/magazines')
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        setMagazines(Array.isArray(json?.data) ? json.data.map(mapMagazine) : []);
      })
      .catch(() => setMagazines([]))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const featured = magazines.filter((m) => m.featured);
  const rest = magazines.filter((m) => !m.featured);

  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 text-center text-muted-foreground">Loading magazines...</div>
      </section>
    );
  }

  if (magazines.length === 0) {
    return (
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            <span className="gold-gradient-text">Latest</span> Magazine
          </h2>
          <p className="text-muted-foreground">No magazine issues published yet. Check back soon.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      {selectedMagazine && selectedMagazine.pdfUrl && (
        <PDFFlip
          url={selectedMagazine.pdfUrl}
          title={selectedMagazine.title}
          onClose={() => setSelectedMagazine(null)}
        />
      )}

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                <span className="gold-gradient-text">Latest</span> Magazine
              </h2>
              <p className="text-muted-foreground">Read our premium mining industry publications</p>
            </div>
            <Link href="/magazines">
              <Button variant="outline" className="border-gold text-gold hover:bg-gold/10 hidden md:flex">
                View All Issues
              </Button>
            </Link>
          </div>

          {featured.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
              {featured.slice(0, 1).map((magazine) => (
                <div key={magazine.id} className="glass rounded-2xl p-6 md:p-8 grid md:grid-cols-2 gap-8 items-center">
                  <div className="relative">
                    <img
                      src={magazine.coverImage}
                      alt={magazine.title}
                      loading="lazy"
                      className="w-full h-auto rounded-xl shadow-2xl hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-gold text-black font-semibold">Featured Issue</Badge>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-sm text-gold font-medium">
                      <Calendar className="h-4 w-4" />
                      {magazine.date}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">{magazine.title}</h3>
                    <p className="text-lg text-muted-foreground mb-4">{magazine.issue}</p>
                    <p className="text-muted-foreground mb-6">{magazine.description}</p>
                    {magazine.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {magazine.categories.map((category) => (
                          <Badge key={category} variant="outline" className="border-gold/30 text-gold">{category}</Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-3">
                      {magazine.pdfUrl && (
                        <>
                          <Button
                            className="gold-gradient text-black font-semibold hover:opacity-90 transition-opacity"
                            onClick={() => setSelectedMagazine(magazine)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Read Online
                          </Button>
                          <Button
                            variant="outline"
                            className="border-gold text-gold hover:bg-gold/10"
                            onClick={() => window.open(magazine.pdfUrl, '_blank')}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {rest.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {rest.map((magazine, index) => (
                <motion.div
                  key={magazine.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="glass rounded-xl overflow-hidden hover:border-gold/60 transition-all duration-300 cursor-pointer">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={magazine.coverImage}
                        alt={magazine.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {magazine.pdfUrl && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <Button
                            size="sm"
                            className="w-full gold-gradient text-black font-semibold"
                            onClick={() => setSelectedMagazine(magazine)}
                          >
                            <BookOpen className="mr-2 h-3 w-3" />
                            Read
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-gold font-medium mb-2">{magazine.date}</div>
                      <h4 className="font-semibold text-foreground mb-1 line-clamp-1">{magazine.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{magazine.issue}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-6 text-center md:hidden">
            <Link href="/magazines">
              <Button variant="outline" className="border-gold text-gold hover:bg-gold/10 w-full">
                View All Issues
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
