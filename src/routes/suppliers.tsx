import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable, DetailList, PageHeader, Mono, LoadError } from "@/components/scm/data-table";
import { scmQuery, money, type Supplier } from "@/lib/scm.functions";

export const Route = createFileRoute("/suppliers")({
  head: () => ({
    meta: [
      { title: "Suppliers — Freightline" },
      { name: "description", content: "Browse your supplier network and purchase history." },
      { property: "og:title", content: "Suppliers — Freightline" },
      { property: "og:description", content: "Browse your supplier network and purchase history." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(scmQuery),
  errorComponent: LoadError,
  component: SuppliersPage,
});

function SuppliersPage() {
  const { data } = useSuspenseQuery(scmQuery);
  return (
    <>
      <PageHeader title="Suppliers" description="Vendors supplying your products." />
      <DataTable<Supplier>
        rows={data.suppliers}
        searchPlaceholder="Search by name, email, address…"
        searchText={(s) => `${s.supplierId} ${s.name} ${s.email} ${s.phone} ${s.address}`}
        columns={[
          { key: "name", header: "Supplier", sortValue: (s) => s.name, cell: (s) => <div><p className="font-medium">{s.name}</p><Mono>#{s.supplierId}</Mono></div> },
          { key: "email", header: "Email", cell: (s) => s.email },
          { key: "phone", header: "Phone", cell: (s) => <Mono>{s.phone}</Mono> },
          { key: "addr", header: "Address", sortValue: (s) => s.address, cell: (s) => <span className="line-clamp-1 max-w-64">{s.address}</span> },
          { key: "orders", header: "Orders", align: "right", sortValue: (s) => s.orderCount, cell: (s) => s.orderCount },
          { key: "spend", header: "Spend", align: "right", sortValue: (s) => s.orderTotal, cell: (s) => money(s.orderTotal) },
        ]}
        detailTitle={(s) => s.name}
        detailSubtitle={(s) => `Supplier #${s.supplierId}`}
        renderDetail={(s) => {
          const orders = data.orders.filter((o) => o.supplier === s.name);
          return (
            <>
              <DetailList items={[["Email", s.email], ["Phone", s.phone], ["Address", s.address], ["Orders", s.orderCount], ["Total spend", money(s.orderTotal)]]} />
              <div>
                <h3 className="mb-2 text-sm font-semibold">Orders ({orders.length})</h3>
                <ul className="divide-y rounded-lg border text-sm">
                  {orders.map((o) => <li key={o.id} className="flex justify-between px-4 py-2.5"><span>#{o.orderId} · {o.date}</span><span className="tabular-nums">{money(o.total)}</span></li>)}
                  {orders.length === 0 && <li className="px-4 py-2.5 text-muted-foreground">No orders</li>}
                </ul>
              </div>
            </>
          );
        }}
      />
    </>
  );
}
