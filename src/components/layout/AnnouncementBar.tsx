'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export interface AnnouncementBarProps {
  dateRange?: string;
  deliveryDate?: string;
  ctaHref?: string;
  className?: string;
}

export function AnnouncementBar({
  deliveryDate = '4 de Diciembre',
  ctaHref = '/registro',
  className = '',
}: AnnouncementBarProps) {
  return (
    <aside
      className={`w-full bg-[#0a1120] text-slate-200 border-b border-white/10 text-xs py-2 px-4 ${className}`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span className="text-slate-300">
            Campaña Black Friday NYC • Entregas en Bolivia desde el {deliveryDate}
          </span>
        </div>
        <Link
          href={ctaHref}
          className="text-secondary-fixed hover:underline font-semibold flex items-center gap-1 shrink-0"
        >
          <span>Registrarse</span>
          <Icon name="arrow_forward" size={13} />
        </Link>
      </div>
    </aside>
  );
}
