import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DataTable, Mono, PageHeader, Panel, fmtUsd, pageHead, type Column } from "@/components/shared";
import { countries, marketplace, services } from "@/services/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/marketplace")({
  head: () => pageHead("Get Number", "Browse virtual numbers by country, service, carrier, price and success rate."),
  component: Marketplace,
});

type Row = (typeof marketplace)[number];

function Marketplace() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("all");
  const [service, setService] = useState("all");
  const [sort, setSort] = useState("success");
  const [inStock, setInStock] = useState(true);

  const rows = useMemo(() => {
    let r = marketplace.filter((m) =>
      (country === "all" || m.country.code === country) &&
      (service === "all" || m.service.id === service) &&
      (!inStock || m.stock > 0) &&
      (q === "" || `${m.country.name} ${m.service.name} ${m.carrier}`.toLowerCase().includes(q.toLowerCase())));
    r = [...r].sort((a, b) => sort === "price" ? a.price - b.price : sort === "stock" ? b.stock - a.stock : b.successRate - a.successRate);
    return r;
  }, [q, country, service, sort, inStock]);

  const columns: Column<Row>[] = [
    { key: "c", header: "Country", cell: (r) => <span className="flex items-center gap-2"><span className="text-base">{r.country.flag}</span>{r.country.name}<Mono className="text-muted-foreground">{r.country.dial}</Mono></span> },
    { key: "s", header: "Service", cell: (r) => <span className="font-medium">{r.service.name}</span> },
    { key: "ca", header: "Carrier", cell: (r) => <span className="text-muted-foreground">{r.carrier}</span> },
    { key: "sr", header: "Success", cell: (r) => (
      <span className="flex items-center gap-2"><span className="h-1.5 w-16 overflow-hidden rounded-full bg-muted"><span className={cn("block h-full rounded-full", r.successRate > 90 ? "bg-success" : r.successRate > 82 ? "bg-warning" : "bg-destructive")} style={{ width: `${r.successRate}%` }} /></span><Mono>{r.successRate}%</Mono></span>) },
    { key: "st", header: "Stock", cell: (r) => r.stock ? <Mono>{r.stock.toLocaleString()}</Mono> : <span className="text-xs text-muted-foreground">Out of stock</span> },
    { key: "p", header: "Price", className: "text-right", cell: (r) => <Mono className="font-medium">{fmtUsd(r.price)}</Mono> },
    { key: "a", header: "", className: "text-right", cell: (r) => (
      <Button size="sm" variant={r.stock ? "default" : "outline"} disabled={!r.stock} className="h-7"
        onClick={() => { toast.success(`Reserved ${r.country.flag} ${r.service.name} number`); navigate({ to: "/app/sms" }); }}>Buy</Button>) },
  ];

  return (
    <>
      <PageHeader title="Get a number" description={`${marketplace.length} offers across ${countries.length} countries. Unused numbers are refunded automatically.`} />
      <div className="mb-4 flex flex-wrap gap-1.5">
        {["all", ...services.slice(0, 7).map((s) => s.id)].map((id) => (
          <button key={id} onClick={() => setService(id)}
            className={cn("rounded-full border px-3 py-1 text-xs font-medium transition-colors", service === id ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted")}>
            {id === "all" ? "All services" : services.find((s) => s.id === id)?.name}
          </button>
        ))}
      </div>
      <Panel bodyClassName="p-0">
        <div className="flex flex-wrap items-center gap-2 border-b p-3">
          <div className="relative min-w-48 flex-1"><Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search country, service, carrier" className="h-9 pl-8" /></div>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="h-9 w-44"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">All countries</SelectItem>{countries.map((c) => <SelectItem key={c.code} value={c.code}>{c.flag} {c.name}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-9 w-40"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="success">Best success rate</SelectItem><SelectItem value="price">Lowest price</SelectItem><SelectItem value="stock">Most stock</SelectItem></SelectContent>
          </Select>
          <label className="flex items-center gap-2 text-xs text-muted-foreground"><Switch checked={inStock} onCheckedChange={setInStock} />In stock only</label>
        </div>
        <DataTable columns={columns} rows={rows} empty="No offers match your filters" />
      </Panel>
    </>
  );
}
