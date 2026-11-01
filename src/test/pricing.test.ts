import { describe, expect, it } from "vitest";
import { resalePrice } from "../services/pricing";

describe("APITXT resale pricing", () => {
  it("charges ₹2 when APITXT charges ₹1", () => {
    expect(resalePrice(1)).toBe(2);
  });

  it("doubles fractional upstream prices without changing currency", () => {
    expect(resalePrice(0.15)).toBe(0.30);
    expect(resalePrice(4.5)).toBe(9);
  });
});