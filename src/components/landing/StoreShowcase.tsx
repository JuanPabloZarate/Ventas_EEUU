'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export interface StoreItem {
  id: string;
  name: string;
  location: string;
  discountBadge: string;
  description: string;
  imageUrl: string;
  ratePerLb: string;
  mobileQuickTag: string;
  quoteLabel: string;
  whatsappMessage: string;
  category: 'Tecnología' | 'Moda & Sneakers' | 'Belleza & Fragancias' | 'Cámaras & Audio' | 'Lujo & Joyería';
  isPopular?: boolean;
}

export const STORES_DATA: StoreItem[] = [
  {
    id: 'apple-5th-ave',
    name: 'Apple Store 5th Ave',
    location: '5th Avenue NYC',
    discountBadge: 'Ahorra hasta $300 USD',
    description: 'iPhone 16 Pro, MacBook Pro M3, iPad Air y AirPods Max con precios originales de EE.UU. sin intermediarios locales.',
    imageUrl: 'https://lh3.googleusercontent.com/aida/ALJJyrBqXrBEQnyxoWc4I8eZX3A9RFaCnlhr3LF0ZVeSz2k2KA8LvSvedLKFrAHT61RqQS2rXOatrATv0moHTHeZnCduaaTkOSSG0YpUK68i4SU0L-FPRYNMb1GuLYPGIjI_y8OdbNRGVlHjp0b2vb1ihfZdd_sKAm92n-j-noCM0SA08M4C2wpTSFGVaFKjJKo1KviAvEMnqEIbQIqe4dyNjxLJJQLsFYo9yRU84Y1PHA',
    ratePerLb: 'Flete: $9.50/Lb',
    mobileQuickTag: 'Entrega Rápida',
    quoteLabel: 'Cotizar ahora',
    whatsappMessage: 'Hola NY2Bolivia, quiero cotizar un producto de Apple Store 5th Ave New York para Black Friday',
    category: 'Tecnología',
    isPopular: true,
  },
  {
    id: 'nike-innovation',
    name: 'Nike House of Innovation',
    location: '5th Avenue NYC',
    discountBadge: 'Hasta 50% OFF',
    description: 'Lanzamientos de zapatillas exclusivas, Air Jordan retro, colecciones de running y streetwear no disponibles en Sudamérica.',
    imageUrl: 'https://lh3.googleusercontent.com/aida/ALJJyrB9RipluOe_m135Wz2Y3kmJvaWhTLz_vttR-yqqWLmU6lGl9R0YWmY-tGzGu7P0ZrFqsn39c0ATRHqZUYt_z4UUCzjbP1SsiIbV6AHwVH7srb5BITHccWWhCUKGdP0t5Lvgy0H1DIY9e0aAiTPJkZ3wzaIpJwcIu_Jx6mRnz48WYTnAGQlTNs1WP0_cLnph_B5R00kmiRw4pYs9a_USxHNAkgpv1Yq-SUagLUok-nc',
    ratePerLb: 'Flete: $9.50/Lb',
    mobileQuickTag: 'Tallas Originales',
    quoteLabel: 'Cotizar zapatillas',
    whatsappMessage: 'Hola NY2Bolivia, quiero cotizar zapatillas de Nike House of Innovation NYC',
    category: 'Moda & Sneakers',
    isPopular: true,
  },
  {
    id: 'sephora-manhattan',
    name: 'Sephora Manhattan',
    location: 'Manhattan Flagship',
    discountBadge: 'Gift Sets Navideños',
    description: 'Ediciones limitadas de Fenty Beauty, Charlotte Tilbury, Rare Beauty, Sol de Janeiro y perfumes importados con precio USA.',
    imageUrl: 'https://lh3.googleusercontent.com/aida/ALJJyrBM3M6Z2QE6FyH0pNZD2ePWiYGFZr15rRkNUiTxuGZ1z3pytsMyanZDxyfJT7HOOhcoQ_qBHSD6jJ42xMzAvx2_emE6Kti1Q_ySuDqgaMyfmbEyJD8R_XoNa_SnFYNCYc_8v_iV01Gx4ZX7T04IR95E7mnNfAGndGp2aDX9Oi4VjKKMcmvFpYlWY4i1Y-0Adc7pxsVM_2B7_BUHacSHNYqq7MqGKBXlrfri16KPeMo',
    ratePerLb: 'Flete: $9.50/Lb',
    mobileQuickTag: '100% Auténtico',
    quoteLabel: 'Cotizar belleza',
    whatsappMessage: 'Hola NY2Bolivia, quiero cotizar sets y fragancias de Sephora NYC',
    category: 'Belleza & Fragancias',
  },
  {
    id: 'bh-photo',
    name: 'B&H Photo Video',
    location: '9th Ave Manhattan',
    discountBadge: 'Descuentos Gigantes Tech',
    description: 'Cámaras Sony Alpha, Canon EOS, drones DJI, micrófonos Shure y laptops para creadores y desarrolladores.',
    imageUrl: 'https://lh3.googleusercontent.com/aida/ALJJyrCD7tCNjvhxpxf3dH5TREyNrSYHQul0SaWfpsSH1EtvV3z2q1pMGCXZ1xRnkMOE8-E5VR1P8GKAys2x6ur9Jr06UQjcIxlViD-FMU3zWPIlUSyrRsyeHZNIAXw8EXRKKESsxXLm9maz_UOKt49-DAFyyPvE9p6fZQYpEXfznKlaftFXbr4i9y90Z7VJHY1sE6bjS6mt9_8ZwSJ3x3J4aYMxXu2DHRCuu7bq0-J68A',
    ratePerLb: 'Flete: $9.50/Lb',
    mobileQuickTag: 'Cuidado Especial',
    quoteLabel: 'Cotizar tecnología',
    whatsappMessage: 'Hola NY2Bolivia, quiero cotizar equipo y cámaras de B&H Photo Video Manhattan',
    category: 'Cámaras & Audio',
    isPopular: true,
  },
  {
    id: 'macys-herald-sq',
    name: 'Macy’s Herald Square',
    location: 'Herald Square NYC',
    discountBadge: 'Hasta 60% OFF Ropa',
    description: 'Abrigos de invierno, chompas de cashmere, calzados Tommy Hilfiger, Ralph Lauren, Calvin Klein y Michael Kors.',
    imageUrl: 'https://lh3.googleusercontent.com/aida/ALJJyrD8JpKAtMHuf1BK2Y_pnFjmhUxhCAP7rhoSJU7igtKRU0-jbqaptT5c_eJALMDuWyU-umNtBUN4bJDmYL33a7Aw4XSKF-d1DxynfqnexUo5lJU5pICv2BkUQwT8ayJbItrbS6kOjd7rCQbd6NL34efpdCliqYjucvCmU_mLQIBpRfB3AXw8oC2h2sLk_gUxAKG3PVhKg4WA2pAdw6914SPI-yP7NDP6ihaEiMrdAg',
    ratePerLb: 'Flete: $9.50/Lb',
    mobileQuickTag: 'Ofertas Flash',
    quoteLabel: 'Cotizar moda',
    whatsappMessage: 'Hola NY2Bolivia, quiero cotizar ropa y abrigos de Macy’s Herald Square',
    category: 'Moda & Sneakers',
  },
  {
    id: 'saks-5th-ave',
    name: 'Saks Fifth Avenue',
    location: 'Fifth Avenue NYC',
    discountBadge: 'Lujo & Diseñador',
    description: 'Bolsos de diseñador, relojería fina, joyería y calzado de lujo con certificados de autenticidad y despacho asegurado.',
    imageUrl: 'https://lh3.googleusercontent.com/aida/ALJJyrDPytxVo1fwIBxdNox_Wdq1YQbALLY032CGi-g1D4bYQCDiPy5Csieq3I7lu_UCpajdBooG80rONtWK1EFm4eykiNGYbcYJ6V00Gg2vFh-Al3kvVODiqfM9j663MLw58Mb40W0mtZ5eEt9AvwEswkIh-A5Wa3iLMo9x0SIzFbG3yFhSPED5rCqs1spFshqkKyDDo8C1aeJ-s9WL1bHaxYMr6zr7Gers3ZOLcnGL5iQ',
    ratePerLb: 'Flete: $9.50/Lb',
    mobileQuickTag: 'Valija Segura',
    quoteLabel: 'Cotizar lujo',
    whatsappMessage: 'Hola NY2Bolivia, quiero cotizar artículos de lujo en Saks Fifth Avenue NYC',
    category: 'Lujo & Joyería',
  },
];

const CATEGORIES = ['Todas', 'Tecnología', 'Moda & Sneakers', 'Belleza & Fragancias', 'Cámaras & Audio', 'Lujo & Joyería'] as const;

export interface StoreShowcaseProps {
  whatsappPhone?: string;
  className?: string;
}

export function StoreShowcase({
  whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_PHONE || '59177012345',
  className = '',
}: StoreShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const carouselRef = useRef<HTMLDivElement>(null);

  const filteredStores = selectedCategory === 'Todas'
    ? STORES_DATA
    : STORES_DATA.filter((s) => s.category === selectedCategory);

  const getWhatsAppUrl = (message: string) => {
    return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -290 : 290;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="tiendas" className={`w-full py-16 px-4 sm:px-6 lg:px-12 bg-surface ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Header Block: Adaptive Desktop & Mobile */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs text-secondary font-bold uppercase tracking-wider bg-secondary-fixed/50 px-2.5 py-1 rounded">
                Vitrina Comercial Manhattan
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant font-mono">
                <Icon name="verified" size={16} className="text-brand-blue" />
                Descuentos Verificados
              </span>
            </div>
            
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-on-surface tracking-tight">
              ¿Qué vas a comprar este Black Friday con hasta 70% OFF?
            </h2>
            
            <p className="font-sans text-sm sm:text-base text-on-surface-variant mt-2 leading-relaxed">
              Compra online en portales oficiales de EE.UU. o encárganos compras físicas en las tiendas más icónicas de Manhattan.
              Consolidamos tus compras en nuestro almacén de Queens sin costo extra.
            </p>
          </div>

          {/* Date Campaign Badge & Navigation Chevrons */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <span className="px-3.5 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-sans text-xs sm:text-sm font-bold shadow-sm flex items-center gap-1.5">
              <Icon name="event" size={16} />
              <span>Compras 23 Nov - 3 Dic</span>
            </span>

            {/* Carousel Arrow Controls (Visible on mobile/tablet) */}
            <div className="flex lg:hidden items-center gap-1 bg-surface-container rounded-lg p-1">
              <button
                onClick={() => scrollCarousel('left')}
                className="w-8 h-8 rounded flex items-center justify-center text-on-surface-variant hover:bg-surface-container-lowest transition-colors"
                aria-label="Ver tiendas anteriores"
              >
                <Icon name="chevron_left" size={20} />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="w-8 h-8 rounded flex items-center justify-center text-on-surface-variant hover:bg-surface-container-lowest transition-colors"
                aria-label="Ver tiendas siguientes"
              >
                <Icon name="chevron_right" size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-navy text-white shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ======================================================================
            Mobile Viewport: Touch Snap-Mandatory Horizontal Carousel ( < lg )
            ====================================================================== */}
        <div className="lg:hidden">
          <div
            ref={carouselRef}
            className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-none"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {filteredStores.map((store) => (
              <div
                key={store.id}
                className="snap-start shrink-0 w-[275px] bg-surface-container-lowest rounded-2xl overflow-hidden shadow-elevation-1 border border-outline-variant/30 flex flex-col justify-between"
              >
                {/* Store Visual with Badges */}
                <div className="relative h-40 w-full overflow-hidden bg-surface-container">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={store.imageUrl}
                    alt={`${store.name} New York Black Friday`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Location Chip */}
                  <span className="absolute top-2.5 left-2.5 bg-primary-container/85 text-white text-[11px] font-mono px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {store.location}
                  </span>

                  {/* Discount Badge */}
                  <span className="absolute bottom-2.5 right-2.5 bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                    {store.discountBadge}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-display font-bold text-base text-on-surface">
                        {store.name}
                      </h3>
                      <Icon name="star" size={16} filled className="text-brand-gold" />
                    </div>
                    <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                      {store.description}
                    </p>
                  </div>

                  {/* Flete & Direct Actions */}
                  <div className="pt-2 border-t border-outline-variant/20 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-secondary font-bold">{store.ratePerLb}</span>
                      <span className="inline-flex items-center gap-1 font-mono text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded">
                        {store.mobileQuickTag}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <a
                        href={getWhatsAppUrl(store.whatsappMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 px-3 rounded-lg bg-brand-navy hover:bg-black text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Icon name="chat" size={14} />
                        <span>{store.quoteLabel}</span>
                      </a>
                      <Link
                        href={`/registro?store=${encodeURIComponent(store.name)}`}
                        className="py-2 px-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium flex items-center justify-center transition-colors"
                        title="Pre-alertar compra de esta tienda"
                      >
                        <Icon name="add_shopping_cart" size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-on-surface-variant font-mono mt-2">
            Desliza para ver más tiendas de New York &rarr;
          </p>
        </div>

        {/* ======================================================================
            Desktop Viewport: Responsive 3x2 Grid ( >= lg )
            ====================================================================== */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStores.map((store) => (
            <div
              key={store.id}
              className="flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-elevation-1 hover:shadow-elevation-3 transition-all duration-300 border border-outline-variant/30 group"
            >
              {/* Image Header with Interactive Zoom */}
              <div className="relative h-56 overflow-hidden bg-surface-container">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={store.imageUrl}
                  alt={`${store.name} Black Friday New York`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                {/* Black Friday Red Urgency Pill */}
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-error text-white font-sans text-xs font-bold shadow-md flex items-center gap-1">
                  <Icon name="local_offer" size={14} />
                  <span>{store.discountBadge}</span>
                </span>

                {/* Location Badge */}
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-brand-navy/85 backdrop-blur text-white font-mono text-xs font-medium">
                  {store.location}
                </span>

                {store.isPopular && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-brand-gold text-brand-navy font-sans text-xs font-extrabold shadow">
                    Top Elegida
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-bold text-xl text-on-surface group-hover:text-secondary transition-colors">
                      {store.name}
                    </h3>
                    <div className="flex items-center text-brand-gold">
                      <Icon name="star" size={18} filled />
                    </div>
                  </div>

                  <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                    {store.description}
                  </p>
                </div>

                {/* Footer with Rate & Actions */}
                <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="font-mono text-xs text-on-surface-variant">Tarifa aérea fija</span>
                    <span className="font-mono text-sm text-secondary font-bold">{store.ratePerLb}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/registro?store=${encodeURIComponent(store.name)}`}
                      className="px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-sans text-xs font-semibold transition-colors flex items-center gap-1"
                      title="Registrar o Pre-alertar pedido de esta tienda"
                    >
                      <Icon name="add" size={14} />
                      <span>Pre-alerta</span>
                    </Link>

                    <a
                      href={getWhatsAppUrl(store.whatsappMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-sans text-xs font-bold bg-brand-navy hover:bg-secondary text-white px-3.5 py-2 rounded-lg shadow-sm transition-all hover:scale-105"
                    >
                      <span>{store.quoteLabel}</span>
                      <Icon name="arrow_forward" size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Assistance Callout Footer Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-primary-container via-brand-navy to-secondary text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-elevation-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Icon name="shopping_bag" size={28} className="text-tertiary-fixed-dim" />
            </div>
            <div>
              <h4 className="font-display font-bold text-lg text-white">¿Buscas otra tienda o producto especial en USA?</h4>
              <p className="text-sm text-primary-fixed leading-relaxed">
                Compramos en Best Buy, Target, Walmart, eBay, Amazon USA o boutiques exclusivas de SoHo.
              </p>
            </div>
          </div>

          <a
            href={getWhatsAppUrl('Hola NY2Bolivia, busco un producto de una tienda que no está en la lista. ¿Me pueden ayudar a cotizarlo?')}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-5 py-3 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-display font-bold text-sm shadow transition-transform hover:scale-105 flex items-center gap-2"
          >
            <Icon name="chat" size={18} />
            <span>Consultar Tienda Personalizada</span>
          </a>
        </div>

      </div>
    </section>
  );
}

export default StoreShowcase;
