'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star, Zap } from 'lucide-react';

interface PricingPackage {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
  cta: string;
}

export default function PricingPackages() {
  const packages: PricingPackage[] = [
    {
      name: 'Starter',
      price: '$500',
      period: '/month',
      description: 'Perfect for small businesses looking to get started',
      features: [
        '1 Sidebar Ad per month',
        'Logo in Partners Section',
        'Monthly Newsletter Mention',
        'Basic Analytics',
        'Email Support',
      ],
      icon: <Zap className="h-6 w-6" />,
      cta: 'Get Started',
    },
    {
      name: 'Professional',
      price: '$1,500',
      period: '/month',
      description: 'Ideal for growing mining companies',
      features: [
        '2 Sidebar Ads per month',
        '1 Hero Banner per quarter',
        'Featured Company Profile',
        'Social Media Promotion',
        'Advanced Analytics',
        'Priority Support',
        'Blog Post Opportunity',
      ],
      icon: <Star className="h-6 w-6" />,
      popular: true,
      cta: 'Most Popular',
    },
    {
      name: 'Enterprise',
      price: '$5,000',
      period: '/month',
      description: 'Maximum visibility for established brands',
      features: [
        'Unlimited Ad Placements',
        'Premium Hero Banner',
        'Exclusive Interviews',
        'Video Ad Production',
        'Custom Campaign Strategy',
        'Dedicated Account Manager',
        'Event Sponsorship',
        'White-label Reports',
      ],
      icon: <Crown className="h-6 w-6" />,
      cta: 'Contact Sales',
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-gold text-black font-semibold">
            Advertising Packages
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your <span className="gold-gradient-text">Advertising Plan</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Flexible packages designed to meet your marketing goals and budget.
            All packages include comprehensive analytics and dedicated support.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl border p-8 backdrop-blur-sm ${
                pkg.popular
                  ? 'border-gold bg-gradient-to-br from-gold/10 via-gold/5 to-gold/10'
                  : 'border-border bg-card'
              } hover:border-gold/60 transition-all duration-300 group`}
            >
              {pkg.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-black font-semibold">
                  Most Popular
                </Badge>
              )}

              {/* Header */}
              <div className="text-center mb-8">
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 ${
                    pkg.popular ? 'bg-gold text-black' : 'bg-gold/20 text-gold'
                  }`}
                >
                  {pkg.icon}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{pkg.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-foreground">{pkg.price}</span>
                  <span className="text-muted-foreground">{pkg.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{pkg.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                className={`w-full ${
                  pkg.popular
                    ? 'gold-gradient text-black font-semibold hover:opacity-90 transition-opacity'
                    : 'border border-gold text-gold font-semibold hover:bg-gold/10 transition-colors'
                }`}
                size="lg"
              >
                {pkg.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="glass rounded-2xl p-8 md:p-12">
            <h3 className="text-xl font-bold mb-4">Need a Custom Solution?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We offer customized advertising packages tailored to your specific needs.
              Contact our team to discuss exclusive opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                className="border-gold text-gold font-semibold hover:bg-gold/10 transition-colors"
              >
                Contact Sales Team
              </Button>
              <Button className="gold-gradient text-black font-semibold hover:opacity-90 transition-opacity">
                Download Media Kit
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
