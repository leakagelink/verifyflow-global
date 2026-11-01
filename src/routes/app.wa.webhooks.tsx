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

export const Route = createFileRoute("/app/wa/webhooks")({
  head: () => pageHead("WhatsApp Webhooks", "Receive WhatsApp message, status, template and call events."),
  component: Page,
});

function Page() {

  return (
    <>
      <PageHeader title="WhatsApp Webhooks" description="Receive WhatsApp message, status, template and call events." />
      <Panel title="Endpoint">
        <div className="flex flex-wrap gap-2"><Input defaultValue="https://api.acme.io/hooks/whatsapp" className="max-w-md font-mono text-sm" /><Button onClick={() => toast.success("Test event delivered: 200 OK")}><Send className="size-4" />Send test</Button></div>
        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">{["messages.received", "messages.status", "template.status_update", "account.quality_update", "calls.connect", "flows.response"].map((e) => <label key={e} className="flex items-center gap-2"><Switch defaultChecked /><Mono>{e}</Mono></label>)}</div>
        <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">Verify token <Mono>wa_verify_••••91c2</Mono><CopyButton value="wa_verify_demo91c2" /></div>
      </Panel>
      <Panel className="mt-4" title="Recent events" bodyClassName="p-0"><DataTable rows={waWebhookEvents} columns={[
        { key: "c", header: "Response", cell: (e) => <HttpStatus code={e.code} /> },
        { key: "t", header: "Event", cell: (e) => <Mono>{e.type}</Mono> },
        { key: "a", header: "Time (UTC)", cell: (e) => <span className="text-muted-foreground">{fmtDate(e.at)}</span> },
      ]} /></Panel>
    </>
  );
}
