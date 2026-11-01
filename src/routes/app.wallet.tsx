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

export const Route = createFileRoute("/app/wallet")({
  head: () => pageHead("Wallet & Credits", "Your credit balance, packages and top-ups."),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Wallet & Credits" description="Your credit balance, packages and top-ups." />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Balance" value={fmtUsd(wallet.balance)} action={<AddFundsDialog><button className="text-xs font-medium text-primary">Add funds</button></AddFundsDialog>} />
        <StatCard label="Spent this month" value={fmtUsd(wallet.monthSpend)} delta={6.1} />
        <StatCard label="Low balance alert" value={fmtUsd(wallet.lowBalanceThreshold)} hint="Email + webhook" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {creditPackages.map((p) => (
          <Panel key={p.amount}><Mono className="text-2xl font-medium">${p.amount}</Mono><p className="text-xs text-muted-foreground">{p.bonus ? `+$${p.bonus} bonus credits` : "No bonus"}</p>
            <AddFundsDialog><Button size="sm" className="mt-3 w-full" variant={p.popular ? "default" : "outline"}>Buy</Button></AddFundsDialog></Panel>
        ))}
      </div>
    </>
  );
}
