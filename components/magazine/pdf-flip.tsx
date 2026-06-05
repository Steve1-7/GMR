"use client";

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Download, Share2, Maximize2, X } from 'lucide-react';

interface PDFFlipProps {
  url: string;
  title: string;
  onClose?: () => void;
}

export default function PDFFlip({ url, title, onClose }: PDFFlipProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pdf, setPdf] = useState<any>(null);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadPdfLib() {
      if ((window as any).pdfjsLib) return (window as any).pdfjsLib;
      // Try multiple CDNs
      const urls = [
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js',
        'https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.min.js',
      ];
      for (const u of urls) {
        try {
          await new Promise<void>((res, rej) => {
            const s = document.createElement('script');
            s.src = u;
            s.onload = () => res();
            s.onerror = () => rej(new Error('failed'));
            document.head.appendChild(s);
          });
          if ((window as any).pdfjsLib) return (window as any).pdfjsLib;
        } catch (e) {
          // continue
        }
      }
      return null;
    }

    (async () => {
      try {
        const lib = await loadPdfLib();
        if (!lib) throw new Error('PDF.js failed to load');
        const pdfjs = lib as any;
        pdfjs.GlobalWorkerOptions.workerSrc = pdfjs.GlobalWorkerOptions.workerSrc || 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        const loadingTask = pdfjs.getDocument(url);
        const loaded = await loadingTask.promise;
        if (cancelled) return;
        setPdf(loaded);
        setNumPages(loaded.numPages || 0);
        setLoading(false);
      } catch (err) {
        console.error('PDF load error', err);
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [url]);

  useEffect(() => {
    if (!pdf) return;
    let cancelled = false;

    async function render() {
      try {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.6 });
        const canvas = canvasRef.current!;
        const context = canvas.getContext('2d')!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const renderContext = {
          canvasContext: context,
          viewport,
        };
        await page.render(renderContext).promise;
        if (cancelled) return;
      } catch (e) {
        console.error('render error', e);
      }
    }

    render();
    return () => { cancelled = true; };
  }, [pdf, pageNum]);

  const prev = () => setPageNum((p) => Math.max(1, p - 1));
  const next = () => setPageNum((p) => Math.min(numPages || p, p + 1));

  return (
    <div ref={containerRef} className={`relative w-full h-full bg-background ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="absolute top-0 left-0 right-0 z-10 glass-strong border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
            )}
            <h3 className="font-semibold text-foreground truncate max-w-md">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsFullscreen((s) => !s)}><Maximize2 className="h-4 w-4" /></Button>
            <a href={url} download className="inline-flex"><Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button></a>
            <Button variant="ghost" size="icon" onClick={() => { navigator.share?.({ title, url }).catch(()=>{}); }}><Share2 className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      <div className="pt-14 h-full flex items-center justify-center">
        <div className="relative w-full max-w-5xl px-4">
          {loading && (
            <div className="p-12 text-center text-muted-foreground">Loading magazine…</div>
          )}

          {!loading && !pdf && (
            <div className="p-12 text-center text-muted-foreground">Unable to load PDF. Opening fallback viewer.</div>
          )}

          {!loading && pdf && (
            <div className="relative">
              <canvas ref={canvasRef} className="mx-auto rounded-md shadow-2xl bg-black" />
              <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <Button variant="ghost" size="icon" onClick={prev} disabled={pageNum === 1}><ChevronLeft className="h-5 w-5" /></Button>
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Button variant="ghost" size="icon" onClick={next} disabled={pageNum === numPages}><ChevronRight className="h-5 w-5" /></Button>
              </div>
              <div className="mt-4 flex items-center justify-center gap-3 text-sm text-muted-foreground">
                <span>Page {pageNum} of {numPages}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
