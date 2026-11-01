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
import { ServiceRates } from "@/components/shared/service-rates";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { whatsappUsage } from "@/services/pricing";

export const Route = createFileRoute("/app/wa/calls")({
  head: () => pageHead("WhatsApp Calls", "Inbound and outbound WhatsApp Business calling."),
  component: Page,
});

function Page() {
  const [market, setMarket] = useState("India");
  const rates = whatsappUsage.find((p) => p.market === market);
  return (
    <>
      <PageHeader title="WhatsApp Calls" description="Inbound and outbound WhatsApp Business calling." />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><StatCard label="Calls today" value="38" /><StatCard label="Answered" value="92%" /><StatCard label="Avg duration" value="3m 40s" /><StatCard label="Missed" value="3" /></div>
      <Panel className="mt-4" title="Calling settings"><div className="space-y-2 text-sm">
        <label className="flex items-center justify-between">Allow customers to call this number <Switch defaultChecked /></label>
        <label className="flex items-center justify-between">Show call button in chats <Switch defaultChecked /></label>
        <label className="flex items-center justify-between">Route calls to online agents only <Switch defaultChecked /></label>
      </div></Panel>
      <Panel className="mt-4" title="Call log" bodyClassName="p-0"><DataTable rows={calls} columns={[
        { key: "c", header: "Contact", cell: (c) => <div><div className="font-medium">{c.contact}</div><Mono className="text-xs text-muted-foreground">{c.phone}</Mono></div> },
        { key: "d", header: "Direction", cell: (c) => c.dir },
        { key: "a", header: "Agent", cell: (c) => c.agent },
        { key: "du", header: "Duration", cell: (c) => <Mono>{c.duration}</Mono> },
        { key: "s", header: "Status", cell: (c) => <StatusBadge status={c.status} label={c.status === "failed" ? "Missed" : "Answered"} /> },
        { key: "t", header: "Time", cell: (c) => <span className="text-muted-foreground">{c.at}</span> },
      ]} /></Panel>
      <div className="mt-4"><Select value={market} onValueChange={setMarket}><SelectTrigger className="w-full sm:w-64" aria-label="Calling market"><SelectValue /></SelectTrigger><SelectContent>{whatsappUsage.map((p) => <SelectItem key={p.market} value={p.market}>{p.market}</SelectItem>)}</SelectContent></Select></div>
      {rates && <ServiceRates title={`${market} calling rates (USD)`} rows={[{ label: "Business-initiated calling", usd: rates.calling_bi, unit: "minute" }]} />}
    </>
  );
}
