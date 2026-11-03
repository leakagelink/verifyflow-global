import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Logo } from "@/components/layout/logo";
import { aiPlans, formatServicePrice, rentalPrices, smsPrices, virtualPrices, voicePrices, whatsappPlans, whatsappUsage } from "@/services/pricing";
import { kycPrice, kycServices } from "@/services/kyc-data";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Numora virtual numbers, SMS, WhatsApp & KYC" },
      { name: "description", content: "Transparent pay-as-you-go pricing for virtual numbers, rentals, SMS, voice, WhatsApp plans, AI tokens and KYC APIs." },
      { property: "og:title", content: "Numora pricing" },
      { property: "og:description", content: "WhatsApp plans, AI tokens, SMS & voice, KYC and virtual number prices." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Pricing,
});

const planFeatures: Record<string, string[]> = {
  Developer: ["10,000 contacts", "100 templates", "1,500 msg/min", "Broadcast campaigns", "Developer API & webhooks", "Analytics & reports"],
  Starter: ["Unlimited contacts", "5 agent seats · 5 chatbots", "200 templates · 2,499 msg/min", "500,000 free AI tokens", "Live chat, AI chatbot, calling", "Supervisor dashboard"],
  Growth: ["Unlimited contacts & campaigns", "100 agent seats · 100 chatbots", "2,000 templates · 3,500 msg/min", "500,000 free AI tokens", "Commerce, catalog & booking", "Everything in Starter"],
};

const faqs: [string, string][] = [
  ["Is there a free trial available?", "Yes — sandbox API keys are free, and new accounts get trial credits to test live numbers."],
  ["Can I change my plan later?", "Anytime. Upgrades apply immediately; downgrades apply at the next billing cycle."],
  ["Are there any hidden fees?", "No. Every price shown already includes our platform fee — what you see is what you pay."],
  ["What payment methods do you accept?", "Cards, UPI, PayPal, crypto and bank wire for wallet top-ups."],
];

const inr = (n: number) => formatServicePrice(n, "INR");
const fromPrice = (service: string) => Math.min(...virtualPrices.filter((p) => p.service === service).map((p) => p.priceInr));

function Section({ tag, title, sub, children }: { tag: string; title: string; sub?: string; children: React.ReactNode }) {
  return <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
    <div className="mb-8 text-center"><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">{tag}</span>
      <h2 className="mt-3 text-2xl font-bold sm:text-3xl">{title}</h2>{sub && <p className="mt-2 text-muted-foreground">{sub}</p>}</div>
    {children}
  </section>;
}

function PriceCard({ title, price, unit, desc }: { title: string; price: string; unit: string; desc?: string }) {
  return <div className="card-3d rounded-xl border bg-card p-5"><div className="font-semibold">{title}</div>{desc && <p className="mt-1 text-xs text-muted-foreground">{desc}</p>}
    <div className="mt-4 text-2xl font-bold">{price}<span className="ml-1 text-xs font-normal text-muted-foreground">/ {unit}</span></div></div>;
}

function Pricing() {
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");
  const india = whatsappUsage.find((p) => p.market === "India");
  const services = [...new Set(virtualPrices.map((p) => p.service))];
  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="sticky top-0 z-30 bg-background/70 backdrop-blur-xl"><div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"><Logo />
        <Button size="sm" asChild><Link to="/app">Dashboard</Link></Button></div></header>

      <Section tag="WhatsApp plans" title="Plans for every team" sub="Monthly or yearly — save with annual billing.">
        <div className="mb-6 flex justify-center"><div className="inline-flex rounded-full border bg-card p-1">
          {(["monthly", "yearly"] as const).map((c) => <button key={c} onClick={() => setCycle(c)} className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${cycle === c ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"}`}>{c}</button>)}
        </div></div>
        <div className="grid gap-4 md:grid-cols-3">
          {whatsappPlans.filter((p) => p.cycle === cycle).map((p) => <div key={p.name} className={`card-3d rounded-2xl border bg-card p-6 ${p.name === "Starter" ? "ring-2 ring-primary" : ""}`}>
            {p.name === "Starter" && <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">Most popular</span>}
            <h3 className="mt-2 text-lg font-semibold">{p.name}</h3>
            <div className="mt-2 text-3xl font-bold">{inr(p.inr)}<span className="text-sm font-normal text-muted-foreground">/{cycle === "monthly" ? "mo" : "yr"}</span></div>
            <div className="text-xs text-muted-foreground">{formatServicePrice(p.usd)}</div>
            <ul className="mt-4 space-y-2 text-sm">{(planFeatures[p.name] ?? []).map((f) => <li key={f} className="flex gap-2"><Check className="size-4 text-success" />{f}</li>)}</ul>
            <Button className="mt-6 w-full" variant={p.name === "Starter" ? "default" : "outline"} asChild><Link to="/app/wa/onboarding">Get started</Link></Button>
          </div>)}
        </div>
      </Section>

      <Section tag="AI plans" title="AI token plans" sub="Power your WhatsApp AI chatbot with knowledge-base tokens.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{aiPlans.map((p) => <div key={p.name} className="card-3d rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between"><span className="font-semibold">{p.name}</span><span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">{p.type === "plan" ? "Plan" : "Top-up"}</span></div>
          <div className="mt-3 text-2xl font-bold">{inr(p.inr)}</div>
          <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><Sparkles className="size-3.5" />{p.tokens.toLocaleString("en-IN")} AI tokens</div>
        </div>)}</div>
      </Section>

      <Section tag="Pay as you go" title="SMS, Voice & WhatsApp" sub="No subscription — just add credits and start sending.">
        <div className="grid gap-4 md:grid-cols-3">
          <RateList title="SMS" rows={smsPrices.map((p) => [p.label, `${inr(p.inr)} / credit`] as [string, string])} />
          <RateList title="Voice" rows={voicePrices.map((p) => [p.label, `${inr(p.inr)} / credit`] as [string, string])} />
          {india && <RateList title="WhatsApp · India (USD)" rows={[["Marketing", india.marketing], ["Utility", india.utility], ["Authentication", india.auth], ["Authentication intl", india.auth_intl], ["Business calling / min", india.calling_bi], ["Service 24h", india.service]].map(([l, v]) => [String(l), `${formatServicePrice(Number(v))} / msg`] as [string, string])} />}
        </div>
      </Section>

      <Section tag="KYC & bank verification APIs" title="Pay only for what you verify" sub="Per-call pricing, no monthly minimums.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{kycServices.map((s) => <PriceCard key={s.id} title={s.title} desc={s.desc} price={inr(kycPrice(s))} unit="call" />)}</div>
      </Section>

      <Section tag="Virtual numbers" title="Receive OTPs from any platform" sub="Starting prices per service — every price includes our platform fee.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{services.map((s) => <PriceCard key={s} title={s.charAt(0).toUpperCase() + s.slice(1)} price={`from ${inr(fromPrice(s))}`} unit="number" />)}</div>
      </Section>

      <Section tag="Long-term rentals" title="Rent a number by the month">
        <div className="grid gap-4 sm:grid-cols-3">{rentalPrices.map((r) => <PriceCard key={r.country} title={r.name} desc={r.country} price={inr(r.priceInr)} unit="month" />)}</div>
      </Section>

      <Section tag="FAQ" title="Frequently asked questions">
        <Accordion type="single" collapsible className="mx-auto max-w-2xl">{faqs.map(([q, a]) => <AccordionItem key={q} value={q}><AccordionTrigger>{q}</AccordionTrigger><AccordionContent>{a}</AccordionContent></AccordionItem>)}</Accordion>
      </Section>
    </div>
  );
}

function RateList({ title, rows }: { title: string; rows: [string, string][] }) {
  return <div className="card-3d rounded-xl border bg-card"><div className="border-b px-5 py-3 font-semibold">{title}</div>
    <dl className="divide-y">{rows.map(([l, v]) => <div key={l} className="flex justify-between gap-2 px-5 py-2.5 text-sm"><dt className="capitalize">{l}</dt><dd className="font-mono">{v}</dd></div>)}</dl></div>;
}
