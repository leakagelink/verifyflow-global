import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Mono, PageHeader, Panel, StatusBadge, pageHead } from "@/components/shared";
import { waNumbers } from "@/services/messaging-data";
import { cn } from "@/lib/utils";
import { ServiceRates } from "@/components/shared/service-rates";
import { whatsappPlans } from "@/services/pricing";

export const Route = createFileRoute("/app/wa/onboarding")({
  head: () => pageHead("WhatsApp Onboarding", "Connect your business number to the WhatsApp Business API."),
  component: Onboarding,
});

const steps = ["Business profile", "Connect Meta account", "Connect number", "Verify number", "Go live"];

function Onboarding() {
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [otp, setOtp] = useState("");
  const next = (ms = 900) => { setBusy(true); setTimeout(() => { setBusy(false); setStep((s) => s + 1); }, ms); };

  return (
    <>
      <PageHeader title="WhatsApp Business onboarding" description="Get your number on the official WhatsApp Business API in about 10 minutes." />
      <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
        <ol className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:block lg:space-y-1 lg:overflow-visible lg:p-0">
          {steps.map((s, i) => (
            <li key={s} className={cn("flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm lg:gap-3", i === step && "bg-accent text-accent-foreground font-medium")}>
              <span className={cn("grid size-6 place-items-center rounded-full border font-mono text-[11px]", i < step && "border-success bg-success text-success-foreground")}>
                {i < step ? <Check className="size-3.5" /> : i + 1}
              </span>{s}
            </li>
          ))}
        </ol>
        <Panel title={steps[Math.min(step, 4)]}>
          {step === 0 && (
            <div className="grid max-w-xl gap-3 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Display name</Label><Input defaultValue="Acme Support" /></div>
              <div className="space-y-1.5"><Label>Category</Label><Input defaultValue="Technology" /></div>
              <div className="space-y-1.5 sm:col-span-2"><Label>Website</Label><Input defaultValue="https://acme.io" /></div>
              <div className="sm:col-span-2"><Button onClick={() => next(300)}>Continue</Button></div>
            </div>
          )}
          {step === 1 && (
            <div className="max-w-xl space-y-3 text-sm">
              <p className="text-muted-foreground">Sign in with Facebook to create or pick your Meta Business account and WhatsApp Business Account (WABA).</p>
              <Button disabled={busy} onClick={() => next(1400)}>{busy && <Loader2 className="size-4 animate-spin" />}Continue with Facebook</Button>
            </div>
          )}
          {step === 2 && (
            <div className="max-w-xl space-y-4">
              <RadioGroup defaultValue="new" className="grid gap-2">
                {[["new", "Use a new number", "A number not currently on any WhatsApp app."], ["migrate", "Migrate existing number", "Move a number from WhatsApp Business app or another provider."], ["buy", "Get a Com Nexa API number", "Dedicated WhatsApp Business number pricing unavailable."]].map(([v, t, d]) => (
                  <Label key={v} htmlFor={v} className="flex cursor-pointer items-start gap-3 rounded-md border p-3 has-[:checked]:border-primary has-[:checked]:bg-accent">
                    <RadioGroupItem id={v} value={v!} className="mt-0.5" /><div><div>{t}</div><div className="text-xs font-normal text-muted-foreground">{d}</div></div>
                  </Label>
                ))}
              </RadioGroup>
              <div className="flex gap-2"><Input defaultValue="+91" className="w-20 font-mono" /><Input placeholder="Phone number" defaultValue="80 4718 2202" className="font-mono" /></div>
              <Button disabled={busy} onClick={() => next()}>{busy && <Loader2 className="size-4 animate-spin" />}Send verification code</Button>
            </div>
          )}
          {step === 3 && (
            <div className="max-w-sm space-y-3 text-sm">
              <p className="text-muted-foreground">Enter the 6-digit code sent by SMS to <Mono>+91 80 4718 2202</Mono>. Demo code: <Mono>123456</Mono></p>
              <Input value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} className="font-mono tracking-[0.4em]" placeholder="••••••" />
              <Button disabled={busy || otp.length !== 6} onClick={() => (otp === "123456" ? next() : toast.error("Wrong code"))}>{busy && <Loader2 className="size-4 animate-spin" />}Verify</Button>
            </div>
          )}
          {step >= 4 && (
            <div className="space-y-2 text-sm animate-in fade-in">
              <div className="flex items-center gap-2 font-medium text-success"><Check className="size-4" />Your number is live on WhatsApp Business API</div>
              <p className="text-muted-foreground">You can now send templates, run broadcasts and chat with customers.</p>
            </div>
          )}
        </Panel>
      </div>
      <Panel className="mt-4" title="Connected numbers" actions={<Button size="sm" variant="outline" className="h-7" onClick={() => setStep(2)}><Plus className="size-3.5" />Connect number</Button>} bodyClassName="p-0">
        {waNumbers.map((n) => (
          <div key={n.number} className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 text-sm last:border-0">
            <div><div className="font-medium">{n.name}</div><Mono className="text-muted-foreground">{n.number} · {n.waba}</Mono></div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground"><span>Quality <b className={n.quality === "High" ? "text-success" : "text-warning"}>{n.quality}</b></span><span>Limit {n.tier}</span><StatusBadge status={n.status} label="Connected" /></div>
          </div>
        ))}
      </Panel>
      <ServiceRates title="WhatsApp Business plans" rows={whatsappPlans.map((p) => ({ label: p.name, inr: p.inr, usd: p.usd, unit: p.cycle === "monthly" ? "month" : "year" }))} />
    </>
  );
}
