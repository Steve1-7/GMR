import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Header from '@/components/shared/header';
import Footer from '@/components/shared/footer';
import PremiumMarquee from '@/components/shared/marquee';
import AIChatbot from '@/components/shared/ai-chatbot';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://goldcoastminingreview.com'),
  title: 'Gold-Coast Mining Review | Africa\'s Mining Intelligence Platform',
  description: 'Africa\'s leading mining intelligence and media platform. Mining News. Data. Intelligence.',
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    title: 'Gold-Coast Mining Review | Africa\'s Mining Intelligence Platform',
    description: 'Africa\'s leading mining intelligence and media platform.',
    type: 'website',
    siteName: 'Gold-Coast Mining Review',
    images: [{ url: '/logo.svg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gold-Coast Mining Review',
    description: 'Africa\'s Mining Intelligence Platform',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <a href="#content" className="sr-only focus:not-sr-only focus:!inline-block p-2 bg-gold text-black font-medium">
            Skip to content
          </a>
          {/* Organization JSON-LD for SEO */}
          <script
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: "Gold-Coast Mining Review",
                url: 'https://goldcoastminingreview.com',
                logo: 'https://goldcoastminingreview.com/gold.webp',
                contactPoint: [{
                  '@type': 'ContactPoint',
                  telephone: '+27 71 785 6901',
                  contactType: 'customer service',
                  areaServed: 'ZA',
                  availableLanguage: ['English']
                }],
              }),
            }}
          />
          <PremiumMarquee />
          <Header />
          <main id="content" className="min-h-screen">{children}</main>
          <Footer />
          <AIChatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}
