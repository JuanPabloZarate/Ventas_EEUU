'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export interface ProductTariff {
  id: string;
  category: string;
  name: string;
  exampleItems: string;
  shippingRateUSD: number; // Tarifa fija de envío según producto
  commissionRatePercent: number; // Comisión % por gestión
  taxNote: string;
  estimatedDeliveryDays: string;
}

export const INITIAL_TARIFFS: ProductTariff[] = [
  {
    id: 'laptops-tablets',
    category: 'Computación & Laptops',
    name: 'MacBooks, Laptops & iPads',
    exampleItems: 'MacBook Air/Pro, Lenovo Legion, iPad Pro, Surface',
    shippingRateUSD: 35.00,
    commissionRatePercent: 8,
    taxNote: 'Seguro de tránsito de alta gama incluido',
    estimatedDeliveryDays: 'Directo 4 Dic',
  },
  {
    id: 'smartphones',
    category: 'Celulares & Smartwatches',
    name: 'Smartphones & Relojes Inteligentes',
    exampleItems: 'iPhone 16 / 15 Pro, Samsung Galaxy S24, Apple Watch',
    shippingRateUSD: 25.00,
    commissionRatePercent: 8,
    taxNote: 'Desaduanización prioritaria y sello de seguridad',
    estimatedDeliveryDays: 'Directo 4 Dic',
  },
  {
    id: 'audio-accessories',
    category: 'Audio & Gadgets',
    name: 'Auriculares & Audio Portátil',
    exampleItems: 'Sony WH-1000XM5, AirPods Pro 2, Bocinas Bose / JBL',
    shippingRateUSD: 18.00,
    commissionRatePercent: 8,
    taxNote: 'Caja protectora contra golpes sin costo extra',
    estimatedDeliveryDays: 'Directo 4 Dic',
  },
  {
    id: 'fashion-under-110',
    category: 'Ropa & Calzado (< $110)',
    name: 'Prendas y Zapatillas Individuales (< $110)',
    exampleItems: 'Nike Pegasus, Hoodies, Jeans Levi’s, Chompas Cashmere',
    shippingRateUSD: 15.00,
    commissionRatePercent: 8,
    taxNote: '0% Sales Tax exclusivo de NYC (Exento de impuestos)',
    estimatedDeliveryDays: 'Directo 4 Dic',
  },
  {
    id: 'luxury-bags',
    category: 'Bolsos & Moda Exclusiva',
    name: 'Carteras de Diseñador & Bolsos',
    exampleItems: 'Coach City Tote, Michael Kors, Racks de Woodbury',
    shippingRateUSD: 24.00,
    commissionRatePercent: 8,
    taxNote: 'Inspección de autenticidad en tienda física',
    estimatedDeliveryDays: 'Directo 4 Dic',
  },
  {
    id: 'beauty-perfumes',
    category: 'Belleza & Cuidado Personal',
    name: 'Perfumes, Cosméticos & Dyson',
    exampleItems: 'Dyson Airwrap, Sephora Gift Sets, Perfumes YSL/Chanel',
    shippingRateUSD: 20.00,
    commissionRatePercent: 8,
    taxNote: 'Embalaje térmico especial para fragancias',
    estimatedDeliveryDays: 'Directo 4 Dic',
  },
  {
    id: 'gaming-consoles',
    category: 'Consolas & Videojuegos',
    name: 'Consolas de Videojuegos & VR',
    exampleItems: 'PlayStation 5 Slim, Nintendo Switch OLED, Meta Quest 3',
    shippingRateUSD: 45.00,
    commissionRatePercent: 8,
    taxNote: 'Precinto rígido y seguro de rotura',
    estimatedDeliveryDays: 'Directo 4 Dic',
  },
];

export function TarifasAdminView() {
  const [tariffs, setTariffs] = useState<ProductTariff[]>(INITIAL_TARIFFS);
  const [exchangeRateBOB, setExchangeRateBOB] = useState<number>(6.96);
  const [selectedTariffId, setSelectedTariffId] = useState<string>('laptops-tablets');
  const [testProductPriceUSD, setTestProductPriceUSD] = useState<number>(749);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Cargar de LocalStorage si existe configuración previa
  useEffect(() => {
    try {
      const saved = localStorage.getItem('compras_eeuu_tariffs_admin');
      if (saved) {
        setTariffs(JSON.parse(saved));
      }
      const savedRate = localStorage.getItem('compras_eeuu_rate_bob');
      if (savedRate) {
        setExchangeRateBOB(parseFloat(savedRate) || 6.96);
      }
    } catch {
      // fallback
    }
  }, []);

  const handleUpdateRate = (id: string, field: 'shippingRateUSD' | 'commissionRatePercent', val: number) => {
    setTariffs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: Math.max(0, val) } : t))
    );
  };

  const handleSaveAll = () => {
    try {
      localStorage.setItem('compras_eeuu_tariffs_admin', JSON.stringify(tariffs));
      localStorage.setItem('compras_eeuu_rate_bob', exchangeRateBOB.toString());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const currentSelected = tariffs.find((t) => t.id === selectedTariffId) || tariffs[0];
  const commissionCalculatedUSD = (testProductPriceUSD * currentSelected.commissionRatePercent) / 100;
  const totalChargeUSD = testProductPriceUSD + currentSelected.shippingRateUSD + commissionCalculatedUSD;
  const totalChargeBOB = Math.round(totalChargeUSD * exchangeRateBOB);

  return (
    <div className="space-y-8">
      
      {/* Header de la Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed/50 text-secondary text-xs font-semibold mb-1.5">
            <Icon name="tune" size={14} />
            <span>Panel de Gestión y Configuración</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-on-surface tracking-tight">
            Administración de Tarifas por Producto
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Configura las tarifas de envío y comisiones según la categoría del producto comprado, y simula la compra al instante.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface flex items-center gap-1.5 transition-all border border-outline-variant/20"
          >
            <Icon name="storefront" size={14} />
            <span>Ver Tienda</span>
          </Link>
          <button
            onClick={handleSaveAll}
            className="px-4 py-2 rounded-xl bg-primary-container hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Icon name="save" size={14} />
            <span>{saveSuccess ? '¡Guardado!' : 'Guardar Tarifas'}</span>
          </button>
        </div>
      </div>

      {/* Control Global: Tipo de Cambio */}
      <div className="bg-surface rounded-2xl p-5 border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-sm text-on-surface">
            Tipo de Cambio Oficial (BOB por cada USD)
          </h3>
          <p className="text-xs text-on-surface-variant">
            Se utiliza para convertir todas las compras y tarifas al cobrar en Bolivia mediante QR Simple.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-on-surface-variant">Bs.</span>
          <input
            type="number"
            step="0.01"
            min="1"
            value={exchangeRateBOB}
            onChange={(e) => setExchangeRateBOB(parseFloat(e.target.value) || 6.96)}
            className="w-24 h-10 px-3 rounded-xl bg-surface-container-low text-on-surface font-bold text-sm text-center focus:outline-none focus:ring-1 focus:ring-secondary"
          />
        </div>
      </div>

      {/* Tabla de Tarifas por Producto */}
      <div className="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-outline-variant/20">
          <h2 className="text-base font-display font-bold text-on-surface">
            Tarifario Segmentado según Producto
          </h2>
          <p className="text-xs text-on-surface-variant">
            Edita directamente la tarifa de envío fija y el porcentaje de comisión para cada categoría.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-low text-on-surface-variant uppercase font-mono text-[10px] tracking-wider border-b border-outline-variant/20">
              <tr>
                <th className="py-3 px-4">Categoría / Producto</th>
                <th className="py-3 px-4">Ejemplos</th>
                <th className="py-3 px-4 text-center">Tarifa Envío ($ USD)</th>
                <th className="py-3 px-4 text-center">Comisión (%)</th>
                <th className="py-3 px-4">Ventaja / Nota Fiscal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15">
              {tariffs.map((t) => (
                <tr key={t.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-on-surface">
                    <div className="text-sm font-bold">{t.name}</div>
                    <div className="text-[11px] text-secondary font-medium">{t.category}</div>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant max-w-xs">
                    {t.exampleItems}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center justify-center">
                      <span className="text-on-surface-variant font-bold mr-1">$</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={t.shippingRateUSD}
                        onChange={(e) => handleUpdateRate(t.id, 'shippingRateUSD', parseFloat(e.target.value) || 0)}
                        className="w-16 h-8 text-center rounded-lg bg-surface-container-low text-on-surface font-bold text-xs focus:ring-1 focus:ring-secondary focus:outline-none"
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center justify-center">
                      <input
                        type="number"
                        min="0"
                        max="50"
                        step="1"
                        value={t.commissionRatePercent}
                        onChange={(e) => handleUpdateRate(t.id, 'commissionRatePercent', parseFloat(e.target.value) || 0)}
                        className="w-14 h-8 text-center rounded-lg bg-surface-container-low text-on-surface font-bold text-xs focus:ring-1 focus:ring-secondary focus:outline-none"
                      />
                      <span className="text-on-surface-variant font-bold ml-1">%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-1 rounded-md bg-surface-container text-on-surface-variant text-[11px]">
                      {t.taxNote}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulador y Gestión de Compra Sencilla */}
      <div className="bg-surface rounded-2xl p-5 sm:p-6 border border-outline-variant/30 space-y-5">
        <div>
          <h2 className="text-base sm:text-lg font-display font-bold text-on-surface flex items-center gap-2">
            <Icon name="calculate" size={20} className="text-secondary" />
            <span>Simulador de Gestión de Compra Sencilla</span>
          </h2>
          <p className="text-xs text-on-surface-variant">
            Prueba cómo se calcula automáticamente el cobro para un cliente seleccionando el producto y su precio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Inputs de Prueba */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Seleccionar Categoría de Producto
              </label>
              <select
                value={selectedTariffId}
                onChange={(e) => setSelectedTariffId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-on-surface text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-secondary"
              >
                {tariffs.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (Envío: ${t.shippingRateUSD} USD | {t.commissionRatePercent}%)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Precio del Producto en USA ($ USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-on-surface-variant">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={testProductPriceUSD}
                  onChange={(e) => setTestProductPriceUSD(parseFloat(e.target.value) || 0)}
                  placeholder="749.00"
                  className="w-full h-10 pl-7 pr-3 rounded-xl bg-surface-container-low text-on-surface text-xs font-bold focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </div>
            </div>
          </div>

          {/* Desglose Transparente */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2 text-xs">
            <div className="flex justify-between text-on-surface-variant">
              <span>Precio del producto:</span>
              <span className="font-semibold text-on-surface">${testProductPriceUSD.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span>Tarifa de envío ({currentSelected.name}):</span>
              <span className="font-semibold text-on-surface">${currentSelected.shippingRateUSD.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span>Comisión de compra ({currentSelected.commissionRatePercent}%):</span>
              <span className="font-semibold text-on-surface">${commissionCalculatedUSD.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-outline-variant/30 text-sm font-bold text-on-surface">
              <span>Total a cobrar en Bolivia:</span>
              <div className="text-right">
                <span className="text-secondary font-display text-base block">${totalChargeUSD.toFixed(2)} USD</span>
                <span className="text-xs text-on-surface-variant font-normal">
                  Bs. {totalChargeBOB.toLocaleString()} BOB (TC {exchangeRateBOB})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Acceso Directo a Registro */}
        <div className="pt-2 flex justify-end">
          <Link
            href={`/registro?usd=${testProductPriceUSD}&item=${encodeURIComponent(currentSelected.name)}`}
            className="px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/90 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <span>Crear Pedido con esta Tarifa</span>
            <Icon name="arrow_forward" size={14} />
          </Link>
        </div>
      </div>

    </div>
  );
}

export default TarifasAdminView;
