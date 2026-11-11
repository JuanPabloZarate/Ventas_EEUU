'use client';

import React from 'react';
import { Icon } from '@/components/ui/Icon';
import type { DeliveryMethod } from '@/types/order';

export interface ClientProfileFormProps {
  clientName: string;
  onClientNameChange: (val: string) => void;
  clientPhone: string;
  onClientPhoneChange: (val: string) => void;
  suiteCode: string;
  onSuiteCodeChange: (val: string) => void;
  onOpenSuiteModal: () => void;
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
  { value: 'Santa Cruz de la Sierra', label: 'Santa Cruz de la Sierra (Equipetrol / Urbarí)' },
  { value: 'La Paz', label: 'La Paz (Sopocachi / Calacoto / El Alto)' },
  { value: 'Cochabamba', label: 'Cochabamba (Zona Norte / Recoleta)' },
  { value: 'Sucre', label: 'Sucre (Envío Prioritario)' },
  { value: 'Tarija', label: 'Tarija (Envío Interprovincial)' },
  { value: 'Oruro', label: 'Oruro (Punto Enlace Central)' },
  { value: 'Potosí', label: 'Potosí (Envío Prioritario)' },
  { value: 'Beni', label: 'Beni (Trinidad / Enlace Aéreo)' },
  { value: 'Pando', label: 'Pando (Cobija / Enlace Especial)' },
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
    // Only allow digits, max 8 digits for Bolivia mobile numbers
    const clean = e.target.value.replace(/\D/g, '').slice(0, 8);
    onClientPhoneChange(clean);
  };

  return (
    <div className={`bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-primary-container text-white font-display font-bold flex items-center justify-center text-sm shadow-xs">
            1
          </span>
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold text-brand-navy">
              Datos del Destinatario y Entrega en Bolivia
            </h3>
            <p className="font-sans text-xs sm:text-sm text-on-surface-variant">
              Información del titular para recepción de valija y avisos de aduana
            </p>
          </div>
        </div>
        <Icon name="contact_mail" size={24} className="text-secondary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="full-name" className="font-sans text-xs font-bold uppercase tracking-wider text-brand-navy">
            Nombre Completo del Titular *
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-on-surface-variant">
              <Icon name="person" size={20} />
            </span>
            <input
              id="full-name"
              type="text"
              value={clientName}
              onChange={(e) => onClientNameChange(e.target.value)}
              placeholder="Ej. Rodrigo Mendoza Morales"
              className={`w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-low text-on-surface font-sans text-sm focus:outline-none focus:ring-2 placeholder:text-outline transition-all ${
                errors.clientName ? 'ring-2 ring-error bg-error-container/20' : 'focus:ring-secondary'
              }`}
            />
          </div>
          {errors.clientName && (
            <span className="text-xs text-error font-medium">{errors.clientName}</span>
          )}
        </div>

        {/* WhatsApp Phone */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="client-phone" className="font-sans text-xs font-bold uppercase tracking-wider text-brand-navy">
            WhatsApp para Notificaciones de Vuelo *
          </label>
          <div className="flex">
            <span className="inline-flex items-center gap-1 px-3.5 rounded-l-xl bg-surface-container-high text-on-surface font-mono text-xs font-bold border-r border-outline-variant/40">
              <Icon name="chat" size={16} className="text-secondary" />
              +591
            </span>
            <input
              id="client-phone"
              type="tel"
              value={clientPhone}
              onChange={handlePhoneChange}
              placeholder="77012345"
              maxLength={8}
              className={`w-full h-12 px-4 rounded-r-xl bg-surface-container-low text-on-surface font-mono text-sm focus:outline-none focus:ring-2 placeholder:text-outline transition-all ${
                errors.clientPhone ? 'ring-2 ring-error bg-error-container/20' : 'focus:ring-secondary'
              }`}
            />
          </div>
          {errors.clientPhone ? (
            <span className="text-xs text-error font-medium">{errors.clientPhone}</span>
          ) : (
            <span className="text-[11px] text-on-surface-variant font-medium">
              Número de 8 dígitos de Bolivia sin el código de país.
            </span>
          )}
        </div>

        {/* Suite / Casillero Code */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="suite-code" className="font-sans text-xs font-bold uppercase tracking-wider text-brand-navy">
              Código de Suite New York / Casillero NY
            </label>
            <button
              type="button"
              onClick={onOpenSuiteModal}
              className="text-xs text-secondary font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <Icon name="apartment" size={14} />
              Aún no tengo / Ver Dirección
            </button>
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-on-surface-variant">
              <Icon name="markunread_mailbox" size={20} />
            </span>
            <input
              id="suite-code"
              type="text"
              value={suiteCode}
              onChange={(e) => onSuiteCodeChange(e.target.value.toUpperCase())}
              placeholder="Ej. NY-BOL-8492 o NY-TEMP-XXXX"
              className="w-full h-12 pl-11 pr-24 rounded-xl bg-surface-container-low text-on-surface font-mono text-sm uppercase focus:outline-none focus:ring-2 focus:ring-secondary placeholder:text-outline transition-all"
            />
            {suiteCode ? (
              <span className="absolute right-2.5 top-2.5 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold">
                Asignada
              </span>
            ) : (
              <button
                type="button"
                onClick={onOpenSuiteModal}
                className="absolute right-2.5 top-2.5 text-[11px] font-bold text-secondary bg-secondary-fixed/80 hover:bg-secondary-fixed px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Generar
              </button>
            )}
          </div>
          <span className="text-[11px] text-on-surface-variant">
            Si no posees casillero, haz clic en &quot;Aún no tengo&quot; para asignarte una Suite temporal oficial.
          </span>
        </div>

        {/* Destination City in Bolivia (All 9 Departments) */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="city-dest" className="font-sans text-xs font-bold uppercase tracking-wider text-brand-navy">
            Ciudad de Entrega en Bolivia *
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-on-surface-variant">
              <Icon name="location_on" size={20} />
            </span>
            <select
              id="city-dest"
              value={destinationCity}
              onChange={(e) => onDestinationCityChange(e.target.value)}
              className="w-full h-12 pl-11 pr-10 rounded-xl bg-surface-container-low text-on-surface font-sans text-sm focus:outline-none focus:ring-2 focus:ring-secondary transition-all appearance-none cursor-pointer"
            >
              {BOLIVIAN_CITIES.map((city) => (
                <option key={city.value} value={city.value}>
                  {city.label}
                </option>
              ))}
            </select>
            <span className="absolute right-3.5 top-3.5 pointer-events-none text-on-surface-variant">
              <Icon name="expand_more" size={20} />
            </span>
          </div>
        </div>

        {/* Delivery Method Selection */}
        <div className="md:col-span-2 space-y-2 pt-1">
          <label className="block font-sans text-xs font-bold uppercase tracking-wider text-brand-navy">
            Modalidad de Recepción en Destino
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Pickup */}
            <label
              className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                deliveryMethod === 'pickup'
                  ? 'border-secondary bg-secondary-fixed/20 shadow-sm'
                  : 'border-outline-variant/40 bg-surface-container-low hover:bg-surface-container'
              }`}
            >
              <input
                type="radio"
                name="deliveryMethod"
                value="pickup"
                checked={deliveryMethod === 'pickup'}
                onChange={() => onDeliveryMethodChange('pickup')}
                className="w-4 h-4 mt-1 text-secondary accent-secondary"
              />
              <div className="space-y-0.5">
                <span className="font-display font-bold text-sm sm:text-base text-brand-navy flex items-center gap-1.5">
                  <Icon name="store" size={18} className="text-secondary" />
                  Recojo en Sede Central
                </span>
                <span className="font-sans text-xs text-on-surface-variant block leading-snug">
                  Sin costo de flete urbano adicional en sedes Equipetrol (SCZ), Sopocachi (LPB) o Recoleta (CBBA).
                </span>
              </div>
            </label>

            {/* Home Delivery */}
            <label
              className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                deliveryMethod === 'delivery'
                  ? 'border-secondary bg-secondary-fixed/20 shadow-sm'
                  : 'border-outline-variant/40 bg-surface-container-low hover:bg-surface-container'
              }`}
            >
              <input
                type="radio"
                name="deliveryMethod"
                value="delivery"
                checked={deliveryMethod === 'delivery'}
                onChange={() => onDeliveryMethodChange('delivery')}
                className="w-4 h-4 mt-1 text-secondary accent-secondary"
              />
              <div className="space-y-0.5">
                <span className="font-display font-bold text-sm sm:text-base text-brand-navy flex items-center gap-1.5">
                  <Icon name="local_shipping" size={18} className="text-secondary" />
                  Entrega a Domicilio Express
                </span>
                <span className="font-sans text-xs text-on-surface-variant block leading-snug">
                  Envío directo a tu puerta o condominio coordinado vía motorizado o courier interdepartamental.
                </span>
              </div>
            </label>
          </div>

          {/* Dynamic Address Input */}
          {deliveryMethod === 'delivery' && (
            <div className="pt-3 space-y-1.5 animate-fadeIn">
              <label htmlFor="delivery-address" className="font-sans text-xs font-bold uppercase tracking-wider text-brand-navy flex items-center gap-1.5">
                <Icon name="home_pin" size={18} className="text-secondary" />
                Dirección Exacta de Entrega en {destinationCity} *
              </label>
              <textarea
                id="delivery-address"
                rows={2}
                value={deliveryAddress}
                onChange={(e) => onDeliveryAddressChange(e.target.value)}
                placeholder="Indica: Zona / Barrio, Calle o Avenida, Nro de casa/edificio, Piso/Departamento y referencias de ubicación..."
                className={`w-full p-3.5 rounded-xl bg-surface-container-low text-on-surface font-sans text-sm focus:outline-none focus:ring-2 placeholder:text-outline transition-all ${
                  errors.deliveryAddress ? 'ring-2 ring-error bg-error-container/20' : 'focus:ring-secondary'
                }`}
              />
              {errors.deliveryAddress && (
                <span className="text-xs text-error font-medium">{errors.deliveryAddress}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientProfileForm;
