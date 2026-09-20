export interface SmsProvider { sendOtp(phone: string): Promise<void>; }
export interface PaymentProvider { createPayment(input: { amountMinor: number; reference: string }): Promise<{ id: string; status: 'pending'|'succeeded'|'failed' }>; }
export interface MapsProvider { estimateRoute(input: { from: { latitude:number; longitude:number }; to: { latitude:number; longitude:number } }): Promise<{ distanceM:number; durationS:number }>; }
