'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { RegistrationHero } from './RegistrationHero';
import { ModalityToggle } from './ModalityToggle';
import { ClientProfileForm } from './ClientProfileForm';
import { DynamicItemBuilder } from './DynamicItemBuilder';
import { FileUploadDropzone } from './FileUploadDropzone';
import { SpecialHandling } from './SpecialHandling';
import { StickySummarySidebar } from './StickySummarySidebar';
import { SuiteCodeModal } from './SuiteCodeModal';
import { OrderSuccessModal } from './OrderSuccessModal';
import { ordersService, calculateFinancials } from '@/lib/orders-service';
import type { Order, OrderItem, OrderModality, DeliveryMethod, SpecialInstructions } from '@/types/order';

export function RegistroFlow() {
  const searchParams = useSearchParams();

  // 1. Modality State initialized from query param ?modality=...
  const [modality, setModality] = useState<OrderModality>('prealert');

  // 2. Client Profile State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [suiteCode, setSuiteCode] = useState('');
  const [destinationCity, setDestinationCity] = useState('Santa Cruz de la Sierra');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // 3. Dynamic Items State initialized with item #1
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

  // 4. Special Instructions & Invoice Proof
  const [specialInstructions, setSpecialInstructions] = useState<SpecialInstructions>({
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

  // 6. Safe ingestion of search parameters on mount
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

  // Real-time financials calculation
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
      newErrors.clientName = 'Por favor ingresa el nombre completo del destinatario.';
    }

    const cleanPhone = clientPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      newErrors.clientPhone = 'Ingresa un número de celular de 8 dígitos de Bolivia.';
    }

    if (deliveryMethod === 'delivery' && !deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Ingresa la dirección detallada para la entrega a domicilio.';
    }

    const firstItem = items[0];
    if (!firstItem || !firstItem.productName.trim()) {
      newErrors.productName = 'Ingresa el nombre o descripción del producto principal.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await ordersService.createOrder({
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        suiteCode: suiteCode.trim() || 'SOLICITADA',
        destinationCity,
        deliveryMethod,
        deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress.trim() : '',
        modality,
        items,
        trackingUSA: modality === 'prealert' ? items[0]?.trackingUSA : undefined,
        specialInstructions,
        invoiceFileName: invoiceFile ? invoiceFile.name : undefined,
        customCommissionPercent: modality === 'prealert' ? 0 : 8,
        customBaseFeeUSD: 20.00,
        customExchangeRateBOB: 6.96,
      });

      setCreatedOrder(order);
    } catch (err) {
      console.error('Failed to create order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setClientName('');
    setClientPhone('');
    setSuiteCode('');
    setDestinationCity('Santa Cruz de la Sierra');
    setDeliveryMethod('pickup');
    setDeliveryAddress('');
    setItems([
      {
        id: `item-${Date.now()}-1`,
        storeName: 'Apple Store 5th Ave',
        category: 'Electrónica / Celulares / Laptops',
        productName: '',
        productUrl: '',
        quantity: 1,
        priceUSD: 0,
        trackingUSA: '',
      },
    ]);
    setInvoiceFile(null);
    setErrors({});
    setCreatedOrder(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Banner */}
      <RegistrationHero currentModality={modality} />

      {/* Main 12-Column Responsive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8-Cols: Interactive Form Flow */}
        <div className="lg:col-span-8 flex flex-col gap-6 sm:gap-8">
          {/* Mode Switcher */}
          <ModalityToggle value={modality} onChange={setModality} />

          {/* Section 1: Customer Profile & Destination */}
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

          {/* Section 2: Items & Package Catalog Form */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 space-y-6">
            <DynamicItemBuilder
              items={items}
              onChange={setItems}
              modality={modality}
              errors={errors.productName ? { [items[0]?.id || 'item-1']: { productName: errors.productName } } : undefined}
            />

            <FileUploadDropzone
              file={invoiceFile}
              onFileSelect={setInvoiceFile}
            />

            <SpecialHandling
              instructions={specialInstructions}
              onChange={(updated: SpecialInstructions) => setSpecialInstructions(updated)}
            />
          </div>
        </div>

        {/* Right 4-Cols: Sticky Dynamic Cargo Summary */}
        <div className="lg:col-span-4 sticky top-24">
          <StickySummarySidebar
            items={items}
            modality={modality}
            financials={financials}
            onSubmit={handleSubmitOrder}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      {/* Modals */}
      <SuiteCodeModal
        isOpen={suiteModalOpen}
        onClose={() => setSuiteModalOpen(false)}
        onAssignCode={(code) => {
          setSuiteCode(code);
          setSuiteModalOpen(false);
        }}
        clientName={clientName}
        currentSuite={suiteCode}
      />

      <OrderSuccessModal
        order={createdOrder}
        isOpen={Boolean(createdOrder)}
        onClose={() => setCreatedOrder(null)}
        onResetForm={handleResetForm}
      />
    </div>
  );
}

export default RegistroFlow;
