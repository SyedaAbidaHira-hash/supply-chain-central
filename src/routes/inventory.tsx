import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable, DetailList, PageHeader, Mono, LoadError } from "@/components/scm/data-table";
import { StatusBadge } from "@/components/scm/status";
import { scmQuery, money, fmt, stockStatus, LOW_STOCK, type InventoryRow } from "@/lib/scm.functions";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory — Freightline" },
      { name: "description", content: "Stock quantities per product and warehouse." },
      { property: "og:title", content: "Inventory — Freightline" },
      { property: "og:description", content: "Stock quantities per product and warehouse." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(scmQuery),
  errorComponent: LoadError,
  component: InventoryPage,
});

function InventoryPage() {
  const { data } = useSuspenseQuery(scmQuery);
  return (
    <>
      <PageHeader title="Inventory" description={`Stock per product and location. Low stock means ${LOW_STOCK} units or fewer.`} />
      <DataTable<InventoryRow>
        rows={data.inventory}
        searchPlaceholder="Search by product, category, warehouse…"
        searchText={(i) => `${i.productId} ${i.product} ${i.category} ${i.warehouse}`}
        filter={{ label: "Stock levels", options: ["In Stock", "Low Stock", "Out of Stock"], value: (i) => stockStatus(i.qty) }}
        columns={[
          { key: "prod", header: "Product", sortValue: (i) => i.product, cell: (i) => <div><p className="font-medium">{i.product}</p><Mono>#{i.productId} · {i.category}</Mono></div> },
          { key: "wh", header: "Warehouse", sortValue: (i) => i.warehouse, cell: (i) => i.warehouse },
          { key: "qty", header: "Quantity", align: "right", sortValue: (i) => i.qty, cell: (i) => fmt(i.qty) },
          { key: "val", header: "Value", align: "right", sortValue: (i) => i.qty * i.price, cell: (i) => money(i.qty * i.price) },
          { key: "status", header: "Status", cell: (i) => <StatusBadge status={stockStatus(i.qty)} /> },
        ]}
        detailTitle={(i) => i.product}
        detailSubtitle={(i) => i.warehouse}
        renderDetail={(i) => (
          <DetailList items={[
            ["Status", <StatusBadge status={stockStatus(i.qty)} />],
            ["Category", i.category], ["Warehouse", i.warehouse],
            ["Quantity", fmt(i.qty)], ["Unit price", money(i.price)], ["Stock value", money(i.qty * i.price)],
          ]} />
        )}
      />
    </>
  );
}
