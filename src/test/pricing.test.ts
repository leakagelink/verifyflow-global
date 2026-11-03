import { describe, expect, it } from "vitest";
import { resalePrice, virtualPrices, rentalPrices, smsPrices, voicePrices, whatsappPlans, whatsappUsage } from "../services/pricing";
import { kycPrice, kycServices } from "../services/kyc-data";
import { wallet, creditPackages, activeNumbers } from "../services/mock-data";

const kyc = (id: string) => kycPrice(kycServices.find((s) => s.id === id)!);

describe("APITXT resale pricing (+70%)", () => {
  it("charges ₹1.70 when APITXT charges ₹1", () => {
    expect(resalePrice(1)).toBe(1.7);
  });

  it("adds 70% to fractional prices without changing currency", () => {
    expect(resalePrice(0.2)).toBe(0.34);
    expect(resalePrice(0.0027)).toBe(0.00459);
  });

  it("applies +70% to virtual numbers, rentals, SMS, voice and WhatsApp", () => {
    expect(virtualPrices.find((p) => p.country === "IN" && p.service === "whatsapp")?.priceInr).toBe(295.052);
    expect(rentalPrices.find((p) => p.country === "US")?.priceInr).toBe(816.34);
    expect(smsPrices.find((p) => p.id === "promotional")?.inr).toBe(0.34);
    expect(voicePrices.find((p) => p.id === "promotional")?.inr).toBe(0.51);
    expect(whatsappPlans.find((p) => p.name === "Starter" && p.cycle === "monthly")?.inr).toBe(1698.3);
    expect(whatsappUsage.find((p) => p.market === "India")?.marketing).toBe(0.02176);
  });

  it("prices new KYC services from APITXT rates +70%", () => {
    expect(kyc("aadhaar-ekyc")).toBe(5.1);
    expect(kyc("aadhaar")).toBe(3.4);
    expect(kyc("gst-cert")).toBe(85);
    expect(kyc("udyam-cert")).toBe(17);
    expect(kyc("pennydrop")).toBe(8.5);
  });

  it("preserves historical costs and purchased wallet credits", () => {
    expect(wallet.balance).toBe(128.5);
    expect(creditPackages.find((p) => p.amount === 100)?.bonus).toBe(5);
    expect(activeNumbers.find((p) => p.id === "ord_8f2k1")?.cost).toBe(0.42);
  });
});
