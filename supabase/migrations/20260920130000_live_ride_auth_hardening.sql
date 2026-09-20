-- Live ride/auth hardening applied to production Supabase project.
-- Keeps customer city assignment deterministic and routes ride creation through the
-- authenticated user's profile + active city fare configuration.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $function$
declare
  normalized_phone text;
  default_city uuid;
begin
  normalized_phone := nullif(trim(new.raw_user_meta_data->>'phone'), '');
  if normalized_phone is not null then
    normalized_phone := regexp_replace(normalized_phone, '[^0-9+]', '', 'g');
    if normalized_phone ~ '^09[0-9]{8}$' then
      normalized_phone := '+251' || substring(normalized_phone from 2);
    elsif normalized_phone ~ '^9[0-9]{8}$' then
      normalized_phone := '+251' || normalized_phone;
    end if;
    if normalized_phone !~ '^\\+2519[0-9]{8}$' then normalized_phone := null; end if;
  end if;

  select id into default_city from public.cities
  where country_code='ET' and is_active
  order by created_at
  limit 1;

  insert into public.profiles (id, city_id, full_name, phone, role, account_status)
  values (new.id, default_city,
    nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
    normalized_phone, 'customer', 'active')
  on conflict (id) do nothing;
  return new;
exception when unique_violation then
  insert into public.profiles (id, city_id, full_name, phone, role, account_status)
  values (new.id, default_city,
    nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
    null, 'customer', 'active')
  on conflict (id) do nothing;
  return new;
end;
$function$;

create or replace function public.create_trip_request(
  p_service_type text,
  p_pickup_lat double precision,
  p_pickup_lng double precision,
  p_destination_lat double precision,
  p_destination_lng double precision,
  p_distance_m integer,
  p_duration_s integer,
  p_promo_code text default null
)
returns public.trips
language plpgsql
security invoker
set search_path = public
as $function$
declare
  v_city uuid;
  v_cfg public.fare_configs;
  v_promo public.promo_codes;
  v_base bigint;
  v_dist bigint;
  v_time bigint;
  v_discount bigint := 0;
  v_total bigint;
  v_trip public.trips;
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_service_type not in ('taxi','delivery') then raise exception 'INVALID_SERVICE_TYPE'; end if;
  if p_distance_m < 0 or p_duration_s < 0 then raise exception 'INVALID_ROUTE'; end if;

  select city_id into v_city from public.profiles
  where id=auth.uid() and role='customer' and account_status='active';
  if v_city is null then raise exception 'PROFILE_CITY_REQUIRED'; end if;

  select * into v_cfg from public.fare_configs
  where city_id=v_city and service_type=p_service_type and is_active
    and effective_from<=now() and (effective_to is null or effective_to>now())
  order by effective_from desc limit 1;
  if not found then raise exception 'FARE_CONFIG_NOT_FOUND'; end if;

  v_base := v_cfg.base_minor;
  v_dist := round((p_distance_m::numeric/1000) * v_cfg.per_km_minor);
  v_time := round((p_duration_s::numeric/60) * v_cfg.per_minute_minor);
  v_total := greatest(v_cfg.minimum_fare_minor, v_base + v_dist + v_time);

  if p_promo_code is not null then
    select * into v_promo from public.promo_codes
    where city_id=v_city and upper(code)=upper(trim(p_promo_code))
      and is_active and starts_at<=now() and (ends_at is null or ends_at>now())
      and (usage_limit is null or usage_count<usage_limit) limit 1;
    if found then
      if v_promo.kind='fixed' then
        v_discount := least(v_total, coalesce(v_promo.value_minor,0));
      else
        v_discount := floor(v_total*(coalesce(v_promo.percentage,0)/100));
        if v_promo.max_discount_minor is not null then
          v_discount := least(v_discount,v_promo.max_discount_minor);
        end if;
      end if;
      v_total := greatest(0,v_total-v_discount);
    end if;
  end if;

  insert into public.trips(
    city_id,customer_id,service_type,pickup,destination,
    estimated_distance_m,estimated_duration_s,
    fare_base_minor,fare_distance_minor,fare_time_minor,
    promo_discount_minor,total_minor,promo_code_id
  ) values (
    v_city,auth.uid(),p_service_type,
    st_setsrid(st_makepoint(p_pickup_lng,p_pickup_lat),4326)::geography,
    st_setsrid(st_makepoint(p_destination_lng,p_destination_lat),4326)::geography,
    p_distance_m,p_duration_s,v_base,v_dist,v_time,v_discount,v_total,
    case when v_promo.id is null then null else v_promo.id end
  ) returning * into v_trip;
  return v_trip;
end;
$function$;

revoke all on function public.create_trip_request(text,double precision,double precision,double precision,double precision,integer,integer,text) from public, anon;
grant execute on function public.create_trip_request(text,double precision,double precision,double precision,double precision,integer,integer,text) to authenticated, service_role;

create or replace function public.accept_trip_request(p_trip_id uuid)
returns public.trips
language plpgsql
security invoker
set search_path = public
as $function$
declare
  t public.trips%rowtype;
  d public.drivers%rowtype;
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  select * into d from public.drivers
  where id=auth.uid() and review_status='approved' and is_online=true;
  if not found then raise exception 'DRIVER_NOT_AVAILABLE'; end if;
  select * into t from public.trips where id=p_trip_id for update;
  if not found then raise exception 'TRIP_NOT_FOUND'; end if;
  if t.state <> 'requested' or t.driver_id is not null then raise exception 'TRIP_NOT_AVAILABLE'; end if;
  if t.city_id <> d.city_id then raise exception 'TRIP_OUTSIDE_CITY'; end if;
  update public.trips set driver_id=auth.uid(),state='accepted',accepted_at=now()
  where id=t.id returning * into t;
  return t;
end;
$function$;

revoke all on function public.accept_trip_request(uuid) from public, anon;
grant execute on function public.accept_trip_request(uuid) to authenticated, service_role;


alter publication supabase_realtime add table public.trips;
alter publication supabase_realtime add table public.driver_locations;
alter publication supabase_realtime add table public.notifications;
