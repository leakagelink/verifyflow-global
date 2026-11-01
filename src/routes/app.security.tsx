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

export const Route = createFileRoute("/app/security")({
  head: () => pageHead("Security & 2FA", "Two-factor authentication, IP allowlist and sessions."),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Security & 2FA" description="Two-factor authentication, IP allowlist and sessions." />
      <div className="grid max-w-3xl gap-4">
        <Panel title="Two-factor authentication" actions={<Switch defaultChecked onCheckedChange={(v) => toast(`2FA ${v ? "enabled" : "disabled"}`)} />}><p className="text-sm text-muted-foreground">Require an authenticator app code at sign-in.</p></Panel>
        <Panel title="Dashboard IP allowlist"><Textarea defaultValue={"34.120.11.0/24\n102.89.4.12"} className="font-mono text-xs" /><Button size="sm" className="mt-3" onClick={() => toast.success("Saved")}>Save</Button></Panel>
        <Panel title="Active sessions">{["Chrome · Windows · Mumbai (this device)", "Safari · iPhone · Mumbai"].map((s) => <div key={s} className="flex items-center justify-between border-b py-2 text-sm last:border-0">{s}<Button size="sm" variant="ghost" className="h-7">Revoke</Button></div>)}</Panel>
      </div>
    </>
  );
}
