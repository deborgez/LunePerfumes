import type { Metadata } from 'next';
import { Fraunces, Work_Sans } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  weight: ['500', '600'],
  style: ['normal', 'italic'],
});

const workSans = Work_Sans({
  variable: '--font-work-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Catálogo · Lune Perfumes',
  description: 'Fragrâncias inspiradas nas grandes casas de perfumaria — Lune Perfumes.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${fraunces.variable} ${workSans.variable}`}>{children}</body>
    </html>
  );
}
