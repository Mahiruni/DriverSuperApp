export const featureFlags={walletPayments:false,ratings:false,sos:false,scheduledRides:false,multiCity:true} as const;
export type FeatureFlag=keyof typeof featureFlags;
export function isFeatureEnabled(flag:FeatureFlag){return featureFlags[flag];}
