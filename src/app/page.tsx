import React from 'react';
import type { Metadata } from 'next';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { TopDealsShowcase } from '@/components/landing/TopDealsShowcase';
import { ModalitySelector } from '@/components/landing/ModalitySelector';
import { ShippingCalculator } from '@/components/landing/ShippingCalculator';
import { LogisticsTimeline } from '@/components/landing/LogisticsTimeline';
import { FAQSection } from '@/components/landing/FAQSection';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';

export const metadata: Metadata = {
  title: 'NY2Bolivia | Compras de New York a Bolivia • Black Friday Courier',
  description:
    'Ofertas de Apple, Nike, Sephora, Coach y Best Buy directas a Bolivia. Vuelo JFK a Bolivia con tarifa de $9.50/lb.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface selection:bg-secondary-fixed selection:text-on-secondary-fixed antialiased">
      {/* 1. Barra superior limpia */}
      <AnnouncementBar
        slotsRemaining={14}
        totalSlots={50}
        dateRange="23 Nov - 3 Dic"
        deliveryDate="4 de Diciembre"
        ctaHref="/registro"
      />

      {/* 2. Header de navegación */}
      <Navbar whatsappNumber="59177012345" />

      {/* Contenido Principal */}
      <main className="flex-1 pb-16 md:pb-0">
        
        {/* 3. Hero minimalista */}
        <HeroSection
          slotsRemaining={14}
          totalSlots={50}
          ctaHref="/registro"
        />

        {/* 4. Grandes Ofertas Estrella (Directo después de la landing / hero) */}
        <TopDealsShowcase />

        {/* 5. Modalidades de Compra */}
        <ModalitySelector
          defaultValue="assisted"
          whatsappPhone="59177012345"
          showComparisonDetails={false}
        />

        {/* 6. Calculadora de Flete */}
        <ShippingCalculator
          baseRatePerLbUSD={9.50}
          exchangeRateBOB={6.96}
          whatsappPhone="59177012345"
          defaultWeightLbs={3.0}
        />

        {/* 7. Cronograma Logístico JFK */}
        <LogisticsTimeline
          whatsappNumber="59177012345"
        />

        {/* 8. Preguntas Frecuentes */}
        <FAQSection
          whatsappNumber="59177012345"
        />
      </main>

      {/* 9. Footer y navegación móvil */}
      <Footer />
      <MobileBottomNav whatsappNumber="59177012345" />
    </div>
  );
}
