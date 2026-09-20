import { describe, expect, it } from 'vitest';
import { calculateFare } from './fare';

describe('calculateFare', () => {
  const config = { baseMinor: 5000, perKmMinor: 2500, perMinuteMinor: 500, minimumFareMinor: 12000 };

  it('calculates distance and time in integer minor units', () => {
    expect(calculateFare(config, { distanceKm: 2, durationMinutes: 4 }).totalMinor).toBe(12000);
  });

  it('applies the minimum fare when the calculated fare is lower', () => {
    const result = calculateFare(config, { distanceKm: 0, durationMinutes: 0 });
    expect(result.minimumAdjustmentMinor).toBe(7000);
    expect(result.totalMinor).toBe(12000);
  });

  it('caps percentage promo discounts and never makes the fare negative', () => {
    const result = calculateFare(config, { distanceKm: 10, durationMinutes: 10, promo: { kind: 'percentage', value: 100, maxDiscountMinor: 15000 } });
    expect(result.promoDiscountMinor).toBe(15000);
    expect(result.totalMinor).toBeGreaterThanOrEqual(0);
  });

  it('caps fixed discounts at subtotal', () => {
    const result = calculateFare(config, { distanceKm: 0, durationMinutes: 0, promo: { kind: 'fixed', value: 999999 } });
    expect(result.promoDiscountMinor).toBe(12000);
    expect(result.totalMinor).toBe(0);
  });
});
