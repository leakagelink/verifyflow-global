import { describe, expect, it } from "vitest";
import { resalePrice, virtualPrices, rentalPrices, smsPrices, whatsappPlans, whatsappUsage } from "../services/pricing";
import { marketplace, wallet, creditPackages, activeNumbers } from "../services/mock-data";

describe("APITXT resale pricing", () => {
  it("charges ₹2 when APITXT charges ₹1", () => {
    expect(resalePrice(1)).toBe(2);
  });

  it("doubles fractional upstream prices without changing currency", () => {
    expect(resalePrice(0.15)).toBe(0.30);
    expect(resalePrice(4.5)).toBe(9);
    expect(resalePrice(0.0027)).toBe(0.0054);
  });

  it("uses the India WhatsApp country quote, not a global starting price", () => {
    expect(virtualPrices.find((p) => p.country === "IN" && p.service === "whatsapp")?.priceInr).toBe(347.12);
    expect(marketplace.find((p) => p.country.code === "IN" && p.service.id === "whatsapp")?.price).toBe(3.8);
  });

  it("doubles the USA monthly rental quote", () => {
    expect(rentalPrices.find((p) => p.country === "US")?.priceInr).toBe(960.4);
    expect(rentalPrices.find((p) => p.country === "US")?.price).toBe(10.4);
  });

  it("doubles SMS credit prices without rounding small USD rates to zero", () => {
    expect(smsPrices.find((p) => p.id === "promotional")?.inr).toBe(0.4);
    expect(smsPrices.find((p) => p.id === "promotional")?.usd).toBe(0.0054);
  });

  it("doubles WhatsApp plans and market-specific message rates", () => {
    expect(whatsappPlans.find((p) => p.name === "Starter" && p.cycle === "monthly")?.inr).toBe(1998);
    expect(whatsappUsage.find((p) => p.market === "India")?.marketing).toBe(0.0256);
  });

  it("preserves historical costs and purchased wallet credits", () => {
    expect(wallet.balance).toBe(128.5);
    expect(creditPackages.find((p) => p.amount === 100)?.bonus).toBe(5);
    expect(activeNumbers.find((p) => p.id === "ord_8f2k1")?.cost).toBe(0.42);
  });
});