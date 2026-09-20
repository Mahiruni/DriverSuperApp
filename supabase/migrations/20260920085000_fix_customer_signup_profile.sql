-- Keep customer signup independent from optional phone/profile validation.
alter table public.profiles
  alter column phone drop not null;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_phone text;
begin
  normalized_phone := nullif(trim(new.raw_user_meta_data->>'phone'), '');

  if normalized_phone is not null then
    normalized_phone := regexp_replace(normalized_phone, '[^0-9+]', '', 'g');

    if normalized_phone ~ '^09[0-9]{8}$' then
      normalized_phone := '+251' || substring(normalized_phone from 2);
    elsif normalized_phone ~ '^9[0-9]{8}$' then
      normalized_phone := '+251' || normalized_phone;
    end if;

    if normalized_phone !~ '^\+2519[0-9]{8}$' then
      normalized_phone := null;
    end if;
  end if;

  insert into public.profiles (id, full_name, phone, role, account_status)
  values (
    new.id,
    nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
    normalized_phone,
    'customer',
    'active'
  )
  on conflict (id) do nothing;

  return new;
exception
  when unique_violation then
    insert into public.profiles (id, full_name, phone, role, account_status)
    values (
      new.id,
      nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
      null,
      'customer',
      'active'
    )
    on conflict (id) do nothing;
    return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.handle_new_user() to postgres, service_role;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
