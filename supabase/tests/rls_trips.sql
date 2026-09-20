begin;
create extension if not exists pgtap;

-- This test is intended for the Supabase local test runner with pgTAP enabled.
-- The important invariant: authenticated customer A can select only A's trips.
select plan(2);

select has_table('public','trips','trips table exists');

-- RLS policy presence is checked structurally here; integration CI should execute the
-- same policy against two authenticated JWT identities after local auth seeding.
select policies_are('public','trips',array[
  'trips_customer_select','trips_customer_insert','trips_customer_cancel',
  'trips_driver_select','trips_driver_update','trips_admin_all'
],'trip policies are installed');

select * from finish();
rollback;
