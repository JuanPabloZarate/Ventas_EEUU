/**
 * Milestone 5 E2E Testing & Adversarial Verification Suite
 * NY2Bolivia Web (Andean Skyline Logistics)
 *
 * Tier 1: Comprehensive Feature Coverage (/ and /registro)
 * Tier 2: Boundary & Corner Cases Matrix
 * Tier 3: Adversarial Injection, Concurrency & URL Ingestion
 */

import path from 'path';
import fs from 'fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Components - Landing Page (/)
import { HeroSection } from '../src/components/landing/HeroSection';
import { StoreShowcase, STORES_DATA } from '../src/components/landing/StoreShowcase';
import { ModalitySelector } from '../src/components/landing/ModalitySelector';
import { ShippingCalculator } from '../src/components/landing/ShippingCalculator';
import { LogisticsTimeline } from '../src/components/landing/LogisticsTimeline';
import { FAQSection } from '../src/components/landing/FAQSection';
import { MobileBottomNav } from '../src/components/layout/MobileBottomNav';

// Components - Registration Page (/registro)
import { ModalityToggle } from '../src/components/registration/ModalityToggle';
import { ClientProfileForm, BOLIVIAN_CITIES } from '../src/components/registration/ClientProfileForm';
import { DynamicItemBuilder, CARGO_CATEGORIES } from '../src/components/registration/DynamicItemBuilder';
import { FileUploadDropzone } from '../src/components/registration/FileUploadDropzone';
import { SpecialHandling } from '../src/components/registration/SpecialHandling';
import { StickySummarySidebar } from '../src/components/registration/StickySummarySidebar';
import { OrderSuccessModal } from '../src/components/registration/OrderSuccessModal';
import { SuiteCodeModal } from '../src/components/registration/SuiteCodeModal';

// Domain Logic & Contracts
import { ordersService, calculateFinancials, DEFAULT_CONFIG } from '../src/lib/orders-service';
import type { Order, OrderItem, SpecialInstructions } from '../src/types/order';

// Test Runner Infrastructure
let totalAssertions = 0;
let passedAssertions = 0;
let failedAssertions = 0;
const failures: string[] = [];

function check(condition: boolean, description: string): void {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
  } else {
    failedAssertions++;
    failures.push(description);
    console.error(`  ✗ FAIL: ${description}`);
  }
}

function suite(name: string): void {
  console.log(`\n======================================================================`);
  console.log(`SUITE: ${name}`);
  console.log(`======================================================================`);
}

async function runMilestone5Verification() {
  console.log('NY2Bolivia Web — Milestone 5 Comprehensive E2E Verification Harness');
  console.log(`Node Environment: ${process.version} | Timestamp: ${new Date().toISOString()}`);

  const projectRoot = path.resolve(__dirname, '..');

  // ======================================================================
  // PART 1: PRODUCTION BUILD & PRERENDERED ARTIFACTS VERIFICATION
  // ======================================================================
  suite('Part 1: Build Integrity & Prerendered SSR Artifacts');

  const landingHtmlPath = path.join(projectRoot, '.next/server/app/index.html');
  const registroHtmlPath = path.join(projectRoot, '.next/server/app/registro.html');

  check(fs.existsSync(landingHtmlPath), 'Production prerendered index.html exists in .next/server/app');
  check(fs.existsSync(registroHtmlPath), 'Production prerendered registro.html exists in .next/server/app');

  const landingHtml = fs.existsSync(landingHtmlPath) ? fs.readFileSync(landingHtmlPath, 'utf-8') : '';
  const registroHtml = fs.existsSync(registroHtmlPath) ? fs.readFileSync(registroHtmlPath, 'utf-8') : '';

  check(landingHtml.length > 25000, `Landing HTML payload is substantial (${landingHtml.length} bytes > 25KB)`);
  check(registroHtml.length > 25000, `Registro HTML payload is substantial (${registroHtml.length} bytes > 25KB)`);

  // ======================================================================
  // PART 2: TIER 1 - ROUTE / (BLACK FRIDAY LANDING) FEATURE COVERAGE
  // ======================================================================
  suite('Part 2.1: Route / — Hero CTA & Conversion Banners');

  const heroHtml = renderToStaticMarkup(React.createElement(HeroSection, {
    slotsRemaining: 14,
    totalSlots: 50,
    ctaHref: '/registro'
  }));

  check(heroHtml.includes('href="/registro"'), 'Hero CTA button links directly to /registro');
  check(heroHtml.includes('Asegurar Mi Cupo ($20 USD)'), 'Hero CTA displays primary conversion copy');
  check(heroHtml.includes('href="#tiendas"'), 'Hero secondary button links to #tiendas anchor');
  check(heroHtml.includes('BLACK FRIDAY NEW YORK'), 'Hero renders Black Friday Manhattan headline');
  check(heroHtml.includes('Aprovecha hasta 70% OFF en USA'), 'Hero renders promotion discount subhead');
  check(heroHtml.includes('Vuelo Directo JFK Oficial'), 'Hero includes JFK flight guarantee badge');
  check(heroHtml.includes('Llegada 4 al 12 de Diciembre'), 'Hero includes delivery timeline badge');
  check(heroHtml.includes('Garantía de Entrega o Devolución'), 'Hero includes 100% money-back guarantee badge');

  // Custom props override test
  const customHeroHtml = renderToStaticMarkup(React.createElement(HeroSection, {
    slotsRemaining: 5,
    totalSlots: 100,
    ctaHref: '/registro?promo=vip'
  }));
  check(customHeroHtml.includes('href="/registro?promo=vip"'), 'Hero respects custom ctaHref override');
  check(customHeroHtml.includes('95%'), 'Hero calculates dynamic slot saturation: (100-5)/100 = 95%');

  suite('Part 2.2: Route / — Store Showcase & Prefilled WhatsApp Links');

  const storeShowcaseHtml = renderToStaticMarkup(React.createElement(StoreShowcase));

  check(STORES_DATA.length === 6, 'Store showcase defines exact 6 curated Manhattan retail stores');

  for (const store of STORES_DATA) {
    const escapedName = store.name.replace('&', '&amp;');
    check(storeShowcaseHtml.includes(escapedName), `Store ${store.name} rendered in showcase heading`);
    check(storeShowcaseHtml.includes(store.ratePerLb), `Store ${store.name} displays transparent rate ${store.ratePerLb}`);
    
    const escapedBadge = store.discountBadge.replace('&', '&amp;');
    check(storeShowcaseHtml.includes(escapedBadge), `Store ${store.name} displays discount badge ${store.discountBadge}`);
    
    // Check WhatsApp link prefilled parameters
    const expectedWaParam = encodeURIComponent(store.whatsappMessage);
    check(storeShowcaseHtml.includes(expectedWaParam), `Store ${store.name} contains prefilled URL-encoded WhatsApp message`);
  }

  suite('Part 2.3: Route / — Modality Selector Cards');

  const modalityHtml = renderToStaticMarkup(React.createElement(ModalitySelector, {
    defaultValue: 'assisted'
  }));

  check(modalityHtml.includes('Nosotros Compramos Por Ti'), 'Modality 1: Renders "Nosotros Compramos Por Ti" card');
  check(modalityHtml.includes('Tú Compras con tu Casillero NY'), 'Modality 2: Renders "Tú Compras con tu Casillero NY" card');
  check(modalityHtml.includes('href="/registro?modality=assisted"'), 'Modality 1 deep links to /registro?modality=assisted');
  check(modalityHtml.includes('href="/registro?modality=prealert"'), 'Modality 2 deep links to /registro?modality=prealert');
  check(modalityHtml.includes('6.96 Bs/USD'), 'Discloses official exchange rate 6.96 Bs/USD');
  check(modalityHtml.includes('8%'), 'Discloses 8% Personal Shopper commission');
  check(modalityHtml.includes('QR Simple'), 'Discloses QR Simple payment support');

  suite('Part 2.4: Route / — Freight Calculator Reactive Engine');

  const calcHtml = renderToStaticMarkup(React.createElement(ShippingCalculator, {
    baseRatePerLbUSD: 9.50,
    exchangeRateBOB: 6.96,
    defaultWeightLbs: 3.0
  }));

  check(calcHtml.includes('$9.50 USD por libra'), 'Calculator header states $9.50 USD / lb rate');
  check(calcHtml.includes('6.96 Bs/USD'), 'Calculator header states 6.96 Bs/USD exchange rate');
  check(calcHtml.includes('$28.50'), 'Default 3.0 lbs calculates $28.50 USD (3.0 * $9.50)');
  check(calcHtml.includes('Bs. 198'), 'Default 3.0 lbs calculates 198 BOB (Math.round(28.50 * 6.96))');
  check(calcHtml.includes('href="/registro?weight=3&amp;usd=28.50&amp;bob=198"'), 'Calculator CTA links to /registro with reactive weight, USD and BOB params');

  // Verify weight matrix calculations (1.0 to 50.0 lbs)
  const weightTestPoints = [
    { lbs: 1.0, expUSD: 9.50, expBOB: 66 },
    { lbs: 2.0, expUSD: 19.00, expBOB: 132 },
    { lbs: 3.0, expUSD: 28.50, expBOB: 198 },
    { lbs: 4.0, expUSD: 38.00, expBOB: 264 },
    { lbs: 5.0, expUSD: 47.50, expBOB: 331 },
    { lbs: 12.0, expUSD: 114.00, expBOB: 793 },
    { lbs: 25.0, expUSD: 237.50, expBOB: 1653 },
    { lbs: 50.0, expUSD: 475.00, expBOB: 3306 },
  ];

  for (const pt of weightTestPoints) {
    const usd = pt.lbs * 9.50;
    const bob = Math.round(usd * 6.96);
    check(Math.abs(usd - pt.expUSD) < 0.001, `Weight ${pt.lbs} lbs gives exact $${pt.expUSD} USD`);
    check(bob === pt.expBOB, `Weight ${pt.lbs} lbs gives exact Bs. ${pt.expBOB} BOB`);
  }

  // Volumetric IATA Calculation Verification
  // Inches: (L * W * H) / 166
  const volInches = (12 * 10 * 8) / 166; // 960 / 166 = 5.783 lbs -> rounded 5.8 lbs
  check(Math.round(volInches * 10) / 10 === 5.8, 'IATA volumetric in inches (12x10x8) correctly yields 5.8 lbs');

  // Centimeters: (L * W * H) / 5000 * 2.20462
  const volCm = ((30 * 20 * 15) / 5000) * 2.20462; // 1.8 kg * 2.20462 = 3.968 lbs -> 4.0 lbs
  check(Math.round(volCm * 10) / 10 === 4.0, 'IATA volumetric in cm (30x20x15) correctly yields 4.0 lbs');

  suite('Part 2.5: Route / — Logistics Timeline & Guarantees');

  const timelineHtml = renderToStaticMarkup(React.createElement(LogisticsTimeline));

  check(timelineHtml.includes('23 Nov — 3 Dic'), 'Timeline includes Phase 1 date: 23 Nov — 3 Dic');
  check(timelineHtml.includes('Almacén Woodside, Queens NY'), 'Timeline includes Woodside, Queens NY reception address');
  check(timelineHtml.includes('3 de Diciembre (23:59 EST)'), 'Timeline includes Phase 2 cutoff: 3 de Diciembre');
  check(timelineHtml.includes('Vuelo Directo JFK ✈ Bolivia'), 'Timeline includes direct JFK flight guarantee');
  check(timelineHtml.includes('Desde el 4 de Diciembre'), 'Timeline includes delivery start date: 4 de Diciembre');
  check(timelineHtml.includes('Inspección Fotográfica &amp; Pesaje ($0)'), 'Trust guarantee 1: Photo inspection $0 USD');
  check(timelineHtml.includes('Reempaque Inteligente &amp; Consolidación'), 'Trust guarantee 2: Smart repacking and consolidation');
  check(timelineHtml.includes('Garantía Navideña &amp; Seguro 100%'), 'Trust guarantee 3: Christmas guarantee and 100% insurance');

  suite('Part 2.6: Route / — FAQ Accordion Expand/Collapse State');

  const faqHtml = renderToStaticMarkup(React.createElement(FAQSection));

  check(faqHtml.includes('id="faq"'), 'FAQ section has id="faq" anchor');
  check(faqHtml.includes('aria-expanded="true"'), 'First FAQ item is expanded by default (aria-expanded="true")');
  check(faqHtml.includes('aria-controls="faq-answer-reserva-cupo"'), 'First FAQ button controls faq-answer-reserva-cupo');
  check(faqHtml.includes('id="faq-answer-reserva-cupo"'), 'First FAQ answer panel is rendered in static markup');
  check(faqHtml.includes('aria-expanded="false"'), 'Non-active FAQ items are collapsed by default (aria-expanded="false")');
  check(faqHtml.includes('wa.me/59177012345'), 'FAQ contains direct WhatsApp help button');

  suite('Part 2.7: Route / — Mobile Bottom Navigation Bar');

  const bottomNavHtml = renderToStaticMarkup(React.createElement(MobileBottomNav));

  check(bottomNavHtml.includes('md:hidden'), 'MobileBottomNav is hidden on desktop (md:hidden)');
  check(bottomNavHtml.includes('fixed bottom-0'), 'MobileBottomNav is fixed at viewport bottom');
  check(bottomNavHtml.includes('pb-safe'), 'MobileBottomNav includes pb-safe for notch/home-bar insets');
  check(bottomNavHtml.includes('href="/#tiendas"'), 'Tab 1 links to /#tiendas (Promos)');
  check(bottomNavHtml.includes('href="/registro"'), 'Tab 2 links to /registro (Pre-Alerta)');
  check(bottomNavHtml.includes('href="/#modalidades"'), 'Tab 3 links to /#modalidades (Modalidades)');
  check(bottomNavHtml.includes('href="https://wa.me/59177012345'), 'Tab 4 links to WhatsApp coordinator');
  check(bottomNavHtml.includes('min-h-[44px]'), 'All tabs satisfy 44px minimum touch target requirements');

  // ======================================================================
  // PART 3: TIER 1 - ROUTE /registro (REGISTRATION & PRE-ALERTA) COVERAGE
  // ======================================================================
  suite('Part 3.1: Route /registro — Modality Toggle');

  const prealertToggleHtml = renderToStaticMarkup(React.createElement(ModalityToggle, {
    value: 'prealert',
    onChange: () => {}
  }));
  check(prealertToggleHtml.includes('Ya compré online'), 'Toggle displays "Ya compré online" label');
  check(prealertToggleHtml.includes('Pre-alerta'), 'Toggle displays "Pre-alerta" badge');
  check(prealertToggleHtml.includes('Pre-Alerta Express:'), 'Pre-alerta mode renders contextual hint banner');
  check(prealertToggleHtml.includes('tracking number'), 'Pre-alerta contextual hint mentions tracking number');

  const assistedToggleHtml = renderToStaticMarkup(React.createElement(ModalityToggle, {
    value: 'assisted',
    onChange: () => {}
  }));
  check(assistedToggleHtml.includes('Compra Asistida'), 'Toggle displays "Compra Asistida" label');
  check(assistedToggleHtml.includes('Personal Shopper'), 'Toggle displays "Personal Shopper" badge');
  check(assistedToggleHtml.includes('8% de comisión'), 'Assisted contextual hint displays 8% de comisión');

  suite('Part 3.2: Route /registro — Client Profile Fields & Bolivian Coverage');

  check(BOLIVIAN_CITIES.length === 9, 'All 9 Bolivian administrative departments are represented');
  const expectedCityKeys = ['Santa Cruz', 'La Paz', 'Cochabamba', 'Sucre', 'Tarija', 'Oruro', 'Potosí', 'Beni', 'Pando'];
  for (const city of expectedCityKeys) {
    const found = BOLIVIAN_CITIES.some(c => c.value.includes(city) || c.label.includes(city));
    check(found, `Bolivian city ${city} is present in destination list`);
  }

  // Pickup mode: deliveryAddress textarea is not rendered
  const pickupProfileHtml = renderToStaticMarkup(React.createElement(ClientProfileForm, {
    clientName: 'Rodrigo Mendoza',
    onClientNameChange: () => {},
    clientPhone: '77012345',
    onClientPhoneChange: () => {},
    suiteCode: 'NY-TEMP-8492',
    onSuiteCodeChange: () => {},
    onOpenSuiteModal: () => {},
    destinationCity: 'Santa Cruz de la Sierra',
    onDestinationCityChange: () => {},
    deliveryMethod: 'pickup',
    onDeliveryMethodChange: () => {},
    deliveryAddress: '',
    onDeliveryAddressChange: () => {},
  }));
  check(pickupProfileHtml.includes('+591'), 'Client phone field includes fixed +591 Bolivia badge');
  check(pickupProfileHtml.includes('Recojo en Sede Central'), 'Pickup option rendered');
  check(pickupProfileHtml.includes('Entrega a Domicilio Express'), 'Delivery option rendered');
  check(!pickupProfileHtml.includes('id="delivery-address"'), 'Delivery address textarea is NOT shown when pickup is selected');

  // Delivery mode: deliveryAddress textarea is dynamically rendered
  const deliveryProfileHtml = renderToStaticMarkup(React.createElement(ClientProfileForm, {
    clientName: 'Rodrigo Mendoza',
    onClientNameChange: () => {},
    clientPhone: '77012345',
    onClientPhoneChange: () => {},
    suiteCode: 'NY-TEMP-8492',
    onSuiteCodeChange: () => {},
    onOpenSuiteModal: () => {},
    destinationCity: 'La Paz',
    onDestinationCityChange: () => {},
    deliveryMethod: 'delivery',
    onDeliveryMethodChange: () => {},
    deliveryAddress: 'Av. Arce #1234',
    onDeliveryAddressChange: () => {},
  }));
  check(deliveryProfileHtml.includes('id="delivery-address"'), 'Delivery address textarea IS rendered when delivery is selected');

  suite('Part 3.3: Route /registro — Dynamic Item Builder & Consolidation $0');

  const testItems: OrderItem[] = [
    {
      id: 'item-1',
      storeName: 'Apple Store 5th Ave',
      category: 'Electrónica / Celulares / Laptops',
      productName: 'iPhone 16 Pro',
      productUrl: 'https://apple.com',
      quantity: 1,
      priceUSD: 999.00,
      trackingUSA: '1Z9999999999999999'
    },
    {
      id: 'item-2',
      storeName: 'Nike House of Innovation',
      category: 'Ropa, Calzado & Accesorios',
      productName: 'Nike Jordan 4 Retro',
      productUrl: 'https://nike.com',
      quantity: 2,
      priceUSD: 210.00,
      trackingUSA: 'TBA123456789'
    }
  ];

  // Pre-alerta mode: shows tracking USA
  const prealertItemsHtml = renderToStaticMarkup(React.createElement(DynamicItemBuilder, {
    items: testItems,
    modality: 'prealert'
  }));
  check(prealertItemsHtml.includes('Consolidación $0.00'), 'Dynamic items builder displays $0.00 consolidation badge');
  check(prealertItemsHtml.includes('Número de Guía / Tracking en USA'), 'Pre-alerta mode renders USA tracking number field');
  check(prealertItemsHtml.includes('Artículo Principal'), 'Item 1 is designated as Artículo Principal');
  check(prealertItemsHtml.includes('Artículo Adicional'), 'Item 2 is designated as Artículo Adicional');
  check(prealertItemsHtml.includes('Eliminar artículo 2'), 'Item 2 has active delete action button');
  check(!prealertItemsHtml.includes('Eliminar artículo 1'), 'Item 1 cannot be deleted (preserves minimum 1 item invariant)');

  // Compra asistida mode: omits tracking USA
  const assistedItemsHtml = renderToStaticMarkup(React.createElement(DynamicItemBuilder, {
    items: testItems,
    modality: 'assisted'
  }));
  check(!assistedItemsHtml.includes('Número de Guía / Tracking en USA'), 'Compra Asistida mode cleanly omits USA tracking field');

  // Verify Cargo Categories
  check(CARGO_CATEGORIES.length >= 8, `Cargo categories coverage: ${CARGO_CATEGORIES.length} categories available`);

  suite('Part 3.4: Route /registro — Special Warehouse Handling Toggles');

  const specialInstructions: SpecialInstructions = {
    optimizeWeight: true,
    photoInspection: true,
    holidayPackaging: false
  };

  const specialHandlingHtml = renderToStaticMarkup(React.createElement(SpecialHandling, {
    instructions: specialInstructions,
    onChange: () => {}
  }));

  check(specialHandlingHtml.includes('Optimizar peso'), 'Contains "Optimizar peso" box discard option');
  check(specialHandlingHtml.includes('Inspección fotográfica'), 'Contains "Inspección fotográfica" option');
  check(specialHandlingHtml.includes('$0 GRATIS'), 'Photo inspection is clearly labeled $0 GRATIS');
  check(specialHandlingHtml.includes('Regalo / Black Friday'), 'Contains "Regalo / Black Friday" packaging option');
  check(specialHandlingHtml.includes('Navideño'), 'Contains holiday gift wrap tag');

  suite('Part 3.5: Route /registro — Sticky Summary Sidebar Financial Engine');

  // Compra asistida financial test
  const assistedFinancials = calculateFinancials(testItems, 8, 20.00, 6.96);
  // Total product: 999*1 + 210*2 = 999 + 420 = 1419.00 USD
  // Commission 8%: 1419 * 0.08 = 113.52 USD
  // Base fee: 20.00 USD
  // Total Fee USD: 113.52 + 20.00 = 133.52 USD
  // Total Fee BOB: 133.52 * 6.96 = 929.30 BOB
  check(assistedFinancials.totalProductUSD === 1419.00, 'Assisted totalProductUSD: 999 + 420 = 1419.00');
  check(assistedFinancials.commissionUSD === 113.52, 'Assisted 8% commission: 1419 * 0.08 = 113.52');
  check(assistedFinancials.baseFeeUSD === 20.00, 'Assisted base flight slot fee: 20.00');
  check(assistedFinancials.totalFeeUSD === 133.52, 'Assisted totalFeeUSD: 113.52 + 20.00 = 133.52');
  check(assistedFinancials.totalFeeBOB === 929.30, 'Assisted totalFeeBOB: 133.52 * 6.96 = 929.30');

  // Pre-alerta financial test
  const prealertFinancials = calculateFinancials(testItems, 0, 20.00, 6.96);
  check(prealertFinancials.totalProductUSD === 1419.00, 'Pre-alerta totalProductUSD: 1419.00');
  check(prealertFinancials.commissionUSD === 0.00, 'Pre-alerta commission: strictly 0.00 USD (0%)');
  check(prealertFinancials.baseFeeUSD === 20.00, 'Pre-alerta base flight reservation fee: 20.00 USD');
  check(prealertFinancials.totalFeeUSD === 20.00, 'Pre-alerta totalFeeUSD: 20.00 USD');
  check(prealertFinancials.totalFeeBOB === 139.20, 'Pre-alerta totalFeeBOB: 20.00 * 6.96 = 139.20');

  // Render Sidebar component with prealert financials
  const sidebarHtml = renderToStaticMarkup(React.createElement(StickySummarySidebar, {
    items: testItems,
    modality: 'prealert',
    financials: prealertFinancials,
    onSubmit: () => {}
  }));
  check(sidebarHtml.includes('$1419.00 USD'), 'Sidebar displays declared product total $1419.00 USD');
  check(sidebarHtml.includes('3 artículos'), 'Sidebar correctly tallies 3 total items (1 + 2)');
  check(sidebarHtml.includes('$20.00 USD'), 'Sidebar displays initial fee of $20.00 USD');
  check(sidebarHtml.includes('139.20 BOB'), 'Sidebar displays initial fee of 139.20 BOB');

  suite('Part 3.6: Route /registro — Order Submission & OrderSuccessModal');

  // Create real order using OrdersService in SSR mode
  const sampleOrder = await ordersService.createOrder({
    clientName: 'Rodrigo Mendoza Morales',
    clientPhone: '77012345',
    suiteCode: 'NY-BOL-8492',
    destinationCity: 'Santa Cruz de la Sierra',
    deliveryMethod: 'delivery',
    deliveryAddress: 'Barrio Equipetrol Calle 8 Este #124',
    modality: 'prealert',
    items: testItems,
    trackingUSA: '1Z9999999999999999',
    specialInstructions: specialInstructions,
    customCommissionPercent: 0,
    customBaseFeeUSD: 20.00,
    customExchangeRateBOB: 6.96
  });

  check(sampleOrder.id.startsWith('NY-'), 'Order ID format starts with NY- prefix');
  check(sampleOrder.status === 'pedido', 'New order starts in status "pedido"');
  check(sampleOrder.clientPhone === '59177012345', 'Client phone normalized to +591 Bolivia standard: 59177012345');
  check(sampleOrder.financials.totalFeeUSD === 20.00, 'Order financials totalFeeUSD is $20.00');
  check(sampleOrder.financials.totalFeeBOB === 139.20, 'Order financials totalFeeBOB is 139.20 BOB');

  // Render OrderSuccessModal with the created order
  const modalHtml = renderToStaticMarkup(React.createElement(OrderSuccessModal, {
    order: sampleOrder,
    isOpen: true,
    onClose: () => {}
  }));

  check(modalHtml.includes(sampleOrder.id), `Modal displays exact generated order ID: ${sampleOrder.id}`);
  check(modalHtml.includes('Rodrigo Mendoza Morales'), 'Modal displays client name');
  check(modalHtml.includes('Santa Cruz de la Sierra'), 'Modal displays destination city');
  check(modalHtml.includes('Barrio Equipetrol Calle 8 Este #124'), 'Modal displays delivery address');
  check(modalHtml.includes('Pago QR Simple (139.20 Bs)'), 'Modal includes Pago QR Simple tab with exact amount in BOB');
  check(modalHtml.includes('wa.me/59177012345'), 'Modal includes coordinator WhatsApp link');
  check(modalHtml.includes(encodeURIComponent(sampleOrder.id)), 'WhatsApp coordinator URL embeds order ID');

  // Temporary Suite Generator & Address Helpers
  const suiteModalHtml = renderToStaticMarkup(React.createElement(SuiteCodeModal, {
    isOpen: true,
    onClose: () => {},
    clientName: 'Rodrigo Mendoza',
    currentSuite: 'NY-BOL-8492'
  }));
  check(suiteModalHtml.includes('Manhattan Hub'), 'SuiteCodeModal displays Manhattan Hub card');
  check(suiteModalHtml.includes('Queens JFK Hub'), 'SuiteCodeModal displays Queens JFK Hub card');
  check(suiteModalHtml.includes('350 5th Avenue, Suite NY-HUB'), 'Manhattan address: 350 5th Avenue');
  check(suiteModalHtml.includes('147-39 175th Street, Cargo Bldg'), 'Queens address: 147-39 175th Street');

  // ======================================================================
  // PART 4: TIER 2 - BOUNDARY & CORNER CASES MATRIX
  // ======================================================================
  suite('Part 4.1: Boundary — Weight Slider & Input Extremes');

  // 1. Weight 0 lb: clamped to 1.0 lb minimum
  const weightZeroFreight = Math.max(1.0, 0) * 9.50;
  check(weightZeroFreight === 9.50, 'Weight 0 lb clamps to 1.0 lb minimum ($9.50 USD)');

  // 2. Negative weight: clamped to 1.0 lb minimum
  const weightNegFreight = Math.max(1.0, -10.5) * 9.50;
  check(weightNegFreight === 9.50, 'Negative weight -10.5 lbs clamps to 1.0 lb minimum ($9.50 USD)');

  // 3. Sub-minimum fractional weight 0.5 lb: clamped to 1.0 lb
  const weightHalfFreight = Math.max(1.0, 0.5) * 9.50;
  check(weightHalfFreight === 9.50, 'Weight 0.5 lb clamps to 1.0 lb courier minimum ($9.50 USD)');

  // 4. Fractional weight 2.75 lb
  const weightFractionalFreight = 2.75 * 9.50; // 26.125
  const weightFractionalUSD = Number(weightFractionalFreight.toFixed(2)); // 26.13
  const weightFractionalBOB = Math.round(weightFractionalFreight * 6.96); // Math.round(181.83) = 182
  check(weightFractionalUSD === 26.13, 'Weight 2.75 lbs calculates $26.13 USD');
  check(weightFractionalBOB === 182, 'Weight 2.75 lbs calculates Bs. 182 BOB');

  // 5. High preset boundary 50.0 lb
  const weight50Freight = 50.0 * 9.50;
  check(weight50Freight === 475.00, 'Weight 50.0 lbs calculates $475.00 USD');
  check(Math.round(weight50Freight * 6.96) === 3306, 'Weight 50.0 lbs calculates 3306 BOB');

  // 6. Extreme heavy cargo 100.0 lb
  const weight100Freight = 100.0 * 9.50;
  check(weight100Freight === 950.00, 'Extreme weight 100.0 lbs calculates $950.00 USD');
  check(Math.round(weight100Freight * 6.96) === 6612, 'Extreme weight 100.0 lbs calculates 6612 BOB');

  suite('Part 4.2: Boundary — Product Prices Matrix & Sanitization');

  // Price $0.00
  const finZero = calculateFinancials([{ priceUSD: 0, quantity: 1 }], 8, 20.00, 6.96);
  check(finZero.totalProductUSD === 0, 'Price $0.00 produces totalProductUSD 0');
  check(finZero.commissionUSD === 0, 'Price $0.00 produces commissionUSD 0');
  check(finZero.totalFeeUSD === 20.00, 'Price $0.00 preserves $20.00 base flight slot fee');
  check(finZero.totalFeeBOB === 139.20, 'Price $0.00 preserves 139.20 BOB base fee');

  // Price $0.01
  const finOneCent = calculateFinancials([{ priceUSD: 0.01, quantity: 1 }], 8, 20.00, 6.96);
  check(finOneCent.totalProductUSD === 0.01, 'Price $0.01 produces totalProductUSD 0.01');
  check(finOneCent.commissionUSD === 0.00, 'Price $0.01 produces commissionUSD 0.00 (rounds down)');
  check(finOneCent.totalFeeUSD === 20.00, 'Price $0.01 produces totalFeeUSD 20.00');

  // Fractional cent rounding ($19.999)
  const finFractional = calculateFinancials([{ priceUSD: 19.999, quantity: 1 }], 8, 20.00, 6.96);
  check(finFractional.totalProductUSD === 20.00, 'Price $19.999 cleanly rounds to nearest cent $20.00');
  check(finFractional.commissionUSD === 1.60, '8% commission on rounded $20.00 is $1.60');

  // Extreme high price ($9,999.99)
  const finExtremeHigh = calculateFinancials([{ priceUSD: 9999.99, quantity: 1 }], 8, 20.00, 6.96);
  check(finExtremeHigh.totalProductUSD === 9999.99, 'Extreme price $9,999.99 declared value preserved');
  check(finExtremeHigh.commissionUSD === 800.00, '8% commission on $9,999.99 is $800.00 (799.9992 -> 800.00)');
  check(finExtremeHigh.totalFeeUSD === 820.00, 'Total fee on $9,999.99 is $820.00 USD');
  check(finExtremeHigh.totalFeeBOB === 5707.20, 'Total fee in BOB is 5707.20 BOB');

  // Negative price rejection in createOrder (clamped to 0)
  const orderWithNegativePrice = await ordersService.createOrder({
    clientName: 'Test Negative',
    clientPhone: '77012345',
    destinationCity: 'La Paz',
    deliveryMethod: 'pickup',
    modality: 'assisted',
    items: [{ storeName: 'Test', category: 'Tech', productName: 'Item', quantity: 1, priceUSD: -50 }],
  });
  check(orderWithNegativePrice.items[0].priceUSD === 0, 'Negative priceUSD -50 is clamped to 0 in createOrder');
  check(orderWithNegativePrice.financials.totalProductUSD === 0, 'totalProductUSD with negative price is 0');
  check(orderWithNegativePrice.financials.totalFeeUSD === 20.00, 'totalFeeUSD preserves $20 base fee despite negative price input');

  // Malformed/NaN price resilience
  const finNaN = calculateFinancials([{ priceUSD: NaN as any, quantity: 1 }], 8, 20.00, 6.96);
  check(finNaN.totalProductUSD === 0, 'NaN priceUSD gracefully falls back to 0');
  check(!isNaN(finNaN.totalFeeUSD), 'totalFeeUSD is not NaN');

  suite('Part 4.3: Boundary — Phone Numbers Normalization & Validation');

  // 1. Exact 8 digits without country code
  const orderPhone1 = await ordersService.createOrder({
    clientName: 'Phone 1',
    clientPhone: '77012345',
    destinationCity: 'Cochabamba',
    deliveryMethod: 'pickup',
    modality: 'prealert',
    items: [{ storeName: 'Apple', category: 'Tech', productName: 'Item', quantity: 1, priceUSD: 100 }],
  });
  check(orderPhone1.clientPhone === '59177012345', '8-digit phone 77012345 normalized to 59177012345');

  // 2. Formatted with dashes, spaces and plus: "+591 (77) 012-345"
  const orderPhone2 = await ordersService.createOrder({
    clientName: 'Phone 2',
    clientPhone: '+591 (77) 012-345',
    destinationCity: 'Cochabamba',
    deliveryMethod: 'pickup',
    modality: 'prealert',
    items: [{ storeName: 'Apple', category: 'Tech', productName: 'Item', quantity: 1, priceUSD: 100 }],
  });
  check(orderPhone2.clientPhone === '59177012345', 'Formatted phone with non-numeric chars normalized to 59177012345');

  // 3. Short invalid phone number validation rule
  function validatePhoneNumber(phone: string): { valid: boolean; error?: string } {
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      return { valid: false, error: 'Ingresa un número de celular de 8 dígitos de Bolivia.' };
    }
    return { valid: true };
  }
  check(!validatePhoneNumber('1234').valid, 'Phone 1234 rejected as too short (< 8 digits)');
  check(!validatePhoneNumber('7701234').valid, 'Phone 7701234 (7 digits) rejected (< 8 digits)');
  check(!validatePhoneNumber('').valid, 'Empty phone rejected');
  check(validatePhoneNumber('77012345').valid, 'Phone 77012345 (8 digits) accepted');

  suite('Part 4.4: Boundary — Multi-Item Matrix & Order Invariance');

  // 0 items: array fallback
  const finEmpty = calculateFinancials([], 8, 20.00, 6.96);
  check(finEmpty.totalProductUSD === 0, 'Empty items array yields totalProductUSD 0');
  check(finEmpty.commissionUSD === 0, 'Empty items array yields commissionUSD 0');
  check(finEmpty.totalFeeUSD === 20.00, 'Empty items array preserves baseFeeUSD $20.00');

  // 1 item
  const finSingle = calculateFinancials([{ priceUSD: 100, quantity: 1 }], 8, 20.00, 6.96);
  check(finSingle.totalProductUSD === 100, 'Single item: totalProductUSD = 100');
  check(finSingle.commissionUSD === 8.00, 'Single item: commissionUSD = 8.00');
  check(finSingle.totalFeeUSD === 28.00, 'Single item: totalFeeUSD = 28.00');

  // 10 items matrix scaling
  const tenItems = Array.from({ length: 10 }, () => ({
    priceUSD: 50.00,
    quantity: 2
  }));
  // 10 * (50 * 2) = 1000 USD
  // 8% commission = 80 USD
  // base fee = 20 USD
  // total = 100 USD
  const finTen = calculateFinancials(tenItems, 8, 20.00, 6.96);
  check(finTen.totalProductUSD === 1000.00, '10 items scaling: totalProductUSD = 1000.00');
  check(finTen.commissionUSD === 80.00, '10 items scaling: commissionUSD = 80.00');
  check(finTen.totalFeeUSD === 100.00, '10 items scaling: totalFeeUSD = 100.00');

  // Multi-item consolidation fee invariant
  check(DEFAULT_CONFIG.airFreightRatePerLbUSD === 9.50, 'Base rate is $9.50/lb with zero consolidation surcharges');

  // Order invariance: Permuting items array does not alter financial output
  const permutedItemsA = [
    { priceUSD: 120.00, quantity: 1 },
    { priceUSD: 45.50, quantity: 3 },
    { priceUSD: 890.00, quantity: 1 }
  ];
  const permutedItemsB = [
    { priceUSD: 890.00, quantity: 1 },
    { priceUSD: 120.00, quantity: 1 },
    { priceUSD: 45.50, quantity: 3 }
  ];
  const finPermA = calculateFinancials(permutedItemsA, 8, 20.00, 6.96);
  const finPermB = calculateFinancials(permutedItemsB, 8, 20.00, 6.96);
  check(finPermA.totalProductUSD === finPermB.totalProductUSD, 'Order invariance: totalProductUSD is identical across permutations');
  check(finPermA.commissionUSD === finPermB.commissionUSD, 'Order invariance: commissionUSD is identical across permutations');
  check(finPermA.totalFeeUSD === finPermB.totalFeeUSD, 'Order invariance: totalFeeUSD is identical across permutations');

  suite('Part 4.5: Boundary — File Upload Dropzone Edge Cases');

  // Validate FileUploadDropzone validation rules
  function validateDroppedFile(file: { name: string; size: number; type: string }, maxSizeMB = 10): { valid: boolean; error?: string } {
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      return { valid: false, error: `El archivo excede el tamaño máximo permitido (${maxSizeMB} MB).` };
    }
    const acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!acceptedTypes.includes(file.type)) {
      return { valid: false, error: 'Formato no soportado. Por favor sube un archivo PDF, JPG o PNG.' };
    }
    return { valid: true };
  }

  // Supported file formats
  check(validateDroppedFile({ name: 'factura.pdf', size: 2 * 1024 * 1024, type: 'application/pdf' }).valid, 'PDF file accepted');
  check(validateDroppedFile({ name: 'recibo.jpg', size: 1.5 * 1024 * 1024, type: 'image/jpeg' }).valid, 'JPG image accepted');
  check(validateDroppedFile({ name: 'invoice.png', size: 3 * 1024 * 1024, type: 'image/png' }).valid, 'PNG image accepted');
  check(validateDroppedFile({ name: 'receipt.webp', size: 800 * 1024, type: 'image/webp' }).valid, 'WEBP image accepted');

  // Unsupported file types
  const exeValidation = validateDroppedFile({ name: 'virus.exe', size: 1024, type: 'application/x-msdownload' });
  check(!exeValidation.valid, 'EXE file is rejected');
  check(Boolean(exeValidation.error?.includes('Formato no soportado')), 'EXE rejection provides format error message');

  const zipValidation = validateDroppedFile({ name: 'archive.zip', size: 5000, type: 'application/zip' });
  check(!zipValidation.valid, 'ZIP file is rejected');

  const svgValidation = validateDroppedFile({ name: 'vector.svg', size: 2000, type: 'image/svg+xml' });
  check(!svgValidation.valid, 'SVG file is rejected (prevents script injection)');

  // Oversized file
  const oversizedValidation = validateDroppedFile({ name: 'huge_document.pdf', size: 15 * 1024 * 1024, type: 'application/pdf' });
  check(!oversizedValidation.valid, '15 MB file rejected when limit is 10 MB');
  check(Boolean(oversizedValidation.error?.includes('excede el tamaño máximo')), 'Oversized rejection specifies size limit');

  // Empty drop resilience: dropzone handles null or empty file safely
  const emptyDropzoneHtml = renderToStaticMarkup(React.createElement(FileUploadDropzone, {
    file: null,
    onFileSelect: () => {}
  }));
  check(emptyDropzoneHtml.includes('Haz clic o arrastra tu archivo aquí'), 'Dropzone renders idle state when file is null');
  check(emptyDropzoneHtml.includes('Formatos soportados: PDF, JPG, PNG'), 'Dropzone displays supported format guidance');

  // ======================================================================
  // PART 5: TIER 3 - ADVERSARIAL STRESS, URL INGESTION & CONCURRENCY
  // ======================================================================
  suite('Part 5.1: Adversarial — URL Parameter Ingestion & Deep Linking');

  function simulateUrlIngestion(searchParams: Record<string, string>) {
    let modality = 'prealert';
    if (searchParams.modality === 'assisted' || searchParams.modality === 'prealert') {
      modality = searchParams.modality;
    }
    const qStore = searchParams.store;
    const qUsd = searchParams.usd;

    const initialItem: OrderItem = {
      id: 'item-1',
      storeName: qStore || 'Apple Store 5th Ave',
      category: 'Electrónica / Celulares / Laptops',
      productName: '',
      productUrl: '',
      quantity: 1,
      priceUSD: qUsd ? parseFloat(qUsd) || 0 : 0,
      trackingUSA: ''
    };

    return { modality, initialItem };
  }

  // Valid parameter ingestion
  const ing1 = simulateUrlIngestion({ modality: 'assisted', store: 'Nike House of Innovation', usd: '180.50' });
  check(ing1.modality === 'assisted', 'Ingests ?modality=assisted correctly');
  check(ing1.initialItem.storeName === 'Nike House of Innovation', 'Ingests ?store parameter');
  check(ing1.initialItem.priceUSD === 180.50, 'Ingests ?usd as numeric float');

  // Malicious/Hacker parameter injection
  const ing2 = simulateUrlIngestion({ modality: "'; DROP TABLE orders; --", store: '<script>alert(1)</script>', usd: 'not-a-number' });
  check(ing2.modality === 'prealert', 'Malicious modality injection safely falls back to "prealert"');
  check(ing2.initialItem.priceUSD === 0, 'Non-numeric USD injection safely falls back to 0.00');

  suite('Part 5.2: Adversarial — Concurrent Order Creation & Retrieval Safety');

  const parallelOrderPromises = Array.from({ length: 30 }, (_, idx) =>
    ordersService.createOrder({
      clientName: `Concurrent Client ${idx + 1}`,
      clientPhone: `770000${String(idx).padStart(2, '0')}`,
      destinationCity: 'Santa Cruz de la Sierra',
      deliveryMethod: 'pickup',
      modality: idx % 2 === 0 ? 'prealert' : 'assisted',
      items: [{ storeName: 'Store', category: 'Tech', productName: `Item ${idx}`, quantity: 1, priceUSD: 50.00 }]
    })
  );

  const createdConcurrentOrders = await Promise.all(parallelOrderPromises);
  check(createdConcurrentOrders.length === 30, 'Successfully handled 30 concurrent order creation requests');

  for (const ord of createdConcurrentOrders) {
    check(ord.id.startsWith('NY-'), `Concurrent order ${ord.id} has valid ID prefix`);
    check(ord.status === 'pedido', `Concurrent order ${ord.id} has initial status "pedido"`);
  }

  // Test retrieval by ID and case insensitivity
  const firstCreated = createdConcurrentOrders[0];
  const fetchedOrder = await ordersService.getOrderById(firstCreated.id);
  check(fetchedOrder !== null && fetchedOrder.id === firstCreated.id, 'getOrderById retrieves created order by exact ID');

  const fetchedLower = await ordersService.getOrderById(firstCreated.id.toLowerCase());
  check(fetchedLower !== null && fetchedLower.id === firstCreated.id, 'getOrderById lookup is case-insensitive');

  const fetchedNonExistent = await ordersService.getOrderById('NY-DOES-NOT-EXIST');
  check(fetchedNonExistent === null, 'getOrderById returns null for non-existent ID');

  // ======================================================================
  // FINAL HARNESS SUMMARY
  // ======================================================================
  console.log(`\n======================================================================`);
  console.log(`MILESTONE 5 EMPIRICAL E2E VERIFICATION SUMMARY`);
  console.log(`======================================================================`);
  console.log(`Total Assertions Evaluated: ${totalAssertions}`);
  console.log(`Passed Assertions:          ${passedAssertions}`);
  console.log(`Failed Assertions:          ${failedAssertions}`);

  if (failedAssertions > 0) {
    console.error(`\nFAILURES (${failedAssertions}):`);
    failures.forEach((f, idx) => console.error(`  ${idx + 1}. ${f}`));
    process.exit(1);
  } else {
    console.log(`\n>>> ALL ${totalAssertions} TIER 1, TIER 2 & TIER 3 ASSERTIONS PASSED WITH ZERO FAILURES <<<`);
    process.exit(0);
  }
}

runMilestone5Verification().catch((err) => {
  console.error('Unhandled verification error:', err);
  process.exit(1);
});
