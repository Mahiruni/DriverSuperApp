import { z } from 'zod';

export const ethiopianPhoneSchema = z.string().regex(/^\+2519\d{8}$/, 'Enter a valid Ethiopian mobile number');
export const tripStateSchema = z.enum(['requested','accepted','arriving','in_progress','completed','cancelled']);
export const locationSchema = z.object({ latitude: z.number().gte(-90).lte(90), longitude: z.number().gte(-180).lte(180) });
export const tripRequestSchema = z.object({
  serviceType: z.enum(['taxi','delivery']),
  pickup: locationSchema,
  destination: locationSchema,
  pickupLabel: z.string().max(200).optional(),
  destinationLabel: z.string().max(200).optional(),
  estimatedDistanceM: z.number().int().nonnegative(),
  estimatedDurationS: z.number().int().nonnegative(),
  fareBaseMinor: z.number().int().nonnegative(),
  fareDistanceMinor: z.number().int().nonnegative(),
  fareTimeMinor: z.number().int().nonnegative(),
  promoDiscountMinor: z.number().int().nonnegative(),
  totalMinor: z.number().int().nonnegative()
});

export function normalizeEthiopianPhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (digits.startsWith('2519') && digits.length === 12) return `+${digits}`;
  if (digits.startsWith('09') && digits.length === 10) return `+251${digits.slice(1)}`;
  if (digits.startsWith('9') && digits.length === 9) return `+251${digits}`;
  throw new Error('Enter a valid Ethiopian mobile number');
}
