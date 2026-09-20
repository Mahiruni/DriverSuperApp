-- `cities` is the root tenancy table, so its city_id is a self-reference used only to keep the shared tenancy contract uniform across application tables.
alter table public.cities add column if not exists city_id uuid references public.cities(id);
update public.cities set city_id=id where city_id is null;
