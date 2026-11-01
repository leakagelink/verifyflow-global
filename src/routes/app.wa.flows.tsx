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

export const Route = createFileRoute("/app/wa/flows")({
  head: () => pageHead("WhatsApp Flows", "Build in-chat forms for leads, bookings and surveys."),
  component: Page,
});

function Page() {

  return (
    <>
      <PageHeader title="WhatsApp Flows" description="Build in-chat forms for leads, bookings and surveys." />
      <div className="grid gap-4 lg:grid-cols-3">
        {flows.map((f) => (
          <Panel key={f.name} title={f.name} actions={<StatusBadge status={f.status} label={f.status === "active" ? "Published" : "Draft"} />}>
            <div className="flex gap-1.5">{Array.from({ length: f.screens }, (_, i) => <div key={i} className="h-20 flex-1 rounded-md border bg-muted/40 p-1.5"><div className="h-1.5 w-2/3 rounded bg-border" /><div className="mt-1.5 h-3 rounded border bg-card" /><div className="mt-1 h-3 rounded border bg-card" /></div>)}</div>
            <div className="mt-3 flex justify-between text-xs text-muted-foreground"><span>{f.screens} screens · {f.responses.toLocaleString()} responses</span><span>Updated {f.updated}</span></div>
            <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => toast("Demo: flow editor")}>Edit flow</Button>
          </Panel>
        ))}
      </div>
    </>
  );
}
