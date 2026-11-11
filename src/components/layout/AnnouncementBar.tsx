'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export interface AnnouncementBarProps {
  /** Remaining flight reservation slots (default: 14) */
  slotsRemaining?: number;
  /** Total flight capacity slots (default: 50) */
  totalSlots?: number;
  /** Black Friday shopping window (default: '23 Nov - 3 Dic') */
  dateRange?: string;
  /** Delivery commencement date in Bolivia (default: '4 de Diciembre') */
  deliveryDate?: string;
  /** Target link for slot reservation CTA (default: '/registro') */
  ctaHref?: string;
  /** Optional custom container classes */
  className?: string;
}

/**
 * AnnouncementBar Component
 *
 * Sticky top urgency banner replicating the high-conversion live ticker
 * from desktop (ultra_vendedora) and mobile (m_vil) landing page templates.
 *
 * Features:
 * - Animated pulsing live sale badge
 * - Real-time slot availability counter (e.g. "14/50 disponibles")
 * - Black Friday date indicator pill
 * - Direct action link to the registration/pre-alerta workflow
 */
export function AnnouncementBar({
  slotsRemaining = 14,
  totalSlots = 50,
  dateRange = '23 Nov - 3 Dic',
  deliveryDate = '4 de Diciembre',
  ctaHref = '/registro',
  className = '',
}: AnnouncementBarProps) {
  return (
    <aside
      role="region"
      aria-label="Aviso de urgencia y disponibilidad de cupos Black Friday"
      className={`w-full bg-[#0a1120] text-surface-container-lowest border-b border-white/10 shadow-md relative z-[60] ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 text-center sm:text-left">
          
          {/* Left section: Pulse status badge & flight route */}
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-error text-on-error font-label-md text-xs font-bold tracking-wide uppercase shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span>Oferta Activa Black Friday</span>
            </span>

            <span className="hidden lg:inline text-xs font-medium text-surface-container-high border-l border-white/15 pl-2.5">
              Vuelo directo NY → Bolivia • Entregas desde el {deliveryDate}
            </span>
          </div>

          {/* Right section: Slots countdown + CTA button */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mx-auto sm:mx-0">
            {/* Slot counter badge */}
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10">
              <Icon name="bolt" size={16} className="text-tertiary-fixed-dim" />
              <p className="font-mono text-xs font-semibold text-white">
                <span className="hidden sm:inline">¡Solo {totalSlots} cupos! </span>
                Quedan{' '}
                <span className="text-tertiary-fixed-dim font-bold underline underline-offset-2">
                  {slotsRemaining}
                </span>{' '}
                disponibles
              </p>
            </div>

            {/* Date range pill (visible on sm+) */}
            <div className="hidden sm:flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md text-surface-container-high font-mono text-[11px] border border-white/10">
              <Icon name="schedule" size={14} className="text-tertiary-fixed-dim" />
              <span>{dateRange}</span>
            </div>

            {/* CTA reservation link */}
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-1 bg-tertiary-fixed-dim hover:bg-tertiary-fixed text-on-tertiary-fixed font-sans text-xs font-bold px-3 py-1.5 rounded-md shadow-sm transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              <span>Asegurar cupo ($20)</span>
              <Icon name="arrow_forward" size={14} />
            </Link>
          </div>

        </div>
      </div>
    </aside>
  );
}

export default AnnouncementBar;
