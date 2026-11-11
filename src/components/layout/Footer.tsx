'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export interface FooterProps {
  /** Optional custom container classes */
  className?: string;
  /** Coordinator WhatsApp contact phone number */
  whatsappNumber?: string;
}

/**
 * Footer Component
 *
 * Implements Feature 28 from PROJECT.md and reproduces the 4-column logistics
 * directory layout from `ny2bolivia_black_friday_versi_n_ultra_vendedora/code.html:476-505`.
 *
 * Structure:
 * 1. 4-column logistics directory (Hub NY 01, Almacén Queens, Cobertura Bolivia, Entrega 04)
 * 2. Brand summary banner with fast action links
 * 3. Bottom legal bar with terms, cargo policies, and insurance
 */
export function Footer({
  className = '',
  whatsappNumber = '59177012345',
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hola NY2Bolivia, deseo comunicarme con soporte al cliente para compras en New York.'
  )}`;

  return (
    <footer
      role="contentinfo"
      aria-label="Pie de página y directorio de sedes logísticas"
      className={`w-full bg-primary-container text-surface-container-high py-16 lg:py-20 shadow-[0_-1px_12px_rgba(0,0,0,0.06)] border-t border-white/10 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4-Column Logistics Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-14 border-b border-white/10">
          
          {/* Column 1: Hub New York & Recepción */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-surface-container-low font-headline-sm font-extrabold text-secondary flex items-center justify-center shadow-sm">
                  01
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-xs font-semibold">
                  <Icon name="verified_user" size={14} className="text-secondary" />
                  <span>Almacén JFK Certificado</span>
                </span>
              </div>
              <h4 className="font-headline-sm font-bold text-white text-lg sm:text-xl mb-2">
                Compras en New York
              </h4>
              <p className="font-body-sm text-xs sm:text-sm text-on-primary-container leading-relaxed">
                Realiza todas tus compras en tiendas online de New York o encárganos compras directas y envíalas a tu suite asignada en Queens.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-2 font-label-md text-xs sm:text-sm text-secondary-fixed font-semibold">
              <Icon name="storefront" size={18} className="text-secondary-container" />
              <span>Envíos a Suite Queens</span>
            </div>
          </div>

          {/* Column 2: Almacén Queens NY */}
          <div className="flex flex-col gap-3.5">
            <h4 className="font-title-md font-bold text-surface-container-lowest text-base sm:text-lg">
              Almacén Queens NY
            </h4>
            <div className="flex items-start gap-2.5">
              <Icon name="location_on" size={18} className="text-secondary-container mt-0.5 shrink-0" />
              <p className="font-body-sm text-xs sm:text-sm text-surface-variant leading-relaxed">
                Recepción final hasta el 3 de Diciembre en Woodside NY, pesaje verificado con video, fotos de tus paquetes y reempaque optimizado.
              </p>
            </div>
            <div className="flex items-center gap-2.5 pt-1">
              <Icon name="schedule" size={18} className="text-secondary-container shrink-0" />
              <span className="font-body-sm text-xs sm:text-sm text-surface-variant font-mono">
                Recepción Lun-Sáb: 08:00 - 19:00 EST
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Icon name="flight_takeoff" size={18} className="text-secondary-container shrink-0" />
              <span className="font-body-sm text-xs sm:text-sm text-surface-variant">
                Salidas semanales JFK Airport
              </span>
            </div>
          </div>

          {/* Column 3: Cobertura en Bolivia */}
          <div className="flex flex-col gap-3.5">
            <h4 className="font-title-md font-bold text-surface-container-lowest text-base sm:text-lg">
              Cobertura en Bolivia
            </h4>
            <ul className="space-y-2.5 font-body-sm text-xs sm:text-sm text-surface-variant">
              <li className="flex items-center gap-2">
                <Icon name="check_circle" size={16} className="text-secondary-container shrink-0" />
                <span>La Paz &amp; El Alto (Oficina Sopocachi)</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="check_circle" size={16} className="text-secondary-container shrink-0" />
                <span>Santa Cruz de la Sierra (Equipetrol)</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="check_circle" size={16} className="text-secondary-container shrink-0" />
                <span>Cochabamba (Zona Norte)</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="local_shipping" size={16} className="text-secondary-container shrink-0" />
                <span>Sucre, Tarija, Oruro &amp; Potosí</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Aduana & Entrega Puerta */}
          <div className="flex flex-col justify-between relative">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-white/10 font-headline-sm font-extrabold text-white flex items-center justify-center">
                  04
                </span>
                <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed-dim text-on-tertiary-fixed font-label-md text-xs font-bold shadow-sm">
                  Desde 4 Dic
                </span>
              </div>
              <h4 className="font-headline-sm font-bold text-white text-lg sm:text-xl mb-2">
                Aduana &amp; Entrega Puerta
              </h4>
              <p className="font-body-sm text-xs sm:text-sm text-on-primary-container leading-relaxed">
                Entregas a partir del 4 de Diciembre en Bolivia. Desaduanización ágil sin filas y entrega en Sopocachi/Equipetrol o directo a domicilio.
              </p>
            </div>
            <div className="pt-6 relative z-10 flex items-center gap-2 font-label-md text-xs sm:text-sm text-white font-semibold">
              <Icon name="local_shipping" size={18} className="text-tertiary-fixed-dim" />
              <span>Santa Cruz, La Paz y Cochabamba</span>
            </div>
          </div>

        </div>

        {/* Middle Row: Brand & Quick Navigation */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-navy border border-white/10 flex items-center justify-center text-white shadow-sm">
              <Icon name="local_shipping" size={22} className="text-secondary-fixed" />
            </div>
            <div>
              <span className="font-display font-extrabold text-lg text-white tracking-tight">
                NY2<span className="text-secondary-container">Bolivia</span>
              </span>
              <span className="block text-[11px] text-on-primary-container font-mono tracking-wider uppercase">
                Andean Skyline Logistics Corp.
              </span>
            </div>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 text-xs sm:text-sm text-surface-variant">
            <Link href="#tiendas" className="hover:text-white transition-colors">
              Tiendas Manhattan
            </Link>
            <Link href="#modalidades" className="hover:text-white transition-colors">
              Modalidades
            </Link>
            <Link href="#calculadora" className="hover:text-white transition-colors">
              Calculadora
            </Link>
            <Link href="#cronograma" className="hover:text-white transition-colors">
              Cronograma JFK
            </Link>
            <Link href="#faq" className="hover:text-white transition-colors">
              Preguntas Frecuentes
            </Link>
            <Link
              href="/registro"
              className="font-bold text-tertiary-fixed-dim hover:text-tertiary-fixed transition-colors inline-flex items-center gap-1"
            >
              <span>Pre-Alerta</span>
              <Icon name="arrow_forward" size={14} />
            </Link>
          </nav>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-primary-container">
          <p className="text-center sm:text-left font-sans">
            &copy; {currentYear} NY2Bolivia Cargo &amp; Shopping Express. Todos los derechos reservados.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 font-medium">
            <a
              href="#"
              className="hover:text-surface-container-lowest transition-colors"
            >
              Términos de Servicio
            </a>
            <a
              href="#"
              className="hover:text-surface-container-lowest transition-colors"
            >
              Políticas de Carga
            </a>
            <a
              href="#"
              className="hover:text-surface-container-lowest transition-colors"
            >
              Seguro de Paquetería
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-tertiary-fixed-dim transition-colors flex items-center gap-1"
            >
              <Icon name="chat" size={14} />
              <span>Soporte WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
