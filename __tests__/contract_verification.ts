/**
 * Empirical Challenger Verification Harness: Milestone 1
 * Targets: src/types/order.ts & src/lib/orders-service.ts
 *
 * Runs comprehensive automated empirical tests covering:
 * - Interface contract adherence
 * - Mathematical precision & oracle validation
 * - Edge case & boundary inputs
 * - State machine lifecycle transitions
 * - CRUD operations and metrics aggregation
 */

import {
  calculateFinancials,
  OrdersService,
  ordersService,
  SEED_ORDERS,
  DEFAULT_CONFIG
} from '../src/lib/orders-service';
import type {
  Order,
  OrderItem,
  OrderStatus,
  CreateOrderInput,
  OrderFinancials
} from '../src/types/order';

interface TestResult {
  name: string;
  suite: string;
  status: 'PASS' | 'FAIL';
  details?: string;
  error?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, suite: string, details?: string) {
  if (condition) {
    results.push({ name, suite, status: 'PASS', details });
  } else {
    results.push({ name, suite, status: 'FAIL', details, error: 'Assertion failed' });
    console.error(`❌ [FAIL] [${suite}] ${name}: ${details || ''}`);
  }
}

function assertClose(actual: number, expected: number, tolerance: number, name: string, suite: string) {
  const diff = Math.abs(actual - expected);
  const pass = diff <= tolerance;
  assert(
    pass,
    name,
    suite,
    `Actual: ${actual}, Expected: ${expected}, Diff: ${diff}, Tol: ${tolerance}`
  );
}

// -------------------------------------------------------------
// SUITE 1: Interface Contract Conformance & Static Integrity
// -------------------------------------------------------------
async function runSuite1() {
  const suite = 'Suite 1: Interface Contracts';

  // Test 1.1: Verify SEED_ORDERS has 4 orders covering all 4 lifecycle states
  assert(SEED_ORDERS.length === 4, 'Seed orders count is exactly 4', suite, `Count: ${SEED_ORDERS.length}`);

  const statuses = SEED_ORDERS.map(o => o.status);
  assert(statuses.includes('pedido'), 'Seed orders contains status "pedido"', suite);
  assert(statuses.includes('pagado_fee'), 'Seed orders contains status "pagado_fee"', suite);
  assert(statuses.includes('recepcionado'), 'Seed orders contains status "recepcionado"', suite);
  assert(statuses.includes('entregado'), 'Seed orders contains status "entregado"', suite);

  // Test 1.2: Check all required fields in Order interface on SEED_ORDERS
  SEED_ORDERS.forEach((order, idx) => {
    const prefix = `Seed[${idx}] (${order.id})`;
    assert(typeof order.id === 'string' && order.id.length > 0, `${prefix} id is valid string`, suite);
    assert(typeof order.createdAt === 'string' && !isNaN(Date.parse(order.createdAt)), `${prefix} createdAt is valid ISO date`, suite);
    assert(typeof order.clientName === 'string' && order.clientName.length > 0, `${prefix} clientName is valid`, suite);
    assert(typeof order.clientPhone === 'string' && order.clientPhone.length > 0, `${prefix} clientPhone is valid`, suite);
    assert(typeof order.suiteCode === 'string' && order.suiteCode.length > 0, `${prefix} suiteCode is valid`, suite);
    assert(typeof order.destinationCity === 'string' && order.destinationCity.length > 0, `${prefix} destinationCity is valid`, suite);
    assert(order.deliveryMethod === 'pickup' || order.deliveryMethod === 'delivery', `${prefix} deliveryMethod is pickup|delivery`, suite);
    assert(order.modality === 'prealert' || order.modality === 'assisted', `${prefix} modality is prealert|assisted`, suite);
    assert(Array.isArray(order.items) && order.items.length > 0, `${prefix} items is non-empty array`, suite);
    assert(typeof order.specialInstructions === 'object', `${prefix} specialInstructions is object`, suite);
    assert(typeof order.specialInstructions.optimizeWeight === 'boolean', `${prefix} optimizeWeight is boolean`, suite);
    assert(typeof order.specialInstructions.photoInspection === 'boolean', `${prefix} photoInspection is boolean`, suite);
    assert(typeof order.specialInstructions.holidayPackaging === 'boolean', `${prefix} holidayPackaging is boolean`, suite);
    assert(typeof order.financials === 'object', `${prefix} financials is object`, suite);
    assert(typeof order.financials.totalProductUSD === 'number', `${prefix} financials.totalProductUSD is number`, suite);
    assert(typeof order.financials.commissionPercent === 'number', `${prefix} financials.commissionPercent is number`, suite);
    assert(typeof order.financials.commissionUSD === 'number', `${prefix} financials.commissionUSD is number`, suite);
    assert(typeof order.financials.baseFeeUSD === 'number', `${prefix} financials.baseFeeUSD is number`, suite);
    assert(typeof order.financials.totalFeeUSD === 'number', `${prefix} financials.totalFeeUSD is number`, suite);
    assert(typeof order.financials.exchangeRateBOB === 'number', `${prefix} financials.exchangeRateBOB is number`, suite);
    assert(typeof order.financials.totalFeeBOB === 'number', `${prefix} financials.totalFeeBOB is number`, suite);
    assert(Array.isArray(order.statusHistory) && order.statusHistory.length > 0, `${prefix} statusHistory is valid`, suite);
  });
}

// -------------------------------------------------------------
// SUITE 2: Mathematical Precision & Oracle Validation
// -------------------------------------------------------------
async function runSuite2() {
  const suite = 'Suite 2: Math & Calculation Oracles';

  // Oracle calculation function
  function oracleCalculate(
    items: Array<{ priceUSD: number; quantity: number }>,
    commissionRate = 8,
    baseFee = 20.00,
    rateBOB = 6.96
  ) {
    const rawTotalProduct = items.reduce((acc, i) => acc + (i.priceUSD * i.quantity), 0);
    const totalProductUSD = Math.round(rawTotalProduct * 100) / 100;
    const commissionUSD = Math.round((totalProductUSD * commissionRate / 100) * 100) / 100;
    const totalFeeUSD = Math.round((commissionUSD + baseFee) * 100) / 100;
    const totalFeeBOB = Math.round((totalFeeUSD * rateBOB) * 100) / 100;
    return { totalProductUSD, commissionPercent: commissionRate, commissionUSD, baseFeeUSD: baseFee, totalFeeUSD, exchangeRateBOB: rateBOB, totalFeeBOB };
  }

  // Test 2.1: Audit SEED_ORDERS financials against oracle
  SEED_ORDERS.forEach((order, idx) => {
    const oracle = oracleCalculate(
      order.items,
      order.financials.commissionPercent,
      order.financials.baseFeeUSD,
      order.financials.exchangeRateBOB
    );
    assertClose(order.financials.totalProductUSD, oracle.totalProductUSD, 0.001, `Seed[${idx}] totalProductUSD matches oracle`, suite);
    assertClose(order.financials.commissionUSD, oracle.commissionUSD, 0.001, `Seed[${idx}] commissionUSD matches oracle`, suite);
    assertClose(order.financials.baseFeeUSD, oracle.baseFeeUSD, 0.001, `Seed[${idx}] baseFeeUSD matches oracle`, suite);
    assertClose(order.financials.totalFeeUSD, oracle.totalFeeUSD, 0.001, `Seed[${idx}] totalFeeUSD matches oracle`, suite);
    assertClose(order.financials.totalFeeBOB, oracle.totalFeeBOB, 0.001, `Seed[${idx}] totalFeeBOB matches oracle`, suite);
  });

  // Test 2.2: Standard Order Calculation (8% commission + $20 base fee, 6.96 BOB)
  const itemsSingle = [{ priceUSD: 100.00, quantity: 1 }];
  const fin1 = calculateFinancials(itemsSingle);
  assert(fin1.totalProductUSD === 100.00, 'Single item $100 totalProductUSD = 100.00', suite);
  assert(fin1.commissionPercent === 8, 'Default commissionPercent = 8', suite);
  assert(fin1.commissionUSD === 8.00, 'Commission USD = 8.00 (8% of $100)', suite);
  assert(fin1.baseFeeUSD === 20.00, 'Base fee USD = 20.00', suite);
  assert(fin1.totalFeeUSD === 28.00, 'Total fee USD = 28.00 (8.00 + 20.00)', suite);
  assert(fin1.exchangeRateBOB === 6.96, 'Exchange rate BOB = 6.96', suite);
  assert(fin1.totalFeeBOB === 194.88, 'Total fee BOB = 194.88 (28.00 * 6.96)', suite);

  // Test 2.3: Multiple Items Consolidation with fractional prices
  const itemsMulti = [
    { priceUSD: 19.99, quantity: 3 }, // 59.97
    { priceUSD: 49.50, quantity: 2 }, // 99.00
    { priceUSD: 150.00, quantity: 1 }  // 150.00
  ];
  // Total = 308.97
  // Commission 8% = 308.97 * 0.08 = 24.7176 -> 24.72
  // Total fee USD = 24.72 + 20.00 = 44.72
  // Total fee BOB = 44.72 * 6.96 = 311.2512 -> 311.25
  const finMulti = calculateFinancials(itemsMulti);
  assertClose(finMulti.totalProductUSD, 308.97, 0.001, 'Multi-item total product USD = 308.97', suite);
  assertClose(finMulti.commissionUSD, 24.72, 0.001, 'Multi-item commission USD = 24.72', suite);
  assertClose(finMulti.totalFeeUSD, 44.72, 0.001, 'Multi-item total fee USD = 44.72', suite);
  assertClose(finMulti.totalFeeBOB, 311.25, 0.001, 'Multi-item total fee BOB = 311.25', suite);

  // Test 2.4: Floating-Point Penny Rounding (IEEE 754 precision challenges)
  // 0.10 + 0.20 + 0.70 = 1.00
  const finFloat = calculateFinancials([
    { priceUSD: 0.10, quantity: 1 },
    { priceUSD: 0.20, quantity: 1 },
    { priceUSD: 0.70, quantity: 1 }
  ]);
  assert(finFloat.totalProductUSD === 1.00, '0.10 + 0.20 + 0.70 resolves cleanly to 1.00', suite);
  assert(finFloat.commissionUSD === 0.08, 'Commission on $1.00 is exactly $0.08', suite);
  assert(finFloat.totalFeeUSD === 20.08, 'Total fee USD is 20.08', suite);
  assert(finFloat.totalFeeBOB === 139.76, 'Total fee BOB is 139.76 (20.08 * 6.96 = 139.7568 -> 139.76)', suite);

  // Test 2.5: High Volume Order ($1,000,000.00 stress test)
  const finHigh = calculateFinancials([{ priceUSD: 1000000.00, quantity: 1 }]);
  assert(finHigh.totalProductUSD === 1000000.00, 'High value total product = $1,000,000', suite);
  assert(finHigh.commissionUSD === 80000.00, 'Commission 8% = $80,000.00', suite);
  assert(finHigh.totalFeeUSD === 80020.00, 'Total fee USD = $80,020.00', suite);
  assert(finHigh.totalFeeBOB === 556939.20, 'Total fee BOB = 556,939.20', suite);
}

// -------------------------------------------------------------
// SUITE 3: Boundary & Edge Case Stress Testing
// -------------------------------------------------------------
async function runSuite3() {
  const suite = 'Suite 3: Boundaries & Edge Cases';

  // Test 3.1: Zero items array
  const finEmpty = calculateFinancials([]);
  assert(finEmpty.totalProductUSD === 0, 'Empty items -> totalProductUSD = 0', suite);
  assert(finEmpty.commissionUSD === 0, 'Empty items -> commissionUSD = 0', suite);
  assert(finEmpty.baseFeeUSD === 20.00, 'Empty items -> baseFeeUSD preserved ($20)', suite);
  assert(finEmpty.totalFeeUSD === 20.00, 'Empty items -> totalFeeUSD = $20', suite);
  assert(finEmpty.totalFeeBOB === 139.20, 'Empty items -> totalFeeBOB = 139.20 (20 * 6.96)', suite);

  // Test 3.2: Item with price 0 (e.g. Free gift / promotional sample)
  const finZeroPrice = calculateFinancials([{ priceUSD: 0, quantity: 5 }]);
  assert(finZeroPrice.totalProductUSD === 0, 'Zero price items -> totalProductUSD = 0', suite);
  assert(finZeroPrice.commissionUSD === 0, 'Zero price items -> commissionUSD = 0', suite);
  assert(finZeroPrice.totalFeeUSD === 20.00, 'Zero price items -> totalFeeUSD = 20.00', suite);

  // Test 3.3: Custom Commission Rate Overrides
  // Custom 0% commission (promotion)
  const fin0Comm = calculateFinancials([{ priceUSD: 500, quantity: 1 }], 0);
  assert(fin0Comm.commissionPercent === 0, 'Custom commission 0% preserved', suite);
  assert(fin0Comm.commissionUSD === 0, 'Custom commission 0% yields $0 commission', suite);
  assert(fin0Comm.totalFeeUSD === 20.00, 'Custom commission 0% total fee is only base fee ($20)', suite);

  // Custom $0 base fee (promotional waiver)
  const fin0Base = calculateFinancials([{ priceUSD: 500, quantity: 1 }], 8, 0);
  assert(fin0Base.baseFeeUSD === 0, 'Custom base fee 0 preserved', suite);
  assert(fin0Base.commissionUSD === 40.00, 'Commission 8% of 500 = 40.00', suite);
  assert(fin0Base.totalFeeUSD === 40.00, 'Total fee with $0 base fee = $40.00', suite);

  // Custom Exchange Rate (e.g. 7.00 BOB)
  const finCustomRate = calculateFinancials([{ priceUSD: 100, quantity: 1 }], 8, 20, 7.00);
  assert(finCustomRate.exchangeRateBOB === 7.00, 'Custom exchange rate 7.00 BOB applied', suite);
  assert(finCustomRate.totalFeeBOB === 196.00, 'Total BOB = 28 * 7.00 = 196.00', suite);

  // Test 3.4: createOrder Phone Normalization
  const service = new OrdersService();
  const orderWith8DigitPhone = await service.createOrder({
    clientName: 'Test Phone Normalization',
    clientPhone: '77012345', // 8 digits, missing 591
    destinationCity: 'Santa Cruz',
    deliveryMethod: 'pickup',
    modality: 'assisted',
    items: [{ storeName: 'Amazon', category: 'Tech', productName: 'Kindle', priceUSD: 99.99, quantity: 1 }]
  });
  assert(orderWith8DigitPhone.clientPhone === '59177012345', '8-digit phone auto-prefixed with 591', suite, orderWith8DigitPhone.clientPhone);

  const orderWithFormattedPhone = await service.createOrder({
    clientName: 'Test Formatted Phone',
    clientPhone: '+591 (770) 12-345',
    destinationCity: 'La Paz',
    deliveryMethod: 'delivery',
    deliveryAddress: 'Calle Murillo #100',
    modality: 'prealert',
    items: [{ storeName: 'Nike', category: 'Shoes', productName: 'Pegasus', priceUSD: 130, quantity: 1 }]
  });
  assert(orderWithFormattedPhone.clientPhone === '59177012345', 'Formatted phone stripped to clean 591 digits', suite, orderWithFormattedPhone.clientPhone);

  // Test 3.5: Default values applied during createOrder
  const orderDefaults = await service.createOrder({
    clientName: 'Default Tester',
    clientPhone: '59171234567',
    destinationCity: 'Cochabamba',
    deliveryMethod: 'pickup',
    modality: 'assisted',
    items: [{ storeName: 'Target', category: 'Toys', productName: 'Lego', priceUSD: 50, quantity: 1 }]
  });
  assert(orderDefaults.suiteCode === 'SOLICITADA', 'Missing suiteCode defaults to SOLICITADA', suite);
  assert(orderDefaults.specialInstructions.optimizeWeight === true, 'Default optimizeWeight is true', suite);
  assert(orderDefaults.specialInstructions.photoInspection === true, 'Default photoInspection is true', suite);
  assert(orderDefaults.specialInstructions.holidayPackaging === false, 'Default holidayPackaging is false', suite);
  assert(orderDefaults.status === 'pedido', 'Initial status is pedido', suite);
  assert(orderDefaults.financials.feePaymentStatus === 'pending', 'Initial feePaymentStatus is pending', suite);
  assert(orderDefaults.financials.totalFeeUSD === 24.00, '50 * 0.08 + 20 = $24.00', suite);
  assert(orderDefaults.financials.totalFeeBOB === 167.04, '24.00 * 6.96 = 167.04', suite);
}

// -------------------------------------------------------------
// SUITE 4: State Machine, Lifecycle & Service Methods
// -------------------------------------------------------------
async function runSuite4() {
  const suite = 'Suite 4: Lifecycle & Service Methods';
  const service = new OrdersService();

  // Test 4.1: Order ID generation format NY-YYYY-XXXX
  const newOrder = await service.createOrder({
    clientName: 'Lifecycle Test Client',
    clientPhone: '59170001122',
    destinationCity: 'Santa Cruz',
    deliveryMethod: 'delivery',
    deliveryAddress: 'Av. Las Américas 450',
    modality: 'assisted',
    items: [{ storeName: 'B&H Photo', category: 'Camera', productName: 'Sony Alpha 7 IV', priceUSD: 2498.00, quantity: 1 }]
  });

  const year = new Date().getFullYear();
  const idRegex = new RegExp(`^NY-${year}-\\d{4}$`);
  assert(idRegex.test(newOrder.id), `Order ID (${newOrder.id}) matches NY-YYYY-XXXX format`, suite);

  // Test 4.2: getOrderById retrieval
  const fetched = await service.getOrderById(newOrder.id);
  assert(fetched !== null && fetched.id === newOrder.id, 'getOrderById returns created order', suite);

  // Test 4.3: Non-existent order returns null
  const nonExistent = await service.getOrderById('NY-9999-0000');
  assert(nonExistent === null, 'Non-existent order ID returns null', suite);

  // Test 4.4: Status progression: pedido -> pagado_fee
  const updatedStatus1 = await service.updateOrderStatus(newOrder.id, 'pagado_fee', 'Fee confirmado vía QR');
  assert(updatedStatus1?.status === 'pagado_fee', 'Order transitioned to pagado_fee', suite);
  assert(updatedStatus1?.financials.feePaymentStatus === 'paid', 'Status pagado_fee automatically set feePaymentStatus to paid', suite);
  assert(typeof updatedStatus1?.financials.feePaidAt === 'string', 'feePaidAt timestamp is recorded', suite);
  assert(updatedStatus1?.statusHistory.length === 2, 'statusHistory has 2 entries', suite);

  // Test 4.5: Status progression: pagado_fee -> recepcionado
  const updatedStatus2 = await service.updateOrderStatus(newOrder.id, 'recepcionado', 'Recibido en almacén JFK', {
    warehouseDetails: { weightLbs: 4.5, photoEvidenceUrl: 'https://example.com/photo.jpg', receivedAt: null, packagesCount: 1 }
  });
  assert(updatedStatus2?.status === 'recepcionado', 'Order transitioned to recepcionado', suite);
  assert(typeof updatedStatus2?.warehouseDetails.receivedAt === 'string', 'warehouseDetails.receivedAt auto-populated', suite);
  assert(updatedStatus2?.warehouseDetails.weightLbs === 4.5, 'warehouseDetails.weightLbs updated', suite);
  assert(updatedStatus2?.statusHistory.length === 3, 'statusHistory has 3 entries', suite);

  // Test 4.6: Status progression: recepcionado -> entregado
  const updatedStatus3 = await service.updateOrderStatus(newOrder.id, 'entregado', 'Entregado a cliente', {
    deliveryDetails: { deliveredAt: null, receivedBy: 'Lifecycle Test Client', deliveryNote: 'Recibido conforme' }
  });
  assert(updatedStatus3?.status === 'entregado', 'Order transitioned to entregado', suite);
  assert(typeof updatedStatus3?.deliveryDetails.deliveredAt === 'string', 'deliveryDetails.deliveredAt auto-populated', suite);
  assert(updatedStatus3?.deliveryDetails.receivedBy === 'Lifecycle Test Client', 'deliveryDetails.receivedBy recorded', suite);
  assert(updatedStatus3?.statusHistory.length === 4, 'statusHistory has 4 entries', suite);

  // Test 4.7: updateOrderFeePayment auto-transition from pedido to pagado_fee
  const feeOrder = await service.createOrder({
    clientName: 'Fee Auto Advance Client',
    clientPhone: '59172233445',
    destinationCity: 'Sucre',
    deliveryMethod: 'pickup',
    modality: 'assisted',
    items: [{ storeName: 'Macy\'s', category: 'Clothing', productName: 'Winter Coat', priceUSD: 200, quantity: 1 }]
  });
  assert(feeOrder.status === 'pedido', 'New order starts as pedido', suite);
  const paidOrder = await service.updateOrderFeePayment(feeOrder.id, 'paid', 'QR Simple Bancario');
  assert(paidOrder?.financials.feePaymentStatus === 'paid', 'Fee payment status is paid', suite);
  assert(paidOrder?.status === 'pagado_fee', 'Order auto-advanced to pagado_fee', suite);

  // Test 4.8: Metrics Aggregation
  const metrics = await service.getMetrics();
  assert(typeof metrics.totalOrders === 'number' && metrics.totalOrders > 0, 'metrics.totalOrders > 0', suite);
  assert(metrics.countPedido + metrics.countPagadoFee + metrics.countRecepcionado + metrics.countEntregado === metrics.totalOrders, 'Status counts sum to totalOrders', suite);
  assert(metrics.totalFeesCollectedUSD >= 0, 'totalFeesCollectedUSD >= 0', suite);
  assert(metrics.totalFeesPendingUSD >= 0, 'totalFeesPendingUSD >= 0', suite);

  // Test 4.9: WhatsApp Share URL generation
  const waUrl = service.getWhatsAppShareUrl(newOrder);
  assert(waUrl.startsWith('https://wa.me/59170001122'), 'WhatsApp URL starts with client phone', suite);
  assert(waUrl.includes(encodeURIComponent(newOrder.id)), 'WhatsApp URL includes order ID', suite);

  // Test 4.10: Status Badge configuration
  const badgePedido = service.getStatusBadge('pedido');
  assert(badgePedido.stepNumber === 1 && badgePedido.label === 'Pedido Registrado', 'Badge pedido has step 1', suite);
  const badgeEntregado = service.getStatusBadge('entregado');
  assert(badgeEntregado.stepNumber === 4 && badgeEntregado.label === 'Entregado Bolivia', 'Badge entregado has step 4', suite);

  // Test 4.11: Delete Order
  const deleteResult = await service.deleteOrder(feeOrder.id);
  assert(deleteResult === true, 'deleteOrder returns true', suite);
  const deletedFetch = await service.getOrderById(feeOrder.id);
  assert(deletedFetch === null, 'Deleted order is no longer retrievable', suite);

  // Test 4.12: Reset to default restores SEED_ORDERS
  await service.resetToDefault();
  const resetOrders = await service.getOrders();
  assert(resetOrders.length === 4, 'resetToDefault restores 4 seed orders', suite);
}

// -------------------------------------------------------------
// MAIN RUNNER
// -------------------------------------------------------------
async function runAll() {
  console.log('====================================================');
  console.log('🚀 RUNNING M1 CONTRACT & DATA MODEL EMPIRICAL SUITE');
  console.log('====================================================\n');

  try {
    await runSuite1();
    await runSuite2();
    await runSuite3();
    await runSuite4();
  } catch (err) {
    console.error('💥 Fatal error running test suite:', err);
  }

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const total = results.length;

  console.log('\n====================================================');
  console.log(`📊 TEST EXECUTION SUMMARY: ${passed}/${total} PASSED (${failed} FAILED)`);
  console.log('====================================================');

  if (failed > 0) {
    console.log('\n❌ FAILED TESTS:');
    results.filter(r => r.status === 'FAIL').forEach(f => {
      console.log(`  - [${f.suite}] ${f.name}: ${f.details || ''} (${f.error || ''})`);
    });
    process.exit(1);
  } else {
    console.log('\n✅ ALL EMPIRICAL CONTRACT & CALCULATION TESTS PASSED!');
    process.exit(0);
  }
}

runAll();
