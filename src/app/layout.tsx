import type { Metadata, Viewport } from 'next';
import './globals.css';

// Viewport configuration for responsive devices & mobile safe-area insets
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover', // Enables env(safe-area-inset-*) on iOS Safari notched devices
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0B192C' },
    { media: '(prefers-color-scheme: dark)', color: '#0B192C' },
  ],
};

// Application Metadata
export const metadata: Metadata = {
  title: 'NY2Bolivia | Courier & Shopping Express New York - Bolivia',
  description:
    'Compras exclusivas de Black Friday en Manhattan (Apple, Sephora, Nike, B&H) con despacho directo a Bolivia antes de Navidad. Casillero NY y Compra Asistida.',
  keywords: [
    'Black Friday Bolivia',
    'Courier New York Bolivia',
    'Casillero New York',
    'Compra Asistida USA',
    'Envios New York Bolivia',
    'Apple Black Friday Bolivia',
    'JFK Bolivia Courier',
    'Andean Skyline Logistics',
  ],
  authors: [{ name: 'Andean Skyline Logistics / NY2Bolivia' }],
  metadataBase: new URL('https://ny2bolivia.com'),
  openGraph: {
    title: 'NY2Bolivia | Black Friday Manhattan a Bolivia',
    description:
      'Aprovecha hasta 70% OFF en New York. Te lo traemos a Bolivia antes de Navidad con vuelo directo JFK.',
    type: 'website',
    locale: 'es_BO',
    siteName: 'NY2Bolivia Courier',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="min-h-screen bg-surface font-sans text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed flex flex-col">
        {children}
      </body>
    </html>
  );
}
