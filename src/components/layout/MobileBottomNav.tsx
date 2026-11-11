'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';

export interface MobileBottomNavProps {
  /** Optional custom container classes */
  className?: string;
  /** Coordinator WhatsApp contact phone number */
  whatsappNumber?: string;
}

/**
 * MobileBottomNav Component
 *
 * Implements Feature 13 from PROJECT.md:
 * Fixed mobile 4-tab bottom navigation bar (`Promos`, `Pre-Alerta`, `Modalidades`, `WhatsApp`)
 * matching `ny2bolivia_black_friday_m_vil/code.html:413`.
 *
 * Features:
 * - Hidden on desktop viewports (`md:hidden`), sticky fixed on mobile (`fixed bottom-0`)
 * - Safe area inset padding (`pb-safe`) for iPhone home swipe bars
 * - Backdrop blur frosted glass surface (`backdrop-blur-xl bg-surface/95`)
 * - Accessible ARIA attributes and minimum 44px touch targets
 * - Active tab indicator tracking current section/route
 */
export function MobileBottomNav({
  className = '',
  whatsappNumber = '59177012345',
}: MobileBottomNavProps) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>('promos');

  // Sync active tab with route or hash
  useEffect(() => {
    if (pathname.includes('/registro')) {
      setActiveTab('prealerta');
    } else {
      const handleHashChange = () => {
        const hash = window.location.hash;
        if (hash === '#modalidades') {
          setActiveTab('modalidades');
        } else if (hash === '#tiendas' || hash === '#promos') {
          setActiveTab('promos');
        } else if (hash === '#cronograma' || hash === '#calculadora' || hash === '#faq') {
          setActiveTab('promos');
        }
      };

      handleHashChange();
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }
  }, [pathname]);

  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hola NY2Bolivia, deseo atención y asesoría directa sobre las ofertas de Black Friday en New York.'
  )}`;

  return (
    <nav
      role="navigation"
      aria-label="Navegación móvil principal"
      className={`fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface/95 backdrop-blur-xl border-t border-outline-variant/30 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] md:hidden transition-all ${className}`}
    >
      <div className="grid grid-cols-4 items-center h-16 px-1">
        
        {/* Tab 1: Promos */}
        <Link
          href="/#tiendas"
          onClick={() => setActiveTab('promos')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] gap-0.5 transition-colors ${
            activeTab === 'promos'
              ? 'text-secondary font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          data-path="inicio-promos"
          aria-label="Ver promociones y tiendas Manhattan"
        >
          <div className="relative">
            <Icon
              name="local_mall"
              size={22}
              filled={activeTab === 'promos'}
              className="transition-transform group-active:scale-95"
            />
            {activeTab === 'promos' && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-secondary"></span>
            )}
          </div>
          <span className="font-label-md text-[11px] leading-tight text-center truncate max-w-full">
            Promos
          </span>
        </Link>

        {/* Tab 2: Pre-Alerta (High-Conversion Action) */}
        <Link
          href="/registro"
          onClick={() => setActiveTab('prealerta')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] gap-0.5 transition-colors relative ${
            activeTab === 'prealerta'
              ? 'text-secondary font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          data-path="registro-pre-alerta"
          aria-label="Registrar compra o pre-alerta"
        >
          <div className="relative">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                activeTab === 'prealerta'
                  ? 'bg-secondary text-white shadow-sm'
                  : 'bg-secondary-fixed/50 text-secondary'
              }`}
            >
              <Icon
                name="inventory_2"
                size={18}
                filled={activeTab === 'prealerta'}
              />
            </div>
          </div>
          <span className="font-label-md text-[11px] leading-tight text-center truncate max-w-full font-semibold">
            Pre-Alerta
          </span>
        </Link>

        {/* Tab 3: Modalidades */}
        <Link
          href="/#modalidades"
          onClick={() => setActiveTab('modalidades')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] gap-0.5 transition-colors ${
            activeTab === 'modalidades'
              ? 'text-secondary font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          data-path="modalidades-compra"
          aria-label="Modalidades de compra: asistida o casillero"
        >
          <div className="relative">
            <Icon
              name="shopping_bag"
              size={22}
              filled={activeTab === 'modalidades'}
              className="transition-transform group-active:scale-95"
            />
            {activeTab === 'modalidades' && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-secondary"></span>
            )}
          </div>
          <span className="font-label-md text-[11px] leading-tight text-center truncate max-w-full">
            Modalidades
          </span>
        </Link>

        {/* Tab 4: WhatsApp */}
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center h-full min-h-[44px] gap-0.5 text-on-surface-variant hover:text-emerald-600 transition-colors"
          data-path="contacto-soporte-whatsapp"
          aria-label="Contactar soporte por WhatsApp"
        >
          <div className="relative">
            <Icon
              name="support_agent"
              size={22}
              className="text-emerald-600 transition-transform hover:scale-110"
            />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <span className="font-label-md text-[11px] leading-tight text-center truncate max-w-full text-emerald-700 font-semibold">
            WhatsApp
          </span>
        </a>

      </div>
    </nav>
  );
}

export default MobileBottomNav;
