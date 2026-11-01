// Mock data for Text SMS (bulk/DLT) and WhatsApp Business modules.
import type { Status } from "./mock-data";

export const smsCampaigns = [
  { id: "cmp_101", name: "Diwali Offer 2026", sender: "ACMEIN", template: "Festive promo", type: "Promotional", recipients: 48200, delivered: 46112, failed: 1210, status: "completed" as Status, at: "2026-10-30T10:00:00Z", cost: 385.6 },
  { id: "cmp_102", name: "Order shipped alerts", sender: "ACMEOR", template: "Shipping update", type: "Transactional", recipients: 12840, delivered: 12790, failed: 50, status: "active" as Status, at: "2026-11-01T03:00:00Z", cost: 102.7 },
  { id: "cmp_103", name: "Weekend flash sale", sender: "ACMEIN", template: "Flash sale", type: "Promotional", recipients: 30000, delivered: 0, failed: 0, status: "pending" as Status, at: "2026-11-02T06:30:00Z", cost: 0 },
  { id: "cmp_104", name: "KYC reminder", sender: "ACMEKY", template: "KYC pending", type: "Service Implicit", recipients: 5400, delivered: 5102, failed: 298, status: "completed" as Status, at: "2026-10-27T08:15:00Z", cost: 43.2 },
];

export const dltEntity = { name: "Acme Technologies Pvt Ltd", entityId: "1201160000012345678", operator: "Jio TrueConnect", status: "active" as Status, validTill: "2027-03-31" };

export const dltHeaders = [
  { header: "ACMEIN", type: "Promotional", status: "active" as Status, registered: "2025-11-02" },
  { header: "ACMEOR", type: "Transactional", status: "active" as Status, registered: "2025-11-02" },
  { header: "ACMEKY", type: "Service Implicit", status: "active" as Status, registered: "2026-02-14" },
  { header: "ACMEOT", type: "Transactional", status: "pending" as Status, registered: "2026-10-29" },
];

export const dltTemplates = [
  { id: "1207168000011122233", name: "OTP login", header: "ACMEOT", category: "Transactional", body: "Your Acme login OTP is {#var#}. Valid for 10 minutes. Do not share. -Acme", status: "active" as Status },
  { id: "1207168000011122234", name: "Shipping update", header: "ACMEOR", category: "Transactional", body: "Hi {#var#}, your order {#var#} has shipped. Track: {#var#} -Acme", status: "active" as Status },
  { id: "1207168000011122235", name: "Festive promo", header: "ACMEIN", category: "Promotional", body: "Diwali Sale! Flat {#var#}% off on all plans. Shop now {#var#} -Acme", status: "active" as Status },
  { id: "1207168000011122236", name: "KYC pending", header: "ACMEKY", category: "Service Implicit", body: "Dear {#var#}, complete your KYC to continue using Acme services. {#var#}", status: "pending" as Status },
  { id: "1207168000011122237", name: "Flash sale", header: "ACMEIN", category: "Promotional", body: "Weekend flash sale is LIVE. Use code {#var#}.", status: "failed" as Status },
];

export const otpWhitelist = [
  { id: "wl_1", type: "Phone", value: "+91 98765 43210", label: "QA device", added: "2026-10-12", hits: 412 },
  { id: "wl_2", type: "Phone", value: "+1 415 555 0132", label: "US test SIM", added: "2026-09-03", hits: 88 },
  { id: "wl_3", type: "IP", value: "34.120.11.0/24", label: "Production servers", added: "2026-06-12", hits: 184220 },
  { id: "wl_4", type: "Country", value: "IN, US, GB, AE", label: "Allowed OTP countries", added: "2026-06-12", hits: 0 },
];

export const waNumbers = [
  { number: "+91 80 4718 2200", name: "Acme Support", quality: "High", tier: "100K / day", status: "active" as Status, waba: "WABA 1029384756" },
  { number: "+91 80 4718 2201", name: "Acme Sales", quality: "Medium", tier: "10K / day", status: "active" as Status, waba: "WABA 1029384756" },
];

export const chats = [
  { id: "c1", name: "Rohit Verma", phone: "+91 98201 11223", last: "Can I change my delivery address?", time: "10:21", unread: 2, agent: "Priya", tag: "Order", window: "open" },
  { id: "c2", name: "Sara Khan", phone: "+971 50 123 4567", last: "Thanks, that worked!", time: "10:02", unread: 0, agent: "Marcus", tag: "Support", window: "open" },
  { id: "c3", name: "Amit Patel", phone: "+91 99300 44556", last: "What are the pricing plans?", time: "09:47", unread: 1, agent: "Unassigned", tag: "Sales", window: "open" },
  { id: "c4", name: "John Miller", phone: "+1 628 555 0110", last: "Bot: Here is your invoice 📄", time: "Yesterday", unread: 0, agent: "Bot", tag: "Billing", window: "closed" },
  { id: "c5", name: "Neha Joshi", phone: "+91 90040 77889", last: "STOP", time: "Yesterday", unread: 0, agent: "Bot", tag: "Opt-out", window: "closed" },
];

export const chatMessages: Record<string, { from: "user" | "agent" | "bot"; text: string; time: string }[]> = {
  c1: [
    { from: "user", text: "Hi, I placed order #A-20931 yesterday", time: "10:15" },
    { from: "bot", text: "Hi Rohit 👋 I found order #A-20931 — it ships today. How can I help?", time: "10:15" },
    { from: "user", text: "Can I change my delivery address?", time: "10:21" },
  ],
};

export const waTemplates = [
  { name: "order_confirmation", category: "Utility", language: "en", status: "active" as Status, body: "Hi {{1}}, your order {{2}} is confirmed and will arrive by {{3}}.", buttons: ["Track order"] },
  { name: "otp_login", category: "Authentication", language: "en", status: "active" as Status, body: "{{1}} is your verification code. For your security, do not share this code.", buttons: ["Copy code"] },
  { name: "diwali_sale", category: "Marketing", language: "hi", status: "pending" as Status, body: "दिवाली सेल! सभी प्लान पर {{1}}% की छूट। आज ही खरीदें।", buttons: ["Shop now", "Stop promotions"] },
  { name: "cart_reminder", category: "Marketing", language: "en", status: "failed" as Status, body: "You left items in your cart, {{1}}! Complete checkout now.", buttons: ["View cart"] },
];

export const waBroadcasts = [
  { name: "Diwali offer — VIP list", template: "diwali_sale", audience: 18200, sent: 18200, delivered: 17644, read: 12019, replied: 1430, status: "completed" as Status, at: "2026-10-30" },
  { name: "Order confirmations", template: "order_confirmation", audience: 3410, sent: 3410, delivered: 3398, read: 3011, replied: 92, status: "active" as Status, at: "2026-11-01" },
  { name: "Cart recovery — Nov", template: "cart_reminder", audience: 5600, sent: 0, delivered: 0, read: 0, replied: 0, status: "pending" as Status, at: "2026-11-03" },
];

export const flows = [
  { name: "Lead qualification form", screens: 3, responses: 1284, status: "active" as Status, updated: "2026-10-28" },
  { name: "Appointment booking", screens: 4, responses: 642, status: "active" as Status, updated: "2026-10-20" },
  { name: "NPS feedback survey", screens: 2, responses: 0, status: "pending" as Status, updated: "2026-10-31" },
];

export const optContacts = [
  { phone: "+91 98201 11223", name: "Rohit Verma", state: "in", source: "Website widget", at: "2026-10-31" },
  { phone: "+91 90040 77889", name: "Neha Joshi", state: "out", source: "Replied STOP", at: "2026-10-31" },
  { phone: "+971 50 123 4567", name: "Sara Khan", state: "in", source: "QR code — store", at: "2026-10-28" },
  { phone: "+91 99300 44556", name: "Amit Patel", state: "in", source: "Click-to-WhatsApp ad", at: "2026-10-27" },
  { phone: "+44 7700 900111", name: "Liam Brown", state: "out", source: "Manual (agent)", at: "2026-10-22" },
];

export const calls = [
  { contact: "Rohit Verma", phone: "+91 98201 11223", dir: "Inbound", agent: "Priya", duration: "04:12", status: "completed" as Status, at: "10:05" },
  { contact: "Amit Patel", phone: "+91 99300 44556", dir: "Outbound", agent: "Marcus", duration: "01:48", status: "completed" as Status, at: "09:40" },
  { contact: "Unknown", phone: "+91 88800 12345", dir: "Inbound", agent: "—", duration: "00:00", status: "failed" as Status, at: "09:12" },
  { contact: "Sara Khan", phone: "+971 50 123 4567", dir: "Inbound", agent: "Priya", duration: "07:31", status: "completed" as Status, at: "Yesterday" },
];

export const agents = [
  { name: "Priya Shah", status: "online", open: 6, resolved: 41, frt: "48s", csat: 4.8 },
  { name: "Marcus Lee", status: "online", open: 4, resolved: 33, frt: "1m 12s", csat: 4.6 },
  { name: "Anna Roy", status: "away", open: 2, resolved: 19, frt: "2m 05s", csat: 4.4 },
  { name: "Ravi Kumar", status: "offline", open: 0, resolved: 27, frt: "58s", csat: 4.7 },
];

export const qrCodes = [
  { name: "Store counter", message: "Hi! I'd like to know about today's offers", scans: 1842, link: "https://wa.me/918047182200?text=offers" },
  { name: "Product packaging", message: "Support for my order", scans: 612, link: "https://wa.me/918047182200?text=support" },
];

export const waWebhookEvents = [
  { type: "messages.received", code: 200, at: "2026-11-01T04:50:00Z" },
  { type: "messages.status.read", code: 200, at: "2026-11-01T04:49:10Z" },
  { type: "template.status_update", code: 200, at: "2026-11-01T04:30:00Z" },
  { type: "account.quality_update", code: 500, at: "2026-11-01T03:55:00Z" },
  { type: "calls.connect", code: 200, at: "2026-11-01T03:41:00Z" },
];
