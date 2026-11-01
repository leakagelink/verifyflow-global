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

export const Route = createFileRoute("/app/wa/opt")({
  head: () => pageHead("Opt-in & Opt-out", "Consent management for WhatsApp contacts."),
  component: Page,
});

function Page() {

  return (
    <>
      <PageHeader title="Opt-in & Opt-out" description="Consent management for WhatsApp contacts." />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3"><StatCard label="Opted in" value="24,912" delta={6} /><StatCard label="Opted out" value="1,208" /><StatCard label="Opt-out rate" value="4.6%" /></div>
      <Panel className="mt-4" title="Keywords">
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Opt-out keywords</Label><Input defaultValue="STOP, UNSUBSCRIBE, बंद" /></div>
          <div className="space-y-1.5"><Label>Opt-in keywords</Label><Input defaultValue="START, SUBSCRIBE, YES" /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label>Opt-out confirmation reply</Label><Input defaultValue="You've been unsubscribed. Reply START to subscribe again." /></div>
        </div>
      </Panel>
      <Panel className="mt-4" title="Recent consent changes" bodyClassName="p-0"><DataTable rows={optContacts} columns={[
        { key: "n", header: "Contact", cell: (c) => <div><div className="font-medium">{c.name}</div><Mono className="text-xs text-muted-foreground">{c.phone}</Mono></div> },
        { key: "s", header: "Status", cell: (c) => <StatusBadge status={c.state === "in" ? "active" : "revoked"} label={c.state === "in" ? "Opted in" : "Opted out"} /> },
        { key: "src", header: "Source", cell: (c) => <span className="text-muted-foreground">{c.source}</span> },
        { key: "d", header: "Date", cell: (c) => c.at },
      ]} /></Panel>
    </>
  );
}
