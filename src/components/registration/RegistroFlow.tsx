'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { ordersService } from '@/lib/orders-service';
import type { Order, OrderModality, DeliveryMethod, CreateOrderInput } from '@/types/order';

export function RegistroFlow() {
  const searchParams = useSearchParams();

  // Modalidad:
  // 'prealert' = Pago ecommerce (ya compré online y adjunto ticket/tracking)
  // 'assisted' = Compra asistida en tienda (compran por mí en Manhattan)
  const [modality, setModality] = useState<OrderModality>('assisted');

  // Datos del Cliente
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [destinationCity, setDestinationCity] = useState('Santa Cruz de la Sierra');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // En caso Ecommerce ('prealert'): Ticket de compra / Factura y Tracking
  const [trackingNumber, setTrackingNumber] = useState('');
  const [ticketFile, setTicketFile] = useState<File | null>(null);

  // En caso Compra Asistida ('assisted'): Item a comprar y Presupuesto / Fondos
  const [itemDescription, setItemDescription] = useState('');
  const [itemStore, setItemStore] = useState('');
  const [itemUrl, setItemUrl] = useState('');
  const [estimatedBudgetUSD, setEstimatedBudgetUSD] = useState<number>(0);
  const [itemNotes, setItemNotes] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Ingest search params from deals
  useEffect(() => {
    const qModality = searchParams.get('modality');
    const qStore = searchParams.get('store');
    const qUsd = searchParams.get('usd');
    const qItem = searchParams.get('item');
    const qUrl = searchParams.get('url');

    if (qModality === 'assisted' || qModality === 'prealert') {
      setModality(qModality);
    }
    if (qStore) {
      setItemStore(qStore);
      setModality('assisted');
    }
    if (qUsd) {
      setEstimatedBudgetUSD(parseFloat(qUsd) || 0);
      setModality('assisted');
    }
    if (qItem) {
      setItemDescription(qItem);
    }
    if (qUrl) {
      setItemUrl(qUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!clientName.trim()) {
      setErrorMsg('Por favor ingresa tu nombre completo.');
      return;
    }
    const cleanPhone = clientPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      setErrorMsg('Por favor ingresa un número de WhatsApp válido (8 dígitos).');
      return;
    }

    if (modality === 'assisted' && !itemDescription.trim()) {
      setErrorMsg('Por favor describe o confirma el producto a comprar en USA.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderInput: CreateOrderInput = {
        clientName: clientName.trim(),
        clientPhone: cleanPhone,
        destinationCity,
        deliveryMethod,
        deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress.trim() : undefined,
        modality,
        items: [
          {
            storeName: modality === 'assisted' ? (itemStore || 'Tienda oficial USA') : 'Compra Online Ecommerce',
            category: 'Artículos Seleccionados',
            productName: modality === 'assisted' ? itemDescription.trim() : 'Paquete Comprado Online',
            productUrl: modality === 'assisted' ? itemUrl.trim() : undefined,
            quantity: 1,
            priceUSD: modality === 'assisted' ? estimatedBudgetUSD : 0,
            trackingUSA: modality === 'prealert' ? trackingNumber.trim() : undefined,
            notes: itemNotes.trim() || undefined,
          },
        ],
        trackingUSA: modality === 'prealert' ? trackingNumber.trim() : undefined,
        invoiceFileName: ticketFile ? ticketFile.name : undefined,
      };

      const newOrder = await ordersService.createOrder(orderInput);
      setCreatedOrder(newOrder);
    } catch (err) {
      console.error(err);
      setErrorMsg('Ocurrió un error al procesar tu solicitud. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppConfirmLink = () => {
    if (!createdOrder) return '';
    const phone = '59177012345';
    let text = `Hola Compras EEUU, completé mi registro #${createdOrder.id}.\n`;
    text += `Nombre: ${clientName}\n`;
    text += `Ciudad: ${destinationCity}\n`;
    if (modality === 'prealert') {
      text += `Modalidad: Ya compré online (adjunto ticket)\n`;
      text += `Tracking: ${trackingNumber || 'Por confirmar'}`;
    } else {
      text += `Modalidad: Compra Asistida en Tienda USA\n`;
      text += `Tienda: ${itemStore || 'Oficial USA'}\n`;
      text += `Producto: ${itemDescription}\n`;
      if (itemUrl) text += `Enlace: ${itemUrl}\n`;
      text += `Fondos requeridos: $${(estimatedBudgetUSD * 1.08).toFixed(2)} USD (Bs. ${(estimatedBudgetUSD * 1.08 * 6.96).toFixed(0)})`;
    }
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Título Principal */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-on-surface tracking-tight">
          Formulario de Pedido y Envío
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant">
          Elige si deseas que compremos el producto por ti o si compraste por tu cuenta y deseas enviarlo.
        </p>
      </div>

      {/* Selector de Modalidad integrado en el formulario */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 bg-surface-container-low rounded-2xl border border-outline-variant/30">
        <button
          type="button"
          onClick={() => setModality('assisted')}
          className={`p-3.5 rounded-xl text-left transition-all flex items-start gap-3 ${
            modality === 'assisted'
              ? 'bg-surface text-on-surface shadow-xs font-bold border border-secondary/40'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <div className={`p-2 rounded-lg shrink-0 ${modality === 'assisted' ? 'bg-secondary text-white' : 'bg-surface-container'}`}>
            <Icon name="storefront" size={18} />
          </div>
          <div>
            <p className="text-sm">Compra Asistida en Tienda</p>
            <p className="text-[11px] font-normal text-on-surface-variant">Requerir item y fondos para comprar por ti</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setModality('prealert')}
          className={`p-3.5 rounded-xl text-left transition-all flex items-start gap-3 ${
            modality === 'prealert'
              ? 'bg-surface text-on-surface shadow-xs font-bold border border-secondary/40'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <div className={`p-2 rounded-lg shrink-0 ${modality === 'prealert' ? 'bg-secondary text-white' : 'bg-surface-container'}`}>
            <Icon name="receipt_long" size={18} />
          </div>
          <div>
            <p className="text-sm">Ya compré online (Ecommerce)</p>
            <p className="text-[11px] font-normal text-on-surface-variant">Adjuntar ticket / factura para solo envío</p>
          </div>
        </button>
      </div>

      {/* Formulario Dinámico */}
      <form onSubmit={handleSubmit} className="bg-surface rounded-2xl p-5 sm:p-6 border border-outline-variant/30 space-y-5">
        
        {/* 1. Datos del Destinatario */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            1. Datos del Destinatario en Bolivia
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1">
                WhatsApp Bolivia *
              </label>
              <div className="flex rounded-lg overflow-hidden bg-surface-container-low">
                <span className="px-2.5 flex items-center text-xs font-bold text-on-surface-variant bg-surface-container">
                  +591
                </span>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  placeholder="77012345"
                  className="w-full h-10 px-3 bg-transparent text-on-surface text-xs focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1">
                Ciudad en Bolivia
              </label>
              <select
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-secondary"
              >
                <option value="Santa Cruz de la Sierra">Santa Cruz (Equipetrol)</option>
                <option value="La Paz">La Paz (Sopocachi / Calacoto)</option>
                <option value="Cochabamba">Cochabamba (Zona Norte)</option>
                <option value="Sucre">Sucre</option>
                <option value="Tarija">Tarija</option>
                <option value="Oruro">Oruro</option>
                <option value="Potosí">Potosí</option>
                <option value="Beni">Beni</option>
                <option value="Pando">Pando</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1">
                Entrega
              </label>
              <div className="grid grid-cols-2 gap-2 h-10">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
                    deliveryMethod === 'pickup'
                      ? 'bg-secondary text-white font-bold'
                      : 'bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  <Icon name="store" size={14} />
                  <span>Sucursal ($0)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
                    deliveryMethod === 'delivery'
                      ? 'bg-secondary text-white font-bold'
                      : 'bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  <Icon name="local_shipping" size={14} />
                  <span>Domicilio</span>
                </button>
              </div>
            </div>
          </div>

          {deliveryMethod === 'delivery' && (
            <div className="pt-1">
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Dirección exacta de entrega en tu ciudad..."
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-secondary"
              />
            </div>
          )}
        </div>

        {/* 2. Sección Específica según la Modalidad Elegida */}
        <div className="pt-2 border-t border-outline-variant/20 space-y-3">
          
          {modality === 'assisted' ? (
            /* COMPRA ASISTIDA: ITEM PARA VISUALIZAR Y FONDOS REQUERIDOS */
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                <Icon name="shopping_bag" size={14} className="text-secondary" />
                <span>2. Producto a Comprar y Fondos Requeridos</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">
                    Descripción del Item *
                  </label>
                  <input
                    type="text"
                    required
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    placeholder="Ej. MacBook Air 13'' M2 16GB RAM o Zapatillas Nike Pegasus talla 9.5"
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">
                    Tienda en USA
                  </label>
                  <input
                    type="text"
                    value={itemStore}
                    onChange={(e) => setItemStore(e.target.value)}
                    placeholder="Ej. Best Buy, Apple 5th Ave, Nike, Coach Outlet"
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">
                    Precio del Producto (USD) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-on-surface-variant">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={estimatedBudgetUSD || ''}
                      onChange={(e) => setEstimatedBudgetUSD(parseFloat(e.target.value) || 0)}
                      placeholder="Precio en dólares"
                      className="w-full h-10 pl-7 pr-3 rounded-lg bg-surface-container-low text-on-surface text-xs font-bold focus:outline-none focus:ring-1 focus:ring-secondary"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">
                    Link de Compra / Enlace del Producto (Opcional)
                  </label>
                  <input
                    type="url"
                    value={itemUrl}
                    onChange={(e) => setItemUrl(e.target.value)}
                    placeholder="https://www.apple.com/... o enlace de Best Buy / Amazon"
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">
                    Detalles Adicionales (Color, Talla, Especificaciones)
                  </label>
                  <input
                    type="text"
                    value={itemNotes}
                    onChange={(e) => setItemNotes(e.target.value)}
                    placeholder="Ej. Color Midnight, teclado en inglés..."
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                </div>
              </div>

              {/* Cálculo transparente de fondos requeridos */}
              {estimatedBudgetUSD > 0 && (
                <div className="p-3.5 rounded-xl bg-surface-container-low/90 border border-outline-variant/30 space-y-1.5 text-xs">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Precio del producto:</span>
                    <span>${estimatedBudgetUSD.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Comisión de compra asistida (8%):</span>
                    <span>${(estimatedBudgetUSD * 0.08).toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between font-bold text-on-surface pt-1 border-t border-outline-variant/20 text-sm">
                    <span>Fondos Requeridos:</span>
                    <span className="text-secondary font-display">
                      ${(estimatedBudgetUSD * 1.08).toFixed(2)} USD{' '}
                      <span className="text-xs text-on-surface-variant font-normal">
                        (aprox. Bs. {(estimatedBudgetUSD * 1.08 * 6.96).toFixed(0)})
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* YA COMPRÓ ONLINE: TICKET Y TRACKING */
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                <Icon name="receipt" size={14} className="text-secondary" />
                <span>2. Ticket y Tracking de tu Compra Online</span>
              </h2>

              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">
                  Número de Tracking USA (si ya te lo enviaron)
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Ej. FedEx, UPS, USPS o Amazon TBA..."
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">
                  Adjuntar Ticket, Factura o Recibo (PDF o Imagen)
                </label>
                <label className="border border-dashed border-outline-variant rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-surface-container-low transition-colors">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => setTicketFile(e.target.files?.[0] || null)}
                  />
                  <Icon name="upload_file" size={24} className="text-secondary" />
                  <span className="text-xs font-semibold text-on-surface">
                    {ticketFile ? ticketFile.name : 'Haz clic para subir el ticket o factura'}
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    {ticketFile ? 'Archivo listo para procesar' : 'Factura emitida por Amazon, Apple, Nike, etc.'}
                  </span>
                </label>
              </div>
            </div>
          )}

        </div>

        {errorMsg && (
          <p className="text-xs text-error font-medium">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-xl bg-primary-container hover:bg-black text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <span>Procesando...</span>
          ) : (
            <>
              <span>{modality === 'assisted' ? 'Solicitar Compra Asistida' : 'Confirmar Envío con Ticket'}</span>
              <Icon name="arrow_forward" size={15} />
            </>
          )}
        </button>

      </form>

      {/* Modal de confirmación */}
      {createdOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-outline-variant/30">
            <div className="w-12 h-12 rounded-full bg-secondary/15 text-secondary flex items-center justify-center mx-auto">
              <Icon name="check_circle" size={28} />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold font-display text-on-surface">
                ¡Solicitud Registrada!
              </h3>
              <p className="text-xs text-on-surface-variant">
                Código de Orden: <strong className="text-on-surface font-mono">{createdOrder.id}</strong>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low text-xs space-y-1 text-on-surface-variant">
              <p><strong>Titular:</strong> {clientName}</p>
              <p><strong>Destino:</strong> {destinationCity}</p>
              {modality === 'assisted' && (
                <p><strong>Item:</strong> {itemDescription} (${estimatedBudgetUSD} USD)</p>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={getWhatsAppConfirmLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Icon name="chat" size={16} />
                <span>Confirmar por WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setCreatedOrder(null)}
                className="w-full py-2.5 text-xs text-on-surface-variant hover:text-on-surface"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default RegistroFlow;
