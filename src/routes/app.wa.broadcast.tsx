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

export const Route = createFileRoute("/app/wa/broadcast")({
  head: () => pageHead("WhatsApp Broadcasting", "Send approved templates to segmented audiences."),
  component: Page,
});

function Page() {
  const [market, setMarket] = useState("India");
  const rates = whatsappUsage.find((p) => p.market === market);
  return (
    <>
      <PageHeader title="WhatsApp Broadcasting" description="Send approved templates to segmented audiences." />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Messages sent (30d)" value="21,610" /><StatCard label="Delivered" value="97.4%" /><StatCard label="Read rate" value="69.5%" delta={4} /><StatCard label="Replies" value="1,522" />
      </div>
      <div className="mt-4 flex justify-end"><Button size="sm" onClick={() => toast.success("Demo: broadcast created")}><Plus className="size-4" />New broadcast</Button></div>
      <Panel className="mt-3" bodyClassName="p-0"><DataTable rows={waBroadcasts} columns={[
        { key: "n", header: "Broadcast", cell: (b) => <div><div className="font-medium">{b.name}</div><Mono className="text-xs text-muted-foreground">{b.template}</Mono></div> },
        { key: "a", header: "Audience", className: "text-right", cell: (b) => <Mono>{b.audience.toLocaleString()}</Mono> },
        { key: "d", header: "Delivered", className: "text-right", cell: (b) => <Mono>{b.delivered.toLocaleString()}</Mono> },
        { key: "r", header: "Read", className: "text-right", cell: (b) => <Mono>{b.read.toLocaleString()}</Mono> },
        { key: "rp", header: "Replied", className: "text-right", cell: (b) => <Mono>{b.replied.toLocaleString()}</Mono> },
        { key: "s", header: "Status", cell: (b) => <StatusBadge status={b.status} label={b.status === "active" ? "Sending" : b.status === "pending" ? "Scheduled" : undefined} /> },
        { key: "t", header: "Date", cell: (b) => <span className="text-muted-foreground">{b.at}</span> },
      ]} /></Panel>
      <div className="mt-4"><Select value={market} onValueChange={setMarket}><SelectTrigger className="w-full sm:w-64" aria-label="Recipient market"><SelectValue /></SelectTrigger><SelectContent>{whatsappUsage.map((p) => <SelectItem key={p.market} value={p.market}>{p.market}</SelectItem>)}</SelectContent></Select></div>
      {rates && <ServiceRates title={`${market} messaging rates (USD)`} rows={[
        { label: "Marketing", usd: rates.marketing, unit: "message" },
        { label: "Utility", usd: rates.utility, unit: "message" },
        { label: "Authentication", usd: rates.auth, unit: "message" },
        { label: "Service", usd: rates.service, unit: "message" },
        ...(rates.auth_intl > 0 ? [{ label: "International authentication", usd: rates.auth_intl, unit: "message" }] : []),
      ]} />}
    </>
  );
}
