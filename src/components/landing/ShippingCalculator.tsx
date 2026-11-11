'use client';

import React, { useState, useId } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export interface ShippingCalculatorProps {
  baseRatePerLbUSD?: number;
  exchangeRateBOB?: number;
  whatsappPhone?: string;
  className?: string;
  defaultWeightLbs?: number;
}

interface WeightPreset {
  id: string;
  name: string;
  iconName: string;
  weightLbs: number;
  category: string;
}

const PRESETS: WeightPreset[] = [
  { id: 'phone', name: 'iPhone / Smartphone', iconName: 'smartphone', weightLbs: 1.0, category: 'Tecnología' },
  { id: 'beauty', name: 'Set Belleza Sephora', iconName: 'auto_fix_high', weightLbs: 2.0, category: 'Belleza' },
  { id: 'sneakers', name: 'Zapatillas Nike', iconName: 'footwear', weightLbs: 3.0, category: 'Calzado' },
  { id: 'coat', name: 'Abrigo de Invierno', iconName: 'dry_cleaning', weightLbs: 4.0, category: 'Moda' },
  { id: 'laptop', name: 'MacBook / Laptop', iconName: 'laptop_mac', weightLbs: 5.0, category: 'Tecnología' },
  { id: 'console', name: 'Consola PS5 / Xbox', iconName: 'videogame_asset', weightLbs: 12.0, category: 'Gaming' },
];

export function ShippingCalculator({
  baseRatePerLbUSD = Number(process.env.NEXT_PUBLIC_BASE_AIR_FREIGHT_USD_LB) || 9.50,
  exchangeRateBOB = Number(process.env.NEXT_PUBLIC_EXCHANGE_RATE_BOB) || 6.96,
  whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_PHONE || '59177012345',
  className = '',
  defaultWeightLbs = 3.0,
}: ShippingCalculatorProps) {
  const sliderId = useId();
  const [calcMode, setCalcMode] = useState<'scale' | 'volumetric'>('scale');
  const [weight, setWeight] = useState<number>(defaultWeightLbs);

  // Volumetric state
  const [unitSystem, setUnitSystem] = useState<'inches' | 'cm'>('cm');
  const [length, setLength] = useState<number>(30); // cm or inches
  const [width, setWidth] = useState<number>(20);
  const [height, setHeight] = useState<number>(15);

  // Volumetric calculation (IATA standard):
  // in inches: (L * W * H) / 166 = lbs
  // in cm: (L * W * H) / 5000 = kg -> lbs (1 kg = 2.20462 lbs)
  const calculateVolumetricWeightLbs = (): number => {
    if (unitSystem === 'inches') {
      const vol = (length * width * height) / 166;
      return Math.max(0.5, Math.round(vol * 10) / 10);
    } else {
      const volKg = (length * width * height) / 5000;
      const volLbs = volKg * 2.20462;
      return Math.max(0.5, Math.round(volLbs * 10) / 10);
    }
  };

  const volumetricWeightLbs = calculateVolumetricWeightLbs();

  // Final billable weight (courier standard: higher of physical vs volumetric)
  const billableWeight = calcMode === 'scale'
    ? Math.max(1.0, weight)
    : Math.max(1.0, Math.max(weight, volumetricWeightLbs));

  const freightUSD = billableWeight * baseRatePerLbUSD;
  const freightBOB = Math.round(freightUSD * exchangeRateBOB);
  const weightKg = (billableWeight * 0.453592).toFixed(2);

  const getWhatsAppQuoteUrl = () => {
    const text = `Hola NY2Bolivia, usé la calculadora de flete en la web. Deseo cotizar un envío de ${billableWeight} lbs (${weightKg} kg). El costo estimado es de $${freightUSD.toFixed(2)} USD / Bs. ${freightBOB} BOB. ¿Cuál es el procedimiento para despacharlo en el vuelo de Black Friday?`;
    return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="calculadora" className={`w-full py-16 px-4 sm:px-6 lg:px-12 bg-surface-container-low ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="font-mono text-xs text-secondary font-bold uppercase tracking-wider bg-secondary-fixed/60 px-3 py-1 rounded-full inline-block mb-2">
            Tarifas Transparentes
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-on-surface tracking-tight">
            Calculadora de Flete Aéreo New York → Bolivia
          </h2>
          <p className="font-sans text-sm sm:text-base text-on-surface-variant mt-2 leading-relaxed">
            Calcula en tiempo real el flete de tus paquetes con nuestra tarifa fija de{' '}
            <strong className="text-brand-navy">${baseRatePerLbUSD.toFixed(2)} USD por libra</strong> y tasa oficial de{' '}
            <strong className="text-brand-navy">{exchangeRateBOB.toFixed(2)} Bs/USD</strong>. Sin recargos sorpresa al llegar a Bolivia.
          </p>
        </div>

        {/* Calculator Main Container */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 lg:p-10 shadow-elevation-2 border border-outline-variant/30 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (8 cols): Inputs & Controls */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-surface-container rounded-2xl">
              <button
                type="button"
                onClick={() => setCalcMode('scale')}
                className={`flex-1 py-2.5 px-3 rounded-xl font-display text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  calcMode === 'scale'
                    ? 'bg-brand-navy text-white shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Icon name="scale" size={18} />
                <span>Por Peso de Báscula (Libras)</span>
              </button>

              <button
                type="button"
                onClick={() => setCalcMode('volumetric')}
                className={`flex-1 py-2.5 px-3 rounded-xl font-display text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  calcMode === 'volumetric'
                    ? 'bg-brand-navy text-white shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Icon name="straighten" size={18} />
                <span>Cálculo Volumétrico (Cajas)</span>
              </button>
            </div>

            {/* Mode A: Direct Scale Weight */}
            {calcMode === 'scale' ? (
              <div className="flex flex-col gap-5">
                
                {/* Weight Indicator with Stepper */}
                <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-2xl border border-outline-variant/20">
                  <div>
                    <label htmlFor={sliderId} className="block text-xs font-mono text-on-surface-variant uppercase font-medium">
                      Peso Estimado del Paquete
                    </label>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-mono text-3xl sm:text-4xl font-extrabold text-brand-navy">
                        {weight.toFixed(1)}
                      </span>
                      <span className="font-mono text-sm text-secondary font-bold">Libras (lbs)</span>
                      <span className="font-mono text-xs text-on-surface-variant">
                        ≈ {weightKg} kg
                      </span>
                    </div>
                  </div>

                  {/* Quick Plus / Minus Stepper */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setWeight((w) => Math.max(1.0, Math.round((w - 0.5) * 10) / 10))}
                      className="w-10 h-10 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface font-bold text-lg transition-colors"
                      aria-label="Restar 0.5 libras"
                    >
                      <Icon name="remove" size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setWeight((w) => Math.min(50.0, Math.round((w + 0.5) * 10) / 10))}
                      className="w-10 h-10 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface font-bold text-lg transition-colors"
                      aria-label="Sumar 0.5 libras"
                    >
                      <Icon name="add" size={18} />
                    </button>
                  </div>
                </div>

                {/* Range Slider */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-mono text-on-surface-variant">
                    <span>1.0 lb (Mínimo)</span>
                    <span className="font-bold text-secondary">25 lbs</span>
                    <span>50.0 lbs (Carga Pesada)</span>
                  </div>
                  <input
                    id={sliderId}
                    type="range"
                    min="1"
                    max="50"
                    step="0.5"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 1)}
                    className="w-full h-3 bg-surface-container rounded-lg appearance-none cursor-pointer accent-secondary focus:outline-none"
                  />
                </div>

                {/* Quick Presets Grid */}
                <div className="flex flex-col gap-2 pt-2">
                  <span className="font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                    <Icon name="bolt" size={16} className="text-brand-gold" />
                    <span>Ejemplos Frecuentes de Black Friday:</span>
                  </span>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setWeight(preset.weightLbs)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                          Math.abs(weight - preset.weightLbs) < 0.1
                            ? 'border-secondary bg-secondary-fixed/30 ring-2 ring-secondary/20'
                            : 'border-outline-variant/30 bg-surface-container-low hover:bg-surface-container'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Icon name={preset.iconName} size={18} className="text-brand-navy" />
                          <span className="font-mono text-xs font-bold text-secondary">
                            {preset.weightLbs.toFixed(1)} lb
                          </span>
                        </div>
                        <span className="font-sans text-xs font-semibold text-on-surface line-clamp-1">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              /* Mode B: Volumetric Box Calculation */
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs font-bold text-on-surface uppercase tracking-wider">
                    Dimensiones del Paquete
                  </span>
                  <div className="inline-flex rounded-lg bg-surface-container p-0.5 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setUnitSystem('cm')}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        unitSystem === 'cm' ? 'bg-white shadow text-on-surface font-bold' : 'text-on-surface-variant'
                      }`}
                    >
                      Centímetros (cm)
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnitSystem('inches')}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        unitSystem === 'inches' ? 'bg-white shadow text-on-surface font-bold' : 'text-on-surface-variant'
                      }`}
                    >
                      Pulgadas (in)
                    </button>
                  </div>
                </div>

                {/* 3 Dimensional inputs */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-on-surface-variant mb-1">
                      Largo ({unitSystem === 'cm' ? 'cm' : 'in'})
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="200"
                      value={length}
                      onChange={(e) => setLength(Math.max(1, parseFloat(e.target.value) || 1))}
                      className="w-full h-11 px-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-mono text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-on-surface-variant mb-1">
                      Ancho ({unitSystem === 'cm' ? 'cm' : 'in'})
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="200"
                      value={width}
                      onChange={(e) => setWidth(Math.max(1, parseFloat(e.target.value) || 1))}
                      className="w-full h-11 px-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-mono text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-on-surface-variant mb-1">
                      Alto ({unitSystem === 'cm' ? 'cm' : 'in'})
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="200"
                      value={height}
                      onChange={(e) => setHeight(Math.max(1, parseFloat(e.target.value) || 1))}
                      className="w-full h-11 px-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-mono text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                </div>

                {/* Physical Scale Weight input for comparison */}
                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="scale" size={18} className="text-secondary" />
                    <span className="text-xs font-sans text-on-surface font-medium">
                      Peso Físico Real en Báscula (opcional):
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 w-32">
                    <input
                      type="number"
                      min="0.5"
                      max="100"
                      step="0.5"
                      value={weight}
                      onChange={(e) => setWeight(parseFloat(e.target.value) || 1)}
                      className="w-full h-9 px-2 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-right font-mono text-xs"
                    />
                    <span className="font-mono text-xs text-on-surface-variant">lbs</span>
                  </div>
                </div>

                {/* IATA Explanation Comparison */}
                <div className="p-3.5 bg-secondary-fixed/30 rounded-xl border border-secondary/20 flex flex-col gap-1 text-xs">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-on-surface-variant">Peso Físico: <strong>{weight.toFixed(1)} lbs</strong></span>
                    <span className="text-secondary font-bold">Volumétrico IATA: <strong>{volumetricWeightLbs.toFixed(1)} lbs</strong></span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant leading-tight mt-1">
                    *Regla aérea IATA: Se factura el mayor entre el peso físico y el volumétrico. En este caso aplica:{' '}
                    <strong className="text-secondary font-mono">{billableWeight.toFixed(1)} lbs</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* Consolidation Callout */}
            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center gap-2.5 text-xs text-on-surface-variant">
              <Icon name="inventory_2" size={18} className="text-brand-blue shrink-0" />
              <span>
                <strong>Consolidación $0:</strong> ¿Tienes varios paquetes pequeños? Los unificamos en una sola caja para que pagues solo por el peso total acumulado.
              </span>
            </div>

          </div>

          {/* Right Column (5 cols): Cost Breakdown & Instant CTAs */}
          <div className="lg:col-span-5 bg-surface-container-low rounded-2xl p-6 border border-outline-variant/30 flex flex-col justify-between gap-6">
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                <span className="font-mono text-xs font-bold text-secondary uppercase tracking-wider">
                  Resumen de Flete Aéreo
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-[11px] bg-brand-navy text-white px-2 py-0.5 rounded">
                  JFK ✈ BOLIVIA
                </span>
              </div>

              {/* Real-time Totals Card */}
              <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-3">
                <div>
                  <span className="font-mono text-xs text-on-surface-variant block mb-1">
                    Total Flete en Dólares:
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-3xl sm:text-4xl font-extrabold text-brand-navy">
                      ${freightUSD.toFixed(2)}
                    </span>
                    <span className="font-mono text-xs text-on-surface-variant font-medium">USD</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-outline-variant/20">
                  <span className="font-mono text-xs text-on-surface-variant block mb-1">
                    Total Flete en Bolivianos (QR Simple / Banco):
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-2xl sm:text-3xl font-extrabold text-secondary">
                      Bs. {freightBOB.toLocaleString()}
                    </span>
                    <span className="font-mono text-xs text-on-surface-variant font-medium">
                      BOB (T.C. {exchangeRateBOB.toFixed(2)})
                    </span>
                  </div>
                </div>
              </div>

              {/* Transparent Fee Checklist */}
              <div className="space-y-2 text-xs font-sans text-on-surface-variant">
                <div className="flex items-center justify-between py-1 border-b border-outline-variant/10">
                  <span className="flex items-center gap-1.5">
                    <Icon name="check" size={14} className="text-emerald-600" />
                    <span>Tarifa fija ($9.50 × {billableWeight.toFixed(1)} lbs)</span>
                  </span>
                  <span className="font-mono font-bold text-on-surface">${freightUSD.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-outline-variant/10">
                  <span className="flex items-center gap-1.5">
                    <Icon name="check" size={14} className="text-emerald-600" />
                    <span>Recepción en Almacén Queens NY</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-600">$0.00 GRATIS</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-outline-variant/10">
                  <span className="flex items-center gap-1.5">
                    <Icon name="check" size={14} className="text-emerald-600" />
                    <span>Consolidación de Paquetes</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-600">$0.00 GRATIS</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-outline-variant/10">
                  <span className="flex items-center gap-1.5">
                    <Icon name="check" size={14} className="text-emerald-600" />
                    <span>Inspección Fotográfica de Báscula</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-600">$0.00 GRATIS</span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="flex items-center gap-1.5">
                    <Icon name="flight_takeoff" size={14} className="text-brand-blue" />
                    <span>Entrega en Bolivia</span>
                  </span>
                  <span className="font-sans font-bold text-brand-navy">Desde el 4 de Dic</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2.5 pt-2">
              <a
                href={getWhatsAppQuoteUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-secondary hover:bg-brand-blue-dark text-white font-display font-bold text-sm shadow transition-transform hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                <Icon name="chat" size={18} />
                <span>Cotizar este Envío en WhatsApp</span>
              </a>

              <Link
                href={`/registro?weight=${billableWeight}&usd=${freightUSD.toFixed(2)}&bob=${freightBOB}`}
                className="w-full py-3 px-4 rounded-xl bg-brand-navy hover:bg-black text-white font-display font-bold text-xs text-center shadow-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <Icon name="inventory_2" size={16} />
                <span>Apartar Cupo con este Peso ($20 USD)</span>
              </Link>

              <p className="text-[11px] text-center text-on-surface-variant font-sans">
                🔒 El pago del flete se realiza una vez que tu paquete es pesado y fotografiado en Queens.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default ShippingCalculator;
