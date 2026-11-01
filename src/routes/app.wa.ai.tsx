import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, Globe, Loader2, Send, Sparkles, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, Panel, StatCard, StatusBadge, pageHead } from "@/components/shared";

export const Route = createFileRoute("/app/wa/ai")({
  head: () => pageHead("AI Hub", "Train an AI agent on your knowledge base to answer WhatsApp chats."),
  component: AiHub,
});

const sources = [
  { icon: Globe, name: "acme.io/help (42 pages)", status: "completed" },
  { icon: FileText, name: "Pricing-2026.pdf", status: "completed" },
  { icon: FileText, name: "Return-policy.docx", status: "pending" },
];

function AiHub() {
  const [q, setQ] = useState("");
  const [log, setLog] = useState<{ q: string; a: string }[]>([]);
  const [busy, setBusy] = useState(false);
  return (
    <>
      <PageHeader title="AI hub" description="An AI agent that answers customers 24/7 from your own content, and hands over to humans when unsure." />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Chats handled by AI" value="2,914" delta={18} /><StatCard label="Resolution rate" value="71%" />
        <StatCard label="Handover to agents" value="29%" /><StatCard label="Avg reply time" value="2.1s" />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <Panel title="Agent settings">
            <div className="space-y-3 text-sm">
              <label className="flex items-center justify-between">Auto-reply on WhatsApp <Switch defaultChecked /></label>
              <label className="flex items-center justify-between">Reply suggestions for agents <Switch defaultChecked /></label>
              <label className="flex items-center justify-between">Hand over when confidence &lt; 70% <Switch defaultChecked /></label>
              <Textarea defaultValue="You are Acme's friendly support assistant. Answer briefly in the customer's language. Never share pricing discounts without approval." className="text-xs" />
            </div>
          </Panel>
          <Panel title="Knowledge sources" actions={<Button size="sm" variant="outline" className="h-7" onClick={() => toast("Demo: upload dialog")}><Upload className="size-3.5" />Add</Button>} bodyClassName="p-0">
            {sources.map((s) => <div key={s.name} className="flex items-center gap-2 border-b px-4 py-2.5 text-sm last:border-0"><s.icon className="size-4 text-muted-foreground" /><span className="flex-1">{s.name}</span><StatusBadge status={s.status} label={s.status === "pending" ? "Training" : "Trained"} /></div>)}
          </Panel>
        </div>
        <Panel title={<span className="flex items-center gap-1.5"><Sparkles className="size-3.5 text-primary" />Test your AI agent</span>}>
          <div className="min-h-64 space-y-3">
            {log.length === 0 && <p className="text-sm text-muted-foreground">Ask a question a customer might send.</p>}
            {log.map((l, i) => (
              <div key={i} className="space-y-1.5 text-sm"><div className="ml-auto w-fit rounded-lg bg-primary px-3 py-2 text-primary-foreground">{l.q}</div><div className="w-fit max-w-[85%] rounded-lg bg-muted px-3 py-2">{l.a}</div></div>
            ))}
          </div>
          <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (!q) return; setBusy(true); const qq = q; setQ(""); setTimeout(() => { setBusy(false); setLog((l) => [...l, { q: qq, a: "Based on our return policy, you can return any plan within 14 days for a full refund. Want me to start the request for you?" }]); }, 900); }}>
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Can I get a refund?" />
            <Button type="submit" size="icon" disabled={busy} aria-label="Ask">{busy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}</Button>
          </form>
        </Panel>
      </div>
    </>
  );
}
