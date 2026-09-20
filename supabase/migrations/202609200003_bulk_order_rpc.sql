create or replace function public.create_bulk_order(
  p_item_type text,
  p_quantity integer,
  p_lat double precision,
  p_lng double precision,
  p_needed_by date,
  p_photo_path text default null,
  p_delivery_label text default null
) returns public.bulk_orders
language plpgsql security invoker set search_path=public
as $$
declare v_city uuid; v_order public.bulk_orders;
begin
  if auth.uid() is null or public.current_role() <> 'customer' then raise exception 'Unauthorized'; end if;
  if p_quantity <= 0 then raise exception 'Quantity must be positive'; end if;
  if p_needed_by < current_date then raise exception 'Needed-by date cannot be in the past'; end if;
  select city_id into v_city from public.profiles where id=auth.uid();
  if v_city is null then raise exception 'Customer city is not configured'; end if;
  insert into public.bulk_orders(city_id,customer_id,item_type,quantity,photo_path,delivery_location,delivery_label,needed_by)
  values(v_city,auth.uid(),left(trim(p_item_type),200),p_quantity,p_photo_path,st_setsrid(st_makepoint(p_lng,p_lat),4326)::geography,p_delivery_label,p_needed_by)
  returning * into v_order;
  return v_order;
end;
$$;
grant execute on function public.create_bulk_order(text,integer,double precision,double precision,date,text,text) to authenticated;
