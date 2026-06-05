'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Download, Share2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PDFViewerProps {
  url: string;
  title: string;
  onClose?: () => void;
}

export default function PDFViewer({ url, title, onClose }: PDFViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    if (zoom < 200) setZoom(zoom + 25);
  };

  const handleZoomOut = () => {
    if (zoom > 50) setZoom(zoom - 25);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      setShowShare(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-background ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
    >
      {/* Toolbar */}
      <div className="absolute top-0 left-0 right-0 z-10 glass-strong border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-gold/20"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
            <div className="hidden sm:block">
              <h3 className="font-semibold text-foreground truncate max-w-md">
                {title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom controls */}
            <div className="flex items-center gap-1 border-r border-border pr-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                className="hover:bg-gold/20"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-foreground w-12 text-center">
                {zoom}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                className="hover:bg-gold/20"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            {/* Action buttons */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="hover:bg-gold/20"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              className="hover:bg-gold/20"
              title="Download"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="hover:bg-gold/20"
              title="Share"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Share modal */}
      {showShare && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-20 bg-background/80 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setShowShare(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass rounded-xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">Share Magazine</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setShowShare(false);
                }}
              >
                Copy Link
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${title} on Gold-Coast Mining Review!`)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
                  setShowShare(false);
                }}
              >
                Share on Twitter
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
                  setShowShare(false);
                }}
              >
                Share on LinkedIn
              </Button>
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => setShowShare(false)}
            >
              Cancel
            </Button>
          </motion.div>
        </motion.div>
      )}

      {/* PDF Container */}
      <div className="pt-14 h-full">
        <div
          className="w-full h-full flex items-center justify-center overflow-auto"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
        >
          <iframe
            src={`${url}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-full border-0"
            title={title}
            style={{ minHeight: isFullscreen ? '100vh' : '800px' }}
          />
        </div>
      </div>
    </div>
  );
}
