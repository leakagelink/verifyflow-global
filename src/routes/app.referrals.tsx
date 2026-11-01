import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { AddFundsDialog } from "@/components/shared/add-funds-dialog";
import { CopyButton, DataTable, Mono, PageHeader, Panel, StatCard, StatusBadge, fmtDate, fmtUsd, pageHead } from "@/components/shared";
import { admin, creditPackages, referrals, team, transactions, usageByService, wallet } from "@/services/mock-data";

export const Route = createFileRoute("/app/referrals")({
  head: () => pageHead("Refer & Earn", "Referral link, commissions and payouts."),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Refer & Earn" description="Referral link, commissions and payouts." />
      <Panel title="Your referral link"><div className="flex items-center gap-2 rounded-md border bg-muted/50 p-2"><Mono className="flex-1">{referrals.link}</Mono><CopyButton value={referrals.link} /></div>
        <p className="mt-2 text-xs text-muted-foreground">Earn {referrals.rate}% of every top-up your referrals make, for life.</p></Panel>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Clicks" value={referrals.clicks.toLocaleString()} /><StatCard label="Signups" value={String(referrals.signups)} />
        <StatCard label="Earned" value={fmtUsd(referrals.earned)} /><StatCard label="Pending payout" value={fmtUsd(referrals.pending)} />
      </div>
      <Panel className="mt-4" title="Payout history" bodyClassName="p-0"><DataTable rows={referrals.payouts} columns={[
        { key: "i", header: "ID", cell: (p) => <Mono>{p.id}</Mono> }, { key: "m", header: "Method", cell: (p) => p.method },
        { key: "s", header: "Status", cell: (p) => <StatusBadge status={p.status} /> }, { key: "a", header: "Amount", className: "text-right", cell: (p) => <Mono>{fmtUsd(p.amount)}</Mono> },
        { key: "d", header: "Date", cell: (p) => p.at },
      ]} /></Panel>
    </>
  );
}
