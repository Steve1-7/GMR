"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Maximize2, Download } from 'lucide-react';

interface FlipbookProps {
  pages: string[];
  title: string;
  onClose?: () => void;
}

export default function FlipbookViewer({ pages, title, onClose }: FlipbookProps) {
  const [page, setPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const prev = () => setPage((p) => Math.max(0, p - 1));
  const next = () => setPage((p) => Math.min(pages.length - 1, p + 1));

  return (
    <div className={`relative w-full h-full bg-background ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="absolute top-0 left-0 right-0 z-10 glass-strong border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}><ChevronLeft className="h-4 w-4" /></Button>
            )}
            <h3 className="font-semibold text-foreground truncate max-w-md">{title} — Page {page + 1} / {pages.length}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsFullscreen((s) => !s)}>
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => { const a = document.createElement('a'); a.href = pages[page]; a.download = `${title}-page-${page+1}.jpg`; document.body.appendChild(a); a.click(); document.body.removeChild(a); }}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-14 h-full flex items-center justify-center">
        <div className="relative w-full max-w-4xl px-4">
          <div className="relative perspective-1000">
            <motion.div
              key={page}
              initial={{ rotateY: -25, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 25, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full bg-black rounded-md overflow-hidden shadow-2xl"
            >
              <img src={pages[page]} alt={`${title} page ${page + 1}`} className="w-full h-[70vh] object-contain bg-black" />
            </motion.div>

            <div className="absolute inset-y-0 left-0 flex items-center">
              <Button variant="ghost" size="icon" onClick={prev} disabled={page === 0} className="mx-2 bg-background/60">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button variant="ghost" size="icon" onClick={next} disabled={page === pages.length - 1} className="mx-2 bg-background/60">
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
