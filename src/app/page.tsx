import React from 'react';
import type { Metadata } from 'next';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FloatingCounterCard } from '@/components/landing/FloatingCounterCard';
import { StoreShowcase } from '@/components/landing/StoreShowcase';
import { ModalitySelector } from '@/components/landing/ModalitySelector';
import { ShippingCalculator } from '@/components/landing/ShippingCalculator';
import { LogisticsTimeline } from '@/components/landing/LogisticsTimeline';
import { FAQSection } from '@/components/landing/FAQSection';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';

export const metadata: Metadata = {
  title: 'NY2Bolivia | Black Friday Manhattan a Bolivia • Casillero y Compra Asistida',
  description:
    'Aprovecha hasta 70% OFF en Apple, Nike, Sephora, B&H y tiendas de New York. Vuelo directo JFK a Bolivia con entregas garantizadas desde el 4 de Diciembre.',
  openGraph: {
    title: 'NY2Bolivia | Black Friday Manhattan a Bolivia',
    description:
      'Compras directas en New York traídas a Bolivia antes de Navidad. Vuelo directo JFK ✈ LPB / VVI. ¡Solo 50 cupos disponibles!',
    url: 'https://ny2bolivia.com',
    siteName: 'NY2Bolivia Cargo & Shopping Express',
    locale: 'es_BO',
    type: 'website',
  },
};

/**
 * HomePage Component (Landing Page)
 *
 * Implements the complete Black Friday landing page for NY2Bolivia (Andean Skyline Logistics),
 * faithfully uniting desktop (`ultra_vendedora`) and mobile (`m_vil`) layouts.
 *
 * Visual & Functional Architecture:
 * 1. Top Urgency Live Ticker (`AnnouncementBar`): Pulse status badge, slot counter (14/50), CTA.
 * 2. Sticky Header (`Navbar`): Brand logo, JFK✈LPB status badge, desktop menu anchors, and mobile app-bar.
 * 3. Hero Section (`HeroSection`): Cinematic Manhattan shopping visuals, value proposition, and conversion CTAs.
 * 4. Floating Counter Badge (`FloatingCounterCard`): Mobile-exclusive negative-margin capacity counter.
 * 5. Vitrina Comercial (`StoreShowcase`): 6 iconic Manhattan stores (desktop 3x2 grid, mobile swipe carousel).
 * 6. Purchase Modalities (`ModalitySelector`): Compra Asistida vs Casillero NY selection.
 * 7. Dual-Currency Calculator (`ShippingCalculator`): Interactive weight slider ($9.50/lb, 6.96 BOB rate).
 * 8. Flight Logistics & Guarantees (`LogisticsTimeline`): 3-step timeline (23 Nov-3 Dic, 3 Dic cutoff, 4 Dic delivery) & 3 guarantees ($0 inspection, repacking, Christmas delivery).
 * 9. Interactive FAQ (`FAQSection`): Accordion for Black Friday, customs, QR payment in BOB, pickup branches.
 * 10. Comprehensive Footer (`Footer`): Desktop 4-column logistics hub directory & legal links.
 * 11. Mobile Bottom Bar (`MobileBottomNav`): Fixed 4-tab thumb navigation (Promos, Pre-Alerta, Modalidades, WhatsApp) with safe-area padding.
 */
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface selection:bg-secondary-fixed selection:text-on-secondary-fixed antialiased">
      {/* 1. Urgency Top Live Ticker (Fixed/Sticky at the very top) */}
      <AnnouncementBar
        slotsRemaining={14}
        totalSlots={50}
        dateRange="23 Nov - 3 Dic"
        deliveryDate="4 de Diciembre"
        ctaHref="/registro"
      />

      {/* 2. Main Navigation Header (Sticky below announcement ticker) */}
      <Navbar
        whatsappNumber="59177012345"
      />

      {/* Main Content Area */}
      {/* Note: `pb-20 md:pb-0` ensures MobileBottomNav does not obscure bottom content on small screens */}
      <main className="flex-1 pb-20 md:pb-0">
        
        {/* 3. Black Friday Manhattan Hero Banner */}
        <HeroSection
          slotsRemaining={14}
          totalSlots={50}
          ctaHref="/registro"
        />

        {/* 4. Floating Live Inventory Counter (Mobile Only Overlay: -mt-4 relative z-10) */}
        <FloatingCounterCard
          remaining={14}
          total={50}
          alertText="Cierre Inminente"
          subtitle="Cupos de Vuelo Disponibles"
        />

        {/* 5. Vitrina Comercial Manhattan (Desktop Grid & Mobile Touch Carousel) */}
        <StoreShowcase />

        {/* 6. Purchase Modalities (Compra Asistida vs Casillero NY) */}
        <ModalitySelector
          defaultValue="assisted"
          whatsappPhone="59177012345"
          showComparisonDetails={true}
        />

        {/* 7. Dual-Currency Freight & Volume Calculator ($9.50/lb, 6.96 BOB) */}
        <ShippingCalculator
          baseRatePerLbUSD={9.50}
          exchangeRateBOB={6.96}
          whatsappPhone="59177012345"
          defaultWeightLbs={3.0}
        />

        {/* 8. Flight Timeline & Logistics Guarantees (JFK Direct, Queens Hub, Delivery in Bolivia) */}
        <LogisticsTimeline
          whatsappNumber="59177012345"
        />

        {/* 9. Interactive FAQ Accordion & Direct Live Support */}
        <FAQSection
          whatsappNumber="59177012345"
        />

      </main>

      {/* 10. Institutional Logistics Directory Footer */}
      <Footer
        whatsappNumber="59177012345"
      />

      {/* 11. Mobile Fixed 4-Tab Bottom Navigation Bar (md:hidden, safe-area aware) */}
      <MobileBottomNav
        whatsappNumber="59177012345"
      />
    </div>
  );
}
