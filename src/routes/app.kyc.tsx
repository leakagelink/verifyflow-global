import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Loader2, Play, Search, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeader, pageHead } from "@/components/shared";
import { CodeBlock } from "@/components/shared/code-block";
import { formatServicePrice } from "@/services/pricing";
import { kycCategories, kycPrice, kycServices, type KycService } from "@/services/kyc-data";

export const Route = createFileRoute("/app/kyc")({
  head: () => pageHead("KYC Verification Hub", "Run PAN, GST, DL, RC, bank and other KYC verifications from the dashboard."),
  component: Hub,
});

function Hub() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<KycService | null>(null);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const list = kycServices.filter((s) => (s.title + s.desc).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHeader title="Verification Hub" description="Run any KYC verification without writing code. Every call uses the same wallet + audit log as the API — results land in KYC Logs."
        actions={<><Button asChild variant="secondary" size="sm"><Link to="/app/kyc/logs">KYC Logs</Link></Button><Button asChild variant="secondary" size="sm"><Link to="/app/kyc/docs"><BookOpen className="size-3.5" />Docs</Link></Button></>} />
      <div className="relative mb-5 max-w-sm"><Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search PAN, DL, RC, GST, UPI…" className="pl-8" /></div>
      {kycCategories.map((c) => {
        const items = list.filter((s) => s.category === c.id);
        if (!items.length) return null;
        return (
          <section key={c.id} className="mb-6">
            <div className="mb-3 flex items-center justify-between"><div><h2 className="font-semibold">{c.title}</h2><p className="text-xs text-muted-foreground">{c.desc}</p></div><span className="rounded-full bg-muted px-2 text-xs">{items.length}</span></div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {items.map((s) => (
                <div key={s.id} className="card-3d lift flex flex-col rounded-2xl border">
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between"><span className="icon-3d tone-1 grid size-10 place-items-center rounded-xl text-primary-foreground"><ShieldCheck className="size-4" /></span><span className="rounded-md border px-1.5 font-mono text-xs">{formatServicePrice(kycPrice(s), "INR")}</span></div>
                    <h3 className="mt-3 font-medium">{s.title}</h3><p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                  <div className="flex items-center justify-between border-t px-4 py-2 text-xs">
                    <Link to="/app/kyc/docs" hash={s.id} className="flex items-center gap-1 text-muted-foreground hover:text-foreground"><BookOpen className="size-3.5" />Docs</Link>
                    <button onClick={() => { setActive(s); setResult(null); }} className="flex items-center gap-1 font-medium text-primary"><Play className="size-3.5" />Verify</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {active && <>
            <DialogHeader><DialogTitle>{active.title}</DialogTitle><DialogDescription>{formatServicePrice(kycPrice(active), "INR")} per successful verification · demo result</DialogDescription></DialogHeader>
            <div className="space-y-3">{active.fields.map((f) => <div key={f.name} className="space-y-1"><Label>{f.label}</Label><Input defaultValue={f.example} /></div>)}</div>
            <Button disabled={running} onClick={() => { setRunning(true); setTimeout(() => { setRunning(false); setResult(JSON.stringify(active.response, null, 2)); toast.success("Verification complete (demo)"); }, 800); }}>
              {running ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}Run verification
            </Button>
            {result && <CodeBlock code={result} title="Result" />}
          </>}
        </DialogContent>
      </Dialog>
    </>
  );
}
