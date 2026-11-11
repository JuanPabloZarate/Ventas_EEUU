'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

export interface SuiteCodeModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onAssignCode?: (suiteCode: string) => void;
  onSelectSuite?: (suiteCode: string) => void;
  clientName?: string;
  currentSuite?: string;
}

export function SuiteCodeModal({
  isOpen = true,
  onClose,
  onAssignCode,
  onSelectSuite,
  clientName = '',
  currentSuite = '',
}: SuiteCodeModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const manhattanWarehouse = {
    title: 'Hub Comercial Manhattan (Personal Shopper & Concierge)',
    name: clientName.trim() || '[Tu Nombre Completo]',
    company: 'NY2Bolivia Logistics Hub',
    address1: '350 5th Avenue, Suite NY-HUB',
    city: 'New York',
    state: 'NY',
    zip: '10118',
    phone: '+1 (212) 555-6922',
    fullFormatted: `NY2Bolivia Logistics Hub\nAttn: ${clientName.trim() || '[Tu Nombre Completo]'}\n350 5th Avenue, Suite NY-HUB\nNew York, NY 10118\nUnited States\nTel: +1 (212) 555-6922`,
  };

  const queensWarehouse = {
    title: 'Hub Operativo Queens JFK (Recepción de Carga Aérea)',
    name: clientName.trim() || '[Tu Nombre Completo]',
    company: 'NY2Bolivia JFK Hub',
    address1: '147-39 175th Street, Cargo Bldg',
    city: 'Jamaica',
    state: 'NY',
    zip: '11434',
    phone: '+1 (718) 555-0199',
    fullFormatted: `NY2Bolivia JFK Hub\nAttn: ${clientName.trim() || '[Tu Nombre Completo]'}\n147-39 175th Street, Cargo Bldg\nJamaica, NY 11434\nUnited States\nTel: +1 (718) 555-0199`,
  };

  const handleCopy = async (text: string, key: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
      }
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleGenerateTempSuite = () => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const newCode = `NY-TEMP-${randomDigits}`;
    if (onAssignCode) {
      onAssignCode(newCode);
    } else if (onSelectSuite) {
      onSelectSuite(newCode);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-brand-navy/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Dirección de Almacén en New York"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest text-on-surface rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl border border-outline-variant/40 space-y-6 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-outline-variant/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
              <Icon name="apartment" size={24} className="text-secondary" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-brand-navy">
                Dirección de Almacén en New York
              </h3>
              <p className="font-sans text-xs sm:text-sm text-on-surface-variant">
                Consigna tus compras online en nuestras bodegas autorizadas de New York
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {/* Temporary Suite Generator Banner */}
        <div className="p-4 rounded-xl bg-secondary-fixed/30 border border-secondary/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Icon name="badge" size={24} className="text-secondary shrink-0" />
            <div>
              <span className="font-sans text-sm font-bold text-brand-navy block">
                ¿Aún no tienes un código de Suite?
              </span>
              <span className="font-sans text-xs text-on-surface-variant">
                Genera tu código temporal gratuito para asociar tus paquetes inmediatamente.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleGenerateTempSuite}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-sans text-xs font-bold shrink-0 transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Icon name="auto_awesome" size={16} />
            <span>Asignarme Suite Temporal</span>
          </button>
        </div>

        {/* Address Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Manhattan Hub */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1">
                  <Icon name="location_city" size={16} />
                  Manhattan Hub
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed">
                  Sede Principal
                </span>
              </div>
              <div className="font-mono text-xs text-on-surface space-y-1 bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                <p className="font-bold text-brand-navy">{manhattanWarehouse.company}</p>
                <p className="text-on-surface-variant font-medium">Attn: {manhattanWarehouse.name}</p>
                <p>{manhattanWarehouse.address1}</p>
                <p>{manhattanWarehouse.city}, {manhattanWarehouse.state} {manhattanWarehouse.zip}</p>
                <p className="text-on-surface-variant">Tel: {manhattanWarehouse.phone}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(manhattanWarehouse.fullFormatted, 'manhattan')}
              className="w-full py-2 px-3 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-brand-navy font-sans text-xs font-semibold border border-outline-variant/50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Icon name={copiedKey === 'manhattan' ? 'check' : 'content_copy'} size={16} className={copiedKey === 'manhattan' ? 'text-secondary font-bold' : ''} />
              <span>{copiedKey === 'manhattan' ? '¡Dirección Copiada!' : 'Copiar Dirección Manhattan'}</span>
            </button>
          </div>

          {/* Queens Hub */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1">
                  <Icon name="flight_takeoff" size={16} />
                  Queens JFK Hub
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed">
                  Carga Aérea
                </span>
              </div>
              <div className="font-mono text-xs text-on-surface space-y-1 bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                <p className="font-bold text-brand-navy">{queensWarehouse.company}</p>
                <p className="text-on-surface-variant font-medium">Attn: {queensWarehouse.name}</p>
                <p>{queensWarehouse.address1}</p>
                <p>{queensWarehouse.city}, {queensWarehouse.state} {queensWarehouse.zip}</p>
                <p className="text-on-surface-variant">Tel: {queensWarehouse.phone}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(queensWarehouse.fullFormatted, 'queens')}
              className="w-full py-2 px-3 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-brand-navy font-sans text-xs font-semibold border border-outline-variant/50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Icon name={copiedKey === 'queens' ? 'check' : 'content_copy'} size={16} className={copiedKey === 'queens' ? 'text-secondary font-bold' : ''} />
              <span>{copiedKey === 'queens' ? '¡Dirección Copiada!' : 'Copiar Dirección Queens'}</span>
            </button>
          </div>
        </div>

        {/* Step-by-Step Checkout Guide */}
        <div className="p-4 rounded-xl bg-surface-container-low space-y-2">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-brand-navy flex items-center gap-1.5">
            <Icon name="help" size={18} className="text-secondary" />
            ¿Cómo llenar los campos en Amazon, Apple o eBay?
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-on-surface-variant font-sans">
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold flex items-center justify-center mt-0.5 shrink-0">1</span>
              <span><strong>Full Name:</strong> Tu nombre seguido de tu suite (ej. <em>{clientName || 'Juan Pérez'} - {currentSuite || 'NY-TEMP-8492'}</em>).</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold flex items-center justify-center mt-0.5 shrink-0">2</span>
              <span><strong>Address Line 1:</strong> 350 5th Avenue</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold flex items-center justify-center mt-0.5 shrink-0">3</span>
              <span><strong>Address Line 2:</strong> Suite NY-HUB</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold flex items-center justify-center mt-0.5 shrink-0">4</span>
              <span><strong>City, State &amp; ZIP:</strong> New York, NY 10118</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-brand-navy text-white font-sans text-xs font-bold hover:bg-brand-navy-dark transition-colors cursor-pointer"
          >
            Entendido, volver al formulario
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuiteCodeModal;
