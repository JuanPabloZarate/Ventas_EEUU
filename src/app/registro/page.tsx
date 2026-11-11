import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RegistroFlow } from '@/components/registration/RegistroFlow';

export const metadata: Metadata = {
  title: 'Registro de Compra o Pedido | NY2Bolivia',
  description: 'Registro de compra online con ticket o solicitud de compra asistida en tienda de Nueva York.',
};

export default function RegistroPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface antialiased">
      {/* 1. Barra superior */}
      <AnnouncementBar deliveryDate="4 de Diciembre" ctaHref="/registro" />

      {/* 2. Header */}
      <Navbar whatsappNumber="59177012345" />

      {/* 3. Contenedor del Formulario Simplificado */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Suspense fallback={<div className="text-center py-12 text-on-surface-variant text-sm">Cargando formulario...</div>}>
          <RegistroFlow />
        </Suspense>
      </main>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}
