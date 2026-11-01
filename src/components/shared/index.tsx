import { useState, type ReactNode } from "react";
import { Check, Copy, TrendingDown, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Status } from "@/services/mock-data";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-primary p-5 text-primary-foreground shadow-glow sm:p-7">
      <div aria-hidden className="grid-pattern pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_left,black,transparent_70%)]" />
      <div aria-hidden className="pointer-events-none absolute -right-10 -top-16 size-56 rounded-full border-[18px] border-primary-foreground/10 animate-spin-slow" />
      <div aria-hidden className="animate-float pointer-events-none absolute right-24 top-6 hidden size-14 rounded-2xl bg-primary-foreground/15 backdrop-blur icon-3d sm:block" />
      <div aria-hidden className="animate-float pointer-events-none absolute bottom-4 right-48 hidden size-8 rounded-full bg-primary-foreground/20 [animation-delay:-3s] md:block" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
          {description && <p className="mt-1.5 max-w-2xl text-sm text-primary-foreground/80">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2 text-foreground">{actions}</div>}
      </div>
    </div>
  );
}

export function Panel({ title, description, actions, children, className, bodyClassName }: {
  title?: ReactNode; description?: string; actions?: ReactNode; children: ReactNode; className?: string; bodyClassName?: string;
}) {
  return (
    <section className={cn("card-3d min-w-0 rounded-2xl border text-card-foreground", className)}>
      {(title || actions) && (
        <header className="flex items-center justify-between gap-3 border-b px-4 py-3">
          <div className="min-w-0">
            {title && <h2 className="flex items-center gap-2 text-sm font-semibold"><span className="h-4 w-1 shrink-0 rounded-full bg-gradient-primary" />{title}</h2>}
            {description && <p className="pl-3 text-xs text-muted-foreground">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className={cn("p-4", bodyClassName)}>{children}</div>
    </section>
  );
}

const tones = ["tone-1", "tone-2", "tone-3", "tone-4"];
const toneOf = (s: string) => tones[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % tones.length];

export function StatCard({ label, value, delta, hint, icon, action }: {
  label: string; value: string; delta?: number; hint?: string; icon?: ReactNode; action?: ReactNode;
}) {
  const tone = toneOf(label);
  return (
    <div className="card-3d lift group relative min-w-0 overflow-hidden rounded-2xl border p-4">
      <div className={cn("pointer-events-none absolute -right-10 -top-10 size-32 rounded-full opacity-25 blur-2xl transition-opacity group-hover:opacity-50", tone)} />
      <svg aria-hidden viewBox="0 0 120 40" className="pointer-events-none absolute bottom-0 right-0 h-12 w-32 text-primary opacity-15 transition-opacity group-hover:opacity-40">
        <path d="M0 32 L15 26 L30 29 L45 18 L60 22 L75 10 L90 15 L105 6 L120 9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <div className="relative flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="flex min-w-0 items-center gap-2.5">
          <span className={cn("icon-3d grid size-9 shrink-0 place-items-center rounded-xl text-primary-foreground transition-transform group-hover:scale-110 [&>svg]:size-4", tone)}>{icon ?? <TrendingUp />}</span>
          <span className="truncate font-medium">{label}</span>
        </span>
        {action}
      </div>
      <div className="relative mt-3 font-mono text-2xl font-semibold tracking-tight sm:text-[1.7rem]">{value}</div>
      <div className="relative mt-1 flex flex-wrap items-center gap-2 text-xs">
        {delta !== undefined && (
          <span className={cn("inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium", delta >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
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
    <>
    {/* Phone: each row becomes a stacked card */}
    <ul className="divide-y sm:hidden">
      {rows.length === 0 && <li className="px-4 py-10 text-center text-sm text-muted-foreground">{empty}</li>}
      {rows.map((r, i) => {
        const [first, ...rest] = columns.filter((c) => c.header !== "");
        const actions = columns.filter((c) => c.header === "");
        return (
          <li key={i} onClick={() => onRowClick?.(r)} className={cn("space-y-2 px-4 py-3 text-sm active:bg-muted/50", onRowClick && "cursor-pointer")}>
            {first && <div className="min-w-0 font-medium [&_*]:max-w-full">{first.cell(r)}</div>}
            <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              {rest.map((c) => (
                <div key={c.key} className="min-w-0">
                  <dt className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{c.header}</dt>
                  <dd className="truncate">{c.cell(r)}</dd>
                </div>
              ))}
            </dl>
            {actions.length > 0 && <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>{actions.map((c) => <span key={c.key}>{c.cell(r)}</span>)}</div>}
          </li>
        );
      })}
    </ul>
    <div className="hidden overflow-x-auto sm:block">
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
    </>
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
