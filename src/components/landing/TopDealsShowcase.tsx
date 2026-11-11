'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@/components/ui/Icon';

export interface DealItem {
  id: string;
  store: string;
  brand: string;
  isAmericanBrand: boolean;
  title: string;
  category: 'Moda' | 'Lifestyle' | 'Belleza' | 'Tech' | 'Gaming';
  image: string;
  originalPrice: number;
  dealPrice: number;
  savings: number;
  discountPercent: number;
  bfScore: number; // Puntaje de 0 a 10 como Verdadera Oferta Black Friday
  bfVerificationNote: string;
  ecommerceDates: string; // Fechas clave de compra en eCommerce de USA
  ecommercePhase: 'Early Black Friday' | 'Thanksgiving Drop' | 'Black Friday Oficial' | 'Cyber Monday';
  taxNote: string;
  tag: string;
  christmasTag: string;
  highlights: string;
  buyUrl: string;
}

// Catálogo ordenado estratégicamente:
// 1. Marcas Americanas con los mayores descuentos arriba (77%, 75%, 72%, 70%, 65%, 62%, 56%, 54%...)
// 2. Gran selección de Chollos Menores a $50 USD ideales para regalos navideños
// 3. Electrónicos agrupados al final de la lista según requerimiento
export const TOP_DEALS: DealItem[] = [
  // 1. COACH (Top 1 Ahorro & Descuento - 77% OFF)
  {
    id: 'coach-city-tote',
    store: 'Coach Outlet Woodbury NY',
    brand: 'Coach',
    isAmericanBrand: true,
    title: 'Cartera City Tote Signature Canvas',
    category: 'Moda',
    image: '/images/deals/coach-tote.jpg',
    originalPrice: 398,
    dealPrice: 89,
    savings: 309,
    discountPercent: 77,
    bfScore: 10,
    bfVerificationNote: 'Mínimo histórico anual comprobado en Woodbury Common Outlets',
    ecommerceDates: 'Apertura Online: 20 Nov - 2 Dic',
    ecommercePhase: 'Early Black Friday',
    taxNote: '0% Sales Tax en NYC (menos de $110)',
    tag: '77% OFF',
    christmasTag: '👜 Lujo Navideño',
    highlights: 'Cuero genuino y lona estampada emblemática con espacio generoso para oficina o viajes.',
    buyUrl: 'https://www.coachoutlet.com/products/city-tote-in-signature-canvas/5696.html',
  },

  // 2. MICHAEL KORS (Top 2 Ahorro - 75% OFF)
  {
    id: 'michael-kors-tote',
    store: "Macy's / MK Outlet NYC",
    brand: 'Michael Kors',
    isAmericanBrand: true,
    title: 'Bolso Jet Set Travel Large Saffiano Leather',
    category: 'Moda',
    image: '/images/deals/michael-kors-tote.jpg',
    originalPrice: 358,
    dealPrice: 89,
    savings: 269,
    discountPercent: 75,
    bfScore: 9.9,
    bfVerificationNote: 'Liquidación oficial Black Friday en tiendas de Manhattan',
    ecommerceDates: 'Web Drop: 23 Nov - 1 Dic',
    ecommercePhase: 'Black Friday Oficial',
    taxNote: '0% Sales Tax en NYC (menos de $110)',
    tag: '75% OFF',
    christmasTag: '✨ Elegancia Manhattan',
    highlights: 'Cuero Saffiano de alta resistencia con herrajes dorados y cierre superior completo.',
    buyUrl: 'https://www.michaelkors.com/sale',
  },

  // 3. COACH OUTLET - BILLETERA CORNER ZIP (< $50 USD - 72% OFF)
  {
    id: 'coach-wristlet',
    store: 'Coach Outlet Woodbury NY',
    brand: 'Coach',
    isAmericanBrand: true,
    title: 'Billetera de Muñeca Corner Zip Signature Canvas',
    category: 'Moda',
    image: '/images/deals/coach-wristlet.jpg',
    originalPrice: 88,
    dealPrice: 25.0,
    savings: 63,
    discountPercent: 72,
    bfScore: 9.9,
    bfVerificationNote: '72% OFF liquidación de carteras en Woodbury Outlets',
    ecommerceDates: 'Apertura Online: 20 Nov - 2 Dic',
    ecommercePhase: 'Early Black Friday',
    taxNote: '0% Sales Tax en NYC (menos de $110)',
    tag: '72% OFF',
    christmasTag: '🎁 El Regalo #1 de Coach',
    highlights: 'Cuero refinado y lona monograma emblemática con correa de muñeca y 2 ranuras para tarjetas.',
    buyUrl: 'https://www.coachoutlet.com/shop/black-friday-deals',
  },

  // 4. MICHAEL KORS - TARJETERO / BILLETERA SAFFIANO (< $50 USD - 70% OFF)
  {
    id: 'michael-kors-wallet',
    store: "Macy's / MK Outlet NYC",
    brand: 'Michael Kors',
    isAmericanBrand: true,
    title: 'Billetera y Tarjetero Jet Set Small Saffiano Leather',
    category: 'Moda',
    image: '/images/deals/michael-kors-wallet.jpg',
    originalPrice: 98,
    dealPrice: 29.0,
    savings: 69,
    discountPercent: 70,
    bfScore: 9.8,
    bfVerificationNote: '70% OFF en racks especiales de Black Friday Manhattan',
    ecommerceDates: 'Web Drop: 23 Nov - 1 Dic',
    ecommercePhase: 'Black Friday Oficial',
    taxNote: '0% Sales Tax en NYC (menos de $110)',
    tag: '70% OFF',
    christmasTag: '✨ Billetera de Lujo',
    highlights: 'Cuero Saffiano premium con logo metálico dorado, compartimento de monedas y tarjetas.',
    buyUrl: 'https://www.michaelkors.com/sale',
  },

  // 5. TOMMY HILFIGER PUFFER (65% OFF)
  {
    id: 'tommy-puffer',
    store: "Macy's Herald Sq",
    brand: 'Tommy Hilfiger',
    isAmericanBrand: true,
    title: 'Puffer Jacket Térmica de Invierno Clásica',
    category: 'Moda',
    image: '/images/deals/tommy-jacket.jpg',
    originalPrice: 225,
    dealPrice: 79,
    savings: 146,
    discountPercent: 65,
    bfScore: 9.8,
    bfVerificationNote: "Doorbuster #1 de Macy's Herald Sq con 0% Sales Tax",
    ecommerceDates: 'Acceso Online: 23 Nov - 30 Nov',
    ecommercePhase: 'Early Black Friday',
    taxNote: '0% Sales Tax en NYC (menos de $110)',
    tag: '65% OFF',
    christmasTag: '❄️ Invierno Manhattan',
    highlights: 'Aislamiento ultra liviano resistente al agua con diseño clásico neoyorquino y logo en pecho.',
    buyUrl: 'https://www.macys.com/shop/mens-clothing/mens-jackets-coats/Brand/Tommy%20Hilfiger?id=3763',
  },

  // 5B. GUESS - PERFUME SEDUCTIVE HOMME / NOIR 100ML (< $50 USD - 65% OFF)
  {
    id: 'guess-perfume',
    store: "Macy's Herald Sq / Perfumania NY",
    brand: 'Guess',
    isAmericanBrand: true,
    title: 'Perfume Guess Seductive Homme / Noir EDT 100ml Spray',
    category: 'Belleza',
    image: '/images/deals/guess-perfume.jpg',
    originalPrice: 72.0,
    dealPrice: 24.99,
    savings: 47.01,
    discountPercent: 65,
    bfScore: 9.7,
    bfVerificationNote: 'Rebaja histórica del 65% en fragancias para regalo de fin de año en perfumerías de Manhattan',
    ecommerceDates: 'Oferta Online: 24 Nov - 2 Dic',
    ecommercePhase: 'Thanksgiving Drop',
    taxNote: 'Presentación en estuche sellado original de 100ml',
    tag: '65% OFF',
    christmasTag: '🎁 Perfume de Diseñador',
    highlights: 'Aroma seductor y sofisticado con notas de pimienta negra, nuez moscada, flor de azahar y maderas preciosas.',
    buyUrl: 'https://www.macys.com/shop/beauty-products/perfume/Brand/GUESS?id=30087',
  },

  // 6. TOMMY HILFIGER - CAMISETA LOGO TEE (< $50 USD - 62% OFF)
  {
    id: 'tommy-tshirt',
    store: "Macy's Herald Sq",
    brand: 'Tommy Hilfiger',
    isAmericanBrand: true,
    title: 'Camiseta de Algodón Classic Graphic Logo Tee',
    category: 'Moda',
    image: '/images/deals/tommy-tshirt.jpg',
    originalPrice: 39.5,
    dealPrice: 14.99,
    savings: 24.51,
    discountPercent: 62,
    bfScore: 9.7,
    bfVerificationNote: "Doorbuster de ropa casual en Macy's Herald Sq",
    ecommerceDates: 'Acceso Online: 23 Nov - 30 Nov',
    ecommercePhase: 'Early Black Friday',
    taxNote: '0% Sales Tax en NYC (menos de $110)',
    tag: '62% OFF',
    christmasTag: '👕 Básico Americano',
    highlights: '100% algodón suave peinado con la icónica bandera bordada de Tommy Hilfiger en el pecho.',
    buyUrl: 'https://www.macys.com/shop/mens-clothing/mens-t-shirts/Brand/Tommy%20Hilfiger?id=30423',
  },

  // 6B. VICTORIA'S SECRET - FRAGRANCE MIST & BODY DUO (< $50 USD - 62% OFF)
  {
    id: 'victorias-secret-mist',
    store: "Victoria's Secret 5th Ave NYC",
    brand: "Victoria's Secret",
    isAmericanBrand: true,
    title: 'Set Festivo Fragrance Mist & Body Lotion (250ml c/u)',
    category: 'Belleza',
    image: '/images/deals/victorias-secret-mist.jpg',
    originalPrice: 39.95,
    dealPrice: 15.0,
    savings: 24.95,
    discountPercent: 62,
    bfScore: 9.9,
    bfVerificationNote: "Promoción icónica $15 USD por set en Black Friday oficial de Victoria's Secret",
    ecommerceDates: 'Acceso Web Exclusivo: 22 Nov - 1 Dic',
    ecommercePhase: 'Black Friday Oficial',
    taxNote: 'El regalo festivo #1 en perfumería femenina de USA',
    tag: '62% OFF',
    christmasTag: "🎀 Regalo Estrella Victoria's Secret",
    highlights: 'Dúo icónico con notas florales y frutales enriquecido con aloe nutritivo y vitamina E para máxima hidratación.',
    buyUrl: 'https://www.victoriassecret.com/us/vs/beauty/mists-and-body-care',
  },

  // 6C. CALVIN KLEIN - CK ONE / EUPHORIA EAU DE TOILETTE (< $50 USD - 62% OFF)
  {
    id: 'calvin-klein-perfume',
    store: "Macy's Herald Sq / Amazon USA",
    brand: 'Calvin Klein Fragrances',
    isAmericanBrand: true,
    title: 'Perfume CK One / Euphoria Eau de Toilette Spray 100ml / 200ml',
    category: 'Belleza',
    image: '/images/deals/calvin-klein-perfume.jpg',
    originalPrice: 89.0,
    dealPrice: 34.0,
    savings: 55.0,
    discountPercent: 62,
    bfScore: 9.8,
    bfVerificationNote: "62% OFF en caja sellada con batch code oficial verificado en Macy's",
    ecommerceDates: 'Early Fragrance Drops: 21 Nov - 1 Dic',
    ecommercePhase: 'Black Friday Oficial',
    taxNote: 'Perfume original garantizado con batch code USA',
    tag: '62% OFF',
    christmasTag: '🌟 Clásico Unisex & Regalo Top',
    highlights: 'Fragancia icónica fresca y energizante con notas de té verde, bergamota, papaya, jazmín y ámbar cálido.',
    buyUrl: 'https://www.macys.com/shop/beauty-products/perfume/Brand/Calvin%20Klein?id=30087',
  },

  // 6D. GAP - HOODIE CLÁSICO CON LOGO ARCH (< $50 USD - 58% OFF)
  {
    id: 'gap-logo-hoodie',
    store: 'GAP Times Sq NYC',
    brand: 'GAP',
    isAmericanBrand: true,
    title: 'Sudadera Clásica con Capucha Arch Logo Fleece Hoodie',
    category: 'Moda',
    image: '/images/deals/gap-logo-hoodie.jpg',
    originalPrice: 59.99,
    dealPrice: 24.99,
    savings: 35.0,
    discountPercent: 58,
    bfScore: 9.8,
    bfVerificationNote: '50% storewide + 15% cupón digital web con 0% Sales Tax en NYC',
    ecommerceDates: 'GAP Cyber Days: 23 Nov - 1 Dic',
    ecommercePhase: 'Black Friday Oficial',
    taxNote: '0% Sales Tax en NYC (menos de $110)',
    tag: '58% OFF',
    christmasTag: '🇺🇸 Confort Clásico USA',
    highlights: 'Algodón y vellón perchado ultra suave con el legendario aplique arqueado GAP en relieve en el pecho.',
    buyUrl: 'https://www.gap.com/browse/category.do?cid=5180',
  },

  // 6E. VICTORIA'S SECRET - PIJAMA NAVIDEÑO SATIN PJ SET (< $50 USD - 56% OFF)
  {
    id: 'victorias-secret-pajama',
    store: "Victoria's Secret Flagship NY",
    brand: "Victoria's Secret",
    isAmericanBrand: true,
    title: 'Pijama Navideño Satin Long PJ Set de Satén Sedoso',
    category: 'Moda',
    image: '/images/deals/victorias-secret-pajama.jpg',
    originalPrice: 79.95,
    dealPrice: 35.0,
    savings: 44.95,
    discountPercent: 56,
    bfScore: 9.7,
    bfVerificationNote: "Doorbuster de Pijamas en Black Friday oficial de Victoria's Secret con 0% Sales Tax en NYC",
    ecommerceDates: 'Web Drop: 23 Nov - 30 Nov',
    ecommercePhase: 'Early Black Friday',
    taxNote: '0% Sales Tax en NYC (menos de $110)',
    tag: '56% OFF',
    christmasTag: '✨ Nochebuena & Confort',
    highlights: 'Satén sedoso premium con ribetes en contraste, corte holgado ultra cómodo y botones perlados.',
    buyUrl: 'https://www.victoriassecret.com/us/vs/sleepwear-and-lingerie',
  },

  // 7. CALVIN KLEIN - PACK X3 BÓXERS (< $50 USD - 56% OFF)
  {
    id: 'calvin-klein-boxers',
    store: "Macy's Herald Sq / Calvin Klein US",
    brand: 'Calvin Klein',
    isAmericanBrand: true,
    title: 'Pack x3 Bóxers de Algodón Stretch Classic Fit',
    category: 'Moda',
    image: '/images/deals/calvin-klein-boxers.jpg',
    originalPrice: 45.0,
    dealPrice: 19.99,
    savings: 25.01,
    discountPercent: 56,
    bfScore: 9.8,
    bfVerificationNote: '56% OFF en el pack más vendido de ropa interior de EE.UU.',
    ecommerceDates: 'Online Drop: 20 Nov - 1 Dic',
    ecommercePhase: 'Black Friday Oficial',
    taxNote: '0% Sales Tax en NYC (menos de $110)',
    tag: '56% OFF',
    christmasTag: '🎁 Regalo Esencial',
    highlights: 'Pack de 3 unidades en algodón stretch de alta durabilidad con pretina elástica emblemática.',
    buyUrl: 'https://www.macys.com/shop/mens-clothing/mens-underwear/Brand/Calvin%20Klein?id=57',
  },

  // 8. COLUMBIA SPORTSWEAR (< $50 USD - 54% OFF)
  {
    id: 'columbia-fleece',
    store: 'Columbia Sportswear NYC',
    brand: 'Columbia',
    isAmericanBrand: true,
    title: 'Chaqueta Polar Steens Mountain / Benton Springs',
    category: 'Moda',
    image: '/images/deals/columbia-fleece.jpg',
    originalPrice: 65,
    dealPrice: 29.99,
    savings: 35.01,
    discountPercent: 54,
    bfScore: 9.5,
    bfVerificationNote: 'Precio liquidación pre-navideño sin impuestos locales',
    ecommerceDates: 'Online Door-Buster: 24 Nov - 2 Dic',
    ecommercePhase: 'Thanksgiving Drop',
    taxNote: '0% Sales Tax en NYC (menos de $110)',
    tag: '54% OFF',
    christmasTag: '🏔️ Abrigo & Outdoor',
    highlights: 'Tejido polar de micropolar suave de 250g con cremallera completa para máximo abrigo.',
    buyUrl: 'https://www.columbia.com/c/sale/',
  },

  // 9. BATH & BODY WORKS - VELA 3 MECHAS (< $50 USD - 52% OFF)
  {
    id: 'bath-body-works-candle',
    store: 'Bath & Body Works 5th Ave NYC',
    brand: 'Bath & Body Works',
    isAmericanBrand: true,
    title: 'Vela Aromática 3 Mechas Edición Navideña (3-Wick Candle)',
    category: 'Lifestyle',
    image: '/images/deals/bath-body-works.jpg',
    originalPrice: 26.95,
    dealPrice: 12.95,
    savings: 14.0,
    discountPercent: 52,
    bfScore: 9.9,
    bfVerificationNote: 'Precio histórico del evento anual Candle Day en Nueva York',
    ecommerceDates: 'Candle Day & BF: 24 Nov - 2 Dic',
    ecommercePhase: 'Thanksgiving Drop',
    taxNote: 'El aroma navideño preferido en hogares de USA',
    tag: '52% OFF',
    christmasTag: '🕯️ Tradición Navideña USA',
    highlights: 'Cera con aceites esenciales naturales y 3 mechas que perfuman espacios amplios hasta 45 horas.',
    buyUrl: 'https://www.bathandbodyworks.com/c/home-fragrance/3-wick-candles',
  },

  // 9B. ADIDAS - GRAND COURT 2.0 LEATHER SNEAKERS (< $50 USD - 50% OFF)
  {
    id: 'adidas-grand-court',
    store: 'Adidas Flagship 5th Ave / Amazon USA',
    brand: 'Adidas',
    isAmericanBrand: false,
    title: 'Zapatillas Urbanas Grand Court 2.0 Classic Leather',
    category: 'Moda',
    image: '/images/deals/adidas-grand-court.jpg',
    originalPrice: 70.0,
    dealPrice: 34.99,
    savings: 35.01,
    discountPercent: 50,
    bfScore: 9.6,
    bfVerificationNote: '50% OFF oficial en zapatillas urbanas de cuero sintético con 0% Tax en NYC',
    ecommerceDates: 'Cyber Week Adidas: 24 Nov - 2 Dic',
    ecommercePhase: 'Black Friday Oficial',
    taxNote: '0% Sales Tax en NYC (menos de $110)',
    tag: '50% OFF',
    christmasTag: '👟 Calzado Urbano Clásico',
    highlights: 'Silueta retro de tenis con plantilla Cloudfoam Comfort ultrasuave y las icónicas 3 rayas laterales.',
    buyUrl: 'https://www.adidas.com/us/men-grand_court-shoes',
  },

  // 9C. NIKE - SPORTSWEAR CLUB FLEECE HOODIE (< $50 USD - 49% OFF)
  {
    id: 'nike-club-fleece',
    store: 'Nike 5th Ave / Nike US',
    brand: 'Nike',
    isAmericanBrand: true,
    title: 'Sudadera con Capucha Sportswear Club Fleece Hoodie',
    category: 'Moda',
    image: '/images/deals/nike-club-fleece.jpg',
    originalPrice: 65.0,
    dealPrice: 32.99,
    savings: 32.01,
    discountPercent: 49,
    bfScore: 9.7,
    bfVerificationNote: 'Rebaja exclusiva para miembros Nike + 0% Sales Tax en prendas individuales en NYC',
    ecommerceDates: 'Nike Members Early: 22 Nov - 30 Nov',
    ecommercePhase: 'Early Black Friday',
    taxNote: '0% Sales Tax en NYC (menos de $110)',
    tag: '49% OFF',
    christmasTag: '⚡ Básico Deportivo Nike',
    highlights: 'Interior de tejido Fleece cepillado suave con logotipo Futura bordado en el pecho y bolsillo de canguro.',
    buyUrl: 'https://www.nike.com/w/mens-sale-hoodies-sweatshirts-3yaepznik1z6ymx6',
  },

  // 10. LEVI'S 501 JEANS (< $50 USD - 45% OFF)
  {
    id: 'levis-501-jeans',
    store: "Levi's Store Times Sq / SoHo",
    brand: "Levi's",
    isAmericanBrand: true,
    title: "Jeans 501 Original Fit Denim Clásico",
    category: 'Moda',
    image: '/images/deals/levis-501.jpg',
    originalPrice: 79.5,
    dealPrice: 44.0,
    savings: 35.5,
    discountPercent: 45,
    bfScore: 9.6,
    bfVerificationNote: '40% storewide + cupón digital web acumulable',
    ecommerceDates: 'Cyber Week eCommerce: 25 Nov - 1 Dic',
    ecommercePhase: 'Black Friday Oficial',
    taxNote: '0% Sales Tax en NYC (menos de $110)',
    tag: '45% OFF',
    christmasTag: '👖 Icono Americano',
    highlights: 'El corte recto legendario de mezclilla 100% algodón con bragueta de botones emblemática.',
    buyUrl: 'https://www.levi.com/US/en_US/clothing/men/jeans/501-original-fit-mens-jeans/p/005010114',
  },

  // 11. NIKE PEGASUS (44% OFF)
  {
    id: 'nike-pegasus',
    store: 'Nike 5th Ave / Nike US',
    brand: 'Nike',
    isAmericanBrand: true,
    title: 'Zapatillas Running Air Zoom Pegasus 40 / 41',
    category: 'Moda',
    image: '/images/deals/nike-pegasus.jpg',
    originalPrice: 140,
    dealPrice: 79,
    savings: 61,
    discountPercent: 44,
    bfScore: 9.7,
    bfVerificationNote: 'Rebaja oficial Nike Members + 0% Sales Tax en NYC',
    ecommerceDates: 'Nike Members Early: 22 Nov - 30 Nov',
    ecommercePhase: 'Early Black Friday',
    taxNote: '0% Sales Tax en NYC (menos de $110)',
    tag: '44% OFF',
    christmasTag: '👟 Estilo Deportivo',
    highlights: 'Espuma React reactiva y doble unidad Zoom Air para máximo confort diario y entrenamiento.',
    buyUrl: 'https://www.nike.com/w/mens-pegasus-running-shoes-37v7jznik1zy7ok',
  },

  // 12. STANLEY 1913 TUMBLER (< $50 USD - 35% OFF)
  {
    id: 'stanley-quencher',
    store: 'Target / Amazon / REI',
    brand: 'Stanley 1913',
    isAmericanBrand: true,
    title: 'Vaso Térmico The Quencher H2.0 FlowState 40oz',
    category: 'Lifestyle',
    image: '/images/deals/stanley-quencher.jpg',
    originalPrice: 45,
    dealPrice: 29.0,
    savings: 16.0,
    discountPercent: 35,
    bfScore: 9.6,
    bfVerificationNote: 'El termo viral de USA con descuento real por primera vez',
    ecommerceDates: 'Flash Sale Online: 26 Nov - 1 Dic',
    ecommercePhase: 'Thanksgiving Drop',
    taxNote: 'El regalo más pedido de fin de año',
    tag: '35% OFF',
    christmasTag: '🥤 Viral en Redes USA',
    highlights: 'Acero inoxidable reciclado al 90%, tapa FlowState con 3 posiciones y aislamiento térmico 48h.',
    buyUrl: 'https://www.amazon.com/dp/B0BN2C17D8',
  },

  // 13. SOL DE JANEIRO SET (< $50 USD - 35% OFF)
  {
    id: 'sol-de-janeiro-set',
    store: 'Sephora Times Sq',
    brand: 'Sol de Janeiro',
    isAmericanBrand: true,
    title: 'Set Festivo Brazilian Bum Bum Cream & Mist Holiday',
    category: 'Belleza',
    image: '/images/deals/sol-de-janeiro.jpg',
    originalPrice: 68,
    dealPrice: 44.0,
    savings: 24.0,
    discountPercent: 35,
    bfScore: 9.4,
    bfVerificationNote: 'Cofre festivo exclusivo de Sephora Times Sq (Valor $95)',
    ecommerceDates: 'Sephora App Early: 24 Nov - 1 Dic',
    ecommercePhase: 'Early Black Friday',
    taxNote: 'Edición limitada con cofre de regalo',
    tag: '35% OFF',
    christmasTag: '💄 Set Festivo Exclusivo',
    highlights: 'Fragancia Cheirosa 68 con crema hidratante reafirmante corporal de culto mundial.',
    buyUrl: 'https://www.sephora.com/brand/sol-de-janeiro',
  },

  // 14. RARE BEAUTY - SOFT PINCH LIQUID BLUSH TRIO (< $50 USD - 30% OFF)
  {
    id: 'rare-beauty-blush',
    store: 'Sephora Times Sq',
    brand: 'Rare Beauty',
    isAmericanBrand: true,
    title: 'Set Festivo Soft Pinch Liquid Blush Trio (Selena Gomez)',
    category: 'Belleza',
    image: '/images/deals/rare-beauty-blush.jpg',
    originalPrice: 34.0,
    dealPrice: 23.8,
    savings: 10.2,
    discountPercent: 30,
    bfScore: 9.7,
    bfVerificationNote: 'El rubor viral más codiciado de Sephora en cofre de 3 tonos',
    ecommerceDates: 'Sephora App Early: 24 Nov - 1 Dic',
    ecommercePhase: 'Early Black Friday',
    taxNote: 'Edición festiva de colección limitada',
    tag: '30% OFF',
    christmasTag: '💄 Viral de Belleza',
    highlights: 'Fórmula ultraligera y de alta pigmentación en acabado mate y radiante que dura todo el día sin resecar.',
    buyUrl: 'https://www.sephora.com/brand/rare-beauty-by-selena-gomez',
  },

  // 15. DYSON BEAUTY ($100 OFF)
  {
    id: 'dyson-airwrap',
    store: 'Sephora / Best Buy',
    brand: 'Dyson',
    isAmericanBrand: false,
    title: 'Dyson Airwrap Multi-Styler Complete Long',
    category: 'Belleza',
    image: '/images/deals/dyson-airwrap.jpg',
    originalPrice: 599,
    dealPrice: 499,
    savings: 100,
    discountPercent: 17,
    bfScore: 9.3,
    bfVerificationNote: '$100 USD de descuento directo en edición limitada navideña',
    ecommerceDates: 'Venta Online Oficial: 26 Nov - 1 Dic',
    ecommercePhase: 'Cyber Monday',
    taxNote: 'Edición festiva con estuche rígido incluido',
    tag: '$100 OFF',
    christmasTag: '✨ Lujo & Cuidado Capilar',
    highlights: 'Estilizado por efecto Coanda por aire sin daño térmico extremo. Muy codiciado para regalo.',
    buyUrl: 'https://www.sephora.com/product/airwrap-styler-P437999',
  },

  // --- SECCIÓN FINAL: ELECTRÓNICOS & GADGETS (Agrupados al final) ---

  // 16. AMAZON ECHO DOT 5 (< $50 USD - 54% OFF)
  {
    id: 'echo-dot-5',
    store: 'Amazon USA',
    brand: 'Amazon',
    isAmericanBrand: true,
    title: 'Altavoz Inteligente Echo Dot 5ta Generación con Alexa',
    category: 'Tech',
    image: '/images/deals/echo-dot.jpg',
    originalPrice: 49.99,
    dealPrice: 22.99,
    savings: 27.0,
    discountPercent: 54,
    bfScore: 9.8,
    bfVerificationNote: '54% OFF histórico en el gadget más vendido de Amazon',
    ecommerceDates: 'Black Friday 48h: 21 Nov - 1 Dic',
    ecommercePhase: 'Black Friday Oficial',
    taxNote: 'El regalo tech más accesible y popular',
    tag: '54% OFF',
    christmasTag: '🔊 Gadget #1 de Amazon',
    highlights: 'Audio de gran nitidez con graves profundos, control de música y asistente de voz Alexa integrado.',
    buyUrl: 'https://www.amazon.com/dp/B09B8V1LZ3',
  },

  // 17. SONY NOISE CANCELLING (38% OFF)
  {
    id: 'sony-wh1000xm5',
    store: 'Best Buy / Amazon',
    brand: 'Sony',
    isAmericanBrand: false,
    title: 'Auriculares Noise Cancelling WH-1000XM5',
    category: 'Tech',
    image: '/images/deals/sony-headphones.jpg',
    originalPrice: 399.99,
    dealPrice: 248.0,
    savings: 151.99,
    discountPercent: 38,
    bfScore: 9.9,
    bfVerificationNote: 'Rebaja histórica directa en caja comprobada en Amazon & Best Buy',
    ecommerceDates: 'Doorbuster Online: 21 Nov - 1 Dic',
    ecommercePhase: 'Black Friday Oficial',
    taxNote: 'Rebaja histórica en audio de alta gama',
    tag: '38% OFF',
    christmasTag: '🎧 El regalo más pedido',
    highlights: 'Líder indiscutible en cancelación activa de ruido con procesador V1 y batería de 30 horas.',
    buyUrl: 'https://www.amazon.com/dp/B09XS7JWHH',
  },

  // 18. APPLE MACBOOK AIR M2 ($250 OFF)
  {
    id: 'macbook-air-m2',
    store: 'Best Buy NYC',
    brand: 'Apple',
    isAmericanBrand: true,
    title: 'MacBook Air 13" (Chip M2, 16GB RAM, 256GB SSD)',
    category: 'Tech',
    image: '/images/deals/macbook-air.jpg',
    originalPrice: 999,
    dealPrice: 749,
    savings: 250,
    discountPercent: 25,
    bfScore: 9.8,
    bfVerificationNote: 'El mayor doorbuster de computación en Best Buy USA ($250 OFF directo)',
    ecommerceDates: 'Apertura Web Nacional: 20 Nov - 30 Nov',
    ecommercePhase: 'Early Black Friday',
    taxNote: 'Ahorro masivo en efectivo directo',
    tag: 'Doorbuster #1',
    christmasTag: '🎁 Regalo Top Tech',
    highlights: '16GB de memoria unificada de serie, chasis ultra delgado de aluminio y autonomía de 18 horas.',
    buyUrl: 'https://www.bestbuy.com/site/apple-macbook-air-13-inch-laptop-m2-chip-16gb-memory-256gb-ssd-midnight/6509650.p',
  },

  // 19. APPLE AIRPODS PRO 2 ($60 OFF)
  {
    id: 'airpods-pro-2',
    store: 'Best Buy / B&H Photo',
    brand: 'Apple',
    isAmericanBrand: true,
    title: 'AirPods Pro 2 (USB-C MagSafe)',
    category: 'Tech',
    image: '/images/deals/airpods-pro.jpg',
    originalPrice: 249,
    dealPrice: 189,
    savings: 60,
    discountPercent: 24,
    bfScore: 9.7,
    bfVerificationNote: 'Descuento en efectivo directo en caja vs tarjetas de regalo de Apple',
    ecommerceDates: 'Venta Online Oficial: 22 Nov - 1 Dic',
    ecommercePhase: 'Early Black Friday',
    taxNote: 'Descuento directo en efectivo',
    tag: '$60 OFF',
    christmasTag: '✨ Sorpresa Navideña',
    highlights: 'Cancelación activa de ruido 2x mejorada, audio espacial personalizado y estuche USB-C.',
    buyUrl: 'https://www.bhphotovideo.com/c/product/1785392-REG/apple_mtjv3am_a_airpods_pro_2nd_generation.html',
  },

  // 20. PLAYSTATION 5 SLIM BUNDLE (Gaming al final)
  {
    id: 'ps5-slim-bundle',
    store: 'Best Buy / Target',
    brand: 'Sony PlayStation',
    isAmericanBrand: false,
    title: 'PlayStation 5 Slim Disc Edition + Juego Triple A',
    category: 'Gaming',
    image: '/images/deals/ps5-slim.jpg',
    originalPrice: 499.99,
    dealPrice: 449.99,
    savings: 50,
    discountPercent: 10,
    bfScore: 9.2,
    bfVerificationNote: 'Pack oficial navideño con juego de $70 USD incluido sin costo',
    ecommerceDates: 'Gaming Week eCommerce: 23 Nov - 30 Nov',
    ecommercePhase: 'Cyber Monday',
    taxNote: 'Incluye juego gratis ($70 USD valor)',
    tag: 'Pack Gamer',
    christmasTag: '🎮 El regalo soñado',
    highlights: 'Chasis compacto de 1TB SSD con lector de discos Blu-Ray Ultra HD y control inalámbrico DualSense.',
    buyUrl: 'https://www.bestbuy.com/site/playstation-5-slim-console/6564757.p',
  },
];

// =========================================================================
// RENDERIZADOR DE LOGOS VECTORIALES OFICIALES
// =========================================================================
export function BrandLogo({ type }: { type: string }) {
  switch (type) {
    case 'sephora':
      return (
        <div className="bg-black text-white px-2 py-1 rounded-lg flex items-center justify-center font-serif text-[11px] font-black tracking-[0.25em] shadow-xs">
          SEPHORA
        </div>
      );
    case 'macys':
      return (
        <div className="bg-white p-1 rounded-lg flex items-center justify-center border border-red-100 shadow-xs">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#E11A2B]">
            <path d="M12 2l2.95 6.63 7.19.6-5.45 4.8 1.62 7.02L12 17.38l-6.31 3.67 1.62-7.02-5.45-4.8 7.19-.6z" />
          </svg>
        </div>
      );
    case 'nike':
      return (
        <div className="bg-black text-white p-1.5 rounded-lg flex items-center justify-center shadow-xs">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
            <path d="M21.7 5.3c-2.3 2.4-5.7 5.6-10.4 9.1-2.6 1.9-4.5 2.9-5.7 2.9-.9 0-1.6-.4-1.9-1.3-.5-1.1-.1-2.7 1-4.6 1.1-2 2.7-3.7 4.5-5.2.6-.5 1-.5 1.3-.2.3.3.2.7-.3 1.4-1.7 2.1-2.9 3.9-3.4 5.5-.3.8-.3 1.4 0 1.8.2.3.7.4 1.3.4 1-.1 2.4-.8 4.2-2.3 4.4-3.6 7.8-6.7 10.2-9.2.2-.2.5-.2.7 0 .1.2.1.5-.1.7z" />
          </svg>
        </div>
      );
    case 'bestbuy':
      return (
        <div className="bg-[#FFE000] text-black px-1.5 py-0.5 rounded-lg flex flex-col items-center justify-center border border-amber-400/50 leading-none shadow-xs">
          <span className="text-[8px] font-sans font-black tracking-tighter">BEST</span>
          <span className="text-[8px] font-sans font-black tracking-tighter">BUY</span>
        </div>
      );
    case 'coach':
      return (
        <div className="bg-[#1f1a17] text-[#e0b868] px-2 py-0.5 rounded-lg flex flex-col items-center justify-center border border-[#e0b868]/30 shadow-xs">
          <span className="text-[9.5px] font-serif font-black tracking-widest leading-none">COACH</span>
          <span className="text-[5.5px] tracking-wider text-slate-300 font-sans">NEW YORK</span>
        </div>
      );
    case 'victorias-secret':
      return (
        <div className="bg-[#111111] text-[#f4a0b7] px-2 py-1 rounded-lg flex items-center justify-center font-serif text-[9px] font-black tracking-widest shadow-xs border border-[#f4a0b7]/40">
          VICTORIA&apos;S SECRET
        </div>
      );
    case 'adidas':
      return (
        <div className="bg-black text-white p-1 rounded-lg flex items-center justify-center shadow-xs">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
            <path d="M8.6 17.5L5.7 13.9C5.4 13.5 4.8 13.4 4.4 13.7L1.6 15.6C1.2 15.9 1.1 16.5 1.4 16.9L5.3 22.3C5.6 22.7 6.2 22.8 6.6 22.5L9.4 20.6C9.8 20.3 9.9 19.7 9.6 19.3L8.6 17.5ZM14.9 12.8L10.3 6.9C10 6.5 9.4 6.4 9 6.7L6.2 8.6C5.8 8.9 5.7 9.5 6 9.9L11.6 17.6C11.9 18 12.5 18.1 12.9 17.8L15.7 15.9C16.1 15.6 16.2 15 15.9 14.6L14.9 12.8ZM21.2 8.1L14.9 .1C14.6 -.3 14 -.4 13.6 -.1L10.8 1.8C10.4 2.1 10.3 2.7 10.6 3.1L17.9 12.9C18.2 13.3 18.8 13.4 19.2 13.1L22 11.2C22.4 10.9 22.5 10.3 22.2 9.9L21.2 8.1Z" />
          </svg>
        </div>
      );
    case 'amazon':
      return (
        <div className="bg-[#131921] text-white px-2 py-1 rounded-lg flex flex-col items-center justify-center border border-white/10 shadow-xs">
          <span className="text-[10px] font-sans font-black leading-none tracking-tight">amazon</span>
          <svg viewBox="0 0 36 8" className="w-6 h-1.5 mt-0.5">
            <path d="M2 2 Q 18 10 34 2" fill="none" stroke="#FF9900" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M31 1 L 35 2 L 32 5 Z" fill="#FF9900" />
          </svg>
        </div>
      );
    case 'target':
      return (
        <div className="bg-white p-1 rounded-lg flex items-center justify-center border border-red-100 shadow-xs">
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <circle cx="12" cy="12" r="11" fill="#CC0000" />
            <circle cx="12" cy="12" r="7.33" fill="#FFFFFF" />
            <circle cx="12" cy="12" r="3.67" fill="#CC0000" />
          </svg>
        </div>
      );
    case 'apple':
      return (
        <div className="bg-black text-white p-1.5 rounded-lg flex items-center justify-center shadow-xs">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.2c.67-.82 1.13-1.96 1-3.1-.98.04-2.16.66-2.86 1.48-.61.71-1.15 1.87-1.01 2.98 1.09.08 2.2-.54 2.87-1.36z" />
          </svg>
        </div>
      );
    default:
      return (
        <div className="w-6 h-6 rounded-lg bg-surface-container-high flex items-center justify-center text-xs font-bold text-on-surface">
          ★
        </div>
      );
  }
}

// =========================================================================
// CALENDARIO ECOMMERCE: Fechas Específicas por Comercio en Noviembre
// =========================================================================
export interface StoreEcommerceItem {
  id: string;
  name: string;
  subchannel: string;
  logoType: 'sephora' | 'macys' | 'nike' | 'bestbuy' | 'coach' | 'amazon' | 'target' | 'apple' | 'adidas' | 'victorias-secret';
  categoryTag: 'Belleza' | 'Moda' | 'Tecnología' | 'Outlets' | 'Variedad';
  status: 'Activo en Noviembre' | 'Próximo Drop' | 'Doorbuster Oficial';
  isActiveNow: boolean;
  statusBadge: string;
  novemberDates: string; // Fechas exactas del mes de noviembre
  eventWindowDetail: string;
  keyDiscount: string;
  strongestDealBadge: string; // Insignia de la oferta más fuerte
  strongestDeal: string; // Detalle concreto de la oferta más potente
  starProducts: string;
  taxNoteNYC?: string;
  officialUrl: string;
}

export const STORE_ECOMMERCE_CALENDAR: StoreEcommerceItem[] = [
  // 1. COACH OUTLET (Top Marca Americana - Mayor Descuento de Toda la Web)
  {
    id: 'coach-outlet-ny',
    name: 'Coach Outlet NY',
    subchannel: 'Woodbury Common & Web Oficial',
    logoType: 'coach',
    categoryTag: 'Outlets',
    status: 'Próximo Drop',
    isActiveNow: false,
    statusBadge: '🟡 PRÓXIMO DROP (15 Nov)',
    novemberDates: '15 al 23 Nov (VIP Pre-Sale 70% OFF) & 24 Nov al 2 Dic (Cyber Week)',
    eventWindowDetail: '70% de descuento en toda la tienda online + 20% a 25% OFF acumulado en el carrito de compras.',
    keyDiscount: 'Hasta 77% OFF Acumulado',
    strongestDealBadge: '💥 HASTA 77% OFF ACUMULADO',
    strongestDeal: 'Cartera City Tote baja de $398 a $89 USD y Billeteras Corner Zip a solo $25 USD (72% OFF directo).',
    starProducts: 'Cartera City Tote ($89 USD), Corner Zip Wristlet ($25 USD), Billeteras de cuero',
    taxNoteNYC: 'Ahorro masivo en liquidación de diseñador estadounidense',
    officialUrl: 'https://www.coachoutlet.com/shop/black-friday-deals',
  },

  // 2. MACY'S (Herald Square Manhattan)
  {
    id: 'macys-herald-sq',
    name: "Macy's",
    subchannel: 'Herald Sq Manhattan & Web',
    logoType: 'macys',
    categoryTag: 'Moda',
    status: 'Activo en Noviembre',
    isActiveNow: true,
    statusBadge: '🟢 ACTIVO ESTE MES',
    novemberDates: '10 al 18 Nov (Early Access) & 19 al 30 Nov (Doorbusters Oficiales)',
    eventWindowDetail: 'El mayor surtido de abrigos de invierno y perfumería con rebajas de hasta 70%.',
    keyDiscount: '60% a 70% OFF + 0% Sales Tax NYC',
    strongestDealBadge: '💥 65% OFF + 0% SALES TAX',
    strongestDeal: 'Puffer Tommy Hilfiger de $225 a $79 USD, Camisetas Logo a $14.99 USD y 3-Pack Bóxers CK a $19.99 USD.',
    starProducts: 'Puffers Tommy Hilfiger ($79), Calvin Klein ($19.99), Camisetas ($14.99)',
    taxNoteNYC: '0% Sales Tax en NYC en prendas individuales bajo $110 USD',
    officialUrl: 'https://www.macys.com/p/black-friday/',
  },

  // 3. NIKE (House of Innovation 5th Ave)
  {
    id: 'nike-us',
    name: 'Nike US',
    subchannel: 'House of Innovation 5th Ave & Web',
    logoType: 'nike',
    categoryTag: 'Moda',
    status: 'Próximo Drop',
    isActiveNow: false,
    statusBadge: '🟡 PRÓXIMO DROP (17 Nov)',
    novemberDates: '17 al 23 Nov (Nike Members Early) & 24 al 30 Nov (Cyber Week Drops)',
    eventWindowDetail: 'Cupones digitales exclusivos para miembros en calzado de running, Jordan y ropa deportiva.',
    keyDiscount: 'Hasta 60% OFF en App & Web',
    strongestDealBadge: '💥 44% OFF EN RUNNING + 0% TAX',
    strongestDeal: 'Zapatillas Air Zoom Pegasus 40/41 bajan de $140 a $79 USD (0% Tax en NYC) + hasta 60% en Members Sale.',
    starProducts: 'Air Zoom Pegasus 40/41 ($79), Air Jordan 1, Nike Tech Fleece',
    taxNoteNYC: '0% Sales Tax en calzado bajo $110 USD en Nueva York',
    officialUrl: 'https://www.nike.com/w/black-friday-sale',
  },

  // 3B. ADIDAS USA (Calzado & Ropa Deportiva)
  {
    id: 'adidas-us',
    name: 'Adidas USA',
    subchannel: 'Flagship 5th Ave & Web Oficial',
    logoType: 'adidas',
    categoryTag: 'Moda',
    status: 'Activo en Noviembre',
    isActiveNow: true,
    statusBadge: '🟢 ACTIVO ESTE MES',
    novemberDates: '15 al 23 Nov (adiClub Early Access) & 24 Nov al 2 Dic (Cyber Week)',
    eventWindowDetail: 'Hasta 50% - 60% OFF en calzado clásico y running + 0% Sales Tax en calzado bajo $110 en NYC.',
    keyDiscount: 'Hasta 60% OFF adiClub',
    strongestDealBadge: '💥 50% OFF EN CALZADO CLÁSICO',
    strongestDeal: 'Zapatillas Grand Court 2.0 Classic Leather de $70 a $34.99 USD con 0% Sales Tax en NYC.',
    starProducts: 'Grand Court 2.0 ($34.99 USD), Ultraboost Light, Joggers Essentials',
    taxNoteNYC: '0% Sales Tax en calzado bajo $110 USD en Nueva York',
    officialUrl: 'https://www.adidas.com/us/black_friday',
  },

  // 4. BEST BUY (Líder en Tecnología de NYC)
  {
    id: 'bestbuy-us',
    name: 'Best Buy USA',
    subchannel: 'Union Square, 5th Ave & Web',
    logoType: 'bestbuy',
    categoryTag: 'Tecnología',
    status: 'Activo en Noviembre',
    isActiveNow: true,
    statusBadge: '🟢 ACTIVO ESTE MES',
    novemberDates: '8 al 20 Nov (Early Doorbusters) & 21 al 30 Nov (Black Friday Week)',
    eventWindowDetail: 'Lanzamientos semanales de rebajas directas en efectivo en laptops, consolas y audio de alta fidelidad.',
    keyDiscount: 'Ahorro hasta $500 USD directo en caja',
    strongestDealBadge: '💥 -$250 USD EN EFECTIVO DIRECTO',
    strongestDeal: 'MacBook Air 13" M2 de $999 a $749 USD y Auriculares Sony WH-1000XM5 de $400 a $248 USD directo en caja.',
    starProducts: 'MacBook Air M2 ($749), Sony WH-1000XM5 ($248), Smart TVs OLED 4K',
    officialUrl: 'https://www.bestbuy.com/site/black-friday/sale-event/pcmcat225600050000.c',
  },

  // 5. SEPHORA (Lujo, Maquillaje y Belleza)
  {
    id: 'sephora-us',
    name: 'Sephora USA',
    subchannel: 'Web & App Oficial',
    logoType: 'sephora',
    categoryTag: 'Belleza',
    status: 'Activo en Noviembre',
    isActiveNow: true,
    statusBadge: '🟢 ACTIVO ESTE MES',
    novemberDates: '1 al 11 Nov (Holiday Savings) & 24 Nov - 1 Dic (Black Friday Drops)',
    eventWindowDetail: '30% Sephora Collection + hasta 50% OFF en sets festivos y cofres de fin de año.',
    keyDiscount: 'Hasta 50% OFF en Lujo & Perfumes',
    strongestDealBadge: '💥 HASTA 50% OFF + SETS DESDE $23',
    strongestDeal: 'Rubores virales Rare Beauty a solo $23.80 USD, Sets Sol de Janeiro a $44 USD y $100 OFF en Dyson Airwrap.',
    starProducts: 'Rare Beauty Trio ($23.80), Sol de Janeiro ($44), Dyson Airwrap ($499)',
    officialUrl: 'https://www.sephora.com/beauty/black-friday',
  },

  // 5B. VICTORIA'S SECRET (Fragancias, Mists & Pijamas)
  {
    id: 'victorias-secret-us',
    name: "Victoria's Secret",
    subchannel: 'Flagship 5th Ave NYC & Web Oficial',
    logoType: 'victorias-secret',
    categoryTag: 'Belleza',
    status: 'Activo en Noviembre',
    isActiveNow: true,
    statusBadge: '🟢 ACTIVO ESTE MES',
    novemberDates: '18 al 24 Nov (Early VIP Drops) & 25 Nov al 2 Dic (Black Friday Oficial)',
    eventWindowDetail: 'Bodymists icónicos a $15 USD, pijamas térmicos de satén al 56% OFF y 0% Sales Tax en Manhattan.',
    keyDiscount: 'Hasta 62% OFF + Bodymists a $15 USD',
    strongestDealBadge: '💥 MISTS $15 USD & PIJAMAS 56% OFF',
    strongestDeal: 'Set de Body Mist + Loción baja de $39.95 a $15 USD y Pijamas navideños de satén bajan a solo $35 USD.',
    starProducts: 'Fragrance Mist & Lotion ($15 USD), Satin PJ Set ($35 USD), Fragancias Bombshell',
    taxNoteNYC: '0% Sales Tax en prendas individuales bajo $110 USD en NYC',
    officialUrl: 'https://www.victoriassecret.com/us/vs/sale',
  },

  // 6. AMAZON USA (El Gigante del eCommerce)
  {
    id: 'amazon-us',
    name: 'Amazon USA',
    subchannel: 'Portal Principal & Prime Deals',
    logoType: 'amazon',
    categoryTag: 'Variedad',
    status: 'Próximo Drop',
    isActiveNow: false,
    statusBadge: '🟡 PRÓXIMO DROP (17 Nov)',
    novemberDates: '17 al 26 Nov (Early Black Friday) & 27 al 28 Nov (Black Friday 48 Horas)',
    eventWindowDetail: 'Ofertas relámpago continuas que rotan cada 5 minutos en termos, gadgets y electrónica.',
    keyDiscount: 'Doorbusters & Lightning Deals',
    strongestDealBadge: '💥 54% OFF EN SMART GADGETS',
    strongestDeal: 'Altavoz Echo Dot 5ta Gen de $49.99 a $22.99 USD y Termo viral Stanley Quencher 40oz de $45 a $29 USD.',
    starProducts: 'Echo Dot ($22.99 USD), Stanley Quencher 40oz ($29 USD), Kindle Paperwhite',
    officialUrl: 'https://www.amazon.com/blackfriday',
  },

  // 7. TARGET USA (Gamer, Juguetes & Termos)
  {
    id: 'target-us',
    name: 'Target USA',
    subchannel: 'Herald Sq & Web Nacional',
    logoType: 'target',
    categoryTag: 'Variedad',
    status: 'Activo en Noviembre',
    isActiveNow: true,
    statusBadge: '🟢 ACTIVO ESTE MES',
    novemberDates: '10 al 23 Nov (Early Holiday Deals) & 24 al 30 Nov (Black Friday Week)',
    eventWindowDetail: 'Promociones anticipadas en bundles de videojuegos con juegos gratis y juguetes coleccionables.',
    keyDiscount: 'Packs Gamer & Hasta 50% OFF',
    strongestDealBadge: '💥 JUEGO TRIPLE A $70 USD GRATIS',
    strongestDeal: 'Consola PS5 Slim 1TB a $449.99 USD con juego triple A de $70 USD incluido sin costo adicional.',
    starProducts: 'PS5 Slim Disc Bundle con Juego gratis ($449.99 USD), Nintendo Switch',
    officialUrl: 'https://www.target.com/c/black-friday/-/N-55119',
  },

  // 8. APPLE STORE OFICIAL (Shopping Event)
  {
    id: 'apple-us',
    name: 'Apple Store Oficial',
    subchannel: 'Fifth Ave Cubo de Cristal & Web',
    logoType: 'apple',
    categoryTag: 'Tecnología',
    status: 'Doorbuster Oficial',
    isActiveNow: false,
    statusBadge: '🔴 FECHA OFICIAL (28 Nov)',
    novemberDates: '28 de Noviembre al 1 de Diciembre (Apple Shopping Event 4 Días)',
    eventWindowDetail: 'Tarjetas de regalo oficiales de Apple de hasta $200 USD para canjear en futuras compras o suscripciones.',
    keyDiscount: 'Apple Gift Cards hasta $200 USD',
    strongestDealBadge: '💥 GIFT CARD HASTA $200 USD',
    strongestDeal: 'Tarjeta de regalo oficial Apple de $150-$200 USD con MacBooks y $50 USD con iPads para tus compras.',
    starProducts: 'MacBook Air M3, iPad 10th Gen, iPhone 16, AirPods Max, Apple Watch',
    officialUrl: 'https://www.apple.com/shop/gifts/shopping-event',
  },
];

export function TopDealsShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<
    'Todas' | 'Menos de $50 USD' | 'Marcas Americanas' | 'Moda & Outlets' | 'Lifestyle & Belleza' | 'Electrónicos & Gaming'
  >('Todas');

  const [sortBy, setSortBy] = useState<'discount' | 'savings' | 'bfScore'>('discount');
  const [showCalendar, setShowCalendar] = useState<boolean>(true);
  const [storeFilter, setStoreFilter] = useState<'Todos' | 'Activos Noviembre' | 'Moda' | 'Tecnología' | 'Belleza'>('Todos');

  // Filtrado de tiendas del calendario
  const filteredStores = useMemo(() => {
    return STORE_ECOMMERCE_CALENDAR.filter((store) => {
      if (storeFilter === 'Todos') return true;
      if (storeFilter === 'Activos Noviembre') return store.isActiveNow;
      if (storeFilter === 'Moda') return store.categoryTag === 'Moda' || store.categoryTag === 'Outlets';
      if (storeFilter === 'Tecnología') return store.categoryTag === 'Tecnología';
      if (storeFilter === 'Belleza') return store.categoryTag === 'Belleza';
      return true;
    });
  }, [storeFilter]);

  // Cantidad de productos menores a $50 USD
  const under50Count = useMemo(() => {
    return TOP_DEALS.filter((d) => d.dealPrice < 50).length;
  }, []);

  // Filtrado y Ordenamiento de Productos
  const processedDeals = useMemo(() => {
    // 1. Filtrar por categoría
    let list = TOP_DEALS.filter((deal) => {
      if (selectedCategory === 'Todas') return true;
      if (selectedCategory === 'Menos de $50 USD') return deal.dealPrice < 50;
      if (selectedCategory === 'Marcas Americanas') return deal.isAmericanBrand;
      if (selectedCategory === 'Moda & Outlets') return deal.category === 'Moda';
      if (selectedCategory === 'Lifestyle & Belleza')
        return deal.category === 'Lifestyle' || deal.category === 'Belleza';
      if (selectedCategory === 'Electrónicos & Gaming')
        return deal.category === 'Tech' || deal.category === 'Gaming';
      return true;
    });

    // 2. Ordenar manteniendo los requerimientos:
    // En 'Todas' y en 'Menos de $50 USD', mostramos mejores ofertas arriba y dejamos electrónicos al final
    if (selectedCategory === 'Todas' || selectedCategory === 'Menos de $50 USD') {
      const nonTech = list.filter((d) => d.category !== 'Tech' && d.category !== 'Gaming');
      const tech = list.filter((d) => d.category === 'Tech' || d.category === 'Gaming');

      const sortFn = (a: DealItem, b: DealItem) => {
        if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
        if (sortBy === 'savings') return b.savings - a.savings;
        if (sortBy === 'bfScore') return b.bfScore - a.bfScore;
        return 0;
      };

      nonTech.sort(sortFn);
      tech.sort(sortFn);

      return [...nonTech, ...tech];
    }

    // Para filtros específicos, ordenar directamente
    return [...list].sort((a, b) => {
      if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
      if (sortBy === 'savings') return b.savings - a.savings;
      if (sortBy === 'bfScore') return b.bfScore - a.bfScore;
      return 0;
    });
  }, [selectedCategory, sortBy]);

  return (
    <section
      id="ofertas-estrella"
      className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest border-y border-outline-variant/20"
    >
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ========================================================================= */}
        {/* HEADER: Enfoque en Marcas Americanas, Chollos < $50 USD y Rebajas Reales  */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-on-surface tracking-tight">
              Ofertas Black Friday USA: Marcas Americanas & Oportunidades Reales
            </h2>
          </div>

          {/* Selector de Orden */}
          <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant/30 self-start lg:self-auto shrink-0">
            <span className="text-[11px] font-semibold text-on-surface-variant px-2 flex items-center gap-1">
              <Icon name="tune" size={14} />
              <span>Ordenar:</span>
            </span>
            <button
              onClick={() => setSortBy('discount')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                sortBy === 'discount'
                  ? 'bg-surface text-on-surface shadow-xs font-bold text-primary-container'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Mayor Descuento %
            </button>
            <button
              onClick={() => setSortBy('savings')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                sortBy === 'savings'
                  ? 'bg-surface text-on-surface shadow-xs font-bold text-primary-container'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Mayor Ahorro ($ USD)
            </button>
            <button
              onClick={() => setSortBy('bfScore')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                sortBy === 'bfScore'
                  ? 'bg-surface text-on-surface shadow-xs font-bold text-primary-container'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Puntos Black Friday
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CATEGORÍAS & FILTROS (Inmediatamente arriba de los productos)             */}
        {/* ========================================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant/20 pb-4">
          <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-2xl overflow-x-auto max-w-full">
            {(
              [
                'Todas',
                'Menos de $50 USD',
                'Marcas Americanas',
                'Moda & Outlets',
                'Lifestyle & Belleza',
                'Electrónicos & Gaming',
              ] as const
            ).map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-surface text-on-surface shadow-xs font-bold text-primary-container'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {cat === 'Menos de $50 USD' && <span>🏷️</span>}
                  {cat === 'Marcas Americanas' && <span>🇺🇸</span>}
                  {cat === 'Moda & Outlets' && <span>👜</span>}
                  {cat === 'Lifestyle & Belleza' && <span>💄</span>}
                  {cat === 'Electrónicos & Gaming' && <span>⚡</span>}
                  <span>{cat}</span>
                  <span className="text-[10px] opacity-60 font-mono">
                    (
                    {cat === 'Todas'
                      ? TOP_DEALS.length
                      : cat === 'Menos de $50 USD'
                      ? under50Count
                      : cat === 'Marcas Americanas'
                      ? TOP_DEALS.filter((d) => d.isAmericanBrand).length
                      : cat === 'Moda & Outlets'
                      ? TOP_DEALS.filter((d) => d.category === 'Moda').length
                      : cat === 'Lifestyle & Belleza'
                      ? TOP_DEALS.filter((d) => d.category === 'Lifestyle' || d.category === 'Belleza').length
                      : TOP_DEALS.filter((d) => d.category === 'Tech' || d.category === 'Gaming').length}
                    )
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-on-surface-variant flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              Mostrando {processedDeals.length} ofertas verificadas con fotos oficiales
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 1. GRID DE PRODUCTOS: FRONT AND CENTER (Más Ofertiva y con Gran Impacto)  */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {processedDeals.map((deal) => {
            const isTech = deal.category === 'Tech' || deal.category === 'Gaming';
            const isUnder50 = deal.dealPrice < 50;
            const isSuperDeal = deal.discountPercent >= 60;

            return (
              <div
                key={deal.id}
                className={`group bg-surface rounded-2xl border transition-all duration-300 hover:shadow-lg flex flex-col justify-between overflow-hidden relative ${
                  isSuperDeal
                    ? 'border-amber-400/80 ring-1 ring-amber-400/30'
                    : deal.isAmericanBrand
                    ? 'border-secondary/30 hover:border-secondary'
                    : 'border-outline-variant/30 hover:border-outline-variant'
                }`}
              >
                {/* 1. SECCIÓN DE IMAGEN DEL PRODUCTO CON PUNTOS DE BLACK FRIDAY */}
                <div className="relative w-full aspect-[4/3] bg-surface-container-low overflow-hidden">
                  <Image
                    src={deal.image}
                    alt={`${deal.title} - Oferta Black Friday en ${deal.store}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradiente sutil superior e inferior para legibilidad de badges */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/35 pointer-events-none"></div>

                  {/* Badges Superiores */}
                  <div className="absolute top-2.5 inset-x-2.5 flex items-start justify-between gap-1 pointer-events-none">
                    <div className="flex flex-wrap items-center gap-1">
                      {/* Badge de Marca Americana si corresponde */}
                      {deal.isAmericanBrand ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-white text-[10px] font-bold border border-white/20 shadow-xs">
                          <span>🇺🇸</span>
                          <span>Marca USA</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-slate-200 text-[10px] font-semibold border border-white/10">
                          {deal.brand}
                        </span>
                      )}

                      {/* Micro-badge para productos < $50 USD */}
                      {isUnder50 && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-600 backdrop-blur-md text-white text-[9.5px] font-black border border-emerald-300/40 shadow-xs">
                          <span>&lt; $50</span>
                        </span>
                      )}
                    </div>

                    {/* Porcentaje de Descuento destacado */}
                    <span
                      className={`font-black text-white px-2.5 py-0.5 rounded-md text-[11.5px] shadow-sm tracking-tight shrink-0 ${
                        isSuperDeal
                          ? 'bg-gradient-to-r from-red-600 to-amber-500 animate-pulse'
                          : 'bg-error'
                      }`}
                    >
                      {deal.tag}
                    </span>
                  </div>

                  {/* PUNTOS DE BLACK FRIDAY (Marcador de Verdadera Oferta) */}
                  <div className="absolute bottom-2.5 inset-x-2.5 flex items-end justify-between gap-1 pointer-events-none">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/90 backdrop-blur-md border border-amber-400/50 text-amber-300 text-[11px] font-bold shadow-md">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Puntos BF: {deal.bfScore}/10</span>
                      <span className="text-white/40">•</span>
                      <span className="text-[10px] text-white font-medium">Verdadera Oferta</span>
                    </div>

                    <span className="text-[10px] font-medium text-white/90 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded text-right truncate max-w-[120px]">
                      {deal.store.split('/')[0]}
                    </span>
                  </div>
                </div>

                {/* 2. CUERPO DE LA TARJETA */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    {/* Micro-etiqueta Navideña & Categoría */}
                    <div className="flex items-center justify-between gap-1">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 text-[10px] font-bold border border-amber-200/80">
                        {deal.christmasTag}
                      </span>

                      {isUnder50 ? (
                        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded font-bold border border-emerald-300/50">
                          Chollo &lt; $50
                        </span>
                      ) : isTech ? (
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          Electrónicos
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-secondary bg-secondary-fixed/30 px-1.5 py-0.5 rounded font-semibold">
                          Moda & Outlet
                        </span>
                      )}
                    </div>

                    {/* Título y Marca */}
                    <div>
                      <span className="text-[11px] font-bold text-secondary tracking-wide uppercase">
                        {deal.brand}
                      </span>
                      <h3 className="font-display font-bold text-sm text-on-surface line-clamp-2 leading-snug">
                        {deal.title}
                      </h3>
                      <p className="text-xs text-on-surface-variant line-clamp-2 mt-1 leading-relaxed">
                        {deal.highlights}
                      </p>
                    </div>

                    {/* Verificación de Oferta Real */}
                    <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200/60 rounded-lg p-1.5 flex items-start gap-1.5">
                      <Icon name="verified" size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-tight text-[10.5px]">
                        <strong>Oferta Real:</strong> {deal.bfVerificationNote}
                      </span>
                    </div>

                    {/* FECHAS DE COMPRA EN ECOMMERCE (Black Friday & Cyber Week) */}
                    <div className="text-[11px] text-blue-900 bg-blue-50 border border-blue-200/70 rounded-lg p-1.5 flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <Icon name="calendar_month" size={13} className="text-secondary shrink-0" />
                        <span className="font-semibold text-[10.5px] truncate">
                          {deal.ecommerceDates}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono font-bold bg-white/80 px-1.5 py-0.5 rounded text-secondary shrink-0 border border-blue-100">
                        {deal.ecommercePhase}
                      </span>
                    </div>
                  </div>

                  {/* 3. PRECIOS, TAXES Y BOTONES DE ACCIÓN */}
                  <div className="pt-3 border-t border-outline-variant/20 space-y-2.5">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xs text-on-surface-variant line-through mr-1.5">
                          ${deal.originalPrice.toFixed(deal.originalPrice % 1 === 0 ? 0 : 2)}
                        </span>
                        <span className="text-xl font-extrabold font-display text-primary-container">
                          ${deal.dealPrice.toFixed(deal.dealPrice % 1 === 0 ? 0 : 2)}{' '}
                          <span className="text-xs font-normal text-on-surface-variant">USD</span>
                        </span>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300">
                        Ahorras ${deal.savings.toFixed(deal.savings % 1 === 0 ? 0 : 2)}
                      </span>
                    </div>

                    {/* Nota Fiscal de NYC */}
                    <div className="text-[10px] text-on-surface-variant bg-surface-container-low px-2 py-1 rounded-md flex items-center gap-1">
                      <Icon name="info" size={12} className="text-secondary shrink-0" />
                      <span className="truncate">{deal.taxNote}</span>
                    </div>

                    {/* Botones: 1) Link Oficial de la Tienda y 2) Pedir / Traer */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <a
                        href={deal.buyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Ver en la tienda oficial de EE.UU."
                        className="py-2 px-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-sans text-xs font-semibold flex items-center justify-center gap-1 transition-all border border-outline-variant/30 text-center"
                      >
                        <span>Link Tienda</span>
                        <Icon name="open_in_new" size={12} />
                      </a>

                      <Link
                        href={`/registro?store=${encodeURIComponent(deal.store)}&usd=${deal.dealPrice}&item=${encodeURIComponent(deal.title)}&url=${encodeURIComponent(deal.buyUrl)}`}
                        className="py-2 px-2 rounded-xl bg-primary-container hover:bg-black text-white font-sans text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-xs text-center"
                      >
                        <span>Pedir / Traer</span>
                        <Icon name="arrow_forward" size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* 2. CALENDARIO ECOMMERCE (UBICADO EN LA PARTE INFERIOR CON LAS OFERTAS MÁS FUERTES) */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-br from-[#0a1424] via-[#0c1c33] to-[#08101e] rounded-3xl p-5 sm:p-7 text-white border border-white/10 shadow-xl relative overflow-hidden mt-6">
          {/* Luz ambiental sutil */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="relative space-y-5">
            {/* Header del Calendario por Tiendas */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-secondary/25 border border-secondary/50 text-secondary-fixed flex items-center justify-center shrink-0 shadow-inner">
                  <Icon name="calendar_month" size={24} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display font-bold text-base sm:text-lg text-white">
                      Calendario eCommerce Black Friday USA: Fechas por Comercio Oficial
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 animate-pulse">
                      ● Activos en este mes (Noviembre)
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    Conoce las fechas exactas y las <strong>ofertas más fuertes</strong> en <strong>Coach, Macy&apos;s, Nike, Best Buy, Sephora, Amazon, Target y Apple</strong>. Enlaces directos para comprar por tu cuenta o encargar con Compra Asistida.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-slate-200 font-bold transition-all flex items-center gap-1.5 border border-white/15 shrink-0"
              >
                <Icon name={showCalendar ? 'expand_less' : 'expand_more'} size={17} />
                <span>{showCalendar ? 'Ocultar Calendario' : 'Ver Calendario de Tiendas'}</span>
              </button>
            </div>

            {/* Filtros por Categoría de Tienda */}
            {showCalendar && (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl overflow-x-auto max-w-full">
                  {(
                    ['Todos', 'Activos Noviembre', 'Moda', 'Tecnología', 'Belleza'] as const
                  ).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setStoreFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                        storeFilter === filter
                          ? 'bg-white text-slate-900 font-bold shadow-xs'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {filter === 'Activos Noviembre' && '🟢 '}
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <span>Mostrando {filteredStores.length} de {STORE_ECOMMERCE_CALENDAR.length} comercios oficiales</span>
                </div>
              </div>
            )}

            {/* Grid de Tiendas con Logos, Fechas en Noviembre y la Oferta Más Fuerte */}
            {showCalendar && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 animate-fadeIn">
                {filteredStores.map((store) => (
                  <div
                    key={store.id}
                    className="bg-white/5 hover:bg-white/10 rounded-2xl p-4 border border-white/10 hover:border-secondary/60 transition-all flex flex-col justify-between space-y-3.5 backdrop-blur-sm group"
                  >
                    <div className="space-y-3">
                      {/* Fila Superior: Logo de Marca y Estado */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <BrandLogo type={store.logoType} />
                          <div className="leading-none">
                            <span className="font-display font-bold text-xs text-white block">
                              {store.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {store.subchannel}
                            </span>
                          </div>
                        </div>

                        {/* Badge de Estado */}
                        <span
                          className={`text-[9.5px] font-mono px-2 py-0.5 rounded-md font-bold shrink-0 ${
                            store.isActiveNow
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                          }`}
                        >
                          {store.statusBadge}
                        </span>
                      </div>

                      {/* Fechas en este mes (Noviembre) */}
                      <div className="bg-amber-400/10 border border-amber-400/25 rounded-xl p-2.5 space-y-1">
                        <div className="flex items-center gap-1.5 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                          <Icon name="event_available" size={13} className="text-amber-400" />
                          <span>Fechas en Noviembre:</span>
                        </div>
                        <p className="text-xs font-bold text-white leading-snug">
                          {store.novemberDates}
                        </p>
                      </div>

                      {/* LA OFERTA MÁS FUERTE DE ESTA TIENDA (Destacada de forma muy ofertiva) */}
                      <div className="bg-gradient-to-r from-red-950/60 to-amber-950/50 border border-amber-400/40 rounded-xl p-2.5 space-y-1 shadow-inner">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-black text-amber-300 flex items-center gap-1">
                            <span>🔥</span>
                            <span>OFERTA MÁS FUERTE</span>
                          </span>
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-400 text-black">
                            {store.strongestDealBadge}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-100 leading-snug">
                          {store.strongestDeal}
                        </p>
                      </div>

                      {/* Descuentos & Productos Clave */}
                      <div className="space-y-1 text-xs">
                        <p className="text-[10.5px] text-slate-300 leading-relaxed">
                          {store.eventWindowDetail}
                        </p>

                        <div className="text-[10px] text-slate-400 pt-1 border-t border-white/10 flex items-start gap-1">
                          <span className="text-secondary-fixed font-bold shrink-0">Top:</span>
                          <span className="text-slate-300 line-clamp-1">{store.starProducts}</span>
                        </div>

                        {store.taxNoteNYC && (
                          <div className="text-[9.5px] text-emerald-300/90 font-medium bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                            ✓ {store.taxNoteNYC}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Acciones: Link Oficial de la Tienda y Botón de Pedido */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                      <a
                        href={store.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Visitar web oficial de ofertas en ${store.name}`}
                        className="py-2 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-sans text-[11px] font-semibold flex items-center justify-center gap-1 transition-all border border-white/15 text-center truncate"
                      >
                        <span className="truncate">Link Tienda</span>
                        <Icon name="open_in_new" size={12} className="shrink-0" />
                      </a>

                      <Link
                        href={`/registro?store=${encodeURIComponent(store.name)}&url=${encodeURIComponent(store.officialUrl)}`}
                        className="py-2 px-2 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-sans text-[11px] font-bold flex items-center justify-center gap-1 transition-all shadow-xs text-center truncate"
                      >
                        <span className="truncate">Pedir aquí</span>
                        <Icon name="arrow_forward" size={12} className="shrink-0" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tip Operativo para Bolivia */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300 border-t border-white/10">
              <span className="flex items-center gap-2">
                <span className="text-amber-400 text-sm">💡</span>
                <span>
                  <strong>Tip de compra asistida:</strong> En tiendas con fechas activas este mes como <em>Sephora, Macy&apos;s y Best Buy</em>, las mejores ofertas de stock limitado se agotan en minutos. Envíanos el enlace oficial para reservar tu compra de inmediato.
                </span>
              </span>
              <Link
                href="/registro"
                className="text-secondary-fixed hover:underline font-bold shrink-0 flex items-center gap-1 self-start sm:self-auto"
              >
                <span>Formulario de Compra Asistida</span>
                <Icon name="arrow_forward" size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. BANNER INFORMATIVO: Ventaja Fiscal 0% Taxes NYC + Fechas de Vuelo     */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Tarjeta 1: Ventaja Fiscal 0% Tax NYC */}
          <div className="bg-surface-container-low rounded-2xl p-5 flex items-start gap-3.5 border border-outline-variant/20">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <Icon name="percent" size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-on-surface">
                0% Impuestos en NYC en ropa y calzado menor a $110 USD
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                En Nueva York ahorras automáticamente el impuesto estatal y local (8.875%) en cada prenda individual por debajo de $110. ¡Aplica para carteras en outlets, chaquetas Tommy Hilfiger, zapatillas Nike y jeans Levi&apos;s!
              </p>
            </div>
          </div>

          {/* Tarjeta 2: Vuelo Navideño a Bolivia */}
          <div className="bg-surface-container-low rounded-2xl p-5 flex items-start gap-3.5 border border-outline-variant/20">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Icon name="flight_takeoff" size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-on-surface">
                Vuelo Directo a Bolivia: Recibe antes del 24 de Diciembre
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Tus compras de Black Friday se consolidan en nuestro almacén de Manhattan y viajan en el vuelo con entrega garantizada desde el <strong>4 de Diciembre</strong> en Santa Cruz, La Paz y Cochabamba.
              </p>
              <Link
                href="/registro"
                className="inline-flex items-center gap-1 text-xs font-bold text-secondary hover:underline pt-1"
              >
                <span>Registrar compra asistida o casillero</span>
                <Icon name="arrow_forward" size={13} />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default TopDealsShowcase;
