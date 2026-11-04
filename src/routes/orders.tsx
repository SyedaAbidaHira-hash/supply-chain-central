import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable, DetailList, PageHeader, LoadError } from "@/components/scm/data-table";
import { scmQuery, money, fmt, type Order } from "@/lib/scm.functions";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Orders — Freightline" },
      { name: "description", content: "Purchase orders placed with suppliers and their line items." },
      { property: "og:title", content: "Orders — Freightline" },
      { property: "og:description", content: "Purchase orders placed with suppliers and their line items." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(scmQuery),
  errorComponent: LoadError,
  component: OrdersPage,
});

function OrdersPage() {
  const { data } = useSuspenseQuery(scmQuery);
  return (
    <>
      <PageHeader title="Orders" description="Purchase orders placed with suppliers." />
      <DataTable<Order>
        rows={data.orders}
        searchPlaceholder="Search by order number, supplier, product…"
        searchText={(o) => `${o.orderId} ${o.supplier} ${o.date} ${o.lines.map((l) => l.product).join(" ")}`}
        columns={[
          { key: "id", header: "Order", sortValue: (o) => o.orderId, cell: (o) => <span className="font-mono text-xs font-medium">#{o.orderId}</span> },
          { key: "sup", header: "Supplier", sortValue: (o) => o.supplier, cell: (o) => <span className="font-medium">{o.supplier}</span> },
          { key: "date", header: "Date", sortValue: (o) => o.date, cell: (o) => o.date },
          { key: "lines", header: "Items", align: "right", sortValue: (o) => o.lines.reduce((a, l) => a + l.quantity, 0), cell: (o) => fmt(o.lines.reduce((a, l) => a + l.quantity, 0)) },
          { key: "total", header: "Total", align: "right", sortValue: (o) => o.total, cell: (o) => money(o.total) },
        ]}
        detailTitle={(o) => `Order #${o.orderId}`}
        detailSubtitle={(o) => `${o.supplier} · ${o.date}`}
        renderDetail={(o) => (
          <>
            <DetailList items={[["Supplier", o.supplier], ["Date", o.date], ["Order total", money(o.total)]]} />
            <div>
              <h3 className="mb-2 text-sm font-semibold">Line items ({o.lines.length})</h3>
              <ul className="divide-y rounded-lg border text-sm">
                {o.lines.map((l, i) => (
                  <li key={i} className="flex justify-between gap-4 px-4 py-2.5">
                    <span>{l.product}</span>
                    <span className="tabular-nums text-muted-foreground">{fmt(l.quantity)} × {money(l.unitPrice)}</span>
                  </li>
                ))}
                {o.lines.length === 0 && <li className="px-4 py-2.5 text-muted-foreground">No line items</li>}
              </ul>
            </div>
          </>
        )}
      />
    </>
  );
}
