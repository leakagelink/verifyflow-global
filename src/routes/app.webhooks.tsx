import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Plus, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyButton, DataTable, HttpStatus, Mono, PageHeader, Panel, StatusBadge, fmtDate, pageHead, type Column } from "@/components/shared";
import { CodeBlock } from "@/components/shared/code-block";
import { webhookEvents, webhooks } from "@/services/mock-data";

export const Route = createFileRoute("/app/webhooks")({
  head: () => pageHead("Webhooks", "Configure webhook endpoints and inspect delivery attempts."),
  component: Webhooks,
});

const events = ["sms.received", "number.expired", "number.cancelled", "wallet.low_balance", "rental.renewed"];
const samplePayload = JSON.stringify({ id: "evt_1x9k", type: "sms.received", created: 1793500000, data: { order_id: "ord_8f2k1", number: "+14155550132", service: "telegram", code: "839201", text: "Telegram code: 839201" } }, null, 2);
type Ev = (typeof webhookEvents)[number];

function Webhooks() {
  const [testing, setTesting] = useState<string | null>(null);
  const columns: Column<Ev>[] = [
    { key: "c", header: "Response", cell: (e) => <HttpStatus code={e.code} /> },
    { key: "t", header: "Event", cell: (e) => <Mono>{e.type}</Mono> },
    { key: "e", header: "Endpoint", cell: (e) => <Mono className="text-muted-foreground">{e.endpoint}</Mono> },
    { key: "a", header: "Attempts", className: "text-right", cell: (e) => <Mono>{e.attempts}</Mono> },
    { key: "at", header: "Time (UTC)", cell: (e) => <span className="text-muted-foreground">{fmtDate(e.at)}</span> },
  ];
  return (
    <>
      <PageHeader title="Webhooks" description="Get notified the moment a code arrives instead of polling."
        actions={
          <Dialog>
            <DialogTrigger asChild><Button size="sm"><Plus className="size-4" />Add endpoint</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add webhook endpoint</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1.5"><Label htmlFor="url">Endpoint URL</Label><Input id="url" placeholder="https://example.com/webhooks" className="font-mono text-sm" /></div>
                <div className="space-y-2"><Label>Events</Label>{events.map((e) => <label key={e} className="flex items-center gap-2 text-sm"><Checkbox defaultChecked={e === "sms.received"} /><Mono>{e}</Mono></label>)}</div>
              </div>
              <DialogFooter><Button onClick={() => toast.success("Demo: endpoint added")}>Add endpoint</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        } />
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-3">
          {webhooks.map((w) => (
            <Panel key={w.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2"><Mono className="truncate font-medium">{w.url}</Mono><StatusBadge status={w.status} label={w.status === "failed" ? "Failing" : "Enabled"} /></div>
                  <div className="mt-2 flex flex-wrap gap-1">{w.events.map((e) => <Mono key={e} className="rounded bg-muted px-1.5 py-0.5 text-[11px]">{e}</Mono>)}</div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">Signing secret <Mono>whsec_••••••••3f9a</Mono><CopyButton value="whsec_demo3f9a" /></div>
                </div>
                <div className="text-right">
                  <Mono className="text-lg font-medium">{w.successRate}%</Mono><div className="text-xs text-muted-foreground">delivery (7d)</div>
                  <Button size="sm" variant="outline" className="mt-2 h-7" disabled={testing === w.id}
                    onClick={() => { setTesting(w.id); setTimeout(() => { setTesting(null); w.status === "failed" ? toast.error("Test failed: 504 Gateway Timeout") : toast.success("Test delivered: 200 OK in 184ms"); }, 1200); }}>
                    {testing === w.id ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}Send test
                  </Button>
                </div>
              </div>
            </Panel>
          ))}
        </div>
        <Panel className="lg:col-span-2" title="Sample payload" description="sms.received"><CodeBlock code={samplePayload} /></Panel>
      </div>
      <Panel className="mt-4" title="Recent deliveries" bodyClassName="p-0"><DataTable columns={columns} rows={webhookEvents} /></Panel>
    </>
  );
}
