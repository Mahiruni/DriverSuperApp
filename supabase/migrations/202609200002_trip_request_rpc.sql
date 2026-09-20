create or replace function public.create_trip_request(
  p_service_type text,
  p_pickup_lat double precision,
  p_pickup_lng double precision,
  p_destination_lat double precision,
  p_destination_lng double precision,
  p_pickup_label text default null,
  p_destination_label text default null,
  p_distance_m integer default 0,
  p_duration_s integer default 0,
  p_promo_code text default null
) returns public.trips
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_city uuid;
  v_config public.fare_configs;
  v_promo public.promo_codes;
  v_base bigint;
  v_distance bigint;
  v_time bigint;
  v_subtotal bigint;
  v_discount bigint := 0;
  v_total bigint;
  v_trip public.trips;
begin
  if auth.uid() is null or public.current_role() <> 'customer' then raise exception 'Unauthorized'; end if;
  if p_service_type not in ('taxi','delivery') then raise exception 'Invalid service type'; end if;
  if p_distance_m < 0 or p_duration_s < 0 then raise exception 'Invalid route estimate'; end if;

  select city_id into v_city from public.profiles where id=auth.uid();
  if v_city is null then raise exception 'Customer city is not configured'; end if;

  select * into v_config from public.fare_configs
  where city_id=v_city and service_type=p_service_type and is_active=true
    and effective_from <= now() and (effective_to is null or effective_to > now())
  order by effective_from desc limit 1;
  if not found then raise exception 'Fare configuration unavailable'; end if;

  v_base := v_config.base_minor;
  v_distance := round((p_distance_m::numeric / 1000) * v_config.per_km_minor);
  v_time := round((p_duration_s::numeric / 60) * v_config.per_minute_minor);
  v_subtotal := greatest(v_config.minimum_fare_minor, v_base + v_distance + v_time);

  if p_promo_code is not null and length(trim(p_promo_code)) > 0 then
    select * into v_promo from public.promo_codes
    where city_id=v_city and upper(code)=upper(trim(p_promo_code)) and is_active=true
      and starts_at <= now() and (ends_at is null or ends_at > now())
      and (usage_limit is null or usage_count < usage_limit)
    limit 1;
    if not found then raise exception 'Invalid or expired promo code'; end if;
    if v_promo.kind='fixed' then v_discount := least(v_subtotal, coalesce(v_promo.value_minor,0));
    else v_discount := floor(v_subtotal * least(100,greatest(0,coalesce(v_promo.percentage,0))) / 100);
      v_discount := least(v_discount, coalesce(v_promo.max_discount_minor, v_discount));
    end if;
  end if;

  v_total := greatest(0, v_subtotal - v_discount);
  insert into public.trips(city_id,customer_id,service_type,pickup,destination,pickup_label,destination_label,estimated_distance_m,estimated_duration_s,fare_base_minor,fare_distance_minor,fare_time_minor,promo_discount_minor,total_minor,promo_code_id)
  values(v_city,auth.uid(),p_service_type,st_setsrid(st_makepoint(p_pickup_lng,p_pickup_lat),4326)::geography,st_setsrid(st_makepoint(p_destination_lng,p_destination_lat),4326)::geography,p_pickup_label,p_destination_label,p_distance_m,p_duration_s,v_base,v_distance,v_time,v_discount,v_total,v_promo.id)
  returning * into v_trip;
  return v_trip;
end;
$$;

grant execute on function public.create_trip_request(text,double precision,double precision,double precision,double precision,text,text,integer,integer,text) to authenticated;

create policy drivers_trip_customer_select on public.drivers for select to authenticated
using (exists (select 1 from public.trips t where t.driver_id=drivers.id and t.customer_id=auth.uid()));

alter table public.trips replica identity full;
alter table public.drivers replica identity full;
