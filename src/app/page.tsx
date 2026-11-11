import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { TopDealsShowcase } from '@/components/landing/TopDealsShowcase';
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
      {/* 1. Header minimalista */}
      <Navbar whatsappNumber="59177012345" />

      {/* Contenido Principal: Solo Hero, Grandes Ofertas y FAQs esenciales */}
      <main className="flex-1">
        {/* 2. Hero simple y directo */}
        <HeroSection ctaHref="/registro" />

        {/* 3. Grandes Ofertas con Link de Compra oficial y Botón de Pedido */}
        <TopDealsShowcase />

        {/* 4. Preguntas Frecuentes esenciales */}
        <FAQSection whatsappNumber="59177012345" />
      </main>

      {/* 5. Footer */}
      <Footer />
    </div>
  );
}
