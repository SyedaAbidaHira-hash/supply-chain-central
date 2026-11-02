import { Badge } from "@/components/ui/badge";

const map: Record<string, "success" | "warning" | "danger" | "info" | "neutral"> = {
  Active: "success", Operational: "success", Delivered: "success", "In Stock": "success",
  "On Hold": "warning", Pending: "warning", Maintenance: "warning", "Low Stock": "warning", Draft: "neutral",
  Inactive: "neutral", Discontinued: "neutral", Cancelled: "danger", "Out of Stock": "danger",
  Processing: "info", Shipped: "info",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge variant={map[status] ?? "neutral"}>{status}</Badge>;
}
