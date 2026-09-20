-- Permanent customer signup hardening.
-- Fixes phone validation without regex escaping ambiguity and avoids swallowing unrelated DB errors.

alter table public.profiles drop constraint if exists profiles_phone_check;

alter table public.profiles add constraint profiles_phone_check check (
  phone is null or (
    length(phone)=13
    and phone like '+2519%'
    and translate(substring(phone from 6), '0123456789', '')=''
  )
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path=public
as $function$
declare
  normalized_phone text;
  default_city uuid;
begin
  normalized_phone := nullif(trim(new.raw_user_meta_data->>'phone'), '');

  if normalized_phone is not null then
    normalized_phone := regexp_replace(normalized_phone, '[^0-9+]', '', 'g');

    if length(normalized_phone)=10 and left(normalized_phone,2)='09' then
      normalized_phone := '+251' || substring(normalized_phone from 2);
    elsif length(normalized_phone)=9 and left(normalized_phone,1)='9' then
      normalized_phone := '+251' || normalized_phone;
    end if;

    if not (
      length(normalized_phone)=13
      and normalized_phone like '+2519%'
      and translate(substring(normalized_phone from 6),'0123456789','')=''
    ) then
      normalized_phone := null;
    end if;
  end if;

  select id into default_city
  from public.cities
  where country_code='ET' and is_active
  order by created_at
  limit 1;

  insert into public.profiles(id,city_id,full_name,phone,role,account_status)
  values (
    new.id,
    default_city,
    nullif(trim(new.raw_user_meta_data->>'full_name'),''),
    normalized_phone,
    'customer',
    'active'
  )
  on conflict do nothing;

  return new;
end;
$function$;

revoke all on function public.handle_new_user() from public,anon,authenticated;
grant execute on function public.handle_new_user() to postgres,service_role;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
