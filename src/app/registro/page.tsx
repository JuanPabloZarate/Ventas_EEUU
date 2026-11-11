import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { RegistroFlow } from '@/components/registration/RegistroFlow';
import { RegistrationPageSkeleton } from '@/components/registration/RegistrationPageSkeleton';

export const metadata: Metadata = {
  title: 'Registro de Producto & Pre-Alerta | NY2Bolivia',
  description: 'Pre-alerta de compras en USA y solicitud de Compra Asistida en New York. Casillero postal y flete directo a Bolivia.',
};

export default function RegistroPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface selection:bg-secondary-fixed selection:text-on-secondary-fixed antialiased">
      {/* 1. Urgency Top Bar */}
      <AnnouncementBar
        slotsRemaining={14}
        totalSlots={50}
        dateRange="23 Nov - 3 Dic"
        deliveryDate="4 de Diciembre"
        ctaHref="/registro"
      />

      {/* 2. Responsive Header Navigation */}
      <Navbar whatsappNumber="59177012345" />

      {/* 3. Main Container wrapped in Suspense for static prerendering */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 md:pb-16">
        <Suspense fallback={<RegistrationPageSkeleton />}>
          <RegistroFlow />
        </Suspense>
      </main>

      {/* 4. Footer & Mobile Navigation */}
      <Footer />
      <MobileBottomNav whatsappNumber="59177012345" />
    </div>
  );
}
