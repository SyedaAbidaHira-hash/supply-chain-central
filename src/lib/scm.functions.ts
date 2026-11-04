import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { query } from "./db.server";

export type Supplier = { id: string; supplierId: number; name: string; phone: string; email: string; address: string; orderCount: number; orderTotal: number };
export type Product = { id: string; productId: number; name: string; category: string; price: number; totalStock: number; stock: { warehouse: string; qty: number }[] };
export type Warehouse = { id: string; warehouseId: number; name: string; location: string; capacity: number; stored: number; products: number };
export type OrderLine = { product: string; quantity: number; unitPrice: number };
export type Order = { id: string; orderId: number; supplier: string; date: string; total: number; lines: OrderLine[] };
export type InventoryRow = { id: string; product: string; productId: number; category: string; price: number; warehouse: string; warehouseId: number; qty: number };
export type ScmData = { suppliers: Supplier[]; products: Product[]; warehouses: Warehouse[]; orders: Order[]; inventory: InventoryRow[] };

type U = unknown;
type SupRow = { Supplier_ID: U; Supplier_Name: U; phone: U; Email: U; Address: U };
type ProdRow = { Product_ID: U; Product_Name: U; Category: U; Price: U };
type WhRow = { Warehouse_ID: U; warehouse_name: U; Location: U; Capacity: U };
type OrdRow = { order_id: U; supplier_id: U; order_date: U; total_amount: U };
type DetRow = { order_id: U; product_id: U; quantity: U; unit_price: U };
type InvRow = { warehouse_id: U; product_id: U; stock_quantity: U };

const num = (v: unknown) => Number(v ?? 0);

export const getScmData = createServerFn({ method: "GET" }).handler(async (): Promise<ScmData> => {
  const [sup, prod, wh, ord, det, inv] = await Promise.all([
    query<SupRow>("SELECT * FROM supplier"),
    query<ProdRow>("SELECT * FROM product"),
    query<WhRow>("SELECT * FROM warehouse"),
    query<OrdRow>("SELECT * FROM orders"),
    query<DetRow>("SELECT * FROM order_detail"),
    query<InvRow>("SELECT * FROM inventory"),
  ]);
  const prodName = new Map(prod.map((p) => [num(p.Product_ID), String(p.Product_Name)]));
  const whName = new Map(wh.map((w) => [num(w.Warehouse_ID), String(w.warehouse_name)]));
  const supName = new Map(sup.map((s) => [num(s.Supplier_ID), String(s.Supplier_Name)]));

  const inventory: InventoryRow[] = inv.map((r, i) => {
    const p = prod.find((x) => num(x.Product_ID) === num(r.product_id));
    return {
      id: `inv-${i}`, productId: num(r.product_id), warehouseId: num(r.warehouse_id),
      product: prodName.get(num(r.product_id)) ?? `Product #${num(r.product_id)}`,
      warehouse: whName.get(num(r.warehouse_id)) ?? `Warehouse #${num(r.warehouse_id)}`,
      category: String(p?.Category ?? "—"), price: num(p?.Price), qty: num(r.stock_quantity),
    };
  });

  return {
    suppliers: sup.map((s) => {
      const os = ord.filter((o) => num(o.supplier_id) === num(s.Supplier_ID));
      return {
        id: `sup-${num(s.Supplier_ID)}`, supplierId: num(s.Supplier_ID), name: String(s.Supplier_Name),
        phone: String(s.phone ?? ""), email: String(s.Email ?? ""), address: String(s.Address ?? ""),
        orderCount: os.length, orderTotal: os.reduce((a, o) => a + num(o.total_amount), 0),
      };
    }),
    products: prod.map((p) => {
      const stock = inventory.filter((i) => i.productId === num(p.Product_ID)).map((i) => ({ warehouse: i.warehouse, qty: i.qty }));
      return {
        id: `prd-${num(p.Product_ID)}`, productId: num(p.Product_ID), name: String(p.Product_Name),
        category: String(p.Category ?? "—"), price: num(p.Price), stock, totalStock: stock.reduce((a, s) => a + s.qty, 0),
      };
    }),
    warehouses: wh.map((w) => {
      const lines = inventory.filter((i) => i.warehouseId === num(w.Warehouse_ID));
      return {
        id: `wh-${num(w.Warehouse_ID)}`, warehouseId: num(w.Warehouse_ID), name: String(w.warehouse_name),
        location: String(w.Location ?? ""), capacity: num(w.Capacity),
        stored: lines.reduce((a, l) => a + l.qty, 0), products: lines.length,
      };
    }),
    orders: ord.map((o) => ({
      id: `ord-${num(o.order_id)}`, orderId: num(o.order_id),
      supplier: supName.get(num(o.supplier_id)) ?? `Supplier #${num(o.supplier_id)}`,
      date: String(o.order_date ?? "").slice(0, 10), total: num(o.total_amount),
      lines: det.filter((d) => num(d.order_id) === num(o.order_id)).map((d) => ({
        product: prodName.get(num(d.product_id)) ?? `Product #${num(d.product_id)}`,
        quantity: num(d.quantity), unitPrice: num(d.unit_price),
      })),
    })),
    inventory,
  };
});

export const scmQuery = queryOptions({ queryKey: ["scm"], queryFn: () => getScmData(), staleTime: 60_000 });

export const LOW_STOCK = 50;
export const stockStatus = (qty: number) => (qty <= 0 ? "Out of Stock" : qty <= LOW_STOCK ? "Low Stock" : "In Stock");
export const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
export const fmt = (n: number) => n.toLocaleString("en-US");
