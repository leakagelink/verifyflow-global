import snapshot from "./apitxt-pricing-snapshot.json";

/** Resale amounts use the upstream currency; no exchange-rate conversion. */
export const UPSTREAM_PRICE_MULTIPLIER = 2;

export function resalePrice(upstreamPrice: number): number {
  if (!Number.isFinite(upstreamPrice) || upstreamPrice < 0) {
    throw new RangeError("Upstream price must be a finite, non-negative amount");
  }
  return Number((upstreamPrice * UPSTREAM_PRICE_MULTIPLIER).toFixed(6));
}

export const pricingCheckedAt = snapshot.checkedAt;
export const virtualPrices = snapshot.virtual.map((p) => ({ ...p, price: resalePrice(p.usd), priceInr: resalePrice(p.inr) }));
export const rentalPrices = snapshot.rentals.map((p) => ({ country: p.area_code, name: p.area_name, price: resalePrice(p.price_usd_month), priceInr: resalePrice(p.price_inr_month) }));
export const smsPrices = Object.entries(snapshot.sms).map(([id, p]) => ({ id, label: id.replaceAll("_", " "), usd: resalePrice(p.price_per_credit_usd), inr: resalePrice(p.price_per_credit), unit: "credit · India" }));
export const whatsappPlans = snapshot.whatsappPlans.map((p) => ({ ...p, usd: resalePrice(p.usd), inr: resalePrice(p.inr) }));
export const aiPlans = snapshot.aiPlans.map((p) => ({ ...p, usd: resalePrice(p.usd), inr: resalePrice(p.inr) }));
export const whatsappUsage = snapshot.whatsappUsage.map((p) => ({ ...p, marketing: resalePrice(p.marketing), utility: resalePrice(p.utility), auth: resalePrice(p.auth), auth_intl: resalePrice(p.auth_intl), calling_bi: resalePrice(p.calling_bi), service: resalePrice(p.service) }));

export function formatServicePrice(amount: number, currency: "USD" | "INR" = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 6 }).format(amount);
}