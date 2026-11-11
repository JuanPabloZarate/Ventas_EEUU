'use client';

import React from 'react';
import { Icon } from '@/components/ui/Icon';
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
      const newItem: OrderItem = {
        id: `item-${Date.now()}-${items.length + 1}`,
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
    <div className={`bg-surface rounded-2xl p-5 sm:p-6 border border-outline-variant/30 space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-primary-container text-white text-xs font-bold flex items-center justify-center">
            2
          </span>
          <h3 className="font-display font-bold text-sm sm:text-base text-on-surface">
            {isPreAlert ? 'Artículos Comprados' : 'Artículos a Comprar en NY'}
          </h3>
        </div>
        <button
          type="button"
          onClick={handleAddItem}
          className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-bold flex items-center gap-1 transition-all"
        >
          <Icon name="add" size={14} />
          <span>+ Agregar otro</span>
        </button>
      </div>

      {/* Clean Compact List */}
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="p-3 sm:p-4 rounded-xl bg-surface-container-low/60 border border-outline-variant/20 space-y-3 relative group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface-variant">
                Artículo #{idx + 1}
              </span>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-xs text-error hover:underline flex items-center gap-1"
                >
                  <Icon name="delete" size={13} />
                  <span>Eliminar</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Product Name */}
              <div className="sm:col-span-6">
                <input
                  type="text"
                  value={item.productName}
                  onChange={(e) => handleUpdateItem(item.id, 'productName', e.target.value)}
                  placeholder="Descripción (ej. iPhone 16 Pro 256GB)"
                  className="w-full h-9 px-3 rounded-lg bg-surface text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </div>

              {/* Store */}
              <div className="sm:col-span-3">
                <input
                  type="text"
                  value={item.storeName}
                  onChange={(e) => handleUpdateItem(item.id, 'storeName', e.target.value)}
                  placeholder="Tienda (ej. Apple / Amazon)"
                  className="w-full h-9 px-3 rounded-lg bg-surface text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </div>

              {/* Price */}
              <div className="sm:col-span-3">
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-xs text-on-surface-variant font-bold">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.priceUSD || ''}
                    onChange={(e) => handleUpdateItem(item.id, 'priceUSD', parseFloat(e.target.value) || 0)}
                    placeholder="Precio USD"
                    className="w-full h-9 pl-6 pr-3 rounded-lg bg-surface text-on-surface text-xs font-bold focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                </div>
              </div>

              {/* Link or Tracking depending on modality */}
              <div className="sm:col-span-12">
                {isPreAlert ? (
                  <input
                    type="text"
                    value={item.trackingUSA || ''}
                    onChange={(e) => handleUpdateItem(item.id, 'trackingUSA', e.target.value)}
                    placeholder="Número de Tracking USA (FedEx, UPS, USPS o Amazon TBA) - Opcional"
                    className="w-full h-9 px-3 rounded-lg bg-surface text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                ) : (
                  <input
                    type="url"
                    value={item.productUrl || ''}
                    onChange={(e) => handleUpdateItem(item.id, 'productUrl', e.target.value)}
                    placeholder="Enlace web del producto en USA (URL para que lo compremos por ti)"
                    className="w-full h-9 px-3 rounded-lg bg-surface text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
