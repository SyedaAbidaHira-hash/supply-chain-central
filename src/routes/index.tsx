import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHeader, StatCard, Mono, LoadError } from "@/components/scm/data-table";
import { StatusBadge } from "@/components/scm/status";
import { Progress } from "@/components/ui/progress";
import { scmQuery, stockStatus, money, fmt } from "@/lib/scm.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — Freightline Supply Chain" },
      { name: "description", content: "At-a-glance view of orders, stock levels and warehouse capacity." },
      { property: "og:title", content: "Overview — Freightline Supply Chain" },
      { property: "og:description", content: "At-a-glance view of orders, stock levels and warehouse capacity." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(scmQuery),
  errorComponent: LoadError,
  component: Index,
});

function Index() {
  const { data } = useSuspenseQuery(scmQuery);
  const spend = data.orders.reduce((a, o) => a + o.total, 0);
  const alerts = data.inventory.filter((i) => stockStatus(i.qty) !== "In Stock");
  const topWh = [...data.warehouses].sort((a, b) => b.stored / b.capacity - a.stored / a.capacity).slice(0, 6);
  const recent = [...data.orders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  return (
    <div className="space-y-8">
      <PageHeader title="Overview" description="Live from your supply chain database." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Suppliers" value={data.suppliers.length} />
        <StatCard label="Products" value={data.products.length} />
        <StatCard label="Purchase spend" value={money(spend)} hint={`${data.orders.length} orders`} />
        <StatCard label="Stock alerts" value={alerts.length} hint="Low or out of stock" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Busiest warehouses</h2>
            <Link to="/warehouses" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-4">
            {topWh.map((w) => {
              const pct = w.capacity ? Math.min(100, Math.round((w.stored / w.capacity) * 100)) : 0;
              return (
                <div key={w.id}>
                  <div className="mb-1 flex justify-between text-sm"><span>{w.name}</span><span className="tabular-nums text-muted-foreground">{fmt(w.stored)} / {fmt(w.capacity)}</span></div>
                  <Progress value={pct} />
                </div>
              );
            })}
          </div>
        </section>
        <section className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Stock alerts</h2>
            <Link to="/inventory" className="text-sm text-primary hover:underline">View inventory</Link>
          </div>
          <ul className="divide-y">
            {alerts.slice(0, 6).map((i) => (
              <li key={i.id} className="flex items-center justify-between py-3 text-sm">
                <div><p className="font-medium">{i.product}</p><Mono>{i.warehouse} · {fmt(i.qty)} on hand</Mono></div>
                <StatusBadge status={stockStatus(i.qty)} />
              </li>
            ))}
            {alerts.length === 0 && <li className="py-3 text-sm text-muted-foreground">All stock levels healthy.</li>}
          </ul>
        </section>
      </div>
      <section className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent orders</h2>
          <Link to="/orders" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        <ul className="divide-y">
          {recent.map((o) => (
            <li key={o.id} className="flex items-center justify-between py-3 text-sm">
              <div><p className="font-medium">{o.supplier}</p><Mono>Order #{o.orderId} · {o.date}</Mono></div>
              <span className="tabular-nums">{money(o.total)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
