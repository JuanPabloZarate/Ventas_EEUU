'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import type { OrderModality } from '@/types/order';

export interface RegistrationHeroProps {
  currentModality: OrderModality;
  slotsRemaining?: number;
  totalSlots?: number;
  className?: string;
}

export function RegistrationHero({
  currentModality,
  className = '',
}: RegistrationHeroProps) {
  return (
    <div className={`flex flex-col gap-4 mb-8 ${className}`}>
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 sm:gap-2 font-mono text-xs text-on-surface-variant">
        <Link href="/" className="hover:text-secondary transition-colors flex items-center gap-1">
          <Icon name="home" size={14} />
          <span>Inicio</span>
        </Link>
        <Icon name="chevron_right" size={14} className="text-outline-variant" />
        <Link href="/#modalidades" className="hover:text-secondary transition-colors">
          Casillero NY
        </Link>
        <Icon name="chevron_right" size={14} className="text-outline-variant" />
        <span className="text-brand-navy font-bold">
          {currentModality === 'prealert' ? 'Pre-Alerta de Paquete' : 'Solicitud Compra Asistida'}
        </span>
      </nav>

      {/* Hero Header Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
        <div className="lg:col-span-8 flex flex-col gap-2.5">
          {/* Manifest Flight Pill */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-sans text-xs font-bold shadow-xs">
              <Icon name="flight_takeoff" size={16} className="text-secondary" />
              <span>Suite New York, NYC → Bolivia • JFK Direct</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-mono text-[11px] font-bold uppercase tracking-wider">
              <Icon name="local_shipping" size={13} />
              <span>Cierre: 3 Dic</span>
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-brand-navy tracking-tight">
            Registra tu Producto o Encarga tu Compra en New York
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-sm sm:text-base text-on-surface-variant leading-relaxed max-w-3xl">
            Indícanos si ya realizaste tu compra online con envío a nuestra{' '}
            <strong className="text-brand-navy font-semibold">Bodega en New York</strong> o si deseas que nuestro equipo en Manhattan realice la{' '}
            <strong className="text-secondary font-semibold">Compra Asistida</strong> en tienda física con tarjeta USA.
          </p>
        </div>

        {/* Micro-Guarantee Trust Badge (Desktop right side) */}
        <div className="lg:col-span-4">
          <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0">
              <Icon name="verified" size={24} className="text-secondary" />
            </div>
            <div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block">
                Garantía NY2Bolivia
              </span>
              <span className="font-display font-bold text-sm sm:text-base text-brand-navy block">
                Inspección &amp; Reempaque $0
              </span>
              <span className="font-sans text-xs text-secondary font-medium">
                Pesaje verificado con video FAA
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationHero;
