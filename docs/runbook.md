# Production runbook

## Deploy
1. Apply Supabase migrations in order.
2. Deploy Edge Functions with JWT verification enabled.
3. Configure Next.js `NEXT_PUBLIC_SUPABASE_URL` and publishable key.
4. Configure `SMS_PROVIDER_URL` and `SMS_PROVIDER_KEY` only in the Supabase Edge Function environment if SMS is enabled.
5. Configure supplier push tokens from the supplier application.
6. Deploy `apps/admin` with Vercel preview/staging before production.

## Incident checks
- Supabase project health and security advisor.
- Edge Function logs for `broadcast-dispatcher` and `driver-controls`.
- Realtime connection counts and location update volume.
- `broadcast_jobs` rows stuck in `queued`/`processing`.
- Failed rows in `broadcast_recipients`.
- `audit_logs` and `admin_action_log` for privileged mutations.
- Reconcile `wallet_ledger` against completed trips before payouts.

## Recovery
Broadcast jobs are idempotent at the recipient level. Re-running a failed job only targets pending recipients. Fare configurations are versioned, so rollback means publishing a new configuration rather than mutating historical rows.

## Backups
Supabase managed backups/PITR should be enabled on the production project and restoration should be exercised on a non-production project before launch. Never treat application exports as the sole backup.
