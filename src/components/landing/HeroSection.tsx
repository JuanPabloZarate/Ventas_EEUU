'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export interface HeroSectionProps {
  /** Remaining flight reservation slots (default: 14) */
  slotsRemaining?: number;
  /** Total flight capacity slots (default: 50) */
  totalSlots?: number;
  /** Primary CTA destination URL (default: '/registro') */
  ctaHref?: string;
  /** Optional custom container classes */
  className?: string;
}

/**
 * HeroSection Component
 *
 * High-conversion hero banner capturing the electric energy of Black Friday
 * shopping in Manhattan, New York with direct courier dispatch to Bolivia.
 *
 * Fully responsive:
 * - Desktop: 12-column grid layout with cinematic photography, punchy copy,
 *   micro-guarantees, and an interactive Boarding Pass courier manifest card.
 * - Mobile: 400px+ full-bleed card with multi-layer vertical gradients,
 *   touch-optimized tap targets, and direct reservation triggers.
 */
export function HeroSection({
  slotsRemaining = 14,
  totalSlots = 50,
  ctaHref = '/registro',
  className = '',
}: HeroSectionProps) {
  const percentBooked = Math.round(((totalSlots - slotsRemaining) / totalSlots) * 100);

  return (
    <section
      className={`relative w-full bg-primary-container text-on-primary overflow-hidden py-12 md:py-16 lg:py-24 ${className}`}
    >
      {/* Cinematic Background Imagery with Multi-Tier Gradients */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwo_8z4-6oNXaQ89yEN1SbcrSuDVrJOy2FDlVqAECxb6gcGwy8wQ-u7SPueV_ex_ZmzvIqdLQpgsgm4aouAbB4DraaTwJUrT-QibT_youEO3_UC_i8RRgvCCxAK_d_pd6I_t6b7suQtlKHTVRel7CW3sYbXIfXHPWUYM2W7vvX87MTCKPPP735yyloEFGTFNUdE3IzAWYM2llkutPP6bmTOvdY6YYnhO6H9fDJSA"
          alt="Black Friday New York Shopping Fifth Avenue Manhattan"
          className="w-full h-full object-cover object-center"
          style={{ filter: 'brightness(0.82) contrast(1.15)' }}
        />
        {/* Horizontal dark gradient for desktop readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e1c2f] via-[#0e1c2f]/80 md:via-[#0e1c2f]/70 to-transparent"></div>
        {/* Vertical gradient for top and bottom blending */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1c2f] via-transparent to-[#0e1c2f]/50"></div>
      </div>

      {/* Subtle festive atmospheric glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-error/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-tertiary-fixed-dim/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Value Proposition & Actions (7 Cols on LG) */}
          <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6">
            
            {/* Urgency Badge */}
            <div className="inline-flex items-center gap-2 self-start px-3.5 py-1 rounded-full bg-surface-container-lowest/15 backdrop-blur-md text-tertiary-fixed-dim font-mono text-xs font-bold uppercase tracking-wider border border-white/15 shadow-sm">
              <Icon name="flight_takeoff" size={16} className="text-secondary-fixed" />
              <span>Despacho Exclusivo Manhattan • Black Friday</span>
            </div>

            {/* Main H1 Headline */}
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[46px] lg:leading-[52px] text-white tracking-tight">
              BLACK FRIDAY NEW YORK:
              <br />
              <span className="text-tertiary-fixed-dim drop-shadow-sm">
                Aprovecha hasta 70% OFF en USA.
              </span>
              <br />
              Te lo traemos a Bolivia antes de Navidad.
            </h1>

            {/* Subtitle Description */}
            <p className="font-sans text-base sm:text-lg text-surface-container-low max-w-2xl leading-relaxed">
              Compra en <strong className="text-white">Apple, Sephora, Nike, B&amp;H, Macy’s y Saks</strong> con
              tarifas fijas preferenciales de <strong>$9.50/Lb</strong> y entrega directa garantizada en Bolivia a partir
              del 4 de Diciembre.
            </p>

            {/* Mobile Flight Route Callout */}
            <div className="flex sm:hidden items-center gap-2 text-surface-container-low font-sans text-xs">
              <Icon name="flight_land" size={16} className="text-secondary-fixed" />
              <span>Entregas desde 4 Dic en La Paz, Santa Cruz y Cochabamba</span>
            </div>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1">
              <Link
                href={ctaHref}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-tertiary-fixed-dim hover:bg-tertiary-fixed active:scale-[0.98] text-on-tertiary-fixed font-sans text-base font-bold shadow-elevation-2 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <Icon name="local_fire_department" size={22} />
                <span>Asegurar Mi Cupo ($20 USD)</span>
              </Link>

              <Link
                href="#tiendas"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white font-sans text-base font-semibold border border-white/20 backdrop-blur-sm transition-all"
              >
                <Icon name="storefront" size={20} className="text-secondary-fixed" />
                <span>Ver Tiendas Manhattan</span>
              </Link>
            </div>

            {/* Trust Micro-Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10 font-sans text-xs text-surface-container-low">
              <div className="flex items-center gap-2">
                <Icon name="verified" size={18} className="text-secondary-fixed shrink-0" />
                <span>Vuelo Directo JFK Oficial</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="calendar_month" size={18} className="text-tertiary-fixed-dim shrink-0" />
                <span>Llegada 4 al 12 de Diciembre</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="security" size={18} className="text-secondary-fixed shrink-0" />
                <span>Garantía de Entrega o Devolución</span>
              </div>
            </div>

          </div>

          {/* Right Column: Boarding Pass / Cargo Manifest Ticket (5 Cols on LG) */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative rounded-2xl bg-surface-container-lowest/10 backdrop-blur-xl border border-white/20 p-6 shadow-elevation-3 text-white overflow-hidden group hover:border-white/30 transition-all">
              
              {/* Decorative top ribbon */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-secondary-container via-tertiary-fixed-dim to-secondary"></div>

              {/* Manifest Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/15">
                <div>
                  <span className="font-mono text-[11px] text-surface-container-high uppercase tracking-widest block">
                    Cargo Manifest • JFK✈LPB
                  </span>
                  <span className="font-display font-extrabold text-lg text-white">
                    BOARDING PASS COURIER
                  </span>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-mono text-xs font-bold flex items-center gap-1">
                  <Icon name="airplane_ticket" size={14} />
                  <span>BF-2026</span>
                </div>
              </div>

              {/* Route Summary */}
              <div className="grid grid-cols-3 items-center py-4 text-center">
                <div className="text-left">
                  <span className="font-mono text-2xl font-black text-white block">JFK</span>
                  <span className="text-xs text-surface-container-high">New York, USA</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Icon name="flight_takeoff" size={22} className="text-tertiary-fixed-dim" />
                  <span className="text-[10px] font-mono text-secondary-fixed tracking-wider uppercase">Directo</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-2xl font-black text-white block">BOL</span>
                  <span className="text-xs text-surface-container-high">LPB / VVI / CBB</span>
                </div>
              </div>

              {/* Financial & Logistics Parameters */}
              <div className="bg-black/25 rounded-xl p-3.5 space-y-2 border border-white/10 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-surface-container-high">Tarifa Flete Aéreo:</span>
                  <span className="font-mono font-bold text-tertiary-fixed-dim text-sm">$9.50 USD / Lb</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-surface-container-high">Tipo de Cambio Oficial:</span>
                  <span className="font-mono text-white">6.96 BOB / USD</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-surface-container-high">Consolidación Multi-tienda:</span>
                  <span className="font-mono text-secondary-fixed font-bold">$0 USD (Gratis)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-surface-container-high">Reserva de Espacio:</span>
                  <span className="font-mono text-white font-semibold">$20 USD (Reembolsable)</span>
                </div>
              </div>

              {/* Real-time Flight Slot Progress */}
              <div className="pt-4 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-surface-container-high">Capacidad de Carga JFK:</span>
                  <span className="font-bold text-white">
                    {totalSlots - slotsRemaining} de {totalSlots} cupos ocupados ({percentBooked}%)
                  </span>
                </div>
                <div className="w-full bg-white/15 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-secondary-container via-tertiary-fixed-dim to-secondary rounded-full transition-all duration-500"
                    style={{ width: `${percentBooked}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-surface-container-high text-right">
                  Quedan <strong className="text-tertiary-fixed-dim underline">{slotsRemaining} cupos</strong> disponibles
                </p>
              </div>

              {/* Fast Direct Button inside Card */}
              <div className="pt-4">
                <Link
                  href={ctaHref}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-tertiary-fixed-dim hover:bg-tertiary-fixed text-on-tertiary-fixed rounded-xl font-sans text-sm font-bold shadow-lg transition-transform hover:scale-[1.02]"
                >
                  <Icon name="verified_user" size={18} />
                  <span>Asegurar Mi Casillero NY ($20)</span>
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default HeroSection;
