import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bot, CheckCircle2, Code2, Globe2, Megaphone, MessageCircle, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { CodeBlock } from "@/components/shared/code-block";
import hero from "@/assets/hero-3d.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Com Nexa API — Virtual numbers, OTP & WhatsApp Business API" },
      { name: "description", content: "Virtual phone numbers, SMS & WhatsApp OTP, bulk SMS with DLT, WhatsApp Business inbox, bots and KYC APIs in 180+ countries." },
      { property: "og:title", content: "Com Nexa API — Virtual numbers, OTP & WhatsApp Business API" },
      { property: "og:description", content: "One platform for OTP, bulk SMS and WhatsApp Business." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Globe2, title: "180+ countries", body: "Real carrier numbers with live stock and success rates." },
  { icon: Zap, title: "Codes in seconds", body: "Median OTP delivery under 18s, auto-refund on timeout." },
  { icon: Megaphone, title: "Bulk SMS + DLT", body: "TRAI-compliant headers, templates and campaigns." },
  { icon: MessageCircle, title: "WhatsApp Business", body: "Team inbox, broadcasts, templates, calls and QR." },
  { icon: Bot, title: "Bots & AI agent", body: "No-code bot builder and AI trained on your content." },
  { icon: Code2, title: "Developer-first API", body: "REST, webhooks, sandbox keys and SDKs." },
];

const stats = [["180+", "Countries"], ["99.98%", "API uptime"], ["18s", "Median OTP time"], ["12K+", "Businesses"]];

function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="sticky top-0 z-30 border-b border-transparent bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Logo />
          <nav className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild><Link to="/app/docs">Docs</Link></Button>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild><Link to="/pricing">Pricing</Link></Button>
            <Button size="sm" asChild><Link to="/app">Dashboard</Link></Button>
          </nav>
        </div>
      </header>

      <section className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:pt-20">
        <div className="relative z-10 text-center lg:text-left">
          <span className="card-3d inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-success" />Pay-as-you-go credits · No monthly fees
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-gradient">Com Nexa API</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base text-muted-foreground lg:mx-0">Phone verification and messaging for every country. Virtual numbers, OTP, bulk SMS and WhatsApp Business — one API, one wallet.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Button size="lg" asChild><Link to="/app">Start free <ArrowRight className="size-4" /></Link></Button>
            <Button size="lg" variant="outline" className="card-3d" asChild><Link to="/app/docs">Read the API docs</Link></Button>
          </div>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground lg:justify-start">
            {["Auto refunds", "Sandbox keys", "DLT ready"].map((t) => <li key={t} className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-success" />{t}</li>)}
          </ul>
        </div>
        <div className="relative">
          <div className="absolute inset-10 rounded-full bg-primary/25 blur-3xl" />
          <img src={hero} alt="3D phone receiving a verification code with WhatsApp and SMS bubbles" width={1200} height={1024} className="animate-float relative mx-auto w-full max-w-lg drop-shadow-2xl" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="card-3d grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-4">
          {stats.map(([v, l]) => (
            <div key={l} className="bg-card p-5 text-center"><div className="font-mono text-2xl font-semibold text-gradient">{v}</div><div className="mt-1 text-xs text-muted-foreground">{l}</div></div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">Everything you need in one platform</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="card-3d lift group rounded-2xl border p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow transition-transform group-hover:-rotate-6 group-hover:scale-110"><f.icon className="size-5" /></span>
              <div className="mt-4 font-medium">{f.title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-24 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Ship verification in 5 minutes</h2>
          <p className="mt-3 text-muted-foreground">One request to get a number, one webhook when the code arrives. Test everything free in sandbox.</p>
          <Button className="mt-6" asChild><Link to="/app/api-keys">Get your API key <ArrowRight className="size-4" /></Link></Button>
        </div>
        <div className="tilt-3d card-3d rounded-2xl border p-2 shadow-2xl">
          <CodeBlock title="POST /v1/numbers" code={`curl -X POST https://api.comnexaapi.com/v1/numbers \\\n  -H "Authorization: Bearer $COMNEXA_API_KEY" \\\n  -d '{"country":"US","service":"telegram"}'\n\n{\n  "id": "ord_8f2k1",\n  "number": "+14155550132",\n  "status": "waiting",\n  "cost": 0.42\n}`} />
        </div>
      </section>

      <footer className="border-t py-8 text-center text-xs text-muted-foreground"><ShieldCheck className="mr-1 inline size-3.5" />© 2026 Com Nexa API. All rights reserved.</footer>
    </div>
  );
}
