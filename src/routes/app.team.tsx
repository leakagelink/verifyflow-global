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

export const Route = createFileRoute("/app/team")({
  head: () => pageHead("Team Members", "Invite teammates and manage roles."),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Team Members" description="Invite teammates and manage roles." />
      <Panel bodyClassName="p-0"><DataTable rows={team} columns={[
        { key: "n", header: "Member", cell: (m) => <div><div className="font-medium">{m.name}</div><div className="text-xs text-muted-foreground">{m.email}</div></div> },
        { key: "r", header: "Role", cell: (m) => m.role },
        { key: "s", header: "Status", cell: (m) => <StatusBadge status={m.status} label={m.status === "pending" ? "Invited" : undefined} /> },
        { key: "l", header: "Last active", cell: (m) => <span className="text-muted-foreground">{m.lastActive}</span> },
      ]} /></Panel>
    </>
  );
}
