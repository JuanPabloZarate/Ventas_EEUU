'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  badge?: string;
}

export interface FAQSectionProps {
  /** Optional custom container classes */
  className?: string;
  /** Coordinator WhatsApp contact phone number */
  whatsappNumber?: string;
}

/**
 * FAQSection Component
 *
 * Implements Feature 12 from PROJECT.md:
 * Interactive FAQ accordion addressing user concerns regarding Black Friday
 * purchases, customs clearance, dual-currency payments in BOB via QR, pickup points,
 * and delivery guarantees.
 */
export function FAQSection({
  className = '',
  whatsappNumber = '59177012345',
}: FAQSectionProps) {
  // Open FAQ item index tracker (null = all collapsed, number = active question)
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqData: FAQItem[] = [
    {
      id: 'reserva-cupo',
      category: 'Casillero & Reserva',
      question: '¿Cómo funciona la reserva de cupo de $20 USD y mi Casillero en New York?',
      badge: 'Básico',
      answer:
        'Al apartar tu cupo por $20 USD, te asignamos de inmediato una Suite New York exclusiva en nuestro almacén de Queens (ejemplo: NY-2026-8492). Esos $20 USD no son un cobro perdido: se descuentan al 100% como saldo a favor del flete internacional de tu primer envío al llegar a Bolivia. Además, tu Suite no tiene costos de mantenimiento mensual ni membresías ocultas.',
    },
    {
      id: 'pago-bob-qr',
      category: 'Pagos & Moneda',
      question: '¿Puedo pagar en Bolivianos (BOB) con QR Simple o transferencia?',
      badge: 'Popular',
      answer:
        '¡Sí, absolutamente! Diseñamos NY2Bolivia pensando en la economía boliviana. Puedes cancelar tanto el flete internacional ($9.50/lb) como la comisión de Compra Asistida en moneda nacional (BOB) mediante QR Simple interbancario o transferencia a nuestras cuentas en Bolivia, utilizando la tasa oficial de 6.96 Bs por USD. Sin comisiones bancarias adicionales ni recargos por uso de tarjeta internacional.',
    },
    {
      id: 'modalidades-diferencia',
      category: 'Modalidades',
      question: '¿Cuál es la diferencia entre "Compra Asistida" y "Casillero New York"?',
      answer:
        '• En Casillero New York: Tú compras por tu propia cuenta en las tiendas oficiales de USA (Amazon, Apple, Sephora, Nike) usando tu propia tarjeta y pones como dirección de entrega tu Suite asignada en Queens NY. Al recibir en Bolivia solo pagas el flete aéreo de $9.50 por libra.\n\n• En Compra Asistida (Personal Shopper): Tú nos envías los enlaces o fotografías de lo que quieres comprar y nuestro equipo en New York realiza la compra con tarjetas estadounidenses corporativas o acude presencialmente a tiendas físicas de Manhattan (5th Ave, SoHo). Tú pagas todo en Bolivia en Bolivianos con una comisión desde el 8% (+ $20 base).',
    },
    {
      id: 'calculo-flete-aduana',
      category: 'Tarifas & Aduana',
      question: '¿Cómo se calculan el flete y los costos de aduana?',
      answer:
        'Nuestra tarifa aérea promocional de Black Friday es de $9.50 USD por libra (peso real). La desaduanización ágil y simplificada para compras de uso personal está incluida en nuestro proceso de logística directa JFK a Bolivia. No hay cobros sorpresivos de desaduanización al momento de retirar tus compras.',
    },
    {
      id: 'consolidacion-paquetes',
      category: 'Almacén & Envíos',
      question: '¿Puedo consolidar compras de diferentes tiendas (ej. Apple + Nike + Sephora)?',
      badge: '$0 Extra',
      answer:
        '¡Totalmente gratis! En nuestro almacén de Queens recibimos todos tus paquetes durante el periodo de compras de Black Friday (23 de Noviembre al 3 de Diciembre). Retiramos el exceso de cartón y empaques sobredimensionados de las tiendas para reducir el peso volumétrico y agrupamos todas tus compras en un solo despacho consolidado, ahorrándote hasta un 35% en flete.',
    },
    {
      id: 'sucursales-entregas',
      category: 'Entregas en Bolivia',
      question: '¿Dónde y cuándo recojo mis compras en Bolivia?',
      answer:
        'Los vuelos con tus compras arriban para entrega a partir del 4 de Diciembre. Puedes recoger sin ningún costo adicional en nuestras oficinas céntricas:\n• La Paz: Zona Sopocachi\n• Santa Cruz de la Sierra: Barrio Equipetrol\n• Cochabamba: Zona Norte\n\nTambién contamos con servicio de delivery a domicilio seguro y despachos verificados al resto de departamentos (Sucre, Tarija, Oruro, Potosí, Trinidad y Cobija).',
    },
    {
      id: 'garantia-perdida-dano',
      category: 'Garantías',
      question: '¿Qué garantía tengo de que mis paquetes lleguen antes de Navidad?',
      badge: 'Compromiso 24 Dic',
      answer:
        'Respaldamos nuestro servicio con la Garantía Navideña NY2Bolivia: si tus paquetes arribaron a nuestro almacén de Queens dentro del plazo (hasta el 3 de Diciembre) y no están disponibles para entrega antes del 24 de Diciembre por demoras atribuibles a nuestra logística, te devolvemos el 100% del costo del servicio de transporte. Además, todos los envíos cuentan con seguro de paquetería integral.',
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const whatsappSupportHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hola NY2Bolivia, tengo una pregunta específica sobre el servicio de compras y casillero Black Friday.'
  )}`;

  return (
    <section
      id="faq"
      aria-label="Preguntas frecuentes sobre Black Friday y envíos"
      className={`w-full py-16 lg:py-24 bg-surface scroll-mt-16 ${className}`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-mono text-xs font-bold tracking-wider uppercase mb-4 shadow-sm">
            <Icon name="help_outline" size={16} className="text-secondary" />
            <span>Preguntas Frecuentes</span>
          </div>

          <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-on-surface tracking-tight leading-tight mb-4">
            Todo lo que Necesitas Saber antes de Comprar
          </h2>

          <p className="font-sans text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
            Transparencia total en tarifas, trámites aduaneros, pagos con QR en Bolivianos y garantías de entrega en mano.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5 mb-12" role="region" aria-label="Lista de preguntas frecuentes">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-surface-container-lowest border-secondary shadow-elevation-1'
                    : 'bg-surface-container-lowest border-outline-variant/30 hover:border-outline-variant/60'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-3 pr-2">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                        isOpen ? 'bg-secondary' : 'bg-outline-variant'
                      }`}
                    />
                    <span className="font-display font-bold text-sm sm:text-base text-on-surface text-left">
                      {faq.question}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {faq.badge && (
                      <span className="hidden sm:inline-block font-mono text-[11px] font-semibold px-2 py-0.5 rounded-full bg-secondary-fixed/50 text-secondary">
                        {faq.badge}
                      </span>
                    )}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 ${
                        isOpen
                          ? 'rotate-180 bg-secondary text-white'
                          : 'bg-surface-container-low text-on-surface-variant'
                      }`}
                    >
                      <Icon name="keyboard_arrow_down" size={20} />
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${faq.id}`}
                    role="region"
                    className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/15"
                  >
                    <div className="whitespace-pre-line pl-5 border-l-2 border-secondary/40 py-1">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support CTA Callout */}
        <div className="bg-surface-container-low rounded-2xl p-6 sm:p-8 border border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center shrink-0">
              <Icon name="support_agent" size={28} />
            </div>
            <div>
              <h4 className="font-display font-bold text-base sm:text-lg text-on-surface">
                ¿No encontraste lo que buscabas?
              </h4>
              <p className="font-sans text-xs sm:text-sm text-on-surface-variant mt-0.5">
                Nuestro equipo de asesores en La Paz y Santa Cruz responde de inmediato en WhatsApp.
              </p>
            </div>
          </div>

          <a
            href={whatsappSupportHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-secondary hover:bg-brand-blue-dark text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-sm transition-all hover:scale-105 shrink-0"
          >
            <Icon name="chat" size={18} />
            <span>Hablar con un Asesor</span>
          </a>
        </div>

      </div>
    </section>
  );
}

export default FAQSection;
