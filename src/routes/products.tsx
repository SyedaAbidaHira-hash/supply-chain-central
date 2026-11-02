import { createFileRoute } from "@tanstack/react-router";
import { DataTable, DetailList, PageHeader, Mono } from "@/components/scm/data-table";
import { StatusBadge } from "@/components/scm/status";
import { products, inventory, supplierById, warehouseById, money, num, type Product } from "@/lib/mock-data";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Freightline" },
      { name: "description", content: "Product catalog with SKUs, pricing, margins and suppliers." },
      { property: "og:title", content: "Products — Freightline" },
      { property: "og:description", content: "Product catalog with SKUs, pricing, margins and suppliers." },
    ],
  }),
  component: ProductsPage,
});

const categories = [...new Set(products.map((p) => p.category))];

function ProductsPage() {
  return (
    <>
      <PageHeader title="Products" description="Catalog of SKUs moving through your network." />
      <DataTable<Product>
        rows={products}
        searchPlaceholder="Search by name, SKU, category…"
        searchText={(p) => `${p.id} ${p.sku} ${p.name} ${p.category} ${supplierById(p.supplierId)?.name}`}
        filter={{ label: "Categories", options: categories, value: (p) => p.category }}
        columns={[
          { key: "name", header: "Product", sortValue: (p) => p.name, cell: (p) => <div><p className="font-medium">{p.name}</p><Mono>{p.sku}</Mono></div> },
          { key: "cat", header: "Category", cell: (p) => p.category },
          { key: "sup", header: "Supplier", cell: (p) => supplierById(p.supplierId)?.name },
          { key: "price", header: "Unit price", align: "right", sortValue: (p) => p.unitPrice, cell: (p) => money(p.unitPrice) },
          { key: "margin", header: "Margin", align: "right", sortValue: (p) => 1 - p.unitCost / p.unitPrice, cell: (p) => `${Math.round((1 - p.unitCost / p.unitPrice) * 100)}%` },
          { key: "status", header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
        ]}
        detailTitle={(p) => p.name}
        detailSubtitle={(p) => `${p.id} · ${p.sku}`}
        renderDetail={(p) => {
          const stock = inventory.filter((i) => i.productId === p.id);
          return (
            <>
              <DetailList items={[
                ["Status", <StatusBadge status={p.status} />],
                ["Category", p.category], ["Supplier", supplierById(p.supplierId)?.name],
                ["Unit price", money(p.unitPrice)], ["Unit cost", money(p.unitCost)],
                ["Margin", `${Math.round((1 - p.unitCost / p.unitPrice) * 100)}%`], ["Weight", `${p.weightKg} kg`],
              ]} />
              <div>
                <h3 className="mb-2 text-sm font-semibold">Stock by warehouse</h3>
                <ul className="divide-y rounded-lg border text-sm">
                  {stock.map((i) => (
                    <li key={i.id} className="flex justify-between px-4 py-2.5"><span>{warehouseById(i.warehouseId)?.name}</span><span className="tabular-nums">{num(i.onHand)}</span></li>
                  ))}
                  {stock.length === 0 && <li className="px-4 py-2.5 text-muted-foreground">Not stocked</li>}
                </ul>
              </div>
            </>
          );
        }}
      />
    </>
  );
}
