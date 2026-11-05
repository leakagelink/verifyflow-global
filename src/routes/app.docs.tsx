import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HttpStatus, Mono, PageHeader, pageHead } from "@/components/shared";
import { CodeBlock } from "@/components/shared/code-block";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/docs")({
  head: () => pageHead("API Reference", "Com Nexa API REST API reference with code samples and a sandbox request tester."),
  component: Docs,
});

type Endpoint = {
  id: string; method: "GET" | "POST"; path: string; title: string; desc: string;
  params: { name: string; type: string; required?: boolean; desc: string; example?: string }[];
  response: object;
};

const endpoints: Endpoint[] = [
  { id: "order", method: "POST", path: "/v1/numbers", title: "Order a number", desc: "Reserve a virtual number for a single verification. Charged on success; refunded if no SMS arrives before expiry.",
    params: [{ name: "country", type: "string", required: true, desc: "ISO 3166-1 alpha-2 country code.", example: "US" }, { name: "service", type: "string", required: true, desc: "Service slug, e.g. telegram, google, openai.", example: "telegram" }, { name: "max_price", type: "number", desc: "Reject offers above this price in USD.", example: "0.60" }],
    response: { id: "ord_8f2k1", number: "+14155550132", status: "waiting", expires_at: "2026-11-01T04:58:00Z", cost: 0.42 } },
  { id: "sms", method: "GET", path: "/v1/numbers/{id}/sms", title: "Get received SMS", desc: "Poll for messages on a number. Prefer the sms.received webhook in production.",
    params: [{ name: "id", type: "string", required: true, desc: "Order ID returned when ordering.", example: "ord_8f2k1" }],
    response: { data: [{ code: "839201", text: "Telegram code: 839201", received_at: "2026-11-01T04:39:12Z" }] } },
  { id: "cancel", method: "POST", path: "/v1/numbers/{id}/cancel", title: "Cancel & refund", desc: "Cancel a waiting order. The full cost returns to your wallet.",
    params: [{ name: "id", type: "string", required: true, desc: "Order ID.", example: "ord_8f2k1" }],
    response: { id: "ord_8f2k1", status: "cancelled", refunded: 0.42 } },
  { id: "balance", method: "GET", path: "/v1/wallet/balance", title: "Wallet balance", desc: "Current credit balance for the authenticated account.", params: [], response: { balance: 128.5, currency: "USD" } },
  { id: "kyc", method: "POST", path: "/v1/kyc/verify", title: "KYC phone check", desc: "Check carrier, line type and risk score for a phone number.",
    params: [{ name: "phone", type: "string", required: true, desc: "E.164 phone number.", example: "+14155550132" }],
    response: { phone: "+14155550132", carrier: "Verizon", line_type: "mobile", risk_score: 12, ported: false } },
];

function snippet(lang: string, e: Endpoint) {
  const url = `https://api.comnexaapi.com${e.path}`;
  const body = Object.fromEntries(e.params.filter((p) => !e.path.includes(`{${p.name}}`)).map((p) => [p.name, p.example]));
  const hasBody = e.method === "POST" && Object.keys(body).length > 0;
  const json = JSON.stringify(body);
  switch (lang) {
    case "curl": return `curl -X ${e.method} ${url} \\\n  -H "Authorization: Bearer $COMNEXA_API_KEY"${hasBody ? ` \\\n  -H "Content-Type: application/json" \\\n  -d '${json}'` : ""}`;
    case "python": return `import requests\n\nres = requests.${e.method.toLowerCase()}(\n    "${url}",\n    headers={"Authorization": f"Bearer {COMNEXA_API_KEY}"},${hasBody ? `\n    json=${json},` : ""}\n)\nprint(res.json())`;
    case "node": return `const res = await fetch("${url}", {\n  method: "${e.method}",\n  headers: {\n    Authorization: \`Bearer \${process.env.COMNEXA_API_KEY}\`,${hasBody ? `\n    "Content-Type": "application/json",` : ""}\n  },${hasBody ? `\n  body: JSON.stringify(${json}),` : ""}\n});\nconsole.log(await res.json());`;
    default: return `req, _ := http.NewRequest("${e.method}", "${url}", ${hasBody ? `strings.NewReader(\`${json}\`)` : "nil"})\nreq.Header.Set("Authorization", "Bearer "+os.Getenv("COMNEXA_API_KEY"))\nres, _ := http.DefaultClient.Do(req)\ndefer res.Body.Close()`;
  }
}

function Docs() {
  const [active, setActive] = useState(endpoints[0]!.id);
  const [lang, setLang] = useState("curl");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const e = endpoints.find((x) => x.id === active)!;
  return (
    <>
      <PageHeader title="API reference" description="Base URL https://api.comnexaapi.com · Authenticate with a Bearer API key." />
      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        <nav className="space-y-0.5 lg:sticky lg:top-20 lg:self-start">
          <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Endpoints</div>
          {endpoints.map((x) => (
            <button key={x.id} onClick={() => { setActive(x.id); setResult(null); }}
              className={cn("flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors", active === x.id ? "bg-accent text-accent-foreground" : "hover:bg-muted")}>
              <Mono className={cn("w-9 text-[10px] font-semibold", x.method === "GET" ? "text-success" : "text-primary")}>{x.method}</Mono>{x.title}
            </button>
          ))}
        </nav>
        <div className="grid min-w-0 gap-6 xl:grid-cols-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2"><Mono className={cn("rounded px-1.5 py-0.5 text-xs font-semibold", e.method === "GET" ? "bg-success/10 text-success" : "bg-primary/10 text-primary")}>{e.method}</Mono><Mono className="text-sm">{e.path}</Mono></div>
            <h2 className="mt-3 text-lg font-semibold">{e.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{e.desc}</p>
            <h3 className="mb-2 mt-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">Parameters</h3>
            {e.params.length === 0 ? <p className="text-sm text-muted-foreground">No parameters.</p> : (
              <div className="divide-y rounded-md border">
                {e.params.map((p) => (
                  <div key={p.name} className="p-3 text-sm">
                    <div className="flex items-center gap-2"><Mono className="font-medium">{p.name}</Mono><span className="text-xs text-muted-foreground">{p.type}</span>{p.required && <span className="text-[11px] font-medium text-warning">required</span>}</div>
                    <p className="mt-0.5 text-muted-foreground">{p.desc}</p>
                  </div>
                ))}
              </div>
            )}
            <h3 className="mb-2 mt-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">Try it in sandbox</h3>
            <div className="space-y-2 rounded-md border p-3">
              {e.params.map((p) => <div key={p.name} className="flex items-center gap-2"><Mono className="w-24 text-xs text-muted-foreground">{p.name}</Mono><Input defaultValue={p.example ?? ""} className="h-8 font-mono text-xs" /></div>)}
              <Button size="sm" disabled={running} onClick={() => { setRunning(true); setResult(null); setTimeout(() => { setRunning(false); setResult(JSON.stringify(e.response, null, 2)); }, 700); }}>
                {running ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5" />}Run in sandbox
              </Button>
              {result && <div className="space-y-2 pt-1 animate-in fade-in"><div className="flex items-center gap-2 text-xs"><HttpStatus code={200} /><span className="text-muted-foreground">142ms · sandbox</span></div><CodeBlock code={result} /></div>}
            </div>
          </div>
          <div className="min-w-0 space-y-4 xl:sticky xl:top-20 xl:self-start">
            <div>
              <Tabs value={lang} onValueChange={setLang}><TabsList className="h-8">{[["curl", "cURL"], ["python", "Python"], ["node", "Node.js"], ["go", "Go"]].map(([v, l]) => <TabsTrigger key={v} value={v!} className="text-xs">{l}</TabsTrigger>)}</TabsList></Tabs>
              <CodeBlock className="mt-2" code={snippet(lang, e)} title="Request" />
            </div>
            <CodeBlock code={JSON.stringify(e.response, null, 2)} title="Response · 200" />
          </div>
        </div>
      </div>
    </>
  );
}
