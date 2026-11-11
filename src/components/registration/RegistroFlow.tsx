'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ModalityToggle } from './ModalityToggle';
import { ClientProfileForm } from './ClientProfileForm';
import { DynamicItemBuilder } from './DynamicItemBuilder';
import { FileUploadDropzone } from './FileUploadDropzone';
import { StickySummarySidebar } from './StickySummarySidebar';
import { SuiteCodeModal } from './SuiteCodeModal';
import { OrderSuccessModal } from './OrderSuccessModal';
import { ordersService, calculateFinancials } from '@/lib/orders-service';
import type { Order, OrderItem, OrderModality, DeliveryMethod, SpecialInstructions, CreateOrderInput } from '@/types/order';
import { Icon } from '@/components/ui/Icon';

export function RegistroFlow() {
  const searchParams = useSearchParams();

  // 1. Modality State
  const [modality, setModality] = useState<OrderModality>('prealert');

  // 2. Client Profile State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [suiteCode, setSuiteCode] = useState('');
  const [destinationCity, setDestinationCity] = useState('Santa Cruz de la Sierra');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // 3. Dynamic Items State
  const [items, setItems] = useState<OrderItem[]>([
    {
      id: 'item-1',
      storeName: 'Apple Store 5th Ave',
      category: 'Electrónica / Celulares / Laptops',
      productName: '',
      productUrl: '',
      quantity: 1,
      priceUSD: 0,
      trackingUSA: '',
    },
  ]);

  // 4. Instructions & Invoice File
  const [specialInstructions] = useState<SpecialInstructions>({
    optimizeWeight: true,
    photoInspection: true,
    holidayPackaging: false,
  });
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);

  // 5. UI Modals & Submission State
  const [suiteModalOpen, setSuiteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 6. Ingest search parameters
  useEffect(() => {
    const qModality = searchParams.get('modality');
    if (qModality === 'assisted' || qModality === 'prealert') {
      setModality(qModality);
    }

    const qStore = searchParams.get('store');
    const qUsd = searchParams.get('usd');

    if (qStore || qUsd) {
      setItems((prev) => [
        {
          ...prev[0],
          storeName: qStore || prev[0].storeName,
          priceUSD: qUsd ? parseFloat(qUsd) || prev[0].priceUSD : prev[0].priceUSD,
        },
        ...prev.slice(1),
      ]);
    }
  }, [searchParams]);

  // Financials calculation
  const financials = calculateFinancials(
    items,
    modality === 'prealert' ? 0 : 8,
    20.00,
    6.96
  );

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!clientName.trim()) {
      newErrors.clientName = 'Ingresa el nombre completo del destinatario.';
    }

    const cleanPhone = clientPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      newErrors.clientPhone = 'Ingresa un número de celular de 8 dígitos de Bolivia.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Order
  const handleSubmit = async () => {
    if (!validateForm()) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    try {
      const orderInput: CreateOrderInput = {
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        destinationCity,
        deliveryMethod,
        deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress.trim() : undefined,
        modality,
        items,
        specialInstructions,
        invoiceFileName: invoiceFile ? invoiceFile.name : undefined,
      };

      const newOrder = await ordersService.createOrder(orderInput);
      setCreatedOrder(newOrder);
    } catch (err) {
      console.error('Error submitting order:', err);
      alert('Hubo un inconveniente al registrar la orden. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/20">
        <div>
          <h1 className="text-2xl font-display font-bold text-on-surface tracking-tight">
            Registro de Envío y Pre-Alerta
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Ingresa los datos para recepción en almacén de New York y entrega en Bolivia.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSuiteModalOpen(true)}
          className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-secondary flex items-center gap-1.5 transition-all border border-outline-variant/20"
        >
          <Icon name="warehouse" size={14} />
          <span>Ver Dirección de Casillero en NY</span>
        </button>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Form Controls (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Modality Toggle */}
          <ModalityToggle
            value={modality}
            onChange={setModality}
          />

          {/* Section 1: Client Profile & City */}
          <ClientProfileForm
            clientName={clientName}
            onClientNameChange={setClientName}
            clientPhone={clientPhone}
            onClientPhoneChange={setClientPhone}
            suiteCode={suiteCode}
            onSuiteCodeChange={setSuiteCode}
            onOpenSuiteModal={() => setSuiteModalOpen(true)}
            destinationCity={destinationCity}
            onDestinationCityChange={setDestinationCity}
            deliveryMethod={deliveryMethod}
            onDeliveryMethodChange={setDeliveryMethod}
            deliveryAddress={deliveryAddress}
            onDeliveryAddressChange={setDeliveryAddress}
            errors={errors}
          />

          {/* Section 2: Items Builder */}
          <DynamicItemBuilder
            items={items}
            modality={modality}
            onChange={setItems}
          />

          {/* Section 3: Optional Invoice Proof Dropzone */}
          <div className="bg-surface rounded-2xl p-5 border border-outline-variant/30 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-primary-container text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h3 className="font-display font-bold text-sm text-on-surface">
                Factura o Comprobante de Compra (Opcional)
              </h3>
            </div>
            <FileUploadDropzone
              file={invoiceFile}
              onFileSelect={setInvoiceFile}
            />
          </div>

        </div>

        {/* Sticky Cost Summary (4 Cols) */}
        <div className="lg:col-span-4 sticky top-24">
          <StickySummarySidebar
            modality={modality}
            items={items}
            financials={financials}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        </div>

      </div>

      {/* Modals */}
      <SuiteCodeModal
        isOpen={suiteModalOpen}
        onClose={() => setSuiteModalOpen(false)}
        currentSuite={suiteCode || 'NY-2026-TEMP'}
        clientName={clientName}
      />

      {createdOrder && (
        <OrderSuccessModal
          order={createdOrder}
          onClose={() => setCreatedOrder(null)}
        />
      )}
    </div>
  );
}
