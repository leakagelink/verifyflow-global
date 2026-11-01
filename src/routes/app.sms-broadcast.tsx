import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Plus, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { CopyButton, DataTable, HttpStatus, Mono, PageHeader, Panel, StatCard, StatusBadge, fmtDate, fmtUsd, pageHead } from "@/components/shared";
import { agents, calls, dltEntity, dltHeaders, dltTemplates, flows, optContacts, otpWhitelist, qrCodes, smsCampaigns, waBroadcasts, waWebhookEvents } from "@/services/messaging-data";

export const Route = createFileRoute("/app/sms-broadcast")({
  head: () => pageHead("SMS Broadcasting", "Send bulk DLT-compliant SMS campaigns."),
  component: Page,
});

function Page() {

  return (
    <>
      <PageHeader title="SMS Broadcasting" description="Send bulk DLT-compliant SMS campaigns." />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Sent (30d)" value="96,440" delta={14} /><StatCard label="Delivery rate" value="96.8%" />
        <StatCard label="Scheduled" value="1" /><StatCard label="Spend (30d)" value={fmtUsd(531.5)} />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="New campaign">
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>Campaign name</Label><Input placeholder="e.g. November newsletter" /></div>
            <div className="space-y-1.5"><Label>Sender ID (DLT header)</Label><Input defaultValue="ACMEIN" className="font-mono" /></div>
            <div className="space-y-1.5"><Label>DLT template</Label><Textarea rows={3} defaultValue={dltTemplates[2]!.body} className="text-xs" /></div>
            <div className="space-y-1.5"><Label>Recipients</Label><Textarea rows={2} placeholder="Paste numbers or upload CSV" className="font-mono text-xs" /></div>
            <Button className="w-full" onClick={() => toast.success("Demo: campaign scheduled")}><Send className="size-4" />Send / schedule</Button>
          </div>
        </Panel>
        <Panel className="lg:col-span-2" title="Campaigns" bodyClassName="p-0"><DataTable rows={smsCampaigns} columns={[
          { key: "n", header: "Campaign", cell: (c) => <div><div className="font-medium">{c.name}</div><div className="text-xs text-muted-foreground"><Mono>{c.sender}</Mono> · {c.type}</div></div> },
          { key: "r", header: "Recipients", className: "text-right", cell: (c) => <Mono>{c.recipients.toLocaleString()}</Mono> },
          { key: "d", header: "Delivered", className: "text-right", cell: (c) => <Mono>{c.delivered ? `${((c.delivered / c.recipients) * 100).toFixed(1)}%` : "—"}</Mono> },
          { key: "s", header: "Status", cell: (c) => <StatusBadge status={c.status} label={c.status === "active" ? "Sending" : c.status === "pending" ? "Scheduled" : undefined} /> },
          { key: "t", header: "Date", cell: (c) => <span className="text-muted-foreground">{fmtDate(c.at)}</span> },
        ]} /></Panel>
      </div>
    </>
  );
}
