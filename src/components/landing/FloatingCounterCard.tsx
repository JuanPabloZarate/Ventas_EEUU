'use client';

import React from 'react';
import { Icon } from '@/components/ui/Icon';

export interface FloatingCounterCardProps {
  /** Remaining flight reservation slots (default: 14) */
  remaining?: number;
  /** Total flight capacity slots (default: 50) */
  total?: number;
  /** Urgency alert label (default: 'Cierre Inminente') */
  alertText?: string;
  /** Subtitle description (default: 'Cupos de Vuelo Disponibles') */
  subtitle?: string;
  /** Optional custom container classes */
  className?: string;
}

/**
 * FloatingCounterCard Component
 *
 * Mobile-exclusive floating inventory status badge replicating the exact
 * negative-margin card (`-mt-4 relative z-10`) from `ny2bolivia_black_friday_m_vil/code.html:47-64`.
 *
 * Features:
 * - Overlaps the bottom boundary of HeroSection on mobile viewports
 * - High-contrast slot availability counter (e.g. "14 / 50")
 * - Urgent red status pill ("Cierre Inminente") with animated pulse
 * - Micro progress indicator showing capacity saturation
 * - Accessible ARIA live region for screen reader urgency announcements
 */
export function FloatingCounterCard({
  remaining = 14,
  total = 50,
  alertText = 'Cierre Inminente',
  subtitle = 'Cupos de Vuelo Disponibles',
  className = '',
}: FloatingCounterCardProps) {
  const percentFilled = Math.min(100, Math.round(((total - remaining) / total) * 100));

  return (
    <div
      role="status"
      aria-live="polite"
      className={`px-4 sm:px-6 -mt-4 sm:-mt-6 relative z-10 max-w-7xl mx-auto w-full md:hidden ${className}`}
    >
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-elevation-2 border border-outline-variant/40 flex flex-col gap-2.5 transition-all">
        
        {/* Top row: Counter stats and status badge */}
        <div className="flex items-center justify-between gap-3">
          
          {/* Left: Inventory icon and count */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0 shadow-xs">
              <Icon name="inventory_2" size={22} />
            </div>
            <div>
              <div className="font-display font-extrabold text-xl text-on-surface leading-none">
                {remaining} <span className="text-on-surface-variant font-normal text-sm">/ {total}</span>
              </div>
              <div className="text-xs text-on-surface-variant font-medium mt-0.5">
                {subtitle}
              </div>
            </div>
          </div>

          {/* Right: Imminent closure alert pill */}
          <div className="shrink-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-sans text-xs font-bold shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-error"></span>
              </span>
              <span>{alertText}</span>
            </span>
          </div>

        </div>

        {/* Bottom row: Capacity saturation progress bar */}
        <div className="space-y-1">
          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-secondary to-tertiary-fixed-dim rounded-full transition-all duration-700 ease-out"
              style={{ width: `${percentFilled}%` }}
              role="progressbar"
              aria-valuenow={remaining}
              aria-valuemin={0}
              aria-valuemax={total}
              aria-label={`Capacidad de vuelo: ${percentFilled}% asignada`}
            ></div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-on-surface-variant font-mono">
            <span>{percentFilled}% capacidad asignada</span>
            <span>Vuelo directo JFK</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default FloatingCounterCard;
