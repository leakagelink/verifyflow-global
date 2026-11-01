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

export const Route = createFileRoute("/app/settings")({
  head: () => pageHead("Settings", "Profile and notification preferences."),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Settings" description="Profile and notification preferences." />
      <div className="grid max-w-3xl gap-4">
        <Panel title="Profile"><div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Name</Label><Input defaultValue="Dheeraj Tagde" /></div>
          <div className="space-y-1.5"><Label>Email</Label><Input defaultValue="dheeraj@acme.io" /></div>
          <div className="space-y-1.5"><Label>Company</Label><Input defaultValue="Acme Inc" /></div>
          <div className="space-y-1.5"><Label>Timezone</Label><Input defaultValue="UTC" /></div>
        </div><Button size="sm" className="mt-4" onClick={() => toast.success("Saved")}>Save changes</Button></Panel>
        <Panel title="Notifications">{["OTP received", "Low balance", "Webhook failures", "Monthly invoice"].map((n) => (
          <label key={n} className="flex items-center justify-between border-b py-2.5 text-sm last:border-0">{n}<Switch defaultChecked /></label>))}</Panel>
      </div>
    </>
  );
}
