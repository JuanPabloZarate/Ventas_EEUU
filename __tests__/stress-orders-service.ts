/**
 * Empirical Stress Harness for ordersService
 * File: ny2bolivia_web/__tests__/stress-orders-service.ts
 */

import { ordersService, calculateFinancials, SEED_ORDERS, DEFAULT_CONFIG, STORAGE_KEYS } from '../src/lib/orders-service';
import type { Order, CreateOrderInput } from '../src/types/order';

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  error?: string;
  details?: any;
}

const results: TestResult[] = [];

function assert(condition: boolean, suite: string, name: string, details?: any) {
  if (condition) {
    results.push({ suite, name, passed: true, details });
    console.log(`  ✓ [PASS] [${suite}] ${name}`);
  } else {
    results.push({ suite, name, passed: false, details });
    console.error(`  ✗ [FAIL] [${suite}] ${name}`, details ? JSON.stringify(details) : '');
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('🚀 EMPIRICAL STRESS TEST HARNESS: ordersService');
  console.log('====================================================\n');

  // ================================================================
  // SUITE 1: Node.js / SSR Environment Safety (No window, No localStorage)
  // ================================================================
  console.log('--- Suite 1: Node.js / SSR Environment Safety ---');
  
  assert(typeof window === 'undefined', 'SSR Safety', 'Window is strictly undefined');

  // 1.1 Read initial orders
  const initialOrders = await ordersService.getOrders();
  assert(
    Array.isArray(initialOrders) && initialOrders.length === 4,
    'SSR Safety',
    'getOrders returns 4 seed orders in SSR mode',
    { count: initialOrders.length }
  );

  // 1.2 getOrderById valid & case insensitive
  const order1 = await ordersService.getOrderById('NY-2024-8841');
  assert(
    order1 !== null && order1.clientName === 'Rodrigo Mendoza Morales',
    'SSR Safety',
    'getOrderById finds order by exact ID'
  );

  const order1Lower = await ordersService.getOrderById('ny-2024-8841');
  assert(
    order1Lower !== null && order1Lower.id === 'NY-2024-8841',
    'SSR Safety',
    'getOrderById is case-insensitive'
  );

  // 1.3 getOrderById edge cases
  const emptyOrder = await ordersService.getOrderById('');
  const whitespaceOrder = await ordersService.getOrderById('   ');
  const notFoundOrder = await ordersService.getOrderById('NY-9999-0000');
  assert(
    emptyOrder === null && whitespaceOrder === null && notFoundOrder === null,
    'SSR Safety',
    'getOrderById returns null for empty, whitespace, or non-existent IDs'
  );

  // 1.4 Config in SSR
  const cfg = ordersService.getConfig();
  assert(
    cfg.exchangeRateBOB === 6.96 && cfg.defaultCommissionRate === 8,
    'SSR Safety',
    'getConfig returns DEFAULT_CONFIG in SSR mode'
  );

  const updatedCfg = ordersService.saveConfig({ exchangeRateBOB: 7.10 });
  assert(
    updatedCfg.exchangeRateBOB === 7.10 && ordersService.getConfig().exchangeRateBOB === 7.10,
    'SSR Safety',
    'saveConfig updates in-memory config in SSR mode'
  );
  // Restore
  ordersService.saveConfig({ exchangeRateBOB: 6.96 });

  // 1.5 createOrder in SSR
  const newOrderInput: CreateOrderInput = {
    clientName: 'Juan Carlos Camacho',
    clientPhone: '77099888',
    destinationCity: 'Cochabamba',
    deliveryMethod: 'pickup',
    modality: 'assisted',
    items: [
      {
        storeName: 'B&H Photo NYC',
        category: 'Fotografía',
        productName: 'Sony A7 IV Body',
        priceUSD: 2498.00,
        quantity: 1
      }
    ]
  };

  const created = await ordersService.createOrder(newOrderInput);
  assert(
    created.id.startsWith('NY-') && created.clientPhone === '59177099888',
    'SSR Safety',
    'createOrder normalizes phone and generates NY ID in SSR',
    { id: created.id, phone: created.clientPhone }
  );

  // Verify it exists in getOrders
  const allOrdersAfterCreate = await ordersService.getOrders();
  assert(
    allOrdersAfterCreate.length === 5 && allOrdersAfterCreate[0].id === created.id,
    'SSR Safety',
    'createOrder unshifts new order to inMemoryOrders'
  );

  // 1.6 updateOrderStatus in SSR
  const updatedStatusOrder = await ordersService.updateOrderStatus(created.id, 'pagado_fee', 'Fee confirmado vía QR');
  assert(
    updatedStatusOrder !== null &&
    updatedStatusOrder.status === 'pagado_fee' &&
    updatedStatusOrder.financials.feePaymentStatus === 'paid' &&
    typeof updatedStatusOrder.financials.feePaidAt === 'string',
    'SSR Safety',
    'updateOrderStatus advances status and auto-marks fee as paid'
  );

  // 1.7 deleteOrder in SSR
  const deleteResult = await ordersService.deleteOrder(created.id);
  const ordersAfterDelete = await ordersService.getOrders();
  assert(
    deleteResult === true && ordersAfterDelete.length === 4 && !ordersAfterDelete.some(o => o.id === created.id),
    'SSR Safety',
    'deleteOrder successfully deletes order from inMemoryOrders'
  );

  // 1.8 getMetrics in SSR
  const metrics = await ordersService.getMetrics();
  assert(
    metrics.totalOrders === 4 &&
    metrics.countPedido === 1 &&
    metrics.countPagadoFee === 1 &&
    metrics.countRecepcionado === 1 &&
    metrics.countEntregado === 1,
    'SSR Safety',
    'getMetrics accurately tallies 4 lifecycle states',
    metrics
  );

  // ================================================================
  // SUITE 2: Financial Engine Boundary Testing (`calculateFinancials`)
  // ================================================================
  console.log('\n--- Suite 2: Financial Engine Boundary Testing ---');

  // 2.1 Standard calculation
  const stdFin = calculateFinancials([{ priceUSD: 999.00, quantity: 1 }]);
  assert(
    stdFin.totalProductUSD === 999.00 &&
    stdFin.commissionUSD === 79.92 &&
    stdFin.baseFeeUSD === 20.00 &&
    stdFin.totalFeeUSD === 99.92 &&
    stdFin.totalFeeBOB === 695.44,
    'Financial Engine',
    'Standard calculation: 8% commission + $20 base @ 6.96 BOB',
    stdFin
  );

  // 2.2 Empty items array
  const emptyFin = calculateFinancials([]);
  assert(
    emptyFin.totalProductUSD === 0 &&
    emptyFin.commissionUSD === 0 &&
    emptyFin.baseFeeUSD === 20 &&
    emptyFin.totalFeeUSD === 20 &&
    emptyFin.totalFeeBOB === 139.20,
    'Financial Engine',
    'Empty items array gracefully yields base fee only',
    emptyFin
  );

  // 2.3 Multiple items with fractions
  const multiFin = calculateFinancials([
    { priceUSD: 19.99, quantity: 3 }, // 59.97
    { priceUSD: 149.50, quantity: 2 } // 299.00 -> total 358.97
  ]);
  assert(
    multiFin.totalProductUSD === 358.97 &&
    multiFin.commissionUSD === 28.72 && // 358.97 * 0.08 = 28.7176 -> 28.72
    multiFin.totalFeeUSD === 48.72,
    'Financial Engine',
    'Multiple fractional items rounds cents properly',
    multiFin
  );

  // 2.4 Custom zero commission percent
  const zeroCommFin = calculateFinancials([{ priceUSD: 100, quantity: 1 }], 0);
  assert(
    zeroCommFin.commissionPercent === 0 &&
    zeroCommFin.commissionUSD === 0 &&
    zeroCommFin.totalFeeUSD === 20,
    'Financial Engine',
    'customCommissionPercent = 0 is preserved (not overridden by default 8%)'
  );

  // 2.5 Custom zero base fee
  const zeroBaseFin = calculateFinancials([{ priceUSD: 100, quantity: 1 }], 8, 0);
  assert(
    zeroBaseFin.baseFeeUSD === 0 &&
    zeroBaseFin.totalFeeUSD === 8,
    'Financial Engine',
    'customBaseFeeUSD = 0 is preserved (not overridden by default $20)'
  );

  // 2.6 Corrupted non-numeric inputs
  const nanFin = calculateFinancials([{ priceUSD: 'invalid' as any, quantity: 'not-a-num' as any }]);
  assert(
    nanFin.totalProductUSD === 0 &&
    !isNaN(nanFin.totalFeeUSD) &&
    nanFin.totalFeeUSD === 20,
    'Financial Engine',
    'Non-numeric strings in items degrade gracefully to 0 price without NaN'
  );

  // ================================================================
  // SUITE 3: createOrder Input Clamping & Phone Normalization
  // ================================================================
  console.log('\n--- Suite 3: Input Clamping & Sanitization ---');

  // 3.1 Negative price and negative quantity clamping
  const clampedOrder = await ordersService.createOrder({
    clientName: 'Test Clamping',
    clientPhone: '+591 (70) 123-456',
    destinationCity: 'La Paz',
    deliveryMethod: 'delivery',
    deliveryAddress: 'Calle Murillo #123',
    modality: 'prealert',
    trackingUSA: 'UPS-12345678',
    items: [
      {
        storeName: 'Amazon',
        category: 'Books',
        productName: 'Handbook',
        priceUSD: -50, // Negative price
        quantity: -10  // Negative quantity
      }
    ]
  });

  assert(
    clampedOrder.items[0].priceUSD === 0 &&
    clampedOrder.items[0].quantity === 1 &&
    clampedOrder.clientPhone === '59170123456' &&
    clampedOrder.purchaseDetails.boughtAt !== null,
    'Clamping & Normalization',
    'Negative price is clamped to 0, negative quantity is clamped to 1, phone normalized, prealert has boughtAt set',
    { item: clampedOrder.items[0], phone: clampedOrder.clientPhone }
  );

  // 3.2 Modality distinctions
  const assistedOrder = await ordersService.createOrder({
    clientName: 'Test Assisted',
    clientPhone: '59171234567',
    destinationCity: 'Sucre',
    deliveryMethod: 'pickup',
    modality: 'assisted',
    items: [{ storeName: 'Nike', category: 'Shoes', productName: 'Sneakers', priceUSD: 120, quantity: 1 }]
  });

  assert(
    assistedOrder.modality === 'assisted' &&
    assistedOrder.purchaseDetails.boughtAt === null &&
    assistedOrder.purchaseDetails.buyerNote.includes('Pendiente pago del fee'),
    'Modality Logic',
    'Assisted modality sets boughtAt to null with pending note'
  );

  // Clean up test orders
  await ordersService.deleteOrder(clampedOrder.id);
  await ordersService.deleteOrder(assistedOrder.id);

  // ================================================================
  // SUITE 4: Fee Payment & Status Progression Logic
  // ================================================================
  console.log('\n--- Suite 4: Fee Payment & Status Progression ---');

  const progOrder = await ordersService.createOrder({
    clientName: 'Progression Test',
    clientPhone: '59170000000',
    destinationCity: 'Tarija',
    deliveryMethod: 'pickup',
    modality: 'assisted',
    items: [{ storeName: 'Apple', category: 'Tech', productName: 'AirPods', priceUSD: 199, quantity: 1 }]
  });

  assert(progOrder.status === 'pedido', 'Progression', 'Initial status is "pedido"');

  // Mark fee as paid
  const feePaidOrder = await ordersService.updateOrderFeePayment(progOrder.id, 'paid', 'QR Simple Bancario');
  assert(
    feePaidOrder !== null &&
    feePaidOrder.status === 'pagado_fee' &&
    feePaidOrder.financials.feePaymentStatus === 'paid' &&
    feePaidOrder.financials.feePaidAt !== null,
    'Progression',
    'updateOrderFeePayment("paid") auto-advances status from pedido to pagado_fee'
  );

  // Advance to recepcionado
  const recepcionadoOrder = await ordersService.updateOrderStatus(progOrder.id, 'recepcionado', 'Arribó a almacén NY', {
    warehouseDetails: { weightLbs: 1.2, photoEvidenceUrl: 'https://example.com/photo.jpg', receivedAt: null, packagesCount: 1 }
  });
  assert(
    recepcionadoOrder !== null &&
    recepcionadoOrder.status === 'recepcionado' &&
    recepcionadoOrder.warehouseDetails.receivedAt !== null &&
    recepcionadoOrder.warehouseDetails.weightLbs === 1.2,
    'Progression',
    'updateOrderStatus("recepcionado") records arrival timestamp and weight'
  );

  // Advance to entregado
  const entregadoOrder = await ordersService.updateOrderStatus(progOrder.id, 'entregado', 'Entregado a cliente', {
    deliveryDetails: { receivedBy: 'Titular Juan', deliveryNote: 'Todo OK', deliveredAt: null }
  });
  assert(
    entregadoOrder !== null &&
    entregadoOrder.status === 'entregado' &&
    entregadoOrder.deliveryDetails.deliveredAt !== null &&
    entregadoOrder.deliveryDetails.receivedBy === 'Titular Juan',
    'Progression',
    'updateOrderStatus("entregado") records delivery timestamp and receiver'
  );

  // Clean up
  await ordersService.deleteOrder(progOrder.id);

  // ================================================================
  // SUITE 5: WhatsApp URL Generator
  // ================================================================
  console.log('\n--- Suite 5: WhatsApp Deep Links ---');

  const sampleOrder = SEED_ORDERS[0]; // status = 'pedido'
  const waUrl = ordersService.getWhatsAppShareUrl(sampleOrder);
  assert(
    waUrl.startsWith('https://wa.me/59177012345?text=') &&
    decodeURIComponent(waUrl).includes(sampleOrder.id) &&
    decodeURIComponent(waUrl).includes('Rodrigo Mendoza Morales') &&
    decodeURIComponent(waUrl).includes('$99.92 USD'),
    'WhatsApp Generator',
    'getWhatsAppShareUrl encodes phone, order ID, client name, and financials for "pedido"'
  );

  // ================================================================
  // SUITE 6: Client-Side Simulation with LocalStorage Corruption
  // ================================================================
  console.log('\n--- Suite 6: Simulated Client Environment & Storage Corruption ---');

  // Create a mock localStorage and window
  const storageMap: Record<string, string> = {
    [STORAGE_KEYS.ORDERS]: JSON.stringify(SEED_ORDERS),
    [STORAGE_KEYS.CONFIG]: JSON.stringify(DEFAULT_CONFIG)
  };

  const mockLocalStorage = {
    getItem: (key: string) => storageMap[key] || null,
    setItem: (key: string, val: string) => { storageMap[key] = val; },
    removeItem: (key: string) => { delete storageMap[key]; },
    clear: () => { Object.keys(storageMap).forEach(k => delete storageMap[k]); }
  };

  const dispatchedEvents: any[] = [];
  const mockWindow = {
    dispatchEvent: (ev: any) => { dispatchedEvents.push(ev); return true; },
    CustomEvent: class CustomEvent {
      type: string;
      detail: any;
      constructor(type: string, opts?: any) {
        this.type = type;
        this.detail = opts?.detail;
      }
    }
  };

  // Attach mock window & localStorage
  (global as any).window = mockWindow;
  (global as any).localStorage = mockLocalStorage;
  (global as any).CustomEvent = mockWindow.CustomEvent;

  // Test client-mode read
  const clientOrders = await ordersService.getOrders();
  assert(
    clientOrders.length === 4,
    'Client Simulation',
    'getOrders reads from localStorage in client environment'
  );

  // Corrupt orders storage with invalid JSON
  mockLocalStorage.setItem(STORAGE_KEYS.ORDERS, '{invalid_json_corrupted: true');
  let threwException = false;
  let fallbackOrders: Order[] = [];
  try {
    fallbackOrders = await ordersService.getOrders();
  } catch {
    threwException = true;
  }

  assert(
    threwException === false && Array.isArray(fallbackOrders),
    'Storage Corruption',
    'Corrupted JSON in localStorage.ORDERS does NOT throw uncaught error; recovers gracefully',
    { ordersCount: fallbackOrders.length }
  );

  // Corrupt config storage with invalid JSON
  mockLocalStorage.setItem(STORAGE_KEYS.CONFIG, '{bad_config_syntax: [');
  let configThrew = false;
  let fallbackCfg: any = null;
  try {
    fallbackCfg = ordersService.getConfig();
  } catch {
    configThrew = true;
  }

  assert(
    configThrew === false && fallbackCfg !== null && fallbackCfg.exchangeRateBOB === 6.96,
    'Storage Corruption',
    'Corrupted JSON in localStorage.CONFIG does NOT throw uncaught error; falls back to DEFAULT_CONFIG'
  );

  // Simulate QuotaExceededError on localStorage.setItem
  mockLocalStorage.setItem = () => {
    const quotaErr = new Error('QuotaExceededError: storage is full');
    quotaErr.name = 'QuotaExceededError';
    throw quotaErr;
  };

  let createThrewOnQuota = false;
  let quotaCreatedOrder: Order | null = null;
  try {
    quotaCreatedOrder = await ordersService.createOrder({
      clientName: 'Quota Test Client',
      clientPhone: '59178889900',
      destinationCity: 'Oruro',
      deliveryMethod: 'pickup',
      modality: 'assisted',
      items: [{ storeName: 'Apple', category: 'Tech', productName: 'Cable', priceUSD: 19, quantity: 1 }]
    });
  } catch {
    createThrewOnQuota = true;
  }

  assert(
    createThrewOnQuota === false && quotaCreatedOrder !== null && quotaCreatedOrder.clientName === 'Quota Test Client',
    'Storage Quota Exceeded',
    'LocalStorage QuotaExceededError is caught gracefully; createOrder returns created order'
  );

  // Reset global mocks
  delete (global as any).window;
  delete (global as any).localStorage;
  delete (global as any).CustomEvent;

  // ================================================================
  // SUMMARY
  // ================================================================
  console.log('\n====================================================');
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  console.log(`TOTAL TESTS: ${total}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('FATAL HARNESS ERROR:', err);
  process.exit(1);
});
