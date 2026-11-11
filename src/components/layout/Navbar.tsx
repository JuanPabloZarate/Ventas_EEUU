'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export interface NavbarProps {
  whatsappNumber?: string;
  className?: string;
}

export function Navbar({
  whatsappNumber = '59177012345',
  className = '',
}: NavbarProps) {
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hola Compras EEUU, deseo información para mis compras en New York y EE.UU.'
  )}`;

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-surface/95 backdrop-blur-md border-b border-outline-variant/20 transition-all ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-14 sm:h-16 flex items-center justify-between gap-4">
          
          {/* Logo Minimalista: Compras EEUU */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-primary-container">
              Compras <span className="text-secondary">EEUU</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-mono text-[10px] font-semibold">
              USA ✈ Bolivia
            </span>
          </Link>

          {/* Enlaces de Acción Directos y Limpios */}
          <div className="flex items-center gap-3">
            <Link
              href="/#ofertas-estrella"
              className="text-xs sm:text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors hidden sm:inline-block"
            >
              Ver Ofertas
            </Link>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm font-medium text-[#25D366] hover:underline flex items-center gap-1"
            >
              <Icon name="chat" size={15} />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            <Link
              href="/registro"
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-primary-container hover:bg-black text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>Registrarse</span>
              <Icon name="arrow_forward" size={14} />
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}

export default Navbar;
