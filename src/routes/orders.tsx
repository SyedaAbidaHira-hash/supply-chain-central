import { createFileRoute } from "@tanstack/react-router";
import { DataTable, DetailList, PageHeader, Mono } from "@/components/scm/data-table";
import { StatusBadge } from "@/components/scm/status";
import { orders, warehouseById, money, num, type Order } from "@/lib/mock-data";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Orders — Freightline" },
      { name: "description", content: "Customer orders, fulfillment status and carriers." },
      { property: "og:title", content: "Orders — Freightline" },
      { property: "og:description", content: "Customer orders, fulfillment status and carriers." },
    ],
  }),
  component: OrdersPage,
});

const steps: Order["status"][] = ["Pending", "Processing", "Shipped", "Delivered"];

function OrdersPage() {
  return (
    <>
      <PageHeader title="Orders" description="Outbound customer orders and their fulfillment." />
      <DataTable<Order>
        rows={orders}
        searchPlaceholder="Search by order ID, customer, carrier…"
        searchText={(o) => `${o.id} ${o.customer} ${o.carrier} ${warehouseById(o.warehouseId)?.name}`}
        filter={{ label: "Statuses", options: [...steps, "Cancelled"], value: (o) => o.status }}
        columns={[
          { key: "id", header: "Order", sortValue: (o) => o.id, cell: (o) => <span className="font-mono text-xs font-medium">{o.id}</span> },
          { key: "cust", header: "Customer", sortValue: (o) => o.customer, cell: (o) => <span className="font-medium">{o.customer}</span> },
          { key: "date", header: "Date", sortValue: (o) => o.date, cell: (o) => o.date },
          { key: "wh", header: "Warehouse", cell: (o) => warehouseById(o.warehouseId)?.name },
          { key: "items", header: "Items", align: "right", sortValue: (o) => o.items, cell: (o) => num(o.items) },
          { key: "total", header: "Total", align: "right", sortValue: (o) => o.total, cell: (o) => money(o.total) },
          { key: "status", header: "Status", cell: (o) => <StatusBadge status={o.status} /> },
        ]}
        detailTitle={(o) => o.customer}
        detailSubtitle={(o) => `${o.id} · ${o.date}`}
        renderDetail={(o) => {
          const at = steps.indexOf(o.status);
          return (
            <>
              {o.status !== "Cancelled" && (
                <ol className="flex gap-2">
                  {steps.map((s, i) => (
                    <li key={s} className="flex-1">
                      <div className={`h-1.5 rounded-full ${i <= at ? "bg-primary" : "bg-muted"}`} />
                      <p className={`mt-1.5 text-xs ${i <= at ? "text-foreground" : "text-muted-foreground"}`}>{s}</p>
                    </li>
                  ))}
                </ol>
              )}
              <DetailList items={[
                ["Status", <StatusBadge status={o.status} />],
                ["Ship from", warehouseById(o.warehouseId)?.name], ["Carrier", o.carrier],
                ["Items", num(o.items)], ["Order total", money(o.total)],
              ]} />
              <Mono>Tracking: {o.carrier.slice(0, 3).toUpperCase()}-{o.id.replace("ORD-", "")}-7781</Mono>
            </>
          );
        }}
      />
    </>
  );
}
