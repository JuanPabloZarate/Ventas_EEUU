'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export interface NavbarProps {
  /** Active anchor section identifier for highlighting */
  activeSection?: string;
  /** Coordinator WhatsApp contact phone number */
  whatsappNumber?: string;
  /** Optional custom container classes */
  className?: string;
}

/**
 * Navbar Component
 *
 * Sticky responsive header providing seamless navigation for desktop viewports
 * (with brand mark, flight route badge, anchor links, and quick CTAs)
 * and an ergonomic mobile app-shell header (with safe-area insets, flight status chip,
 * and mobile slide-out drawer).
 */
export function Navbar({
  activeSection = '',
  whatsappNumber = '59177012345',
  className = '',
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Tiendas Manhattan', href: '#tiendas', icon: 'storefront' },
    { label: 'Modalidades', href: '#modalidades', icon: 'shopping_bag' },
    { label: 'Calculadora', href: '#calculadora', icon: 'calculate' },
    { label: 'Cronograma JFK', href: '#cronograma', icon: 'flight_takeoff' },
    { label: 'Preguntas', href: '#faq', icon: 'help_outline' },
  ];

  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hola NY2Bolivia, deseo información y asesoría para mis compras de Black Friday en New York.'
  )}`;

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe transition-all ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            
            {/* Brand Logo & Logistics Route Badge */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex flex-col group focus:outline-none">
                <div className="flex items-center gap-2">
                  <span className="font-display font-extrabold text-xl tracking-tight text-primary-container leading-none group-hover:opacity-90 transition-opacity">
                    NY2<span className="text-secondary">Bolivia</span>
                  </span>
                  
                  {/* Flight Route Pill */}
                  <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-sans text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <Icon name="local_shipping" size={12} />
                    <span>JFK✈LPB</span>
                  </span>
                </div>
                <span className="text-[10px] text-on-surface-variant font-medium tracking-wide">
                  Cargo &amp; Express • Andean Skyline Logistics
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-secondary ${
                    activeSection === link.href.replace('#', '')
                      ? 'text-secondary font-bold'
                      : 'text-on-surface-variant'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Action Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Flight Active Status Chip */}
              <div className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-sans text-xs font-semibold flex items-center gap-1 shadow-xs">
                <Icon name="bolt" size={14} className="text-secondary animate-pulse" />
                <span className="hidden sm:inline">Vuelo Activo</span>
              </div>

              {/* WhatsApp Coordinator Button (Desktop) */}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                title="Chatear con Asesor en Vivo"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant/60 hover:border-secondary hover:text-secondary text-on-surface-variant text-xs font-semibold transition-colors"
              >
                <Icon name="chat" size={16} className="text-[#25D366]" />
                <span className="hidden md:inline">Asesor en Vivo</span>
              </a>

              {/* Primary Pre-Alerta CTA Button */}
              <Link
                href="/registro"
                className="hidden sm:inline-flex items-center gap-1.5 bg-primary-container hover:bg-black text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Icon name="add_shopping_cart" size={16} className="text-secondary-fixed" />
                <span>Registrar Compra</span>
              </Link>

              {/* Mobile Profile / Pre-Alerta Icon Button */}
              <Link
                href="/registro"
                className="sm:hidden w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-white shadow-sm shrink-0"
                aria-label="Registrar Compra o Pre-Alerta"
              >
                <Icon name="person" size={18} />
              </Link>

              {/* Mobile Drawer Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 text-on-surface-variant hover:text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                aria-label={mobileMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
                aria-expanded={mobileMenuOpen}
              >
                <Icon name={mobileMenuOpen ? 'close' : 'menu'} size={24} />
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Mobile Navigation Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[calc(4rem+env(safe-area-inset-top,0px))] z-40 bg-surface/98 backdrop-blur-2xl border-b border-outline-variant/40 shadow-elevation-3 transition-all animate-fadeIn">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container text-on-surface font-medium text-sm transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon name={link.icon} size={20} className="text-secondary" />
                  <span>{link.label}</span>
                </div>
                <Icon name="chevron_right" size={16} className="text-outline" />
              </Link>
            ))}

            <div className="pt-3 border-t border-outline-variant/30 flex flex-col gap-2">
              <Link
                href="/registro"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-tertiary-fixed-dim text-on-tertiary-fixed font-bold text-sm rounded-xl shadow-md"
              >
                <Icon name="local_fire_department" size={18} />
                <span>Asegurar Mi Cupo ($20 USD)</span>
              </Link>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-surface-container text-on-surface text-sm font-semibold rounded-xl border border-outline-variant/40"
              >
                <Icon name="chat" size={18} className="text-[#25D366]" />
                <span>Hablar con Asesor Boliviano</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
