'use client';

import React from 'react';
import { Icon } from '@/components/ui/Icon';

export interface StoreOption {
  id: string;
  name: string;
  storeName: string;
  category: string;
  icon: string;
  badge?: string;
}

export interface StoreChipsProps {
  onSelectStore: (storeName: string, category: string) => void;
  activeStore?: string;
  className?: string;
}

export const POPULAR_STORES: StoreOption[] = [
  {
    id: 'apple',
    name: 'Apple Store',
    storeName: 'Apple Store 5th Ave',
    category: 'Electrónica / Celulares / Laptops',
    icon: 'phone_iphone',
  },
  {
    id: 'amazon',
    name: 'Amazon',
    storeName: 'Amazon USA',
    category: 'Repuestos & Otros Artículos',
    icon: 'shopping_cart',
  },
  {
    id: 'bh',
    name: 'B&H Photo NYC',
    storeName: 'B&H Photo Video NYC',
    category: 'Cámaras, Fotografía & Audio Profesional',
    icon: 'photo_camera',
  },
  {
    id: 'sephora',
    name: 'Sephora',
    storeName: 'Sephora SoHo',
    category: 'Perfumes & Cosméticos de Marca',
    icon: 'spa',
  },
  {
    id: 'nike',
    name: 'Nike NYC',
    storeName: 'Nike NYC House of Innovation',
    category: 'Ropa, Calzado & Accesorios',
    icon: 'steps',
  },
  {
    id: 'ebay',
    name: 'eBay USA',
    storeName: 'eBay USA',
    category: 'Repuestos & Otros Artículos',
    icon: 'sell',
  },
  {
    id: 'bestbuy',
    name: 'Best Buy',
    storeName: 'Best Buy NYC',
    category: 'Electrónica / Celulares / Laptops',
    icon: 'bolt',
  },
  {
    id: 'walmart',
    name: 'Walmart',
    storeName: 'Walmart USA',
    category: 'Juguetes & Coleccionables',
    icon: 'storefront',
  },
  {
    id: 'saks',
    name: 'Saks 5th Ave',
    storeName: 'Saks Fifth Avenue',
    category: 'Joyería, Lentes & Relojes',
    icon: 'diamond',
  },
  {
    id: 'macys',
    name: "Macy's",
    storeName: "Macy's Herald Square",
    category: 'Ropa, Calzado & Accesorios',
    icon: 'store',
  },
];

export function StoreChips({
  onSelectStore,
  activeStore = '',
  className = '',
}: StoreChipsProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <span className="block font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant">
        Selección Rápida de Tienda en NY / EE.UU.
      </span>
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 custom-scrollbar scroll-smooth">
        {POPULAR_STORES.map((store) => {
          const isSelected = activeStore.toLowerCase() === store.storeName.toLowerCase() ||
                             activeStore.toLowerCase() === store.name.toLowerCase();
          return (
            <button
              key={store.id}
              type="button"
              onClick={() => onSelectStore(store.storeName, store.category)}
              className={`px-3 py-1.5 rounded-xl font-sans text-xs shrink-0 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                isSelected
                  ? 'bg-secondary text-white font-bold ring-2 ring-secondary/30'
                  : 'bg-surface-container-low text-on-surface hover:bg-secondary-fixed hover:text-on-secondary-fixed'
              }`}
            >
              <Icon name={store.icon} size={15} />
              <span>{store.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default StoreChips;
