'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import type { OrderModality, OrderFinancials } from '@/types/order';

export interface SummaryItem {
  id?: string;
  storeName?: string;
  productName?: string;
  quantity: number;
  priceUSD: number;
}

export interface StickySummarySidebarProps {
  modality: OrderModality;
  items: SummaryItem[];
  financials?: OrderFinancials;
  onSubmit: () => void;
  submitting?: boolean;
  isSubmitting?: boolean;
  disabled?: boolean;
  className?: string;
}

export function StickySummarySidebar({
  modality,
  items,
  financials: inputFinancials,
  onSubmit,
  submitting = false,
  isSubmitting = false,
  disabled = false,
  className = '',
}: StickySummarySidebarProps) {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const isPending = submitting || isSubmitting;

  // Real-time calculations
  const totalItemsCount = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  const totalProductUSD = Number(
    items.reduce((sum, item) => sum + (Number(item.priceUSD) || 0) * (Number(item.quantity) || 1), 0).toFixed(2)
  );

  const baseFeeUSD = inputFinancials?.baseFeeUSD ?? 20.00;
  const commissionPercent = inputFinancials?.commissionPercent ?? (modality === 'assisted' ? 8 : 0);
  const commissionUSD = inputFinancials?.commissionUSD ?? Number(((totalProductUSD * commissionPercent) / 100).toFixed(2));
  const totalFeeUSD = inputFinancials?.totalFeeUSD ?? Number((baseFeeUSD + commissionUSD).toFixed(2));
  const exchangeRateBOB = inputFinancials?.exchangeRateBOB ?? 6.96;
  const totalFeeBOB = inputFinancials?.totalFeeBOB ?? Number((totalFeeUSD * exchangeRateBOB).toFixed(2));

  return (
    <aside className={`flex flex-col gap-6 ${className}`}>
      {/* =========================================================================
          DESKTOP & MOBILE IN-PAGE CARD (Clean natural flow & Sticky on Desktop)
          ========================================================================= */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-elevation-1 border border-outline-variant/30 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-secondary block">
              Flete Aéreo JFK • VVI / LPB
            </span>
            <h3 className="font-display font-bold text-xl text-brand-navy">
              Resumen de Registro
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold">
            <Icon name="verified" size={14} className="text-secondary" />
            <span>Campaña Activa</span>
          </span>
        </div>

        {/* Quick Item & Cargo Count */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-surface-container-low text-xs">
          <div>
            <span className="text-on-surface-variant block font-sans">Productos registrados:</span>
            <strong className="text-brand-navy font-display font-bold text-sm">
              {totalItemsCount} {totalItemsCount === 1 ? 'artículo' : 'artículos'}
            </strong>
          </div>
          <div>
            <span className="text-on-surface-variant block font-sans">Total Declarado:</span>
            <strong className="text-brand-navy font-mono font-bold text-sm">
              ${totalProductUSD.toFixed(2)} USD
            </strong>
          </div>
        </div>

        {/* Cost Matrix Breakdown */}
        <div className="space-y-3 text-sm font-sans">
          {modality === 'assisted' ? (
            <>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span className="flex items-center gap-1.5">
                  <Icon name="shopping_bag" size={16} className="text-secondary" />
                  <span>Personal Shopper NYC (8%):</span>
                </span>
                <span className="font-mono font-semibold text-brand-navy">
                  ${commissionUSD.toFixed(2)} USD
                </span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span className="flex items-center gap-1.5">
                  <Icon name="flight_takeoff" size={16} className="text-secondary" />
                  <span>Reserva cupo de vuelo JFK:</span>
                </span>
                <span className="font-mono font-semibold text-brand-navy">
                  ${baseFeeUSD.toFixed(2)} USD
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span className="flex items-center gap-1.5">
                  <Icon name="flight_takeoff" size={16} className="text-secondary" />
                  <span>Anticipo reserva cupo JFK:</span>
                </span>
                <span className="font-mono font-semibold text-brand-navy">
                  ${baseFeeUSD.toFixed(2)} USD
                </span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 leading-snug">
                <strong className="font-bold flex items-center gap-1 text-emerald-900 mb-0.5">
                  <Icon name="check_circle" size={15} className="text-emerald-600" />
                  100% Reembolsable Garantizado
                </strong>
                Los $20 USD se descuentan íntegramente de tu flete aéreo ($9.50/lb) al retirar tu encomienda en Bolivia.
              </div>
            </>
          )}

          {/* Total Fee Box */}
          <div className="border-t border-outline-variant/20 pt-3 flex justify-between items-baseline font-bold">
            <span className="text-brand-navy text-sm sm:text-base">
              {modality === 'assisted' ? 'Total Fee Inicial:' : 'Total Anticipo Reserva:'}
            </span>
            <div className="text-right">
              <div className="font-mono text-xl text-secondary font-extrabold">
                ${totalFeeUSD.toFixed(2)} USD
              </div>
              <div className="font-mono text-xs text-on-surface-variant">
                ({totalFeeBOB.toFixed(2)} BOB @ {exchangeRateBOB})
              </div>
            </div>
          </div>
        </div>

        {/* Included Free Benefits */}
        <div className="border-t border-outline-variant/20 pt-4 space-y-2 text-xs text-on-surface-variant font-sans">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5">
              <Icon name="scale" size={15} className="text-secondary" />
              <span>Flete aéreo internacional:</span>
            </span>
            <span className="font-mono font-semibold text-brand-navy">$9.50 USD / Lb</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5">
              <Icon name="layers" size={15} className="text-secondary" />
              <span>Consolidación multitienda:</span>
            </span>
            <span className="font-bold text-emerald-600 uppercase">GRATIS ($0.00)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5">
              <Icon name="photo_camera" size={15} className="text-secondary" />
              <span>Inspección fotográfica NY:</span>
            </span>
            <span className="font-bold text-emerald-600 uppercase">INCLUIDO ($0.00)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5">
              <Icon name="shield" size={15} className="text-secondary" />
              <span>Seguro total de carga:</span>
            </span>
            <span className="font-semibold text-brand-navy">100% Protegido</span>
          </div>
        </div>

        {/* Timeline Calendar */}
        <div className="p-4 rounded-xl bg-surface-container-low space-y-2.5 text-xs font-sans">
          <span className="font-bold uppercase tracking-wider text-brand-navy flex items-center gap-1.5">
            <Icon name="event" size={16} className="text-brand-gold" />
            <span>Cronograma de Despacho</span>
          </span>
          <div className="space-y-2 text-on-surface-variant">
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary mt-1 shrink-0" />
              <div>
                <strong className="text-brand-navy block font-semibold">23 Nov - 3 Dic</strong>
                <span>Recepción continua en almacén New York</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-gold mt-1 shrink-0" />
              <div>
                <strong className="text-brand-navy block font-semibold">3 de Diciembre (18:00 EST)</strong>
                <span>Cierre de valija y vuelo directo JFK</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
              <div>
                <strong className="text-brand-navy block font-semibold">4 al 8 de Diciembre</strong>
                <span>Entrega en Bolivia (LPB, VVI, CBB, etc.)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="space-y-2.5 pt-1">
          <button
            type="button"
            onClick={onSubmit}
            disabled={disabled || isPending}
            className={`w-full py-4 px-6 rounded-xl font-display font-bold text-base transition-all flex items-center justify-center gap-2.5 shadow-elevation-1 cursor-pointer ${
              disabled || isPending
                ? 'bg-outline-variant/40 text-on-surface-variant cursor-not-allowed'
                : 'bg-brand-gold hover:bg-brand-gold-hover text-brand-navy active:scale-[0.99]'
            }`}
          >
            {isPending ? (
              <>
                <Icon name="progress_activity" size={20} className="animate-spin text-brand-navy" />
                <span>Procesando registro...</span>
              </>
            ) : (
              <>
                <Icon name="task_alt" size={20} className="text-brand-navy" />
                <span>
                  {modality === 'prealert' ? 'Confirmar Pre-Alerta' : 'Confirmar Compra Asistida'}
                </span>
              </>
            )}
          </button>
          <p className="text-[11px] text-center text-on-surface-variant font-sans">
            Recibirás tu número de orden y ticket digital para coordinar el pago QR por WhatsApp.
          </p>
        </div>
      </div>

      {/* Personal Shopper Direct Assistance Card */}
      <div className="bg-primary-container rounded-2xl p-5 text-white space-y-3 shadow-elevation-1 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-gold text-brand-navy flex items-center justify-center font-bold shrink-0">
            <Icon name="chat" size={20} />
          </div>
          <div>
            <span className="font-bold text-sm block leading-tight text-white font-display">¿Dudas con tu compra?</span>
            <span className="text-xs text-secondary-fixed font-sans">Atención directa en New York</span>
          </div>
        </div>
        <p className="text-xs text-surface-variant leading-relaxed font-sans">
          ¿No tienes tarjeta internacional o necesitas validar tallas y stock en New York? Nuestro equipo está en línea.
        </p>
        <a
          href="https://wa.me/59177012345?text=Hola%20NY2Bolivia,%20necesito%20asistencia%20con%20mi%20registro%20de%20paquetes"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-4 rounded-xl bg-secondary hover:bg-secondary-container text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Icon name="forum" size={16} />
          <span>Hablar con Personal Shopper en NY</span>
        </a>
      </div>

      {/* =========================================================================
          MOBILE COMPACT FLOATING BAR (lg:hidden) - positioned right above MobileBottomNav
          ========================================================================= */}
      <div className="lg:hidden fixed bottom-16 inset-x-0 z-40 bg-surface/95 backdrop-blur-xl border-t border-outline-variant/30 px-4 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <button
            type="button"
            onClick={() => setIsMobileExpanded(!isMobileExpanded)}
            className="flex items-center gap-2 text-left cursor-pointer"
          >
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-sm sm:text-base font-extrabold text-secondary">
                  ${totalFeeUSD.toFixed(2)} USD
                </span>
                <span className="text-[11px] font-mono text-on-surface-variant">
                  ({totalFeeBOB.toFixed(2)} Bs)
                </span>
              </div>
              <span className="text-[11px] text-on-surface-variant flex items-center gap-1 font-sans">
                <span>{totalItemsCount} art. • Ver desglose</span>
                <Icon
                  name={isMobileExpanded ? 'expand_more' : 'expand_less'}
                  size={16}
                  className="text-secondary"
                />
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={disabled || isPending}
            className={`py-2.5 px-5 rounded-xl font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer ${
              disabled || isPending
                ? 'bg-outline-variant/40 text-on-surface-variant cursor-not-allowed'
                : 'bg-brand-gold hover:bg-brand-gold-hover text-brand-navy'
            }`}
          >
            {isPending ? (
              <Icon name="progress_activity" size={16} className="animate-spin text-brand-navy" />
            ) : (
              <Icon name="task_alt" size={16} className="text-brand-navy" />
            )}
            <span>Confirmar</span>
          </button>
        </div>

        {/* Expandable Mobile Bottom Sheet Drawer */}
        {isMobileExpanded && (
          <div className="mt-3 pt-3 border-t border-outline-variant/20 space-y-3 max-h-[50vh] overflow-y-auto custom-scrollbar max-w-lg mx-auto">
            <div className="flex justify-between items-center text-xs font-semibold text-brand-navy">
              <span className="font-display font-bold">Desglose Operativo Detallado</span>
              <button
                type="button"
                onClick={() => setIsMobileExpanded(false)}
                className="text-on-surface-variant p-1 cursor-pointer"
                aria-label="Cerrar desglose"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="space-y-2 text-xs text-on-surface-variant font-sans">
              <div className="flex justify-between">
                <span>Total Carga Declarada:</span>
                <span className="font-mono font-bold text-brand-navy">${totalProductUSD.toFixed(2)} USD</span>
              </div>
              {modality === 'assisted' ? (
                <>
                  <div className="flex justify-between">
                    <span>Personal Shopper NYC (8%):</span>
                    <span className="font-mono text-brand-navy">${commissionUSD.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reserva Cupo JFK:</span>
                    <span className="font-mono text-brand-navy">${baseFeeUSD.toFixed(2)} USD</span>
                  </div>
                </>
              ) : (
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-800 text-[11px]">
                  ★ Anticipo de $20 USD deducible 100% de tu flete aéreo ($9.50/lb) al retirar en Bolivia.
                </div>
              )}
              <div className="flex justify-between font-bold text-brand-navy pt-1 border-t border-outline-variant/20">
                <span>Total Fee Inicial:</span>
                <span className="font-mono text-secondary">${totalFeeUSD.toFixed(2)} USD ({totalFeeBOB.toFixed(2)} Bs)</span>
              </div>
            </div>

            {/* Free benefits badges */}
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 font-sans">
              <span className="p-1.5 rounded-lg bg-surface-container-low text-center font-medium">Consolidación $0</span>
              <span className="p-1.5 rounded-lg bg-surface-container-low text-center font-medium">Inspección FAA $0</span>
              <span className="p-1.5 rounded-lg bg-surface-container-low text-center font-medium">Flete $9.50/lb</span>
              <span className="p-1.5 rounded-lg bg-surface-container-low text-center font-medium">Seguro 100%</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default StickySummarySidebar;
