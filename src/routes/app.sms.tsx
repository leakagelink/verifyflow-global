import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CopyButton, DataTable, Mono, PageHeader, Panel, StatusBadge, fmtDate, fmtUsd, pageHead, type Column } from "@/components/shared";
import { verifications } from "@/services/mock-data";

export const Route = createFileRoute("/app/sms")({
  head: () => pageHead("SMS Verifications", "Active SMS OTP sessions and recent verification history."),
  component: SmsPage,
});

const TOTAL = 1200;

function SmsPage() {
  const [left, setLeft] = useState(TOTAL);
  const [code, setCode] = useState<string | null>(null);
  const [state, setState] = useState<"waiting" | "completed" | "cancelled">("waiting");

  useEffect(() => {
    if (state !== "waiting") return;
    const t = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    const r = setTimeout(() => { setCode("839201"); setState("completed"); toast.success("OTP received from Telegram"); }, 9000);
    return () => { clearInterval(t); clearTimeout(r); };
  }, [state]);

  const restart = () => { setLeft(TOTAL); setCode(null); setState("waiting"); };
  const rows = verifications.filter((v) => v.channel === "SMS").slice(0, 12);
  type Row = (typeof rows)[number];
  const columns: Column<Row>[] = [
    { key: "n", header: "Number", cell: (r) => <span className="flex items-center gap-2">{r.country.flag}<Mono>{r.number}</Mono></span> },
    { key: "s", header: "Service", cell: (r) => r.service.name },
    { key: "c", header: "Code", cell: (r) => (r.code ? <Mono className="tracking-widest">{r.code}</Mono> : <span className="text-muted-foreground">—</span>) },
    { key: "st", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
    { key: "cost", header: "Cost", className: "text-right", cell: (r) => <Mono>{fmtUsd(r.cost)}</Mono> },
    { key: "t", header: "Time (UTC)", cell: (r) => <span className="text-muted-foreground">{fmtDate(r.createdAt)}</span> },
  ];

  return (
    <>
      <PageHeader title="SMS verifications" description="Your number stays reserved until a code arrives or the timer ends." />
      <div className="grid gap-4 lg:grid-cols-5">
        <Panel className="lg:col-span-3" title="Active session" description="Order ord_8f2k1 · Telegram · 🇺🇸 United States"
          actions={<StatusBadge status={state} label={state === "waiting" ? "Waiting for SMS" : undefined} />}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs text-muted-foreground">Phone number</div>
              <div className="flex items-center gap-1"><Mono className="text-2xl font-medium">+1 (415) 555-0132</Mono><CopyButton value="+14155550132" /></div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Time left</div>
              <Mono className="text-2xl font-medium">{Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}</Mono>
            </div>
          </div>
          <Progress value={(left / TOTAL) * 100} className="mt-4 h-1" />
          <div className="mt-5 grid min-h-28 place-items-center rounded-lg border border-dashed bg-muted/30 p-6">
            {state === "waiting" && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Listening for incoming SMS…</div>}
            {state === "completed" && code && (
              <div className="text-center animate-in fade-in zoom-in-95">
                <div className="text-xs text-muted-foreground">Telegram code: {code}. Do not share it.</div>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <Mono className="rounded-md bg-accent px-4 py-2 text-3xl font-semibold tracking-[0.3em] text-accent-foreground">{code}</Mono>
                  <CopyButton value={code} className="p-2" />
                </div>
              </div>
            )}
            {state === "cancelled" && <div className="text-sm text-muted-foreground">Cancelled — <b>$0.42</b> returned to your wallet.</div>}
          </div>
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            {state === "waiting" && <Button variant="outline" size="sm" onClick={() => { setState("cancelled"); toast("Order cancelled and refunded"); }}><X className="size-4" />Cancel & refund</Button>}
            <Button size="sm" variant={state === "waiting" ? "secondary" : "default"} onClick={restart}><RotateCcw className="size-4" />{state === "waiting" ? "Request another SMS" : "New session"}</Button>
          </div>
        </Panel>
        <Panel className="lg:col-span-2" title="How it works">
          <ol className="space-y-3 text-sm">
            {["Enter the number on the target service.", "Wait here — codes appear within 10–60 seconds.", "No code in 20 minutes? You're refunded automatically.", "Need a second code? Request another SMS on the same number."].map((s, i) => (
              <li key={i} className="flex gap-3"><span className="grid size-5 shrink-0 place-items-center rounded-full bg-muted font-mono text-[11px]">{i + 1}</span><span className="text-muted-foreground">{s}</span></li>
            ))}
          </ol>
        </Panel>
      </div>
      <Panel className="mt-4" title="Recent SMS verifications" bodyClassName="p-0"><DataTable columns={columns} rows={rows} /></Panel>
    </>
  );
}
