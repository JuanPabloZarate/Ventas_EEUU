'use client';

import React from 'react';
import { Icon } from '@/components/ui/Icon';
import { StoreChips } from './StoreChips';
import type { OrderItem, OrderModality } from '@/types/order';

export interface DynamicItemBuilderProps {
  items: OrderItem[];
  modality: OrderModality;
  onChange?: (items: OrderItem[]) => void;
  onAddItem?: () => void;
  onRemoveItem?: (id: string) => void;
  onUpdateItem?: <K extends keyof OrderItem>(id: string, field: K, value: OrderItem[K]) => void;
  errors?: Record<string, Partial<Record<keyof OrderItem, string>>>;
  className?: string;
}

export const CARGO_CATEGORIES = [
  'Electrónica / Celulares / Laptops',
  'Ropa, Calzado & Accesorios',
  'Perfumes & Cosméticos de Marca',
  'Cámaras, Fotografía & Audio Profesional',
  'Joyería, Lentes & Relojes',
  'Suplementos & Salud',
  'Juguetes & Coleccionables',
  'Repuestos & Otros Artículos',
];

export function DynamicItemBuilder({
  items,
  modality,
  onChange,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  errors = {},
  className = '',
}: DynamicItemBuilderProps) {
  const isPreAlert = modality === 'prealert';

  const handleAddItem = () => {
    if (onAddItem) {
      onAddItem();
    } else if (onChange) {
      const nextIndex = items.length + 1;
      const newItem: OrderItem = {
        id: `item-${Date.now()}-${nextIndex}`,
        storeName: 'Amazon USA',
        category: 'Repuestos & Otros Artículos',
        productName: '',
        productUrl: '',
        quantity: 1,
        priceUSD: 0,
        trackingUSA: '',
      };
      onChange([...items, newItem]);
    }
  };

  const handleRemoveItem = (id: string) => {
    if (onRemoveItem) {
      onRemoveItem(id);
    } else if (onChange) {
      onChange(items.filter((item) => item.id !== id));
    }
  };

  const handleUpdateItem = <K extends keyof OrderItem>(id: string, field: K, value: OrderItem[K]) => {
    if (onUpdateItem) {
      onUpdateItem(id, field, value);
    } else if (onChange) {
      onChange(
        items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
      );
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-primary-container text-white font-display font-bold flex items-center justify-center text-sm shadow-xs">
            2
          </span>
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold text-brand-navy">
              {isPreAlert ? 'Detalles de Paquetes en USA (Pre-Alerta)' : 'Artículos para Compra Asistida en Manhattan'}
            </h3>
            <p className="font-sans text-xs sm:text-sm text-on-surface-variant">
              Especifica los artículos para consolidación en bodega New York ($0 fee)
            </p>
          </div>
        </div>
        <Icon name="local_mall" size={24} className="text-secondary" />
      </div>

      {/* Items List */}
      <div className="space-y-6">
        {items.map((item, index) => {
          const itemErrors = errors[item.id] || {};
          const isFirstItem = index === 0;

          return (
            <div
              key={item.id}
              className="p-5 sm:p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-4 relative transition-all"
            >
              {/* Item Card Title */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 font-display text-sm sm:text-base font-bold text-secondary">
                  <span className="w-6 h-6 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center text-xs font-mono font-bold">
                    #{index + 1}
                  </span>
                  {isFirstItem ? 'Artículo Principal' : 'Artículo Adicional'}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-secondary bg-secondary-fixed/50 px-2.5 py-0.5 rounded-full font-bold">
                    Consolidación $0.00
                  </span>
                  {!isFirstItem && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-xs font-sans text-error hover:underline flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-error-container/30 cursor-pointer"
                      aria-label={`Eliminar artículo ${index + 1}`}
                    >
                      <Icon name="delete" size={16} />
                      <span>Eliminar</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Store Chips per item (shown on item 1) */}
              {isFirstItem && (
                <StoreChips
                  activeStore={item.storeName}
                  onSelectStore={(storeName, category) => {
                    handleUpdateItem(item.id, 'storeName', storeName);
                    handleUpdateItem(item.id, 'category', category);
                  }}
                />
              )}

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Store Name */}
                <div className="flex flex-col gap-1">
                  <label htmlFor={`store-${item.id}`} className="font-sans text-xs font-bold uppercase tracking-wider text-brand-navy">
                    Tienda de Origen *
                  </label>
                  <input
                    id={`store-${item.id}`}
                    type="text"
                    value={item.storeName}
                    onChange={(e) => handleUpdateItem(item.id, 'storeName', e.target.value)}
                    placeholder="Ej. Apple Store 5th Ave / Amazon / B&H"
                    className={`w-full h-11 px-3.5 rounded-xl bg-surface-container-lowest text-on-surface font-sans text-sm focus:outline-none focus:ring-2 placeholder:text-outline transition-all ${
                      itemErrors.storeName ? 'ring-2 ring-error' : 'focus:ring-secondary'
                    }`}
                  />
                  {itemErrors.storeName && (
                    <span className="text-xs text-error font-medium">{itemErrors.storeName}</span>
                  )}
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1">
                  <label htmlFor={`category-${item.id}`} className="font-sans text-xs font-bold uppercase tracking-wider text-brand-navy">
                    Categoría de Carga *
                  </label>
                  <select
                    id={`category-${item.id}`}
                    value={item.category}
                    onChange={(e) => handleUpdateItem(item.id, 'category', e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-surface-container-lowest text-on-surface font-sans text-sm focus:outline-none focus:ring-2 focus:ring-secondary transition-all cursor-pointer"
                  >
                    {CARGO_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Product Name / Description */}
                <div className="md:col-span-2 flex flex-col gap-1">
                  <label htmlFor={`product-name-${item.id}`} className="font-sans text-xs font-bold uppercase tracking-wider text-brand-navy">
                    Nombre o Descripción Precisa del Producto *
                  </label>
                  <input
                    id={`product-name-${item.id}`}
                    type="text"
                    value={item.productName}
                    onChange={(e) => handleUpdateItem(item.id, 'productName', e.target.value)}
                    placeholder="Ej. iPhone 16 Pro 256GB Black Titanium o Zapatillas Nike Jordan 4 Talla 10 US"
                    className={`w-full h-11 px-3.5 rounded-xl bg-surface-container-lowest text-on-surface font-sans text-sm focus:outline-none focus:ring-2 placeholder:text-outline transition-all ${
                      itemErrors.productName ? 'ring-2 ring-error' : 'focus:ring-secondary'
                    }`}
                  />
                  {itemErrors.productName && (
                    <span className="text-xs text-error font-medium">{itemErrors.productName}</span>
                  )}
                </div>

                {/* Product URL */}
                <div className="md:col-span-2 flex flex-col gap-1">
                  <label htmlFor={`product-url-${item.id}`} className="font-sans text-xs font-bold uppercase tracking-wider text-brand-navy">
                    Enlace / URL de la Tienda {isPreAlert ? '(Opcional si ya compraste)' : '(Requerido para Personal Shopper)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-on-surface-variant">
                      <Icon name="link" size={18} />
                    </span>
                    <input
                      id={`product-url-${item.id}`}
                      type="url"
                      value={item.productUrl || ''}
                      onChange={(e) => handleUpdateItem(item.id, 'productUrl', e.target.value)}
                      placeholder="https://www.apple.com/... o https://www.amazon.com/dp/..."
                      className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-surface-container-lowest text-on-surface font-sans text-sm focus:outline-none focus:ring-2 focus:ring-secondary placeholder:text-outline transition-all"
                    />
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex flex-col gap-1">
                  <label htmlFor={`product-qty-${item.id}`} className="font-sans text-xs font-bold uppercase tracking-wider text-brand-navy">
                    Cantidad
                  </label>
                  <input
                    id={`product-qty-${item.id}`}
                    type="number"
                    min={1}
                    max={99}
                    value={item.quantity}
                    onChange={(e) => handleUpdateItem(item.id, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full h-11 px-3.5 rounded-xl bg-surface-container-lowest text-on-surface font-sans text-sm focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                  />
                </div>

                {/* Unit Price USD */}
                <div className="flex flex-col gap-1">
                  <label htmlFor={`product-price-${item.id}`} className="font-sans text-xs font-bold uppercase tracking-wider text-brand-navy">
                    Valor Unitario Declarado (USD $) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 font-bold text-on-surface-variant font-mono text-sm">$</span>
                    <input
                      id={`product-price-${item.id}`}
                      type="number"
                      step="0.01"
                      min={0}
                      value={item.priceUSD || ''}
                      onChange={(e) => handleUpdateItem(item.id, 'priceUSD', parseFloat(e.target.value) || 0)}
                      placeholder="Ej. 999.00"
                      className={`w-full h-11 pl-8 pr-3.5 rounded-xl bg-surface-container-lowest text-on-surface font-mono text-sm focus:outline-none focus:ring-2 placeholder:text-outline transition-all ${
                        itemErrors.priceUSD ? 'ring-2 ring-error' : 'focus:ring-secondary'
                      }`}
                    />
                  </div>
                  {itemErrors.priceUSD && (
                    <span className="text-xs text-error font-medium">{itemErrors.priceUSD}</span>
                  )}
                </div>

                {/* Tracking USA (Pre-Alerta primary) */}
                {isPreAlert && (
                  <div className="md:col-span-2 flex flex-col gap-1 pt-1">
                    <label htmlFor={`tracking-${item.id}`} className="font-sans text-xs font-bold uppercase tracking-wider text-brand-navy flex items-center justify-between">
                      <span>Número de Guía / Tracking en USA (UPS, FedEx, USPS, Amazon)</span>
                      <span className="text-xs text-secondary font-normal font-sans">Para ingreso express a bodega</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-secondary">
                        <Icon name="local_shipping" size={18} />
                      </span>
                      <input
                        id={`tracking-${item.id}`}
                        type="text"
                        value={item.trackingUSA || ''}
                        onChange={(e) => handleUpdateItem(item.id, 'trackingUSA', e.target.value.toUpperCase())}
                        placeholder="Ej. 1Z9999999999999999 ó TBA304928172"
                        className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-surface-container-lowest text-on-surface font-mono text-sm uppercase focus:outline-none focus:ring-2 focus:ring-secondary placeholder:text-outline transition-all"
                      />
                    </div>
                    <span className="text-[11px] text-on-surface-variant">
                      Si aún la tienda no te envió el tracking, puedes completarlo más tarde vía WhatsApp.
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Another Product Button */}
      <button
        type="button"
        onClick={handleAddItem}
        className="w-full py-3.5 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-secondary font-sans text-sm font-bold flex items-center justify-center gap-2 border-2 border-dashed border-secondary/30 hover:border-secondary transition-all cursor-pointer"
      >
        <Icon name="add_circle" size={20} />
        <span>Agregar otro producto al mismo envío (Consolidación Gratuita $0)</span>
      </button>
    </div>
  );
}

export default DynamicItemBuilder;
