import { createFileRoute } from "@tanstack/react-router";
import { DataTable, DetailList, PageHeader, Mono } from "@/components/scm/data-table";
import { StatusBadge } from "@/components/scm/status";
import { inventory, productById, warehouseById, stockStatus, money, num, type InventoryItem } from "@/lib/mock-data";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory — Freightline" },
      { name: "description", content: "Stock on hand, reservations and reorder alerts across warehouses." },
      { property: "og:title", content: "Inventory — Freightline" },
      { property: "og:description", content: "Stock on hand, reservations and reorder alerts across warehouses." },
    ],
  }),
  component: InventoryPage,
});

function InventoryPage() {
  return (
    <>
      <PageHeader title="Inventory" description="Stock levels per product and location." />
      <DataTable<InventoryItem>
        rows={inventory}
        searchPlaceholder="Search by product, SKU, warehouse…"
        searchText={(i) => `${i.id} ${productById(i.productId)?.name} ${productById(i.productId)?.sku} ${warehouseById(i.warehouseId)?.name}`}
        filter={{ label: "Stock levels", options: ["In Stock", "Low Stock", "Out of Stock"], value: stockStatus }}
        columns={[
          { key: "prod", header: "Product", sortValue: (i) => productById(i.productId)?.name ?? "", cell: (i) => <div><p className="font-medium">{productById(i.productId)?.name}</p><Mono>{productById(i.productId)?.sku}</Mono></div> },
          { key: "wh", header: "Warehouse", cell: (i) => warehouseById(i.warehouseId)?.name },
          { key: "on", header: "On hand", align: "right", sortValue: (i) => i.onHand, cell: (i) => num(i.onHand) },
          { key: "avail", header: "Available", align: "right", sortValue: (i) => i.onHand - i.reserved, cell: (i) => num(i.onHand - i.reserved) },
          { key: "rp", header: "Reorder at", align: "right", cell: (i) => num(i.reorderPoint) },
          { key: "status", header: "Status", cell: (i) => <StatusBadge status={stockStatus(i)} /> },
        ]}
        detailTitle={(i) => productById(i.productId)?.name ?? i.id}
        detailSubtitle={(i) => `${i.id} · ${warehouseById(i.warehouseId)?.name}`}
        renderDetail={(i) => {
          const p = productById(i.productId);
          return (
            <DetailList items={[
              ["Status", <StatusBadge status={stockStatus(i)} />],
              ["On hand", num(i.onHand)], ["Reserved", num(i.reserved)],
              ["Available", num(i.onHand - i.reserved)], ["Reorder point", num(i.reorderPoint)],
              ["Stock value", p ? money(i.onHand * p.unitCost) : "—"],
              ["Last restock", i.lastRestock],
            ]} />
          );
        }}
      />
    </>
  );
}
