import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Mono, PageHeader, Panel, StatusBadge, pageHead } from "@/components/shared";
import { waTemplates } from "@/services/messaging-data";

export const Route = createFileRoute("/app/wa/templates")({
  head: () => pageHead("WhatsApp Templates", "Create and track Meta-approved WhatsApp message templates."),
  component: Templates,
});

function Templates() {
  const [body, setBody] = useState("Hi {{1}}, your appointment is confirmed for {{2}}. Reply YES to confirm.");
  const [name, setName] = useState("appointment_reminder");
  return (
    <>
      <PageHeader title="Message templates" description="Templates are needed to message customers outside the 24-hour window. Meta usually approves within minutes." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Create template">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="font-mono text-sm" /></div>
              <div className="space-y-1.5"><Label>Category</Label>
                <Select defaultValue="Utility"><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{["Marketing", "Utility", "Authentication"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div className="space-y-1.5"><Label>Body</Label><Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} /><p className="text-xs text-muted-foreground">Use {"{{1}}"}, {"{{2}}"} for variables.</p></div>
            <Button onClick={() => toast.success(`Demo: "${name}" submitted to Meta for approval`)}><Plus className="size-4" />Submit for approval</Button>
          </div>
        </Panel>
        <Panel title="Preview">
          <div className="rounded-lg bg-muted/50 p-6">
            <div className="max-w-xs rounded-lg bg-card p-3 text-sm shadow-sm">{body.replace("{{1}}", "Rohit").replace("{{2}}", "2 Nov, 11:00 AM")}<div className="mt-1 text-right text-[10px] text-muted-foreground">10:24</div></div>
            <div className="mt-1 max-w-xs rounded-lg bg-card py-2 text-center text-sm text-primary shadow-sm">Confirm</div>
          </div>
        </Panel>
      </div>
      <Panel className="mt-4" title="Your templates" bodyClassName="p-0">
        {waTemplates.map((t) => (
          <div key={t.name} className="flex flex-wrap items-start justify-between gap-3 border-b px-4 py-3 last:border-0">
            <div className="min-w-0 max-w-2xl">
              <div className="flex items-center gap-2"><Mono className="font-medium">{t.name}</Mono><span className="rounded bg-muted px-1.5 text-[11px]">{t.category}</span><span className="text-xs text-muted-foreground">{t.language}</span></div>
              <p className="mt-1 text-sm text-muted-foreground">{t.body}</p>
            </div>
            <StatusBadge status={t.status} label={t.status === "active" ? "Approved" : t.status === "failed" ? "Rejected" : "In review"} />
          </div>
        ))}
      </Panel>
    </>
  );
}
