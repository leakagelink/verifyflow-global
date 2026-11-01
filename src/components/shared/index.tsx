import { useState, type ReactNode } from "react";
import { Check, Copy, TrendingDown, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Status } from "@/services/mock-data";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, description, actions, children, className, bodyClassName }: {
  title?: ReactNode; description?: string; actions?: ReactNode; children: ReactNode; className?: string; bodyClassName?: string;
}) {
  return (
    <section className={cn("card-3d rounded-xl border text-card-foreground", className)}>
      {(title || actions) && (
        <header className="flex items-center justify-between gap-3 border-b px-4 py-3">
          <div>
            {title && <h2 className="text-sm font-medium">{title}</h2>}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className={cn("p-4", bodyClassName)}>{children}</div>
    </section>
  );
}

export function StatCard({ label, value, delta, hint, icon, action }: {
  label: string; value: string; delta?: number; hint?: string; icon?: ReactNode; action?: ReactNode;
}) {
  return (
    <div className="card-3d lift relative overflow-hidden rounded-xl border p-4">
      <div className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-primary/10 blur-2xl" />
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="flex min-w-0 items-center gap-2">{icon && <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow [&>svg]:size-3.5">{icon}</span>}<span className="truncate">{label}</span></span>
        {action}
      </div>
      <div className="mt-2 font-mono text-2xl font-medium tracking-tight">{value}</div>
      <div className="mt-1 flex items-center gap-2 text-xs">
        {delta !== undefined && (
          <span className={cn("inline-flex items-center gap-0.5 font-medium", delta >= 0 ? "text-success" : "text-destructive")}>
            {delta >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {Math.abs(delta)}%
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}

const statusStyles: Record<string, string> = {
  completed: "bg-success/10 text-success border-success/20",
  active: "bg-success/10 text-success border-success/20",
  paid: "bg-success/10 text-success border-success/20",
  operational: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/15 text-warning-foreground border-warning/30 dark:text-warning",
  waiting: "bg-primary/10 text-primary border-primary/20",
  degraded: "bg-warning/15 text-warning-foreground border-warning/30 dark:text-warning",
  cancelled: "bg-muted text-muted-foreground border-border",
  expired: "bg-muted text-muted-foreground border-border",
  refunded: "bg-muted text-muted-foreground border-border",
  revoked: "bg-destructive/10 text-destructive border-destructive/20",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
  down: "bg-destructive/10 text-destructive border-destructive/20",
};

export function StatusBadge({ status, label }: { status: Status | string; label?: string | undefined }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize", statusStyles[status] ?? statusStyles["cancelled"])}>
      <span className={cn("size-1.5 rounded-full bg-current", status === "waiting" && "animate-pulse")} />
      {label ?? status}
    </span>
  );
}

export function HttpStatus({ code }: { code: number }) {
  const s = code < 300 ? "completed" : code < 500 ? "pending" : "failed";
  return <StatusBadge status={s} label={String(code)} />;
}

export function CopyButton({ value, className, label }: { value: string; className?: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={`Copy ${label ?? value}`}
      onClick={() => {
        navigator.clipboard?.writeText(value);
        setCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(false), 1400);
      }}
      className={cn("inline-flex items-center gap-1 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground", className)}
    >
      {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
      {label && <span className="text-xs">{label}</span>}
    </button>
  );
}

export type Column<T> = { key: string; header: ReactNode; cell: (row: T) => ReactNode; className?: string };

export function DataTable<T>({ columns, rows, onRowClick, empty = "No results" }: {
  columns: Column<T>[]; rows: T[]; onRowClick?: (row: T) => void; empty?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40">
            {columns.map((c) => (
              <th key={c.key} className={cn("whitespace-nowrap px-4 py-2 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground", c.className)}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={columns.length} className="px-4 py-10 text-center text-muted-foreground">{empty}</td></tr>
          )}
          {rows.map((r, i) => (
            <tr key={i} onClick={() => onRowClick?.(r)} className={cn("border-b last:border-0 transition-colors hover:bg-muted/40", onRowClick && "cursor-pointer")}>
              {columns.map((c) => (
                <td key={c.key} className={cn("whitespace-nowrap px-4 py-2.5", c.className)}>{c.cell(r)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Mono({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("font-mono text-[12.5px]", className)}>{children}</span>;
}

export const fmtUsd = (n: number) => (n < 0 ? "-" : "") + "$" + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const fmtDate = (iso: string) => new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "UTC" });

export function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const head = Object.keys(rows[0]!);
  const csv = [head.join(","), ...rows.map((r) => head.map((h) => JSON.stringify(r[h] ?? "")).join(","))].join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = filename;
  a.click();
  toast.success(`Exported ${rows.length} rows`);
}

export function pageHead(title: string, description: string) {
  const t = `${title} · Numora`;
  return {
    meta: [
      { title: t },
      { name: "description", content: description },
      { property: "og:title", content: t },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  };
}
