import HeroSection from '@/components/home/hero-section';
import NewsCarousel from '@/components/home/news-carousel';
import MagazineShowcase from '@/components/home/magazine-showcase';
import AdvertisingShowcase from '@/components/home/advertising-showcase';
import FeaturedStories from '@/components/home/featured-stories';
import MarketIntelligence from '@/components/home/market-intelligence';
import AfricaMiningMap from '@/components/home/africa-map';
import PremiumReports from '@/components/home/premium-reports';
import VideoPodcasts from '@/components/home/video-podcasts';
import Testimonials from '@/components/home/testimonials';
import NewsletterCTA from '@/components/home/newsletter-cta';

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className="section-divider" />
      <AdvertisingShowcase />
      <div className="section-divider" />
      <NewsCarousel />
      <div className="section-divider" />
      <MagazineShowcase />
      <div className="section-divider" />
      <FeaturedStories />
      <div className="section-divider" />
      <MarketIntelligence />
      <div className="section-divider" />
      <AfricaMiningMap />
      <div className="section-divider" />
      <PremiumReports />
      <div className="section-divider" />
      <VideoPodcasts />
      <div className="section-divider" />
      <Testimonials />
      <div className="section-divider" />
      <NewsletterCTA />
    </>
  );
}
