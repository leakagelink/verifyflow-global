import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bot, GitBranch, MessageSquare, Plus, Save, UserRound, Webhook } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { PageHeader, Panel, pageHead } from "@/components/shared";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/wa/bots")({
  head: () => pageHead("Bot Builder", "Build no-code WhatsApp chatbots with keyword triggers and branching."),
  component: Bots,
});

type Node = { id: number; kind: "message" | "buttons" | "condition" | "api" | "agent"; text: string; options?: string[] };
const kinds = [
  { kind: "message", label: "Send message", icon: MessageSquare },
  { kind: "buttons", label: "Ask with buttons", icon: GitBranch },
  { kind: "condition", label: "Condition", icon: GitBranch },
  { kind: "api", label: "Call API / webhook", icon: Webhook },
  { kind: "agent", label: "Hand over to agent", icon: UserRound },
] as const;

function Bots() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: 1, kind: "message", text: "Hi {{name}} 👋 Welcome to Acme!" },
    { id: 2, kind: "buttons", text: "How can we help today?", options: ["Track order", "Pricing", "Talk to human"] },
    { id: 3, kind: "api", text: "GET /orders?phone={{phone}}" },
    { id: 4, kind: "agent", text: "Assign to Support team" },
  ]);
  const [sel, setSel] = useState(2);
  const node = nodes.find((n) => n.id === sel);
  return (
    <>
      <PageHeader title="Bot builder" description="Bot: Welcome & order tracking · triggers on keywords hi, hello, order"
        actions={<><label className="flex items-center gap-2 text-xs text-muted-foreground">Active <Switch defaultChecked /></label><Button size="sm" onClick={() => toast.success("Bot published")}><Save className="size-4" />Publish</Button></>} />
      <div className="grid gap-4 lg:grid-cols-[200px_1fr_280px]">
        <Panel title="Blocks" bodyClassName="space-y-1 p-2">
          {kinds.map((k) => (
            <button key={k.kind} onClick={() => { const id = Date.now(); setNodes((n) => [...n, { id, kind: k.kind, text: k.label }]); setSel(id); }}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"><k.icon className="size-4 text-muted-foreground" />{k.label}<Plus className="ml-auto size-3.5 text-muted-foreground" /></button>
          ))}
        </Panel>
        <div className="rounded-lg border bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-[size:16px_16px] p-6">
          <div className="mx-auto flex max-w-sm flex-col items-center">
            <div className="rounded-full border bg-card px-3 py-1 text-xs font-medium"><Bot className="mr-1 inline size-3.5" />Trigger: keyword “hi”</div>
            {nodes.map((n) => {
              const k = kinds.find((x) => x.kind === n.kind)!;
              return (
                <div key={n.id} className="flex w-full flex-col items-center">
                  <div className="h-6 w-px bg-border" />
                  <button onClick={() => setSel(n.id)} className={cn("w-full rounded-lg border bg-card p-3 text-left shadow-sm transition", sel === n.id && "border-primary ring-2 ring-primary/20")}>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground"><k.icon className="size-3.5" />{k.label}</div>
                    <div className="mt-1 text-sm">{n.text}</div>
                    {n.options && <div className="mt-2 flex flex-wrap gap-1">{n.options.map((o) => <span key={o} className="rounded border px-2 py-0.5 text-xs text-primary">{o}</span>)}</div>}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <Panel title="Block settings">
          {node ? (
            <div className="space-y-3 text-sm">
              <Input value={node.text} onChange={(e) => setNodes((ns) => ns.map((n) => (n.id === sel ? { ...n, text: e.target.value } : n)))} />
              {node.options && <p className="text-xs text-muted-foreground">Buttons: {node.options.join(", ")}</p>}
              <Button size="sm" variant="outline" className="text-destructive" onClick={() => setNodes((ns) => ns.filter((n) => n.id !== sel))}>Delete block</Button>
            </div>
          ) : <p className="text-sm text-muted-foreground">Select a block.</p>}
        </Panel>
      </div>
    </>
  );
}
