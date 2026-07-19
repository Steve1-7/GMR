"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, ChevronDown, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'News', href: '/news' },
  { label: 'Magazines', href: '/magazines' },
  { label: 'Advertising', href: '/advertise' },
  { label: 'Mining Companies', href: '/companies' },
  { label: 'Events', href: '/events' },
  { label: 'Contact', href: '/contact' },
];

// will be fetched from the server

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [topBarAds, setTopBarAds] = useState<any[]>([]);
  const { theme, setTheme } = useTheme();
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    let mounted = true;
    fetch('/api/ads')
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        setTopBarAds((json?.data && Array.isArray(json.data)) ? json.data : []);
      })
      .catch(() => {
        // ignore; keep header usable without ads
      });
    return () => { mounted = false };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        {/* Top bar */}
        <div className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-3 sm:px-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden sm:inline">Africa&apos;s Mining Intelligence Platform</span>
              <span className="inline sm:hidden">GCMR</span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline">{today}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 sm:gap-4">
              {/* Top Bar Advertisements */}
              <div className="flex items-center gap-1 sm:gap-2 sm:gap-3">
                {topBarAds.slice(0, 1).map((ad) => (
                  <Link
                    key={ad.title}
                    href={ad.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={ad.image}
                      alt={ad.title}
                      className="h-5 sm:h-6 sm:h-7 w-auto object-contain"
                    />
                  </Link>
                ))}
              </div>
              <Link href="/subscribe" className="hover:text-gold transition-colors text-gold font-medium text-xs">Subscribe</Link>
              <Link href="/advertise" className="hover:text-foreground transition-colors font-semibold text-xs hidden sm:inline">Advertise</Link>
              <Link href="/contact" className="hover:text-foreground transition-colors text-xs hidden sm:inline">Contact</Link>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="border-b border-border bg-background/90 backdrop-blur-xl">
          <div className="mx-auto flex h-14 sm:h-16 md:h-20 max-w-7xl items-center justify-between px-3 sm:px-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <Image
                src="/gold.webp"
                alt="Gold-Coast Mining Review"
                width={560}
                height={96}
                priority
                className="h-14 sm:h-16 md:h-20 md:h-24 w-auto"
              />
              <div className="hidden md:flex flex-col">
                <span className="text-xl font-bold gold-gradient-text">Gold-Coast Mining Review</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav role="navigation" aria-label="Primary" className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative px-3 py-2 text-sm font-medium text-muted-foreground hover:text-gold transition-all"
                >
                  <span className="relative z-10">{item.label}</span>
                  <span className="absolute left-2 right-2 bottom-1 h-0.5 w-0 bg-gold transition-all group-hover:w-auto group-hover:right-0" />
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-expanded={searchOpen}
                aria-controls="site-search"
                aria-label="Toggle site search"
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hidden sm:flex"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                aria-label="Toggle theme"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 lg:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                aria-label="Toggle navigation menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Search overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              id="site-search"
              className="border-b border-border bg-background/95 backdrop-blur-xl"
            >
              <div className="mx-auto max-w-3xl px-4 py-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Ask Gold-Coast Mining Review... e.g. 'Show lithium projects in Ghana'"
                    className="w-full rounded-xl border border-border bg-secondary/50 py-4 pl-12 pr-4 text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                    autoFocus
                    aria-label="Search site"
                  />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Search across articles, projects, companies, and commodities
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b border-border bg-background lg:hidden"
            >
              <nav className="mx-auto max-w-7xl px-4 py-4">
                {navItems.map((item) =>
                  (item as any).children ? (
                    <div key={item.label}>
                      <span className="block px-3 py-2 text-sm font-medium text-muted-foreground">
                        {item.label}
                      </span>
                      {(item as any).children.map((child: any) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-6 py-2 text-sm text-muted-foreground hover:text-foreground"
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                )}
                <div className="mt-4 pt-4 border-t border-border">
                  <Link href="/subscribe" className="block px-3 py-2 text-sm font-semibold text-gold">
                    Subscribe
                  </Link>
                  <Link href="/advertise" className="block px-3 py-2 text-sm font-semibold text-gold">
                    Advertise With Us
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
