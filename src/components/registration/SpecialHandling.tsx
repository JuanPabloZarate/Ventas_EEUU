'use client';

import React from 'react';
import { Icon } from '@/components/ui/Icon';
import type { SpecialInstructions } from '@/types/order';

export interface SpecialHandlingProps {
  instructions: SpecialInstructions;
  onChange: {
    <K extends keyof SpecialInstructions>(field: K, value: SpecialInstructions[K]): void;
    (instructions: SpecialInstructions): void;
  };
  className?: string;
}

export function SpecialHandling({ instructions, onChange, className = '' }: SpecialHandlingProps) {
  const handleToggle = <K extends keyof SpecialInstructions>(field: K, value: boolean) => {
    // If onChange accepts field + value
    if (onChange.length >= 2) {
      (onChange as (f: K, v: boolean) => void)(field, value);
    } else {
      (onChange as (updated: SpecialInstructions) => void)({
        ...instructions,
        [field]: value,
      });
    }
  };

  return (
    <div className={`p-5 sm:p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-4 ${className}`}>
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Icon name="verified_user" size={22} className="text-secondary" />
          <h4 className="font-display text-sm sm:text-base font-bold text-brand-navy">
            Instrucciones Especiales de Manejo en New York
          </h4>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed">
          Bodega JFK / Queens
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Optimize Weight */}
        <label
          className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
            instructions.optimizeWeight
              ? 'border-secondary bg-secondary-fixed/20 shadow-xs'
              : 'border-outline-variant/40 bg-surface-container-lowest hover:bg-surface-container-high'
          }`}
        >
          <input
            type="checkbox"
            checked={instructions.optimizeWeight}
            onChange={(e) => handleToggle('optimizeWeight', e.target.checked)}
            className="w-4 h-4 mt-1 rounded text-secondary accent-secondary"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <strong className="font-sans text-xs font-bold text-brand-navy block">
                Optimizar peso
              </strong>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-secondary text-white">
                Ahorro
              </span>
            </div>
            <p className="font-sans text-xs text-on-surface-variant leading-snug">
              Descartar cajas voluminosas vacías de Amazon/UPS para pagar menos flete aéreo ($9.50/lb).
            </p>
          </div>
        </label>

        {/* Photo Inspection */}
        <label
          className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
            instructions.photoInspection
              ? 'border-secondary bg-secondary-fixed/20 shadow-xs'
              : 'border-outline-variant/40 bg-surface-container-lowest hover:bg-surface-container-high'
          }`}
        >
          <input
            type="checkbox"
            checked={instructions.photoInspection}
            onChange={(e) => handleToggle('photoInspection', e.target.checked)}
            className="w-4 h-4 mt-1 rounded text-secondary accent-secondary"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <strong className="font-sans text-xs font-bold text-brand-navy block">
                Inspección fotográfica
              </strong>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed">
                $0 GRATIS
              </span>
            </div>
            <p className="font-sans text-xs text-on-surface-variant leading-snug">
              Fotografía del contenido y pesaje en báscula digital certificada apenas aterriza en New York.
            </p>
          </div>
        </label>

        {/* Holiday Gift Packaging */}
        <label
          className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
            instructions.holidayPackaging
              ? 'border-tertiary-fixed-dim bg-tertiary-fixed/30 shadow-xs'
              : 'border-outline-variant/40 bg-surface-container-lowest hover:bg-surface-container-high'
          }`}
        >
          <input
            type="checkbox"
            checked={instructions.holidayPackaging}
            onChange={(e) => handleToggle('holidayPackaging', e.target.checked)}
            className="w-4 h-4 mt-1 rounded text-tertiary accent-tertiary-fixed-dim"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <strong className="font-sans text-xs font-bold text-brand-navy block">
                Regalo / Black Friday
              </strong>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-tertiary-fixed-dim text-on-tertiary-fixed">
                Navideño
              </span>
            </div>
            <p className="font-sans text-xs text-on-surface-variant leading-snug">
              Conservar empaques originales, cajas de lujo y bolsas de marca para obsequio directo.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}

export default SpecialHandling;
