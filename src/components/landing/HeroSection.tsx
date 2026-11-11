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
  slotsRemaining = 14,
  totalSlots = 50,
  ctaHref = '/registro',
  className = '',
}: HeroSectionProps) {
  return (
    <section
      className={`relative w-full bg-gradient-to-b from-[#0a1120] to-[#0f1d32] text-white py-14 sm:py-20 lg:py-24 border-b border-white/10 ${className}`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        
        {/* Simple Minimal Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-tertiary-fixed-dim text-xs font-medium border border-white/10 backdrop-blur-sm">
          <Icon name="flight_takeoff" size={14} className="text-secondary-fixed" />
          <span>Vuelo Directo JFK ✈ Bolivia • Entregas 4 de Diciembre</span>
        </div>

        {/* Clean Heading */}
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
          Tus compras de Nueva York, <br className="hidden sm:inline" />
          <span className="text-secondary-fixed">en Bolivia antes de Navidad.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed">
          Accede a las ofertas oficiales de Black Friday en Manhattan con tarifa fija de{' '}
          <strong className="text-white">$9.50/Lb</strong> y retiro directo en Sopocachi, Equipetrol y Cochabamba.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href={ctaHref}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-sans font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Registrar Compra / Pre-Alerta</span>
            <Icon name="arrow_forward" size={16} />
          </Link>
          <a
            href="#ofertas-estrella"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-sans font-semibold text-sm transition-all flex items-center justify-center gap-2 border border-white/10"
          >
            <span>Ver Grandes Ofertas</span>
            <Icon name="arrow_downward" size={16} />
          </a>
        </div>

        {/* Minimal metrics row */}
        <div className="pt-6 flex items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400 border-t border-white/10 max-w-md mx-auto">
          <div>
            <span className="block font-bold text-white text-sm sm:text-base">$9.50 USD</span>
            <span>Por Libra</span>
          </div>
          <div className="h-4 w-px bg-white/15"></div>
          <div>
            <span className="block font-bold text-white text-sm sm:text-base">Bs. 6.96</span>
            <span>Tipo de Cambio</span>
          </div>
          <div className="h-4 w-px bg-white/15"></div>
          <div>
            <span className="block font-bold text-tertiary-fixed-dim text-sm sm:text-base">{slotsRemaining} de {totalSlots}</span>
            <span>Cupos Libres</span>
          </div>
        </div>

      </div>
    </section>
  );
}
