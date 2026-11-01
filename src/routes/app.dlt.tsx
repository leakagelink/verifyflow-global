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

export const Route = createFileRoute("/app/dlt")({
  head: () => pageHead("DLT Management", "Manage your DLT entity, sender headers and content templates (TRAI India)."),
  component: Page,
});

function Page() {

  return (
    <>
      <PageHeader title="DLT Management" description="Manage your DLT entity, sender headers and content templates (TRAI India)." />
      <Panel title="Principal entity">
        <div className="grid gap-4 text-sm sm:grid-cols-4">
          <div><div className="text-xs text-muted-foreground">Entity name</div>{dltEntity.name}</div>
          <div><div className="text-xs text-muted-foreground">Entity ID (PE ID)</div><span className="flex items-center gap-1"><Mono>{dltEntity.entityId}</Mono><CopyButton value={dltEntity.entityId} /></span></div>
          <div><div className="text-xs text-muted-foreground">Operator portal</div>{dltEntity.operator}</div>
          <div><div className="text-xs text-muted-foreground">Status</div><StatusBadge status={dltEntity.status} label={`Verified · till ${dltEntity.validTill}`} /></div>
        </div>
      </Panel>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="Sender headers" actions={<Button size="sm" variant="outline" className="h-7" onClick={() => toast("Demo: add header")}><Plus className="size-3.5" />Add</Button>} bodyClassName="p-0">
          <DataTable rows={dltHeaders} columns={[
            { key: "h", header: "Header", cell: (h) => <Mono className="font-medium">{h.header}</Mono> },
            { key: "t", header: "Type", cell: (h) => <span className="text-xs">{h.type}</span> },
            { key: "s", header: "Status", cell: (h) => <StatusBadge status={h.status} label={h.status === "active" ? "Approved" : "In review"} /> },
          ]} />
        </Panel>
        <Panel className="lg:col-span-2" title="Content templates" actions={<Button size="sm" variant="outline" className="h-7" onClick={() => toast("Demo: register template")}><Plus className="size-3.5" />Register template</Button>} bodyClassName="p-0">
          {dltTemplates.map((t) => (
            <div key={t.id} className="border-b px-4 py-3 last:border-0">
              <div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2 text-sm"><span className="font-medium">{t.name}</span><Mono className="text-xs text-muted-foreground">{t.header}</Mono><span className="rounded bg-muted px-1.5 text-[11px]">{t.category}</span></div>
                <StatusBadge status={t.status} label={t.status === "active" ? "Approved" : t.status === "failed" ? "Rejected" : "In review"} /></div>
              <p className="mt-1 text-sm text-muted-foreground">{t.body}</p>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">Template ID <Mono>{t.id}</Mono><CopyButton value={t.id} /></div>
            </div>
          ))}
        </Panel>
      </div>
    </>
  );
}
