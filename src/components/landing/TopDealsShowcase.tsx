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
  christmasTag: string;
  highlights: string;
  buyUrl: string;
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
    taxNote: 'Ahorro masivo en efectivo directo',
    tag: 'Doorbuster #1',
    christmasTag: '🎁 Regalo Top Tech',
    highlights: '16GB de memoria unificada, ultra delgada y potente para trabajo y estudio.',
    buyUrl: 'https://www.bestbuy.com/site/apple-macbook-air-13-inch-laptop-m2-chip-16gb-memory-256gb-ssd-midnight/6509650.p',
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
    christmasTag: '🎧 El regalo más pedido',
    highlights: 'Líder indiscutible en cancelación de ruido y batería de 30 horas.',
    buyUrl: 'https://www.amazon.com/dp/B09XS7JWHH',
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
    christmasTag: '✨ Sorpresa Navideña',
    highlights: 'Cancelación activa de ruido 2x mejorada y estuche con carga USB-C.',
    buyUrl: 'https://www.bhphotovideo.com/c/product/1785392-REG/apple_mtjv3am_a_airpods_pro_2nd_generation.html',
  },
  {
    id: 'coach-city-tote',
    store: 'Coach Outlet NY',
    brand: 'Coach',
    title: 'Cartera City Tote Signature Canvas',
    category: 'Moda',
    originalPrice: 398,
    dealPrice: 89,
    savings: 309,
    discountPercent: 77,
    taxNote: '0% Sales Tax en NYC (menos de $110)',
    tag: '77% OFF',
    christmasTag: '👜 Lujo Navideño',
    highlights: 'Cuero genuino y lona estampada emblemática con espacio generoso.',
    buyUrl: 'https://www.coachoutlet.com/products/city-tote-in-signature-canvas/5696.html',
  },
  {
    id: 'tommy-puffer',
    store: 'Macy\'s Herald Sq',
    brand: 'Tommy Hilfiger',
    title: 'Puffer Jacket Térmica de Invierno',
    category: 'Moda',
    originalPrice: 225,
    dealPrice: 79,
    savings: 146,
    discountPercent: 65,
    taxNote: '0% Sales Tax en NYC (menos de $110)',
    tag: '65% OFF',
    christmasTag: '❄️ Invierno Manhattan',
    highlights: 'Aislamiento ultra liviano resistente al agua con diseño clásico neoyorquino.',
    buyUrl: 'https://www.macys.com/shop/mens-clothing/mens-jackets-coats/Brand/Tommy%20Hilfiger?id=3763',
  },
  {
    id: 'nike-pegasus',
    store: 'Nike 5th Ave',
    brand: 'Nike',
    title: 'Zapatillas Running Pegasus 40 / 41',
    category: 'Moda',
    originalPrice: 140,
    dealPrice: 79,
    savings: 61,
    discountPercent: 44,
    taxNote: '0% Sales Tax en NYC (menos de $110)',
    tag: '44% OFF',
    christmasTag: '👟 Estilo Deportivo',
    highlights: 'Espuma React y doble unidad Zoom Air para máximo confort diario.',
    buyUrl: 'https://www.nike.com/w/mens-pegasus-running-shoes-37v7jznik1zy7ok',
  },
  {
    id: 'dyson-airwrap',
    store: 'Sephora Times Sq',
    brand: 'Dyson',
    title: 'Dyson Airwrap Multi-Styler Complete Long',
    category: 'Belleza',
    originalPrice: 599,
    dealPrice: 499,
    savings: 100,
    discountPercent: 17,
    taxNote: 'Edición limitada navideña con estuche',
    tag: '$100 OFF',
    christmasTag: '💄 Set Festivo Exclusivo',
    highlights: 'Estilizado por aire sin daño térmico extremo. Muy codiciado.',
    buyUrl: 'https://www.sephora.com/product/airwrap-styler-P437999',
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
    christmasTag: '🎮 El regalo soñado',
    highlights: 'Chasis compacto de 1TB SSD con lector de discos y DualSense.',
    buyUrl: 'https://www.bestbuy.com/site/playstation-5-slim-console/6564757.p',
  },
];

export function TopDealsShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<'Todas' | 'Tech' | 'Moda' | 'Belleza' | 'Gaming'>('Todas');

  const filteredDeals = selectedCategory === 'Todas'
    ? TOP_DEALS
    : TOP_DEALS.filter((d) => d.category === selectedCategory);

  return (
    <section id="ofertas-estrella" className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest border-y border-outline-variant/20">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header con Acento Navideño y Black Friday */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-fixed/50 text-secondary text-xs font-semibold mb-2">
              <span>🎄 Regalos Navideños Imperdibles</span>
              <span className="text-secondary/40">•</span>
              <span className="font-mono text-[11px] text-primary-container font-bold">Llega desde el 4 Dic</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-on-surface tracking-tight">
              Ofertas Black Friday para Navidad
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1 max-w-xl">
              Los chollos más codiciados de Manhattan. Puedes comprarlos tú con el link oficial o pedirlos para que los compremos por ti.
            </p>
          </div>

          {/* Filtros */}
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

        {/* Grid de Ofertas con Badges Festivos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredDeals.map((deal) => (
            <div
              key={deal.id}
              className="bg-surface rounded-2xl p-4 border border-outline-variant/30 hover:border-secondary/50 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                
                {/* Badges de Tienda y Regalo */}
                <div className="flex items-center justify-between text-xs gap-1">
                  <span className="text-on-surface-variant font-medium flex items-center gap-1 truncate">
                    <Icon name="storefront" size={13} className="text-secondary shrink-0" />
                    <span className="truncate">{deal.store}</span>
                  </span>
                  <span className="font-bold text-error bg-error-container/20 px-2 py-0.5 rounded-full text-[10px] shrink-0">
                    {deal.tag}
                  </span>
                </div>

                {/* Micro-etiqueta Navideña */}
                <div className="inline-block px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-semibold border border-amber-200/60">
                  {deal.christmasTag}
                </div>

                {/* Título y detalles */}
                <div>
                  <h3 className="font-display font-semibold text-sm text-on-surface line-clamp-2">
                    {deal.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">
                    {deal.highlights}
                  </p>
                </div>
              </div>

              {/* Precios y Botones */}
              <div className="pt-3 mt-3 border-t border-outline-variant/20 space-y-2.5">
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

                {/* 1) Link de Compra en USA y 2) Pedir en Formulario */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={deal.buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Ver producto en la tienda oficial de USA"
                    className="py-2 px-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-sans text-xs font-semibold flex items-center justify-center gap-1 transition-all border border-outline-variant/30 text-center"
                  >
                    <span>Link Tienda</span>
                    <Icon name="open_in_new" size={12} />
                  </a>

                  <Link
                    href={`/registro?store=${encodeURIComponent(deal.store)}&usd=${deal.dealPrice}&item=${encodeURIComponent(deal.title)}&url=${encodeURIComponent(deal.buyUrl)}`}
                    className="py-2 px-2 rounded-xl bg-primary-container hover:bg-black text-white font-sans text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-xs text-center"
                  >
                    <span>Pedir / Traer</span>
                    <Icon name="arrow_forward" size={12} />
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Ventaja Fiscal NYC */}
        <div className="bg-surface-container-low rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <Icon name="percent" size={18} />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-on-surface">
                0% Impuestos en NYC para regalos de ropa y calzado menor a $110 USD
              </p>
              <p className="text-xs text-on-surface-variant">
                En Nueva York ahorras automáticamente el impuesto local en prendas individuales bajo $110.
              </p>
            </div>
          </div>
          <Link
            href="/registro"
            className="self-start sm:self-auto text-xs font-bold text-secondary hover:underline flex items-center gap-1 whitespace-nowrap"
          >
            <span>Ver formulario</span>
            <Icon name="arrow_forward" size={13} />
          </Link>
        </div>

      </div>
    </section>
  );
}

export default TopDealsShowcase;
