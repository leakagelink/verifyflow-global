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

export const Route = createFileRoute("/app/wa/supervisor")({
  head: () => pageHead("Supervisor Dashboard", "Live view of agents, queues and response times."),
  component: Page,
});

function Page() {

  return (
    <>
      <PageHeader title="Supervisor Dashboard" description="Live view of agents, queues and response times." />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5"><StatCard label="Open chats" value="12" /><StatCard label="Waiting in queue" value="3" /><StatCard label="Avg first response" value="1m 04s" /><StatCard label="Resolved today" value="120" delta={9} /><StatCard label="CSAT" value="4.7 / 5" /></div>
      <Panel className="mt-4" title="Agents" bodyClassName="p-0"><DataTable rows={agents} columns={[
        { key: "n", header: "Agent", cell: (a) => <span className="flex items-center gap-2"><span className={a.status === "online" ? "size-2 rounded-full bg-success" : a.status === "away" ? "size-2 rounded-full bg-warning" : "size-2 rounded-full bg-muted-foreground"} />{a.name}</span> },
        { key: "s", header: "Status", cell: (a) => <span className="capitalize text-muted-foreground">{a.status}</span> },
        { key: "o", header: "Open chats", className: "text-right", cell: (a) => <Mono>{a.open}</Mono> },
        { key: "r", header: "Resolved today", className: "text-right", cell: (a) => <Mono>{a.resolved}</Mono> },
        { key: "f", header: "First response", className: "text-right", cell: (a) => <Mono>{a.frt}</Mono> },
        { key: "c", header: "CSAT", className: "text-right", cell: (a) => <Mono>{a.csat}</Mono> },
        { key: "x", header: "", cell: (a) => <Button size="sm" variant="ghost" className="h-7" onClick={() => toast(`Demo: monitoring ${a.name}`)}>Monitor</Button> },
      ]} /></Panel>
    </>
  );
}
