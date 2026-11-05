import { createFileRoute } from "@tanstack/react-router";
import { Mono, PageHeader, Panel, pageHead } from "@/components/shared";
import { CodeBlock } from "@/components/shared/code-block";
import { formatServicePrice } from "@/services/pricing";
import { kycCategories, kycPrice, kycServices } from "@/services/kyc-data";

export const Route = createFileRoute("/app/kyc_/docs")({
  head: () => pageHead("KYC API Documentation", "Endpoints, parameters, pricing and sample responses for every KYC verification API."),
  component: KycDocs,
});

function KycDocs() {
  return (
    <>
      <PageHeader title="KYC API documentation" description="Base URL https://api.comnexaapi.com · Authorization: Bearer <API key> · All requests are POST with a JSON body." />
      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        <nav className="hidden space-y-3 lg:sticky lg:top-20 lg:block lg:self-start">
          {kycCategories.map((c) => <div key={c.id}><div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{c.title}</div>
            {kycServices.filter((s) => s.category === c.id).map((s) => <a key={s.id} href={`#${s.id}`} className="block rounded px-2 py-1 text-sm hover:bg-muted">{s.title}</a>)}</div>)}
        </nav>
        <div className="min-w-0 space-y-5">
          {kycServices.map((s) => {
            const body = JSON.stringify(Object.fromEntries(s.fields.map((f) => [f.name, f.example])));
            return (
              <div key={s.id} id={s.id} className="scroll-mt-20">
                <Panel title={s.title} actions={<Mono className="text-xs">{formatServicePrice(kycPrice(s), "INR")} / call</Mono>}>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                  <div className="mt-3 flex items-center gap-2"><Mono className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-semibold text-primary">POST</Mono><Mono className="text-sm">{s.endpoint}</Mono></div>
                  <div className="mt-3 divide-y rounded-md border text-sm">
                    {s.fields.map((f) => <div key={f.name} className="flex flex-wrap gap-2 p-2"><Mono className="font-medium">{f.name}</Mono><span className="text-xs text-muted-foreground">string · required</span><span className="text-muted-foreground">{f.label}, e.g. {f.example}</span></div>)}
                  </div>
                  <div className="mt-3 grid min-w-0 gap-3 xl:grid-cols-2">
                    <CodeBlock title="Request" code={`curl -X POST https://api.comnexaapi.com${s.endpoint} \\\n  -H "Authorization: Bearer $COMNEXA_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '${body}'`} />
                    <CodeBlock title="Response · 200" code={JSON.stringify(s.response, null, 2)} />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Errors: 400 invalid input · 402 low wallet balance · 404 record not found (not charged) · 429 rate limited.</p>
                </Panel>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
