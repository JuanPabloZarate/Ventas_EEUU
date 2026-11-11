'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQSectionProps {
  className?: string;
  whatsappNumber?: string;
}

export function FAQSection({
  className = '',
  whatsappNumber = '59177012345',
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqData: FAQItem[] = [
    {
      id: 'pago-bob-qr',
      question: '¿Cómo pago en Bolivia y a qué tipo de cambio?',
      answer:
        'Puedes cancelar el servicio y las compras asistidas en Bolivianos (BOB) mediante QR Simple interbancario o transferencia a nuestras cuentas locales en Bolivia, al tipo de cambio oficial de 6.96 Bs por USD, sin cargos por tarjeta internacional.',
    },
    {
      id: 'modalidades-diferencia',
      question: '¿Cuál es la diferencia entre Compra Asistida y Enviar con Ticket?',
      answer:
        '• En Compra Asistida: Nosotros compramos por ti en tiendas físicas de Nueva York (Apple 5th Ave, Best Buy, Nike, Sephora) o tiendas online estadounidenses. Pagas todo en Bolivia en Bs.\n\n• En Ya Compré Online: Si ya realizaste la compra con tu propia tarjeta, solo adjuntas el ticket o factura y número de tracking para que recibamos tu paquete en nuestro almacén y te lo entreguemos en Bolivia.',
    },
    {
      id: 'calculo-flete-aduana',
      question: '¿Cómo se determinan las tarifas y qué incluye?',
      answer:
        'Cada producto cuenta con una tarifa personalizada y transparente según su categoría (tecnología, ropa, calzado o cosméticos). Incluye la recepción en almacén, vuelo directo y desaduanización simplificada para compras de uso personal. Sin cobros sorpresivos al retirar.',
    },
    {
      id: 'sucursales-entregas',
      question: '¿Dónde y cuándo retiro mis paquetes en Bolivia?',
      answer:
        'Los paquetes llegan a Bolivia a partir del 4 de Diciembre (garantizados antes de Navidad). Puedes retirar sin costo en sucursales de Santa Cruz (Equipetrol), La Paz (Sopocachi) y Cochabamba (Zona Norte), o solicitar envío seguro a domicilio en cualquier ciudad del país.',
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const whatsappSupportHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hola Compras EEUU, tengo una consulta sobre las compras y envíos a Bolivia.'
  )}`;

  return (
    <section
      id="faq"
      className={`w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface ${className}`}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-display font-bold text-on-surface">
            Preguntas Frecuentes
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Respuestas claras y directas sobre compras, envíos y pagos con Compras EEUU.
          </p>
        </div>

        <div className="space-y-2">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.id}
                className="rounded-xl border border-outline-variant/30 overflow-hidden bg-surface transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full text-left px-4 py-3.5 flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span className="font-semibold text-xs sm:text-sm text-on-surface">
                    {faq.question}
                  </span>
                  <Icon
                    name={isOpen ? 'expand_less' : 'expand_more'}
                    size={18}
                    className="text-on-surface-variant shrink-0"
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-on-surface-variant leading-relaxed border-t border-outline-variant/15 whitespace-pre-line">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <a
            href={whatsappSupportHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-secondary hover:underline inline-flex items-center gap-1"
          >
            <span>¿Tienes otra consulta? Habla directo con un asesor</span>
            <Icon name="arrow_forward" size={13} />
          </a>
        </div>

      </div>
    </section>
  );
}

export default FAQSection;
