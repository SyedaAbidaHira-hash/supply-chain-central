import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable, DetailList, PageHeader, Mono, LoadError } from "@/components/scm/data-table";
import { StatusBadge } from "@/components/scm/status";
import { scmQuery, money, fmt, stockStatus, type Product } from "@/lib/scm.functions";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Freightline" },
      { name: "description", content: "Product catalog with categories, pricing and stock." },
      { property: "og:title", content: "Products — Freightline" },
      { property: "og:description", content: "Product catalog with categories, pricing and stock." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(scmQuery),
  errorComponent: LoadError,
  component: ProductsPage,
});

function ProductsPage() {
  const { data } = useSuspenseQuery(scmQuery);
  const categories = [...new Set(data.products.map((p) => p.category))].sort();
  return (
    <>
      <PageHeader title="Products" description="Your product catalog." />
      <DataTable<Product>
        rows={data.products}
        searchPlaceholder="Search by name, ID, category…"
        searchText={(p) => `${p.productId} ${p.name} ${p.category}`}
        filter={{ label: "Categories", options: categories, value: (p) => p.category }}
        columns={[
          { key: "name", header: "Product", sortValue: (p) => p.name, cell: (p) => <div><p className="font-medium">{p.name}</p><Mono>#{p.productId}</Mono></div> },
          { key: "cat", header: "Category", sortValue: (p) => p.category, cell: (p) => p.category },
          { key: "price", header: "Price", align: "right", sortValue: (p) => p.price, cell: (p) => money(p.price) },
          { key: "stock", header: "Total stock", align: "right", sortValue: (p) => p.totalStock, cell: (p) => fmt(p.totalStock) },
          { key: "status", header: "Status", cell: (p) => <StatusBadge status={stockStatus(p.totalStock)} /> },
        ]}
        detailTitle={(p) => p.name}
        detailSubtitle={(p) => `Product #${p.productId}`}
        renderDetail={(p) => (
          <>
            <DetailList items={[["Category", p.category], ["Price", money(p.price)], ["Total stock", fmt(p.totalStock)], ["Stock value", money(p.price * p.totalStock)]]} />
            <div>
              <h3 className="mb-2 text-sm font-semibold">Stock by warehouse</h3>
              <ul className="divide-y rounded-lg border text-sm">
                {p.stock.map((s) => <li key={s.warehouse} className="flex justify-between px-4 py-2.5"><span>{s.warehouse}</span><span className="tabular-nums">{fmt(s.qty)}</span></li>)}
                {p.stock.length === 0 && <li className="px-4 py-2.5 text-muted-foreground">Not stocked</li>}
              </ul>
            </div>
          </>
        )}
      />
    </>
  );
}
