import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CopyButton, DataTable, HttpStatus, Mono, PageHeader, Panel, fmtDate, pageHead, type Column } from "@/components/shared";
import { CodeBlock } from "@/components/shared/code-block";
import { apiLogs } from "@/services/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/api-logs")({
  head: () => pageHead("API Logs", "Inspect every API request with status, latency, headers and payloads."),
  component: Logs,
});

type Log = (typeof apiLogs)[number];

export function MethodTag({ method }: { method: string }) {
  return <Mono className={cn("w-12 text-[11px] font-semibold", method === "GET" ? "text-success" : "text-primary")}>{method}</Mono>;
}

function Logs() {
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Log | null>(null);
  const rows = useMemo(() => apiLogs.filter((l) =>
    (filter === "all" || (filter === "ok" ? l.status < 300 : filter === "4xx" ? l.status >= 400 && l.status < 500 : l.status >= 500)) &&
    (q === "" || l.path.includes(q) || l.id.includes(q))), [filter, q]);
  const columns: Column<Log>[] = [
    { key: "s", header: "Status", cell: (l) => <HttpStatus code={l.status} /> },
    { key: "p", header: "Endpoint", cell: (l) => <span className="flex items-center"><MethodTag method={l.method} /><Mono>{l.path}</Mono></span> },
    { key: "l", header: "Latency", className: "text-right", cell: (l) => <Mono className={l.latency > 300 ? "text-warning" : ""}>{l.latency}ms</Mono> },
    { key: "k", header: "Key", cell: (l) => <Mono className="text-muted-foreground">{l.key}…</Mono> },
    { key: "ip", header: "IP", cell: (l) => <Mono className="text-muted-foreground">{l.ip}</Mono> },
    { key: "t", header: "Time (UTC)", cell: (l) => <span className="text-muted-foreground">{fmtDate(l.at)}</span> },
  ];
  const errBody = sel && sel.status >= 400 ? { error: { type: sel.status === 402 ? "insufficient_balance" : sel.status === 429 ? "rate_limited" : sel.status === 400 ? "invalid_request" : "upstream_error", message: sel.status === 402 ? "Wallet balance too low for this order." : "Request failed." } } : null;
  return (
    <>
      <PageHeader title="API logs" description="Last 24 hours of requests. Click a row to inspect it." />
      <Panel bodyClassName="p-0">
        <div className="flex flex-wrap items-center gap-2 border-b p-3">
          <ToggleGroup type="single" size="sm" variant="outline" value={filter} onValueChange={(v) => v && setFilter(v)}>
            <ToggleGroupItem value="all" className="text-xs">All</ToggleGroupItem><ToggleGroupItem value="ok" className="text-xs">2xx</ToggleGroupItem>
            <ToggleGroupItem value="4xx" className="text-xs">4xx</ToggleGroupItem><ToggleGroupItem value="5xx" className="text-xs">5xx</ToggleGroupItem>
          </ToggleGroup>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by path or request ID" className="h-8 max-w-xs font-mono text-xs" />
        </div>
        <DataTable columns={columns} rows={rows} onRowClick={setSel} />
      </Panel>
      <Sheet open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          {sel && (
            <>
              <SheetHeader><SheetTitle className="flex items-center gap-2"><MethodTag method={sel.method} /><Mono>{sel.path}</Mono></SheetTitle></SheetHeader>
              <div className="space-y-5 px-4 pb-6 text-sm">
                <div className="grid grid-cols-2 gap-3 rounded-md border p-3">
                  <div><div className="text-xs text-muted-foreground">Request ID</div><span className="flex items-center gap-1"><Mono>{sel.id}</Mono><CopyButton value={sel.id} /></span></div>
                  <div><div className="text-xs text-muted-foreground">Status</div><HttpStatus code={sel.status} /></div>
                  <div><div className="text-xs text-muted-foreground">Latency</div><Mono>{sel.latency}ms</Mono></div>
                  <div><div className="text-xs text-muted-foreground">Time</div>{fmtDate(sel.at)}</div>
                </div>
                <div><div className="mb-1.5 text-xs font-medium text-muted-foreground">Request headers</div>
                  <CodeBlock code={`Authorization: Bearer ${sel.key}••••\nContent-Type: application/json\nUser-Agent: comnexaapi-node/2.4.1\nX-Forwarded-For: ${sel.ip}\nIdempotency-Key: 7c1e-${sel.id.slice(4)}`} /></div>
                <div><div className="mb-1.5 text-xs font-medium text-muted-foreground">Request body</div>
                  <CodeBlock code={sel.method === "GET" ? "// no body" : JSON.stringify({ country: "US", service: "telegram", max_price: 0.6 }, null, 2)} /></div>
                <div><div className="mb-1.5 text-xs font-medium text-muted-foreground">Response body</div>
                  <CodeBlock code={JSON.stringify(errBody ?? { id: "ord_8f2k1", number: "+14155550132", status: "waiting", expires_at: "2026-11-01T04:58:00Z", cost: 0.42 }, null, 2)} /></div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
