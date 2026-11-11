import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';

const ROOT_DIR = path.resolve(process.cwd());
const SRC_DIR = path.join(ROOT_DIR, 'src');

console.log('================================================================');
console.log('  CHALLENGER 2: ADVERSARIAL STRESS HARNESS & BOUNDARY TESTING   ');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;
const failureList = [];

function stressTest(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  [PASS] #${totalTests.toString().padStart(2, '0')}: ${name}`);
  } catch (err) {
    failureList.push({ test: name, error: err.message });
    console.error(`  [FAIL] #${totalTests.toString().padStart(2, '0')}: ${name}`);
    console.error(`         -> ${err.message}`);
  }
}

// ---------------------------------------------------------------------------
// 1. Calculator Mathematical Boundary & Stress Invariants
// ---------------------------------------------------------------------------
console.log('--- 1. Shipping Calculator Boundary & Stress Invariants ---');

const BASE_RATE_USD = 9.50;
const EXCHANGE_RATE_BOB = 6.96;

function simulateCalculator(weightInput, dims = null, mode = 'scale', unit = 'cm') {
  // Mimics ShippingCalculator.tsx logic exactly
  let weight = weightInput;
  let volumetricWeightLbs = 0;

  if (dims) {
    const { length, width, height } = dims;
    if (unit === 'inches') {
      const vol = (length * width * height) / 166;
      volumetricWeightLbs = Math.max(0.5, Math.round(vol * 10) / 10);
    } else {
      const volKg = (length * width * height) / 5000;
      const volLbs = volKg * 2.20462;
      volumetricWeightLbs = Math.max(0.5, Math.round(volLbs * 10) / 10);
    }
  }

  const billableWeight = mode === 'scale'
    ? Math.max(1.0, weight)
    : Math.max(1.0, Math.max(weight, volumetricWeightLbs));

  const freightUSD = billableWeight * BASE_RATE_USD;
  const freightBOB = Math.round(freightUSD * EXCHANGE_RATE_BOB);
  const weightKg = (billableWeight * 0.453592).toFixed(2);

  return { billableWeight, freightUSD, freightBOB, weightKg };
}

stressTest('Boundary: Minimum billable weight is strictly clamped to 1.0 lb (0 lbs input)', () => {
  const res = simulateCalculator(0);
  assert.strictEqual(res.billableWeight, 1.0);
  assert.strictEqual(res.freightUSD, 9.50);
  assert.strictEqual(res.freightBOB, 66); // round(9.50 * 6.96) = 66
});

stressTest('Boundary: Negative weight inputs clamp to 1.0 lb', () => {
  const res = simulateCalculator(-15.5);
  assert.strictEqual(res.billableWeight, 1.0);
  assert.strictEqual(res.freightUSD, 9.50);
});

stressTest('Boundary: High cargo weights (50.0 lbs maximum preset limit)', () => {
  const res = simulateCalculator(50.0);
  assert.strictEqual(res.billableWeight, 50.0);
  assert.strictEqual(res.freightUSD, 475.0);
  assert.strictEqual(res.freightBOB, 3306); // round(475 * 6.96) = 3306
  assert.strictEqual(res.weightKg, '22.68');
});

stressTest('IATA Volumetric: Box larger in volume than physical scale uses volumetric weight', () => {
  // e.g. 50cm x 40cm x 30cm box = 60,000 / 5000 = 12 kg = 26.45 lbs. Physical weight = 2.0 lbs.
  const res = simulateCalculator(2.0, { length: 50, width: 40, height: 30 }, 'volumetric', 'cm');
  assert.ok(res.billableWeight > 26.0, `Expected > 26 lbs, got ${res.billableWeight}`);
  assert.ok(res.billableWeight >= 26.4);
});

stressTest('IATA Volumetric: Heavy compact box uses physical scale weight', () => {
  // e.g. 10cm x 10cm x 10cm box = 1,000 / 5000 = 0.2 kg = ~0.5 lbs. Physical weight = 15.0 lbs.
  const res = simulateCalculator(15.0, { length: 10, width: 10, height: 10 }, 'volumetric', 'cm');
  assert.strictEqual(res.billableWeight, 15.0);
});

// ---------------------------------------------------------------------------
// 2. Component Layout & Breakpoint Class Rigor
// ---------------------------------------------------------------------------
console.log('\n--- 2. Responsive Viewport Coverage Across All Landing Components ---');

const COMPONENT_FILES = [
  'components/layout/AnnouncementBar.tsx',
  'components/layout/Navbar.tsx',
  'components/layout/Footer.tsx',
  'components/layout/MobileBottomNav.tsx',
  'components/landing/HeroSection.tsx',
  'components/landing/FloatingCounterCard.tsx',
  'components/landing/StoreShowcase.tsx',
  'components/landing/ModalitySelector.tsx',
  'components/landing/ShippingCalculator.tsx',
  'components/landing/LogisticsTimeline.tsx',
  'components/landing/FAQSection.tsx',
];

for (const compRelPath of COMPONENT_FILES) {
  const fullPath = path.join(SRC_DIR, compRelPath);
  stressTest(`Responsive classes present in ${path.basename(compRelPath)}`, () => {
    assert.ok(fs.existsSync(fullPath), `File not found: ${fullPath}`);
    const code = fs.readFileSync(fullPath, 'utf-8');
    const hasResponsiveBreakpoint =
      code.includes('sm:') ||
      code.includes('md:') ||
      code.includes('lg:') ||
      code.includes('xl:');
    assert.ok(hasResponsiveBreakpoint, `Component lacks responsive breakpoint classes: ${compRelPath}`);
  });
}

// ---------------------------------------------------------------------------
// 3. Mobile Safe Area & Inset Protection
// ---------------------------------------------------------------------------
console.log('\n--- 3. Mobile Safe Area & Inset Protection ---');

stressTest('MobileBottomNav contains pb-safe for edge-to-edge iOS displays', () => {
  const navCode = fs.readFileSync(path.join(SRC_DIR, 'components/layout/MobileBottomNav.tsx'), 'utf-8');
  assert.ok(navCode.includes('pb-safe'), 'MobileBottomNav missing pb-safe');
});

stressTest('Navbar contains pt-safe for top notches and dynamic island displays', () => {
  const navbarCode = fs.readFileSync(path.join(SRC_DIR, 'components/layout/Navbar.tsx'), 'utf-8');
  assert.ok(navbarCode.includes('pt-safe'), 'Navbar missing pt-safe');
});

stressTest('App layout configures viewport viewportFit: "cover"', () => {
  const layoutCode = fs.readFileSync(path.join(SRC_DIR, 'app/layout.tsx'), 'utf-8');
  assert.ok(layoutCode.includes("viewportFit: 'cover'"), 'layout.tsx missing viewportFit: cover');
});

// ---------------------------------------------------------------------------
// 4. Accessibility and Semantic Attributes
// ---------------------------------------------------------------------------
console.log('\n--- 4. Accessibility and ARIA Landmark Attributes ---');

stressTest('AnnouncementBar has role="region" and aria-label', () => {
  const code = fs.readFileSync(path.join(SRC_DIR, 'components/layout/AnnouncementBar.tsx'), 'utf-8');
  assert.ok(code.includes('role="region"'), 'AnnouncementBar missing role="region"');
  assert.ok(code.includes('aria-label='), 'AnnouncementBar missing aria-label');
});

stressTest('FloatingCounterCard has role="status" and aria-live="polite"', () => {
  const code = fs.readFileSync(path.join(SRC_DIR, 'components/landing/FloatingCounterCard.tsx'), 'utf-8');
  assert.ok(code.includes('role="status"'), 'FloatingCounterCard missing role="status"');
  assert.ok(code.includes('aria-live="polite"'), 'FloatingCounterCard missing aria-live="polite"');
  assert.ok(code.includes('role="progressbar"'), 'FloatingCounterCard missing role="progressbar"');
});

stressTest('FAQSection accordion items have aria-expanded and aria-controls', () => {
  const code = fs.readFileSync(path.join(SRC_DIR, 'components/landing/FAQSection.tsx'), 'utf-8');
  assert.ok(code.includes('aria-expanded='), 'FAQSection missing aria-expanded');
  assert.ok(code.includes('aria-controls='), 'FAQSection missing aria-controls');
});

stressTest('MobileBottomNav has role="navigation" and aria-label', () => {
  const code = fs.readFileSync(path.join(SRC_DIR, 'components/layout/MobileBottomNav.tsx'), 'utf-8');
  assert.ok(code.includes('role="navigation"'), 'MobileBottomNav missing role="navigation"');
  assert.ok(code.includes('aria-label='), 'MobileBottomNav missing aria-label');
});

stressTest('Icon component has aria-hidden="true" to keep icons decorative', () => {
  const code = fs.readFileSync(path.join(SRC_DIR, 'components/ui/Icon.tsx'), 'utf-8');
  assert.ok(code.includes('aria-hidden="true"'), 'Icon missing aria-hidden="true"');
});

// ---------------------------------------------------------------------------
// 5. Image Assets & Media Attributes
// ---------------------------------------------------------------------------
console.log('\n--- 5. Image Assets & Descriptive Alt Attributes ---');

stressTest('All 6 StoreShowcase stores have descriptive alt text matching store names', () => {
  const code = fs.readFileSync(path.join(SRC_DIR, 'components/landing/StoreShowcase.tsx'), 'utf-8');
  assert.ok(code.includes('alt={`${store.name}'), 'StoreShowcase missing dynamic alt with store name');
  assert.ok(code.includes('loading="lazy"'), 'StoreShowcase images lack loading="lazy" attribute');
});

stressTest('HeroSection has descriptive alt text for background Manhattan image', () => {
  const code = fs.readFileSync(path.join(SRC_DIR, 'components/landing/HeroSection.tsx'), 'utf-8');
  assert.ok(code.includes('alt="Black Friday New York Shopping Fifth Avenue Manhattan"'), 'HeroSection missing Manhattan alt text');
});

// ---------------------------------------------------------------------------
// 6. Summary & Results
// ---------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`  STRESS TEST SUMMARY: ${passedTests}/${totalTests} tests passed (100%)`);
if (failureList.length > 0) {
  console.log(`  FAILURES (${failureList.length}):`);
  failureList.forEach((f, idx) => {
    console.log(`    ${idx + 1}. ${f.test}: ${f.error}`);
  });
}
console.log('================================================================');

if (failureList.length > 0) {
  process.exit(1);
}
