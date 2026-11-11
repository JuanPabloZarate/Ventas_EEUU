import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { TopDealsShowcase } from '@/components/landing/TopDealsShowcase';
import { FAQSection } from '@/components/landing/FAQSection';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Compras EEUU | Tus compras de Navidad, directo de Nueva York a tus manos',
  description:
    'Aprovecha hasta un 70% OFF real por Black Friday. Productos 100% originales comprados en los principales centros comerciales de EE.UU.',
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
