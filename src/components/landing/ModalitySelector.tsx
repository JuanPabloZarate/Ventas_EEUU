'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export type ModalityType = 'assisted' | 'prealert';

export interface ModalitySelectorProps {
  value?: ModalityType;
  defaultValue?: ModalityType;
  onChange?: (modality: ModalityType) => void;
  whatsappPhone?: string;
  className?: string;
  showComparisonDetails?: boolean;
}

export function ModalitySelector({
  value,
  defaultValue = 'assisted',
  onChange,
  whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_PHONE || '59177012345',
  className = '',
  showComparisonDetails = true,
}: ModalitySelectorProps) {
  const [internalState, setInternalState] = useState<ModalityType>(defaultValue);
  const selectedModality = value !== undefined ? value : internalState;

  const handleSelect = (modality: ModalityType) => {
    if (value === undefined) {
      setInternalState(modality);
    }
    onChange?.(modality);
  };

  const getWhatsAppAssistedUrl = () => {
    const text = 'Hola NY2Bolivia, deseo solicitar la Compra Asistida para Black Friday (ustedes compran por mí en New York). Deseo cotizar unos artículos.';
    return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="modalidades" className={`w-full py-16 px-4 sm:px-6 lg:px-12 bg-surface ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="font-mono text-xs text-secondary font-bold uppercase tracking-wider bg-secondary-fixed/50 px-3 py-1 rounded-full inline-block mb-2">
            Flexibilidad Total
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-on-surface tracking-tight">
            Elige cómo quieres hacer tus compras
          </h2>
          <p className="font-sans text-sm sm:text-base text-on-surface-variant mt-2 leading-relaxed">
            Te damos dos modalidades para aprovechar el Black Friday de New York sin trabas ni complicaciones:
            nosotros compramos por ti o tú compras directamente con tu Casillero NY.
          </p>
        </div>

        {/* ======================================================================
            Mobile Viewport: Interactive Touch Radio Cards ( < md )
            Directly derived from ny2bolivia_black_friday_m_vil
            ====================================================================== */}
        <div className="md:hidden flex flex-col gap-3">
          {/* Option 1: Compra Asistida */}
          <label
            onClick={() => handleSelect('assisted')}
            className="cursor-pointer block"
          >
            <input
              type="radio"
              name="modalidad_compra_mobile"
              value="assisted"
              checked={selectedModality === 'assisted'}
              onChange={() => handleSelect('assisted')}
              className="peer sr-only"
            />
            <div
              className={`p-4 rounded-2xl bg-surface-container-lowest transition-all duration-200 border-2 flex flex-col gap-2.5 ${
                selectedModality === 'assisted'
                  ? 'border-brand-navy bg-secondary-fixed/20 shadow-elevation-2'
                  : 'border-outline-variant/30 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-tertiary-fixed-dim/20 text-brand-navy flex items-center justify-center">
                    <Icon name="shopping_cart_checkout" size={22} className="text-brand-navy" />
                  </div>
                  <div>
                    <span className="font-display font-bold text-base text-on-surface block">
                      1. Nosotros Compramos Por Ti
                    </span>
                    <span className="font-sans text-xs text-secondary font-semibold">
                      Compra Asistida Sin Tarjeta USA
                    </span>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    selectedModality === 'assisted'
                      ? 'bg-brand-navy text-white'
                      : 'bg-surface-container-high text-transparent'
                  }`}
                >
                  <Icon name="check" size={16} />
                </div>
              </div>

              <p className="font-sans text-xs text-on-surface-variant pl-1 leading-relaxed">
                Solo nos envías el enlace o foto del producto en New York. Tú pagas cómodamente en Bolivia mediante <strong>QR Simple</strong> o <strong>Transferencia Bancaria</strong> en moneda nacional (tasa 6.96 Bs/USD).
              </p>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="inline-flex items-center gap-1 text-[11px] text-on-surface font-medium bg-surface-container px-2 py-0.5 rounded">
                  <Icon name="qr_code_2" size={14} className="text-secondary" />
                  Pago QR Simple
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-on-surface font-medium bg-surface-container px-2 py-0.5 rounded">
                  <Icon name="account_balance" size={14} className="text-secondary" />
                  Cero Comisión Extra
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-brand-navy font-bold bg-tertiary-fixed/40 px-2 py-0.5 rounded">
                  Comisión desde 8%
                </span>
              </div>

              <div className="mt-2 pt-2 border-t border-outline-variant/20 flex gap-2">
                <a
                  href={getWhatsAppAssistedUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-secondary text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Icon name="chat" size={16} />
                  <span>Pedir Cotización WhatsApp</span>
                </a>
                <Link
                  href="/registro?modality=assisted"
                  className="py-2.5 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center justify-center gap-1"
                >
                  <span>Formulario</span>
                  <Icon name="arrow_forward" size={14} />
                </Link>
              </div>
            </div>
          </label>

          {/* Option 2: Casillero Suite New York */}
          <label
            onClick={() => handleSelect('prealert')}
            className="cursor-pointer block"
          >
            <input
              type="radio"
              name="modalidad_compra_mobile"
              value="prealert"
              checked={selectedModality === 'prealert'}
              onChange={() => handleSelect('prealert')}
              className="peer sr-only"
            />
            <div
              className={`p-4 rounded-2xl bg-surface-container-lowest transition-all duration-200 border-2 flex flex-col gap-2.5 ${
                selectedModality === 'prealert'
                  ? 'border-brand-navy bg-secondary-fixed/20 shadow-elevation-2'
                  : 'border-outline-variant/30 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                    <Icon name="markunread_mailbox" size={22} className="text-secondary" />
                  </div>
                  <div>
                    <span className="font-display font-bold text-base text-on-surface block">
                      2. Tú Compras con tu Casillero NY
                    </span>
                    <span className="font-sans text-xs text-on-tertiary-container font-semibold">
                      Suite New York Personalizada
                    </span>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    selectedModality === 'prealert'
                      ? 'bg-brand-navy text-white'
                      : 'bg-surface-container-high text-transparent'
                  }`}
                >
                  <Icon name="check" size={16} />
                </div>
              </div>

              <p className="font-sans text-xs text-on-surface-variant pl-1 leading-relaxed">
                Te asignamos tu dirección exclusiva en Queens, New York para tus compras directas en Amazon, Apple o Nike. Reserva tu espacio de vuelo por solo <strong>$20 USD</strong> (reembolsables en flete).
              </p>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="inline-flex items-center gap-1 text-[11px] text-on-surface font-medium bg-surface-container px-2 py-0.5 rounded">
                  <Icon name="apartment" size={14} className="text-tertiary-fixed-dim" />
                  Dirección Queens / JFK
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-on-surface font-medium bg-surface-container px-2 py-0.5 rounded">
                  <Icon name="verified" size={14} className="text-tertiary-fixed-dim" />
                  Despacho Prioritario
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-secondary font-bold bg-secondary-fixed/60 px-2 py-0.5 rounded">
                  Consolidación $0
                </span>
              </div>

              <div className="mt-2 pt-2 border-t border-outline-variant/20 flex gap-2">
                <Link
                  href="/registro?modality=prealert"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-brand-navy hover:bg-black text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Icon name="inventory_2" size={16} />
                  <span>Obtener mi Casillero NY ($20)</span>
                </Link>
                <Link
                  href="/registro?modality=prealert"
                  className="py-2.5 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center justify-center gap-1"
                >
                  <span>Cupo</span>
                  <Icon name="arrow_forward" size={14} />
                </Link>
              </div>
            </div>
          </label>
        </div>

        {/* ======================================================================
            Desktop Viewport: Side-by-Side Comparative Cards ( >= md )
            Directly derived from ny2bolivia_black_friday_versi_n_ultra_vendedora
            ====================================================================== */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Option 1: Personal Shopper / Compra Asistida */}
          <div
            onClick={() => handleSelect('assisted')}
            className={`cursor-pointer bg-surface-container-lowest rounded-3xl p-8 shadow-elevation-1 hover:shadow-elevation-3 transition-all duration-300 flex flex-col justify-between gap-6 border-2 relative group ${
              selectedModality === 'assisted'
                ? 'border-secondary ring-4 ring-secondary/10'
                : 'border-outline-variant/30 hover:border-secondary/40'
            }`}
          >
            {selectedModality === 'assisted' && (
              <span className="absolute -top-3.5 right-6 bg-secondary text-white font-mono text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                <Icon name="check_circle" size={14} />
                <span>Modalidad Activa</span>
              </span>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-tertiary-fixed-dim/20 text-on-tertiary-container flex items-center justify-center shadow-sm">
                  <Icon name="shopping_bag" size={30} className="text-brand-navy" />
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-surface-container-low font-mono text-xs font-bold text-on-surface border border-outline-variant/30">
                  Comisión base: $20 + 8%
                </span>
              </div>

              <div>
                <h3 className="font-display font-extrabold text-2xl text-on-surface">
                  1. Nosotros Compramos Por Ti
                </h3>
                <span className="text-xs font-mono font-bold text-secondary uppercase tracking-wider block mt-0.5">
                  Personal Shopper Manhattan
                </span>
              </div>

              <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                ¿No tienes tarjeta de crédito internacional o buscas artículos de tiendas físicas exclusivas en 5th Ave?
                Envíanos los enlaces o fotos de lo que deseas; nuestro equipo en Manhattan lo compra, inspecciona y empaca para ti.
              </p>

              {/* Feature Highlights */}
              <ul className="space-y-3 font-sans text-xs text-on-surface-variant pt-2 border-t border-outline-variant/20">
                <li className="flex items-start gap-2.5">
                  <Icon name="check_circle" size={18} className="text-secondary shrink-0 mt-0.5" />
                  <span>
                    <strong>Pagas todo en Bolivia</strong> por QR Simple o transferencia bancaria en moneda local (tasa 6.96 Bs/USD).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Icon name="check_circle" size={18} className="text-secondary shrink-0 mt-0.5" />
                  <span>
                    <strong>Compras presenciales</strong> en tiendas físicas de Manhattan (5th Avenue, Soho, Herald Square).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Icon name="check_circle" size={18} className="text-secondary shrink-0 mt-0.5" />
                  <span>
                    <strong>Verificación de producto e inspección fotográfica</strong> de báscula antes de volar a Bolivia ($0 costo).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Icon name="check_circle" size={18} className="text-secondary shrink-0 mt-0.5" />
                  <span>
                    <strong>Cotización previa garantizada:</strong> sabes exactamente el costo total antes de realizar cualquier pago.
                  </span>
                </li>
              </ul>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2.5 pt-4 border-t border-outline-variant/30">
              <a
                href={getWhatsAppAssistedUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-3.5 px-4 rounded-xl bg-secondary hover:bg-brand-blue-dark text-white font-display font-bold text-sm shadow transition-transform hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                <Icon name="chat" size={18} />
                <span>Solicitar Compra Asistida en WhatsApp</span>
              </a>

              <Link
                href="/registro?modality=assisted"
                className="w-full text-center py-2.5 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-sans text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Llenar Solicitud de Compra en Línea</span>
                <Icon name="arrow_forward" size={14} />
              </Link>
            </div>
          </div>

          {/* Option 2: Casillero / NY Suite */}
          <div
            onClick={() => handleSelect('prealert')}
            className={`cursor-pointer bg-surface-container-lowest rounded-3xl p-8 shadow-elevation-1 hover:shadow-elevation-3 transition-all duration-300 flex flex-col justify-between gap-6 border-2 relative group ${
              selectedModality === 'prealert'
                ? 'border-brand-navy ring-4 ring-brand-navy/10'
                : 'border-outline-variant/30 hover:border-brand-navy/40'
            }`}
          >
            {selectedModality === 'prealert' && (
              <span className="absolute -top-3.5 right-6 bg-brand-navy text-white font-mono text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                <Icon name="check_circle" size={14} />
                <span>Modalidad Activa</span>
              </span>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shadow-sm">
                  <Icon name="markunread_mailbox" size={30} className="text-secondary" />
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-mono text-xs font-bold border border-tertiary-fixed-dim/40">
                  Reserva Cupo: $20 USD
                </span>
              </div>

              <div>
                <h3 className="font-display font-extrabold text-2xl text-on-surface">
                  2. Tú Compras con tu Casillero NY
                </h3>
                <span className="text-xs font-mono font-bold text-brand-navy uppercase tracking-wider block mt-0.5">
                  Suite New York Certificada
                </span>
              </div>

              <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                Si ya tienes tus tarjetas de crédito y cuentas de Amazon, Apple, Nike o eBay listas, te asignamos tu <strong>Suite New York</strong> personal.
                Envías tus pedidos a nuestra dirección en Queens y nosotros los volamos express a Bolivia.
              </p>

              {/* Feature Highlights */}
              <ul className="space-y-3 font-sans text-xs text-on-surface-variant pt-2 border-t border-outline-variant/20">
                <li className="flex items-start gap-2.5">
                  <Icon name="check_circle" size={18} className="text-secondary shrink-0 mt-0.5" />
                  <span>
                    <strong>Reserva de espacio prioritario</strong> por solo $20 USD (100% deducibles de tu flete final).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Icon name="check_circle" size={18} className="text-secondary shrink-0 mt-0.5" />
                  <span>
                    <strong>Consolidación ilimitada:</strong> compra en múltiples tiendas y unifica tus paquetes en una sola caja sin cobro extra ($0).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Icon name="check_circle" size={18} className="text-secondary shrink-0 mt-0.5" />
                  <span>
                    <strong>Entregas directas en Bolivia:</strong> retiro en oficina (La Paz, Santa Cruz, Cochabamba) o delivery puerta a puerta.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Icon name="check_circle" size={18} className="text-secondary shrink-0 mt-0.5" />
                  <span>
                    <strong>Vuelo directo JFK garantizado:</strong> salida inmediata el 3 de Diciembre con entrega desde el 4 de Diciembre.
                  </span>
                </li>
              </ul>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2.5 pt-4 border-t border-outline-variant/30">
              <Link
                href="/registro?modality=prealert"
                className="w-full text-center py-3.5 px-4 rounded-xl bg-brand-navy hover:bg-black text-white font-display font-bold text-sm shadow transition-transform hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                <Icon name="inventory_2" size={18} />
                <span>Obtener mi Casillero NY ($20)</span>
              </Link>

              <Link
                href="/registro?modality=prealert"
                className="w-full text-center py-2.5 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-sans text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Apartar Cupo Rápido</span>
                <Icon name="arrow_forward" size={14} />
              </Link>
            </div>
          </div>

        </div>

        {/* Transparency Footnote */}
        {showComparisonDetails && (
          <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant font-sans">
            <div className="flex items-center gap-3">
              <Icon name="shield" size={20} className="text-secondary shrink-0" />
              <span>
                <strong>Garantía de Satisfacción:</strong> Si algún paquete no llega antes del 24 de Diciembre, te reembolsamos el 100% del flete del servicio.
              </span>
            </div>
            <span className="font-mono text-secondary font-bold whitespace-nowrap">
              Vuelo JFK ✈ Bolivia
            </span>
          </div>
        )}

      </div>
    </section>
  );
}

export default ModalitySelector;
