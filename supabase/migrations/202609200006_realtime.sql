do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='trips') then execute 'alter publication supabase_realtime add table public.trips'; end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='drivers') then execute 'alter publication supabase_realtime add table public.drivers'; end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='shared_rides') then execute 'alter publication supabase_realtime add table public.shared_rides'; end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='notifications') then execute 'alter publication supabase_realtime add table public.notifications'; end if;
end $$;
