import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { DataProvider } from '@/context/DataContext';
import AppShell from '@/components/layout/AppShell';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Lune Perfumes',
  description: 'Estoque & Vendas — Lune Perfumes',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" data-theme="light" className={`${inter.variable} h-full`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-sans antialiased" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
        <ThemeProvider>
          <ToastProvider>
            <DataProvider>
              <AppShell>{children}</AppShell>
            </DataProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
