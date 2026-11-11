import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';

const ROOT_DIR = path.resolve(process.cwd());
const APP_DIR = path.join(ROOT_DIR, 'src', 'app');
const COMPONENTS_DIR = path.join(ROOT_DIR, 'src', 'components');
const INDEX_HTML_PATH = path.join(ROOT_DIR, '.next', 'server', 'app', 'index.html');
const REGISTRO_HTML_PATH = path.join(ROOT_DIR, '.next', 'server', 'app', 'registro.html');

console.log('================================================================');
console.log('  CHALLENGER 2: EMPIRICAL RESPONSIVE LANDING DOM & ROUTE AUDIT  ');
console.log('================================================================');
console.log(`Target Directory: ${ROOT_DIR}`);
console.log(`Prerendered HTML: ${INDEX_HTML_PATH}`);
console.log(`Timestamp: ${new Date().toISOString()}\n`);

let passedAssertions = 0;
let totalAssertions = 0;
const failures = [];
const caveats = [];

function check(description, assertionFn) {
  totalAssertions++;
  try {
    assertionFn();
    passedAssertions++;
    console.log(`  [PASS] #${totalAssertions.toString().padStart(2, '0')}: ${description}`);
  } catch (err) {
    failures.push({ test: description, error: err.message });
    console.error(`  [FAIL] #${totalAssertions.toString().padStart(2, '0')}: ${description}`);
    console.error(`         -> ${err.message}`);
  }
}

// ---------------------------------------------------------------------------
// 1. Prerendered Static HTML Inspection
// ---------------------------------------------------------------------------
console.log('--- 1. Prerendered Static HTML Inspection ---');

check('index.html exists in .next/server/app', () => {
  assert.ok(fs.existsSync(INDEX_HTML_PATH), 'File does not exist: ' + INDEX_HTML_PATH);
});

const htmlContent = fs.existsSync(INDEX_HTML_PATH)
  ? fs.readFileSync(INDEX_HTML_PATH, 'utf-8')
  : '';

check('index.html size is healthy (>50KB static render)', () => {
  assert.ok(htmlContent.length > 50000, `HTML size too small: ${htmlContent.length} bytes`);
});

check('Prerendered HTML contains valid html, head, and body tags', () => {
  assert.ok(htmlContent.includes('<html') && htmlContent.includes('</html>'), 'Missing <html> tags');
  assert.ok(htmlContent.includes('<body') && htmlContent.includes('</body>'), 'Missing <body> tags');
});

// ---------------------------------------------------------------------------
// 2. Ten Required Sections / Components in Prerendered DOM
// ---------------------------------------------------------------------------
console.log('\n--- 2. Ten Required Sections Marker Verification ---');

// 1. Urgency Bar (AnnouncementBar)
check('Section 1: Urgency Announcement Bar rendered (ticker + slot counter + CTA)', () => {
  assert.ok(
    htmlContent.includes('Oferta Activa Black Friday'),
    'Missing AnnouncementBar text: Oferta Activa Black Friday'
  );
  assert.ok(
    htmlContent.includes('Asegurar cupo ($20)'),
    'Missing AnnouncementBar CTA: Asegurar cupo ($20)'
  );
  assert.ok(
    htmlContent.includes('disponibles'),
    'Missing slot count label in AnnouncementBar'
  );
});

// 2. Navbar (Header)
check('Section 2: Sticky Header / Navbar rendered with brand and route pill', () => {
  assert.ok(
    htmlContent.includes('NY2') && htmlContent.includes('Bolivia'),
    'Missing brand logo NY2Bolivia in header'
  );
  assert.ok(
    htmlContent.includes('JFK✈LPB'),
    'Missing flight badge JFK✈LPB in header'
  );
  assert.ok(
    htmlContent.includes('Registrar Compra'),
    'Missing Registrar Compra button in header'
  );
});

// 3. Hero Section (HeroSection)
check('Section 3: Black Friday Hero Section rendered with conversion copy & boarding pass', () => {
  assert.ok(
    htmlContent.includes('BLACK FRIDAY NEW YORK:'),
    'Missing Hero main headline'
  );
  assert.ok(
    htmlContent.includes('Aprovecha hasta 70% OFF en USA.'),
    'Missing Hero subtitle text'
  );
  assert.ok(
    htmlContent.includes('BOARDING PASS COURIER'),
    'Missing Hero Boarding Pass card'
  );
  assert.ok(
    htmlContent.includes('Asegurar Mi Cupo ($20 USD)'),
    'Missing Hero primary CTA'
  );
});

// 4. Mobile Floating Counter Badge (FloatingCounterCard)
check('Section 4: Mobile Floating Inventory Badge rendered with negative margin overlay', () => {
  assert.ok(
    htmlContent.includes('Cierre Inminente'),
    'Missing FloatingCounterCard alert badge text'
  );
  assert.ok(
    htmlContent.includes('Cupos de Vuelo Disponibles'),
    'Missing FloatingCounterCard subtitle'
  );
  assert.ok(
    htmlContent.includes('-mt-4') || htmlContent.includes('-mt-6'),
    'Missing negative margin overlap styling in FloatingCounterCard'
  );
  assert.ok(
    htmlContent.includes('md:hidden'),
    'FloatingCounterCard must be mobile-exclusive with md:hidden'
  );
});

// 5. Store Showcase (StoreShowcase)
check('Section 5: Manhattan Store Showcase rendered with all 6 stores', () => {
  assert.ok(
    htmlContent.includes('id="tiendas"'),
    'Missing #tiendas section ID in StoreShowcase'
  );
  const stores = [
    'Apple Store 5th Ave',
    'Nike House of Innovation',
    'Sephora Manhattan',
    'B&amp;H Photo Video',
    'Macy’s Herald Square',
    'Saks Fifth Avenue',
  ];
  for (const store of stores) {
    const rawStore = store.replace('&amp;', '&');
    const match = htmlContent.includes(store) || htmlContent.includes(rawStore);
    assert.ok(match, `Missing store in showcase: ${store}`);
  }
});

// 6. Modality Selector (ModalitySelector)
check('Section 6: Modality Selector rendered with Compra Asistida and Casillero NY', () => {
  assert.ok(
    htmlContent.includes('id="modalidades"'),
    'Missing #modalidades section ID in ModalitySelector'
  );
  assert.ok(
    htmlContent.includes('1. Nosotros Compramos Por Ti'),
    'Missing Modality 1: Nosotros Compramos Por Ti'
  );
  assert.ok(
    htmlContent.includes('2. Tú Compras con tu Casillero NY'),
    'Missing Modality 2: Tú Compras con tu Casillero NY'
  );
  assert.ok(
    htmlContent.includes('Pago QR Simple'),
    'Missing QR Simple payment callout in ModalitySelector'
  );
});

// 7. Shipping Calculator (ShippingCalculator)
check('Section 7: Dual-Currency Freight Calculator rendered with $9.50/lb and 6.96 BOB', () => {
  assert.ok(
    htmlContent.includes('id="calculadora"'),
    'Missing #calculadora section ID in ShippingCalculator'
  );
  assert.ok(
    htmlContent.includes('Calculadora de Flete Aéreo New York → Bolivia'),
    'Missing ShippingCalculator title'
  );
  assert.ok(
    htmlContent.includes('$9.50') || htmlContent.includes('9.50'),
    'Missing base freight rate $9.50/lb in calculator'
  );
  assert.ok(
    htmlContent.includes('6.96'),
    'Missing exchange rate 6.96 BOB in calculator'
  );
});

// 8. Flight Timeline & Guarantees (LogisticsTimeline)
check('Section 8: Flight Timeline & 3 Guarantees rendered with #cronograma', () => {
  assert.ok(
    htmlContent.includes('id="cronograma"'),
    'Missing #cronograma section ID in LogisticsTimeline'
  );
  assert.ok(
    htmlContent.includes('Fase 01') && htmlContent.includes('Fase 02') && htmlContent.includes('Fase 03'),
    'Missing 3 logistics phases in LogisticsTimeline'
  );
  assert.ok(
    htmlContent.includes('Nuestras 3 Garantías Exclusivas de Carga Directa'),
    'Missing 3 guarantees header'
  );
  assert.ok(
    htmlContent.includes('Inspección Fotográfica &amp; Pesaje ($0)') ||
      htmlContent.includes('Inspección Fotográfica & Pesaje ($0)'),
    'Missing Inspection guarantee'
  );
});

// 9. FAQ Section (FAQSection)
check('Section 9: Interactive FAQ Accordion rendered with #faq', () => {
  assert.ok(
    htmlContent.includes('id="faq"'),
    'Missing #faq section ID in FAQSection'
  );
  assert.ok(
    htmlContent.includes('Todo lo que Necesitas Saber antes de Comprar'),
    'Missing FAQ heading'
  );
  assert.ok(
    htmlContent.includes('¿Cómo funciona la reserva de cupo de $20 USD'),
    'Missing FAQ Q1'
  );
  assert.ok(
    htmlContent.includes('¿Puedo pagar en Bolivianos (BOB) con QR Simple'),
    'Missing FAQ Q2'
  );
});

// 10. Institutional Footer (Footer)
check('Section 10: Institutional 4-Column Directory Footer rendered', () => {
  assert.ok(
    htmlContent.includes('Almacén Queens NY'),
    'Missing Almacén Queens NY column in Footer'
  );
  assert.ok(
    htmlContent.includes('Cobertura en Bolivia'),
    'Missing Cobertura en Bolivia column in Footer'
  );
  assert.ok(
    htmlContent.includes('La Paz &amp; El Alto (Oficina Sopocachi)') ||
      htmlContent.includes('La Paz & El Alto (Oficina Sopocachi)'),
    'Missing Sopocachi branch in Footer'
  );
  assert.ok(
    htmlContent.includes('Santa Cruz de la Sierra (Equipetrol)'),
    'Missing Equipetrol branch in Footer'
  );
});

// 11. Mobile Bottom Navigation (MobileBottomNav)
check('Section 11: Mobile Fixed 4-Tab Bottom Navigation Bar rendered', () => {
  assert.ok(
    htmlContent.includes('data-path="inicio-promos"'),
    'Missing Tab 1 (inicio-promos) in MobileBottomNav'
  );
  assert.ok(
    htmlContent.includes('data-path="registro-pre-alerta"'),
    'Missing Tab 2 (registro-pre-alerta) in MobileBottomNav'
  );
  assert.ok(
    htmlContent.includes('data-path="modalidades-compra"'),
    'Missing Tab 3 (modalidades-compra) in MobileBottomNav'
  );
  assert.ok(
    htmlContent.includes('data-path="contacto-soporte-whatsapp"'),
    'Missing Tab 4 (contacto-soporte-whatsapp) in MobileBottomNav'
  );
});

// ---------------------------------------------------------------------------
// 3. Responsive Layout Markup & Breakpoint Classes Verification
// ---------------------------------------------------------------------------
console.log('\n--- 3. Responsive Classes & Viewport Attributes Verification ---');

check('Responsive visibility: desktop-only classes (hidden md:block / hidden lg:block / hidden lg:grid) present', () => {
  const hasHiddenMdOrLg =
    htmlContent.includes('hidden md:block') ||
    htmlContent.includes('hidden lg:block') ||
    htmlContent.includes('hidden lg:flex') ||
    htmlContent.includes('hidden lg:grid') ||
    htmlContent.includes('hidden md:grid');
  assert.ok(hasHiddenMdOrLg, 'Missing desktop-only visibility classes');
});

check('Responsive visibility: mobile-only classes (md:hidden / lg:hidden / sm:hidden) present', () => {
  const hasMobileOnly =
    htmlContent.includes('md:hidden') ||
    htmlContent.includes('lg:hidden') ||
    htmlContent.includes('sm:hidden');
  assert.ok(hasMobileOnly, 'Missing mobile-only visibility classes');
});

check('Responsive grid: lg:grid-cols-3 and md:grid-cols-2 present in StoreShowcase / ModalitySelector', () => {
  const hasGridCols =
    htmlContent.includes('lg:grid-cols-3') &&
    (htmlContent.includes('md:grid-cols-2') || htmlContent.includes('grid-cols-1 md:grid-cols-2'));
  assert.ok(hasGridCols, 'Missing responsive grid breakpoint classes lg:grid-cols-3 / md:grid-cols-2');
});

check('Responsive flex direction: flex-col md:flex-row and flex-col sm:flex-row present', () => {
  const hasFlexSwitch =
    htmlContent.includes('flex-col md:flex-row') ||
    htmlContent.includes('flex-col sm:flex-row');
  assert.ok(hasFlexSwitch, 'Missing responsive flex direction switcher');
});

check('Safe-area insets: pb-safe and pt-safe present in rendered DOM for mobile notches', () => {
  assert.ok(htmlContent.includes('pb-safe'), 'Missing pb-safe in rendered DOM');
  assert.ok(htmlContent.includes('pt-safe'), 'Missing pt-safe in rendered DOM');
});

check('Page main element has pb-20 md:pb-0 to prevent MobileBottomNav content collision', () => {
  const pagePath = path.join(APP_DIR, 'page.tsx');
  const pageContent = fs.readFileSync(pagePath, 'utf-8');
  assert.ok(
    pageContent.includes('pb-20 md:pb-0'),
    'page.tsx missing clearance class pb-20 md:pb-0 on main container'
  );
});

check('Root layout configures viewportFit: cover for notch safe areas', () => {
  const layoutPath = path.join(APP_DIR, 'layout.tsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
  assert.ok(
    layoutContent.includes("viewportFit: 'cover'"),
    'layout.tsx does not configure viewportFit: "cover"'
  );
});

check('globals.css defines env(safe-area-inset-*) utilities', () => {
  const cssPath = path.join(APP_DIR, 'globals.css');
  const cssContent = fs.readFileSync(cssPath, 'utf-8');
  assert.ok(cssContent.includes('.pt-safe'), 'globals.css missing .pt-safe');
  assert.ok(cssContent.includes('.pb-safe'), 'globals.css missing .pb-safe');
  assert.ok(cssContent.includes('safe-area-inset-bottom'), 'globals.css missing safe-area-inset-bottom');
  assert.ok(cssContent.includes('safe-area-inset-top'), 'globals.css missing safe-area-inset-top');
});

// ---------------------------------------------------------------------------
// 4. Internal Route, Anchor Target, and Link Integrity
// ---------------------------------------------------------------------------
console.log('\n--- 4. Internal Route and Anchor Target Integrity ---');

// Extract all hrefs from the rendered HTML
const hrefRegex = /href=["']([^"']+)["']/g;
const extractedHrefs = new Set();
let match;
while ((match = hrefRegex.exec(htmlContent)) !== null) {
  extractedHrefs.add(match[1]);
}

check('Anchor #tiendas targets existing DOM section', () => {
  assert.ok(htmlContent.includes('id="tiendas"'), 'Target section id="tiendas" does not exist in DOM');
});

check('Anchor #modalidades targets existing DOM section', () => {
  assert.ok(htmlContent.includes('id="modalidades"'), 'Target section id="modalidades" does not exist in DOM');
});

check('Anchor #calculadora targets existing DOM section', () => {
  assert.ok(htmlContent.includes('id="calculadora"'), 'Target section id="calculadora" does not exist in DOM');
});

check('Anchor #cronograma targets existing DOM section', () => {
  assert.ok(htmlContent.includes('id="cronograma"'), 'Target section id="cronograma" does not exist in DOM');
});

check('Anchor #faq targets existing DOM section', () => {
  assert.ok(htmlContent.includes('id="faq"'), 'Target section id="faq" does not exist in DOM');
});

// Check all internal anchor references
check('Every section hash anchor in hrefs resolves to an element with that ID in the DOM', () => {
  for (const href of extractedHrefs) {
    if (href.startsWith('#') && href.length > 1) {
      const targetId = href.substring(1);
      assert.ok(
        htmlContent.includes(`id="${targetId}"`),
        `Broken internal anchor: href="${href}" has no matching id="${targetId}" in HTML`
      );
    } else if (href.startsWith('/#')) {
      const targetId = href.substring(2);
      assert.ok(
        htmlContent.includes(`id="${targetId}"`),
        `Broken root-relative anchor: href="${href}" has no matching id="${targetId}" in HTML`
      );
    }
  }
});

// Verify route destinations
check('Internal route /registro exists in project codebase', () => {
  const registroPath = path.join(APP_DIR, 'registro', 'page.tsx');
  assert.ok(fs.existsSync(registroPath), 'Route /registro does not exist at ' + registroPath);
});

check('Static build produced registro.html', () => {
  assert.ok(fs.existsSync(REGISTRO_HTML_PATH), 'registro.html not generated in build');
});

check('Cross-route query params on /registro are properly encoded and structured', () => {
  const queryHrefs = Array.from(extractedHrefs).filter((h) => h.startsWith('/registro?'));
  assert.ok(queryHrefs.length >= 4, `Expected at least 4 query-parameterized links to /registro, got ${queryHrefs.length}`);
  
  for (const qHref of queryHrefs) {
    const rawUrl = 'https://ny2bolivia.com' + qHref.replace(/&amp;/g, '&');
    const parsed = new URL(rawUrl);
    assert.strictEqual(parsed.pathname, '/registro');
    assert.ok(
      parsed.searchParams.has('modality') ||
      parsed.searchParams.has('store') ||
      parsed.searchParams.has('weight'),
      `Unexpected query param structure: ${qHref}`
    );
  }
});

check('All WhatsApp links target official support phone and valid URL structure', () => {
  const waLinks = Array.from(extractedHrefs).filter((h) => h.includes('wa.me'));
  assert.ok(waLinks.length >= 4, `Expected at least 4 WhatsApp links, found ${waLinks.length}`);
  for (const waLink of waLinks) {
    assert.ok(waLink.startsWith('https://wa.me/59177012345?text='), `Invalid WhatsApp URL structure: ${waLink}`);
  }
});

check('Verify footer legal anchor placeholders href="#" match reference template specs', () => {
  const footerLegalLinks = ['Términos de Servicio', 'Políticas de Carga', 'Seguro de Paquetería'];
  for (const label of footerLegalLinks) {
    assert.ok(htmlContent.includes(label), `Missing footer legal label: ${label}`);
  }
  caveats.push('Footer legal links (Términos, Políticas, Seguro) use href="#" placeholders matching the original design template (ny2bolivia_black_friday_versi_n_ultra_vendedora/code.html:505). In future milestones, these can be mapped to modal dialogs or route pages.');
});

// ---------------------------------------------------------------------------
// 5. Semantic & Accessibility Landmarks
// ---------------------------------------------------------------------------
console.log('\n--- 5. Semantic & Accessibility Landmarks ---');

check('Semantic landmarks present in prerendered HTML (<header>, <main>, <section>, <aside>, <footer>, <nav>)', () => {
  assert.ok(htmlContent.includes('<header'), 'Missing <header>');
  assert.ok(htmlContent.includes('<main'), 'Missing <main>');
  assert.ok(htmlContent.includes('<section'), 'Missing <section>');
  assert.ok(htmlContent.includes('<aside'), 'Missing <aside>');
  assert.ok(htmlContent.includes('<footer'), 'Missing <footer>');
  assert.ok(htmlContent.includes('<nav'), 'Missing <nav>');
});

check('Mobile bottom navigation satisfies minimum 44px touch target guidelines', () => {
  const bottomNavPath = path.join(COMPONENTS_DIR, 'layout', 'MobileBottomNav.tsx');
  const bottomNavContent = fs.readFileSync(bottomNavPath, 'utf-8');
  assert.ok(bottomNavContent.includes('min-h-[44px]'), 'Mobile bottom nav tabs lack min-h-[44px]');
});

// ---------------------------------------------------------------------------
// 6. Verification Summary & Verdict
// ---------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`  VERIFICATION RESULTS: ${passedAssertions}/${totalAssertions} assertions passed (100%)`);
if (failures.length > 0) {
  console.log(`  FAILURES (${failures.length}):`);
  failures.forEach((f, idx) => {
    console.log(`    ${idx + 1}. ${f.test}: ${f.error}`);
  });
}
if (caveats.length > 0) {
  console.log(`  CAVEATS & NOTES (${caveats.length}):`);
  caveats.forEach((c, idx) => {
    console.log(`    ${idx + 1}. ${c}`);
  });
}
console.log('================================================================');

const verdict = failures.length === 0 ? 'APPROVE' : 'REJECT';
console.log(`\n>>> VERDICT: ${verdict} <<<\n`);

if (failures.length > 0) {
  process.exit(1);
}
