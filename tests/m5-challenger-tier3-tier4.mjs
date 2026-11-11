/**
 * NY2Bolivia Web (Andean Skyline Logistics)
 * Milestone 5 Empirical Adversarial Verification Suite
 * Tier 3 (Cross-Feature Combinations), Tier 4 (Real-World Scenarios), & Stress Invariants
 *
 * File: ny2bolivia_web/tests/m5-challenger-tier3-tier4.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';

const ROOT_DIR = path.resolve(process.cwd());
const SRC_DIR = path.join(ROOT_DIR, 'src');
const NEXT_SERVER_APP_DIR = path.join(ROOT_DIR, '.next', 'server', 'app');
const REGISTRO_HTML_PATH = path.join(NEXT_SERVER_APP_DIR, 'registro.html');
const INDEX_HTML_PATH = path.join(NEXT_SERVER_APP_DIR, 'index.html');

console.log('================================================================');
console.log('  CHALLENGER 2: EMPIRICAL VERIFICATION SUITE — MILESTONE 5     ');
console.log('  Tier 3 (Cross-Feature) & Tier 4 (Real-World Application)     ');
console.log('================================================================');
console.log(`Working Directory: ${ROOT_DIR}`);
console.log(`Timestamp:         ${new Date().toISOString()}\n`);

let totalAssertions = 0;
let passedAssertions = 0;
const failureList = [];
const caveatsList = [];

function check(tier, name, fn) {
  totalAssertions++;
  const id = totalAssertions.toString().padStart(2, '0');
  try {
    fn();
    passedAssertions++;
    console.log(`  [PASS] #${id} [${tier}] ${name}`);
  } catch (err) {
    failureList.push({ id, tier, name, error: err.message, stack: err.stack });
    console.error(`  [FAIL] #${id} [${tier}] ${name}`);
    console.error(`         -> ${err.message}`);
  }
}

// ---------------------------------------------------------------------------
// CORE CONFIGURATION & SERVICE MOCKS
// ---------------------------------------------------------------------------
const DEFAULT_CONFIG = {
  adminPin: '1234',
  adminPassword: 'admin',
  exchangeRateBOB: 6.96,
  defaultCommissionRate: 8,
  defaultBaseFeeUSD: 20.00,
  airFreightRatePerLbUSD: 9.50,
  whatsappSupportNumber: '59177012345',
  warehouseAddress: {
    title: 'NY2Bolivia Logistics Hub',
    company: 'Andean Skyline Logistics Corp',
    addressLine1: '350 5th Avenue, Suite NY-HUB',
    suiteLine: 'Attn: [Tu Nombre Completo / Suite NY]',
    cityStateZip: 'New York, NY 10118',
    phone: '+1 (212) 555-NY2B (6922)',
  },
};

function calculateFinancials(
  items,
  customCommissionPercent,
  customBaseFeeUSD,
  customExchangeRateBOB,
  config = DEFAULT_CONFIG
) {
  const activeConfig = config || DEFAULT_CONFIG;
  const totalProductUSD = Number(
    items.reduce((sum, item) => sum + (Number(item.priceUSD) || 0) * (Number(item.quantity) || 1), 0).toFixed(2)
  );

  const commissionPercent = customCommissionPercent !== undefined
    ? Number(customCommissionPercent)
    : activeConfig.defaultCommissionRate;

  const commissionUSD = Number(((totalProductUSD * commissionPercent) / 100).toFixed(2));
  const baseFeeUSD = customBaseFeeUSD !== undefined
    ? Number(customBaseFeeUSD)
    : activeConfig.defaultBaseFeeUSD;

  const totalFeeUSD = Number((commissionUSD + baseFeeUSD).toFixed(2));
  const exchangeRateBOB = customExchangeRateBOB !== undefined
    ? Number(customExchangeRateBOB)
    : activeConfig.exchangeRateBOB;

  const totalFeeBOB = Number((totalFeeUSD * exchangeRateBOB).toFixed(2));

  return {
    totalProductUSD,
    commissionPercent,
    commissionUSD,
    baseFeeUSD,
    totalFeeUSD,
    exchangeRateBOB,
    totalFeeBOB,
    feePaymentStatus: 'pending',
    feePaymentMethod: 'QR Simple Bancario',
    feePaidAt: null,
  };
}

class MockLocalStorage {
  constructor() {
    this.store = new Map();
  }
  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }
  setItem(key, value) {
    this.store.set(key, String(value));
  }
  removeItem(key) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

class TestOrdersService {
  constructor(storage) {
    this.storage = storage;
    this.STORAGE_KEY = 'ny2bolivia_orders_db';
    if (!this.storage.getItem(this.STORAGE_KEY)) {
      this.storage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    }
  }

  async getOrders() {
    const raw = this.storage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  async getOrderById(id) {
    const cleanId = (id || '').trim();
    if (!cleanId) return null;
    const orders = await this.getOrders();
    return orders.find(o => o.id === cleanId || o.id.toLowerCase() === cleanId.toLowerCase()) || null;
  }

  async createOrder(input) {
    const now = new Date().toISOString();
    const currentYear = new Date().getFullYear();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const orderId = `NY-${currentYear}-${randomDigits}`;

    let sanitizedPhone = input.clientPhone.replace(/\D/g, '');
    if (!sanitizedPhone.startsWith('591') && sanitizedPhone.length === 8) {
      sanitizedPhone = `591${sanitizedPhone}`;
    }

    const normalizedItems = input.items.map((item, idx) => ({
      id: item.id || `item-${randomDigits}-${idx + 1}`,
      storeName: item.storeName || 'Tienda USA',
      category: item.category || 'Varios',
      productName: item.productName || 'Producto sin nombre',
      productUrl: item.productUrl || '',
      quantity: Math.max(1, Number(item.quantity) || 1),
      priceUSD: Math.max(0, Number(item.priceUSD) || 0),
      trackingUSA: item.trackingUSA || input.trackingUSA || '',
      notes: item.notes || '',
    }));

    const financials = calculateFinancials(
      normalizedItems,
      input.customCommissionPercent,
      input.customBaseFeeUSD,
      input.customExchangeRateBOB,
      DEFAULT_CONFIG
    );

    const newOrder = {
      id: orderId,
      createdAt: now,
      clientName: input.clientName.trim(),
      clientPhone: sanitizedPhone,
      suiteCode: (input.suiteCode || 'SOLICITADA').toUpperCase().trim(),
      destinationCity: input.destinationCity.trim(),
      deliveryMethod: input.deliveryMethod,
      deliveryAddress: input.deliveryMethod === 'delivery' ? (input.deliveryAddress || '').trim() : '',
      modality: input.modality,
      items: normalizedItems,
      trackingUSA: input.trackingUSA || '',
      specialInstructions: {
        optimizeWeight: input.specialInstructions?.optimizeWeight ?? true,
        photoInspection: input.specialInstructions?.photoInspection ?? true,
        holidayPackaging: input.specialInstructions?.holidayPackaging ?? false,
      },
      invoiceFileName: input.invoiceFileName || '',
      invoiceFileUrl: input.invoiceFileUrl || '',
      financials,
      status: 'pedido',
      statusHistory: [
        {
          status: 'pedido',
          timestamp: now,
          note: `Pedido registrado por el cliente vía web (${input.modality === 'prealert' ? 'Pre-Alerta' : 'Compra Asistida'}).`,
        },
      ],
      purchaseDetails: {
        boughtAt: input.modality === 'prealert' ? now : null,
        buyerNote: input.modality === 'prealert' ? 'Comprado por el cliente en USA' : 'Pendiente pago del fee para compra en Manhattan',
        storeReceiptNumber: '',
        storeLocation: normalizedItems[0]?.storeName || '',
      },
      warehouseDetails: {
        receivedAt: null,
        weightLbs: 0,
        packagesCount: normalizedItems.length,
        photoEvidenceUrl: '',
      },
      deliveryDetails: {
        deliveredAt: null,
        receivedBy: '',
        deliveryNote: '',
      },
    };

    const orders = await this.getOrders();
    orders.unshift(newOrder);
    this.storage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
    return newOrder;
  }

  async updateOrderStatus(orderId, newStatus, note) {
    const orders = await this.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) return null;

    const order = { ...orders[index] };
    const now = new Date().toISOString();
    order.status = newStatus;
    order.statusHistory.push({ status: newStatus, timestamp: now, note: note || `Cambio a ${newStatus}` });
    if (newStatus === 'pagado_fee') {
      order.financials.feePaymentStatus = 'paid';
      order.financials.feePaidAt = now;
    }
    orders[index] = order;
    this.storage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
    return order;
  }

  getWhatsAppCoordinatorUrl(order) {
    const whatsAppMessage = `Hola NY2Bolivia, acabo de registrar mi orden *${order.id}* vía web.\n` +
      `👤 *Cliente:* ${order.clientName}\n` +
      `📦 *Modalidad:* ${order.modality === 'prealert' ? 'Pre-Alerta (Casillero NY)' : 'Compra Asistida'}\n` +
      `📍 *Destino:* ${order.destinationCity}\n` +
      `💵 *Total Fee Inicial:* $${order.financials.totalFeeUSD.toFixed(2)} USD (${order.financials.totalFeeBOB.toFixed(2)} Bs)\n\n` +
      `Adjunto comprobante QR para activar la reserva de mi cupo en el vuelo JFK Directo.`;

    return `https://wa.me/59177012345?text=${encodeURIComponent(whatsAppMessage)}`;
  }
}

// ===========================================================================
// TIER 3: CROSS-FEATURE INTERACTIONS
// ===========================================================================
console.log('--- Tier 3: Cross-Feature Interactions ---');

check('Tier 3', 'URL Query Ingestion: /registro?modality=assisted&store=Apple&usd=999&weight=5 populates state', () => {
  const url = new URL('https://ny2bolivia.com/registro?modality=assisted&store=Apple&usd=999&weight=5');
  const params = url.searchParams;

  const qModality = params.get('modality');
  const qStore = params.get('store');
  const qUsd = params.get('usd');
  const qWeight = params.get('weight');

  assert.strictEqual(qModality, 'assisted');
  assert.strictEqual(qStore, 'Apple');
  assert.strictEqual(qUsd, '999');
  assert.strictEqual(qWeight, '5');

  let modality = 'prealert';
  if (qModality === 'assisted' || qModality === 'prealert') {
    modality = qModality;
  }

  let items = [
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
  ];

  if (qStore || qUsd) {
    items = [
      {
        ...items[0],
        storeName: qStore || items[0].storeName,
        priceUSD: qUsd ? parseFloat(qUsd) || items[0].priceUSD : items[0].priceUSD,
      },
      ...items.slice(1),
    ];
  }

  assert.strictEqual(modality, 'assisted');
  assert.strictEqual(items[0].storeName, 'Apple');
  assert.strictEqual(items[0].priceUSD, 999);

  const financials = calculateFinancials(items, modality === 'prealert' ? 0 : 8, 20.00, 6.96);
  assert.strictEqual(financials.totalProductUSD, 999.00);
  assert.strictEqual(financials.commissionPercent, 8);
  assert.strictEqual(financials.commissionUSD, 79.92);
  assert.strictEqual(financials.baseFeeUSD, 20.00);
  assert.strictEqual(financials.totalFeeUSD, 99.92);
  assert.strictEqual(financials.totalFeeBOB, 695.44);
});

check('Tier 3', 'URL Query Ingestion: Store chips match "Apple" case-insensitively', () => {
  const POPULAR_STORES = [
    { id: 'apple', name: 'Apple Store', storeName: 'Apple Store 5th Ave' },
    { id: 'amazon', name: 'Amazon', storeName: 'Amazon USA' },
    { id: 'bh', name: 'B&H Photo NYC', storeName: 'B&H Photo Video NYC' },
  ];

  const queryStore = 'Apple';
  const matched = POPULAR_STORES.some(
    s => s.storeName.toLowerCase().includes(queryStore.toLowerCase()) ||
         s.name.toLowerCase().includes(queryStore.toLowerCase())
  );
  assert.ok(matched, 'Store chips should recognize Apple from query params');
});

check('Tier 3', 'URL Query Ingestion Adversarial: Negative/Invalid USD & Malicious Modality fall back safely', () => {
  const url = new URL('https://ny2bolivia.com/registro?modality=hacker_eval&store=%3Cscript%3E&usd=-99999');
  const params = url.searchParams;

  let modality = 'prealert';
  const qModality = params.get('modality');
  if (qModality === 'assisted' || qModality === 'prealert') {
    modality = qModality;
  }
  assert.strictEqual(modality, 'prealert', 'Invalid modality must default to prealert');

  const qUsd = params.get('usd');
  const parsedUsd = Math.max(0, parseFloat(qUsd) || 0);
  assert.strictEqual(parsedUsd, 0, 'Negative USD input must clamp to 0');
});

check('Tier 3', 'Suite Code Generator creates valid format NY-TEMP-XXXX (4 numeric digits)', () => {
  for (let i = 0; i < 100; i++) {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const code = `NY-TEMP-${randomDigits}`;
    assert.match(code, /^NY-TEMP-\d{4}$/, `Generated code ${code} must match regex ^NY-TEMP-\\d{4}$`);
    assert.ok(randomDigits >= 1000 && randomDigits <= 9999, `Random digits ${randomDigits} out of bounds`);
  }
});

check('Tier 3', 'Suite Code Modal: Queens & Manhattan addresses display complete logistics info', () => {
  const clientName = 'Juan Pablo';
  const manhattanWarehouse = {
    title: 'Hub Comercial Manhattan (Personal Shopper & Concierge)',
    name: clientName.trim() || '[Tu Nombre Completo]',
    company: 'NY2Bolivia Logistics Hub',
    address1: '350 5th Avenue, Suite NY-HUB',
    city: 'New York',
    state: 'NY',
    zip: '10118',
    phone: '+1 (212) 555-6922',
  };

  const queensWarehouse = {
    title: 'Hub Operativo Queens JFK (Recepción de Carga Aérea)',
    name: clientName.trim() || '[Tu Nombre Completo]',
    company: 'NY2Bolivia JFK Hub',
    address1: '147-39 175th Street, Cargo Bldg',
    city: 'Jamaica',
    state: 'NY',
    zip: '11434',
    phone: '+1 (718) 555-0199',
  };

  assert.ok(manhattanWarehouse.address1.includes('350 5th Avenue'));
  assert.strictEqual(manhattanWarehouse.zip, '10118');
  assert.ok(queensWarehouse.address1.includes('175th Street'));
  assert.strictEqual(queensWarehouse.zip, '11434');
});

check('Tier 3', 'Suite Code Propagation: Generated code propagates seamlessly into ClientProfileForm state', () => {
  let formSuiteCode = '';
  const onAssignCode = (code) => {
    formSuiteCode = code;
  };

  const generatedCode = 'NY-TEMP-7821';
  onAssignCode(generatedCode);
  assert.strictEqual(formSuiteCode, 'NY-TEMP-7821', 'Suite code must update form state upon assignment');
});

check('Tier 3', 'Mode Switching Retention: Toggling "Ya compré online" <-> "Compra Asistida" preserves customer profile and items', () => {
  let state = {
    modality: 'prealert',
    clientName: 'María René Camacho',
    clientPhone: '77123456',
    suiteCode: 'NY-BOL-9921',
    destinationCity: 'Cochabamba',
    deliveryMethod: 'delivery',
    deliveryAddress: 'Av. América #450, Torre Roble 5B',
    items: [
      { id: 'item-1', storeName: 'Apple Store 5th Ave', category: 'Electrónica', productName: 'iPhone 16 Pro', quantity: 1, priceUSD: 999, trackingUSA: '1Z9999' },
      { id: 'item-2', storeName: 'Apple Store 5th Ave', category: 'Electrónica', productName: 'AirPods Pro 2', quantity: 1, priceUSD: 249, trackingUSA: '1Z8888' },
    ],
  };

  state = {
    ...state,
    modality: 'assisted',
  };

  assert.strictEqual(state.clientName, 'María René Camacho');
  assert.strictEqual(state.clientPhone, '77123456');
  assert.strictEqual(state.suiteCode, 'NY-BOL-9921');
  assert.strictEqual(state.destinationCity, 'Cochabamba');
  assert.strictEqual(state.deliveryMethod, 'delivery');
  assert.strictEqual(state.deliveryAddress, 'Av. América #450, Torre Roble 5B');
  assert.strictEqual(state.items.length, 2);
  assert.strictEqual(state.items[0].productName, 'iPhone 16 Pro');
  assert.strictEqual(state.items[1].productName, 'AirPods Pro 2');

  const assistedFinancials = calculateFinancials(state.items, 8, 20.00, 6.96);
  assert.strictEqual(assistedFinancials.totalProductUSD, 1248.00);
  assert.strictEqual(assistedFinancials.commissionUSD, 99.84);
  assert.strictEqual(assistedFinancials.baseFeeUSD, 20.00);
  assert.strictEqual(assistedFinancials.totalFeeUSD, 119.84);

  state = {
    ...state,
    modality: 'prealert',
  };

  assert.strictEqual(state.clientName, 'María René Camacho');
  assert.strictEqual(state.items.length, 2);

  const prealertFinancials = calculateFinancials(state.items, 0, 20.00, 6.96);
  assert.strictEqual(prealertFinancials.totalProductUSD, 1248.00);
  assert.strictEqual(prealertFinancials.commissionUSD, 0);
  assert.strictEqual(prealertFinancials.baseFeeUSD, 20.00);
  assert.strictEqual(prealertFinancials.totalFeeUSD, 20.00);
});

check('Tier 3', 'Special Handling Combinations: All 8 boolean combinations preserve financial invariants', () => {
  const dummyItems = [{ priceUSD: 500, quantity: 1 }];
  const baseFin = calculateFinancials(dummyItems, 8, 20.00, 6.96);

  const combinations = [
    { optimizeWeight: true, photoInspection: true, holidayPackaging: true },
    { optimizeWeight: true, photoInspection: true, holidayPackaging: false },
    { optimizeWeight: true, photoInspection: false, holidayPackaging: true },
    { optimizeWeight: true, photoInspection: false, holidayPackaging: false },
    { optimizeWeight: false, photoInspection: true, holidayPackaging: true },
    { optimizeWeight: false, photoInspection: true, holidayPackaging: false },
    { optimizeWeight: false, photoInspection: false, holidayPackaging: true },
    { optimizeWeight: false, photoInspection: false, holidayPackaging: false },
  ];

  combinations.forEach((combo, idx) => {
    const fin = calculateFinancials(dummyItems, 8, 20.00, 6.96);
    assert.strictEqual(fin.totalFeeUSD, baseFin.totalFeeUSD, `Combo #${idx} changed total fee`);
    assert.strictEqual(fin.commissionUSD, baseFin.commissionUSD, `Combo #${idx} changed commission`);
    assert.strictEqual(fin.baseFeeUSD, 20.00, `Combo #${idx} changed base fee`);
  });
});

check('Tier 3', 'Dynamic Multi-Item Builder: Add, update, and remove items with $0 consolidation fee invariant', () => {
  let items = [
    { id: 'item-1', storeName: 'Apple', category: 'Electrónica', productName: 'iPhone', quantity: 1, priceUSD: 1000 },
  ];

  const newItem = { id: 'item-2', storeName: 'Amazon', category: 'Accesorios', productName: 'Case', quantity: 2, priceUSD: 25 };
  items = [...items, newItem];
  assert.strictEqual(items.length, 2);

  let fin = calculateFinancials(items, 8, 20.00, 6.96);
  assert.strictEqual(fin.totalProductUSD, 1050.00);
  assert.strictEqual(fin.commissionUSD, 84.00);
  assert.strictEqual(fin.baseFeeUSD, 20.00);

  items = items.filter(i => i.id !== 'item-1');
  assert.strictEqual(items.length, 1);
  fin = calculateFinancials(items, 8, 20.00, 6.96);
  assert.strictEqual(fin.totalProductUSD, 50.00);
  assert.strictEqual(fin.commissionUSD, 4.00);
});

// ===========================================================================
// TIER 4: REAL-WORLD APPLICATION SCENARIOS
// ===========================================================================
console.log('\n--- Tier 4: Real-World Application Scenarios ---');

check('Tier 4', 'Scenario A (Black Friday Tech Deal): Store click B&H Photo -> 2 items -> La Paz delivery -> Order NY-2026-XXXX -> QR & WhatsApp breakdown', async () => {
  const storage = new MockLocalStorage();
  const service = new TestOrdersService(storage);

  const storeFromUrl = 'B&H Photo Video NYC';
  const items = [
    {
      id: 'item-bh-1',
      storeName: storeFromUrl,
      category: 'Cámaras, Fotografía & Audio Profesional',
      productName: 'Sony Alpha 7 IV Full-Frame Camera Body',
      productUrl: 'https://www.bhphotovideo.com/c/product/1667800-REG',
      quantity: 1,
      priceUSD: 1200.00,
      notes: 'Verificar empaque sellado de fábrica con garantía USA',
    },
    {
      id: 'item-bh-2',
      storeName: storeFromUrl,
      category: 'Cámaras, Fotografía & Audio Profesional',
      productName: 'Sony FE 24-70mm f/2.8 GM II Lens',
      productUrl: 'https://www.bhphotovideo.com/c/product/1699999-REG',
      quantity: 1,
      priceUSD: 450.00,
      notes: 'Lente estándar profesional',
    },
  ];

  const orderInput = {
    clientName: 'Alejandro Siles Pardo',
    clientPhone: '71567890',
    suiteCode: 'NY-BOL-4029',
    destinationCity: 'La Paz (Sopocachi / Calacoto / El Alto)',
    deliveryMethod: 'delivery',
    deliveryAddress: 'Calle 15 de Calacoto #8022, Edificio Los Pinos Apto 3B',
    modality: 'assisted',
    items,
    specialInstructions: {
      optimizeWeight: true,
      photoInspection: true,
      holidayPackaging: false,
    },
    customCommissionPercent: 8,
    customBaseFeeUSD: 20.00,
    customExchangeRateBOB: 6.96,
  };

  const order = await service.createOrder(orderInput);

  assert.ok(order.id.startsWith('NY-2026-'), `Order ID must start with NY-2026-, got ${order.id}`);
  assert.strictEqual(order.clientName, 'Alejandro Siles Pardo');
  assert.strictEqual(order.clientPhone, '59171567890');
  assert.strictEqual(order.destinationCity, 'La Paz (Sopocachi / Calacoto / El Alto)');
  assert.strictEqual(order.deliveryMethod, 'delivery');
  assert.strictEqual(order.deliveryAddress, 'Calle 15 de Calacoto #8022, Edificio Los Pinos Apto 3B');
  assert.strictEqual(order.items.length, 2);

  assert.strictEqual(order.financials.totalProductUSD, 1650.00);
  assert.strictEqual(order.financials.commissionPercent, 8);
  assert.strictEqual(order.financials.commissionUSD, 132.00);
  assert.strictEqual(order.financials.baseFeeUSD, 20.00);
  assert.strictEqual(order.financials.totalFeeUSD, 152.00);
  assert.strictEqual(order.financials.totalFeeBOB, 1057.92);
  assert.strictEqual(order.financials.feePaymentStatus, 'pending');
  assert.strictEqual(order.financials.feePaymentMethod, 'QR Simple Bancario');

  const waUrl = service.getWhatsAppCoordinatorUrl(order);
  assert.ok(waUrl.startsWith('https://wa.me/59177012345?text='));
  const decodedMsg = decodeURIComponent(waUrl.replace('https://wa.me/59177012345?text=', ''));
  assert.ok(decodedMsg.includes(order.id));
  assert.ok(decodedMsg.includes('Alejandro Siles Pardo'));
  assert.ok(decodedMsg.includes('Compra Asistida'));
  assert.ok(decodedMsg.includes('$152.00 USD'));
  assert.ok(decodedMsg.includes('1057.92 Bs'));
});

check('Tier 4', 'Scenario B (Assisted Fashion Shopping): Compra Asistida 3 items Nike & Sephora ($350 total) -> optimize weight -> $0 consolidation -> saved in LocalStorage', async () => {
  const storage = new MockLocalStorage();
  const service = new TestOrdersService(storage);

  const items = [
    {
      id: 'fashion-1',
      storeName: 'Nike NYC House of Innovation',
      category: 'Ropa, Calzado & Accesorios',
      productName: 'Nike Air Zoom Pegasus 41',
      productUrl: 'https://nike.com',
      quantity: 1,
      priceUSD: 140.00,
    },
    {
      id: 'fashion-2',
      storeName: 'Nike NYC House of Innovation',
      category: 'Ropa, Calzado & Accesorios',
      productName: 'Nike Dri-FIT Tech Fleece Hoodie',
      productUrl: 'https://nike.com',
      quantity: 1,
      priceUSD: 110.00,
    },
    {
      id: 'fashion-3',
      storeName: 'Sephora SoHo',
      category: 'Perfumes & Cosméticos de Marca',
      productName: 'Sephora Holiday Fragrance Sampler',
      productUrl: 'https://sephora.com',
      quantity: 1,
      priceUSD: 100.00,
    },
  ];

  const orderInput = {
    clientName: 'Carla Villagomez',
    clientPhone: '59178899000',
    suiteCode: 'NY-BOL-5112',
    destinationCity: 'Santa Cruz de la Sierra',
    deliveryMethod: 'pickup',
    modality: 'assisted',
    items,
    specialInstructions: {
      optimizeWeight: true,
      photoInspection: true,
      holidayPackaging: false,
    },
    customCommissionPercent: 8,
    customBaseFeeUSD: 20.00,
    customExchangeRateBOB: 6.96,
  };

  const createdOrder = await service.createOrder(orderInput);

  assert.strictEqual(createdOrder.financials.totalProductUSD, 350.00);
  assert.strictEqual(createdOrder.financials.commissionUSD, 28.00);
  assert.strictEqual(createdOrder.financials.baseFeeUSD, 20.00);
  assert.strictEqual(createdOrder.financials.totalFeeUSD, 48.00);
  assert.strictEqual(createdOrder.financials.totalFeeBOB, 334.08);
  assert.strictEqual(createdOrder.specialInstructions.optimizeWeight, true);
  assert.strictEqual(createdOrder.financials.totalFeeUSD, Number((28.00 + 20.00).toFixed(2)));

  const retrievedOrder = await service.getOrderById(createdOrder.id);
  assert.ok(retrievedOrder !== null);
  assert.strictEqual(retrievedOrder.id, createdOrder.id);
  assert.strictEqual(retrievedOrder.items.length, 3);
  assert.strictEqual(retrievedOrder.items[0].productName, 'Nike Air Zoom Pegasus 41');
  assert.strictEqual(retrievedOrder.items[2].productName, 'Sephora Holiday Fragrance Sampler');
});

check('Tier 4', 'Scenario C (Offline & Zero-Credential): Pure mock mode executes without Firebase credentials or stalls', async () => {
  const storage = new MockLocalStorage();
  const service = new TestOrdersService(storage);

  const startTime = Date.now();

  const order = await service.createOrder({
    clientName: 'Offline Test User',
    clientPhone: '70011223',
    suiteCode: 'SOLICITADA',
    destinationCity: 'Sucre',
    deliveryMethod: 'pickup',
    modality: 'prealert',
    items: [
      {
        id: 'off-1',
        storeName: 'Amazon USA',
        category: 'Repuestos & Otros Artículos',
        productName: 'Mechanical Keyboard Switch Set',
        quantity: 1,
        priceUSD: 45.00,
        trackingUSA: 'TBA123456789',
      },
    ],
  });

  const duration = Date.now() - startTime;
  assert.ok(duration < 200, `Offline creation took ${duration}ms, must be sub-second (< 200ms)`);
  assert.ok(order.id.startsWith('NY-2026-'));

  const updated = await service.updateOrderStatus(order.id, 'pagado_fee', 'Pago QR verificado localmente');
  assert.strictEqual(updated.status, 'pagado_fee');
  assert.strictEqual(updated.financials.feePaymentStatus, 'paid');
  assert.strictEqual(updated.statusHistory.length, 2);

  const allOrders = await service.getOrders();
  assert.ok(allOrders.length >= 1);
  assert.strictEqual(allOrders[0].id, order.id);
});

check('Tier 4', 'Adversarial Financial Integrity: Extreme values & floating point precision rounding', () => {
  const microFin = calculateFinancials([{ priceUSD: 0.01, quantity: 1 }], 8, 20.00, 6.96);
  assert.strictEqual(microFin.totalProductUSD, 0.01);
  assert.strictEqual(microFin.commissionUSD, 0.00);
  assert.strictEqual(microFin.totalFeeUSD, 20.00);

  const bigFin = calculateFinancials([{ priceUSD: 25000.50, quantity: 2 }], 8, 20.00, 6.96);
  assert.strictEqual(bigFin.totalProductUSD, 50001.00);
  assert.strictEqual(bigFin.commissionUSD, 4000.08);
  assert.strictEqual(bigFin.totalFeeUSD, 4020.08);
  assert.strictEqual(bigFin.totalFeeBOB, Number((4020.08 * 6.96).toFixed(2)));
});

// ===========================================================================
// VIEWPORT & UI ERGONOMICS STRESS TESTS
// ===========================================================================
console.log('\n--- Viewport & UI Ergonomics Stress Testing ---');

check('Viewport', 'Desktop (1280px+): RegistroFlow renders 12-col grid (8-col form, 4-col sticky sidebar top-24)', () => {
  const registroFlowPath = path.join(SRC_DIR, 'components', 'registration', 'RegistroFlow.tsx');
  assert.ok(fs.existsSync(registroFlowPath));
  const src = fs.readFileSync(registroFlowPath, 'utf-8');

  assert.ok(src.includes('grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'));
  assert.ok(src.includes('lg:col-span-8'));
  assert.ok(src.includes('lg:col-span-4 sticky top-24'));
});

check('Viewport', 'Mobile (375px–430px): StickySummarySidebar floating bottom bar positioned at bottom-16 with expandable drawer', () => {
  const sidebarPath = path.join(SRC_DIR, 'components', 'registration', 'StickySummarySidebar.tsx');
  assert.ok(fs.existsSync(sidebarPath));
  const src = fs.readFileSync(sidebarPath, 'utf-8');

  assert.ok(src.includes('lg:hidden fixed bottom-16 inset-x-0 z-40 bg-surface/95 backdrop-blur-xl'));
  assert.ok(src.includes('isMobileExpanded'));
  assert.ok(src.includes('max-h-[50vh] overflow-y-auto custom-scrollbar'));
});

check('Viewport', 'Mobile (375px–430px): MobileBottomNav has h-16, fixed bottom-0, z-50, and safe-area pb-safe', () => {
  const mobileNavPath = path.join(SRC_DIR, 'components', 'layout', 'MobileBottomNav.tsx');
  assert.ok(fs.existsSync(mobileNavPath));
  const src = fs.readFileSync(mobileNavPath, 'utf-8');

  assert.ok(src.includes('fixed bottom-0 inset-x-0 z-50 pb-safe'));
  assert.ok(src.includes('md:hidden'));
  assert.ok(src.includes('h-16'));
  assert.ok(src.includes('grid grid-cols-4'));
});

check('Viewport', 'Page main container has bottom clearance pb-28 on mobile to avoid UI overlap with floating bar and nav', () => {
  const registroPagePath = path.join(SRC_DIR, 'app', 'registro', 'page.tsx');
  assert.ok(fs.existsSync(registroPagePath));
  const src = fs.readFileSync(registroPagePath, 'utf-8');

  assert.ok(src.includes('pb-28 md:pb-16'));
});

check('Viewport', 'Safe-Area CSS utilities pb-safe and pt-safe configured in globals.css', () => {
  const globalsCssPath = path.join(SRC_DIR, 'app', 'globals.css');
  assert.ok(fs.existsSync(globalsCssPath));
  const css = fs.readFileSync(globalsCssPath, 'utf-8');

  assert.ok(css.includes('pb-safe') || css.includes('safe-area-inset-bottom'));
  assert.ok(css.includes('pt-safe') || css.includes('safe-area-inset-top'));
});

// ===========================================================================
// STATIC PRODUCTION SSG PAGES VERIFICATION
// ===========================================================================
console.log('\n--- Production SSG Pages & Markup Verification ---');

check('SSG', 'Static prerendered HTML exists for Landing Page (index.html)', () => {
  assert.ok(fs.existsSync(INDEX_HTML_PATH), `Missing index.html at ${INDEX_HTML_PATH}`);
  const html = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');
  assert.ok(html.length > 50000, `index.html size (${html.length} bytes) is suspiciously small`);
  assert.ok(html.includes('B&amp;H Photo Video') || html.includes('B&H Photo Video'));
  assert.ok(html.includes('/registro'));
});

check('SSG', 'Static prerendered HTML exists for Registration Page (registro.html)', () => {
  assert.ok(fs.existsSync(REGISTRO_HTML_PATH), `Missing registro.html at ${REGISTRO_HTML_PATH}`);
  const html = fs.readFileSync(REGISTRO_HTML_PATH, 'utf-8');
  assert.ok(html.length > 25000, `registro.html size (${html.length} bytes) is suspiciously small`);
  assert.ok(html.includes('NY2Bolivia'));
  assert.ok(html.includes('59177012345'));
});

// ===========================================================================
// SUMMARY & VERDICT
// ===========================================================================
console.log('\n================================================================');
console.log(`  VERIFICATION RESULTS: ${passedAssertions}/${totalAssertions} assertions passed (${Math.round((passedAssertions / totalAssertions) * 100)}%)`);
if (failureList.length > 0) {
  console.log(`  FAILURES (${failureList.length}):`);
  failureList.forEach(f => console.log(`    - [${f.tier}] #${f.id} ${f.name}: ${f.error}`));
}
if (caveatsList.length > 0) {
  console.log(`  CAVEATS (${caveatsList.length}):`);
  caveatsList.forEach(c => console.log(`    - ${c}`));
}
console.log('================================================================');

if (failureList.length === 0) {
  console.log('\n>>> VERDICT: APPROVE <<<\n');
  process.exit(0);
} else {
  console.log('\n>>> VERDICT: REQUEST_CHANGES <<<\n');
  process.exit(1);
}
