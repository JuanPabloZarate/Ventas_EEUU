import type { Metadata, Viewport } from 'next';
import './globals.css';

// Viewport configuration for responsive devices & mobile safe-area insets
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0B192C' },
    { media: '(prefers-color-scheme: dark)', color: '#0B192C' },
  ],
};

// Application Metadata
export const metadata: Metadata = {
  title: 'Compras EEUU | Courier & Compras en Estados Unidos a Bolivia',
  description:
    'Compras exclusivas en tiendas físicas y online de Estados Unidos (Apple, Sephora, Nike, B&H) con entrega directa en Bolivia antes de Navidad. Casillero postal y Compra Asistida con Compras EEUU.',
  keywords: [
    'Compras EEUU',
    'Compras Estados Unidos',
    'Compras EEUU Bolivia',
    'Black Friday Bolivia',
    'Courier USA Bolivia',
    'Casillero New York',
    'Compra Asistida USA',
    'Envios USA Bolivia',
    'Apple Black Friday Bolivia',
  ],
  authors: [{ name: 'Compras EEUU' }],
  metadataBase: new URL('https://ny2bolivia-web.vercel.app'),
  openGraph: {
    title: 'Compras EEUU | Compras en Estados Unidos a Bolivia',
    description:
      'Ofertas en tiendas de Nueva York y EE.UU. con entrega directa en Bolivia antes de Navidad.',
    type: 'website',
    locale: 'es_BO',
    siteName: 'Compras EEUU',
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
