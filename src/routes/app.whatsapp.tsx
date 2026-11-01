import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Loader2, PhoneCall, QrCode } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton, Mono, PageHeader, Panel, StatusBadge, pageHead } from "@/components/shared";
import { countries } from "@/services/mock-data";
import { formatServicePrice, virtualPrices } from "@/services/pricing";

export const Route = createFileRoute("/app/whatsapp")({
  head: () => pageHead("WhatsApp Verification", "Activate WhatsApp numbers with code, QR linking or voice OTP fallback."),
  component: WhatsApp,
});

function FakeQr({ seed }: { seed: number }) {
  const cells = Array.from({ length: 21 * 21 }, (_, i) => {
    const x = i % 21, y = Math.floor(i / 21);
    const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
    if (finder) { const fx = x % 14 % 7, fy = y % 14 % 7; return fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx > 1 && fx < 5 && fy > 1 && fy < 5); }
    return Math.sin(i * 12.9898 + seed) * 43758.5453 % 1 > 0.1;
  });
  return (
    <div className="grid size-48 grid-cols-[repeat(21,1fr)] gap-0 rounded-md border bg-card p-3">
      {cells.map((on, i) => <span key={i} className={on ? "bg-foreground" : ""} />)}
    </div>
  );
}

function WhatsApp() {
  const [country, setCountry] = useState("IN");
  const [step, setStep] = useState<"idle" | "pending" | "done">("idle");
  const [qrState, setQrState] = useState<"waiting" | "linked">("waiting");
  const [voice, setVoice] = useState<"idle" | "calling" | "done">("idle");
  const c = countries.find((x) => x.code === country)!;
  const offer = virtualPrices.find((p) => p.country === country && p.service === "whatsapp");

  return (
    <>
      <PageHeader title="WhatsApp verification" description="Dedicated WhatsApp-ready numbers with 96% first-attempt delivery." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Activate a number" className="lg:col-span-1">
          <div className="space-y-3">
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>{countries.map((x) => <SelectItem key={x.code} value={x.code}>{x.flag} {x.name}</SelectItem>)}</SelectContent>
            </Select>
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-muted/60 p-3 text-sm"><span className="text-muted-foreground">Price</span><Mono className="font-medium">{offer ? `${formatServicePrice(offer.priceInr, "INR")} · ${formatServicePrice(offer.price)}` : "Price unavailable"}</Mono></div>
            <Button className="w-full" disabled={step === "pending" || !offer?.stock} onClick={() => { setStep("pending"); setTimeout(() => { setStep("done"); toast.success("WhatsApp code received"); }, 3500); }}>
              {step === "pending" ? <><Loader2 className="size-4 animate-spin" />Activating…</> : "Activate WhatsApp number"}
            </Button>
            {step !== "idle" && (
              <div className="rounded-md border p-3 text-sm animate-in fade-in">
                <div className="flex items-center justify-between"><Mono>{c.dial} 98765 43210</Mono><StatusBadge status={step === "done" ? "completed" : "waiting"} /></div>
                {step === "done" && <div className="mt-2 flex items-center gap-2"><Mono className="rounded bg-accent px-2 py-1 text-lg font-semibold tracking-widest text-accent-foreground">117-503</Mono><CopyButton value="117503" /></div>}
              </div>
            )}
          </div>
        </Panel>
        <Panel className="lg:col-span-2" title="Alternative verification methods">
          <Tabs defaultValue="qr">
            <TabsList><TabsTrigger value="qr"><QrCode className="size-3.5" />QR linking</TabsTrigger><TabsTrigger value="voice"><PhoneCall className="size-3.5" />Voice OTP</TabsTrigger></TabsList>
            <TabsContent value="qr" className="mt-4">
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                <div className="relative">
                  <FakeQr seed={7} />
                  {qrState === "linked" && <div className="absolute inset-0 grid place-items-center rounded-md bg-card/90"><CheckCircle2 className="size-10 text-success" /></div>}
                </div>
                <div className="space-y-3 text-sm">
                  <p className="text-muted-foreground">Open WhatsApp on the device → <b className="text-foreground">Linked devices</b> → <b className="text-foreground">Link a device</b>, then scan this code. It refreshes every 20 seconds.</p>
                  <StatusBadge status={qrState === "linked" ? "completed" : "waiting"} label={qrState === "linked" ? "Device linked" : "Waiting for scan"} />
                  <div><Button size="sm" variant="outline" onClick={() => { setQrState("linked"); toast.success("Device linked (simulated)"); }}>Simulate scan</Button></div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="voice" className="mt-4 space-y-3 text-sm">
              <p className="text-muted-foreground">If the SMS code doesn't arrive, request a voice call. We transcribe the spoken code for you.</p>
              <Button size="sm" disabled={voice === "calling"} onClick={() => { setVoice("calling"); setTimeout(() => setVoice("done"), 3000); }}>
                {voice === "calling" ? <><Loader2 className="size-4 animate-spin" />Receiving call…</> : "Request voice OTP"}
              </Button>
              {voice === "done" && <div className="rounded-md border p-3 animate-in fade-in">Transcript: "Your WhatsApp code is <Mono className="font-semibold">4 4 1 — 2 9 0</Mono>"</div>}
            </TabsContent>
          </Tabs>
        </Panel>
      </div>
    </>
  );
}
