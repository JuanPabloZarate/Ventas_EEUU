'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import type { Order } from '@/types/order';

export interface OrderSuccessModalProps {
  order: Order | null;
  isOpen?: boolean;
  onClose: () => void;
  onResetForm?: () => void;
}

export function OrderSuccessModal({
  order,
  isOpen = true,
  onClose,
  onResetForm,
}: OrderSuccessModalProps) {
  const [copiedId, setCopiedId] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'qr'>('summary');

  if (!isOpen || !order) return null;

  const handleCopyOrderId = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(order.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    }
  };

  const handleDownloadReceipt = () => {
    const textContent = `
======================================================
  NY2BOLIVIA EXPRESS - ANDEAN SKYLINE LOGISTICS
  COMPROBANTE OFICIAL DE REGISTRO & PRE-ALERTA
======================================================
Número de Orden:    ${order.id}
Fecha de Registro:  ${new Date(order.createdAt).toLocaleString('es-BO')}
Modalidad:          ${order.modality === 'prealert' ? 'Casillero NY (Pre-Alerta)' : 'Compra Asistida (Personal Shopper)'}
Suite Asignada:     ${order.suiteCode}
Estado:             ${order.status.toUpperCase()}

DATOS DEL CLIENTE:
------------------------------------------------------
Nombre Completo:    ${order.clientName}
WhatsApp:           +${order.clientPhone}
Ciudad Destino:     ${order.destinationCity}
Método de Entrega:  ${order.deliveryMethod === 'pickup' ? 'Recojo en Sucursal Central' : 'Entrega a Domicilio'}
${order.deliveryAddress ? `Dirección Entrega:  ${order.deliveryAddress}` : ''}

ARTÍCULOS REGISTRADOS (${order.items.length}):
------------------------------------------------------
${order.items
  .map(
    (item, idx) =>
      `${idx + 1}. ${item.productName} [${item.storeName}]
   Cant: ${item.quantity} | Unit: $${item.priceUSD.toFixed(2)} USD | Total: $${(item.quantity * item.priceUSD).toFixed(2)} USD
   ${item.trackingUSA ? `Tracking USA: ${item.trackingUSA}` : ''}`
  )
  .join('\n\n')}

DESGLOSE FINANCIERO:
------------------------------------------------------
Total Carga Declarada:        $${order.financials.totalProductUSD.toFixed(2)} USD
Comisión Servicio (${order.financials.commissionPercent}%):       $${order.financials.commissionUSD.toFixed(2)} USD
Reserva Cupo Vuelo JFK:       $${order.financials.baseFeeUSD.toFixed(2)} USD
TOTAL FEE INICIAL A PAGAR:    $${order.financials.totalFeeUSD.toFixed(2)} USD (${order.financials.totalFeeBOB.toFixed(2)} Bs @ ${order.financials.exchangeRateBOB})

INSTRUCCIONES DE PAGO QR SIMPLE:
------------------------------------------------------
Monto a Transferir:   ${order.financials.totalFeeBOB.toFixed(2)} Bs
Glosa Obligatoria:    ${order.id}
Titular:              Andean Skyline Logistics S.R.L.
Banco:                Banco BCP / BNB / Banco Unión

CRONOGRAMA DE VUELO:
------------------------------------------------------
Recepción New York:   23 Nov - 3 Dic 2026
Cierre Valija JFK:    3 de Diciembre 2026 (18:00 EST)
Llegada a Bolivia:    4 al 8 de Diciembre 2026
Flete Internacional:  $9.50 USD / Lb cancelado a la entrega
${order.modality === 'prealert' ? '(* Los $20 USD de reserva se descontarán íntegramente de este flete)' : ''}
======================================================
`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Comprobante_${order.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // WhatsApp formatted coordination link
  const whatsAppMessage = `Hola NY2Bolivia, acabo de registrar mi orden *${order.id}* vía web.\n` +
    `👤 *Cliente:* ${order.clientName}\n` +
    `📦 *Modalidad:* ${order.modality === 'prealert' ? 'Pre-Alerta (Casillero NY)' : 'Compra Asistida'}\n` +
    `📍 *Destino:* ${order.destinationCity}\n` +
    `💵 *Total Fee Inicial:* $${order.financials.totalFeeUSD.toFixed(2)} USD (${order.financials.totalFeeBOB.toFixed(2)} Bs)\n\n` +
    `Adjunto comprobante QR para activar la reserva de mi cupo en el vuelo JFK Directo.`;

  const whatsAppUrl = `https://wa.me/59177012345?text=${encodeURIComponent(whatsAppMessage)}`;

  return (
    <div
      className="fixed inset-0 z-50 bg-brand-navy/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-surface-container-lowest rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-outline-variant/30 space-y-6 my-8 text-on-surface">
        {/* Header Icon & Title */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <Icon name="check_circle" size={36} />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-secondary block">
            ¡Registro Confirmado • Black Friday 2026!
          </span>
          <h2 id="modal-title" className="font-display font-extrabold text-2xl sm:text-3xl text-brand-navy">
            Orden #{order.id}
          </h2>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto font-sans">
            Tu encomienda está agendada con prioridad para el vuelo directo JFK-Bolivia.
          </p>
        </div>

        {/* Copy Order ID Bar */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-on-surface-variant font-sans">Código de seguimiento:</span>
            <strong className="font-mono font-bold text-brand-navy text-sm">{order.id}</strong>
          </div>
          <button
            type="button"
            onClick={handleCopyOrderId}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-highest hover:bg-outline-variant/40 text-brand-navy font-semibold transition-colors cursor-pointer"
          >
            <Icon name={copiedId ? 'check' : 'content_copy'} size={16} className={copiedId ? 'text-emerald-600' : 'text-secondary'} />
            <span>{copiedId ? '¡Copiado!' : 'Copiar'}</span>
          </button>
        </div>

        {/* View Switcher Tabs: Resumen vs Pago QR Simple */}
        <div className="flex rounded-xl bg-surface-container-low p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'summary'
                ? 'bg-surface-container-lowest text-brand-navy shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Icon name="receipt_long" size={16} />
            <span>Resumen del Pedido</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'qr'
                ? 'bg-surface-container-lowest text-brand-navy shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Icon name="qr_code_2" size={16} />
            <span>Pago QR Simple ({order.financials.totalFeeBOB.toFixed(2)} Bs)</span>
          </button>
        </div>

        {/* TAB 1: ORDER SUMMARY */}
        {activeTab === 'summary' && (
          <div className="space-y-4">
            {/* Client & Shipping Metadata */}
            <div className="p-4 rounded-2xl bg-surface-container-low text-xs space-y-2 border border-outline-variant/20 font-sans">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Cliente:</span>
                <strong className="text-brand-navy font-semibold">{order.clientName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">WhatsApp:</span>
                <span className="font-mono font-medium text-brand-navy">+{order.clientPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Destino:</span>
                <span className="font-semibold text-brand-navy">{order.destinationCity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Modalidad:</span>
                <span className="font-semibold text-secondary">
                  {order.modality === 'prealert' ? 'Casillero NY (Pre-Alerta)' : 'Compra Asistida'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Suite Asignada:</span>
                <span className="font-mono font-bold text-brand-navy">{order.suiteCode}</span>
              </div>
              {order.deliveryAddress && (
                <div className="flex justify-between pt-1 border-t border-outline-variant/20">
                  <span className="text-on-surface-variant">Dirección entrega:</span>
                  <span className="text-brand-navy font-medium text-right max-w-[200px] truncate">{order.deliveryAddress}</span>
                </div>
              )}
            </div>

            {/* Items List Snapshot */}
            <div className="p-4 rounded-2xl bg-surface-container-low text-xs space-y-2.5 border border-outline-variant/20 font-sans">
              <span className="font-bold uppercase tracking-wider text-brand-navy block">
                Artículos Registrados ({order.items.length})
              </span>
              <div className="space-y-2 max-h-36 overflow-y-auto custom-scrollbar pr-1">
                {order.items.map((item, index) => (
                  <div key={item.id || index} className="flex justify-between items-start text-xs pb-1.5 border-b border-outline-variant/20 last:border-0 last:pb-0">
                    <div>
                      <div className="font-semibold text-brand-navy">{item.productName}</div>
                      <div className="text-[11px] text-on-surface-variant">
                        {item.storeName} • Cant: {item.quantity}
                      </div>
                      {item.trackingUSA && (
                        <div className="font-mono text-[10px] text-secondary">
                          Tracking: {item.trackingUSA}
                        </div>
                      )}
                    </div>
                    <span className="font-mono font-semibold text-brand-navy">
                      ${(item.priceUSD * item.quantity).toFixed(2)} USD
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financials Breakdown */}
            <div className="p-4 rounded-2xl bg-brand-navy text-white text-xs space-y-2 shadow-sm font-sans">
              <div className="flex justify-between text-surface-variant">
                <span>Total Carga Declarada:</span>
                <span className="font-mono font-bold text-white">${order.financials.totalProductUSD.toFixed(2)} USD</span>
              </div>
              {order.modality === 'assisted' ? (
                <>
                  <div className="flex justify-between text-surface-variant">
                    <span>Comisión Personal Shopper ({order.financials.commissionPercent}%):</span>
                    <span className="font-mono">${order.financials.commissionUSD.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between text-surface-variant">
                    <span>Reserva Cupo Vuelo JFK:</span>
                    <span className="font-mono">${order.financials.baseFeeUSD.toFixed(2)} USD</span>
                  </div>
                </>
              ) : (
                <div className="text-[11px] text-secondary-fixed bg-white/10 p-2 rounded-lg">
                  ★ Anticipo de $20 USD 100% deducible de tu flete aéreo internacional ($9.50/lb).
                </div>
              )}
              <div className="flex justify-between items-baseline pt-2 border-t border-white/20 font-bold">
                <span className="text-white text-sm">Total Fee Inicial:</span>
                <div className="text-right">
                  <span className="font-mono text-base text-brand-gold font-extrabold">
                    ${order.financials.totalFeeUSD.toFixed(2)} USD
                  </span>
                  <span className="block font-mono text-[11px] text-surface-variant">
                    ({order.financials.totalFeeBOB.toFixed(2)} BOB)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PAGO QR SIMPLE BOLIVIANOS */}
        {activeTab === 'qr' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-center space-y-3 font-sans">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-secondary block">
                Pago Interoperable QR Simple (Bolivia)
              </span>

              {/* High-fidelity Vector QR Visual */}
              <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl border-2 border-brand-navy/20 shadow-md flex flex-col items-center justify-center relative">
                <div className="w-full h-full border border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center p-2 bg-slate-50">
                  <Icon name="qr_code_2" size={80} className="text-brand-navy" />
                  <span className="font-mono text-[10px] font-bold text-secondary uppercase mt-1">
                    QR Simple • BCP / BNB
                  </span>
                  <span className="font-mono text-[11px] font-extrabold text-brand-navy">
                    Bs {order.financials.totalFeeBOB.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment Details */}
              <div className="grid grid-cols-2 gap-2 text-left text-xs bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/20">
                <div>
                  <span className="text-on-surface-variant text-[11px] block">Monto exacto:</span>
                  <strong className="font-mono font-bold text-brand-navy text-sm">
                    {order.financials.totalFeeBOB.toFixed(2)} Bs
                  </strong>
                </div>
                <div>
                  <span className="text-on-surface-variant text-[11px] block">Glosa obligatoria:</span>
                  <strong className="font-mono font-bold text-secondary text-sm">
                    {order.id}
                  </strong>
                </div>
                <div className="col-span-2 pt-1 border-t border-outline-variant/10 text-[11px] text-on-surface-variant">
                  <span>Titular: </span>
                  <strong className="text-brand-navy">Andean Skyline Logistics S.R.L.</strong>
                  <span className="block text-[10px]">Acepta BCP, BNB, Banco Unión, Mercantil, Bisa y Cooperativas.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="space-y-3 pt-2 font-sans">
          {/* WhatsApp Direct Confirmation Button */}
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Icon name="chat" size={20} />
            <span>Coordinar Pago QR por WhatsApp (+591)</span>
          </a>

          {/* Secondary Actions: Download Receipt & Reset */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handleDownloadReceipt}
              className="flex-1 py-2.5 px-4 rounded-xl border border-outline-variant/60 hover:bg-surface-container-low text-brand-navy font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Icon name="download" size={16} className="text-secondary" />
              <span>Descargar Comprobante</span>
            </button>

            {onResetForm && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onResetForm();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl border border-outline-variant/60 hover:bg-surface-container-low text-brand-navy font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Icon name="add" size={16} className="text-brand-navy" />
                <span>Registrar Otro Paquete</span>
              </button>
            )}
          </div>

          <div className="flex justify-between items-center text-xs text-on-surface-variant pt-2 border-t border-outline-variant/20">
            <Link href="/" className="hover:text-secondary transition-colors flex items-center gap-1">
              <Icon name="arrow_back" size={14} />
              <span>Volver a Inicio</span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="hover:underline text-on-surface-variant cursor-pointer"
            >
              Cerrar ventana
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessModal;
