-- Authorization comes from app_metadata/JWT, never user-editable user_metadata.
create or replace function public.current_role() returns public.app_role
language sql stable security invoker set search_path = public
as $$
  select case coalesce(auth.jwt()->'app_metadata'->>'role','customer')
    when 'driver' then 'driver'::public.app_role
    when 'supplier' then 'supplier'::public.app_role
    when 'admin' then 'admin'::public.app_role
    else 'customer'::public.app_role
  end
$$;
