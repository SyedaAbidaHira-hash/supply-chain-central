export type Supplier = {
  id: string; name: string; contact: string; email: string; phone: string;
  country: string; category: string; rating: number; leadTimeDays: number;
  status: "Active" | "On Hold" | "Inactive";
};
export type Product = {
  id: string; sku: string; name: string; category: string; supplierId: string;
  unitPrice: number; unitCost: number; weightKg: number; status: "Active" | "Discontinued" | "Draft";
};
export type Warehouse = {
  id: string; name: string; city: string; country: string; manager: string;
  capacity: number; used: number; type: "Distribution" | "Fulfillment" | "Cold Storage" | "Cross-dock";
  status: "Operational" | "Maintenance";
};
export type Order = {
  id: string; customer: string; date: string; items: number; total: number;
  warehouseId: string; carrier: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
};
export type InventoryItem = {
  id: string; productId: string; warehouseId: string; onHand: number;
  reserved: number; reorderPoint: number; lastRestock: string;
};

export const suppliers: Supplier[] = [
  { id: "SUP-001", name: "Nordic Steel AB", contact: "Erik Lindqvist", email: "erik@nordicsteel.se", phone: "+46 8 555 0192", country: "Sweden", category: "Raw Materials", rating: 4.8, leadTimeDays: 14, status: "Active" },
  { id: "SUP-002", name: "Shenzhen Circuitry Co.", contact: "Li Wei", email: "li.wei@szcircuit.cn", phone: "+86 755 8833 2210", country: "China", category: "Electronics", rating: 4.5, leadTimeDays: 21, status: "Active" },
  { id: "SUP-003", name: "Atlas Packaging Ltd", contact: "Sarah Hughes", email: "s.hughes@atlaspack.co.uk", phone: "+44 20 7946 0811", country: "United Kingdom", category: "Packaging", rating: 4.2, leadTimeDays: 7, status: "Active" },
  { id: "SUP-004", name: "Indus Textiles", contact: "Ahmed Raza", email: "ahmed@industextiles.pk", phone: "+92 21 3456 7890", country: "Pakistan", category: "Textiles", rating: 4.6, leadTimeDays: 18, status: "Active" },
  { id: "SUP-005", name: "Rheinland Polymers GmbH", contact: "Klaus Becker", email: "k.becker@rheinpoly.de", phone: "+49 221 555 0143", country: "Germany", category: "Plastics", rating: 3.9, leadTimeDays: 12, status: "On Hold" },
  { id: "SUP-006", name: "Pacific Logistics Supply", contact: "Maria Santos", email: "maria@pacls.ph", phone: "+63 2 8555 1234", country: "Philippines", category: "Components", rating: 4.1, leadTimeDays: 25, status: "Active" },
  { id: "SUP-007", name: "Andes Mining Corp", contact: "Diego Morales", email: "dmorales@andesmining.cl", phone: "+56 2 2555 7788", country: "Chile", category: "Raw Materials", rating: 3.6, leadTimeDays: 30, status: "Inactive" },
  { id: "SUP-008", name: "Kyoto Precision Parts", contact: "Haruto Tanaka", email: "tanaka@kyotoprecision.jp", phone: "+81 75 555 0456", country: "Japan", category: "Components", rating: 4.9, leadTimeDays: 10, status: "Active" },
];

export const products: Product[] = [
  { id: "PRD-101", sku: "STL-SHT-2MM", name: "Steel Sheet 2mm", category: "Raw Materials", supplierId: "SUP-001", unitPrice: 48.5, unitCost: 31.2, weightKg: 15.7, status: "Active" },
  { id: "PRD-102", sku: "PCB-CTRL-V3", name: "Controller PCB v3", category: "Electronics", supplierId: "SUP-002", unitPrice: 22.9, unitCost: 9.4, weightKg: 0.08, status: "Active" },
  { id: "PRD-103", sku: "BOX-CRG-L", name: "Corrugated Box (L)", category: "Packaging", supplierId: "SUP-003", unitPrice: 1.8, unitCost: 0.65, weightKg: 0.4, status: "Active" },
  { id: "PRD-104", sku: "TXT-CTN-ROLL", name: "Cotton Fabric Roll", category: "Textiles", supplierId: "SUP-004", unitPrice: 120, unitCost: 74, weightKg: 22, status: "Active" },
  { id: "PRD-105", sku: "PLY-PEL-HD", name: "HDPE Pellets 25kg", category: "Plastics", supplierId: "SUP-005", unitPrice: 39, unitCost: 27.5, weightKg: 25, status: "Active" },
  { id: "PRD-106", sku: "CMP-BRG-608", name: "Ball Bearing 608ZZ", category: "Components", supplierId: "SUP-008", unitPrice: 0.95, unitCost: 0.32, weightKg: 0.012, status: "Active" },
  { id: "PRD-107", sku: "PCB-SNS-V1", name: "Sensor Board v1", category: "Electronics", supplierId: "SUP-002", unitPrice: 15.4, unitCost: 6.1, weightKg: 0.05, status: "Discontinued" },
  { id: "PRD-108", sku: "CMP-SRV-MG9", name: "Micro Servo MG90", category: "Components", supplierId: "SUP-006", unitPrice: 4.2, unitCost: 1.9, weightKg: 0.014, status: "Active" },
  { id: "PRD-109", sku: "CU-ORE-1T", name: "Copper Concentrate 1t", category: "Raw Materials", supplierId: "SUP-007", unitPrice: 2850, unitCost: 2100, weightKg: 1000, status: "Draft" },
  { id: "PRD-110", sku: "BOX-PLT-WRP", name: "Pallet Stretch Wrap", category: "Packaging", supplierId: "SUP-003", unitPrice: 14.5, unitCost: 7.8, weightKg: 2.1, status: "Active" },
];

export const warehouses: Warehouse[] = [
  { id: "WH-01", name: "Rotterdam Hub", city: "Rotterdam", country: "Netherlands", manager: "Daan de Vries", capacity: 48000, used: 39200, type: "Distribution", status: "Operational" },
  { id: "WH-02", name: "Karachi Port Depot", city: "Karachi", country: "Pakistan", manager: "Fatima Khan", capacity: 30000, used: 21450, type: "Cross-dock", status: "Operational" },
  { id: "WH-03", name: "Dallas Fulfillment", city: "Dallas", country: "United States", manager: "Jordan Miller", capacity: 62000, used: 58100, type: "Fulfillment", status: "Operational" },
  { id: "WH-04", name: "Singapore Cold Chain", city: "Singapore", country: "Singapore", manager: "Tan Mei Ling", capacity: 18000, used: 9800, type: "Cold Storage", status: "Maintenance" },
  { id: "WH-05", name: "Dubai Free Zone", city: "Dubai", country: "UAE", manager: "Omar Al-Farsi", capacity: 40000, used: 27600, type: "Distribution", status: "Operational" },
];

export const orders: Order[] = [
  { id: "ORD-24081", customer: "Helix Manufacturing", date: "2026-10-31", items: 12, total: 18420, warehouseId: "WH-01", carrier: "Maersk", status: "Processing" },
  { id: "ORD-24080", customer: "BrightHome Retail", date: "2026-10-30", items: 340, total: 6120, warehouseId: "WH-03", carrier: "UPS Freight", status: "Shipped" },
  { id: "ORD-24079", customer: "Zenith Robotics", date: "2026-10-30", items: 1500, total: 3780, warehouseId: "WH-05", carrier: "DHL", status: "Delivered" },
  { id: "ORD-24078", customer: "Crescent Apparel", date: "2026-10-29", items: 48, total: 5760, warehouseId: "WH-02", carrier: "TCS Logistics", status: "Pending" },
  { id: "ORD-24077", customer: "Polar Foods", date: "2026-10-28", items: 22, total: 2310, warehouseId: "WH-04", carrier: "FedEx", status: "Cancelled" },
  { id: "ORD-24076", customer: "Helix Manufacturing", date: "2026-10-27", items: 8, total: 22800, warehouseId: "WH-01", carrier: "Maersk", status: "Delivered" },
  { id: "ORD-24075", customer: "Atlas Builders", date: "2026-10-26", items: 260, total: 12610, warehouseId: "WH-03", carrier: "XPO", status: "Shipped" },
  { id: "ORD-24074", customer: "Nova Electronics", date: "2026-10-25", items: 900, total: 20610, warehouseId: "WH-05", carrier: "DHL", status: "Delivered" },
  { id: "ORD-24073", customer: "Crescent Apparel", date: "2026-10-24", items: 30, total: 3600, warehouseId: "WH-02", carrier: "TCS Logistics", status: "Processing" },
  { id: "ORD-24072", customer: "Zenith Robotics", date: "2026-10-23", items: 2400, total: 10080, warehouseId: "WH-01", carrier: "Maersk", status: "Delivered" },
];

export const inventory: InventoryItem[] = [
  { id: "INV-001", productId: "PRD-101", warehouseId: "WH-01", onHand: 1240, reserved: 300, reorderPoint: 500, lastRestock: "2026-10-12" },
  { id: "INV-002", productId: "PRD-102", warehouseId: "WH-05", onHand: 180, reserved: 120, reorderPoint: 400, lastRestock: "2026-09-28" },
  { id: "INV-003", productId: "PRD-103", warehouseId: "WH-03", onHand: 15800, reserved: 2200, reorderPoint: 5000, lastRestock: "2026-10-20" },
  { id: "INV-004", productId: "PRD-104", warehouseId: "WH-02", onHand: 64, reserved: 40, reorderPoint: 80, lastRestock: "2026-10-02" },
  { id: "INV-005", productId: "PRD-105", warehouseId: "WH-01", onHand: 0, reserved: 0, reorderPoint: 120, lastRestock: "2026-08-15" },
  { id: "INV-006", productId: "PRD-106", warehouseId: "WH-05", onHand: 42000, reserved: 8000, reorderPoint: 10000, lastRestock: "2026-10-25" },
  { id: "INV-007", productId: "PRD-108", warehouseId: "WH-03", onHand: 3100, reserved: 900, reorderPoint: 1500, lastRestock: "2026-10-18" },
  { id: "INV-008", productId: "PRD-110", warehouseId: "WH-04", onHand: 210, reserved: 30, reorderPoint: 250, lastRestock: "2026-10-05" },
  { id: "INV-009", productId: "PRD-101", warehouseId: "WH-03", onHand: 860, reserved: 100, reorderPoint: 400, lastRestock: "2026-10-22" },
];

export const supplierById = (id: string) => suppliers.find((s) => s.id === id);
export const productById = (id: string) => products.find((p) => p.id === id);
export const warehouseById = (id: string) => warehouses.find((w) => w.id === id);

export function stockStatus(i: InventoryItem): "Out of Stock" | "Low Stock" | "In Stock" {
  if (i.onHand <= 0) return "Out of Stock";
  if (i.onHand <= i.reorderPoint) return "Low Stock";
  return "In Stock";
}

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: n < 10 ? 2 : 0 });
export const num = (n: number) => n.toLocaleString("en-US");
