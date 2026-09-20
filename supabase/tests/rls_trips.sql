begin;
create extension if not exists pgtap;

select plan(3);
select has_table('public','trips','trips table exists');

-- Seed two authenticated identities for an isolated RLS integration test.
insert into auth.users(id,aud,role,email) values
('00000000-0000-0000-0000-000000000001','authenticated','authenticated','customer-a@test.local'),
('00000000-0000-0000-0000-000000000002','authenticated','authenticated','customer-b@test.local')
on conflict (id) do nothing;

insert into public.profiles(id,city_id,role,phone) values
('00000000-0000-0000-0000-000000000001',(select id from public.cities limit 1),'customer','+251911111111'),
('00000000-0000-0000-0000-000000000002',(select id from public.cities limit 1),'customer','+251922222222')
on conflict (id) do nothing;

insert into public.trips(city_id,customer_id,service_type,pickup,destination,estimated_distance_m,estimated_duration_s)
select (select id from public.cities limit 1),x,'taxi',st_setsrid(st_makepoint(38.75,8.98),4326)::geography,st_setsrid(st_makepoint(38.76,8.99),4326)::geography,1000,300
from (values ('00000000-0000-0000-0000-000000000001'::uuid),('00000000-0000-0000-0000-000000000002'::uuid)) v(x);

set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000001';

select is((select count(*)::integer from public.trips),1,'customer A sees exactly one trip');
select is((select count(*)::integer from public.trips where customer_id='00000000-0000-0000-0000-000000000002'),0,'customer A cannot read customer B trip');

select * from finish();
rollback;
