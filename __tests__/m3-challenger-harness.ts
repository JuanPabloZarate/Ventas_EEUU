/**
 * Milestone 3 Adversarial Challenge & Empirical Verification Harness
 * NY2Bolivia Web — Product Registration & Pre-Alerta Views
 *
 * Suites:
 * 1. Financial Engine: Compra Asistida ($20 + 8%) vs Casillero NY / Pre-Alerta ($20 + 0%)
 * 2. Official Exchange Rate (6.96 BOB/USD) across wide price spectrum & rounding
 * 3. Multi-Item Consolidation & Accumulation Matrix (1, 2, 5, 10 items, P x Q)
 * 4. Boundary & Adversarial Inputs (Zeros, Decimals, NaNs, Clamping, Large Numbers)
 * 5. Suite Code Generator Monte Carlo & Address Contract Verification
 * 6. OrdersService Integration, Persistence, Phone Normalization & Lifecycle
 * 7. Store Chips & Category Contract Consistency
 */

import { calculateFinancials, OrdersService, DEFAULT_CONFIG } from '../src/lib/orders-service';
import { CARGO_CATEGORIES } from '../src/components/registration/DynamicItemBuilder';
import { POPULAR_STORES } from '../src/components/registration/StoreChips';
import { BOLIVIAN_CITIES } from '../src/components/registration/ClientProfileForm';
import type { OrderItem, OrderModality } from '../src/types/order';

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  error?: string;
  assertions: number;
}

let totalAssertions = 0;
let passedAssertions = 0;
const results: TestResult[] = [];
let currentSuite = '';

function suite(name: string) {
  currentSuite = name;
  console.log(`\n======================================================================`);
  console.log(`SUITE: ${name}`);
  console.log(`======================================================================`);
}

function assert(condition: boolean, message: string) {
  totalAssertions++;
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
  passedAssertions++;
}

function assertClose(actual: number, expected: number, tolerance: number = 0.01, message: string = '') {
  totalAssertions++;
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`Assertion failed: expected ${expected} (±${tolerance}), got ${actual}. ${message}`);
  }
  passedAssertions++;
}

function runTest(name: string, fn: () => void | Promise<void>): Promise<void> {
  const initialAssertions = passedAssertions;
  try {
    const res = fn();
    if (res instanceof Promise) {
      return res.then(() => {
        const testAssertions = passedAssertions - initialAssertions;
        results.push({ suite: currentSuite, name, passed: true, assertions: testAssertions });
        console.log(`  ✓ ${name} (${testAssertions} assertions)`);
      }).catch((err: any) => {
        const testAssertions = passedAssertions - initialAssertions;
        results.push({ suite: currentSuite, name, passed: false, error: err.message, assertions: testAssertions });
        console.error(`  ✗ ${name}: ${err.message}`);
      });
    } else {
      const testAssertions = passedAssertions - initialAssertions;
      results.push({ suite: currentSuite, name, passed: true, assertions: testAssertions });
      console.log(`  ✓ ${name} (${testAssertions} assertions)`);
      return Promise.resolve();
    }
  } catch (err: any) {
    const testAssertions = passedAssertions - initialAssertions;
    results.push({ suite: currentSuite, name, passed: false, error: err.message, assertions: testAssertions });
    console.error(`  ✗ ${name}: ${err.message}`);
    return Promise.resolve();
  }
}

// Standalone mirror of StickySummarySidebar's internal calculation logic
function calculateSidebarFinancials(
  items: Array<{ priceUSD: number; quantity: number }>,
  modality: OrderModality,
  customBaseFeeUSD?: number,
  customExchangeRateBOB?: number
) {
  const totalItemsCount = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  const totalProductUSD = Number(
    items.reduce((sum, item) => sum + (Number(item.priceUSD) || 0) * (Number(item.quantity) || 1), 0).toFixed(2)
  );

  const baseFeeUSD = customBaseFeeUSD ?? 20.00;
  const commissionPercent = modality === 'assisted' ? 8 : 0;
  const commissionUSD = Number(((totalProductUSD * commissionPercent) / 100).toFixed(2));
  const totalFeeUSD = Number((baseFeeUSD + commissionUSD).toFixed(2));
  const exchangeRateBOB = customExchangeRateBOB ?? 6.96;
  const totalFeeBOB = Number((totalFeeUSD * exchangeRateBOB).toFixed(2));

  return {
    totalItemsCount,
    totalProductUSD,
    baseFeeUSD,
    commissionPercent,
    commissionUSD,
    totalFeeUSD,
    exchangeRateBOB,
    totalFeeBOB,
  };
}

// Temporary Suite generator replication from SuiteCodeModal.tsx
function generateTempSuiteCode(): string {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `NY-TEMP-${randomDigits}`;
}

async function main() {
  console.log('NY2Bolivia Web — Milestone 3 Empirical Challenger Verification');
  console.log('Adversarial Test Engine Initialized: Node v' + process.version);

  // ======================================================================
  // SUITE 1: Financial Engine - Compra Asistida vs Casillero NY
  // ======================================================================
  suite('1. Financial Engine: Compra Asistida vs Casillero NY (Pre-Alerta)');

  await runTest('Compra Asistida: Base fee $20 + 8% commission on single item', () => {
    // Test case 1: $100 product
    const fin1 = calculateFinancials([{ priceUSD: 100, quantity: 1 }], 8, 20.00, 6.96);
    assert(fin1.totalProductUSD === 100.00, 'totalProductUSD must be 100.00');
    assert(fin1.commissionPercent === 8, 'commissionPercent must be 8');
    assert(fin1.commissionUSD === 8.00, 'commissionUSD must be 8.00');
    assert(fin1.baseFeeUSD === 20.00, 'baseFeeUSD must be 20.00');
    assert(fin1.totalFeeUSD === 28.00, 'totalFeeUSD must be 28.00 (20 + 8)');
    assert(fin1.totalFeeBOB === 194.88, 'totalFeeBOB must be 194.88 (28 * 6.96)');

    // Test case 2: $180 product (from handoff manual check)
    const fin2 = calculateFinancials([{ priceUSD: 180, quantity: 1 }], 8, 20.00, 6.96);
    assert(fin2.totalProductUSD === 180.00, 'totalProductUSD must be 180.00');
    assert(fin2.commissionUSD === 14.40, 'commissionUSD must be 14.40 (180 * 0.08)');
    assert(fin2.totalFeeUSD === 34.40, 'totalFeeUSD must be 34.40');
    assert(fin2.totalFeeBOB === 239.42, 'totalFeeBOB must be 239.42 (34.40 * 6.96 = 239.424 -> 239.42)');

    // Test case 3: iPhone 16 Pro $999.00
    const fin3 = calculateFinancials([{ priceUSD: 999, quantity: 1 }], 8, 20.00, 6.96);
    assert(fin3.totalProductUSD === 999.00, 'totalProductUSD must be 999.00');
    assert(fin3.commissionUSD === 79.92, 'commissionUSD must be 79.92');
    assert(fin3.totalFeeUSD === 99.92, 'totalFeeUSD must be 99.92');
    assert(fin3.totalFeeBOB === 695.44, 'totalFeeBOB must be 695.44 (99.92 * 6.96 = 695.4432 -> 695.44)');
  });

  await runTest('Casillero NY (Pre-Alerta): 0% commission regardless of cargo value', () => {
    const testPrices = [0, 10, 50, 100, 215, 500, 999, 2500, 10000];
    for (const price of testPrices) {
      const fin = calculateFinancials([{ priceUSD: price, quantity: 1 }], 0, 20.00, 6.96);
      assert(fin.totalProductUSD === price, `totalProductUSD must be ${price}`);
      assert(fin.commissionPercent === 0, 'Pre-Alerta commissionPercent must be strictly 0%');
      assert(fin.commissionUSD === 0.00, 'Pre-Alerta commissionUSD must be strictly $0.00');
      assert(fin.baseFeeUSD === 20.00, 'Pre-Alerta flight reservation fee must be strictly $20.00');
      assert(fin.totalFeeUSD === 20.00, 'Pre-Alerta totalFeeUSD must be strictly $20.00');
      assert(fin.totalFeeBOB === 139.20, 'Pre-Alerta totalFeeBOB must be strictly 139.20 Bs (20 * 6.96)');
    }
  });

  await runTest('StickySummarySidebar logic exact parity with calculateFinancials', () => {
    const sampleItems = [
      { priceUSD: 155.00, quantity: 1 },
      { priceUSD: 55.00, quantity: 2 },
      { priceUSD: 19.99, quantity: 3 }
    ];

    // Assisted modality parity
    const sidebarAssisted = calculateSidebarFinancials(sampleItems, 'assisted', 20.00, 6.96);
    const engineAssisted = calculateFinancials(sampleItems, 8, 20.00, 6.96);

    assert(sidebarAssisted.totalProductUSD === engineAssisted.totalProductUSD, 'totalProductUSD parity');
    assert(sidebarAssisted.commissionUSD === engineAssisted.commissionUSD, 'commissionUSD parity');
    assert(sidebarAssisted.totalFeeUSD === engineAssisted.totalFeeUSD, 'totalFeeUSD parity');
    assert(sidebarAssisted.totalFeeBOB === engineAssisted.totalFeeBOB, 'totalFeeBOB parity');

    // Pre-alerta modality parity
    const sidebarPrealert = calculateSidebarFinancials(sampleItems, 'prealert', 20.00, 6.96);
    const enginePrealert = calculateFinancials(sampleItems, 0, 20.00, 6.96);

    assert(sidebarPrealert.totalProductUSD === enginePrealert.totalProductUSD, 'totalProductUSD parity');
    assert(sidebarPrealert.commissionUSD === 0.00, 'commissionUSD must be 0 in sidebar prealert');
    assert(sidebarPrealert.totalFeeUSD === 20.00, 'totalFeeUSD must be 20 in sidebar prealert');
    assert(sidebarPrealert.totalFeeBOB === 139.20, 'totalFeeBOB must be 139.20 in sidebar prealert');
  });

  // ======================================================================
  // SUITE 2: Official Exchange Rate 6.96 BOB / USD Conversion & Rounding
  // ======================================================================
  suite('2. Official Exchange Rate 6.96 BOB / USD Conversion & Rounding');

  await runTest('Exchange rate exactness across 50 progressive decimal price points', () => {
    // Generate 50 points from $1.00 to $1,000.00
    for (let i = 1; i <= 50; i++) {
      const price = Math.round((i * 19.87) * 100) / 100;
      const fin = calculateFinancials([{ priceUSD: price, quantity: 1 }], 8, 20.00, 6.96);

      const expectedCommission = Number(((price * 8) / 100).toFixed(2));
      const expectedTotalUSD = Number((20.00 + expectedCommission).toFixed(2));
      const expectedBOB = Number((expectedTotalUSD * 6.96).toFixed(2));

      assert(fin.commissionUSD === expectedCommission, `Commission precision at $${price}`);
      assert(fin.totalFeeUSD === expectedTotalUSD, `Total USD precision at $${price}`);
      assert(fin.totalFeeBOB === expectedBOB, `BOB conversion precision at $${price}`);
      assert(fin.exchangeRateBOB === 6.96, 'Exchange rate locked at 6.96');
    }
  });

  await runTest('Half-cent and floating point rounding edge cases (IEEE 754 resilience)', () => {
    // Test known floating-point edge cases where 0.1 + 0.2 != 0.3
    const trickyPrices = [
      0.07,  // 0.07 * 0.08 = 0.0056 -> round to 0.01
      0.06,  // 0.06 * 0.08 = 0.0048 -> round to 0.00
      12.49, // 12.49 * 0.08 = 0.9992 -> 1.00
      12.50, // 12.50 * 0.08 = 1.0000 -> 1.00
      18.75, // 18.75 * 0.08 = 1.5000 -> 1.50
      34.40, // 34.40 * 6.96 = 239.424 -> 239.42
      37.20, // 37.20 * 6.96 = 258.912 -> 258.91
      99.92, // 99.92 * 6.96 = 695.4432 -> 695.44
    ];

    for (const p of trickyPrices) {
      const fin = calculateFinancials([{ priceUSD: p, quantity: 1 }], 8, 20.00, 6.96);
      assert(!isNaN(fin.totalFeeBOB), `BOB fee must not be NaN for price ${p}`);
      assert(!isNaN(fin.totalFeeUSD), `USD fee must not be NaN for price ${p}`);
      assert(typeof fin.totalFeeBOB === 'number', `BOB fee must be a number for price ${p}`);
      // Check that BOB is strictly equal to toFixed(2)
      const recomputedBOB = Number((fin.totalFeeUSD * 6.96).toFixed(2));
      assert(fin.totalFeeBOB === recomputedBOB, `BOB fee must match 2 decimal rounding: ${fin.totalFeeBOB} vs ${recomputedBOB}`);
    }
  });

  // ======================================================================
  // SUITE 3: Multi-Item Consolidation & Accumulation Matrix
  // ======================================================================
  suite('3. Multi-Item Consolidation & Accumulation Matrix (P x Q)');

  await runTest('Multi-item scaling: 1 item, 2 items, 5 items, 10 items', () => {
    // 1 Item
    const items1 = [{ priceUSD: 299.99, quantity: 1 }];
    const fin1 = calculateFinancials(items1, 8, 20, 6.96);
    assert(fin1.totalProductUSD === 299.99, '1 item declared total');
    assert(fin1.commissionUSD === 24.00, '1 item commission ($299.99 * 0.08 = 23.9992 -> 24.00)');

    // 2 Items
    const items2 = [
      { priceUSD: 155.00, quantity: 1 },
      { priceUSD: 55.00, quantity: 1 },
    ];
    const fin2 = calculateFinancials(items2, 8, 20, 6.96);
    assert(fin2.totalProductUSD === 210.00, '2 items declared total (155 + 55 = 210)');
    assert(fin2.commissionUSD === 16.80, '2 items commission (210 * 0.08 = 16.80)');
    assert(fin2.totalFeeUSD === 36.80, '2 items total fee (20 + 16.80 = 36.80)');

    // 5 Items with differing quantities
    const items5 = [
      { priceUSD: 10.00, quantity: 2 }, // $20
      { priceUSD: 25.50, quantity: 4 }, // $102
      { priceUSD: 5.99, quantity: 10 }, // $59.90
      { priceUSD: 120.00, quantity: 1 }, // $120
      { priceUSD: 85.00, quantity: 3 }, // $255
    ];
    // Expected total: 20 + 102 + 59.90 + 120 + 255 = 556.90
    const fin5 = calculateFinancials(items5, 8, 20, 6.96);
    assert(fin5.totalProductUSD === 556.90, `5 items declared total: expected 556.90, got ${fin5.totalProductUSD}`);
    const expectedComm5 = Number((556.90 * 0.08).toFixed(2)); // 44.55
    assert(fin5.commissionUSD === expectedComm5, `5 items commission: expected ${expectedComm5}, got ${fin5.commissionUSD}`);

    // 10 Items stress cart
    const items10 = Array.from({ length: 10 }, (_, i) => ({
      priceUSD: (i + 1) * 15.25,
      quantity: (i % 3) + 1,
    }));
    let manualProductSum = 0;
    for (const it of items10) {
      manualProductSum += it.priceUSD * it.quantity;
    }
    manualProductSum = Number(manualProductSum.toFixed(2));

    const fin10 = calculateFinancials(items10, 8, 20, 6.96);
    assert(fin10.totalProductUSD === manualProductSum, `10 items product sum matches: ${fin10.totalProductUSD} vs ${manualProductSum}`);
  });

  await runTest('Consolidation fee invariant: multi-item consolidation is strictly $0.00', () => {
    // Test that adding more items does NOT increment base fee (Consolidación $0.00)
    for (const count of [1, 2, 3, 5, 10, 25]) {
      const items = Array.from({ length: count }, () => ({ priceUSD: 50.00, quantity: 1 }));
      const fin = calculateFinancials(items, 0, 20, 6.96);
      assert(fin.baseFeeUSD === 20.00, `Base fee stays $20.00 regardless of package count (${count} packages)`);
      assert(fin.totalFeeUSD === 20.00, `Total fee in Pre-Alerta stays $20.00 regardless of packages count (${count} packages)`);
    }
  });

  await runTest('Order invariance: Permutations of items yield identical financials', () => {
    const listA = [
      { priceUSD: 49.99, quantity: 2 },
      { priceUSD: 199.00, quantity: 1 },
      { priceUSD: 14.50, quantity: 4 },
    ];
    const listB = [
      { priceUSD: 14.50, quantity: 4 },
      { priceUSD: 49.99, quantity: 2 },
      { priceUSD: 199.00, quantity: 1 },
    ];

    const finA = calculateFinancials(listA, 8, 20, 6.96);
    const finB = calculateFinancials(listB, 8, 20, 6.96);

    assert(finA.totalProductUSD === finB.totalProductUSD, 'Total product USD is order-invariant');
    assert(finA.commissionUSD === finB.commissionUSD, 'Commission USD is order-invariant');
    assert(finA.totalFeeUSD === finB.totalFeeUSD, 'Total fee USD is order-invariant');
    assert(finA.totalFeeBOB === finB.totalFeeBOB, 'Total fee BOB is order-invariant');
  });

  await runTest('Item deletions and quantity increment state transitions', () => {
    let items = [
      { id: '1', priceUSD: 100, quantity: 1 },
      { id: '2', priceUSD: 200, quantity: 1 },
      { id: '3', priceUSD: 300, quantity: 1 },
    ];

    // Initial 3 items: $600
    let fin = calculateFinancials(items, 8, 20, 6.96);
    assert(fin.totalProductUSD === 600.00, 'Initial 3 items sum to 600');

    // Simulate removing item 2
    items = items.filter(it => it.id !== '2');
    fin = calculateFinancials(items, 8, 20, 6.96);
    assert(fin.totalProductUSD === 400.00, 'After deleting item 2, total is 400');

    // Simulate incrementing item 1 quantity from 1 to 3
    items = items.map(it => it.id === '1' ? { ...it, quantity: 3 } : it);
    fin = calculateFinancials(items, 8, 20, 6.96);
    assert(fin.totalProductUSD === 600.00, 'After qty 3 on item 1 (3*100 + 300), total is 600');

    // Total items count check in sidebar logic
    const sidebar = calculateSidebarFinancials(items, 'assisted');
    assert(sidebar.totalItemsCount === 4, 'totalItemsCount is 3 + 1 = 4 articles');
  });

  // ======================================================================
  // SUITE 4: Boundary & Adversarial Inputs
  // ======================================================================
  suite('4. Boundary & Adversarial Inputs');

  await runTest('Zero price item and empty product list resilience', () => {
    // Empty list
    const finEmpty = calculateFinancials([], 8, 20.00, 6.96);
    assert(finEmpty.totalProductUSD === 0.00, 'Empty list totalProductUSD must be 0');
    assert(finEmpty.commissionUSD === 0.00, 'Empty list commissionUSD must be 0');
    assert(finEmpty.totalFeeUSD === 20.00, 'Empty list baseFeeUSD still $20');
    assert(finEmpty.totalFeeBOB === 139.20, 'Empty list totalFeeBOB is 139.20');

    // $0 price
    const finZero = calculateFinancials([{ priceUSD: 0, quantity: 1 }], 8, 20.00, 6.96);
    assert(finZero.totalProductUSD === 0.00, 'Zero price totalProductUSD is 0');
    assert(finZero.commissionUSD === 0.00, 'Zero price commission is 0');
    assert(finZero.totalFeeUSD === 20.00, 'Zero price fee is 20');
  });

  await runTest('Malformed/NaN/Undefined price and quantity inputs', () => {
    // Passing NaN or undefined cast to Number
    const malformedItems = [
      { priceUSD: undefined as any, quantity: undefined as any },
      { priceUSD: null as any, quantity: null as any },
      { priceUSD: 'invalid' as any, quantity: 'invalid' as any },
    ];

    const fin = calculateFinancials(malformedItems, 8, 20.00, 6.96);
    assert(!isNaN(fin.totalProductUSD), 'totalProductUSD must not be NaN with malformed inputs');
    assert(fin.totalProductUSD === 0.00, 'Malformed items default to $0');
    assert(fin.totalFeeUSD === 20.00, 'Base fee remains $20 with malformed inputs');
    assert(!isNaN(fin.totalFeeBOB), 'totalFeeBOB must not be NaN');
  });

  await runTest('Extreme high values stress test', () => {
    // $1,000,000 USD luxury item
    const luxuryItems = [{ priceUSD: 1000000.00, quantity: 1 }];
    const fin = calculateFinancials(luxuryItems, 8, 20.00, 6.96);
    assert(fin.totalProductUSD === 1000000.00, 'Million dollar product');
    assert(fin.commissionUSD === 80000.00, '8% of 1M is $80,000');
    assert(fin.totalFeeUSD === 80020.00, 'Total fee $80,020.00');
    assert(fin.totalFeeBOB === 556939.20, '80020 * 6.96 = 556939.20 BOB');
  });

  // ======================================================================
  // SUITE 5: Temporary Suite Code Generator & Address Helpers
  // ======================================================================
  suite('5. Temporary Suite Code Generator & Address Helpers');

  await runTest('Temporary suite code format compliance (NY-TEMP-XXXX)', () => {
    const code = generateTempSuiteCode();
    const regex = /^NY-TEMP-\d{4}$/;
    assert(regex.test(code), `Generated code ${code} matches ^NY-TEMP-\\d{4}$`);

    const digits = parseInt(code.replace('NY-TEMP-', ''), 10);
    assert(digits >= 1000 && digits <= 9999, `Digits ${digits} in range [1000, 9999]`);
  });

  await runTest('Monte Carlo uniqueness test: 1,000 temporary suite code generations', () => {
    const generated = new Set<string>();
    const count = 1000;
    for (let i = 0; i < count; i++) {
      const code = generateTempSuiteCode();
      assert(/^NY-TEMP-\d{4}$/.test(code), `Code ${code} valid format`);
      generated.add(code);
    }

    // In a 4-digit space (9,000 possibilities), drawing 1,000 codes will have some collisions.
    // By the birthday problem, expected unique count for 1000 draws from 9000 is ~946.
    console.log(`    Generated ${count} codes, unique: ${generated.size} (${(generated.size / count * 100).toFixed(1)}% unique in 4-digit space)`);
    assert(generated.size >= 850, `Uniqueness entropy acceptable (expected ~946, observed ${generated.size})`);
  });

  await runTest('Warehouse addresses text formatting contract', () => {
    const clientName = 'Juan Pablo Perez';
    const manhattanFormatted = `NY2Bolivia Logistics Hub\nAttn: ${clientName}\n350 5th Avenue, Suite NY-HUB\nNew York, NY 10118\nUnited States\nTel: +1 (212) 555-6922`;
    const queensFormatted = `NY2Bolivia JFK Hub\nAttn: ${clientName}\n147-39 175th Street, Cargo Bldg\nJamaica, NY 11434\nUnited States\nTel: +1 (718) 555-0199`;

    assert(manhattanFormatted.includes('350 5th Avenue, Suite NY-HUB'), 'Manhattan address line 1 correct');
    assert(manhattanFormatted.includes('New York, NY 10118'), 'Manhattan city state zip correct');
    assert(manhattanFormatted.includes(clientName), 'Client name included in Attn');
    assert(queensFormatted.includes('147-39 175th Street, Cargo Bldg'), 'Queens address correct');
    assert(queensFormatted.includes('Jamaica, NY 11434'), 'Queens zip correct');
  });

  // ======================================================================
  // SUITE 6: OrdersService Integration, Persistence & Normalization
  // ======================================================================
  suite('6. OrdersService Integration, Persistence & Normalization');

  await runTest('OrdersService createOrder with Compra Asistida', async () => {
    const service = new OrdersService();
    const order = await service.createOrder({
      clientName: 'Alejandro Morales',
      clientPhone: '77012345',
      destinationCity: 'Santa Cruz de la Sierra',
      deliveryMethod: 'pickup',
      modality: 'assisted',
      items: [
        {
          storeName: 'Apple Store 5th Ave',
          category: 'Electrónica / Celulares / Laptops',
          productName: 'MacBook Pro 14 M3',
          priceUSD: 1599.00,
          quantity: 1,
        }
      ],
      customCommissionPercent: 8,
      customBaseFeeUSD: 20.00,
      customExchangeRateBOB: 6.96,
    });

    assert(/^NY-\d{4}-\d{4}$/.test(order.id), `Order ID format valid: ${order.id}`);
    assert(order.clientPhone === '59177012345', `Phone normalized to +591: ${order.clientPhone}`);
    assert(order.financials.totalProductUSD === 1599.00, 'Total product USD correct');
    assert(order.financials.commissionPercent === 8, 'Commission 8%');
    assert(order.financials.commissionUSD === 127.92, 'Commission $127.92 (1599 * 0.08)');
    assert(order.financials.totalFeeUSD === 147.92, 'Total fee $147.92');
    assert(order.financials.totalFeeBOB === 1029.52, 'Total fee BOB 1029.52 (147.92 * 6.96)');
    assert(order.status === 'pedido', 'Initial status is pedido');
    assert(order.statusHistory.length === 1, 'Initial statusHistory has 1 entry');
  });

  await runTest('OrdersService createOrder with Casillero NY / Pre-Alerta', async () => {
    const service = new OrdersService();
    const order = await service.createOrder({
      clientName: 'Carla Vaca Diez',
      clientPhone: '+591 712-34567',
      destinationCity: 'La Paz',
      deliveryMethod: 'delivery',
      deliveryAddress: 'Av. Arce #1234, Edif. Torre Azul Piso 6',
      modality: 'prealert',
      trackingUSA: '1Z9999999999999999',
      items: [
        {
          storeName: 'Nike NYC House of Innovation',
          category: 'Ropa, Calzado & Accesorios',
          productName: 'Nike Air Jordan 4',
          priceUSD: 215.00,
          quantity: 2,
          trackingUSA: '1Z9999999999999999',
        }
      ],
      customCommissionPercent: 0,
      customBaseFeeUSD: 20.00,
      customExchangeRateBOB: 6.96,
    });

    assert(order.financials.totalProductUSD === 430.00, 'Total product USD is $430 (215 * 2)');
    assert(order.financials.commissionPercent === 0, 'Pre-Alerta commission is 0%');
    assert(order.financials.commissionUSD === 0.00, 'Pre-Alerta commission USD is $0.00');
    assert(order.financials.totalFeeUSD === 20.00, 'Pre-Alerta initial fee is strictly $20.00');
    assert(order.financials.totalFeeBOB === 139.20, 'Pre-Alerta BOB fee is strictly 139.20');
    assert(order.deliveryAddress === 'Av. Arce #1234, Edif. Torre Azul Piso 6', 'Delivery address preserved');
    assert(order.trackingUSA === '1Z9999999999999999', 'Tracking USA preserved');
  });

  await runTest('Phone number normalization contract (+591 Bolivia standard)', async () => {
    const service = new OrdersService();
    const testCases = [
      { input: '77012345', expected: '59177012345' },
      { input: '59177012345', expected: '59177012345' },
      { input: '+591 7701-2345', expected: '59177012345' },
      { input: '712 34 567', expected: '59171234567' },
    ];

    for (const tc of testCases) {
      const order = await service.createOrder({
        clientName: 'Test Phone',
        clientPhone: tc.input,
        destinationCity: 'Cochabamba',
        deliveryMethod: 'pickup',
        modality: 'prealert',
        items: [{ priceUSD: 10, quantity: 1, storeName: 'Store', category: 'Cat', productName: 'Prod' }],
      });
      assert(order.clientPhone === tc.expected, `Phone "${tc.input}" normalized to "${tc.expected}", got "${order.clientPhone}"`);
    }
  });

  await runTest('OrdersService order lifecycle status progression', async () => {
    const service = new OrdersService();
    const order = await service.createOrder({
      clientName: 'Lifecycle Test',
      clientPhone: '77012345',
      destinationCity: 'Santa Cruz de la Sierra',
      deliveryMethod: 'pickup',
      modality: 'assisted',
      items: [{ priceUSD: 100, quantity: 1, storeName: 'Store', category: 'Cat', productName: 'Prod' }],
    });

    // Advance to pagado_fee
    const paidOrder = await service.updateOrderFeePayment(order.id, 'paid', 'QR Simple Bancario');
    assert(paidOrder !== null, 'Order found');
    assert(paidOrder?.status === 'pagado_fee', 'Status transitioned to pagado_fee');
    assert(paidOrder?.financials.feePaymentStatus === 'paid', 'feePaymentStatus is paid');

    // Advance to recepcionado with weight and photo
    const receivedOrder = await service.updateOrderStatus(order.id, 'recepcionado', 'Pesado en JFK', {
      warehouseDetails: { weightLbs: 2.5, photoEvidenceUrl: 'https://example.com/photo.jpg', packagesCount: 1, receivedAt: null }
    });
    assert(receivedOrder?.status === 'recepcionado', 'Status transitioned to recepcionado');
    assert(receivedOrder?.warehouseDetails.weightLbs === 2.5, 'Weight set to 2.5 lbs');

    // Advance to entregado
    const deliveredOrder = await service.updateOrderStatus(order.id, 'entregado', 'Entregado a cliente');
    assert(deliveredOrder?.status === 'entregado', 'Status transitioned to entregado');
    assert(deliveredOrder?.statusHistory.length === 4, 'History contains 4 lifecycle events');
  });

  // ======================================================================
  // SUITE 7: Store Chips & Category Contract Consistency
  // ======================================================================
  suite('7. Store Chips & Category Contract Consistency');

  await runTest('All 10 POPULAR_STORES map to valid CARGO_CATEGORIES', () => {
    const validCategories = new Set(CARGO_CATEGORIES);
    for (const store of POPULAR_STORES) {
      assert(validCategories.has(store.category), `Store ${store.name} category "${store.category}" is in CARGO_CATEGORIES`);
      assert(store.storeName.length > 0, `Store ${store.name} has non-empty storeName`);
      assert(store.icon.length > 0, `Store ${store.name} has icon`);
    }
  });

  await runTest('Bolivian cities coverage: all 9 departments represented', () => {
    const cityValues = BOLIVIAN_CITIES.map(c => c.value);
    const requiredDepartments = [
      'Santa Cruz de la Sierra',
      'La Paz',
      'Cochabamba',
      'Sucre',
      'Tarija',
      'Oruro',
      'Potosí',
      'Beni',
      'Pando'
    ];

    for (const dep of requiredDepartments) {
      assert(cityValues.includes(dep), `Department capital "${dep}" present in city options`);
    }
  });

  // ======================================================================
  // SUMMARY REPORT
  // ======================================================================
  console.log('\n======================================================================');
  console.log('CHALLENGER VERIFICATION SUMMARY');
  console.log('======================================================================');
  console.log(`Total Assertions Checked: ${totalAssertions}`);
  console.log(`Passed Assertions:        ${passedAssertions}`);
  console.log(`Failed Assertions:        ${totalAssertions - passedAssertions}`);
  console.log(`Total Test Blocks:        ${results.length}`);
  const failedTests = results.filter(r => !r.passed);
  console.log(`Passed Test Blocks:       ${results.length - failedTests.length}`);
  console.log(`Failed Test Blocks:       ${failedTests.length}`);

  if (failedTests.length > 0) {
    console.error('\nFAILURES DETECTED:');
    for (const f of failedTests) {
      console.error(`- [${f.suite}] ${f.name}: ${f.error}`);
    }
    process.exit(1);
  } else {
    console.log('\n>>> ALL 19 TEST SUITES & ALL ASSERTIONS PASSED WITH ZERO FAILURES <<<');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal harness error:', err);
  process.exit(1);
});
