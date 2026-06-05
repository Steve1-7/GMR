'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

const footerSections = [
  {
    title: 'Platform',
    links: [
      { label: 'News', href: '/news' },
      { label: 'Projects', href: '/projects' },
      { label: 'Markets', href: '/markets' },
      { label: 'Companies', href: '/companies' },
      { label: 'Intelligence', href: '/intelligence' },
    ],
  },
  {
    title: 'Media',
    links: [
      { label: 'Podcasts', href: '/podcasts' },
      { label: 'Reports', href: '/reports' },
      { label: 'Events', href: '/events' },
      { label: 'Technology', href: '/technology' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Advertise', href: '/advertise' },
      { label: 'Contact', href: '/contact' },
      { label: 'Jobs', href: '/jobs' },
      { label: 'Subscribe', href: '/subscribe' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4 py-16">
        {/* Brand section */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-4">
            <Image
              src="/gold.webp"
              alt="Gold-Coast Mining Review"
              width={612}
              height={108}
              className="h-20 md:h-24 w-auto"
            />
            <div className="hidden md:flex flex-col">
              <span className="text-xl font-bold gold-gradient-text">Gold-Coast Mining Review</span>
            </div>
          </Link>
          <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">
            Africa&apos;s leading mining intelligence and media platform.
            Delivering news, data, and insights to mining investors and industry leaders.
          </p>
          <div className="mt-6 space-y-2">
            <a href="tel:+27717856901" className="block text-sm text-muted-foreground hover:text-gold transition-colors">
              +27 71 785 6901
            </a>
            <a href="mailto:info@goldcoastminingreview.com" className="block text-sm text-muted-foreground hover:text-gold transition-colors">
              info@goldcoastminingreview.com
            </a>
            <a href="mailto:sales@goldcoastminingreview.com" className="block text-sm text-muted-foreground hover:text-gold transition-colors">
              sales@goldcoastminingreview.com
            </a>
            <a href="mailto:editorial@goldcoastminingreview.com" className="block text-sm text-muted-foreground hover:text-gold transition-colors">
              editorial@goldcoastminingreview.com
            </a>
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-semibold text-foreground">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-12" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 Gold-Coast Mining Review. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <span className="text-xs text-muted-foreground">
              Mining News. Data. Intelligence.
            </span>
            <span className="text-xs text-gold/50">
              Done / Powered by Steve @ Eva-Tech-Studio
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
