import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, StatCard, Mono } from "@/components/scm/data-table";
import { StatusBadge } from "@/components/scm/status";
import { Progress } from "@/components/ui/progress";
import {
  suppliers, products, warehouses, orders, inventory, stockStatus, productById, warehouseById, money, num,
} from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — Freightline Supply Chain" },
      { name: "description", content: "At-a-glance view of orders, stock levels and warehouse capacity." },
      { property: "og:title", content: "Overview — Freightline Supply Chain" },
      { property: "og:description", content: "At-a-glance view of orders, stock levels and warehouse capacity." },
    ],
  }),
  component: Index,
});

function Index() {
  const revenue = orders.filter((o) => o.status !== "Cancelled").reduce((a, o) => a + o.total, 0);
  const lowStock = inventory.filter((i) => stockStatus(i) !== "In Stock");
  return (
    <div className="space-y-8">
      <PageHeader title="Overview" description="Your supply network at a glance." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active suppliers" value={suppliers.filter((s) => s.status === "Active").length} hint={`${suppliers.length} total`} />
        <StatCard label="Products" value={products.length} hint="Across 6 categories" />
        <StatCard label="Order value (30d)" value={money(revenue)} hint={`${orders.length} orders`} />
        <StatCard label="Stock alerts" value={lowStock.length} hint="Low or out of stock" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Warehouse capacity</h2>
            <Link to="/warehouses" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-4">
            {warehouses.map((w) => {
              const pct = Math.round((w.used / w.capacity) * 100);
              return (
                <div key={w.id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{w.name}</span><span className="tabular-nums text-muted-foreground">{pct}%</span>
                  </div>
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
            {lowStock.map((i) => (
              <li key={i.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium">{productById(i.productId)?.name}</p>
                  <Mono>{warehouseById(i.warehouseId)?.name} · {num(i.onHand)} on hand</Mono>
                </div>
                <StatusBadge status={stockStatus(i)} />
              </li>
            ))}
          </ul>
        </section>
      </div>
      <section className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent orders</h2>
          <Link to="/orders" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        <ul className="divide-y">
          {orders.slice(0, 5).map((o) => (
            <li key={o.id} className="flex items-center justify-between py-3 text-sm">
              <div><p className="font-medium">{o.customer}</p><Mono>{o.id} · {o.date}</Mono></div>
              <div className="flex items-center gap-4"><span className="tabular-nums">{money(o.total)}</span><StatusBadge status={o.status} /></div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
