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

export const Route = createFileRoute("/app/wa/qr")({
  head: () => pageHead("WhatsApp QR Codes", "Generate QR codes and wa.me links that open a chat with you."),
  component: Page,
});

function Page() {
  const [msg, setMsg] = useState("Hi! I want to know more");
  const link = `https://wa.me/918047182200?text=${encodeURIComponent(msg)}`;
  return (
    <>
      <PageHeader title="WhatsApp QR Codes" description="Generate QR codes and wa.me links that open a chat with you." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Generate QR code">
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>Pre-filled message</Label><Input value={msg} onChange={(e) => setMsg(e.target.value)} /></div>
            <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-2"><Mono className="flex-1 truncate text-xs">{link}</Mono><CopyButton value={link} /></div>
            <img alt="WhatsApp QR code" className="size-44 rounded-md border bg-card p-2" src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link)}`} />
            <Button onClick={() => toast.success("Demo: QR saved")}>Save QR code</Button>
          </div>
        </Panel>
        <Panel title="Saved QR codes" bodyClassName="p-0">
          {qrCodes.map((q) => <div key={q.name} className="flex items-center justify-between border-b px-4 py-3 text-sm last:border-0"><div><div className="font-medium">{q.name}</div><div className="text-xs text-muted-foreground">{q.message}</div></div><div className="text-right"><Mono>{q.scans.toLocaleString()}</Mono><div className="text-xs text-muted-foreground">scans</div></div></div>)}
        </Panel>
      </div>
    </>
  );
}
