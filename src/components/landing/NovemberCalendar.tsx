'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { BrandLogo } from '@/components/ui/BrandLogo';

export interface CalendarStore {
  name: string;
  subchannel: string;
  logoType: string;
  officialUrl: string;
  strongDeal: string;
  dealTag: string;
  category: string;
  taxNote?: string;
}

export interface ShoppingPhase {
  id: string;
  phaseNumber: number;
  dateRange: string;
  daysRangeLabel: string;
  calendarDays: number[]; // Días de noviembre que corresponden
  title: string;
  badge: string;
  badgeColor: string; // Tailwind classes
  calendarColor: string; // Tailwind classes for day buttons
  didacticFocus: string;
  didacticTip: string;
  recommendedCategory: string;
  stores: CalendarStore[];
}

export const NOVEMBER_PHASES: ShoppingPhase[] = [
  {
    id: 'fase-1',
    phaseNumber: 1,
    dateRange: '1 al 14 de Noviembre',
    daysRangeLabel: '1 - 14 Nov',
    calendarDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    title: 'Apertura de Ofertas & Belleza Preventiva',
    badge: '🟢 YA ACTIVO EN NOVIEMBRE',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    calendarColor: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-200 hover:bg-emerald-900/80',
    didacticFocus: 'Sets festivos de belleza, perfumería y abrigos de invierno antes del colapso de inventario.',
    didacticTip:
      'Las tiendas de cosmética como Sephora adelantan sus cofres navideños y rara vez bajan más de precio después. Ideal para asegurar regalos de lujo antes de que se agoten.',
    recommendedCategory: 'Belleza, Perfumes & Abrigos de Temporada',
    stores: [
      {
        name: 'Sephora USA',
        subchannel: 'Web & App Oficial',
        logoType: 'sephora',
        officialUrl: 'https://www.sephora.com/beauty/black-friday',
        strongDeal: 'Rubores Rare Beauty a $23.80 USD, Sets Sol de Janeiro a $44 USD y $100 OFF en Dyson.',
        dealTag: 'Hasta 50% OFF',
        category: 'Belleza',
      },
      {
        name: "Macy's Herald Sq",
        subchannel: 'Manhattan & Web',
        logoType: 'macys',
        officialUrl: 'https://www.macys.com/p/black-friday/',
        strongDeal: 'Puffer Tommy Hilfiger de $225 a $79 USD y camisetas clásicas a solo $14.99 USD.',
        dealTag: '65% OFF + 0% Tax NYC',
        category: 'Moda',
        taxNote: '0% Tax en NYC en prendas < $110 USD',
      },
      {
        name: 'Best Buy USA',
        subchannel: 'Union Sq & Web',
        logoType: 'bestbuy',
        officialUrl: 'https://www.bestbuy.com/site/black-friday/sale-event/pcmcat225600050000.c',
        strongDeal: 'Laptops y Smart TVs con rebajas tempranas de hasta -$250 USD directos en caja.',
        dealTag: 'Early Doorbusters',
        category: 'Tecnología',
      },
    ],
  },
  {
    id: 'fase-2',
    phaseNumber: 2,
    dateRange: '15 al 23 de Noviembre',
    daysRangeLabel: '15 - 23 Nov',
    calendarDays: [15, 16, 17, 18, 19, 20, 21, 22, 23],
    title: 'Preventas VIP & Ropa de Marcas Americanas',
    badge: '⭐ ¡SEMANA CLAVE PARA ROPA Y CALZADO!',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    calendarColor: 'bg-blue-950/70 border-blue-500/40 text-blue-200 hover:bg-blue-900/80',
    didacticFocus: 'Acceso a Outlets de lujo y marcas deportivas con todas las tallas y colores disponibles.',
    didacticTip:
      '¡No esperes al 28 para comprar ropa ni calzado! Marcas como Coach, Nike y Victoria\'s Secret activan sus rebajas del 60%-77% aquí. Para el viernes 28 las tallas populares (S, M y calzado 7-10) ya se habrán agotado.',
    recommendedCategory: 'Carteras de Lujo, Zapatillas, Pijamas & Moda USA',
    stores: [
      {
        name: 'Coach Outlet NY',
        subchannel: 'Woodbury Common & Web',
        logoType: 'coach',
        officialUrl: 'https://www.coachoutlet.com',
        strongDeal: 'Carteras City Tote de $398 a $89 USD (77% OFF) y Billeteras Corner Zip a solo $25 USD.',
        dealTag: '77% OFF Acumulado',
        category: 'Moda de Lujo',
        taxNote: '0% Tax en accesorios individuales < $110 USD',
      },
      {
        name: 'Nike US',
        subchannel: 'House of Innovation 5th Ave',
        logoType: 'nike',
        officialUrl: 'https://www.nike.com/w/black-friday-sale',
        strongDeal: 'Zapatillas Air Zoom Pegasus 40/41 de $140 a $79 USD (0% Tax) + hasta 60% en ropa deportiva.',
        dealTag: '44% OFF Running',
        category: 'Calzado & Deporte',
        taxNote: '0% Tax en calzado < $110 USD en NYC',
      },
      {
        name: 'Adidas USA',
        subchannel: 'Flagship 5th Ave & Web',
        logoType: 'adidas',
        officialUrl: 'https://www.adidas.com/us/black_friday',
        strongDeal: 'Zapatillas Grand Court 2.0 Classic Leather de $70 a $34.99 USD con 0% Sales Tax.',
        dealTag: '50% OFF Clásico',
        category: 'Calzado & Deporte',
        taxNote: '0% Tax en calzado < $110 USD en NYC',
      },
      {
        name: "Victoria's Secret",
        subchannel: 'Flagship 5th Ave NYC',
        logoType: 'victorias-secret',
        officialUrl: 'https://www.victoriassecret.com/us/vs/sale',
        strongDeal: 'Body Mists y lociones a $15 USD (bajan de $39.95) y Pijamas navideños de satén a $35 USD.',
        dealTag: 'Mists $15 & Pijamas 56% OFF',
        category: 'Belleza & Moda',
        taxNote: '0% Tax en pijamas y ropa < $110 USD',
      },
      {
        name: 'Michael Kors Outlet',
        subchannel: 'Woodbury Common NY & Web',
        logoType: 'coach',
        officialUrl: 'https://www.michaelkors.com/sale',
        strongDeal: 'Carteras Tote de $398 a $99 USD y Billeteras Jet Set Travel a $39 USD.',
        dealTag: '75% OFF Outlets',
        category: 'Moda de Lujo',
      },
    ],
  },
  {
    id: 'fase-3',
    phaseNumber: 3,
    dateRange: '24 al 28 de Noviembre',
    daysRangeLabel: '24 - 28 Nov',
    calendarDays: [24, 25, 26, 27, 28],
    title: 'Semana Central de Black Friday (Epicentro: 28 Nov)',
    badge: '🔥 MÁXIMOS DESCUENTOS DEL AÑO',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
    calendarColor: 'bg-red-950/70 border-red-500/40 text-red-200 hover:bg-red-900/80',
    didacticFocus: 'El evento cumbre de rebajas masivas en tecnología, electrónica y remates generales.',
    didacticTip:
      'Los "Doorbusters" de Amazon y Best Buy vuelan en minutos el viernes 28. Envíanos tu lista de productos de antemano para que nuestro equipo compre en cuanto se liberen los precios.',
    recommendedCategory: 'Smartphones, Laptops, Consolas, Termos Stanley & Gadgets',
    stores: [
      {
        name: 'Amazon USA',
        subchannel: 'Portal Principal & Prime',
        logoType: 'amazon',
        officialUrl: 'https://www.amazon.com/blackfriday',
        strongDeal: 'Altavoz Echo Dot 5ta Gen a $22.99 USD (54% OFF) y Termo viral Stanley 40oz a $29 USD.',
        dealTag: '54% OFF Gadgets',
        category: 'Variedad & Tech',
      },
      {
        name: 'Best Buy USA',
        subchannel: '5th Ave & Web',
        logoType: 'bestbuy',
        officialUrl: 'https://www.bestbuy.com/site/black-friday/sale-event/pcmcat225600050000.c',
        strongDeal: 'MacBook Air 13" M2 de $999 a $749 USD y Auriculares Sony WH-1000XM5 a $248 USD directo.',
        dealTag: '-$250 USD Efectivo',
        category: 'Tecnología',
      },
      {
        name: 'Target USA',
        subchannel: 'Herald Sq & Web',
        logoType: 'target',
        officialUrl: 'https://www.target.com/c/black-friday-deals/-/N-55119',
        strongDeal: 'PlayStation 5 Slim Digital con juego incluido a $449 USD y juguetes navideños.',
        dealTag: 'Consolas & Juguetes',
        category: 'Variedad & Gaming',
      },
    ],
  },
  {
    id: 'fase-4',
    phaseNumber: 4,
    dateRange: '29 de Noviembre al 2 de Diciembre',
    daysRangeLabel: '29 Nov - 2 Dic',
    calendarDays: [29, 30],
    title: 'Cyber Weekend & Cyber Monday',
    badge: '💻 REYES DE LA TECNOLOGÍA & COMPUTACIÓN',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    calendarColor: 'bg-purple-950/70 border-purple-500/40 text-purple-200 hover:bg-purple-900/80',
    didacticFocus: 'Cierre del evento con ofertas exclusivas para compras por internet y remates de informática.',
    didacticTip:
      'El 2 de Diciembre es el cierre estricto para asegurar que todos tus paquetes ingresen al vuelo navideño con entrega garantizada en Bolivia antes del 24 de Diciembre.',
    recommendedCategory: 'Equipos Apple, Fotografía, Periféricos & Remates Finales',
    stores: [
      {
        name: 'Apple Store Oficial',
        subchannel: '5th Ave Flagship & Web',
        logoType: 'apple',
        officialUrl: 'https://www.apple.com/shop/gifts/shopping-event',
        strongDeal: 'Tarjeta de regalo oficial Apple de hasta $200 USD al comprar MacBook Air o iPad.',
        dealTag: 'Gift Card Oficial',
        category: 'Apple',
      },
      {
        name: 'B&H Photo Video',
        subchannel: '9th Ave Manhattan',
        logoType: 'bestbuy',
        officialUrl: 'https://www.bhphotovideo.com',
        strongDeal: 'Cámaras fotográficas, micrófonos, monitores e informática profesional con precio de NYC.',
        dealTag: 'Audio & Cámaras Pro',
        category: 'Tecnología',
      },
      {
        name: 'Amazon & Best Buy',
        subchannel: 'Cyber Deals Oficiales',
        logoType: 'amazon',
        officialUrl: 'https://www.amazon.com/cybermonday',
        strongDeal: 'Descuentos de liquidación de inventario en discos SSD, memorias y gadgets inteligentes.',
        dealTag: 'Remates Cyber Monday',
        category: 'Informática',
      },
    ],
  },
];

// Días de Noviembre con semana iniciando en Domingo (Nov 1 2026 es Domingo)
const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const TOTAL_DAYS_NOVEMBER = 30;

export function NovemberCalendar() {
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>('fase-2'); // Por defecto Fase 2 (la más solicitada: ropa y marcas USA)
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline'>('calendar');

  const currentPhase = NOVEMBER_PHASES.find((p) => p.id === selectedPhaseId) || NOVEMBER_PHASES[1];

  // Encuentra qué fase corresponde a cada día
  const getPhaseForDay = (day: number) => {
    return NOVEMBER_PHASES.find((p) => p.calendarDays.includes(day));
  };

  return (
    <div className="bg-gradient-to-br from-[#0a1424] via-[#0c1c33] to-[#08101e] rounded-3xl p-5 sm:p-7 text-white border border-white/10 shadow-2xl relative overflow-hidden mt-6">
      {/* Luz ambiental sutil */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="relative space-y-6">
        {/* ========================================================================= */}
        {/* 1. ENCABEZADO DEL CALENDARIO DIDÁCTICO                                   */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/40">
                <Icon name="calendar_month" size={14} className="text-amber-400" />
                <span>GUÍA DIDÁCTICA OFICIAL NOVIEMBRE</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                ✈ Vuelo Navideño: 4 de Diciembre
              </span>
            </div>

            <h3 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight">
              Calendario de Noviembre: ¿Cuándo y Dónde Comprar?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Planifica tus compras de manera simple. Cada semana tiene sus tiendas y categorías ideales para ahorrar hasta 70% sin perder stock de tallas o modelos.
            </p>
          </div>

          {/* Toggle de vista: Calendario vs Ruta Completa */}
          <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-xl self-start lg:self-auto border border-white/10 shrink-0">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'calendar'
                  ? 'bg-secondary text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Icon name="calendar_month" size={14} />
              <span>Vista Calendario</span>
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'timeline'
                  ? 'bg-secondary text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Icon name="view_timeline" size={14} />
              <span>Ruta Completa (4 Fases)</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. BOTONES DE ACCESO RÁPIDO A LAS 4 FASES CLAVE                          */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {NOVEMBER_PHASES.map((phase) => {
            const isSelected = selectedPhaseId === phase.id;
            return (
              <button
                key={phase.id}
                onClick={() => {
                  setSelectedPhaseId(phase.id);
                  if (viewMode === 'timeline') setViewMode('calendar');
                }}
                className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden group flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white/15 border-secondary shadow-lg shadow-secondary/10 ring-1 ring-secondary'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono font-bold text-slate-300">
                      FASE {phase.phaseNumber}
                    </span>
                    <span
                      className={`text-[9.5px] font-black px-1.5 py-0.5 rounded border ${
                        phase.id === 'fase-1'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : phase.id === 'fase-2'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          : phase.id === 'fase-3'
                          ? 'bg-red-500/20 text-red-300 border-red-500/40'
                          : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      }`}
                    >
                      {phase.daysRangeLabel}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-xs text-white group-hover:text-secondary-fixed transition-colors line-clamp-1">
                    {phase.title.split('(')[0]}
                  </h4>
                </div>

                <div className="pt-2 mt-1 border-t border-white/10 text-[10px] text-slate-300 line-clamp-1 flex items-center gap-1">
                  <span className="text-secondary-fixed font-bold">Top:</span>
                  <span className="truncate">{phase.recommendedCategory.split(',')[0]}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* 3. VISTA CALENDARIO MENSUAL DE NOVIEMBRE INTERACTIVO                     */}
        {/* ========================================================================= */}
        {viewMode === 'calendar' && (
          <div className="bg-black/35 rounded-2xl p-4 sm:p-5 border border-white/10 space-y-4 animate-fadeIn">
            {/* Header del mes */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black font-display text-white">
                  Noviembre
                </span>
                <span className="text-xs font-mono text-slate-400">
                  (Haz clic en cualquier día o rango para ver dónde comprar)
                </span>
              </div>

              {/* Leyenda de Colores */}
              <div className="flex flex-wrap items-center gap-2 text-[10px]">
                <span className="inline-flex items-center gap-1 text-emerald-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>1-14 Belleza & Drops</span>
                </span>
                <span className="inline-flex items-center gap-1 text-blue-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span>15-23 Ropa & Marcas USA</span>
                </span>
                <span className="inline-flex items-center gap-1 text-red-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  <span>24-28 Black Friday Central</span>
                </span>
                <span className="inline-flex items-center gap-1 text-purple-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  <span>29-30 Cyber Weekend</span>
                </span>
              </div>
            </div>

            {/* Grid del Calendario (7 columnas: Dom a Sáb) */}
            <div className="space-y-1.5">
              {/* Encabezado días de la semana */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                {DAYS_OF_WEEK.map((d) => (
                  <div key={d} className="py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Días del mes (Nov 1 2026 arranca en Domingo = columna 0) */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {Array.from({ length: TOTAL_DAYS_NOVEMBER }, (_, i) => {
                  const day = i + 1;
                  const phase = getPhaseForDay(day);
                  const isDayInSelectedPhase = currentPhase.calendarDays.includes(day);
                  const isBlackFridayPeak = day === 28; // Viernes 28 de Noviembre

                  let dayColorClasses = 'bg-white/5 border-white/10 text-slate-300';
                  if (phase?.id === 'fase-1') {
                    dayColorClasses = 'bg-emerald-950/50 border-emerald-500/30 text-emerald-200';
                  } else if (phase?.id === 'fase-2') {
                    dayColorClasses = 'bg-blue-950/50 border-blue-500/30 text-blue-200';
                  } else if (phase?.id === 'fase-3') {
                    dayColorClasses = 'bg-red-950/50 border-red-500/30 text-red-200';
                  } else if (phase?.id === 'fase-4') {
                    dayColorClasses = 'bg-purple-950/50 border-purple-500/30 text-purple-200';
                  }

                  return (
                    <button
                      key={day}
                      onClick={() => phase && setSelectedPhaseId(phase.id)}
                      className={`relative p-2 sm:p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-between min-h-[50px] sm:min-h-[58px] ${dayColorClasses} ${
                        isDayInSelectedPhase
                          ? 'ring-2 ring-secondary scale-[1.03] shadow-md z-10 font-black'
                          : 'hover:border-white/40'
                      } ${
                        isBlackFridayPeak
                          ? 'bg-gradient-to-b from-red-600 to-red-800 text-white border-amber-300/80 shadow-lg shadow-red-600/30 animate-pulse font-black'
                          : ''
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-display font-bold">
                        {day}
                      </span>

                      {/* Micro-etiqueta contextual del día */}
                      {isBlackFridayPeak ? (
                        <span className="text-[7.5px] sm:text-[8.5px] font-black uppercase text-amber-200 tracking-tight leading-none">
                          BLACK FRIDAY
                        </span>
                      ) : day === 15 ? (
                        <span className="text-[7px] sm:text-[8px] font-mono text-blue-300 leading-none">
                          VIP Drop
                        </span>
                      ) : day === 26 ? (
                        <span className="text-[7px] sm:text-[8px] font-mono text-amber-300 leading-none">
                          Thanksgiving
                        </span>
                      ) : day === 30 ? (
                        <span className="text-[7px] sm:text-[8px] font-mono text-purple-300 leading-none">
                          Cyber Mon
                        </span>
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40"></span>
                      )}
                    </button>
                  );
                })}

                {/* Día Extra Didáctico: 4 de Diciembre (Vuelo Bolivia) */}
                <div className="col-span-5 p-2 sm:p-2.5 rounded-xl border border-dashed border-emerald-400/50 bg-emerald-950/40 text-emerald-200 flex items-center justify-between px-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">✈</span>
                    <span className="text-xs font-bold font-display">
                      4 de Diciembre: Vuelo Directo a Bolivia
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-medium hidden sm:inline">
                    Llegada garantizada para Navidad
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. PANEL DIDÁCTICO DETALLADO: DÓNDE COMPRAR EN ESTA FECHA                */}
        {/* ========================================================================= */}
        <div className="bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10 space-y-5 backdrop-blur-sm">
          {/* Encabezado de la fase activa */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-white/10 text-white">
                  FASE {currentPhase.phaseNumber} DE 4
                </span>
                <span
                  className={`text-[10px] font-black px-2.5 py-0.5 rounded-md border ${currentPhase.badgeColor}`}
                >
                  {currentPhase.badge}
                </span>
              </div>
              <h4 className="font-display font-extrabold text-lg sm:text-xl text-white">
                {currentPhase.dateRange}: {currentPhase.title}
              </h4>
            </div>

            <div className="bg-white/10 rounded-xl px-3 py-2 text-right shrink-0">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">
                Categoría Clave:
              </span>
              <span className="text-xs font-bold text-secondary-fixed">
                {currentPhase.recommendedCategory}
              </span>
            </div>
          </div>

          {/* Consejo Didáctico ("Tip de Oro del Experto") */}
          <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl p-3.5 flex items-start gap-3">
            <span className="text-lg">💡</span>
            <div className="space-y-0.5 text-xs">
              <strong className="text-amber-300 block font-bold">
                ¿Por qué comprar en estas fechas? (Consejo Didáctico):
              </strong>
              <p className="text-slate-200 leading-relaxed">
                {currentPhase.didacticTip}
              </p>
            </div>
          </div>

          {/* DÓNDE COMPRAR: Tiendas recomendadas para esta fecha */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Icon name="storefront" size={15} className="text-secondary" />
                <span>Tiendas Oficiales Recomendadas para estas fechas:</span>
              </h5>
              <span className="text-[11px] font-mono text-slate-400">
                {currentPhase.stores.length} comercios verificados
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {currentPhase.stores.map((store, idx) => (
                <div
                  key={idx}
                  className="bg-black/40 hover:bg-black/60 rounded-xl p-3.5 border border-white/10 hover:border-secondary/60 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2.5">
                    {/* Header tienda */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <BrandLogo type={store.logoType} />
                        <div>
                          <span className="font-display font-bold text-xs text-white block">
                            {store.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {store.subchannel}
                          </span>
                        </div>
                      </div>

                      <span className="text-[9px] font-black px-2 py-0.5 rounded bg-amber-400 text-black shrink-0">
                        {store.dealTag}
                      </span>
                    </div>

                    {/* Oferta más fuerte de la tienda */}
                    <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                      <span className="text-[9.5px] font-bold text-amber-300 block mb-0.5">
                        🔥 Oferta Clave:
                      </span>
                      <p className="text-[11px] text-slate-100 font-medium leading-snug">
                        {store.strongDeal}
                      </p>
                    </div>

                    {store.taxNote && (
                      <div className="text-[9.5px] text-emerald-300/90 font-medium bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-500/20">
                        ✓ {store.taxNote}
                      </div>
                    )}
                  </div>

                  {/* Acciones de la tienda */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                    <a
                      href={store.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition-all border border-white/10 text-center"
                    >
                      <span>Ver Tienda</span>
                      <Icon name="open_in_new" size={11} />
                    </a>

                    <Link
                      href={`/registro?store=${encodeURIComponent(store.name)}&url=${encodeURIComponent(store.officialUrl)}`}
                      className="py-1.5 px-2 rounded-lg bg-secondary hover:bg-secondary/90 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-all text-center"
                    >
                      <span>Pedir aquí</span>
                      <Icon name="arrow_forward" size={11} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. VISTA ALTERNATIVA: RUTA DIDÁCTICA COMPLETA DE 4 PASOS                  */}
        {/* ========================================================================= */}
        {viewMode === 'timeline' && (
          <div className="space-y-4 pt-2 animate-fadeIn">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Icon name="route" size={17} className="text-secondary" />
              <span>Ruta Cronológica Completa: Tus 4 Momentos de Compra</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {NOVEMBER_PHASES.map((p) => (
                <div
                  key={p.id}
                  className="bg-black/35 rounded-2xl p-4 sm:p-5 border border-white/10 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-white/10 text-white font-mono">
                        ETAPA {p.phaseNumber} • {p.daysRangeLabel}
                      </span>
                      <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded border ${p.badgeColor}`}>
                        {p.dateRange}
                      </span>
                    </div>

                    <h5 className="font-display font-bold text-sm text-white">
                      {p.title}
                    </h5>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {p.didacticFocus}
                    </p>

                    <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 space-y-1">
                      <span className="text-[10px] font-bold text-amber-300 block">
                        Comercios Clave:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {p.stores.map((s, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-white/10 text-slate-200 px-2 py-0.5 rounded font-medium"
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedPhaseId(p.id);
                      setViewMode('calendar');
                    }}
                    className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-secondary-fixed font-bold flex items-center justify-center gap-1.5 border border-white/10 transition-all mt-2"
                  >
                    <span>Ver tiendas y ofertas de esta etapa</span>
                    <Icon name="arrow_forward" size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. BANNER DE CIERRE DIDÁCTICO: CONSOLIDACIÓN Y VUELO                      */}
        {/* ========================================================================= */}
        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 text-base">✈</span>
            <span>
              <strong>Garantía de Entrega Navideña:</strong> Compras realizadas en cualquiera de estas 4 etapas se consolidan en Manhattan y viajan en el vuelo directo con entregas en Bolivia desde el <strong>4 de Diciembre</strong>.
            </span>
          </div>

          <Link
            href="/registro"
            className="text-secondary-fixed hover:underline font-bold shrink-0 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Reservar Compra Asistida o Casillero</span>
            <Icon name="arrow_forward" size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NovemberCalendar;
