'use client';

import React from 'react';
import { Icon } from '@/components/ui/Icon';
import type { OrderModality } from '@/types/order';

export interface ModalityToggleProps {
  value: OrderModality;
  onChange: (modality: OrderModality) => void;
  className?: string;
}

export function ModalityToggle({
  value,
  onChange,
  className = '',
}: ModalityToggleProps) {
  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {/* Outer Card Container */}
      <div className="p-1.5 sm:p-2 rounded-2xl bg-surface-container-high/60 shadow-inner border border-outline-variant/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2" role="radiogroup" aria-label="Modalidad de servicio">
          
          {/* Option 1: Pre-Alerta (Ya compré online) */}
          <button
            type="button"
            role="radio"
            aria-checked={value === 'prealert'}
            onClick={() => onChange('prealert')}
            className={`flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl text-left transition-all duration-200 cursor-pointer ${
              value === 'prealert'
                ? 'bg-surface-container-lowest text-brand-navy shadow-elevation-1 ring-2 ring-secondary'
                : 'hover:bg-surface-container-lowest/60 text-on-surface-variant'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                value === 'prealert'
                  ? 'bg-secondary text-white'
                  : 'bg-secondary-fixed text-on-secondary-fixed'
              }`}
            >
              <Icon name="inventory_2" size={22} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm sm:text-base text-brand-navy">
                  Ya compré online
                </span>
                <span className="px-2 py-0.5 rounded-full bg-secondary text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                  Pre-alerta
                </span>
              </div>
              <p className="font-sans text-xs text-on-surface-variant mt-1 leading-snug">
                Compraste por tu cuenta y enviaste a tu Casillero NY. Registra tu tracking number para recibir fotos de pesaje.
              </p>
            </div>
          </button>

          {/* Option 2: Compra Asistida (Personal Shopper) */}
          <button
            type="button"
            role="radio"
            aria-checked={value === 'assisted'}
            onClick={() => onChange('assisted')}
            className={`flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl text-left transition-all duration-200 cursor-pointer ${
              value === 'assisted'
                ? 'bg-surface-container-lowest text-brand-navy shadow-elevation-1 ring-2 ring-brand-gold'
                : 'hover:bg-surface-container-lowest/60 text-on-surface-variant'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                value === 'assisted'
                  ? 'bg-brand-gold text-brand-navy'
                  : 'bg-tertiary-fixed text-on-tertiary-fixed'
              }`}
            >
              <Icon name="shopping_bag" size={22} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm sm:text-base text-brand-navy">
                  Compra Asistida
                </span>
                <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed-dim text-on-tertiary-fixed font-mono text-[10px] font-bold uppercase tracking-wider">
                  Personal Shopper
                </span>
              </div>
              <p className="font-sans text-xs text-on-surface-variant mt-1 leading-snug">
                Envíanos el enlace de tiendas en Manhattan (Apple 5th Ave, Nike, B&amp;H, Sephora) y nosotros compramos con tarjeta USA.
              </p>
            </div>
          </button>

        </div>
      </div>

      {/* Dynamic Contextual Hint Banner */}
      <div
        className={`px-3 py-2 rounded-xl flex items-center gap-2 text-xs transition-colors ${
          value === 'prealert'
            ? 'bg-secondary-fixed/50 text-on-secondary-fixed-variant'
            : 'bg-tertiary-fixed/40 text-on-tertiary-fixed-variant'
        }`}
      >
        <Icon
          name={value === 'prealert' ? 'verified' : 'support_agent'}
          size={16}
          className="shrink-0"
        />
        <p className="font-sans">
          {value === 'prealert' ? (
            <>
              <strong className="font-bold">Pre-Alerta Express:</strong> Te pediremos el tracking number de UPS, FedEx o USPS para sincronizar el arribo con la báscula FAA en Queens.
            </>
          ) : (
            <>
              <strong className="font-bold">Personal Shopper Manhattan:</strong> Cotizamos el artículo al valor retail en USA + 8% de comisión de gestión y reserva de cupo ($20 USD).
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default ModalityToggle;
