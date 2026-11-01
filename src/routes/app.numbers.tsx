import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton, DataTable, Mono, PageHeader, Panel, StatusBadge, fmtUsd, pageHead, type Column } from "@/components/shared";
import { activeNumbers } from "@/services/mock-data";

export const Route = createFileRoute("/app/numbers")({
  head: () => pageHead("Active Numbers", "All numbers currently reserved on your account."),
  component: Numbers,
});

type Row = (typeof activeNumbers)[number];
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function Numbers() {
  const columns: Column<Row>[] = [
    { key: "n", header: "Number", cell: (r) => <span className="flex items-center gap-2"><span>{r.country.flag}</span><Mono>{r.number}</Mono><CopyButton value={r.number} /></span> },
    { key: "s", header: "Service", cell: (r) => r.service.name },
    { key: "st", header: "Status", cell: (r) => <StatusBadge status={r.status} label={r.status === "waiting" ? "Waiting for SMS" : undefined} /> },
    { key: "c", header: "Code", cell: (r) => ("code" in r && r.code ? <span className="flex items-center gap-1"><Mono className="font-semibold tracking-widest">{r.code}</Mono><CopyButton value={r.code} /></span> : <span className="text-muted-foreground">—</span>) },
    { key: "e", header: "Expires in", cell: (r) => <Mono>{mmss(r.expiresIn)}</Mono> },
    { key: "cost", header: "Cost", className: "text-right", cell: (r) => <Mono>{fmtUsd(r.cost)}</Mono> },
    { key: "id", header: "Order", cell: (r) => <Mono className="text-muted-foreground">{r.id}</Mono> },
  ];
  return (
    <>
      <PageHeader title="Active numbers" description="Numbers reserved for one-time verification. Expired numbers without a code are refunded."
        actions={<Button size="sm" asChild><Link to="/app/marketplace"><Plus className="size-4" />Get number</Link></Button>} />
      <Panel bodyClassName="p-0"><DataTable columns={columns} rows={activeNumbers} /></Panel>
    </>
  );
}
