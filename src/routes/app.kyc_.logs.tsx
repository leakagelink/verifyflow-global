import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataTable, Mono, PageHeader, Panel, StatCard, StatusBadge, pageHead } from "@/components/shared";
import { CodeBlock } from "@/components/shared/code-block";
import { formatServicePrice } from "@/services/pricing";
import { kycLogs, type KycLog } from "@/services/kyc-data";

export const Route = createFileRoute("/app/kyc_/logs")({
  head: () => pageHead("KYC Verification Logs", "PAN, GST, bank and other KYC verification activity across API and dashboard."),
  component: Logs,
});

function Logs() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<KycLog | null>(null);
  const rows = kycLogs.filter((l) => JSON.stringify(l).toLowerCase().includes(q.toLowerCase()));
  const count = (s: string) => String(kycLogs.filter((l) => l.service.startsWith(s)).length);
  return (
    <>
      <PageHeader title="KYC Verification Logs" description="Aadhaar, PAN, GST and Bank verification activity across API and Dashboard." />
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total requests" value={String(kycLogs.length)} /><StatCard label="Today" value="0" />
        <StatCard label="Aadhaar" value="0" /><StatCard label="PAN" value={count("PAN")} />
        <StatCard label="GST" value={count("GST")} /><StatCard label="Bank" value={count("BANK")} />
      </div>
      <Panel bodyClassName="p-0">
        <div className="border-b p-3"><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="GSTIN, name, request ID…" className="max-w-xs" /></div>
        <DataTable rows={rows} columns={[
          { key: "d", header: "Date", cell: (l) => l.at },
          { key: "i", header: "Request ID", cell: (l) => <Mono className="text-xs">{l.id}</Mono> },
          { key: "s", header: "Service", cell: (l) => <span className="rounded border border-primary/30 bg-primary/10 px-1.5 text-xs font-medium text-primary">{l.service}</span> },
          { key: "t", header: "Target", cell: (l) => <Mono className="text-xs">{l.target}</Mono> },
          { key: "n", header: "Name", cell: (l) => l.name },
          { key: "src", header: "Source", cell: (l) => l.source },
          { key: "st", header: "Status", cell: (l) => <StatusBadge status={l.status} label={l.status === "completed" ? "Success" : "Failed"} /> },
          { key: "c", header: "Cost", className: "text-right", cell: (l) => <Mono>{formatServicePrice(l.cost, "INR")}</Mono> },
          { key: "x", header: "", cell: (l) => <button aria-label="View details" onClick={() => setOpen(l)} className="text-primary"><Eye className="size-4" /></button> },
        ]} />
      </Panel>
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="sm:max-w-lg">{open && <><DialogHeader><DialogTitle>{open.id}</DialogTitle></DialogHeader><CodeBlock code={JSON.stringify(open, null, 2)} /></>}</DialogContent>
      </Dialog>
    </>
  );
}
