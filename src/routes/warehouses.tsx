import { createFileRoute } from "@tanstack/react-router";
import { DataTable, DetailList, PageHeader, Mono } from "@/components/scm/data-table";
import { StatusBadge } from "@/components/scm/status";
import { Progress } from "@/components/ui/progress";
import { warehouses, inventory, orders, num, type Warehouse } from "@/lib/mock-data";

export const Route = createFileRoute("/warehouses")({
  head: () => ({
    meta: [
      { title: "Warehouses — Freightline" },
      { name: "description", content: "Warehouse locations, managers and capacity utilization." },
      { property: "og:title", content: "Warehouses — Freightline" },
      { property: "og:description", content: "Warehouse locations, managers and capacity utilization." },
    ],
  }),
  component: WarehousesPage,
});

const pct = (w: Warehouse) => Math.round((w.used / w.capacity) * 100);

function WarehousesPage() {
  return (
    <>
      <PageHeader title="Warehouses" description="Facilities and their current utilization." />
      <DataTable<Warehouse>
        rows={warehouses}
        searchPlaceholder="Search by name, city, manager…"
        searchText={(w) => `${w.id} ${w.name} ${w.city} ${w.country} ${w.manager} ${w.type}`}
        filter={{ label: "Types", options: ["Distribution", "Fulfillment", "Cold Storage", "Cross-dock"], value: (w) => w.type }}
        columns={[
          { key: "name", header: "Warehouse", sortValue: (w) => w.name, cell: (w) => <div><p className="font-medium">{w.name}</p><Mono>{w.id}</Mono></div> },
          { key: "loc", header: "Location", cell: (w) => `${w.city}, ${w.country}` },
          { key: "type", header: "Type", cell: (w) => w.type },
          { key: "mgr", header: "Manager", cell: (w) => w.manager },
          { key: "util", header: "Utilization", sortValue: pct, cell: (w) => <div className="flex w-36 items-center gap-2"><Progress value={pct(w)} className="h-1.5" /><span className="tabular-nums text-xs">{pct(w)}%</span></div> },
          { key: "status", header: "Status", cell: (w) => <StatusBadge status={w.status} /> },
        ]}
        detailTitle={(w) => w.name}
        detailSubtitle={(w) => w.id}
        renderDetail={(w) => (
          <>
            <div className="rounded-lg border p-4">
              <div className="mb-2 flex justify-between text-sm"><span className="text-muted-foreground">Capacity used</span><span className="font-medium">{pct(w)}%</span></div>
              <Progress value={pct(w)} />
              <p className="mt-2 text-xs text-muted-foreground">{num(w.used)} of {num(w.capacity)} m³</p>
            </div>
            <DetailList items={[
              ["Status", <StatusBadge status={w.status} />],
              ["Type", w.type], ["Location", `${w.city}, ${w.country}`], ["Manager", w.manager],
              ["Stock lines", inventory.filter((i) => i.warehouseId === w.id).length],
              ["Orders (30d)", orders.filter((o) => o.warehouseId === w.id).length],
            ]} />
          </>
        )}
      />
    </>
  );
}
