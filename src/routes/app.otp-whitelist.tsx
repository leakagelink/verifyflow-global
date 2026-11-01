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

export const Route = createFileRoute("/app/otp-whitelist")({
  head: () => pageHead("OTP Whitelist", "Allowed test numbers, server IPs and countries for OTP sending."),
  component: Page,
});

function Page() {
  const [rows, setRows] = useState(otpWhitelist);
  const [val, setVal] = useState("");
  return (
    <>
      <PageHeader title="OTP Whitelist" description="Allowed test numbers, server IPs and countries for OTP sending." />
      <Panel title="Add entry"><form className="flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); if (!val) return; setRows((r) => [{ id: val, type: val.includes(".") ? "IP" : "Phone", value: val, label: "Added manually", added: "2026-11-01", hits: 0 }, ...r]); setVal(""); toast.success("Added to whitelist"); }}>
        <Input value={val} onChange={(e) => setVal(e.target.value)} placeholder="+91 98xxxxxxx or 10.0.0.0/24" className="max-w-sm font-mono" /><Button type="submit"><Plus className="size-4" />Add</Button>
        <label className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">Block OTP to non-whitelisted countries <Switch defaultChecked /></label>
      </form></Panel>
      <Panel className="mt-4" bodyClassName="p-0"><DataTable rows={rows} columns={[
        { key: "t", header: "Type", cell: (r) => <span className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.type}</span> },
        { key: "v", header: "Value", cell: (r) => <Mono>{r.value}</Mono> },
        { key: "l", header: "Label", cell: (r) => r.label },
        { key: "h", header: "Hits", className: "text-right", cell: (r) => <Mono>{r.hits.toLocaleString()}</Mono> },
        { key: "a", header: "Added", cell: (r) => <span className="text-muted-foreground">{r.added}</span> },
        { key: "x", header: "", cell: (r) => <Button size="icon" variant="ghost" className="size-7" aria-label="Remove" onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))}><Trash2 className="size-3.5" /></Button> },
      ]} /></Panel>
    </>
  );
}
