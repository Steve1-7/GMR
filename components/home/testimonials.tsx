'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  title: string;
  company: string;
  quote: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        setTestimonials(Array.isArray(json?.data) ? json.data : []);
      })
      .catch(() => setTestimonials([]))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  if (loading) return null;
  if (testimonials.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            What Our <span className="gold-gradient-text">Partners</span> Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from industry leaders who have partnered with Gold-Coast Mining Review
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-xl p-6 border border-border/50 hover:border-gold/30 transition-all duration-300"
            >
              <Quote className="h-8 w-8 text-gold/30 mb-4" />
              <p className="text-muted-foreground mb-6 leading-relaxed">{testimonial.quote}</p>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <div>
                <div className="font-semibold text-foreground">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.title}{testimonial.company ? `, ${testimonial.company}` : ''}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
