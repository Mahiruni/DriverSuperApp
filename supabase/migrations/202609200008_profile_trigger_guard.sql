create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.phone is null then return new; end if;
  insert into public.profiles (id, city_id, role, phone)
  values (new.id,(select id from public.cities where name='Addis Ababa' limit 1),'customer',new.phone)
  on conflict (id) do nothing;
  return new;
end;
$$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
