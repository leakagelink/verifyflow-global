import { Link, useRouterState } from "@tanstack/react-router";
import { Globe2, Home, Menu, MessagesSquare, Wallet } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/app", label: "Home", icon: Home },
  { to: "/app/marketplace", label: "Numbers", icon: Globe2 },
  { to: "/app/wa/inbox", label: "Chats", icon: MessagesSquare },
  { to: "/app/wallet", label: "Wallet", icon: Wallet },
] as const;

/** Bottom tab bar shown only on phones. */
export function MobileNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { setOpenMobile } = useSidebar();
  const active = (to: string) => (to === "/app" ? path === "/app" || path === "/app/" : path.startsWith(to));
  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-2xl border bg-card/90 p-1.5 shadow-[var(--shadow-lift)] backdrop-blur-xl md:hidden" style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}>
      {tabs.map((t) => (
        <Link key={t.to} to={t.to} className={cn("flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] font-medium text-muted-foreground transition-all", active(t.to) && "bg-gradient-primary text-primary-foreground shadow-glow")}>
          <t.icon className="size-5" />{t.label}
        </Link>
      ))}
      <button onClick={() => setOpenMobile(true)} className="flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] font-medium text-muted-foreground">
        <Menu className="size-5" />More
      </button>
    </nav>
  );
}
