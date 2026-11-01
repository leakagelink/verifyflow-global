import {
  Activity, BarChart3, BookOpen, CreditCard, FileText, Gift, Globe2, Home, KeyRound, LayoutGrid,
  MessageCircle, MessageSquare, Phone, Receipt, ScrollText, Settings, Shield, ShieldCheck, Users, Webhook,
} from "lucide-react";

export const navGroups = [
  { label: null, items: [{ title: "Dashboard", url: "/app", icon: Home }] },
  {
    label: "Numbers & Verification",
    items: [
      { title: "Get Number", url: "/app/marketplace", icon: Globe2 },
      { title: "Active Numbers", url: "/app/numbers", icon: Phone },
      { title: "SMS Verifications", url: "/app/sms", icon: MessageSquare },
      { title: "WhatsApp", url: "/app/whatsapp", icon: MessageCircle },
      { title: "Rental Numbers", url: "/app/rentals", icon: LayoutGrid },
      { title: "History & Reports", url: "/app/reports", icon: BarChart3 },
    ],
  },
  {
    label: "Developer",
    items: [
      { title: "API Keys", url: "/app/api-keys", icon: KeyRound },
      { title: "API Logs", url: "/app/api-logs", icon: ScrollText },
      { title: "Webhooks", url: "/app/webhooks", icon: Webhook },
      { title: "API Docs", url: "/app/docs", icon: BookOpen },
    ],
  },
  {
    label: "Billing",
    items: [
      { title: "Wallet & Credits", url: "/app/wallet", icon: CreditCard },
      { title: "Invoices", url: "/app/invoices", icon: Receipt },
      { title: "Usage Analytics", url: "/app/usage", icon: Activity },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Settings", url: "/app/settings", icon: Settings },
      { title: "Team Members", url: "/app/team", icon: Users },
      { title: "Security / 2FA", url: "/app/security", icon: ShieldCheck },
      { title: "Refer & Earn", url: "/app/referrals", icon: Gift },
    ],
  },
  { label: "Internal", items: [{ title: "Admin Portal", url: "/app/admin", icon: Shield }] },
] as const;

export const allNavItems = navGroups.flatMap((g) => g.items.map((i) => ({ ...i, group: g.label ?? "General" })));
export type { FileText };
