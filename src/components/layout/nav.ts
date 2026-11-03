import {
  Activity, BarChart3, BookOpen, CreditCard, Gift, Globe2, Home, KeyRound, LayoutGrid,
  MessageCircle, MessageSquare, Megaphone, FileCheck2, ListChecks, Rocket, MessagesSquare, LayoutTemplate, Bot, Sparkles, Workflow, UserCheck, PhoneCall, MonitorCheck, QrCode, Radio, Phone, Receipt, ScrollText, Settings, Shield, ShieldCheck, Users, Webhook,
} from "lucide-react";

export const navGroups = [
  { label: null, items: [{ title: "Dashboard", url: "/app", icon: Home }] },
  {
    label: "Numbers & Verification",
    items: [
      { title: "Get Number", url: "/app/marketplace", icon: Globe2 },
      { title: "Active Numbers", url: "/app/numbers", icon: Phone },
      { title: "SMS Verifications", url: "/app/sms", icon: MessageSquare },
      { title: "WhatsApp OTP", url: "/app/whatsapp", icon: MessageCircle },
      { title: "Rental Numbers", url: "/app/rentals", icon: LayoutGrid },
      { title: "History & Reports", url: "/app/reports", icon: BarChart3 },
    ],
  },
  {
    label: "Text SMS",
    items: [
      { title: "SMS Broadcasting", url: "/app/sms-broadcast", icon: Megaphone },
      { title: "DLT Management", url: "/app/dlt", icon: FileCheck2 },
      { title: "OTP Whitelist", url: "/app/otp-whitelist", icon: ListChecks },
    ],
  },
  {
    label: "WhatsApp Business",
    items: [
      { title: "Onboarding", url: "/app/wa/onboarding", icon: Rocket },
      { title: "Live Chat", url: "/app/wa/inbox", icon: MessagesSquare },
      { title: "Broadcasting", url: "/app/wa/broadcast", icon: Radio },
      { title: "Templates", url: "/app/wa/templates", icon: LayoutTemplate },
      { title: "Bot Builder", url: "/app/wa/bots", icon: Bot },
      { title: "AI Hub", url: "/app/wa/ai", icon: Sparkles },
      { title: "Flows", url: "/app/wa/flows", icon: Workflow },
      { title: "Opt-in / Opt-out", url: "/app/wa/opt", icon: UserCheck },
      { title: "Calls", url: "/app/wa/calls", icon: PhoneCall },
      { title: "Supervisor", url: "/app/wa/supervisor", icon: MonitorCheck },
      { title: "QR Codes", url: "/app/wa/qr", icon: QrCode },
      { title: "WA Webhooks", url: "/app/wa/webhooks", icon: Webhook },
    ],
  },
  {
    label: "KYC APIs",
    items: [
      { title: "Verification Hub", url: "/app/kyc", icon: ShieldCheck },
      { title: "KYC Logs", url: "/app/kyc/logs", icon: ScrollText },
      { title: "KYC Docs", url: "/app/kyc/docs", icon: BookOpen },
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
