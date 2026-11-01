import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, KeyRound, LogOut, Moon, Plus, Receipt, Search, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AddFundsDialog } from "@/components/shared/add-funds-dialog";
import { notifications, wallet } from "@/services/mock-data";
import { allNavItems } from "./nav";
import { useEnv } from "./env-context";
import { cn } from "@/lib/utils";

function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };
  return { dark, toggle };
}

export function Topbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { live, setLive } = useEnv();
  const { dark, toggle } = useTheme();
  const unread = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setOpen((o) => !o); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background/85 px-3 backdrop-blur md:px-4">
      <SidebarTrigger />
      <button onClick={() => setOpen(true)}
        className="flex h-8 w-full max-w-xs items-center gap-2 rounded-md border bg-card px-2.5 text-sm text-muted-foreground transition-colors hover:border-ring/40">
        <Search className="size-3.5" /><span className="flex-1 text-left">Search…</span>
        <kbd className="hidden rounded border bg-muted px-1.5 font-mono text-[10px] sm:inline">⌘K</kbd>
      </button>
      <div className="ml-auto flex items-center gap-1.5 md:gap-2">
        <label className={cn("hidden items-center gap-2 rounded-md border px-2 py-1 text-xs font-medium md:flex", !live && "border-warning/40 bg-warning/10")}>
          <span className={cn("size-1.5 rounded-full", live ? "bg-success" : "bg-warning")} />
          {live ? "Live" : "Sandbox"}
          <Switch checked={live} onCheckedChange={setLive} className="scale-75" aria-label="Toggle live mode" />
        </label>
        <AddFundsDialog>
          <button className="hidden items-center gap-2 rounded-md border bg-card py-1 pl-2.5 pr-1 text-xs sm:flex">
            <span className="font-mono font-medium">${wallet.balance.toFixed(2)}</span>
            <span className="rounded bg-primary px-1.5 py-0.5 text-[11px] font-medium text-primary-foreground">Recharge</span>
          </button>
        </AddFundsDialog>
        <Button size="sm" className="h-8" asChild>
          <Link to="/app/marketplace"><Plus className="size-4" /><span className="hidden sm:inline">Get Number</span></Link>
        </Button>
        <Button variant="ghost" size="icon" className="size-8" onClick={toggle} aria-label="Toggle theme">
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative size-8" aria-label="Notifications">
              <Bell className="size-4" />
              {unread > 0 && <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive ring-2 ring-background" />}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="border-b px-3 py-2 text-sm font-medium">Notifications</div>
            {notifications.map((n, i) => (
              <div key={i} className="flex gap-2 border-b px-3 py-2.5 last:border-0">
                <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", n.unread ? "bg-primary" : "bg-transparent")} />
                <div className="text-sm"><div className="font-medium">{n.title}</div><div className="text-xs text-muted-foreground">{n.body} · {n.at}</div></div>
              </div>
            ))}
          </PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full outline-none ring-ring focus-visible:ring-2">
            <Avatar className="size-8"><AvatarFallback className="bg-accent text-xs font-medium text-accent-foreground">DT</AvatarFallback></Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel><div className="text-sm">Dheeraj Tagde</div><div className="text-xs font-normal text-muted-foreground">dheeraj@acme.io</div></DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link to="/app/settings"><User />Profile</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/app/api-keys"><KeyRound />API Keys</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/app/wallet"><Receipt />Billing</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link to="/"><LogOut />Log out</Link></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search pages, numbers, API keys…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          {[...new Set(allNavItems.map((i) => i.group))].map((g) => (
            <CommandGroup key={g} heading={g}>
              {allNavItems.filter((i) => i.group === g).map((i) => (
                <CommandItem key={i.url} onSelect={() => { setOpen(false); navigate({ to: i.url }); }}>
                  <i.icon className="size-4" />{i.title}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </header>
  );
}
