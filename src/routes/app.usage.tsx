import { chartColors } from "@/lib/chart-colors";
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

export const Route = createFileRoute("/app/usage")({
  head: () => pageHead("Usage Analytics", "Requests and spend per service."),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Usage Analytics" description="Requests and spend per service." />
      <Panel title="Spend by service (30d)"><div className="h-72"><ResponsiveContainer><BarChart data={usageByService}>
        <CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", fontSize: 12 }} />
        <Bar dataKey="spend" fill={chartColors[0]} radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></Panel>
      <Panel className="mt-4" bodyClassName="p-0"><DataTable rows={usageByService} columns={[
        { key: "n", header: "Service", cell: (u) => u.name },
        { key: "r", header: "Requests", className: "text-right", cell: (u) => <Mono>{u.requests.toLocaleString()}</Mono> },
        { key: "s", header: "Spend", className: "text-right", cell: (u) => <Mono>{fmtUsd(u.spend)}</Mono> },
      ]} /></Panel>
    </>
  );
}
