'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export interface ModalitySelectorProps {
  defaultValue?: 'assisted' | 'prealert';
  whatsappPhone?: string;
  showComparisonDetails?: boolean;
  className?: string;
}

export function ModalitySelector({
  defaultValue = 'assisted',
  whatsappPhone = '59177012345',
  className = '',
}: ModalitySelectorProps) {
  const [selectedModality, setSelectedModality] = useState<'assisted' | 'prealert'>(defaultValue);

  const getWhatsAppHref = () => {
    const text = selectedModality === 'assisted'
      ? 'Hola Compras EEUU, me interesa el servicio de Compra Asistida en tiendas físicas de Nueva York.'
      : 'Hola Compras EEUU, deseo registrar mi ticket de compra online para envío a Bolivia.';
    return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="modalidades" className={`w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface-container-low/50 border-b border-outline-variant/20 ${className}`}>
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-secondary-fixed/50 px-3 py-1 rounded-full inline-block">
            Modalidades Simples
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-on-surface">
            ¿Cómo deseas hacer tu compra?
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Dos caminos claros: nosotros compramos por ti en tiendas de EE.UU. o compras tú mismo online y te lo enviamos.
          </p>
        </div>

        {/* 2 Tarjetas Claras */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Opción 1: Compra Asistida */}
          <div
            onClick={() => setSelectedModality('assisted')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer bg-surface flex flex-col justify-between ${
              selectedModality === 'assisted'
                ? 'border-secondary ring-1 ring-secondary shadow-xs'
                : 'border-outline-variant/30 hover:border-outline-variant'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <Icon name="storefront" size={20} />
                </span>
                <span className="text-[11px] font-bold text-secondary bg-secondary-fixed/40 px-2 py-0.5 rounded-full">
                  Personal Shopper
                </span>
              </div>

              <div>
                <h3 className="font-display font-bold text-base text-on-surface">
                  Compra Asistida en Tienda
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  Compramos físicamente por ti en tiendas oficiales de Manhattan (Apple, Best Buy, Nike, Sephora, Coach) o webs de USA.
                </p>
              </div>

              <ul className="text-xs text-on-surface-variant space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <Icon name="check" size={14} className="text-secondary shrink-0" />
                  <span>Pagas en Bolivia en Bs. (6.96) por QR Simple</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" size={14} className="text-secondary shrink-0" />
                  <span>Sin necesidad de tarjeta internacional ni cuenta en USA</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" size={14} className="text-secondary shrink-0" />
                  <span>Comisión fija desde el 8%</span>
                </li>
              </ul>
            </div>

            <div className="pt-5 mt-4 border-t border-outline-variant/20 flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface-variant">Requerir item y fondos</span>
              <Link
                href="/registro?modality=assisted"
                className="px-3.5 py-2 rounded-xl bg-primary-container hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-1"
              >
                <span>Pedir Compra</span>
                <Icon name="arrow_forward" size={13} />
              </Link>
            </div>
          </div>

          {/* Opción 2: Ya compré online */}
          <div
            onClick={() => setSelectedModality('prealert')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer bg-surface flex flex-col justify-between ${
              selectedModality === 'prealert'
                ? 'border-secondary ring-1 ring-secondary shadow-xs'
                : 'border-outline-variant/30 hover:border-outline-variant'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-primary-container/10 text-primary-container flex items-center justify-center">
                  <Icon name="receipt_long" size={20} />
                </span>
                <span className="text-[11px] font-bold text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full">
                  Solo Envío Courier
                </span>
              </div>

              <div>
                <h3 className="font-display font-bold text-base text-on-surface">
                  Ya Compré Online (Ticket/Factura)
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  Si compraste directamente con tu propia tarjeta en Amazon, eBay, Nike o cualquier web, recibimos tus paquetes y los traemos a Bolivia.
                </p>
              </div>

              <ul className="text-xs text-on-surface-variant space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <Icon name="check" size={14} className="text-secondary shrink-0" />
                  <span>Tarifa preferencial de $9.50 USD por libra</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" size={14} className="text-secondary shrink-0" />
                  <span>Adjuntas tu ticket o factura y número de tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" size={14} className="text-secondary shrink-0" />
                  <span>Consolidación $0 en almacén de New York</span>
                </li>
              </ul>
            </div>

            <div className="pt-5 mt-4 border-t border-outline-variant/20 flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface-variant">Solo adjuntar ticket</span>
              <Link
                href="/registro?modality=prealert"
                className="px-3.5 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-bold transition-all flex items-center gap-1 border border-outline-variant/30"
              >
                <span>Registrar Ticket</span>
                <Icon name="arrow_forward" size={13} />
              </Link>
            </div>
          </div>

        </div>

        {/* WhatsApp direct help */}
        <div className="text-center pt-2">
          <a
            href={getWhatsAppHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span>¿Tienes dudas de cuál elegir?</span>
            <span className="text-[#25D366] font-semibold flex items-center gap-1">
              <Icon name="chat" size={13} /> Consultar por WhatsApp
            </span>
          </a>
        </div>

      </div>
    </section>
  );
}

export default ModalitySelector;
