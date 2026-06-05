'use client';

import HeroBannerAd from '@/components/advertising/hero-banner-ad';
import SidebarAd from '@/components/advertising/sidebar-ad';
import SponsoredCompany from '@/components/advertising/sponsored-company';
import RotatingBanner from '@/components/advertising/rotating-banner';
import FullWidthAd from '@/components/advertising/full-width-ad';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Megaphone } from 'lucide-react';

export default function AdvertisingShowcase() {
  const [rotatingAds, setRotatingAds] = useState<any[]>([]);
  const [sidebarAds, setSidebarAds] = useState<any[]>([]);
  const [featuredAd, setFeaturedAd] = useState<any | null>(null);
  const [sponsoredCompanies, setSponsoredCompanies] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      fetch('/api/ads'),
      fetch('/api/companies?featured=true'),
    ])
      .then(async ([adsRes, companiesRes]) => {
        const adsJson = await adsRes.json();
        const companiesJson = await companiesRes.json();
        if (!mounted) return;

        const ads = Array.isArray(adsJson?.data) ? adsJson.data : [];
        const mapped = ads.map((a: any) => ({
          id: a.id,
          title: a.title || a.company_name,
          description: a.description || a.company_name,
          company: a.company_name,
          href: a.link_url || a.url || '/advertise',
          imageUrl: a.image_url || a.image,
        }));

        setRotatingAds(mapped.filter((a: any) => a.imageUrl));
        setSidebarAds(ads.filter((a: any) => a.type === 'sidebar'));
        setFeaturedAd(ads.find((a: any) => a.type === 'featured') || ads[0] || null);
        setSponsoredCompanies(Array.isArray(companiesJson?.data) ? companiesJson.data.slice(0, 8) : []);
      })
      .catch(() => {
        if (mounted) {
          setRotatingAds([]);
          setSidebarAds([]);
          setFeaturedAd(null);
          setSponsoredCompanies([]);
        }
      });

    return () => { mounted = false; };
  }, []);

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gold-gradient-text">Featured Partners</span> & Advertisers
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Connect with leading mining companies, service providers, and investment opportunities
            across the African mining sector.
          </p>
          <Link href="/advertise">
            <Button className="gold-gradient text-black font-semibold hover:opacity-90 transition-opacity">
              <Megaphone className="mr-2 h-4 w-4" />
              Advertise With Us
            </Button>
          </Link>
        </motion.div>

        <div className="mb-8">
          <HeroBannerAd
            title="Reach Thousands of Mining Industry Leaders"
            description="Partner with Gold-Coast Mining Review to showcase your brand to a targeted audience of mining executives, investors, and decision-makers across Africa and beyond."
            ctaText="Get Started"
            href="/advertise"
            isPremium={true}
          />
        </div>

        {featuredAd ? (
          <div className="mb-8">
            <FullWidthAd
              title={featuredAd.title}
              description={featuredAd.description || featuredAd.company_name}
              ctaText="Learn More"
              href={featuredAd.link_url || featuredAd.url || '/advertise'}
              backgroundImage={featuredAd.image_url || featuredAd.image || '/gold.webp'}
              sponsorLogo={featuredAd.company_logo || '/gold.webp'}
            />
          </div>
        ) : (
          <div className="mb-8">
            <FullWidthAd
              title="Advertise Here"
              description="Premium full-width corporate banner placement. Contact our sales team to feature your brand."
              ctaText="Advertise With Us"
              href="/advertise"
              backgroundImage="/gold.webp"
              sponsorLogo="/gold.webp"
            />
          </div>
        )}

        <div className="mb-8">
          {rotatingAds.length > 0 ? (
            <RotatingBanner ads={rotatingAds} autoPlay interval={5000} />
          ) : (
            <div className="glass rounded-xl p-8 text-center text-muted-foreground">
              No rotating advertisements configured. <Link href="/advertise" className="text-gold hover:underline">Advertise here</Link>
            </div>
          )}
        </div>

        {sponsoredCompanies.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="text-gold">Featured</span> Mining Companies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sponsoredCompanies.map((company, index) => (
                <motion.div
                  key={company.id || company.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <SponsoredCompany {...company} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sidebarAds.length > 0 ? (
            sidebarAds.slice(0, 3).map((ad) => (
              <SidebarAd
                key={ad.id}
                title={ad.title}
                description={ad.description || ''}
                company={ad.company_name}
                href={ad.link_url || ad.url || '/advertise'}
                isPremium={ad.type === 'featured'}
              />
            ))
          ) : (
            [1, 2, 3].map((i) => (
              <SidebarAd
                key={i}
                title="Advertise Here"
                description="Premium sidebar placement available for mining industry advertisers."
                company="Gold-Coast Mining Review"
                href="/advertise"
                isPremium={false}
              />
            ))
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="glass rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl font-bold mb-4">Ready to Grow Your Business?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join successful mining companies advertising with Gold-Coast Mining Review.
              Let us help you reach your target audience.
            </p>
            <Link href="/advertise">
              <Button size="lg" className="gold-gradient text-black font-semibold hover:opacity-90 transition-opacity">
                View Advertising Packages
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
