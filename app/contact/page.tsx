'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FadeIn } from '@/components/shared/motion';
import { MapPin, Mail, Phone, Send, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [contactInfo, setContactInfo] = useState({ phone: '+2332433352901', contactEmail: 'info@goldcoastminingreview.com', salesEmail: 'sales@goldcoastminingreview.com', officeAddress: '', officeAddress2: '', gpsAddress: '', mapAddress: '' });
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  useEffect(() => {
    fetch('/api/settings?key=general')
      .then((r) => r.json())
      .then((json) => { if (json?.data) setContactInfo((prev) => ({ ...prev, ...json.data })); })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to send message');
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const infoItems = [
    { 
      icon: MapPin, 
      label: 'Office', 
      value: contactInfo.mapAddress || contactInfo.officeAddress || 'Contact us for office locations' 
    },
    { icon: Mail, label: 'Email', value: contactInfo.contactEmail },
    { icon: Phone, label: 'Phone', value: contactInfo.phone },
    { icon: Mail, label: 'Sales', value: contactInfo.salesEmail },
  ];

  return (
    <div className="min-h-screen">
      <section className="border-b border-border/30 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <FadeIn>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">Get In Touch</span>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Contact Us</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              Editorial tips, advertising enquiries, press releases, or general questions — we&apos;re here.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-5">
            <FadeIn className="lg:col-span-3">
              <div className="rounded-2xl border border-border/30 bg-secondary/10 p-8">
                <div className="flex items-center gap-2 mb-6">
                  <MessageSquare className="h-5 w-5 text-gold" />
                  <h2 className="text-lg font-bold text-foreground">Send a Message</h2>
                </div>

                {submitted ? (
                  <div className="rounded-xl border border-gold/20 bg-gold/5 p-8 text-center">
                    <Send className="mx-auto h-8 w-8 text-gold mb-3" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Message Sent</h3>
                    <p className="text-sm text-muted-foreground">Thank you for reaching out. We&apos;ll be in touch within 2 business days.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {error && <div className="text-sm text-red-400 bg-red-500/10 p-3 rounded">{error}</div>}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                    </div>
                    <Button type="submit" className="gold-gradient text-black font-semibold" disabled={submitting}>
                      {submitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                )}
              </div>
            </FadeIn>

            <FadeIn delay={0.15} className="lg:col-span-2">
              <div className="space-y-6">
                {infoItems.map((item) => (
                  <div key={item.label} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                      <item.icon className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{item.label}</div>
                      <div className="mt-1 text-sm text-foreground whitespace-pre-line">
                        {item.label === 'Email' || item.label === 'Sales' ? (
                          <a href={`mailto:${item.value}`} className="hover:text-gold transition-colors">{item.value}</a>
                        ) : item.label === 'Phone' ? (
                          <a href={`tel:${item.value.replace(/\s/g, '')}`} className="hover:text-gold transition-colors">{item.value}</a>
                        ) : item.value}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="rounded-2xl overflow-hidden border border-border/30 bg-secondary/10">
                  <div className="p-4">
                    <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Location (Airport City)</div>
                  </div>
                  <iframe
                    title="Airport City Location"
                    src="https://www.google.com/maps?q=2+Libration+Road+Airport+City+Ghana&output=embed"
                    className="w-full h-56"
                    loading="lazy"
                  />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
