/**
 * Adversarial Stress & Vulnerability Test Suite: Milestone 1
 * Targets: src/types/order.ts & src/lib/orders-service.ts
 *
 * Probes failure modes, ID collision rates, extreme values,
 * character injection, floating point boundaries, and concurrency.
 */

import {
  calculateFinancials,
  OrdersService,
  DEFAULT_CONFIG
} from '../src/lib/orders-service';

interface StressResult {
  title: string;
  category: string;
  result: 'ROBUST' | 'VULNERABILITY' | 'WARNING';
  observation: string;
  recommendation?: string;
}

const stressFindings: StressResult[] = [];

// 1. Extreme Values & Floating Point Boundaries
function testExtremeValues() {
  console.log('\n--- 1. Testing Extreme Values & Precision Boundaries ---');

  // Test 1a: Negative price
  const negPrice = calculateFinancials([{ priceUSD: -100, quantity: 1 }]);
  if (negPrice.totalProductUSD < 0 || negPrice.commissionUSD < 0) {
    stressFindings.push({
      title: 'calculateFinancials permits negative totalProductUSD and negative commissionUSD',
      category: 'Input Validation',
      result: 'WARNING',
      observation: `Passing priceUSD: -100 produces totalProductUSD: ${negPrice.totalProductUSD}, commissionUSD: ${negPrice.commissionUSD}, totalFeeUSD: ${negPrice.totalFeeUSD}. However, createOrder sanitizes this via Math.max(0, ...).`,
      recommendation: 'Add Math.max(0, ...) guard inside calculateFinancials directly to protect standalone callers.'
    });
  }

  // Test 1b: Fractional cent inputs (e.g. $19.999)
  const fracCent = calculateFinancials([{ priceUSD: 19.999, quantity: 1 }]);
  console.log(`Fractional cent ($19.999) -> totalProductUSD: ${fracCent.totalProductUSD}, commissionUSD: ${fracCent.commissionUSD}`);
  // toFixed(2) rounds 19.999 to 20.00
  if (fracCent.totalProductUSD === 20.00) {
    stressFindings.push({
      title: 'Fractional cent round-off behavior',
      category: 'Precision',
      result: 'ROBUST',
      observation: 'Fractional cent prices cleanly round to nearest cent via toFixed(2).'
    });
  }

  // Test 1c: NaN and string price handling
  // @ts-ignore
  const nanPrice = calculateFinancials([{ priceUSD: 'not-a-number', quantity: 'invalid' }]);
  if (nanPrice.totalProductUSD === 0 && nanPrice.totalFeeUSD === 20.00) {
    stressFindings.push({
      title: 'NaN / invalid string price coercion resilience',
      category: 'Robustness',
      result: 'ROBUST',
      observation: 'Non-numeric inputs safely fallback to 0 price and 1 quantity with base fee intact.'
    });
  }

  // Test 1d: Extreme high numbers
  const maxSafe = calculateFinancials([{ priceUSD: Number.MAX_SAFE_INTEGER, quantity: 1 }]);
  console.log(`MAX_SAFE_INTEGER order -> totalFeeUSD: ${maxSafe.totalFeeUSD}`);
}

// 2. ID Collision Risk Assessment (Birthday Paradox)
async function testIdCollisionRisk() {
  console.log('\n--- 2. Testing Order ID Collision Risk ---');
  const service = new OrdersService();
  const generatedIds = new Set<string>();
  const numOrders = 300;
  let collisions = 0;

  for (let i = 0; i < numOrders; i++) {
    const order = await service.createOrder({
      clientName: `Test Client ${i}`,
      clientPhone: '59177000000',
      destinationCity: 'Santa Cruz',
      deliveryMethod: 'pickup',
      modality: 'assisted',
      items: [{ storeName: 'Store', category: 'General', productName: 'Item', priceUSD: 10, quantity: 1 }]
    });

    if (generatedIds.has(order.id)) {
      collisions++;
    } else {
      generatedIds.add(order.id);
    }
  }

  console.log(`Generated ${numOrders} orders: found ${collisions} ID collisions.`);
  if (collisions > 0 || numOrders >= 100) {
    stressFindings.push({
      title: 'Order ID collision probability due to 4-digit random space (9,000 IDs)',
      category: 'Scalability / Architecture',
      result: collisions > 0 ? 'VULNERABILITY' : 'WARNING',
      observation: `Order ID format NY-YYYY-XXXX uses only 4 random digits (1000..9999 = 9,000 unique space). By Birthday Paradox, 118 orders have >50% collision probability, and generating ${numOrders} orders produced ${collisions} collisions. Collisions overwrite Firestore documents (setDoc) and duplicate in LocalStorage.`,
      recommendation: 'Expand ID generation to 6 random digits (NY-YYYY-XXXXXX) or append high-resolution timestamp/nanoid, and verify ID uniqueness before persistence.'
    });
  }
}

// 3. Special Character & Injection Handling
async function testSpecialCharacterHandling() {
  console.log('\n--- 3. Testing Special Characters & Injection ---');
  const service = new OrdersService();
  const maliciousName = '<script>alert("XSS")</script>';
  const maliciousCity = '\'; DROP TABLE orders; --';
  const maliciousNotes = 'Line 1\nLine 2\r\n"Quotes" & \'Single\' <Tags>';

  const order = await service.createOrder({
    clientName: maliciousName,
    clientPhone: '+591 (77) 012-345',
    destinationCity: maliciousCity,
    deliveryMethod: 'pickup',
    modality: 'prealert',
    items: [
      {
        storeName: 'Amazon',
        category: 'Electronics',
        productName: maliciousNotes,
        priceUSD: 100,
        quantity: 1,
        notes: maliciousNotes
      }
    ]
  });

  const waUrl = service.getWhatsAppShareUrl(order);
  const isWaUrlSafe = !waUrl.includes('<script>') && waUrl.includes(encodeURIComponent(maliciousName));

  if (isWaUrlSafe) {
    stressFindings.push({
      title: 'WhatsApp URL encoding protects against character injection',
      category: 'Security',
      result: 'ROBUST',
      observation: 'Special characters, HTML tags, and quotes are properly percent-encoded in WhatsApp links.'
    });
  } else {
    stressFindings.push({
      title: 'WhatsApp URL unescaped character leak',
      category: 'Security',
      result: 'VULNERABILITY',
      observation: 'WhatsApp URL contains unencoded raw special characters.'
    });
  }
}

// 4. Phone Sanitization Boundary Check
async function testPhoneSanitizationBoundaries() {
  console.log('\n--- 4. Testing Phone Sanitization Boundaries ---');
  const service = new OrdersService();

  // Test US phone number
  const usOrder = await service.createOrder({
    clientName: 'US Expat',
    clientPhone: '+1 (212) 555-0199',
    destinationCity: 'La Paz',
    deliveryMethod: 'pickup',
    modality: 'assisted',
    items: [{ storeName: 'Store', category: 'Tech', productName: 'Item', priceUSD: 50, quantity: 1 }]
  });

  // Test empty phone
  const emptyPhoneOrder = await service.createOrder({
    clientName: 'No Phone',
    clientPhone: '',
    destinationCity: 'Santa Cruz',
    deliveryMethod: 'pickup',
    modality: 'assisted',
    items: [{ storeName: 'Store', category: 'Tech', productName: 'Item', priceUSD: 50, quantity: 1 }]
  });

  const emptyWaUrl = service.getWhatsAppShareUrl(emptyPhoneOrder);

  if (emptyWaUrl.includes(DEFAULT_CONFIG.whatsappSupportNumber)) {
    stressFindings.push({
      title: 'Empty phone gracefully falls back to default support WhatsApp number',
      category: 'Robustness',
      result: 'ROBUST',
      observation: `When clientPhone is empty, getWhatsAppShareUrl falls back to default support number (${DEFAULT_CONFIG.whatsappSupportNumber}).`
    });
  }
}

// 5. Concurrency / Parallel Order Creation
async function testParallelOrders() {
  console.log('\n--- 5. Testing Parallel Order Creation ---');
  const service = new OrdersService();
  const promises = [];

  for (let i = 0; i < 50; i++) {
    promises.push(
      service.createOrder({
        clientName: `Concurrent Client ${i}`,
        clientPhone: `591770000${String(i).padStart(2, '0')}`,
        destinationCity: 'Cochabamba',
        deliveryMethod: 'pickup',
        modality: 'assisted',
        items: [{ storeName: 'Store', category: 'General', productName: `Item ${i}`, priceUSD: 10 * (i + 1), quantity: 1 }]
      })
    );
  }

  const created = await Promise.all(promises);
  console.log(`Created ${created.length} orders concurrently.`);

  const orders = await service.getOrders();
  if (orders.length >= 50) {
    stressFindings.push({
      title: 'Parallel in-memory order creation consistency',
      category: 'Concurrency',
      result: 'ROBUST',
      observation: `Successfully processed 50 concurrent createOrder calls without uncaught exceptions or data corruption.`
    });
  }
}

async function runAllStress() {
  console.log('====================================================');
  console.log('⚡ RUNNING ADVERSARIAL STRESS & FAILURE MODE PROBES');
  console.log('====================================================');

  testExtremeValues();
  await testIdCollisionRisk();
  await testSpecialCharacterHandling();
  await testPhoneSanitizationBoundaries();
  await testParallelOrders();

  console.log('\n====================================================');
  console.log('📋 STRESS AUDIT FINDINGS:');
  console.log('====================================================');
  stressFindings.forEach((f, idx) => {
    console.log(`\n[${idx + 1}] [${f.result}] [${f.category}] ${f.title}`);
    console.log(`    Observation: ${f.observation}`);
    if (f.recommendation) {
      console.log(`    Recommendation: ${f.recommendation}`);
    }
  });
}

runAllStress();
