export type Money = number;

export type FareConfig = {
  baseMinor: Money;
  perKmMinor: Money;
  perMinuteMinor: Money;
  minimumFareMinor: Money;
};

export type FareInput = {
  distanceKm: number;
  durationMinutes: number;
  promo?: Promo;
  driverAddonMinor?: Money;
};

export type Promo = {
  kind: 'percentage' | 'fixed';
  value: number;
  maxDiscountMinor?: Money;
};

export type FareBreakdown = {
  baseMinor: Money;
  distanceMinor: Money;
  timeMinor: Money;
  subtotalMinor: Money;
  minimumAdjustmentMinor: Money;
  promoDiscountMinor: Money;
  driverAddonMinor: Money;
  totalMinor: Money;
};

const nonNegativeInt = (value: number) => Math.max(0, Math.round(value));

export function calculateFare(config: FareConfig, input: FareInput): FareBreakdown {
  const baseMinor = nonNegativeInt(config.baseMinor);
  const distanceMinor = nonNegativeInt(input.distanceKm * config.perKmMinor);
  const timeMinor = nonNegativeInt(input.durationMinutes * config.perMinuteMinor);
  const rawSubtotal = baseMinor + distanceMinor + timeMinor;
  const minimumAdjustmentMinor = Math.max(0, config.minimumFareMinor - rawSubtotal);
  const subtotalMinor = rawSubtotal + minimumAdjustmentMinor;

  let promoDiscountMinor = 0;
  if (input.promo) {
    promoDiscountMinor = input.promo.kind === 'percentage'
      ? Math.floor(subtotalMinor * Math.min(100, Math.max(0, input.promo.value)) / 100)
      : nonNegativeInt(input.promo.value);
    if (input.promo.maxDiscountMinor !== undefined) {
      promoDiscountMinor = Math.min(promoDiscountMinor, nonNegativeInt(input.promo.maxDiscountMinor));
    }
    promoDiscountMinor = Math.min(promoDiscountMinor, subtotalMinor);
  }

  const driverAddonMinor = nonNegativeInt(input.driverAddonMinor ?? 0);
  const totalMinor = subtotalMinor - promoDiscountMinor + driverAddonMinor;

  return { baseMinor, distanceMinor, timeMinor, subtotalMinor, minimumAdjustmentMinor, promoDiscountMinor, driverAddonMinor, totalMinor };
}
