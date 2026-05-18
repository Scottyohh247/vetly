import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from '@/components/providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vetly - Know What You\'re Buying Before You Hand Over Cash',
  description: 'AI-powered MOT analysis for used vehicle buyers. Understand MOT history and make confident purchasing decisions.',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://vetly.app',
    siteName: 'Vetly',
    title: 'Vetly - Know What You\'re Buying',
    description: 'AI-powered MOT analysis for used vehicle buyers',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
