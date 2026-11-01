import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Code2, Globe2, MessageCircle, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { CodeBlock } from "@/components/shared/code-block";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Numora — Virtual numbers & OTP verification API" },
      { name: "description", content: "Virtual phone numbers, SMS & WhatsApp OTP, rentals and KYC APIs in 180+ countries with credit-based billing." },
      { property: "og:title", content: "Numora — Virtual numbers & OTP verification API" },
      { property: "og:description", content: "Virtual numbers, SMS & WhatsApp OTP and KYC APIs for developers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Globe2, title: "180+ countries", body: "Real carrier numbers with live stock and success rates." },
  { icon: Zap, title: "Codes in seconds", body: "Median OTP delivery under 18 seconds, auto-refund on timeout." },
  { icon: MessageCircle, title: "WhatsApp ready", body: "Code, QR linking and voice OTP fallback." },
  { icon: Code2, title: "Developer-first API", body: "REST, webhooks, sandbox keys and SDKs." },
  { icon: ShieldCheck, title: "KYC checks", body: "Carrier, line type and risk scoring per number." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo />
        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild><Link to="/app/docs">Docs</Link></Button>
          <Button variant="ghost" size="sm" asChild><Link to="/app/marketplace">Pricing</Link></Button>
          <Button size="sm" asChild><Link to="/app">Open dashboard</Link></Button>
        </nav>
      </header>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
        <div>
          <span className="rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">Pay-as-you-go credits · No monthly fees</span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">Phone verification infrastructure for every country.</h1>
          <p className="mt-4 max-w-lg text-muted-foreground">Virtual numbers, SMS and WhatsApp OTP, rentals and KYC — one API, one wallet.</p>
          <div className="mt-8 flex gap-3">
            <Button asChild><Link to="/app">Start free <ArrowRight className="size-4" /></Link></Button>
            <Button variant="outline" asChild><Link to="/app/docs">Read the API docs</Link></Button>
          </div>
        </div>
        <CodeBlock title="Order a number" code={`curl -X POST https://api.numora.io/v1/numbers \\\n  -H "Authorization: Bearer $NUMORA_KEY" \\\n  -d '{"country":"US","service":"telegram"}'\n\n{\n  "id": "ord_8f2k1",\n  "number": "+14155550132",\n  "status": "waiting",\n  "cost": 0.42\n}`} />
      </section>
      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-24 sm:grid-cols-2 lg:grid-cols-5">
        {features.map((f) => (
          <div key={f.title} className="rounded-lg border bg-card p-5">
            <f.icon className="size-5 text-primary" />
            <div className="mt-3 text-sm font-medium">{f.title}</div>
            <p className="mt-1 text-xs text-muted-foreground">{f.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
