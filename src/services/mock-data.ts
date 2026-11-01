// Mock data layer. Each export mirrors a future REST resource from the NestJS backend.
// Swap these for TanStack Query fetchers against `/v1/*` when the API is ready.

export function pick<T>(a: readonly T[], i: number): T {
  const n = Math.floor(i);
  return a[((n % a.length) + a.length) % a.length] as T;
}

export type Status =
  | "completed" | "pending" | "waiting" | "cancelled" | "refunded" | "failed"
  | "active" | "expired" | "revoked" | "paid" | "operational" | "degraded" | "down";

export const countries = [
  { code: "US", name: "United States", flag: "🇺🇸", dial: "+1" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", dial: "+44" },
  { code: "IN", name: "India", flag: "🇮🇳", dial: "+91" },
  { code: "DE", name: "Germany", flag: "🇩🇪", dial: "+49" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", dial: "+55" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", dial: "+62" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", dial: "+31" },
  { code: "PH", name: "Philippines", flag: "🇵🇭", dial: "+63" },
  { code: "CA", name: "Canada", flag: "🇨🇦", dial: "+1" },
  { code: "FR", name: "France", flag: "🇫🇷", dial: "+33" },
];

export const services = [
  { id: "telegram", name: "Telegram", color: "var(--chart-3)" },
  { id: "whatsapp", name: "WhatsApp", color: "var(--chart-2)" },
  { id: "google", name: "Google", color: "var(--chart-1)" },
  { id: "openai", name: "OpenAI", color: "var(--foreground)" },
  { id: "discord", name: "Discord", color: "var(--chart-1)" },
  { id: "microsoft", name: "Microsoft", color: "var(--chart-3)" },
  { id: "amazon", name: "Amazon", color: "var(--chart-4)" },
  { id: "tinder", name: "Tinder", color: "var(--chart-5)" },
  { id: "uber", name: "Uber", color: "var(--foreground)" },
  { id: "x", name: "X (Twitter)", color: "var(--foreground)" },
];

const carriers = ["Verizon", "T-Mobile", "Vodafone", "Airtel", "Jio", "O2", "Claro", "Telkomsel", "Globe", "Orange"];

function seeded(i: number) {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export const marketplace = countries.flatMap((c, ci) =>
  services.slice(0, 7).map((s, si) => {
    const r = seeded(ci * 10 + si);
    const stock = Math.floor(r * 4000);
    return {
      id: `${c.code}-${s.id}`,
      country: c,
      service: s,
      carrier: pick(carriers, (ci + si) % carriers.length),
      price: +(0.12 + r * 1.6).toFixed(2),
      successRate: Math.round(78 + r * 21),
      stock: stock < 150 ? 0 : stock,
    };
  }),
);

export const activeNumbers = [
  { id: "ord_8f2k1", number: "+1 (415) 555-0132", country: pick(countries, 0), service: pick(services, 0), expiresIn: 1140, status: "waiting" as Status, cost: 0.42 },
  { id: "ord_8f2k2", number: "+44 7700 900461", country: pick(countries, 1), service: pick(services, 2), expiresIn: 620, status: "completed" as Status, code: "482913", cost: 0.65 },
  { id: "ord_8f2k3", number: "+91 98765 43210", country: pick(countries, 2), service: pick(services, 1), expiresIn: 1490, status: "waiting" as Status, cost: 0.18 },
  { id: "ord_8f2k4", number: "+49 1512 3456789", country: pick(countries, 3), service: pick(services, 3), expiresIn: 300, status: "completed" as Status, code: "730215", cost: 1.12 },
  { id: "ord_8f2k5", number: "+55 11 91234-5678", country: pick(countries, 4), service: pick(services, 4), expiresIn: 880, status: "pending" as Status, cost: 0.29 },
];

const statuses: Status[] = ["completed", "completed", "completed", "completed", "cancelled", "refunded", "failed"];
export const verifications = Array.from({ length: 48 }, (_, i) => {
  const c = pick(countries, i % countries.length);
  const s = pick(services, (i * 3) % services.length);
  const st = pick(statuses, i % statuses.length);
  const d = new Date(Date.UTC(2026, 9, 31, 23, 0) - i * 3600_000 * 5.3);
  return {
    id: `vrf_${(100000 + i * 7919).toString(36)}`,
    number: `${c.dial} ${Math.floor(200 + seeded(i) * 700)} ${Math.floor(1000 + seeded(i + 3) * 8999)}`,
    country: c,
    service: s,
    channel: i % 4 === 0 ? "WhatsApp" : "SMS",
    status: st,
    code: st === "completed" ? String(Math.floor(100000 + seeded(i + 7) * 899999)) : null,
    cost: +(0.15 + seeded(i + 1) * 1.2).toFixed(2),
    createdAt: d.toISOString(),
  };
});

export const volumeSeries = Array.from({ length: 90 }, (_, i) => {
  const base = 380 + Math.sin(i / 6) * 90 + i * 3;
  return {
    date: new Date(Date.UTC(2026, 7, 3) + i * 86400_000).toISOString().slice(5, 10),
    sms: Math.round(base + seeded(i) * 120),
    whatsapp: Math.round(base * 0.45 + seeded(i + 50) * 70),
    failed: Math.round(20 + seeded(i + 99) * 30),
  };
});

export const spendBreakdown = [
  { name: "SMS OTP", value: 642.3, fill: "var(--chart-1)" },
  { name: "WhatsApp", value: 318.75, fill: "var(--chart-2)" },
  { name: "Rentals", value: 214.0, fill: "var(--chart-3)" },
  { name: "KYC API", value: 96.4, fill: "var(--chart-4)" },
];

export const otpFeedSeed = [
  { service: "Telegram", number: "+1 415 555 0132", code: "839201", country: "🇺🇸" },
  { service: "Google", number: "+44 7700 900461", code: "482913", country: "🇬🇧" },
  { service: "WhatsApp", number: "+91 98765 43210", code: "117503", country: "🇮🇳" },
  { service: "OpenAI", number: "+49 1512 3456789", code: "730215", country: "🇩🇪" },
  { service: "Discord", number: "+55 11 91234 5678", code: "294660", country: "🇧🇷" },
  { service: "Amazon", number: "+62 812 3456 7890", code: "650318", country: "🇮🇩" },
];

export const rentals = [
  { id: "rnt_01", number: "+1 (628) 555-0199", country: pick(countries, 0), plan: "Monthly", price: 14.0, renewsAt: "2026-11-24", autoRenew: true, status: "active" as Status, unread: 3 },
  { id: "rnt_02", number: "+44 7400 123987", country: pick(countries, 1), plan: "Weekly", price: 4.5, renewsAt: "2026-11-05", autoRenew: false, status: "active" as Status, unread: 0 },
  { id: "rnt_03", number: "+31 6 12345678", country: pick(countries, 6), plan: "Monthly", price: 11.0, renewsAt: "2026-10-29", autoRenew: false, status: "expired" as Status, unread: 0 },
];

export const rentalInbox = [
  { from: "Google", body: "G-482913 is your Google verification code.", at: "2026-11-01T03:58:00Z" },
  { from: "Stripe", body: "Your Stripe verification code is 551204. Don't share it.", at: "2026-11-01T02:12:00Z" },
  { from: "Uber", body: "Your Uber code: 7731. Never share this code.", at: "2026-10-31T21:40:00Z" },
  { from: "Coinbase", body: "Coinbase: 908214 is your sign-in code.", at: "2026-10-31T18:05:00Z" },
];

export const apiKeys = [
  { id: "key_1", name: "Production backend", prefix: "nmr_live_8fK2", env: "live", scopes: ["numbers:write", "sms:read", "wallet:read"], ips: ["34.120.11.4", "34.120.11.5"], lastUsed: "2 minutes ago", calls30d: 184220, status: "active" as Status, created: "2026-06-12" },
  { id: "key_2", name: "Staging", prefix: "nmr_test_Qa91", env: "sandbox", scopes: ["*"], ips: [], lastUsed: "3 hours ago", calls30d: 21904, status: "active" as Status, created: "2026-07-02" },
  { id: "key_3", name: "Legacy mobile app", prefix: "nmr_live_x0Pm", env: "live", scopes: ["sms:read"], ips: [], lastUsed: "41 days ago", calls30d: 0, status: "revoked" as Status, created: "2025-12-19" },
];

const endpoints = [
  ["POST", "/v1/numbers"], ["GET", "/v1/numbers/{id}/sms"], ["POST", "/v1/numbers/{id}/cancel"],
  ["GET", "/v1/wallet/balance"], ["POST", "/v1/whatsapp/activate"], ["GET", "/v1/prices"], ["POST", "/v1/kyc/verify"],
] as const;
export const apiLogs = Array.from({ length: 40 }, (_, i) => {
  const [method, path] = pick(endpoints, i % endpoints.length);
  const r = seeded(i + 200);
  const status = r > 0.92 ? 500 : r > 0.84 ? 429 : r > 0.76 ? 402 : r > 0.7 ? 400 : i % 7 === 0 ? 201 : 200;
  return {
    id: `req_${(900000 + i * 3571).toString(36)}`,
    method, path, status,
    latency: Math.round(40 + r * 380),
    ip: `34.120.11.${(i % 6) + 2}`,
    at: new Date(Date.UTC(2026, 10, 1, 4, 30) - i * 97_000).toISOString(),
    key: i % 3 === 0 ? "nmr_test_Qa91" : "nmr_live_8fK2",
  };
});

export const webhooks = [
  { id: "wh_1", url: "https://api.acme.io/hooks/numora", events: ["sms.received", "number.expired"], status: "active" as Status, successRate: 99.4 },
  { id: "wh_2", url: "https://staging.acme.io/hooks", events: ["*"], status: "failed" as Status, successRate: 71.2 },
];
export const webhookEvents = Array.from({ length: 12 }, (_, i) => ({
  id: `evt_${(70000 + i * 811).toString(36)}`,
  type: pick(["sms.received", "number.expired", "wallet.low_balance", "number.cancelled"], i % 4),
  endpoint: i % 5 === 4 ? pick(webhooks, 1).url : pick(webhooks, 0).url,
  code: i % 5 === 4 ? 504 : 200,
  attempts: i % 5 === 4 ? 3 : 1,
  at: new Date(Date.UTC(2026, 10, 1, 4, 20) - i * 640_000).toISOString(),
}));

export const creditPackages = [
  { amount: 25, bonus: 0 },
  { amount: 100, bonus: 5, popular: true },
  { amount: 500, bonus: 40 },
  { amount: 2000, bonus: 220 },
];

export const transactions = Array.from({ length: 18 }, (_, i) => {
  const isTopup = i % 4 === 0;
  return {
    id: isTopup ? `INV-2026-${String(1042 - i).padStart(4, "0")}` : `TXN-${(5000 - i * 13).toString()}`,
    type: isTopup ? "Top-up" : pick(["SMS OTP", "WhatsApp", "Rental renewal"], i % 3),
    method: isTopup ? pick(["Visa •• 4242", "USDT (TRC20)", "PayPal", "Wire"], (i / 4) % 4) : "Wallet",
    amount: isTopup ? pick([100, 500, 25, 100, 2000], (i / 4) % 5) : -+(0.2 + seeded(i) * 14).toFixed(2),
    status: (i === 2 ? "refunded" : i === 9 ? "pending" : "paid") as Status,
    at: new Date(Date.UTC(2026, 9, 31) - i * 86400_000 * 1.6).toISOString(),
  };
});

export const usageByService = services.slice(0, 7).map((s, i) => ({
  name: s.name,
  requests: Math.round(1200 + seeded(i + 33) * 9000),
  spend: +(40 + seeded(i + 44) * 300).toFixed(2),
}));

export const team = [
  { name: "Dheeraj Tagde", email: "dheeraj@acme.io", role: "Owner", status: "active" as Status, lastActive: "Now" },
  { name: "Priya Shah", email: "priya@acme.io", role: "Admin", status: "active" as Status, lastActive: "1h ago" },
  { name: "Marcus Lee", email: "marcus@acme.io", role: "Developer", status: "active" as Status, lastActive: "Yesterday" },
  { name: "anna@acme.io", email: "anna@acme.io", role: "Billing", status: "pending" as Status, lastActive: "Invited" },
];

export const referrals = {
  link: "https://numora.io/r/dheeraj-7xk2",
  rate: 10,
  clicks: 1842, signups: 214, active: 63, earned: 1284.6, pending: 142.3,
  payouts: [
    { id: "PAY-0091", amount: 420.0, method: "USDT", status: "paid" as Status, at: "2026-10-01" },
    { id: "PAY-0084", amount: 380.5, method: "PayPal", status: "paid" as Status, at: "2026-09-01" },
    { id: "PAY-0077", amount: 341.8, method: "PayPal", status: "paid" as Status, at: "2026-08-01" },
  ],
  referred: [
    { user: "lumen-labs", joined: "2026-10-22", spend: 820.0, commission: 82.0 },
    { user: "growthkit.ai", joined: "2026-10-14", spend: 412.5, commission: 41.25 },
    { user: "fastsignup", joined: "2026-09-30", spend: 190.0, commission: 19.0 },
  ],
};

export const notifications = [
  { title: "OTP received for Telegram", body: "+1 415 555 0132 · code 839201", at: "1m ago", unread: true },
  { title: "Wallet below threshold", body: "Balance fell under your $150 alert.", at: "2h ago", unread: true },
  { title: "Webhook failing", body: "staging.acme.io returned 504 three times.", at: "5h ago", unread: false },
];

export const admin = {
  kpis: { revenue: 48210.4, users: 12480, orders24h: 38214, margin: 31.6 },
  users: [
    { id: "usr_01", name: "Acme Inc", email: "ops@acme.io", country: "🇺🇸", balance: 128.5, spend: 4210.0, status: "active" as Status },
    { id: "usr_02", name: "Lumen Labs", email: "dev@lumen.dev", country: "🇩🇪", balance: 2310.0, spend: 18940.2, status: "active" as Status },
    { id: "usr_03", name: "growthkit.ai", email: "hi@growthkit.ai", country: "🇮🇳", balance: 4.2, spend: 812.9, status: "pending" as Status },
    { id: "usr_04", name: "spam-farm-22", email: "x@tempmail.cc", country: "🇧🇷", balance: 0, spend: 51.0, status: "revoked" as Status },
  ],
  upstream: [
    { name: "APITXT.com — SMS", status: "operational" as Status, latency: 182, uptime: 99.98 },
    { name: "APITXT.com — WhatsApp", status: "operational" as Status, latency: 241, uptime: 99.91 },
    { name: "APITXT.com — Rentals", status: "degraded" as Status, latency: 812, uptime: 98.7 },
    { name: "APITXT.com — KYC", status: "operational" as Status, latency: 305, uptime: 99.95 },
  ],
};

export const wallet = { balance: 128.5, lowBalanceThreshold: 150, monthSpend: 1271.45 };
