'use client';

import React from 'react';
import { Icon } from '@/components/ui/Icon';
import type { DeliveryMethod } from '@/types/order';

export interface ClientProfileFormProps {
  clientName: string;
  onClientNameChange: (val: string) => void;
  clientPhone: string;
  onClientPhoneChange: (val: string) => void;
  suiteCode?: string;
  onSuiteCodeChange?: (val: string) => void;
  onOpenSuiteModal?: () => void;
  destinationCity: string;
  onDestinationCityChange: (val: string) => void;
  deliveryMethod: DeliveryMethod;
  onDeliveryMethodChange: (val: DeliveryMethod) => void;
  deliveryAddress: string;
  onDeliveryAddressChange: (val: string) => void;
  errors?: Record<string, string>;
  className?: string;
}

export const BOLIVIAN_CITIES = [
  { value: 'Santa Cruz de la Sierra', label: 'Santa Cruz (Equipetrol)' },
  { value: 'La Paz', label: 'La Paz (Sopocachi / Calacoto)' },
  { value: 'Cochabamba', label: 'Cochabamba (Zona Norte)' },
  { value: 'Sucre', label: 'Sucre' },
  { value: 'Tarija', label: 'Tarija' },
  { value: 'Oruro', label: 'Oruro' },
  { value: 'Potosí', label: 'Potosí' },
  { value: 'Beni', label: 'Beni' },
  { value: 'Pando', label: 'Pando' },
];

export function ClientProfileForm({
  clientName,
  onClientNameChange,
  clientPhone,
  onClientPhoneChange,
  suiteCode,
  onSuiteCodeChange,
  onOpenSuiteModal,
  destinationCity,
  onDestinationCityChange,
  deliveryMethod,
  onDeliveryMethodChange,
  deliveryAddress,
  onDeliveryAddressChange,
  errors = {},
  className = '',
}: ClientProfileFormProps) {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/\D/g, '').slice(0, 8);
    onClientPhoneChange(clean);
  };

  return (
    <div className={`bg-surface rounded-2xl p-5 sm:p-6 border border-outline-variant/30 space-y-4 ${className}`}>
      <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
        <span className="w-6 h-6 rounded-md bg-primary-container text-white text-xs font-bold flex items-center justify-center">
          1
        </span>
        <h3 className="font-display font-bold text-sm sm:text-base text-on-surface">
          Datos de Entrega en Bolivia
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label htmlFor="full-name" className="block text-xs font-semibold text-on-surface-variant mb-1">
            Nombre Completo *
          </label>
          <input
            id="full-name"
            type="text"
            value={clientName}
            onChange={(e) => onClientNameChange(e.target.value)}
            placeholder="Ej. Rodrigo Mendoza"
            className={`w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface text-sm focus:outline-none focus:ring-1 transition-all ${
              errors.clientName ? 'ring-1 ring-error' : 'focus:ring-secondary'
            }`}
          />
          {errors.clientName && (
            <p className="text-xs text-error mt-1">{errors.clientName}</p>
          )}
        </div>

        {/* WhatsApp Phone */}
        <div>
          <label htmlFor="phone" className="block text-xs font-semibold text-on-surface-variant mb-1">
            WhatsApp Bolivia *
          </label>
          <div className="flex rounded-lg overflow-hidden bg-surface-container-low">
            <span className="px-3 flex items-center text-xs font-bold text-on-surface-variant bg-surface-container">
              +591
            </span>
            <input
              id="phone"
              type="tel"
              value={clientPhone}
              onChange={handlePhoneChange}
              placeholder="77012345"
              className={`w-full h-10 px-3 bg-transparent text-on-surface text-sm focus:outline-none ${
                errors.clientPhone ? 'ring-1 ring-error' : ''
              }`}
            />
          </div>
          {errors.clientPhone && (
            <p className="text-xs text-error mt-1">{errors.clientPhone}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className="block text-xs font-semibold text-on-surface-variant mb-1">
            Ciudad de Destino
          </label>
          <select
            id="city"
            value={destinationCity}
            onChange={(e) => onDestinationCityChange(e.target.value)}
            className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
          >
            {BOLIVIAN_CITIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Delivery Method */}
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-1">
            Modalidad de Retiro
          </label>
          <div className="grid grid-cols-2 gap-2 h-10">
            <button
              type="button"
              onClick={() => onDeliveryMethodChange('pickup')}
              className={`rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                deliveryMethod === 'pickup'
                  ? 'bg-secondary text-white border-secondary font-bold'
                  : 'bg-surface-container-low text-on-surface-variant border-transparent'
              }`}
            >
              <Icon name="store" size={14} />
              <span>Sucursal ($0)</span>
            </button>
            <button
              type="button"
              onClick={() => onDeliveryMethodChange('delivery')}
              className={`rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                deliveryMethod === 'delivery'
                  ? 'bg-secondary text-white border-secondary font-bold'
                  : 'bg-surface-container-low text-on-surface-variant border-transparent'
              }`}
            >
              <Icon name="local_shipping" size={14} />
              <span>A Domicilio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Address if delivery */}
      {deliveryMethod === 'delivery' && (
        <div className="pt-2">
          <label htmlFor="address" className="block text-xs font-semibold text-on-surface-variant mb-1">
            Dirección en {destinationCity}
          </label>
          <input
            id="address"
            type="text"
            value={deliveryAddress}
            onChange={(e) => onDeliveryAddressChange(e.target.value)}
            placeholder="Ej. Av. San Martín #450, Barrio Equipetrol"
            className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
          />
        </div>
      )}
    </div>
  );
}
