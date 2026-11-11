/**
 * NY2Bolivia Web (Andean Skyline Logistics)
 * Hybrid Orders Service Adapter: Firebase Firestore + Offline LocalStorage Mock
 * Target: src/lib/orders-service.ts
 *
 * Implements complete business logic, financial calculations, status progression,
 * seed data, SSR safety, and WhatsApp deep links matching orders-db.js.
 */

import { db, isFirebaseConfigured } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import type {
  Order,
  OrderItem,
  OrderStatus,
  OrderFinancials,
  CreateOrderInput,
  SystemConfig,
  OrderMetrics,
  StatusBadgeConfig,
  FeePaymentStatus
} from '../types/order';

export interface IOrdersService {
  createOrder(input: CreateOrderInput): Promise<Order>;
  getOrderById(id: string): Promise<Order | null>;
  getOrders(): Promise<Order[]>;
}

export const STORAGE_KEYS = {
  ORDERS: 'ny2bolivia_orders_db',
  CONFIG: 'ny2bolivia_system_config',
  AUTH: 'ny2bolivia_admin_auth'
} as const;

export const DEFAULT_CONFIG: SystemConfig = {
  adminPin: '1234',
  adminPassword: 'admin',
  exchangeRateBOB: 6.96,
  defaultCommissionRate: 8, // 8% base commission
  defaultBaseFeeUSD: 20.00, // $20.00 USD flight slot reservation fee
  airFreightRatePerLbUSD: 9.50, // Base freight rate per pound
  whatsappSupportNumber: '59177012345',
  warehouseAddress: {
    title: 'NY2Bolivia Logistics Hub',
    company: 'Andean Skyline Logistics Corp',
    addressLine1: '350 5th Avenue, Suite NY-HUB',
    suiteLine: 'Attn: [Tu Nombre Completo / Suite NY]',
    cityStateZip: 'New York, NY 10118',
    phone: '+1 (212) 555-NY2B (6922)'
  }
};

/**
 * High-fidelity initial seed orders ported from orders-db.js.
 * Demonstrates all 4 status lifecycle states and real Manhattan retail items.
 */
export const SEED_ORDERS: Order[] = [
  {
    id: 'NY-2024-8841',
    createdAt: '2026-11-09T14:30:00.000Z',
    clientName: 'Rodrigo Mendoza Morales',
    clientPhone: '59177012345',
    suiteCode: 'NY-BOL-8492',
    destinationCity: 'Santa Cruz de la Sierra (Equipetrol)',
    deliveryMethod: 'pickup',
    deliveryAddress: '',
    modality: 'assisted',
    items: [
      {
        id: 'item-8841-1',
        storeName: 'Apple Store 5th Ave',
        category: 'Electrónica / Celulares / Laptops',
        productName: 'iPhone 16 Pro 256GB Black Titanium',
        productUrl: 'https://www.apple.com/shop/buy-iphone/iphone-16-pro',
        quantity: 1,
        priceUSD: 999.00,
        notes: 'Comprar en tienda física de la 5ta Avenida si hay stock disponible.'
      }
    ],
    trackingUSA: '',
    specialInstructions: {
      optimizeWeight: true,
      photoInspection: true,
      holidayPackaging: false
    },
    financials: {
      totalProductUSD: 999.00,
      commissionPercent: 8,
      commissionUSD: 79.92,
      baseFeeUSD: 20.00,
      totalFeeUSD: 99.92,
      exchangeRateBOB: 6.96,
      totalFeeBOB: 695.44,
      feePaymentStatus: 'pending',
      feePaymentMethod: 'QR Simple Bancario',
      feePaidAt: null
    },
    status: 'pedido',
    statusHistory: [
      {
        status: 'pedido',
        timestamp: '2026-11-09T14:30:00.000Z',
        note: 'Pedido registrado por el cliente vía web'
      }
    ],
    purchaseDetails: {
      boughtAt: null,
      buyerNote: 'Pendiente confirmar pago del fee para enviar al Personal Shopper en Manhattan',
      storeReceiptNumber: '',
      storeLocation: 'Apple 5th Ave (NYC)'
    },
    warehouseDetails: {
      receivedAt: null,
      weightLbs: 0.8,
      packagesCount: 1,
      photoEvidenceUrl: ''
    },
    deliveryDetails: {
      deliveredAt: null,
      receivedBy: '',
      deliveryNote: ''
    }
  },
  {
    id: 'NY-2024-8842',
    createdAt: '2026-11-08T18:15:00.000Z',
    clientName: 'Valeria Guzmán Terrazas',
    clientPhone: '59171234567',
    suiteCode: 'NY-BOL-9104',
    destinationCity: 'La Paz (Sopocachi)',
    deliveryMethod: 'delivery',
    deliveryAddress: 'Av. 20 de Octubre #2345, Edif. Torre Alta Piso 4',
    modality: 'assisted',
    items: [
      {
        id: 'item-8842-1',
        storeName: 'Sephora SoHo',
        category: 'Perfumes & Cosméticos de Marca',
        productName: 'Yves Saint Laurent Libre Eau de Parfum Gift Set 100ml',
        productUrl: 'https://www.sephora.com',
        quantity: 1,
        priceUSD: 155.00,
        notes: 'Gift Set de temporada navideña con loción mini.'
      },
      {
        id: 'item-8842-2',
        storeName: 'Sephora SoHo',
        category: 'Perfumes & Cosméticos de Marca',
        productName: 'Charlotte Tilbury Pillow Talk Set',
        productUrl: 'https://www.sephora.com',
        quantity: 1,
        priceUSD: 55.00,
        notes: 'Tono Medium'
      }
    ],
    trackingUSA: '',
    specialInstructions: {
      optimizeWeight: false,
      photoInspection: true,
      holidayPackaging: true
    },
    financials: {
      totalProductUSD: 210.00,
      commissionPercent: 10,
      commissionUSD: 21.00,
      baseFeeUSD: 20.00,
      totalFeeUSD: 41.00,
      exchangeRateBOB: 6.96,
      totalFeeBOB: 285.36,
      feePaymentStatus: 'paid',
      feePaymentMethod: 'Transferencia Banco BCP',
      feePaidAt: '2026-11-09T10:00:00.000Z'
    },
    status: 'pagado_fee',
    statusHistory: [
      {
        status: 'pedido',
        timestamp: '2026-11-08T18:15:00.000Z',
        note: 'Pedido registrado'
      },
      {
        status: 'pagado_fee',
        timestamp: '2026-11-09T10:00:00.000Z',
        note: 'Fee de $41 USD verificado por BCP'
      }
    ],
    purchaseDetails: {
      boughtAt: null,
      buyerNote: 'Fee confirmado. Realizar compra en Sephora SoHo este jueves.',
      storeReceiptNumber: '',
      storeLocation: 'Sephora Broadway & Prince St'
    },
    warehouseDetails: {
      receivedAt: null,
      weightLbs: 2.1,
      packagesCount: 1,
      photoEvidenceUrl: ''
    },
    deliveryDetails: {
      deliveredAt: null,
      receivedBy: '',
      deliveryNote: ''
    }
  },
  {
    id: 'NY-2024-8843',
    createdAt: '2026-11-06T11:20:00.000Z',
    clientName: 'Carlos Eduardo Arze',
    clientPhone: '59170789123',
    suiteCode: 'NY-BOL-7731',
    destinationCity: 'Cochabamba (Zona Norte)',
    deliveryMethod: 'pickup',
    deliveryAddress: '',
    modality: 'prealert',
    items: [
      {
        id: 'item-8843-1',
        storeName: 'Nike NYC House of Innovation',
        category: 'Ropa, Calzado & Accesorios',
        productName: 'Nike Air Jordan 4 Retro Talla 10 US',
        productUrl: 'https://nike.com',
        quantity: 1,
        priceUSD: 215.00,
        trackingUSA: '1Z9999999999999999',
        notes: 'Colorway White Cement'
      }
    ],
    trackingUSA: '1Z9999999999999999',
    specialInstructions: {
      optimizeWeight: true,
      photoInspection: true,
      holidayPackaging: false
    },
    financials: {
      totalProductUSD: 215.00,
      commissionPercent: 8,
      commissionUSD: 17.20,
      baseFeeUSD: 20.00,
      totalFeeUSD: 37.20,
      exchangeRateBOB: 6.96,
      totalFeeBOB: 258.91,
      feePaymentStatus: 'paid',
      feePaymentMethod: 'QR Simple Banco Unión',
      feePaidAt: '2026-11-06T15:30:00.000Z'
    },
    status: 'recepcionado',
    statusHistory: [
      {
        status: 'pedido',
        timestamp: '2026-11-06T11:20:00.000Z',
        note: 'Pre-alerta enviada con tracking UPS'
      },
      {
        status: 'pagado_fee',
        timestamp: '2026-11-06T15:30:00.000Z',
        note: 'Fee pagado por QR'
      },
      {
        status: 'recepcionado',
        timestamp: '2026-11-09T16:45:00.000Z',
        note: 'Recibido en almacén Queens NY. Pesaje 3.2 lbs, caja intacta.'
      }
    ],
    purchaseDetails: {
      boughtAt: '2026-11-05T00:00:00.000Z',
      buyerNote: 'Comprado directamente por el cliente en Nike.com',
      storeReceiptNumber: 'NIKE-ORD-88219',
      storeLocation: 'Online Nike.com'
    },
    warehouseDetails: {
      receivedAt: '2026-11-09T16:45:00.000Z',
      weightLbs: 3.2,
      packagesCount: 1,
      photoEvidenceUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=400&q=80'
    },
    deliveryDetails: {
      deliveredAt: null,
      receivedBy: '',
      deliveryNote: 'Programado para vuelo JFK 3 de Dic'
    }
  },
  {
    id: 'NY-2024-8840',
    createdAt: '2026-11-02T09:10:00.000Z',
    clientName: 'Alejandra Roca Vaca',
    clientPhone: '59178099881',
    suiteCode: 'NY-BOL-6219',
    destinationCity: 'Santa Cruz de la Sierra (Urbarí)',
    deliveryMethod: 'delivery',
    deliveryAddress: 'Condominio La Casona, Casa #14',
    modality: 'assisted',
    items: [
      {
        id: 'item-8840-1',
        storeName: 'Best Buy Midtown',
        category: 'Electrónica / Celulares / Laptops',
        productName: 'Sony Auriculares Noise Cancelling WH-1000XM5',
        productUrl: 'https://www.bestbuy.com',
        quantity: 1,
        priceUSD: 248.00,
        notes: 'Color Plata / Silver'
      }
    ],
    trackingUSA: 'UPS-883910283',
    specialInstructions: {
      optimizeWeight: true,
      photoInspection: true,
      holidayPackaging: true
    },
    financials: {
      totalProductUSD: 248.00,
      commissionPercent: 8,
      commissionUSD: 19.84,
      baseFeeUSD: 20.00,
      totalFeeUSD: 39.84,
      exchangeRateBOB: 6.96,
      totalFeeBOB: 277.29,
      feePaymentStatus: 'paid',
      feePaymentMethod: 'QR Simple Banco Fassil',
      feePaidAt: '2026-11-02T10:00:00.000Z'
    },
    status: 'entregado',
    statusHistory: [
      {
        status: 'pedido',
        timestamp: '2026-11-02T09:10:00.000Z',
        note: 'Pedido de auriculares'
      },
      {
        status: 'pagado_fee',
        timestamp: '2026-11-02T10:00:00.000Z',
        note: 'Fee cancelado por QR'
      },
      {
        status: 'recepcionado',
        timestamp: '2026-11-04T12:00:00.000Z',
        note: 'Comprado en Best Buy 5th Ave y verificado'
      },
      {
        status: 'entregado',
        timestamp: '2026-11-08T17:00:00.000Z',
        note: 'Entregado personalmente a domicilio en Urbarí. Cliente satisfecho.'
      }
    ],
    purchaseDetails: {
      boughtAt: '2026-11-03T16:20:00.000Z',
      buyerNote: 'Comprado en Best Buy 5th Ave con descuento Early Black Friday',
      storeReceiptNumber: 'BB-992384',
      storeLocation: 'Best Buy 5th & 44th St'
    },
    warehouseDetails: {
      receivedAt: '2026-11-04T12:00:00.000Z',
      weightLbs: 1.5,
      packagesCount: 1,
      photoEvidenceUrl: ''
    },
    deliveryDetails: {
      deliveredAt: '2026-11-08T17:00:00.000Z',
      receivedBy: 'Alejandra Roca Vaca (Personal)',
      deliveryNote: 'Firma de conformidad registrada'
    }
  }
];

// SSR in-memory memory fallback
let inMemoryOrders: Order[] = [...SEED_ORDERS];
let inMemoryConfig: SystemConfig = { ...DEFAULT_CONFIG };

/**
 * Single source of truth calculation helper used across forms, calculators & storage.
 */
export function calculateFinancials(
  items: Array<{ priceUSD: number; quantity: number }>,
  customCommissionPercent?: number,
  customBaseFeeUSD?: number,
  customExchangeRateBOB?: number,
  config?: SystemConfig
): OrderFinancials {
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
    feePaidAt: null
  };
}

export class OrdersService implements IOrdersService {
  constructor() {
    this.ensureLocalStorageInitialized();
  }

  private isClient(): boolean {
    return typeof window !== 'undefined';
  }

  private ensureLocalStorageInitialized(): void {
    if (!this.isClient()) return;
    try {
      if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SEED_ORDERS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.CONFIG)) {
        localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_CONFIG));
      }
    } catch (e) {
      console.warn('[OrdersService] Unable to access LocalStorage:', e);
    }
  }

  private broadcastChange(event: string, payload: unknown): void {
    if (!this.isClient()) return;
    try {
      window.dispatchEvent(new CustomEvent('orders_db_changed', { detail: { event, payload } }));
    } catch {
      // Ignored in non-browser environments
    }
  }

  public getConfig(): SystemConfig {
    if (!this.isClient()) return inMemoryConfig;
    try {
      const cfg = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return cfg ? { ...DEFAULT_CONFIG, ...JSON.parse(cfg) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  }

  public saveConfig(newConfig: Partial<SystemConfig>): SystemConfig {
    const updated = { ...this.getConfig(), ...newConfig };
    if (!this.isClient()) {
      inMemoryConfig = updated;
      return updated;
    }
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(updated));
      this.broadcastChange('config_updated', updated);
    } catch (e) {
      console.error('[OrdersService] Error writing config:', e);
    }
    return updated;
  }

  public async getOrders(): Promise<Order[]> {
    // 1. Live Firebase Firestore path
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const firestoreOrders: Order[] = snapshot.docs.map(d => d.data() as Order);
        if (firestoreOrders.length > 0) {
          if (this.isClient()) {
            localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(firestoreOrders));
          }
          return firestoreOrders;
        }
      } catch (err) {
        console.warn('⚠️ [OrdersService] Firestore read failed; falling back to offline LocalStorage:', err);
      }
    }

    // 2. Offline LocalStorage path
    if (this.isClient()) {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
        if (raw) return JSON.parse(raw) as Order[];
      } catch (e) {
        console.error('[OrdersService] Error reading LocalStorage:', e);
      }
    }

    // 3. In-memory SSR fallback
    return inMemoryOrders;
  }

  public async getOrderById(id: string): Promise<Order | null> {
    const cleanId = (id || '').trim();
    if (!cleanId) return null;

    // 1. Live Firebase Firestore path
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'orders', cleanId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return docSnap.data() as Order;
        }
      } catch (err) {
        console.warn('⚠️ [OrdersService] Firestore doc fetch failed; checking LocalStorage:', err);
      }
    }

    // 2. Offline LocalStorage path
    const orders = await this.getOrders();
    const found = orders.find(
      o => o.id === cleanId || o.id.toLowerCase() === cleanId.toLowerCase()
    );
    return found || null;
  }

  public async createOrder(input: CreateOrderInput): Promise<Order> {
    const config = this.getConfig();
    const now = new Date().toISOString();
    const currentYear = new Date().getFullYear();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const orderId = `NY-${currentYear}-${randomDigits}`;

    // Normalize phone (strip non-digits, ensure +591 Bolivia country prefix if missing)
    let sanitizedPhone = input.clientPhone.replace(/\D/g, '');
    if (!sanitizedPhone.startsWith('591') && sanitizedPhone.length === 8) {
      sanitizedPhone = `591${sanitizedPhone}`;
    }

    // Items normalization with generated IDs
    const normalizedItems: OrderItem[] = input.items.map((item, idx) => ({
      id: item.id || `item-${randomDigits}-${idx + 1}`,
      storeName: item.storeName || 'Tienda USA',
      category: item.category || 'Varios',
      productName: item.productName || 'Producto sin nombre',
      productUrl: item.productUrl || '',
      quantity: Math.max(1, Number(item.quantity) || 1),
      priceUSD: Math.max(0, Number(item.priceUSD) || 0),
      trackingUSA: item.trackingUSA || input.trackingUSA || '',
      notes: item.notes || ''
    }));

    // Financial breakdown
    const financials = calculateFinancials(
      normalizedItems,
      input.customCommissionPercent,
      input.customBaseFeeUSD,
      input.customExchangeRateBOB,
      config
    );

    const newOrder: Order = {
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
        holidayPackaging: input.specialInstructions?.holidayPackaging ?? false
      },
      invoiceFileName: input.invoiceFileName || '',
      invoiceFileUrl: input.invoiceFileUrl || '',
      financials,
      status: 'pedido',
      statusHistory: [
        {
          status: 'pedido',
          timestamp: now,
          note: `Pedido registrado por el cliente vía web (${input.modality === 'prealert' ? 'Pre-Alerta' : 'Compra Asistida'}).`
        }
      ],
      purchaseDetails: {
        boughtAt: input.modality === 'prealert' ? now : null,
        buyerNote: input.modality === 'prealert' ? 'Comprado por el cliente en USA' : 'Pendiente pago del fee para compra en Manhattan',
        storeReceiptNumber: '',
        storeLocation: normalizedItems[0]?.storeName || ''
      },
      warehouseDetails: {
        receivedAt: null,
        weightLbs: 0,
        packagesCount: normalizedItems.length,
        photoEvidenceUrl: ''
      },
      deliveryDetails: {
        deliveredAt: null,
        receivedBy: '',
        deliveryNote: ''
      }
    };

    // 1. Write to Live Firestore if configured
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'orders', newOrder.id), newOrder);
      } catch (err) {
        console.warn('⚠️ [OrdersService] Firestore setDoc failed; saving to LocalStorage fallback:', err);
      }
    }

    // 2. Save into LocalStorage
    if (this.isClient()) {
      try {
        const orders = await this.getOrders();
        orders.unshift(newOrder);
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        this.broadcastChange('orders_updated', newOrder);
      } catch (e) {
        console.error('[OrdersService] Error writing to LocalStorage:', e);
      }
    } else {
      inMemoryOrders.unshift(newOrder);
    }

    return newOrder;
  }

  public async updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    note?: string,
    extraData: Partial<Order> = {}
  ): Promise<Order | null> {
    const orders = await this.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) return null;

    const order = { ...orders[index] };
    const prevStatus = order.status;
    const now = new Date().toISOString();

    order.status = newStatus;
    order.statusHistory = [
      ...order.statusHistory,
      {
        status: newStatus,
        timestamp: now,
        note: note || `Cambio de estado: de "${this.getStatusLabel(prevStatus)}" a "${this.getStatusLabel(newStatus)}"`
      }
    ];

    // Status-specific automated side effects
    if (newStatus === 'pagado_fee' && order.financials.feePaymentStatus !== 'paid') {
      order.financials.feePaymentStatus = 'paid';
      order.financials.feePaidAt = now;
    }

    if (newStatus === 'recepcionado' && !order.warehouseDetails.receivedAt) {
      order.warehouseDetails.receivedAt = now;
      if (extraData.warehouseDetails?.weightLbs) {
        order.warehouseDetails.weightLbs = extraData.warehouseDetails.weightLbs;
      }
      if (extraData.warehouseDetails?.photoEvidenceUrl) {
        order.warehouseDetails.photoEvidenceUrl = extraData.warehouseDetails.photoEvidenceUrl;
      }
    }

    if (newStatus === 'entregado' && !order.deliveryDetails.deliveredAt) {
      order.deliveryDetails.deliveredAt = now;
      if (extraData.deliveryDetails?.receivedBy) {
        order.deliveryDetails.receivedBy = extraData.deliveryDetails.receivedBy;
      }
      if (extraData.deliveryDetails?.deliveryNote) {
        order.deliveryDetails.deliveryNote = extraData.deliveryDetails.deliveryNote;
      }
    }

    // Merge extra fields
    if (extraData.purchaseDetails) {
      order.purchaseDetails = { ...order.purchaseDetails, ...extraData.purchaseDetails };
    }

    // Write to Firestore if configured
    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'orders', order.id), order as any);
      } catch (err) {
        console.warn('[OrdersService] Firestore update error:', err);
      }
    }

    // Write to LocalStorage
    orders[index] = order;
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      this.broadcastChange('orders_updated', order);
    } else {
      inMemoryOrders = orders;
    }

    return order;
  }

  public async updateOrderFeePayment(
    orderId: string,
    paymentStatus: FeePaymentStatus,
    paymentMethod?: string,
    note?: string
  ): Promise<Order | null> {
    const orders = await this.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) return null;

    const order = { ...orders[index] };
    const now = new Date().toISOString();

    order.financials.feePaymentStatus = paymentStatus;
    if (paymentMethod) order.financials.feePaymentMethod = paymentMethod;

    if (paymentStatus === 'paid') {
      order.financials.feePaidAt = now;
      // Auto-advance from 'pedido' to 'pagado_fee'
      if (order.status === 'pedido') {
        order.status = 'pagado_fee';
        order.statusHistory.push({
          status: 'pagado_fee',
          timestamp: now,
          note: note || `Fee verificado (${paymentMethod || order.financials.feePaymentMethod || 'Bancarizado'}). Listo para compra / despacho.`
        });
      }
    } else {
      order.financials.feePaidAt = null;
    }

    // Sync Firestore
    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'orders', order.id), order as any);
      } catch (err) {
        console.warn('[OrdersService] Firestore payment update error:', err);
      }
    }

    orders[index] = order;
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      this.broadcastChange('orders_updated', order);
    } else {
      inMemoryOrders = orders;
    }

    return order;
  }

  public async deleteOrder(orderId: string): Promise<boolean> {
    // Delete Firestore
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'orders', orderId));
      } catch (err) {
        console.warn('[OrdersService] Firestore deleteDoc error:', err);
      }
    }

    const orders = (await this.getOrders()).filter(o => o.id !== orderId);
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      this.broadcastChange('orders_updated', { id: orderId, deleted: true });
    } else {
      inMemoryOrders = orders;
    }
    return true;
  }

  public async resetToDefault(): Promise<void> {
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SEED_ORDERS));
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_CONFIG));
      this.broadcastChange('orders_updated', null);
    } else {
      inMemoryOrders = [...SEED_ORDERS];
      inMemoryConfig = { ...DEFAULT_CONFIG };
    }
  }

  public async getMetrics(): Promise<OrderMetrics> {
    const orders = await this.getOrders();
    let countPedido = 0;
    let countPagadoFee = 0;
    let countRecepcionado = 0;
    let countEntregado = 0;

    let totalProductsValueUSD = 0;
    let totalCommissionsUSD = 0;
    let totalFeesCollectedUSD = 0;
    let totalFeesPendingUSD = 0;

    orders.forEach(o => {
      if (o.status === 'pedido') countPedido++;
      if (o.status === 'pagado_fee') countPagadoFee++;
      if (o.status === 'recepcionado') countRecepcionado++;
      if (o.status === 'entregado') countEntregado++;

      const pUSD = Number(o.financials.totalProductUSD) || 0;
      const cUSD = Number(o.financials.commissionUSD) || 0;
      const fUSD = Number(o.financials.totalFeeUSD) || 0;

      totalProductsValueUSD += pUSD;
      totalCommissionsUSD += cUSD;

      if (o.financials.feePaymentStatus === 'paid') {
        totalFeesCollectedUSD += fUSD;
      } else {
        totalFeesPendingUSD += fUSD;
      }
    });

    return {
      totalOrders: orders.length,
      countPedido,
      countPagadoFee,
      countRecepcionado,
      countEntregado,
      totalProductsValueUSD: Number(totalProductsValueUSD.toFixed(2)),
      totalCommissionsUSD: Number(totalCommissionsUSD.toFixed(2)),
      totalFeesCollectedUSD: Number(totalFeesCollectedUSD.toFixed(2)),
      totalFeesPendingUSD: Number(totalFeesPendingUSD.toFixed(2))
    };
  }

  public getStatusLabel(status: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
      pedido: '1. Pedido Registrado',
      pagado_fee: '2. Pagado el Fee',
      recepcionado: '3. Recepcionado NY',
      entregado: '4. Entregado en Bolivia'
    };
    return map[status] || status;
  }

  public getStatusBadge(status: OrderStatus): StatusBadgeConfig {
    const map: Record<OrderStatus, StatusBadgeConfig> = {
      pedido: {
        label: 'Pedido Registrado',
        pillClasses: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
        dotClasses: 'bg-amber-400 animate-pulse',
        stepNumber: 1
      },
      pagado_fee: {
        label: 'Fee Confirmado',
        pillClasses: 'bg-sky-500/10 text-sky-400 border border-sky-500/30',
        dotClasses: 'bg-sky-400',
        stepNumber: 2
      },
      recepcionado: {
        label: 'Recepcionado NY',
        pillClasses: 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
        dotClasses: 'bg-purple-400',
        stepNumber: 3
      },
      entregado: {
        label: 'Entregado Bolivia',
        pillClasses: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
        dotClasses: 'bg-emerald-400',
        stepNumber: 4
      }
    };
    return map[status] || {
      label: status,
      pillClasses: 'bg-slate-500/10 text-slate-400 border border-slate-500/30',
      dotClasses: 'bg-slate-400',
      stepNumber: 0
    };
  }

  public getWhatsAppShareUrl(order: Order): string {
    const phone = order.clientPhone || DEFAULT_CONFIG.whatsappSupportNumber;
    const cleanPhone = phone.startsWith('591') ? phone : `591${phone}`;

    let msg = `Hola ${order.clientName}, te escribimos de *NY2Bolivia Express* respecto a tu orden *${order.id}*.\n\n`;

    if (order.status === 'pedido') {
      msg += `📌 *Estado Actual:* 1. Pedido Registrado.\n`;
      msg += `🛍️ *Productos:* ${order.items.map(i => i.productName).join(', ')}\n`;
      msg += `💵 *Fee de Reserva + Comisión (${order.financials.commissionPercent}%):* $${order.financials.totalFeeUSD} USD (${order.financials.totalFeeBOB} Bs).\n`;
      msg += `Quedamos atentos a tu comprobante QR / transferencia para procesar tu encargo en New York. ¡Gracias!`;
    } else if (order.status === 'pagado_fee') {
      msg += `✅ *Estado Actual:* 2. Fee Confirmado.\n`;
      msg += `Tu pago de reserva/comisión de $${order.financials.totalFeeUSD} USD fue recibido con éxito.\n`;
      msg += `Nuestro equipo en Manhattan se encargará de validar tus artículos para el vuelo directo a Bolivia.`;
    } else if (order.status === 'recepcionado') {
      msg += `📦 *Estado Actual:* 3. ¡Paquete Recepcionado en New York!\n`;
      msg += `Tus artículos ya están en el almacén de Queens/JFK, verificados e inspeccionados para el vuelo directo a Bolivia.`;
    } else if (order.status === 'entregado') {
      msg += `🎉 *Estado Actual:* 4. ¡Pedido Entregado con Éxito!\n`;
      msg += `Tu encargo ha sido entregado en ${order.destinationCity}. ¡Gracias por confiar en Andean Skyline Logistics!`;
    }

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  }
}

export const ordersService = new OrdersService();
export default ordersService;
