/** Resale amounts use the upstream currency; no exchange-rate conversion. */
export const UPSTREAM_PRICE_MULTIPLIER = 2;

export function resalePrice(upstreamPrice: number): number {
  if (!Number.isFinite(upstreamPrice) || upstreamPrice < 0) {
    throw new RangeError("Upstream price must be a finite, non-negative amount");
  }
  return Math.round(upstreamPrice * UPSTREAM_PRICE_MULTIPLIER * 100) / 100;
}