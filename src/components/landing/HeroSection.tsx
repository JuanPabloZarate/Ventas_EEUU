'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export interface HeroSectionProps {
  slotsRemaining?: number;
  totalSlots?: number;
  ctaHref?: string;
  className?: string;
}

export function HeroSection({
  ctaHref = '/registro',
  className = '',
}: HeroSectionProps) {
  return (
    <section
      className={`relative w-full bg-gradient-to-b from-[#0a1120] to-[#0f1d32] text-white py-14 sm:py-20 border-b border-white/10 ${className}`}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-5">
        
        {/* Badge limpio */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-secondary-fixed text-xs font-medium border border-white/10">
          <Icon name="flight_takeoff" size={14} />
          <span>Vuelo Directo New York ✈ Bolivia</span>
        </div>

        {/* Heading */}
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
          Compras en Nueva York, <br />
          <span className="text-secondary-fixed">en Bolivia antes de Navidad.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-sans leading-relaxed">
          Aprovecha los descuentos oficiales en Manhattan. Compramos en tienda física por ti o recibimos tus paquetes de tiendas online para despacho directo.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href={ctaHref}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-sans font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Registrar Compra / Pedido</span>
            <Icon name="arrow_forward" size={16} />
          </Link>
          <a
            href="#ofertas-estrella"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-sans font-semibold text-sm transition-all flex items-center justify-center gap-1.5 border border-white/10"
          >
            <span>Ver Ofertas Destacadas</span>
            <Icon name="arrow_downward" size={15} />
          </a>
        </div>

      </div>
    </section>
  );
}
