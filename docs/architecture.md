# Architecture

The platform is a pnpm/Turborepo monorepo with Expo customer/driver apps, a Next.js App Router admin app, shared TypeScript/fare logic, and Supabase Postgres/PostGIS/Auth/Realtime/Storage/Edge Functions.

The admin app uses Supabase SSR for authenticated server rendering and the publishable browser client for interactive reads. No service-role secret is shipped to Next.js. Privileged mutations are implemented as `SECURITY DEFINER` functions with explicit role checks. Edge Functions use service-role credentials only inside Supabase's managed runtime.

Money is stored as integer minor units. Fare versions are immutable after publication: a new configuration closes the previous active version and records a JSON snapshot. Audit rows capture actor, action, entity and metadata.

Broadcasts are durable: an order creates a broadcast, recipient rows and queue jobs. `broadcast-dispatcher` processes each recipient with retries and records delivery state. Provider credentials are environment configuration, never source code.

City ID is carried through operational tables and reporting queries so the launch city can expand without rebuilding the data model.
