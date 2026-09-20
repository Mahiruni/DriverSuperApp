# DriverSuperApp

Part 1 + Part 2 foundation for an Ethiopia-focused ride, delivery and B2B super app.

## Part 2 driver app

`apps/driver` is an Expo React Native driver application using the existing Supabase project. It includes:

- online/offline mode and foreground GPS publishing
- realtime trip requests and accept/decline flow with a 30-second acceptance window
- native map with pickup/destination/passenger markers and Mapbox navigation handoff
- trip state controls
- daily completed-trip earnings
- shared rides with a database-enforced four-passenger limit
- passenger invites using Ethiopian phone normalization
- server-side passenger fare finalization using city fare configuration and shared-ride discount settings
- configurable 25/50/100/200 Birr add-ons loaded from Supabase
- idempotent add-on creation, server-side per-trip maximum, audit logging and 30-second undo
- accessible 48px+ controls and resilient loading/empty/error states

## Supabase

Project schema now includes `shared_ride_passengers` and `driver_locations`, plus server RPCs:

- `add_shared_ride_passenger`
- `complete_shared_passenger`
- `add_driver_addon`
- `undo_driver_addon`

Fare amounts are integer minor units. The client never computes a charge; it requests server-side results.

## Environment

Use Expo public variables only for the Supabase project URL and publishable key. Never put service-role keys or other secrets in the mobile app.

```env
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Mapbox vendor integration remains behind the app navigation handoff/provider boundary; no access token is hard-coded.
