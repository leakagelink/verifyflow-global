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

export const Route = createFileRoute("/app/admin")({
  head: () => pageHead("Admin Portal", "Platform analytics, users and upstream provider health."),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Admin Portal" description="Platform analytics, users and upstream provider health." />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Revenue (30d)" value={fmtUsd(admin.kpis.revenue)} delta={9.4} /><StatCard label="Users" value={admin.kpis.users.toLocaleString()} />
        <StatCard label="Orders (24h)" value={admin.kpis.orders24h.toLocaleString()} /><StatCard label="Gross margin" value={`${admin.kpis.margin}%`} />
      </div>
      <Panel className="mt-4" title="Upstream provider status (APITXT.com)"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{admin.upstream.map((u) => (
        <div key={u.name} className="rounded-md border p-3"><div className="flex items-center justify-between text-sm font-medium">{u.name.replace("APITXT.com — ", "")}<StatusBadge status={u.status} /></div>
          <div className="mt-2 text-xs text-muted-foreground"><Mono>{u.latency}ms</Mono> · <Mono>{u.uptime}%</Mono> uptime</div></div>))}</div></Panel>
      <Panel className="mt-4" title="Users" bodyClassName="p-0"><DataTable rows={admin.users} columns={[
        { key: "n", header: "Account", cell: (u) => <div><div className="font-medium">{u.country} {u.name}</div><div className="text-xs text-muted-foreground">{u.email}</div></div> },
        { key: "b", header: "Balance", className: "text-right", cell: (u) => <Mono>{fmtUsd(u.balance)}</Mono> },
        { key: "s", header: "Lifetime spend", className: "text-right", cell: (u) => <Mono>{fmtUsd(u.spend)}</Mono> },
        { key: "st", header: "Status", cell: (u) => <StatusBadge status={u.status} label={u.status === "revoked" ? "Suspended" : undefined} /> },
      ]} /></Panel>
    </>
  );
}
