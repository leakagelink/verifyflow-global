import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, Mono, PageHeader, Panel, StatCard, StatusBadge, downloadCsv, fmtDate, fmtUsd, pageHead, type Column } from "@/components/shared";
import { services, verifications } from "@/services/mock-data";

export const Route = createFileRoute("/app/reports")({
  head: () => pageHead("Verification Reports", "Filter and export your full verification history."),
  component: Reports,
});

type Row = (typeof verifications)[number];

function Reports() {
  const [days, setDays] = useState("30");
  const [service, setService] = useState("all");
  const [status, setStatus] = useState("all");
  const rows = useMemo(() => {
    const cutoff = Date.UTC(2026, 10, 1) - Number(days) * 86400_000;
    return verifications.filter((v) => new Date(v.createdAt).getTime() >= cutoff && (service === "all" || v.service.id === service) && (status === "all" || v.status === status));
  }, [days, service, status]);
  const ok = rows.filter((r) => r.status === "completed").length;
  const columns: Column<Row>[] = [
    { key: "id", header: "ID", cell: (r) => <Mono className="text-muted-foreground">{r.id}</Mono> },
    { key: "n", header: "Number", cell: (r) => <span className="flex items-center gap-2">{r.country.flag}<Mono>{r.number}</Mono></span> },
    { key: "s", header: "Service", cell: (r) => r.service.name },
    { key: "ch", header: "Channel", cell: (r) => <span className="text-muted-foreground">{r.channel}</span> },
    { key: "st", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
    { key: "c", header: "Cost", className: "text-right", cell: (r) => <Mono>{fmtUsd(r.cost)}</Mono> },
    { key: "t", header: "Created (UTC)", cell: (r) => <span className="text-muted-foreground">{fmtDate(r.createdAt)}</span> },
  ];
  return (
    <>
      <PageHeader title="History & reports" description="Every verification on your account, filterable and exportable."
        actions={<Button size="sm" variant="outline" onClick={() => downloadCsv("verifications.csv", rows.map((r) => ({ id: r.id, number: r.number, country: r.country.code, service: r.service.name, channel: r.channel, status: r.status, code: r.code, cost: r.cost, created_at: r.createdAt })))}><Download className="size-4" />Export CSV</Button>} />
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Verifications" value={rows.length.toString()} />
        <StatCard label="Success rate" value={rows.length ? `${((ok / rows.length) * 100).toFixed(1)}%` : "—"} />
        <StatCard label="Total cost" value={fmtUsd(rows.reduce((a, r) => a + r.cost, 0))} />
      </div>
      <Panel bodyClassName="p-0">
        <div className="flex flex-wrap gap-2 border-b p-3">
          <Select value={days} onValueChange={setDays}><SelectTrigger className="h-9 w-36"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="1">Last 24 hours</SelectItem><SelectItem value="7">Last 7 days</SelectItem><SelectItem value="30">Last 30 days</SelectItem></SelectContent></Select>
          <Select value={service} onValueChange={setService}><SelectTrigger className="h-9 w-40"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">All services</SelectItem>{services.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select>
          <Select value={status} onValueChange={setStatus}><SelectTrigger className="h-9 w-36"><SelectValue /></SelectTrigger>
            <SelectContent>{["all", "completed", "cancelled", "refunded", "failed"].map((s) => <SelectItem key={s} value={s} className="capitalize">{s === "all" ? "All statuses" : s}</SelectItem>)}</SelectContent></Select>
        </div>
        <DataTable columns={columns} rows={rows} empty="No verifications in this range" />
      </Panel>
    </>
  );
}
