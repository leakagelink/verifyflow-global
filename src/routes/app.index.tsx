import { chartColors } from "@/lib/chart-colors";
import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, Gauge, Phone, ShieldCheck, Wallet, Zap } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AddFundsDialog } from "@/components/shared/add-funds-dialog";
import { CopyButton, Mono, PageHeader, Panel, StatCard, fmtUsd, pageHead } from "@/components/shared";
import { countries, marketplace, otpFeedSeed, services, spendBreakdown, volumeSeries, wallet } from "@/services/mock-data";
import { formatServicePrice } from "@/services/pricing";

export const Route = createFileRoute("/app/")({
  head: () => pageHead("Dashboard", "Overview of your wallet, numbers, verifications and API traffic."),
  component: Dashboard,
});

const tooltipStyle = { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, color: "var(--popover-foreground)" };

function Dashboard() {
  const [range, setRange] = useState("30");
  const data = useMemo(() => volumeSeries.slice(-Number(range)), [range]);
  return (
    <>
      <PageHeader title="Good morning, Dheeraj" description="Here's what's happening across your numbers and API today."
        actions={<Button variant="outline" size="sm" asChild><Link to="/app/reports">View reports</Link></Button>} />

      {wallet.balance < wallet.lowBalanceThreshold && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-warning/40 bg-warning/10 px-4 py-2.5 text-sm">
          <AlertTriangle className="size-4 text-warning" />
          <span className="flex-1">Your balance is below your <b>${wallet.lowBalanceThreshold}</b> alert. At current usage it lasts about 3 days.</span>
          <AddFundsDialog><Button size="sm" className="h-7">Add funds</Button></AddFundsDialog>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Wallet balance" icon={<Wallet className="size-3.5" />} value={fmtUsd(wallet.balance)} hint={`${fmtUsd(wallet.monthSpend)} spent this month`}
          action={<AddFundsDialog><button className="text-xs font-medium text-primary hover:underline">Add funds</button></AddFundsDialog>} />
        <StatCard label="Active numbers" icon={<Phone className="size-3.5" />} value="5" hint="2 waiting for SMS · 3 rentals" />
        <StatCard label="Verifications this month" icon={<ShieldCheck className="size-3.5" />} value="14,382" delta={12.4} hint="94.2% success rate" />
        <StatCard label="API calls today" icon={<Gauge className="size-3.5" />} value="38,214" delta={-2.1} hint="p50 142ms · 99.7% 2xx" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2" title="Verification volume" description="SMS and WhatsApp OTPs delivered"
          actions={
            <ToggleGroup type="single" size="sm" variant="outline" value={range} onValueChange={(v) => v && setRange(v)}>
              {["7", "30", "90"].map((r) => <ToggleGroupItem key={r} value={r} className="h-7 px-2.5 text-xs">{r}d</ToggleGroupItem>)}
            </ToggleGroup>
          }>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={data} margin={{ left: -20, right: 4, top: 4 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={chartColors[0]} stopOpacity={0.25} /><stop offset="100%" stopColor={chartColors[0]} stopOpacity={0} /></linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={chartColors[1]} stopOpacity={0.25} /><stop offset="100%" stopColor={chartColors[1]} stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} minTickGap={24} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="sms" name="SMS" stroke={chartColors[0]} strokeWidth={2} fill="url(#g1)" />
                <Area type="monotone" dataKey="whatsapp" name="WhatsApp" stroke={chartColors[1]} strokeWidth={2} fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Credit consumption" description="This month by service">
          <div className="h-40">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={spendBreakdown} dataKey="value" innerRadius={48} outerRadius={70} paddingAngle={2} stroke="none">
                  {spendBreakdown.map((s) => <Cell key={s.name} fill={s.fill} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtUsd(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1.5 text-sm">
            {spendBreakdown.map((s) => (
              <li key={s.name} className="flex items-center gap-2">
                <span className="size-2 rounded-sm" style={{ background: s.fill }} />
                <span className="flex-1 text-muted-foreground">{s.name}</span>
                <Mono>{fmtUsd(s.value)}</Mono>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <QuickBuy />
        <OtpFeed />
      </div>
    </>
  );
}

function QuickBuy() {
  const [country, setCountry] = useState("US");
  const [service, setService] = useState("telegram");
  const offer = marketplace.find((m) => m.country.code === country && m.service.id === service);
  return (
    <Panel title={<span className="flex items-center gap-1.5"><Zap className="size-3.5 text-primary" />Quick buy</span>} description="Instant number for one verification">
      <div className="space-y-3">
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>{countries.map((c) => <SelectItem key={c.code} value={c.code}>{c.flag} {c.name}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={service} onValueChange={setService}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>{services.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
        </Select>
        <div className="grid grid-cols-3 gap-2 rounded-md bg-muted/60 p-3 text-xs">
          <div><div className="text-muted-foreground">Price</div><Mono className="text-sm font-medium">{offer ? fmtUsd(offer.price) : "—"}</Mono>{offer && <div className="text-muted-foreground">{formatServicePrice(offer.priceInr, "INR")}</div>}</div>
          <div><div className="text-muted-foreground">Success</div><Mono className="text-sm font-medium">{offer?.successRate}%</Mono></div>
          <div><div className="text-muted-foreground">Stock</div><Mono className="text-sm font-medium">{offer?.stock ? offer.stock.toLocaleString() : "Out"}</Mono></div>
        </div>
        <Button className="w-full" disabled={!offer?.stock} asChild={!!offer?.stock}>
          {offer?.stock ? <Link to="/app/sms" onClick={() => toast.success(`Number reserved for ${offer.service.name}`)}>Order number <ArrowRight className="size-4" /></Link> : <span>Out of stock</span>}
        </Button>
      </div>
    </Panel>
  );
}

function OtpFeed() {
  const [items, setItems] = useState(() => otpFeedSeed.slice(0, 5).map((x, i) => ({ ...x, id: i, ago: (i + 1) * 47 })));
  useEffect(() => {
    let n = 100;
    const t = setInterval(() => {
      const src = otpFeedSeed[Math.floor(Math.random() * otpFeedSeed.length)]!;
      const code = String(Math.floor(100000 + Math.random() * 899999));
      setItems((prev) => [{ ...src, code, id: n++, ago: 0 }, ...prev.map((p) => ({ ...p, ago: p.ago + 6 }))].slice(0, 7));
    }, 6000);
    return () => clearInterval(t);
  }, []);
  return (
    <Panel className="xl:col-span-2" bodyClassName="p-0" title={<span className="flex items-center gap-2">Recent OTP feed <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" /><span className="relative inline-flex size-2 rounded-full bg-success" /></span></span>}
      actions={<Button variant="ghost" size="sm" asChild><Link to="/app/sms">All</Link></Button>}>
      <ul>
        {items.map((it) => (
          <li key={it.id} className="flex items-center gap-3 border-b px-4 py-2.5 text-sm last:border-0 animate-in fade-in slide-in-from-top-1">
            <span className="text-base">{it.country}</span>
            <div className="min-w-0 flex-1"><div className="font-medium">{it.service}</div><Mono className="text-muted-foreground">{it.number}</Mono></div>
            <Mono className="rounded bg-accent px-2 py-0.5 text-sm font-semibold tracking-widest text-accent-foreground">{it.code}</Mono>
            <CopyButton value={it.code} />
            <span className="w-14 text-right text-xs text-muted-foreground">{it.ago === 0 ? "just now" : `${it.ago}s ago`}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
