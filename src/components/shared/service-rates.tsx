import { Panel } from "@/components/shared";
import { formatServicePrice, pricingCheckedAt } from "@/services/pricing";

export function ServiceRates({ title, rows }: { title: string; rows: { label: string; usd: number; inr?: number; unit: string }[] }) {
  return <Panel className="mt-4" title={title} description={`Prices as of ${pricingCheckedAt}`}>
    <dl className="divide-y">
      {rows.map((r) => <div key={`${r.label}-${r.unit}`} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
        <dt className="capitalize">{r.label}<span className="ml-2 text-xs text-muted-foreground">/ {r.unit}</span></dt>
        <dd className="font-mono">{r.inr !== undefined && <span>{formatServicePrice(r.inr, "INR")}{r.usd > 0 && " · "}</span>}{r.usd > 0 && formatServicePrice(r.usd)}</dd>
      </div>)}
    </dl>
  </Panel>;
}