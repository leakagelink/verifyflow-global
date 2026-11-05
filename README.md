# Com Nexa API

# Build a Premium Global Virtual Number & OTP Verification SaaS Platform

Act as a senior SaaS product designer, UI/UX architect, and frontend engineer.

I want to build a premium, modern, scalable SaaS platform that provides virtual phone numbers, SMS OTP verification, WhatsApp verification, rental numbers, KYC verification APIs, and developer APIs.

Our platform will use APITXT.com as an upstream API provider. We will build our own branded platform and provide our own customer-facing API.

The platform will support customers from multiple countries and will offer a credit-based billing system.

IMPORTANT: First build the complete frontend UI/UX with realistic mock data. Do not implement actual API integrations, payment processing, or backend functionality yet.

The code must be clean, modular, reusable, and ready for future integration with a NestJS backend and PostgreSQL database.

---

# 1. BRAND AND DESIGN DIRECTION

Create a premium developer-focused SaaS interface.

Design inspiration:
- Modern fintech dashboards
- Stripe-style billing interfaces
- Linear-style clean UI
- Vercel-style developer experience
- Modern API infrastructure platforms

Visual direction:
- Premium and professional
- Minimal but information-rich
- Clean typography
- Excellent spacing
- Subtle borders
- Beautiful data tables
- Modern dashboard cards
- High-quality icons
- Smooth micro-interactions
- Responsive layouts

Use a premium light theme as the default.

Suggested colors:
- Primary: Indigo / Electric Blue
- Background: #F8FAFC
- Cards: #FFFFFF
- Text: #0F172A
- Secondary Text: #64748B
- Borders: #E2E8F0
- Success: #16A34A
- Warning: #F59E0B
- Error: #EF4444

Use a dark theme as an optional toggle.

Avoid:
- Generic AI-generated dashboard appearance
- Excessive gradients
- Excessive glassmorphism
- Oversized headings inside dashboards
- Unnecessary animations
- Cluttered layouts
- Cartoon-style illustrations

The interface should look like a real premium SaaS product that developers and businesses would trust.

---

# 2. TECHNICAL REQUIREMENTS

Use:
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Lucide icons
- React Router
- TanStack Query where appropriate
- Recharts for dashboard charts

Use reusable components and a scalable folder structure.

Create:
- Shared dashboard layout
- Reusable sidebar
- Reusable page headers
- Reusable data tables
- Reusable modal components
- Reusable form components
- Reusable badge/status components
- Reusable copy-to-clipboard component
- Mock data layer organized into clean service files

---

# 3. MAIN APPLICATION LAYOUT

The app should have two primary layouts:

1. Marketing / Landing Page
2. Customer Dashboard Layout

## Customer Dashboard Shell:

- Collapsible or modern fixed sidebar
- Top navigation bar:
  - Global Search (Ctrl/Cmd + K style modal)
  - Environment indicator (Live / Sandbox toggle)
  - Wallet balance pill ($128.50 Credits / Recharge CTA)
  - Quick action button ("+ Get Number")
  - Notifications bell with unread indicator
  - User avatar dropdown menu (Profile, API Keys, Billing, Logout)

Sidebar Navigation Items:
- Dashboard (Home overview)
- Numbers & Verification:
  - Get Number (Marketplace)
  - Active Numbers
  - SMS Verifications
  - WhatsApp Verifications
  - Rental Numbers
  - Verification History & Reports
- Developer:
  - API Keys
  - API Logs
  - Webhooks
  - Interactive API Docs
- Billing:
  - Wallet & Add Credits
  - Invoices & Transactions
  - Usage Analytics
- Account:
  - Settings
  - Team Members
  - Security / 2FA
  - Refer & Earn
- Admin Portal (switchable view or mock route for admin management)

---

# 4. DASHBOARD OVERVIEW

Provide high-level metrics cards:
- Total Wallet Balance (with instant "Add Funds" modal)
- Active Numbers count
- Verifications This Month (with success rate indicator)
- API Calls Today (with latency/success rate)

Charts:
- Verification volume over time (7d, 30d, 90d toggle)
- Cost & credit consumption breakdown by service (SMS vs WhatsApp vs Rentals)

Quick Access Widgets:
- Quick Buy / Rapid Number order card (select Country + Service -> instant order)
- Recent OTP Feed (live-updating simulated stream of incoming verifications)
- Low balance alert banner when credits dip

---

# 5. VIRTUAL NUMBER MARKETPLACE & VERIFICATION FLOWS

Build rich interactive screens with full mock data for:
- Virtual Number Marketplace: filter by country, service (Telegram, WhatsApp, Google, OpenAI, etc.), carrier, pricing, success rate, stock status.
- SMS OTP Verification screen: active session card with countdown timer, waiting state, simulated incoming OTP with copy button, cancel/refund button.
- WhatsApp Verification screen: dedicated WhatsApp activation, QR code verification simulation, voice OTP fallback.
- Rental Numbers: monthly/weekly rentals, renew, auto-renewal settings, message inbox.
- Verification Reports & Analytics: filtering by date, service, status, export to CSV.

---

# 6. DEVELOPER PORTAL & API TOOLS

- API Keys: create, revoke, copy, restrict IP, permission scopes, key usage metrics.
- API Logs: request/response viewer with status codes, latency, headers, payload inspect modal.
- Webhooks: configure endpoints, test webhook delivery button with mock payload, event logs.
- Interactive API Documentation: clean Swagger/Stripe-style docs with code snippets (cURL, Python, Node.js, Go), parameter tables, and mock "Run in Sandbox" request tester.

---

# 7. WALLET, BILLING & ACCOUNT

- Credit Packages & Custom Top-up modal (Cards, Crypto, PayPal, Wire).
- Transaction history with downloadable mock PDF invoices.
- Refer & Earn affiliate dashboard with referral link, commission rates, and payout history.
- User Settings, 2FA toggle, IP allowlist, notifications preferences.
- Admin Portal view: platform analytics, user management, order management, upstream provider status (APITXT.com mock health monitor).

Build the actual multi-page application interface with realistic mock data, smooth routing, and pristine UI design.

This project was built with [Lovable](https://lovable.dev).

**Brand domain**: https://comnexaapi.com (custom-domain connection is managed separately in Lovable).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/dfcd59f4-096d-46f2-a1fe-7a22ba86fc78).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
