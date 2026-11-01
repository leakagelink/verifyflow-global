import { useState, type ReactNode } from "react";
import { Bitcoin, Building2, CreditCard, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { creditPackages } from "@/services/mock-data";

const methods = [
  { id: "card", label: "Card", icon: CreditCard, note: "Visa, Mastercard, Amex" },
  { id: "crypto", label: "Crypto", icon: Bitcoin, note: "USDT, BTC, ETH" },
  { id: "paypal", label: "PayPal", icon: Wallet, note: "Instant" },
  { id: "wire", label: "Wire", icon: Building2, note: "1–3 business days" },
];

export function AddFundsDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(100);
  const [method, setMethod] = useState("card");
  const bonus = creditPackages.find((p) => p.amount === amount)?.bonus ?? 0;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add credits</DialogTitle>
          <DialogDescription>Credits never expire and work across every service.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-2">
          {creditPackages.map((p) => (
            <button key={p.amount} onClick={() => setAmount(p.amount)}
              className={cn("relative rounded-md border p-3 text-left transition-colors hover:border-primary/50", amount === p.amount && "border-primary bg-accent")}>
              {p.popular && <span className="absolute -top-2 right-2 rounded bg-primary px-1.5 text-[10px] font-medium text-primary-foreground">Popular</span>}
              <div className="font-mono text-base font-medium">${p.amount}</div>
              <div className="text-[11px] text-muted-foreground">{p.bonus ? `+$${p.bonus} bonus` : "No bonus"}</div>
            </button>
          ))}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="custom-amount">Custom amount (USD)</Label>
          <Input id="custom-amount" type="number" min={5} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="font-mono" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {methods.map((m) => (
            <button key={m.id} onClick={() => setMethod(m.id)}
              className={cn("flex items-center gap-3 rounded-md border p-3 text-left transition-colors", method === m.id ? "border-primary bg-accent" : "hover:bg-muted/50")}>
              <m.icon className="size-4 text-muted-foreground" />
              <div><div className="text-sm font-medium">{m.label}</div><div className="text-[11px] text-muted-foreground">{m.note}</div></div>
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between rounded-md bg-muted/60 px-3 py-2 text-sm">
          <span className="text-muted-foreground">You'll receive</span>
          <span className="font-mono font-medium">${(amount + bonus).toFixed(2)} credits</span>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => { setOpen(false); toast.success(`Demo: $${amount} top-up via ${method} started`); }}>Pay ${amount.toFixed(2)}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
