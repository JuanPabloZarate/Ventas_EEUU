/**
 * NY2Bolivia Web (Andean Skyline Logistics)
 * Core TypeScript Data Models for Orders, Items, Financials & Configurations
 * Target: src/types/order.ts
 */

export type OrderStatus = 'pedido' | 'pagado_fee' | 'recepcionado' | 'entregado';

export type OrderModality = 'prealert' | 'assisted';
export type ServiceType = OrderModality; // Alias for backward-compatibility with orders-db.js

export type DeliveryMethod = 'pickup' | 'delivery';
export type PickupMode = DeliveryMethod;

export type FeePaymentStatus = 'pending' | 'paid';

export interface OrderStatusHistoryEntry {
  status: OrderStatus;
  timestamp: string; // ISO 8601 string
  note: string;
}

export interface OrderItem {
  id: string;
  storeName: string; // e.g. "Apple Store 5th Ave", "Amazon", "B&H Photo NYC"
  category: string;  // e.g. "Electrónica / Celulares / Laptops", "Perfumes & Cosméticos"
  productName: string;
  productUrl?: string;
  quantity: number;
  priceUSD: number;
  trackingUSA?: string; // Pre-alerta specific per-item tracking (if shipped separately)
  notes?: string;
}

export interface SpecialInstructions {
  optimizeWeight: boolean;   // Descartar cajas voluminosas externas de Amazon/UPS para ahorrar flete ($0)
  photoInspection: boolean;  // Verificación fotográfica en báscula FAA y contenido ($0)
  holidayPackaging: boolean; // Conservar empaque original de regalo / bolsas de marca
}

export interface OrderFinancials {
  totalProductUSD: number;
  commissionPercent: number; // e.g. 8 (%)
  commissionUSD: number;     // (totalProductUSD * commissionPercent) / 100
  baseFeeUSD: number;        // e.g. 20.00 USD (reserva de cupo en vuelo)
  totalFeeUSD: number;       // commissionUSD + baseFeeUSD
  exchangeRateBOB: number;   // e.g. 6.96 Bs/USD
  totalFeeBOB: number;       // totalFeeUSD * exchangeRateBOB
  feePaymentStatus: FeePaymentStatus;
  feePaymentMethod?: string; // "QR Simple Bancario", "Transferencia BCP", etc.
  feePaidAt?: string | null;
}

export interface PurchaseDetails {
  boughtAt: string | null;
  buyerNote: string;
  storeReceiptNumber: string;
  storeLocation: string;
}

export interface WarehouseDetails {
  receivedAt: string | null;
  weightLbs: number;
  packagesCount: number;
  photoEvidenceUrl: string;
}

export interface DeliveryDetails {
  deliveredAt: string | null;
  receivedBy: string;
  deliveryNote: string;
}

export interface Order {
  id: string; // e.g. "NY-2024-8841" or "NY-2026-9214"
  createdAt: string; // ISO 8601
  clientName: string;
  clientPhone: string; // Clean numeric phone with country code (e.g. "59177012345")
  suiteCode: string; // "NY-BOL-8492" or "SOLICITADA" or "NY-TEMP-XXXX"
  destinationCity: string; // "Santa Cruz de la Sierra", "La Paz", "Cochabamba", etc.
  deliveryMethod: DeliveryMethod;
  deliveryAddress?: string; // Detailed street address if deliveryMethod === 'delivery'
  modality: OrderModality; // 'prealert' (Ya compré online) | 'assisted' (Compra Asistida)
  items: OrderItem[];
  trackingUSA?: string; // General shipment tracking number for Pre-Alerta
  specialInstructions: SpecialInstructions;
  invoiceFileName?: string;
  invoiceFileUrl?: string; // Local preview object URL or Firebase Storage URL
  financials: OrderFinancials;
  status: OrderStatus;
  statusHistory: OrderStatusHistoryEntry[];
  purchaseDetails: PurchaseDetails;
  warehouseDetails: WarehouseDetails;
  deliveryDetails: DeliveryDetails;
}

export interface CreateOrderInput {
  clientName: string;
  clientPhone: string;
  suiteCode?: string;
  destinationCity: string;
  deliveryMethod: DeliveryMethod;
  deliveryAddress?: string;
  modality: OrderModality;
  items: Array<Omit<OrderItem, 'id'> & { id?: string }>;
  trackingUSA?: string;
  specialInstructions?: Partial<SpecialInstructions>;
  invoiceFileName?: string;
  invoiceFileUrl?: string;
  customCommissionPercent?: number;
  customBaseFeeUSD?: number;
  customExchangeRateBOB?: number;
}

export interface SystemConfig {
  adminPin: string;
  adminPassword: string;
  exchangeRateBOB: number;
  defaultCommissionRate: number; // 8%
  defaultBaseFeeUSD: number; // $20.00 USD
  airFreightRatePerLbUSD: number; // $9.50 USD / lb
  whatsappSupportNumber: string; // "59177012345"
  warehouseAddress: {
    title: string;
    company: string;
    addressLine1: string;
    suiteLine: string;
    cityStateZip: string;
    phone: string;
  };
}

export interface OrderMetrics {
  totalOrders: number;
  countPedido: number;
  countPagadoFee: number;
  countRecepcionado: number;
  countEntregado: number;
  totalProductsValueUSD: number;
  totalCommissionsUSD: number;
  totalFeesCollectedUSD: number;
  totalFeesPendingUSD: number;
}

export interface StatusBadgeConfig {
  label: string;
  pillClasses: string;
  dotClasses: string;
  stepNumber: number;
}
