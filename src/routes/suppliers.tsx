import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { DataTable, DetailList, PageHeader, Mono } from "@/components/scm/data-table";
import { StatusBadge } from "@/components/scm/status";
import { suppliers, products, money, type Supplier } from "@/lib/mock-data";

export const Route = createFileRoute("/suppliers")({
  head: () => ({
    meta: [
      { title: "Suppliers — Freightline" },
      { name: "description", content: "Browse and review your supplier network, ratings and lead times." },
      { property: "og:title", content: "Suppliers — Freightline" },
      { property: "og:description", content: "Browse and review your supplier network, ratings and lead times." },
    ],
  }),
  component: SuppliersPage,
});

function SuppliersPage() {
  return (
    <>
      <PageHeader title="Suppliers" description="Vendors supplying materials and components." />
      <DataTable<Supplier>
        rows={suppliers}
        searchPlaceholder="Search by name, contact, country…"
        searchText={(s) => `${s.id} ${s.name} ${s.contact} ${s.country} ${s.category}`}
        filter={{ label: "Statuses", options: ["Active", "On Hold", "Inactive"], value: (s) => s.status }}
        columns={[
          { key: "name", header: "Supplier", sortValue: (s) => s.name, cell: (s) => <div><p className="font-medium">{s.name}</p><Mono>{s.id}</Mono></div> },
          { key: "cat", header: "Category", cell: (s) => s.category },
          { key: "country", header: "Country", sortValue: (s) => s.country, cell: (s) => s.country },
          { key: "rating", header: "Rating", align: "right", sortValue: (s) => s.rating, cell: (s) => <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-warning text-warning" />{s.rating.toFixed(1)}</span> },
          { key: "lead", header: "Lead time", align: "right", sortValue: (s) => s.leadTimeDays, cell: (s) => `${s.leadTimeDays} days` },
          { key: "status", header: "Status", cell: (s) => <StatusBadge status={s.status} /> },
        ]}
        detailTitle={(s) => s.name}
        detailSubtitle={(s) => s.id}
        renderDetail={(s) => {
          const supplied = products.filter((p) => p.supplierId === s.id);
          return (
            <>
              <DetailList items={[
                ["Status", <StatusBadge status={s.status} />],
                ["Contact", s.contact], ["Email", s.email], ["Phone", s.phone],
                ["Country", s.country], ["Category", s.category],
                ["Rating", `${s.rating.toFixed(1)} / 5`], ["Lead time", `${s.leadTimeDays} days`],
              ]} />
              <div>
                <h3 className="mb-2 text-sm font-semibold">Products supplied ({supplied.length})</h3>
                <ul className="divide-y rounded-lg border text-sm">
                  {supplied.map((p) => (
                    <li key={p.id} className="flex justify-between px-4 py-2.5"><span>{p.name}</span><span className="tabular-nums text-muted-foreground">{money(p.unitCost)}</span></li>
                  ))}
                  {supplied.length === 0 && <li className="px-4 py-2.5 text-muted-foreground">None</li>}
                </ul>
              </div>
            </>
          );
        }}
      />
    </>
  );
}
