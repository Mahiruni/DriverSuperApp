# Setup

```bash
pnpm install
pnpm --filter @driver-super-app/admin dev
```

Create `apps/admin/.env.local` from `.env.example`. Use only the Supabase URL and publishable key. The admin user must have `profiles.role = admin`, `admin_role` set to `super_admin`, `operations`, or `finance`, and `account_status = active`.

For staging, point the same app at a separate Supabase project. Do not copy production data into staging. Apply migrations and seed non-sensitive test users/fare configs.

Run checks from the repository root:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm format:check
```
