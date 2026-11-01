import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MoreHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton, DataTable, Mono, PageHeader, Panel, StatCard, StatusBadge, pageHead, type Column } from "@/components/shared";
import { apiKeys as seed } from "@/services/mock-data";

export const Route = createFileRoute("/app/api-keys")({
  head: () => pageHead("API Keys", "Create, restrict and revoke API keys for the Numora API."),
  component: ApiKeys,
});

const scopes = ["numbers:write", "numbers:read", "sms:read", "whatsapp:write", "wallet:read", "kyc:write"];
type Key = (typeof seed)[number];

function ApiKeys() {
  const [keys, setKeys] = useState<Key[]>(seed);
  const [open, setOpen] = useState(false);
  const [created, setCreated] = useState<string | null>(null);
  const [name, setName] = useState("");

  const columns: Column<Key>[] = [
    { key: "n", header: "Name", cell: (k) => <div><div className="font-medium">{k.name}</div><div className="text-xs text-muted-foreground">Created {k.created}</div></div> },
    { key: "k", header: "Key", cell: (k) => <span className="flex items-center gap-1"><Mono>{k.prefix}••••••••</Mono><CopyButton value={`${k.prefix}…`} /></span> },
    { key: "s", header: "Scopes", cell: (k) => <div className="flex max-w-56 flex-wrap gap-1">{k.scopes.map((s) => <Mono key={s} className="rounded bg-muted px-1.5 py-0.5 text-[11px]">{s}</Mono>)}</div> },
    { key: "ip", header: "IP allowlist", cell: (k) => (k.ips.length ? <Mono className="text-xs">{k.ips.join(", ")}</Mono> : <span className="text-xs text-muted-foreground">Any IP</span>) },
    { key: "u", header: "Calls (30d)", className: "text-right", cell: (k) => <Mono>{k.calls30d.toLocaleString()}</Mono> },
    { key: "l", header: "Last used", cell: (k) => <span className="text-muted-foreground">{k.lastUsed}</span> },
    { key: "st", header: "Status", cell: (k) => <StatusBadge status={k.status} /> },
    { key: "a", header: "", cell: (k) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-7" aria-label="Key actions"><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => toast("Demo: key rolled")}>Roll key</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive" disabled={k.status === "revoked"}
            onClick={() => { setKeys((ks) => ks.map((x) => (x.id === k.id ? { ...x, status: "revoked" } : x))); toast.success("Key revoked"); }}>Revoke</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>) },
  ];

  return (
    <>
      <PageHeader title="API keys" description="Keys authenticate requests to api.numora.io. Keep live keys server-side."
        actions={
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setCreated(null); setName(""); } }}>
            <DialogTrigger asChild><Button size="sm"><Plus className="size-4" />Create key</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{created ? "Save your key" : "Create API key"}</DialogTitle>
                <DialogDescription>{created ? "This is the only time the full key is shown." : "Choose a name, scopes and optional IP restrictions."}</DialogDescription></DialogHeader>
              {created ? (
                <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-3"><Mono className="flex-1 break-all">{created}</Mono><CopyButton value={created} /></div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1.5"><Label htmlFor="kname">Name</Label><Input id="kname" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Production backend" /></div>
                  <div className="space-y-2"><Label>Scopes</Label>
                    <div className="grid grid-cols-2 gap-2">{scopes.map((s) => <label key={s} className="flex items-center gap-2 text-sm"><Checkbox defaultChecked={s.endsWith("read")} /><Mono>{s}</Mono></label>)}</div>
                  </div>
                  <div className="space-y-1.5"><Label htmlFor="ips">IP allowlist</Label><Textarea id="ips" placeholder="One IP or CIDR per line" className="font-mono text-xs" /></div>
                </div>
              )}
              <DialogFooter>
                {created ? <Button onClick={() => setOpen(false)}>Done</Button> : (
                  <Button disabled={!name} onClick={() => {
                    const full = "nmr_live_" + Math.random().toString(36).slice(2, 14) + Math.random().toString(36).slice(2, 14);
                    setKeys((ks) => [{ id: full, name, prefix: full.slice(0, 13), env: "live", scopes: ["numbers:read", "sms:read", "wallet:read"], ips: [], lastUsed: "Never", calls30d: 0, status: "active", created: "2026-11-01" }, ...ks]);
                    setCreated(full);
                  }}>Create key</Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        } />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Active keys" value={keys.filter((k) => k.status === "active").length.toString()} />
        <StatCard label="Requests (30d)" value={keys.reduce((a, k) => a + k.calls30d, 0).toLocaleString()} delta={8.2} />
        <StatCard label="Rate limit" value="100 req/s" hint="Per key, burst 300" />
      </div>
      <Panel bodyClassName="p-0"><DataTable columns={columns} rows={keys} /></Panel>
    </>
  );
}
