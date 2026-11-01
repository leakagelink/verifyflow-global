import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Inbox, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CopyButton, Mono, PageHeader, Panel, StatusBadge, fmtDate, fmtUsd, pageHead } from "@/components/shared";
import { rentalInbox, rentals as seed } from "@/services/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/rentals")({
  head: () => pageHead("Rental Numbers", "Weekly and monthly rental numbers with a shared SMS inbox."),
  component: Rentals,
});

function Rentals() {
  const [rentals, setRentals] = useState(seed);
  const [sel, setSel] = useState(seed[0]!.id);
  const current = rentals.find((r) => r.id === sel)!;
  return (
    <>
      <PageHeader title="Rental numbers" description="Keep a number for weeks or months and receive unlimited SMS."
        actions={
          <Dialog>
            <DialogTrigger asChild><Button size="sm"><Plus className="size-4" />Rent a number</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Rent a number</DialogTitle></DialogHeader>
              <RadioGroup defaultValue="monthly" className="grid grid-cols-2 gap-2">
                {([["weekly", "Weekly", "$4.50"], ["monthly", "Monthly", "$14.00"]] as const).map(([v, l, p]) => (
                  <Label key={v} htmlFor={v} className="flex cursor-pointer items-center gap-3 rounded-md border p-3 has-[:checked]:border-primary has-[:checked]:bg-accent">
                    <RadioGroupItem id={v} value={v} /><div><div>{l}</div><Mono className="text-xs text-muted-foreground">{p}</Mono></div>
                  </Label>
                ))}
              </RadioGroup>
              <Button onClick={() => toast.success("Demo: rental created")}>Confirm rental</Button>
            </DialogContent>
          </Dialog>
        } />
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="space-y-2 lg:col-span-2">
          {rentals.map((r) => (
            <button key={r.id} onClick={() => setSel(r.id)} className={cn("w-full rounded-lg border bg-card p-4 text-left transition-colors", sel === r.id ? "border-primary ring-1 ring-primary" : "hover:border-ring/40")}>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">{r.country.flag}<Mono className="font-medium">{r.number}</Mono></span>
                <StatusBadge status={r.status} />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{r.plan} · {fmtUsd(r.price)}</span>
                <span>{r.status === "active" ? `Renews ${r.renewsAt}` : `Expired ${r.renewsAt}`}</span>
              </div>
            </button>
          ))}
        </div>
        <Panel className="lg:col-span-3" bodyClassName="p-0"
          title={<span className="flex items-center gap-2"><Inbox className="size-3.5" />Inbox · <Mono>{current.number}</Mono><CopyButton value={current.number} /></span>}
          actions={
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-muted-foreground">Auto-renew
                <Switch checked={current.autoRenew} onCheckedChange={(v) => { setRentals((rs) => rs.map((r) => (r.id === sel ? { ...r, autoRenew: v } : r))); toast(`Auto-renew ${v ? "on" : "off"}`); }} />
              </label>
              <Button size="sm" variant="outline" className="h-7" onClick={() => toast.success(`Renewed for ${fmtUsd(current.price)}`)}><RefreshCw className="size-3.5" />Renew</Button>
            </div>
          }>
          {current.status === "expired" ? (
            <div className="p-10 text-center text-sm text-muted-foreground">This rental has expired. Renew within 7 days to keep the number.</div>
          ) : (
            <ul>
              {rentalInbox.map((m, i) => (
                <li key={i} className="border-b px-4 py-3 last:border-0">
                  <div className="flex items-center justify-between text-sm"><span className="font-medium">{m.from}</span><span className="text-xs text-muted-foreground">{fmtDate(m.at)}</span></div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{m.body}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
