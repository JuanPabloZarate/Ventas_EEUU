'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export interface DealItem {
  id: string;
  store: string;
  brand: string;
  title: string;
  category: 'Tech' | 'Moda' | 'Belleza' | 'Gaming';
  originalPrice: number;
  dealPrice: number;
  savings: number;
  discountPercent: number;
  taxNote: string;
  tag: string;
  highlights: string;
}

export const TOP_DEALS: DealItem[] = [
  {
    id: 'macbook-air-m2',
    store: 'Best Buy NYC',
    brand: 'Apple',
    title: 'MacBook Air 13" (Chip M2, 16GB RAM, 256GB SSD)',
    category: 'Tech',
    originalPrice: 999,
    dealPrice: 749,
    savings: 250,
    discountPercent: 25,
    taxNote: 'Ahorro masivo en efectivo directo vs Gift Card',
    tag: 'Doorbuster #1',
    highlights: '16GB de memoria unificada, ultra delgada y potente para trabajo y estudio.',
  },
  {
    id: 'sony-wh1000xm5',
    store: 'Best Buy / Amazon',
    brand: 'Sony',
    title: 'Auriculares Noise Cancelling WH-1000XM5',
    category: 'Tech',
    originalPrice: 399.99,
    dealPrice: 248.00,
    savings: 151.99,
    discountPercent: 38,
    taxNote: 'Rebaja histórica en audio de alta gama',
    tag: '38% OFF',
    highlights: 'Líder indiscutible en cancelación de ruido y batería de 30 horas.',
  },
  {
    id: 'airpods-pro-2',
    store: 'Best Buy / B&H Photo',
    brand: 'Apple',
    title: 'AirPods Pro 2 (USB-C MagSafe)',
    category: 'Tech',
    originalPrice: 249,
    dealPrice: 189,
    savings: 60,
    discountPercent: 24,
    taxNote: 'Descuento directo en efectivo',
    tag: '$60 OFF',
    highlights: 'Cancelación activa de ruido 2x mejorada y estuche con carga USB-C.',
  },
  {
    id: 'coach-city-tote',
    store: 'Woodbury Common NY',
    brand: 'Coach',
    title: 'Cartera City Tote Signature Canvas',
    category: 'Moda',
    originalPrice: 398,
    dealPrice: 89,
    savings: 309,
    discountPercent: 77,
    taxNote: '0% Sales Tax en NYC (artículo menor a $110)',
    tag: '77% OFF',
    highlights: 'Cuero genuino y lona estampada emblemática con espacio generoso.',
  },
  {
    id: 'tommy-puffer',
    store: 'Macy\'s Herald Square',
    brand: 'Tommy Hilfiger',
    title: 'Puffer Jacket Térmica de Invierno',
    category: 'Moda',
    originalPrice: 225,
    dealPrice: 79,
    savings: 146,
    discountPercent: 65,
    taxNote: '0% Sales Tax en NYC (menos de $110)',
    tag: '65% OFF',
    highlights: 'Aislamiento ultra liviano resistente al agua con diseño clásico neoyorquino.',
  },
  {
    id: 'nike-pegasus',
    store: 'Nike House of Innovation 5th Ave',
    brand: 'Nike',
    title: 'Zapatillas Running Pegasus 40 / 41',
    category: 'Moda',
    originalPrice: 140,
    dealPrice: 79,
    savings: 61,
    discountPercent: 44,
    taxNote: '0% Sales Tax en NYC (menos de $110)',
    tag: '44% OFF',
    highlights: 'Espuma React y doble unidad Zoom Air para máximo confort diario.',
  },
  {
    id: 'dyson-airwrap',
    store: 'Sephora Times Square',
    brand: 'Dyson',
    title: 'Dyson Airwrap Multi-Styler Complete Long',
    category: 'Belleza',
    originalPrice: 599,
    dealPrice: 499,
    savings: 100,
    discountPercent: 17,
    taxNote: 'Edición limitada navideña con estuche',
    tag: '$100 OFF',
    highlights: 'Estilizado por aire sin daño térmico extremo. Muy codiciado.',
  },
  {
    id: 'ps5-slim-bundle',
    store: 'Best Buy / Target',
    brand: 'Sony PlayStation',
    title: 'PlayStation 5 Slim Disc Edition + Juego Triple A',
    category: 'Gaming',
    originalPrice: 499.99,
    dealPrice: 449.99,
    savings: 50,
    discountPercent: 10,
    taxNote: 'Incluye juego gratis ($70 USD valor)',
    tag: 'Pack Gamer',
    highlights: 'Chasis compacto de 1TB SSD con lector de discos y DualSense.',
  },
];

export function TopDealsShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<'Todas' | 'Tech' | 'Moda' | 'Belleza' | 'Gaming'>('Todas');

  const filteredDeals = selectedCategory === 'Todas'
    ? TOP_DEALS
    : TOP_DEALS.filter((d) => d.category === selectedCategory);

  return (
    <section id="ofertas-estrella" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest border-y border-outline-variant/20">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Minimal Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed/50 text-secondary text-xs font-semibold mb-2">
              <Icon name="local_fire_department" size={14} />
              <span>Precios Verificados Black Friday NYC</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-on-surface tracking-tight">
              Grandes Ofertas Seleccionadas
            </h2>
            <p className="text-sm text-on-surface-variant mt-1 max-w-xl">
              Los chollos más codiciados de Manhattan. Las compramos por ti o las recibimos en tu Suite para envío a Bolivia.
            </p>
          </div>

          {/* Minimal Category Filter Tabs */}
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl self-start sm:self-auto overflow-x-auto max-w-full">
            {(['Todas', 'Tech', 'Moda', 'Belleza', 'Gaming'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-surface text-on-surface shadow-xs font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Clean Minimalist Deals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredDeals.map((deal) => (
            <div
              key={deal.id}
              className="group bg-surface rounded-2xl p-4 border border-outline-variant/30 hover:border-secondary/50 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Store and Tag Badge */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant font-medium flex items-center gap-1">
                    <Icon name="storefront" size={13} className="text-secondary" />
                    {deal.store}
                  </span>
                  <span className="font-bold text-error bg-error-container/20 px-2 py-0.5 rounded-full text-[11px]">
                    {deal.tag}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="font-display font-semibold text-sm text-on-surface line-clamp-2 group-hover:text-secondary transition-colors">
                    {deal.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">
                    {deal.highlights}
                  </p>
                </div>
              </div>

              {/* Price and Action */}
              <div className="pt-4 mt-3 border-t border-outline-variant/20 space-y-2">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant line-through mr-1.5">
                      ${deal.originalPrice.toFixed(0)}
                    </span>
                    <span className="text-lg font-bold font-display text-primary-container">
                      ${deal.dealPrice.toFixed(0)} <span className="text-xs font-normal text-on-surface-variant">USD</span>
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-secondary">
                    Ahorro ${deal.savings.toFixed(0)}
                  </span>
                </div>

                <div className="text-[10px] text-tertiary-fixed-dim bg-surface-container-low px-2 py-1 rounded-md">
                  {deal.taxNote}
                </div>

                <Link
                  href={`/registro?store=${encodeURIComponent(deal.store)}&usd=${deal.dealPrice}`}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-surface-container-low hover:bg-primary-container hover:text-white text-on-surface font-sans text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Pedir este artículo</span>
                  <Icon name="arrow_forward" size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Minimal Banner for Sales Tax Advantage */}
        <div className="bg-surface-container-low rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <Icon name="percent" size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface">
                0% Impuestos en NYC para ropa y calzado menor a $110 USD
              </p>
              <p className="text-xs text-on-surface-variant">
                En Nueva York ahorras automáticamente el 8.875% de tax en compras de moda bajo $110 por prenda.
              </p>
            </div>
          </div>
          <Link
            href="/registro"
            className="self-start sm:self-auto whitespace-nowrap text-xs font-semibold text-secondary hover:underline flex items-center gap-1"
          >
            <span>Ver pre-alerta de envío</span>
            <Icon name="arrow_forward" size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}
