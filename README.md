# DriverSuperApp

Production foundation for an Ethiopia-focused mobility, delivery, and B2B ordering super app.

## Part 1

- Turborepo + pnpm monorepo
- Expo Customer App
- Expo Driver App foundation
- Next.js Admin foundation
- Shared TypeScript/Zod/fare engine package
- Supabase/Postgres/PostGIS migrations with RLS
- Mapbox behind `MapsProvider`
- Supabase phone OTP authentication

## Environment

Never commit secrets. Copy `.env.example` files and configure Supabase/Mapbox credentials in your local or deployment environment.

## Provider decisions

Maps: Mapbox.
Payments and SMS remain provider interfaces until a vendor is explicitly selected.

## Development

```bash
corepack enable
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
```
