create extension if not exists postgis;

create type public.app_role as enum ('customer','driver','supplier','admin');
create type public.trip_state as enum ('requested','accepted','arriving','in_progress','completed','cancelled');
create type public.order_state as enum ('requested','quoted','accepted','in_progress','completed','cancelled');
create type public.broadcast_recipient_state as enum ('pending','accepted','declined');
create type public.promo_kind as enum ('percentage','fixed');

create table public.cities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  country_code text not null default 'ET',
  timezone text not null default 'Africa/Addis_Ababa',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  city_id uuid references public.cities(id),
  role public.app_role not null default 'customer',
  phone text not null unique check (phone ~ '^\\+2519[0-9]{8}$'),
  full_name text,
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.drivers (
  id uuid primary key references public.profiles(id) on delete cascade,
  city_id uuid not null references public.cities(id),
  license_number text not null unique,
  is_online boolean not null default false,
  location geography(Point,4326),
  rating numeric(3,2) check (rating between 0 and 5),
  created_at timestamptz not null default now()
);

create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id),
  driver_id uuid not null references public.drivers(id) on delete cascade,
  make text not null,
  model text not null,
  plate_number text not null unique,
  color text,
  seats smallint not null default 4 check (seats between 1 and 20),
  created_at timestamptz not null default now()
);

create table public.fare_configs (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id),
  service_type text not null check (service_type in ('taxi','delivery')),
  base_minor bigint not null check (base_minor >= 0),
  per_km_minor bigint not null check (per_km_minor >= 0),
  per_minute_minor bigint not null check (per_minute_minor >= 0),
  minimum_fare_minor bigint not null check (minimum_fare_minor >= 0),
  effective_from timestamptz not null default now(),
  effective_to timestamptz,
  is_active boolean not null default true
);

create table public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id),
  code text not null,
  kind public.promo_kind not null,
  value_minor bigint,
  percentage numeric(5,2),
  max_discount_minor bigint,
  starts_at timestamptz not null,
  ends_at timestamptz,
  usage_limit integer,
  usage_count integer not null default 0,
  is_active boolean not null default true,
  unique(city_id, code),
  check ((kind='fixed' and value_minor is not null and percentage is null) or (kind='percentage' and percentage is not null and value_minor is null)),
  check (percentage is null or percentage between 0 and 100)
);

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id),
  customer_id uuid not null references public.profiles(id),
  driver_id uuid references public.drivers(id),
  vehicle_id uuid references public.vehicles(id),
  service_type text not null check (service_type in ('taxi','delivery')),
  state public.trip_state not null default 'requested',
  pickup geography(Point,4326) not null,
  destination geography(Point,4326) not null,
  pickup_label text,
  destination_label text,
  estimated_distance_m integer not null check (estimated_distance_m >= 0),
  estimated_duration_s integer not null check (estimated_duration_s >= 0),
  final_distance_m integer,
  final_duration_s integer,
  fare_base_minor bigint not null default 0,
  fare_distance_minor bigint not null default 0,
  fare_time_minor bigint not null default 0,
  promo_discount_minor bigint not null default 0,
  driver_addon_minor bigint not null default 0,
  total_minor bigint not null default 0,
  promo_code_id uuid references public.promo_codes(id),
  requested_at timestamptz not null default now(),
  accepted_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz
);

create table public.shared_rides (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id),
  trip_id uuid references public.trips(id) on delete cascade,
  driver_id uuid not null references public.drivers(id),
  customer_id uuid not null references public.profiles(id),
  state public.broadcast_recipient_state not null default 'pending',
  tracking_token uuid not null default gen_random_uuid() unique,
  created_at timestamptz not null default now(),
  responded_at timestamptz
);

create table public.addon_fees (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id),
  trip_id uuid not null references public.trips(id) on delete cascade,
  driver_id uuid not null references public.drivers(id),
  amount_minor bigint not null check (amount_minor > 0),
  reason text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected','flagged')),
  created_at timestamptz not null default now()
);

create table public.wallet_ledger (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id),
  profile_id uuid not null references public.profiles(id),
  amount_minor bigint not null,
  entry_type text not null,
  reference_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.bulk_orders (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id),
  customer_id uuid not null references public.profiles(id),
  item_type text not null,
  quantity integer not null check (quantity > 0),
  photo_path text,
  delivery_location geography(Point,4326) not null,
  delivery_label text,
  needed_by date not null,
  state public.order_state not null default 'requested',
  created_at timestamptz not null default now()
);

create table public.suppliers (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id),
  profile_id uuid not null references public.profiles(id),
  business_name text not null,
  phone text not null check (phone ~ '^\\+2519[0-9]{8}$'),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.broadcasts (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id),
  created_by uuid not null references public.profiles(id),
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table public.broadcast_recipients (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id),
  broadcast_id uuid not null references public.broadcasts(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  state public.broadcast_recipient_state not null default 'pending',
  created_at timestamptz not null default now(),
  unique(broadcast_id, recipient_id)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  data jsonb not null default '{}',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id),
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index trips_customer_idx on public.trips(customer_id, requested_at desc);
create index trips_driver_idx on public.trips(driver_id, requested_at desc);
create index drivers_location_idx on public.drivers using gist(location);
create index trips_pickup_idx on public.trips using gist(pickup);
create index trips_destination_idx on public.trips using gist(destination);

create or replace function public.current_role() returns public.app_role
language sql stable security invoker set search_path = public
as $$ select coalesce((select role from public.profiles where id = auth.uid()), 'customer'::public.app_role) $$;

create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.drivers enable row level security;
alter table public.vehicles enable row level security;
alter table public.shared_rides enable row level security;
alter table public.trips enable row level security;
alter table public.fare_configs enable row level security;
alter table public.addon_fees enable row level security;
alter table public.wallet_ledger enable row level security;
alter table public.promo_codes enable row level security;
alter table public.bulk_orders enable row level security;
alter table public.suppliers enable row level security;
alter table public.broadcasts enable row level security;
alter table public.broadcast_recipients enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;
alter table public.cities enable row level security;

create policy profiles_self_select on public.profiles for select to authenticated using (id=auth.uid() or public.current_role()='admin');
create policy profiles_self_update on public.profiles for update to authenticated using (id=auth.uid()) with check (id=auth.uid());
create policy profiles_admin_all on public.profiles for all to authenticated using (public.current_role()='admin') with check (public.current_role()='admin');

create policy cities_authenticated_read on public.cities for select to authenticated using (is_active or public.current_role()='admin');
create policy cities_admin_write on public.cities for all to authenticated using (public.current_role()='admin') with check (public.current_role()='admin');

create policy drivers_self_or_admin on public.drivers for select to authenticated using (id=auth.uid() or public.current_role()='admin');
create policy drivers_self_update on public.drivers for update to authenticated using (id=auth.uid()) with check (id=auth.uid());
create policy drivers_admin_all on public.drivers for all to authenticated using (public.current_role()='admin') with check (public.current_role()='admin');

create policy vehicles_authenticated_read on public.vehicles for select to authenticated using (driver_id=auth.uid() or public.current_role() in ('admin','supplier'));
create policy vehicles_driver_write on public.vehicles for all to authenticated using (driver_id=auth.uid()) with check (driver_id=auth.uid());
create policy vehicles_admin_all on public.vehicles for all to authenticated using (public.current_role()='admin') with check (public.current_role()='admin');

create policy fare_configs_read on public.fare_configs for select to authenticated using (is_active and (effective_to is null or effective_to > now()) and effective_from <= now());
create policy fare_configs_admin on public.fare_configs for all to authenticated using (public.current_role()='admin') with check (public.current_role()='admin');

create policy promos_read on public.promo_codes for select to authenticated using (is_active and starts_at <= now() and (ends_at is null or ends_at > now()));
create policy promos_admin on public.promo_codes for all to authenticated using (public.current_role()='admin') with check (public.current_role()='admin');

create policy trips_customer_select on public.trips for select to authenticated using (customer_id=auth.uid());
create policy trips_customer_insert on public.trips for insert to authenticated with check (customer_id=auth.uid() and public.current_role()='customer');
create policy trips_customer_cancel on public.trips for update to authenticated using (customer_id=auth.uid()) with check (customer_id=auth.uid());
create policy trips_driver_select on public.trips for select to authenticated using (driver_id=auth.uid());
create policy trips_driver_update on public.trips for update to authenticated using (driver_id=auth.uid()) with check (driver_id=auth.uid());
create policy trips_admin_all on public.trips for all to authenticated using (public.current_role()='admin') with check (public.current_role()='admin');

create policy addon_customer_select on public.addon_fees for select to authenticated using (exists(select 1 from public.trips t where t.id=trip_id and t.customer_id=auth.uid()));
create policy addon_driver_insert on public.addon_fees for insert to authenticated with check (driver_id=auth.uid() and exists(select 1 from public.trips t where t.id=trip_id and t.driver_id=auth.uid()));
create policy addon_customer_flag on public.addon_fees for update to authenticated using (exists(select 1 from public.trips t where t.id=trip_id and t.customer_id=auth.uid())) with check (status='flagged');
create policy addon_admin_all on public.addon_fees for all to authenticated using (public.current_role()='admin') with check (public.current_role()='admin');

create policy wallet_select_own on public.wallet_ledger for select to authenticated using (profile_id=auth.uid() or public.current_role()='admin');
create policy wallet_admin_insert on public.wallet_ledger for insert to authenticated with check (public.current_role()='admin');
create policy wallet_admin_update_block on public.wallet_ledger for update to authenticated using (false);
create policy wallet_admin_delete_block on public.wallet_ledger for delete to authenticated using (false);

create policy bulk_customer_select on public.bulk_orders for select to authenticated using (customer_id=auth.uid());
create policy bulk_customer_insert on public.bulk_orders for insert to authenticated with check (customer_id=auth.uid() and public.current_role()='customer');
create policy bulk_customer_update on public.bulk_orders for update to authenticated using (customer_id=auth.uid()) with check (customer_id=auth.uid());
create policy bulk_supplier_read on public.bulk_orders for select to authenticated using (public.current_role() in ('supplier','admin'));
create policy bulk_admin_all on public.bulk_orders for all to authenticated using (public.current_role()='admin') with check (public.current_role()='admin');

create policy suppliers_self_or_admin on public.suppliers for select to authenticated using (profile_id=auth.uid() or public.current_role()='admin');
create policy suppliers_self_write on public.suppliers for all to authenticated using (profile_id=auth.uid()) with check (profile_id=auth.uid() and public.current_role()='supplier');
create policy suppliers_admin_all on public.suppliers for all to authenticated using (public.current_role()='admin') with check (public.current_role()='admin');

create policy broadcasts_admin_write on public.broadcasts for all to authenticated using (public.current_role()='admin') with check (public.current_role()='admin');
create policy broadcasts_recipient_select on public.broadcast_recipients for select to authenticated using (recipient_id=auth.uid() or public.current_role()='admin');
create policy broadcasts_recipient_update on public.broadcast_recipients for update to authenticated using (recipient_id=auth.uid()) with check (recipient_id=auth.uid());
create policy broadcasts_recipient_admin on public.broadcast_recipients for all to authenticated using (public.current_role()='admin') with check (public.current_role()='admin');

create policy notifications_own_select on public.notifications for select to authenticated using (recipient_id=auth.uid());
create policy notifications_own_update on public.notifications for update to authenticated using (recipient_id=auth.uid()) with check (recipient_id=auth.uid());
create policy notifications_admin_insert on public.notifications for insert to authenticated with check (public.current_role()='admin');
create policy notifications_admin_all on public.notifications for delete to authenticated using (public.current_role()='admin');

create policy audit_admin_select on public.audit_logs for select to authenticated using (public.current_role()='admin');
create policy audit_admin_insert on public.audit_logs for insert to authenticated with check (public.current_role()='admin');
create policy audit_no_update on public.audit_logs for update to authenticated using (false);
create policy audit_no_delete on public.audit_logs for delete to authenticated using (false);

create policy shared_rides_participants_select on public.shared_rides for select to authenticated using (customer_id=auth.uid() or driver_id=auth.uid() or public.current_role()='admin');
create policy shared_rides_driver_insert on public.shared_rides for insert to authenticated with check (driver_id=auth.uid() and public.current_role()='driver');
create policy shared_rides_customer_update on public.shared_rides for update to authenticated using (customer_id=auth.uid()) with check (customer_id=auth.uid());
create policy shared_rides_driver_update on public.shared_rides for update to authenticated using (driver_id=auth.uid()) with check (driver_id=auth.uid());
create policy shared_rides_admin_all on public.shared_rides for all to authenticated using (public.current_role()='admin') with check (public.current_role()='admin');

insert into public.cities(name) values ('Addis Ababa') on conflict do nothing;

insert into storage.buckets(id,name,public) values ('bulk-order-photos','bulk-order-photos',false) on conflict (id) do nothing;

create policy bulk_photo_read_own on storage.objects for select to authenticated using (bucket_id='bulk-order-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy bulk_photo_insert_own on storage.objects for insert to authenticated with check (bucket_id='bulk-order-photos' and (storage.foldername(name))[1] = auth.uid()::text);
