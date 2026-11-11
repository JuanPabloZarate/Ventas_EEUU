'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@/components/ui/Icon';

export interface DealItem {
  id: string;
  store: string;
  brand: string;
  isAmericanBrand: boolean;
  title: string;
  category: 'Moda' | 'Lifestyle' | 'Belleza' | 'Tech' | 'Gaming';
  image: string;
  originalPrice: number;
  dealPrice: number;
  savings: number;
  discountPercent: number;
  bfScore: number; // Puntaje de 0 a 10 como Verdadera Oferta Black Friday
  bfVerificationNote: string;
  ecommerceDates: string; // Fechas clave de compra en eCommerce de USA
  ecommercePhase: 'Early Black Friday' | 'Thanksgiving Drop' | 'Black Friday Oficial' | 'Cyber Monday';
  taxNote: string;
  tag: string;
  christmasTag: string;
  highlights: string;
  buyUrl: string;
}

// Catálogo ordenado estratégicamente:
// 1. Marcas Americanas con los mayores descuentos arriba (77%, 75%, 65%, 54%, 45%, 44%...)
// 2. Electrónicos agrupados al final de la lista según requerimiento
export const TOP_DEALS: DealItem[] = [
  // 1. COACH (Top 1 Ahorro & Descuento - 77% OFF)
  {
    id: 'coach-city-tote',
    store: 'Coach Outlet Woodbury NY',
    brand: 'Coach',
    isAmericanBrand: true,
    title: 'Cartera City Tote Signature Canvas',
    category: 'Moda',
    image: '/images/deals/coach-tote.jpg',
    originalPrice: 398,
    dealPrice: 89,
    savings: 309,
    discountPercent: 77,
    bfScore: 10,
    bfVerificationNote: 'Mínimo histórico anual comprobado en Woodbury Common Outlets',
    ecommerceDates: 'Apertura Online: 20 Nov - 2 Dic',
    ecommercePhase: 'Early Black Friday',
    taxNote: '0% Sales Tax en NYC (menos de $110)',
    tag: '77% OFF',
    christmasTag: '👜 Lujo Navideño',
    highlights: 'Cuero genuino y lona estampada emblemática con espacio generoso para oficina o viajes.',
    buyUrl: 'https://www.coachoutlet.com/products/city-tote-in-signature-canvas/5696.html',
  },

  // 2. MICHAEL KORS (Top 2 Ahorro - 75% OFF)
  {
    id: 'michael-kors-tote',
    store: "Macy's / MK Outlet NYC",
    brand: 'Michael Kors',
    isAmericanBrand: true,
    title: 'Bolso Jet Set Travel Large Saffiano Leather',
    category: 'Moda',
    image: '/images/deals/michael-kors-tote.jpg',
    originalPrice: 358,
    dealPrice: 89,
    savings: 269,
    discountPercent: 75,
    bfScore: 9.9,
    bfVerificationNote: 'Liquidación oficial Black Friday en tiendas de Manhattan',
    ecommerceDates: 'Web Drop: 23 Nov - 1 Dic',
    ecommercePhase: 'Black Friday Oficial',
    taxNote: '0% Sales Tax en NYC (menos de $110)',
    tag: '75% OFF',
    christmasTag: '✨ Elegancia Manhattan',
    highlights: 'Cuero Saffiano de alta resistencia con herrajes dorados y cierre superior completo.',
    buyUrl: 'https://www.michaelkors.com/sale',
  },

  // 3. TOMMY HILFIGER (Top 3 Ahorro - 65% OFF)
  {
    id: 'tommy-puffer',
    store: "Macy's Herald Sq",
    brand: 'Tommy Hilfiger',
    isAmericanBrand: true,
    title: 'Puffer Jacket Térmica de Invierno Clásica',
    category: 'Moda',
    image: '/images/deals/tommy-jacket.jpg',
    originalPrice: 225,
    dealPrice: 79,
    savings: 146,
    discountPercent: 65,
    bfScore: 9.8,
    bfVerificationNote: "Doorbuster #1 de Macy's Herald Sq con 0% Sales Tax",
    ecommerceDates: 'Acceso Online: 23 Nov - 30 Nov',
    ecommercePhase: 'Early Black Friday',
    taxNote: '0% Sales Tax en NYC (menos de $110)',
    tag: '65% OFF',
    christmasTag: '❄️ Invierno Manhattan',
    highlights: 'Aislamiento ultra liviano resistente al agua con diseño clásico neoyorquino y logo en pecho.',
    buyUrl: 'https://www.macys.com/shop/mens-clothing/mens-jackets-coats/Brand/Tommy%20Hilfiger?id=3763',
  },

  // 4. COLUMBIA SPORTSWEAR (54% OFF)
  {
    id: 'columbia-fleece',
    store: 'Columbia Sportswear NYC',
    brand: 'Columbia',
    isAmericanBrand: true,
    title: 'Chaqueta Polar Steens Mountain / Benton Springs',
    category: 'Moda',
    image: '/images/deals/columbia-fleece.jpg',
    originalPrice: 65,
    dealPrice: 29.99,
    savings: 35.01,
    discountPercent: 54,
    bfScore: 9.5,
    bfVerificationNote: 'Precio liquidación pre-navideño sin impuestos locales',
    ecommerceDates: 'Online Door-Buster: 24 Nov - 2 Dic',
    ecommercePhase: 'Thanksgiving Drop',
    taxNote: '0% Sales Tax en NYC (menos de $110)',
    tag: '54% OFF',
    christmasTag: '🏔️ Abrigo & Outdoor',
    highlights: 'Tejido polar de micropolar suave de 250g con cremallera completa para máximo abrigo.',
    buyUrl: 'https://www.columbia.com/c/sale/',
  },

  // 5. LEVI'S (45% OFF)
  {
    id: 'levis-501-jeans',
    store: "Levi's Store Times Sq / SoHo",
    brand: "Levi's",
    isAmericanBrand: true,
    title: "Jeans 501 Original Fit Denim Clásico",
    category: 'Moda',
    image: '/images/deals/levis-501.jpg',
    originalPrice: 79.5,
    dealPrice: 44.0,
    savings: 35.5,
    discountPercent: 45,
    bfScore: 9.6,
    bfVerificationNote: '40% storewide + cupón digital web acumulable',
    ecommerceDates: 'Cyber Week eCommerce: 25 Nov - 1 Dic',
    ecommercePhase: 'Black Friday Oficial',
    taxNote: '0% Sales Tax en NYC (menos de $110)',
    tag: '45% OFF',
    christmasTag: '👖 Icono Americano',
    highlights: 'El corte recto legendario de mezclilla 100% algodón con bragueta de botones emblemática.',
    buyUrl: 'https://www.levi.com/US/en_US/clothing/men/jeans/501-original-fit-mens-jeans/p/005010114',
  },

  // 6. NIKE (44% OFF)
  {
    id: 'nike-pegasus',
    store: 'Nike 5th Ave / Nike US',
    brand: 'Nike',
    isAmericanBrand: true,
    title: 'Zapatillas Running Air Zoom Pegasus 40 / 41',
    category: 'Moda',
    image: '/images/deals/nike-pegasus.jpg',
    originalPrice: 140,
    dealPrice: 79,
    savings: 61,
    discountPercent: 44,
    bfScore: 9.7,
    bfVerificationNote: 'Rebaja oficial Nike Members + 0% Sales Tax en NYC',
    ecommerceDates: 'Nike Members Early: 22 Nov - 30 Nov',
    ecommercePhase: 'Early Black Friday',
    taxNote: '0% Sales Tax en NYC (menos de $110)',
    tag: '44% OFF',
    christmasTag: '👟 Estilo Deportivo',
    highlights: 'Espuma React reactiva y doble unidad Zoom Air para máximo confort diario y entrenamiento.',
    buyUrl: 'https://www.nike.com/w/mens-pegasus-running-shoes-37v7jznik1zy7ok',
  },

  // 7. STANLEY 1913 (35% OFF - El termo más codiciado)
  {
    id: 'stanley-quencher',
    store: 'Target / Amazon / REI',
    brand: 'Stanley 1913',
    isAmericanBrand: true,
    title: 'Vaso Térmico The Quencher H2.0 FlowState 40oz',
    category: 'Lifestyle',
    image: '/images/deals/stanley-quencher.jpg',
    originalPrice: 45,
    dealPrice: 29.0,
    savings: 16.0,
    discountPercent: 35,
    bfScore: 9.6,
    bfVerificationNote: 'El termo viral de USA con descuento real por primera vez',
    ecommerceDates: 'Flash Sale Online: 26 Nov - 1 Dic',
    ecommercePhase: 'Thanksgiving Drop',
    taxNote: 'El regalo más pedido de fin de año',
    tag: '35% OFF',
    christmasTag: '🥤 Viral en Redes USA',
    highlights: 'Acero inoxidable reciclado al 90%, tapa FlowState con 3 posiciones y aislamiento térmico 48h.',
    buyUrl: 'https://www.amazon.com/dp/B0BN2C17D8',
  },

  // 8. SOL DE JANEIRO (35% OFF)
  {
    id: 'sol-de-janeiro-set',
    store: 'Sephora Times Sq',
    brand: 'Sol de Janeiro',
    isAmericanBrand: true,
    title: 'Set Festivo Brazilian Bum Bum Cream & Mist Holiday',
    category: 'Belleza',
    image: '/images/deals/sol-de-janeiro.jpg',
    originalPrice: 68,
    dealPrice: 44.0,
    savings: 24.0,
    discountPercent: 35,
    bfScore: 9.4,
    bfVerificationNote: 'Cofre festivo exclusivo de Sephora Times Sq (Valor $95)',
    ecommerceDates: 'Sephora App Early: 24 Nov - 1 Dic',
    ecommercePhase: 'Early Black Friday',
    taxNote: 'Edición limitada con cofre de regalo',
    tag: '35% OFF',
    christmasTag: '💄 Set Festivo Exclusivo',
    highlights: 'Fragancia Cheirosa 68 irresistible con crema hidratante reafirmante corporal de culto.',
    buyUrl: 'https://www.sephora.com/brand/sol-de-janeiro',
  },

  // 9. DYSON BEAUTY ($100 OFF)
  {
    id: 'dyson-airwrap',
    store: 'Sephora / Best Buy',
    brand: 'Dyson',
    isAmericanBrand: false,
    title: 'Dyson Airwrap Multi-Styler Complete Long',
    category: 'Belleza',
    image: '/images/deals/dyson-airwrap.jpg',
    originalPrice: 599,
    dealPrice: 499,
    savings: 100,
    discountPercent: 17,
    bfScore: 9.3,
    bfVerificationNote: '$100 USD de descuento directo en edición limitada navideña',
    ecommerceDates: 'Venta Online Oficial: 26 Nov - 1 Dic',
    ecommercePhase: 'Cyber Monday',
    taxNote: 'Edición festiva con estuche rígido incluido',
    tag: '$100 OFF',
    christmasTag: '✨ Lujo & Cuidado Capilar',
    highlights: 'Estilizado por efecto Coanda por aire sin daño térmico extremo. Muy codiciado para regalo.',
    buyUrl: 'https://www.sephora.com/product/airwrap-styler-P437999',
  },

  // --- SECCIÓN FINAL: ELECTRÓNICOS & TECH (Agrupados al final) ---

  // 10. SONY NOISE CANCELLING (38% OFF)
  {
    id: 'sony-wh1000xm5',
    store: 'Best Buy / Amazon',
    brand: 'Sony',
    isAmericanBrand: false,
    title: 'Auriculares Noise Cancelling WH-1000XM5',
    category: 'Tech',
    image: '/images/deals/sony-headphones.jpg',
    originalPrice: 399.99,
    dealPrice: 248.0,
    savings: 151.99,
    discountPercent: 38,
    bfScore: 9.9,
    bfVerificationNote: 'Rebaja histórica directa en caja comprobada en Amazon & Best Buy',
    ecommerceDates: 'Doorbuster Online: 21 Nov - 1 Dic',
    ecommercePhase: 'Black Friday Oficial',
    taxNote: 'Rebaja histórica en audio de alta gama',
    tag: '38% OFF',
    christmasTag: '🎧 El regalo más pedido',
    highlights: 'Líder indiscutible en cancelación activa de ruido con procesador V1 y batería de 30 horas.',
    buyUrl: 'https://www.amazon.com/dp/B09XS7JWHH',
  },

  // 11. APPLE MACBOOK AIR M2 ($250 OFF)
  {
    id: 'macbook-air-m2',
    store: 'Best Buy NYC',
    brand: 'Apple',
    isAmericanBrand: true,
    title: 'MacBook Air 13" (Chip M2, 16GB RAM, 256GB SSD)',
    category: 'Tech',
    image: '/images/deals/macbook-air.jpg',
    originalPrice: 999,
    dealPrice: 749,
    savings: 250,
    discountPercent: 25,
    bfScore: 9.8,
    bfVerificationNote: 'El mayor doorbuster de computación en Best Buy USA ($250 OFF directo)',
    ecommerceDates: 'Apertura Web Nacional: 20 Nov - 30 Nov',
    ecommercePhase: 'Early Black Friday',
    taxNote: 'Ahorro masivo en efectivo directo',
    tag: 'Doorbuster #1',
    christmasTag: '🎁 Regalo Top Tech',
    highlights: '16GB de memoria unificada de serie, chasis ultra delgado de aluminio y autonomía de 18 horas.',
    buyUrl: 'https://www.bestbuy.com/site/apple-macbook-air-13-inch-laptop-m2-chip-16gb-memory-256gb-ssd-midnight/6509650.p',
  },

  // 12. APPLE AIRPODS PRO 2 ($60 OFF)
  {
    id: 'airpods-pro-2',
    store: 'Best Buy / B&H Photo',
    brand: 'Apple',
    isAmericanBrand: true,
    title: 'AirPods Pro 2 (USB-C MagSafe)',
    category: 'Tech',
    image: '/images/deals/airpods-pro.jpg',
    originalPrice: 249,
    dealPrice: 189,
    savings: 60,
    discountPercent: 24,
    bfScore: 9.7,
    bfVerificationNote: 'Descuento en efectivo directo en caja vs tarjetas de regalo de Apple',
    ecommerceDates: 'Venta Online Oficial: 22 Nov - 1 Dic',
    ecommercePhase: 'Early Black Friday',
    taxNote: 'Descuento directo en efectivo',
    tag: '$60 OFF',
    christmasTag: '✨ Sorpresa Navideña',
    highlights: 'Cancelación activa de ruido 2x mejorada, audio espacial personalizado y estuche USB-C.',
    buyUrl: 'https://www.bhphotovideo.com/c/product/1785392-REG/apple_mtjv3am_a_airpods_pro_2nd_generation.html',
  },

  // 13. PLAYSTATION 5 SLIM BUNDLE (Gaming al final)
  {
    id: 'ps5-slim-bundle',
    store: 'Best Buy / Target',
    brand: 'Sony PlayStation',
    isAmericanBrand: false,
    title: 'PlayStation 5 Slim Disc Edition + Juego Triple A',
    category: 'Gaming',
    image: '/images/deals/ps5-slim.jpg',
    originalPrice: 499.99,
    dealPrice: 449.99,
    savings: 50,
    discountPercent: 10,
    bfScore: 9.2,
    bfVerificationNote: 'Pack oficial navideño con juego de $70 USD incluido sin costo',
    ecommerceDates: 'Gaming Week eCommerce: 23 Nov - 30 Nov',
    ecommercePhase: 'Cyber Monday',
    taxNote: 'Incluye juego gratis ($70 USD valor)',
    tag: 'Pack Gamer',
    christmasTag: '🎮 El regalo soñado',
    highlights: 'Chasis compacto de 1TB SSD con lector de discos Blu-Ray Ultra HD y control inalámbrico DualSense.',
    buyUrl: 'https://www.bestbuy.com/site/playstation-5-slim-console/6564757.p',
  },
];

// Fechas Clave de Compra en eCommerce de EE.UU.
export const ECOMMERCE_DATES_GUIDE = [
  {
    phase: '1. Early Black Friday',
    dates: '17 al 26 de Noviembre',
    storeHighlights: 'Amazon, Target, Best Buy, Coach Outlet',
    description: 'Preventas online con lanzamientos escalonados. Momento ideal para asegurar stock de marcas americanas antes de que se agoten.',
    badge: 'Stock Asegurado',
    color: 'border-blue-500/40 bg-blue-500/5',
  },
  {
    phase: '2. Thanksgiving Web Drop',
    dates: 'Jueves 27 de Noviembre',
    storeHighlights: "Macy's, Nike US, Levi's, Sephora",
    description: 'Las tiendas físicas en Nueva York cierran por feriado, pero sus páginas web activan los mayores cupones y Doorbusters a las 00:00 EST.',
    badge: 'Apertura Doorbusters',
    color: 'border-amber-500/40 bg-amber-500/5',
  },
  {
    phase: '3. Black Friday Oficial',
    dates: 'Viernes 28 de Noviembre',
    storeHighlights: 'Todas las tiendas de EE.UU. (Web & Outlets)',
    description: 'Pico mundial de ventas. Descuentos de hasta 77% en carteras, zapatillas, abrigos y tecnología. Las mejores liquidaciones en vivo.',
    badge: 'Máximas Rebajas',
    color: 'border-red-500/40 bg-red-500/5',
  },
  {
    phase: '4. Cyber Weekend',
    dates: '29 y 30 de Noviembre',
    storeHighlights: 'Woodbury Outlets Online, Michael Kors, Columbia',
    description: 'Remates especiales de fin de semana para compras de moda y regalos familiares que no se agotaron el viernes.',
    badge: 'Liquidación Outlets',
    color: 'border-purple-500/40 bg-purple-500/5',
  },
  {
    phase: '5. Cyber Monday',
    dates: 'Lunes 1 de Diciembre',
    storeHighlights: 'Best Buy, B&H Photo, Amazon, Sephora',
    description: 'El día rey del comercio electrónico estadounidense. Ofertas insuperables en laptops, auriculares, consolas y cofres de belleza.',
    badge: 'Récord Online',
    color: 'border-emerald-500/40 bg-emerald-500/5',
  },
  {
    phase: '6. Cierre de Envíos Navideños',
    dates: '4 de Diciembre (NYC)',
    storeHighlights: 'Almacén Nueva York ➔ Vuelo Directo Bolivia',
    description: 'Fecha límite de recepción de paquetes en nuestro casillero de Manhattan para garantizar entrega en Bolivia antes de Nochebuena.',
    badge: 'Llega para Navidad',
    color: 'border-secondary/40 bg-secondary/5',
  },
];

export function TopDealsShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<
    'Todas' | 'Marcas Americanas' | 'Moda & Outlets' | 'Lifestyle & Belleza' | 'Electrónicos & Gaming'
  >('Todas');

  const [sortBy, setSortBy] = useState<'discount' | 'savings' | 'bfScore'>('discount');
  const [showCalendar, setShowCalendar] = useState<boolean>(true);

  // Filtrado y Ordenamiento
  const processedDeals = useMemo(() => {
    // 1. Filtrar por categoría
    let list = TOP_DEALS.filter((deal) => {
      if (selectedCategory === 'Todas') return true;
      if (selectedCategory === 'Marcas Americanas') return deal.isAmericanBrand;
      if (selectedCategory === 'Moda & Outlets') return deal.category === 'Moda';
      if (selectedCategory === 'Lifestyle & Belleza')
        return deal.category === 'Lifestyle' || deal.category === 'Belleza';
      if (selectedCategory === 'Electrónicos & Gaming')
        return deal.category === 'Tech' || deal.category === 'Gaming';
      return true;
    });

    // 2. Ordenar manteniendo los requerimientos:
    // Si la categoría es 'Todas', mostramos marcas americanas / moda primero ordenadas por la opción seleccionada,
    // y dejamos los electrónicos SIEMPRE AL FINAL de la lista.
    if (selectedCategory === 'Todas') {
      const nonTech = list.filter((d) => d.category !== 'Tech' && d.category !== 'Gaming');
      const tech = list.filter((d) => d.category === 'Tech' || d.category === 'Gaming');

      const sortFn = (a: DealItem, b: DealItem) => {
        if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
        if (sortBy === 'savings') return b.savings - a.savings;
        if (sortBy === 'bfScore') return b.bfScore - a.bfScore;
        return 0;
      };

      nonTech.sort(sortFn);
      tech.sort(sortFn);

      return [...nonTech, ...tech];
    }

    // Para filtros específicos, ordenar directamente
    return [...list].sort((a, b) => {
      if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
      if (sortBy === 'savings') return b.savings - a.savings;
      if (sortBy === 'bfScore') return b.bfScore - a.bfScore;
      return 0;
    });
  }, [selectedCategory, sortBy]);

  return (
    <section
      id="ofertas-estrella"
      className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest border-y border-outline-variant/20"
    >
      <div className="max-w-7xl mx-auto space-y-10">

        {/* ========================================================================= */}
        {/* HEADER: Enfoque en Marcas Americanas, Mejores Ofertas y Verdadera Rebaja */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-full bg-secondary-fixed/40 text-secondary text-xs font-semibold">
              <span className="flex items-center gap-1">
                <span>🇺🇸</span>
                <span>Marcas Americanas de Culto</span>
              </span>
              <span className="text-secondary/30">•</span>
              <span className="text-error font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                <span>Puntos de Black Friday: Rebajas Reales Comprobadas</span>
              </span>
              <span className="text-secondary/30">•</span>
              <span className="font-mono text-[11px] text-primary-container font-bold">
                Llega a Bolivia para Navidad
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-on-surface tracking-tight">
              Ofertas Black Friday USA: Marcas Americanas & Oportunidades Reales
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant font-sans leading-relaxed">
              Priorizamos <strong className="text-on-surface font-semibold">Coach, Nike, Tommy Hilfiger, Levi&apos;s, Stanley y Michael Kors</strong> con las mayores rebajas comprobadas (0% tax en NYC en ropa/calzado &lt;$110), pasando al final electrónica y gaming. Compara precios oficiales y reserva tu compra asistida o casillero.
            </p>
          </div>

          {/* Selector de Orden */}
          <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant/30 self-start lg:self-auto shrink-0">
            <span className="text-[11px] font-semibold text-on-surface-variant px-2 flex items-center gap-1">
              <Icon name="tune" size={14} />
              <span>Ordenar:</span>
            </span>
            <button
              onClick={() => setSortBy('discount')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                sortBy === 'discount'
                  ? 'bg-surface text-on-surface shadow-xs font-bold text-primary-container'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Mayor Descuento %
            </button>
            <button
              onClick={() => setSortBy('savings')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                sortBy === 'savings'
                  ? 'bg-surface text-on-surface shadow-xs font-bold text-primary-container'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Mayor Ahorro ($ USD)
            </button>
            <button
              onClick={() => setSortBy('bfScore')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                sortBy === 'bfScore'
                  ? 'bg-surface text-on-surface shadow-xs font-bold text-primary-container'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Puntos Black Friday
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CALENDARIO ECOMMERCE BLACK FRIDAY: Fechas Clave de Compra Online en USA   */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-br from-[#0c182c] via-[#0f213a] to-[#0a1424] rounded-3xl p-5 sm:p-7 text-white border border-white/10 shadow-lg relative overflow-hidden">
          {/* Luz ambiental sutil */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="relative space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-secondary/20 border border-secondary/40 text-secondary-fixed flex items-center justify-center shrink-0">
                  <Icon name="event" size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-base sm:text-lg text-white">
                      Calendario eCommerce Black Friday USA 2026 / 2025
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      Fechas Críticas de Compra Online
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Conoce exactamente cuándo se liberan los descuentos en las webs oficiales para no quedarte sin stock de tallas y colores.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-slate-200 font-semibold transition-all flex items-center gap-1.5 border border-white/15"
              >
                <Icon name={showCalendar ? 'expand_less' : 'expand_more'} size={16} />
                <span>{showCalendar ? 'Minimizar Calendario' : 'Ver Calendario Completo'}</span>
              </button>
            </div>

            {/* Grid de Fechas eCommerce */}
            {showCalendar && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2 animate-fadeIn">
                {ECOMMERCE_DATES_GUIDE.map((item, idx) => (
                  <div
                    key={idx}
                    className={`rounded-2xl p-4 border transition-all hover:border-white/30 backdrop-blur-sm ${item.color}`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-display font-bold text-xs text-white">
                        {item.phase}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/15 text-slate-100 font-bold">
                        {item.badge}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-amber-300 mb-1 flex items-center gap-1">
                      <Icon name="schedule" size={13} />
                      <span>{item.dates}</span>
                    </div>

                    <p className="text-[11px] text-slate-200 leading-relaxed mb-2">
                      {item.description}
                    </p>

                    <div className="text-[10px] text-slate-400 flex items-center gap-1 border-t border-white/10 pt-2 font-mono">
                      <Icon name="storefront" size={12} className="text-secondary-fixed shrink-0" />
                      <span className="truncate">{item.storeHighlights}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tip Operativo para Bolivia */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-300">
              <span className="flex items-center gap-2">
                <span className="text-amber-400 text-sm">💡</span>
                <span>
                  <strong>Recomendación logística:</strong> Si compras online por tu cuenta con tu tarjeta, envía tus paquetes a nuestro casillero en Manhattan antes del <strong>2 de Diciembre</strong> para asegurar su llegada en el vuelo directo a Bolivia.
                </span>
              </span>
              <Link
                href="/registro"
                className="text-secondary-fixed hover:underline font-bold shrink-0 flex items-center gap-1"
              >
                <span>Solicitar Casillero / Compra</span>
                <Icon name="arrow_forward" size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CATEGORÍAS & FILTROS (Electrónicos al final de las pestañas)              */}
        {/* ========================================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant/20 pb-4">
          <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-2xl overflow-x-auto max-w-full">
            {(
              [
                'Todas',
                'Marcas Americanas',
                'Moda & Outlets',
                'Lifestyle & Belleza',
                'Electrónicos & Gaming',
              ] as const
            ).map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-surface text-on-surface shadow-xs font-bold text-primary-container'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {cat === 'Marcas Americanas' && <span>🇺🇸</span>}
                  {cat === 'Moda & Outlets' && <span>👜</span>}
                  {cat === 'Lifestyle & Belleza' && <span>💄</span>}
                  {cat === 'Electrónicos & Gaming' && <span>⚡</span>}
                  <span>{cat}</span>
                  <span className="text-[10px] opacity-60 font-mono">
                    (
                    {cat === 'Todas'
                      ? TOP_DEALS.length
                      : cat === 'Marcas Americanas'
                      ? TOP_DEALS.filter((d) => d.isAmericanBrand).length
                      : cat === 'Moda & Outlets'
                      ? TOP_DEALS.filter((d) => d.category === 'Moda').length
                      : cat === 'Lifestyle & Belleza'
                      ? TOP_DEALS.filter((d) => d.category === 'Lifestyle' || d.category === 'Belleza').length
                      : TOP_DEALS.filter((d) => d.category === 'Tech' || d.category === 'Gaming').length}
                    )
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-on-surface-variant flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Mostrando {processedDeals.length} ofertas verificadas con fotos oficiales</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* GRID DE PRODUCTOS: Con Fotos, Puntos Black Friday & Fechas eCommerce      */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {processedDeals.map((deal) => {
            const isTech = deal.category === 'Tech' || deal.category === 'Gaming';

            return (
              <div
                key={deal.id}
                className={`group bg-surface rounded-2xl border transition-all duration-300 hover:shadow-md flex flex-col justify-between overflow-hidden ${
                  deal.isAmericanBrand
                    ? 'border-secondary/30 hover:border-secondary'
                    : 'border-outline-variant/30 hover:border-outline-variant'
                }`}
              >
                {/* 1. SECCIÓN DE IMAGEN DEL PRODUCTO CON PUNTOS DE BLACK FRIDAY */}
                <div className="relative w-full aspect-[4/3] bg-surface-container-low overflow-hidden">
                  <Image
                    src={deal.image}
                    alt={`${deal.title} - Oferta Black Friday en ${deal.store}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradiente sutil superior e inferior para legibilidad de badges */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none"></div>

                  {/* Badges Superiores */}
                  <div className="absolute top-2.5 inset-x-2.5 flex items-start justify-between gap-1 pointer-events-none">
                    {/* Badge de Marca Americana si corresponde */}
                    {deal.isAmericanBrand ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-white text-[10px] font-bold border border-white/20 shadow-xs">
                        <span>🇺🇸</span>
                        <span>Marca USA</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-slate-200 text-[10px] font-semibold border border-white/10">
                        {deal.brand}
                      </span>
                    )}

                    {/* Porcentaje de Descuento destacado */}
                    <span className="font-extrabold text-white bg-error px-2 py-0.5 rounded-md text-[11px] shadow-sm tracking-tight">
                      {deal.tag}
                    </span>
                  </div>

                  {/* PUNTOS DE BLACK FRIDAY (Marcador de Verdadera Oferta) */}
                  <div className="absolute bottom-2.5 inset-x-2.5 flex items-end justify-between gap-1 pointer-events-none">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[11px] font-bold shadow-md">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Puntos BF: {deal.bfScore}/10</span>
                      <span className="text-white/40">•</span>
                      <span className="text-[10px] text-white font-medium">Verdadera Oferta</span>
                    </div>

                    <span className="text-[10px] font-medium text-white/90 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-right truncate max-w-[120px]">
                      {deal.store.split('/')[0]}
                    </span>
                  </div>
                </div>

                {/* 2. CUERPO DE LA TARJETA */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    {/* Micro-etiqueta Navideña & Categoría */}
                    <div className="flex items-center justify-between gap-1">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 text-[10px] font-bold border border-amber-200/80">
                        {deal.christmasTag}
                      </span>

                      {isTech ? (
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          Electrónicos
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-secondary bg-secondary-fixed/30 px-1.5 py-0.5 rounded font-semibold">
                          Moda & Outlet
                        </span>
                      )}
                    </div>

                    {/* Título y Marca */}
                    <div>
                      <span className="text-[11px] font-bold text-secondary tracking-wide uppercase">
                        {deal.brand}
                      </span>
                      <h3 className="font-display font-bold text-sm text-on-surface line-clamp-2 leading-snug">
                        {deal.title}
                      </h3>
                      <p className="text-xs text-on-surface-variant line-clamp-2 mt-1 leading-relaxed">
                        {deal.highlights}
                      </p>
                    </div>

                    {/* Verificación de Oferta Real */}
                    <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200/60 rounded-lg p-1.5 flex items-start gap-1.5">
                      <Icon name="verified" size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-tight text-[10.5px]">
                        <strong>Oferta Real:</strong> {deal.bfVerificationNote}
                      </span>
                    </div>

                    {/* FECHAS DE COMPRA EN ECOMMERCE (Black Friday & Cyber Week) */}
                    <div className="text-[11px] text-blue-900 bg-blue-50 border border-blue-200/70 rounded-lg p-1.5 flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <Icon name="calendar_month" size={13} className="text-secondary shrink-0" />
                        <span className="font-semibold text-[10.5px] truncate">
                          {deal.ecommerceDates}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono font-bold bg-white/80 px-1.5 py-0.5 rounded text-secondary shrink-0 border border-blue-100">
                        {deal.ecommercePhase}
                      </span>
                    </div>
                  </div>

                  {/* 3. PRECIOS, TAXES Y BOTONES DE ACCIÓN */}
                  <div className="pt-3 border-t border-outline-variant/20 space-y-2.5">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xs text-on-surface-variant line-through mr-1.5">
                          ${deal.originalPrice.toFixed(0)}
                        </span>
                        <span className="text-xl font-extrabold font-display text-primary-container">
                          ${deal.dealPrice.toFixed(0)}{' '}
                          <span className="text-xs font-normal text-on-surface-variant">USD</span>
                        </span>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                        Ahorras ${deal.savings.toFixed(0)}
                      </span>
                    </div>

                    {/* Nota Fiscal de NYC */}
                    <div className="text-[10px] text-on-surface-variant bg-surface-container-low px-2 py-1 rounded-md flex items-center gap-1">
                      <Icon name="info" size={12} className="text-secondary shrink-0" />
                      <span className="truncate">{deal.taxNote}</span>
                    </div>

                    {/* Botones: 1) Link Oficial de la Tienda y 2) Pedir / Traer */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <a
                        href={deal.buyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Ver en la tienda oficial de EE.UU."
                        className="py-2 px-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-sans text-xs font-semibold flex items-center justify-center gap-1 transition-all border border-outline-variant/30 text-center"
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
              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* BANNER INFORMATIVO: Ventaja Fiscal 0% Taxes NYC + Fechas de Vuelo        */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Tarjeta 1: Ventaja Fiscal 0% Tax NYC */}
          <div className="bg-surface-container-low rounded-2xl p-5 flex items-start gap-3.5 border border-outline-variant/20">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <Icon name="percent" size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-on-surface">
                0% Impuestos en NYC en ropa y calzado menor a $110 USD
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                En Nueva York ahorras automáticamente el impuesto estatal y local (8.875%) en cada prenda individual por debajo de $110. ¡Aplica para carteras en outlets, chaquetas Tommy Hilfiger, zapatillas Nike y jeans Levi&apos;s!
              </p>
            </div>
          </div>

          {/* Tarjeta 2: Vuelo Navideño a Bolivia */}
          <div className="bg-surface-container-low rounded-2xl p-5 flex items-start gap-3.5 border border-outline-variant/20">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Icon name="flight_takeoff" size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-on-surface">
                Vuelo Directo a Bolivia: Recibe antes del 24 de Diciembre
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Tus compras de Black Friday se consolidan en nuestro almacén de Manhattan y viajan en el vuelo con entrega garantizada desde el <strong>4 de Diciembre</strong> en Santa Cruz, La Paz y Cochabamba.
              </p>
              <Link
                href="/registro"
                className="inline-flex items-center gap-1 text-xs font-bold text-secondary hover:underline pt-1"
              >
                <span>Registrar compra asistida o casillero</span>
                <Icon name="arrow_forward" size={13} />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default TopDealsShowcase;
