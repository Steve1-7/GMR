'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Linkedin } from 'lucide-react';

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
            <a href="tel:+2332433352901" className="block text-sm text-muted-foreground hover:text-gold transition-colors">
              +2332433352901
            </a>
            <a href="mailto:info@goldcoastminingreview.com" className="block text-sm text-muted-foreground hover:text-gold transition-colors">
              info@goldcoastminingreview.com
            </a>
            <a href="https://www.linkedin.com/company/gold-coast-mining-review-ghana/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors">
              <Linkedin className="h-4 w-4" />
              LinkedIn
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
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 Gold-Coast Mining Review. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <span className="text-xs text-muted-foreground">
              Mining News. Data. Intelligence.
            </span>
            <a href="https://eva-tech-studio.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-gold/50 hover:text-gold transition-colors">
              <span>Powered by</span>
              <Image
                src="/home/logo5.svg"
                alt="Eva-Tech-Studio"
                width={100}
                height={20}
                className="h-5 w-auto"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
