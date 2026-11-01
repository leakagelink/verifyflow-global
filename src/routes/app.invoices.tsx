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

export const Route = createFileRoute("/app/invoices")({
  head: () => pageHead("Invoices & Transactions", "Transaction history and downloadable invoices."),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Invoices & Transactions" description="Transaction history and downloadable invoices." />
      <Panel bodyClassName="p-0"><DataTable rows={transactions} columns={[
        { key: "id", header: "ID", cell: (t) => <Mono>{t.id}</Mono> },
        { key: "ty", header: "Type", cell: (t) => t.type },
        { key: "m", header: "Method", cell: (t) => <span className="text-muted-foreground">{t.method}</span> },
        { key: "s", header: "Status", cell: (t) => <StatusBadge status={t.status} /> },
        { key: "a", header: "Amount", className: "text-right", cell: (t) => <Mono className={t.amount > 0 ? "text-success" : ""}>{fmtUsd(t.amount)}</Mono> },
        { key: "d", header: "Date", cell: (t) => <span className="text-muted-foreground">{fmtDate(t.at)}</span> },
        { key: "x", header: "", cell: (t) => t.type === "Top-up" ? <Button size="sm" variant="ghost" className="h-7" onClick={() => toast.success(`Demo: ${t.id}.pdf downloaded`)}>PDF</Button> : null },
      ]} /></Panel>
    </>
  );
}
