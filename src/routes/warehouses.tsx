import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable, DetailList, PageHeader, Mono, LoadError } from "@/components/scm/data-table";
import { Progress } from "@/components/ui/progress";
import { scmQuery, fmt, type Warehouse } from "@/lib/scm.functions";

export const Route = createFileRoute("/warehouses")({
  head: () => ({
    meta: [
      { title: "Warehouses — Freightline" },
      { name: "description", content: "Warehouse locations, capacity and stored units." },
      { property: "og:title", content: "Warehouses — Freightline" },
      { property: "og:description", content: "Warehouse locations, capacity and stored units." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(scmQuery),
  errorComponent: LoadError,
  component: WarehousesPage,
});

const pct = (w: Warehouse) => (w.capacity ? Math.min(100, Math.round((w.stored / w.capacity) * 100)) : 0);

function WarehousesPage() {
  const { data } = useSuspenseQuery(scmQuery);
  const locations = [...new Set(data.warehouses.map((w) => w.location))].sort();
  return (
    <>
      <PageHeader title="Warehouses" description="Facilities and their stored units." />
      <DataTable<Warehouse>
        rows={data.warehouses}
        searchPlaceholder="Search by name or location…"
        searchText={(w) => `${w.warehouseId} ${w.name} ${w.location}`}
        filter={{ label: "Locations", options: locations, value: (w) => w.location }}
        columns={[
          { key: "name", header: "Warehouse", sortValue: (w) => w.name, cell: (w) => <div><p className="font-medium">{w.name}</p><Mono>#{w.warehouseId}</Mono></div> },
          { key: "loc", header: "Location", sortValue: (w) => w.location, cell: (w) => w.location },
          { key: "cap", header: "Capacity", align: "right", sortValue: (w) => w.capacity, cell: (w) => fmt(w.capacity) },
          { key: "stored", header: "Stored", align: "right", sortValue: (w) => w.stored, cell: (w) => fmt(w.stored) },
          { key: "util", header: "Utilization", sortValue: pct, cell: (w) => <div className="flex w-32 items-center gap-2"><Progress value={pct(w)} className="h-1.5" /><span className="tabular-nums text-xs">{pct(w)}%</span></div> },
        ]}
        detailTitle={(w) => w.name}
        detailSubtitle={(w) => `Warehouse #${w.warehouseId}`}
        renderDetail={(w) => {
          const lines = data.inventory.filter((i) => i.warehouseId === w.warehouseId);
          return (
            <>
              <DetailList items={[["Location", w.location], ["Capacity", fmt(w.capacity)], ["Units stored", fmt(w.stored)], ["Utilization", `${pct(w)}%`]]} />
              <div>
                <h3 className="mb-2 text-sm font-semibold">Products stored ({lines.length})</h3>
                <ul className="divide-y rounded-lg border text-sm">
                  {lines.map((l) => <li key={l.id} className="flex justify-between px-4 py-2.5"><span>{l.product}</span><span className="tabular-nums">{fmt(l.qty)}</span></li>)}
                  {lines.length === 0 && <li className="px-4 py-2.5 text-muted-foreground">Empty</li>}
                </ul>
              </div>
            </>
          );
        }}
      />
    </>
  );
}
