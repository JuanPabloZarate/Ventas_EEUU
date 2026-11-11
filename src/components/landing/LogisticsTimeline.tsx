'use client';

import React from 'react';
import { Icon } from '@/components/ui/Icon';

export interface MilestoneItem {
  step: string;
  number: string;
  title: string;
  dateRange: string;
  statusBadge: {
    label: string;
    variant: 'emerald' | 'amber' | 'blue';
  };
  location: string;
  highlights: string[];
  icon: string;
}

export interface GuaranteeItem {
  id: string;
  title: string;
  badge: string;
  description: string;
  icon: string;
  iconColor: string;
  bgColor: string;
}

export interface LogisticsTimelineProps {
  /** Optional custom container classes */
  className?: string;
  /** Coordinator WhatsApp contact phone number */
  whatsappNumber?: string;
}

/**
 * LogisticsTimeline Component
 *
 * Implements Feature 11 from PROJECT.md and replicates the Black Friday flight
 * schedule & trust guarantees from `ultra_vendedora` and `m_vil` templates.
 *
 * Sections:
 * 1. Flight Milestones Timeline (23 Nov - 3 Dic, 3 Dic Cutoff, from 4 Dic Delivery)
 * 2. Trust Guarantees ($0 Photo Inspection, Smart Repacking, 100% Christmas Guarantee)
 * 3. Direct Bolivian Team WhatsApp Consultation Card
 */
export function LogisticsTimeline({
  className = '',
  whatsappNumber = '59177012345',
}: LogisticsTimelineProps) {
  const milestones: MilestoneItem[] = [
    {
      step: 'Fase 01',
      number: '1',
      title: 'Compras y Recepción en New York',
      dateRange: '23 Nov — 3 Dic',
      statusBadge: {
        label: 'Recepción Activa',
        variant: 'emerald',
      },
      location: 'Almacén Woodside, Queens NY',
      highlights: [
        'Recepción de compras físicas en Manhattan (5th Ave, SoHo) y tiendas online de USA.',
        'Notificación inmediata al arribar a tu Suite exclusiva.',
        'Pesaje en báscula certificada e inspección fotográfica $0 USD.',
        'Reempaque y descarte de cajas voluminosas sin costo de manejo.',
      ],
      icon: 'warehouse',
    },
    {
      step: 'Fase 02',
      number: '2',
      title: 'Vuelo Directo JFK ✈ Bolivia',
      dateRange: '3 de Diciembre (23:59 EST)',
      statusBadge: {
        label: 'Corte Inminente',
        variant: 'amber',
      },
      location: 'JFK Airport → VVI (Santa Cruz) / LPB (La Paz)',
      highlights: [
        'Cierre de valijas y precintado de seguridad para carga consolidada.',
        'Vuelo directo sin escalas intermedias ni riesgo de retención.',
        'Manifiesto de carga prioritario y pre-desaduanización ágil.',
        'Seguimiento continuo de vuelo y alerta directa por WhatsApp.',
      ],
      icon: 'flight_takeoff',
    },
    {
      step: 'Fase 03',
      number: '3',
      title: 'Desaduanización & Entrega en Bolivia',
      dateRange: 'Desde el 4 de Diciembre',
      statusBadge: {
        label: 'Garantía Navidad',
        variant: 'blue',
      },
      location: 'La Paz, Santa Cruz, Cochabamba y todo el país',
      highlights: [
        'Retiro personal inmediato en oficinas Sopocachi, Equipetrol y Zona Norte.',
        'Servicio de entrega puerta a puerta verificado a domicilio.',
        'Despachos asegurados a Sucre, Tarija, Oruro, Potosí, Beni y Pando.',
        'Garantía de entrega antes del 24 de Diciembre o devolución completa.',
      ],
      icon: 'local_shipping',
    },
  ];

  const guarantees: GuaranteeItem[] = [
    {
      id: 'inspeccion',
      title: 'Inspección Fotográfica & Pesaje ($0)',
      badge: 'Incluido $0 USD',
      description:
        'Cada paquete que llega a Queens es pesado en báscula certificada y fotografiado. Verificamos que tu producto esté en perfectas condiciones antes de volar a Bolivia.',
      icon: 'photo_camera',
      iconColor: 'text-secondary',
      bgColor: 'bg-secondary-fixed/30',
    },
    {
      id: 'reempaque',
      title: 'Reempaque Inteligente & Consolidación',
      badge: 'Ahorro hasta 35%',
      description:
        'Desechamos las cajas gigantes llenas de aire de Amazon y tiendas de USA. Consolidamos múltiples compras en un solo paquete para que pagues únicamente por el peso real a $9.50/lb.',
      icon: 'inventory_2',
      iconColor: 'text-brand-gold',
      bgColor: 'bg-tertiary-fixed/40',
    },
    {
      id: 'garantia',
      title: 'Garantía Navideña & Seguro 100%',
      badge: 'Compromiso 24 Dic',
      description:
        'Garantía de entrega antes del 24 de Diciembre o devolución íntegra del costo del servicio. Todos tus paquetes viajan con póliza de seguro contra pérdida o extravío.',
      icon: 'verified',
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-500/15',
    },
  ];

  const whatsappConsultationHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hola NY2Bolivia, tengo dudas sobre el cronograma de vuelo JFK y las fechas de entrega para Black Friday.'
  )}`;

  return (
    <section
      id="cronograma"
      aria-label="Cronograma de vuelo y logística Black Friday"
      className={`w-full py-16 lg:py-24 bg-surface-container-low/70 border-t border-b border-outline-variant/30 scroll-mt-16 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-mono text-xs font-bold tracking-wider uppercase mb-4 shadow-sm">
            <Icon name="flight_takeoff" size={16} className="text-secondary" />
            <span>Ruta Directa JFK ✈ LPB / VVI</span>
          </div>

          <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-on-surface tracking-tight leading-tight mb-4">
            Cronograma de Vuelo &amp; Logística <span className="text-secondary">Black Friday</span>
          </h2>

          <p className="font-sans text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
            Coordinación logística de alta precisión desde Manhattan y Queens hasta Bolivia. Conoce las fechas clave
            para asegurar que tus regalos estén bajo el árbol antes del 24 de Diciembre.
          </p>
        </div>

        {/* Desktop Connected Milestones Flow (Visible md: and up) */}
        <div className="hidden md:block mb-16 relative">
          {/* Subtle background connecting line */}
          <div className="absolute top-20 left-12 right-12 h-1 bg-gradient-to-r from-secondary-container via-tertiary-fixed-dim to-secondary -z-0 rounded-full opacity-60"></div>

          <div className="grid grid-cols-3 gap-8 relative z-10">
            {milestones.map((milestone, idx) => {
              const badgeColors = {
                emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                amber: 'bg-amber-100 text-amber-900 border-amber-200',
                blue: 'bg-sky-100 text-sky-800 border-sky-200',
              }[milestone.statusBadge.variant];

              const numberBg = {
                emerald: 'bg-secondary-container text-on-secondary-container',
                amber: 'bg-tertiary-fixed-dim text-on-tertiary-fixed',
                blue: 'bg-primary-container text-white',
              }[milestone.statusBadge.variant];

              return (
                <div
                  key={idx}
                  className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-elevation-1 hover:shadow-elevation-2 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top step icon + phase badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-10 h-10 rounded-xl ${numberBg} font-mono font-bold text-base flex items-center justify-center shadow-sm`}
                        >
                          {milestone.number}
                        </span>
                        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                          {milestone.step}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${badgeColors}`}
                      >
                        {milestone.statusBadge.label}
                      </span>
                    </div>

                    {/* Milestone Title & Date Range */}
                    <h3 className="font-display font-bold text-lg text-on-surface mb-1">
                      {milestone.title}
                    </h3>
                    <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-secondary mb-3">
                      <Icon name="event" size={14} />
                      <span>{milestone.dateRange}</span>
                    </div>

                    {/* Location detail */}
                    <div className="flex items-start gap-1.5 text-xs text-on-surface-variant bg-surface-container-low p-2 rounded-lg mb-4">
                      <Icon name="location_on" size={16} className="text-secondary shrink-0 mt-0.5" />
                      <span className="font-medium">{milestone.location}</span>
                    </div>

                    {/* Bullet Highlights */}
                    <ul className="space-y-2 mb-4">
                      {milestone.highlights.map((item, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-2 text-xs text-on-surface-variant leading-relaxed">
                          <Icon name="check_circle" size={14} className="text-secondary shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-on-surface-variant font-mono">
                    <span className="flex items-center gap-1">
                      <Icon name="shield" size={14} />
                      Despacho Protegido
                    </span>
                    <span className="text-secondary font-semibold">NY2Bolivia Express</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Vertical Milestones Flow (Visible below md:) */}
        <div className="block md:hidden mb-12 space-y-3">
          {milestones.map((milestone, idx) => {
            const numberBg = {
              emerald: 'bg-secondary-container text-on-secondary-container',
              amber: 'bg-tertiary-fixed-dim text-on-tertiary-fixed',
              blue: 'bg-primary-container text-white',
            }[milestone.statusBadge.variant];

            return (
              <div
                key={idx}
                className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg ${numberBg} font-mono font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-sm`}
                  >
                    {milestone.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="font-mono text-[11px] text-on-surface-variant uppercase font-semibold">
                        {milestone.step}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-secondary bg-secondary-fixed/40 px-2 py-0.5 rounded-full">
                        {milestone.dateRange}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-sm text-on-surface leading-snug mb-1">
                      {milestone.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1 mb-2">
                      <Icon name="location_on" size={14} className="text-secondary shrink-0" />
                      <span className="truncate">{milestone.location}</span>
                    </p>
                    <p className="text-xs text-on-surface-variant/90 leading-relaxed bg-surface-container-low p-2 rounded-lg">
                      {milestone.highlights[0]}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Guarantees Grid (3 Cards) */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="font-display font-bold text-xl sm:text-2xl text-on-surface">
              Nuestras 3 Garantías Exclusivas de Carga Directa
            </h3>
            <p className="font-sans text-xs sm:text-sm text-on-surface-variant mt-1">
              Seguridad total para tus compras internacionales sin sorpresas ni sobrecostos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guarantees.map((guarantee) => (
              <div
                key={guarantee.id}
                className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-elevation-1 hover:border-secondary/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${guarantee.bgColor} flex items-center justify-center`}
                    >
                      <Icon name={guarantee.icon} size={26} className={guarantee.iconColor} />
                    </div>
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface border border-outline-variant/30">
                      {guarantee.badge}
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-base text-on-surface mb-2">
                    {guarantee.title}
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {guarantee.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-outline-variant/20 flex items-center gap-1.5 text-xs font-semibold text-secondary">
                  <Icon name="verified" size={16} />
                  <span>Beneficio Certificado NY2Bolivia</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp Direct Consultation Prompt */}
        <div className="bg-gradient-to-r from-primary-container via-[#132742] to-primary-container rounded-2xl p-6 sm:p-8 text-white shadow-elevation-2 flex flex-col sm:flex-row items-center justify-between gap-6 border border-white/10">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-secondary-container/20 text-secondary-fixed flex items-center justify-center shrink-0 border border-secondary-fixed/20">
              <Icon name="chat" size={32} />
            </div>
            <div>
              <h4 className="font-display font-bold text-lg sm:text-xl text-white">
                ¿Tienes dudas sobre tus fechas de compra o paquetes especiales?
              </h4>
              <p className="font-sans text-xs sm:text-sm text-surface-container-high mt-1 max-w-xl">
                Chatea directo con nuestro equipo boliviano. Te orientamos sobre horarios de tiendas en New York,
                declaración de aduanas y consolidación sin costo.
              </p>
            </div>
          </div>

          <a
            href={whatsappConsultationHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-tertiary-fixed-dim hover:bg-tertiary-fixed text-on-tertiary-fixed font-bold text-sm px-6 py-3.5 rounded-xl shadow-sm transition-all hover:scale-105 shrink-0"
          >
            <Icon name="chat" size={18} />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
}

export default LogisticsTimeline;
