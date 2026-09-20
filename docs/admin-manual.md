# Admin manual

## Roles
- **super_admin**: all administration, fare publishing, user suspension, finance, audit.
- **operations**: users/drivers, fares, bulk orders, add-on review, broadcasts. No wallet payouts.
- **finance**: financial reporting and wallet reconciliation. No user suspension.

Roles are enforced twice: the UI hides unavailable actions and Supabase RLS/RPC authorization rejects them server-side.

## Fare changes
Open Fares, choose a city, edit the integer minor-unit rates and publish. Publishing deactivates the current version, creates a new effective version, writes `fare_config_versions`, and records an `admin_action_log` entry. The next server-side fare estimate reads the active configuration.

## B2B broadcast
Open Orders and choose Broadcast suppliers. The backend creates recipient rows for every active supplier in the order city and queues a push job. The dispatcher retries each recipient up to three times. Delivery state is stored on `broadcast_recipients`. SMS is available when `SMS_PROVIDER_URL` and `SMS_PROVIDER_KEY` are configured in the Edge Function environment.

## Add-on review
Flagged customer add-ons appear in Add-ons. Review the trip, driver, amount and audit information before financial reconciliation.

## Finance
Finance sees revenue, commission, payouts, add-ons and promo cost. Operations deliberately cannot access payout ledger rows.
