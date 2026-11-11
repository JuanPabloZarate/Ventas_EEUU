import React from 'react';
import type { Metadata } from 'next';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { TopDealsShowcase } from '@/components/landing/TopDealsShowcase';
import { ModalitySelector } from '@/components/landing/ModalitySelector';
import { FAQSection } from '@/components/landing/FAQSection';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Compras EEUU | Grandes Ofertas Black Friday y Envíos a Bolivia',
  description:
    'Ofertas oficiales en Apple, Nike, Sephora, Coach y Best Buy Estados Unidos con entrega directa en Bolivia.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface antialiased">
      {/* 1. Barra de aviso superior sobria */}
      <AnnouncementBar deliveryDate="4 de Diciembre" ctaHref="/registro" />

      {/* 2. Header minimalista */}
      <Navbar whatsappNumber="59177012345" />

      {/* Contenido Principal */}
      <main className="flex-1">
        {/* 3. Hero simple y directo */}
        <HeroSection ctaHref="/registro" />

        {/* 4. Grandes Ofertas Estrella (Inmediatamente después del Hero) */}
        <TopDealsShowcase />

        {/* 5. Dos Modalidades Claras: Online vs Tienda Física */}
        <ModalitySelector
          defaultValue="assisted"
          whatsappPhone="59177012345"
          showComparisonDetails={false}
        />

        {/* 6. Preguntas Frecuentes esenciales */}
        <FAQSection whatsappNumber="59177012345" />
      </main>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}
