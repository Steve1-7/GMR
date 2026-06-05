'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PDFViewer from '@/components/magazine/pdf-viewer';
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

interface MagazineShowcaseProps {
  magazines: Magazine[];
  title?: string;
  showViewAll?: boolean;
}

export default function MagazineShowcase({
  magazines,
  title = 'Latest Publications',
  showViewAll = true,
}: MagazineShowcaseProps) {
  const [selectedMagazine, setSelectedMagazine] = useState<Magazine | null>(null);

  return (
    <>
      {selectedMagazine && (
        <PDFViewer
          url={selectedMagazine.pdfUrl}
          title={selectedMagazine.title}
          onClose={() => setSelectedMagazine(null)}
        />
      )}

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {title}
              </h2>
              <p className="text-muted-foreground">
                Explore our latest mining industry publications
              </p>
            </div>
            {showViewAll && (
              <Button variant="outline" className="border-gold text-gold hover:bg-gold/10">
                View All Issues
              </Button>
            )}
          </div>

          {/* Featured Magazine */}
          {magazines.filter((m) => m.featured).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              {magazines
                .filter((m) => m.featured)
                .slice(0, 1)
                .map((magazine) => (
                  <div
                    key={magazine.id}
                    className="glass rounded-2xl p-6 md:p-8 grid md:grid-cols-2 gap-8 items-center"
                  >
                    <div className="relative">
                      <img
                        src={magazine.coverImage}
                        alt={magazine.title}
                        className="w-full h-auto rounded-xl shadow-2xl hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-4 left-4 bg-gold text-black font-semibold">
                        Featured Issue
                      </Badge>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3 text-sm text-gold font-medium">
                        <Calendar className="h-4 w-4" />
                        {magazine.date}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-2">{magazine.title}</h3>
                      <p className="text-lg text-muted-foreground mb-4">{magazine.issue}</p>
                      <p className="text-muted-foreground mb-6">{magazine.description}</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {magazine.categories.map((category) => (
                          <Badge key={category} variant="outline" className="border-gold/30 text-gold">
                            {category}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-3">
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
                      </div>
                    </div>
                  </div>
                ))}
            </motion.div>
          )}

          {/* Magazine Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {magazines.map((magazine, index) => (
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
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-gold font-medium mb-2">{magazine.date}</div>
                    <h4 className="font-semibold text-foreground mb-1 line-clamp-1">
                      {magazine.title}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {magazine.issue}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
