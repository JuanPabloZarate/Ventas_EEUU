'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export interface FooterProps {
  className?: string;
  whatsappNumber?: string;
}

export function Footer({
  className = '',
  whatsappNumber = '59177012345',
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hola Compras EEUU, deseo comunicarme con soporte al cliente.'
  )}`;

  return (
    <footer
      className={`w-full bg-[#0a1120] text-slate-400 py-10 border-t border-white/10 text-xs ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-base text-white">
              Compras <span className="text-secondary">EEUU</span>
            </span>
            <span className="text-[11px] text-slate-400">
              • Envíos directos y compras asistidas de Estados Unidos a Bolivia
            </span>
          </div>

          <div className="flex items-center gap-5">
            <Link href="/#ofertas-estrella" className="hover:text-white transition-colors">
              Ofertas
            </Link>
            <Link href="/registro" className="hover:text-white transition-colors">
              Registrar Compra
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] hover:underline flex items-center gap-1"
            >
              <Icon name="chat" size={14} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <p>&copy; {currentYear} Compras EEUU. Todos los derechos reservados.</p>
          <p>Entregas en Santa Cruz, La Paz, Cochabamba y toda Bolivia.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
