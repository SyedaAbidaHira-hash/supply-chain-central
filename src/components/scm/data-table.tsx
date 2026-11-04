import { useMemo, useState, type ReactNode } from "react";
import { Search, ChevronRight, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";

export type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  align?: "left" | "right";
};

type Props<T extends { id: string }> = {
  rows: T[];
  columns: Column<T>[];
  searchText: (row: T) => string;
  searchPlaceholder?: string;
  filter?: { label: string; options: string[]; value: (row: T) => string };
  detailTitle: (row: T) => string;
  detailSubtitle?: (row: T) => string;
  renderDetail: (row: T) => ReactNode;
};

export function DataTable<T extends { id: string }>({
  rows, columns, searchText, searchPlaceholder = "Search…", filter,
  detailTitle, detailSubtitle, renderDetail,
}: Props<T>) {
  const [q, setQ] = useState("");
  const [f, setF] = useState("all");
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const [selected, setSelected] = useState<T | null>(null);

  const visible = useMemo(() => {
    const term = q.trim().toLowerCase();
    let out = rows.filter(
      (r) =>
        (!term || searchText(r).toLowerCase().includes(term)) &&
        (!filter || f === "all" || filter.value(r) === f),
    );
    if (sort) {
      const col = columns.find((c) => c.key === sort.key);
      if (col?.sortValue) {
        out = [...out].sort((a, b) => {
          const va = col.sortValue!(a), vb = col.sortValue!(b);
          return (va > vb ? 1 : va < vb ? -1 : 0) * sort.dir;
        });
      }
    }
    return out;
  }, [rows, q, f, sort, columns, filter, searchText]);

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={searchPlaceholder} className="pl-9" />
        </div>
        {filter && (
          <Select value={f} onValueChange={setF}>
            <SelectTrigger className="sm:w-48"><SelectValue placeholder={filter.label} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All {filter.label.toLowerCase()}</SelectItem>
              {filter.options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        <span className="text-sm text-muted-foreground sm:ml-2">{visible.length} of {rows.length}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              {columns.map((c) => (
                <th key={c.key} className={`px-4 py-3 font-medium ${c.align === "right" ? "text-right" : "text-left"}`}>
                  {c.sortValue ? (
                    <button
                      className="inline-flex items-center gap-1 uppercase tracking-wider hover:text-foreground"
                      onClick={() => setSort((s) => ({ key: c.key, dir: s?.key === c.key && s.dir === 1 ? -1 : 1 }))}
                    >
                      {c.header}<ArrowUpDown className="h-3 w-3" />
                    </button>
                  ) : c.header}
                </th>
              ))}
              <th className="w-12" />
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={r.id} onClick={() => setSelected(r)} className="group cursor-pointer border-b last:border-0 transition-colors hover:bg-accent/50">
                {columns.map((c) => (
                  <td key={c.key} className={`px-4 py-3 ${c.align === "right" ? "text-right tabular-nums" : ""}`}>{c.cell(r)}</td>
                ))}
                <td className="px-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground group-hover:text-primary" aria-label="View details">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={columns.length + 1} className="px-4 py-12 text-center text-muted-foreground">No results match your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="font-display text-xl">{detailTitle(selected)}</SheetTitle>
                {detailSubtitle && <SheetDescription className="font-mono text-xs">{detailSubtitle(selected)}</SheetDescription>}
              </SheetHeader>
              <div className="mt-6 space-y-6">{renderDetail(selected)}</div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function DetailList({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="divide-y rounded-lg border">
      {items.map(([k, v]) => (
        <div key={k} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
          <dt className="text-muted-foreground">{k}</dt>
          <dd className="text-right font-medium">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="mt-1 text-muted-foreground">{description}</p>
    </div>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Mono({ children }: { children: ReactNode }) {
  return <span className="font-mono text-xs text-muted-foreground">{children}</span>;
}

export function LoadError({ error }: { error: unknown }) {
  return (
    <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
      <p className="font-semibold">Couldn't load data from your database.</p>
      <p className="mt-1">{error instanceof Error ? error.message : String(error)}</p>
    </div>
  );
}
