import {redirect} from 'next/navigation';
import {createClient} from '../lib/supabase/server';

export default async function CustomerDashboard(){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect('/login');
  if(!user.email_confirmed_at) redirect('/verify-email');

  const {data:profile}=await supabase
    .from('profiles')
    .select('full_name,phone,role,account_status')
    .eq('id',user.id)
    .maybeSingle();

  if(!profile||profile.account_status!=='active') redirect('/login');

  return <main className="min-h-screen bg-slate-50">
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <div>
          <div className="text-xs font-black tracking-[.18em] text-teal-700">DRIVER SUPERAPP</div>
          <h1 className="mt-1 text-2xl font-black text-slate-950">Your dashboard</h1>
        </div>
        <div className="text-right">
          <div className="font-bold text-slate-950">{profile.full_name||profile.phone||'Customer'}</div>
          <div className="text-xs uppercase tracking-wider text-slate-500">{profile.role}</div>
        </div>
      </div>
    </header>
    <section className="mx-auto max-w-6xl px-5 py-8">
      <div className="rounded-3xl bg-slate-950 p-7 text-white md:p-10">
        <div className="max-w-2xl">
          <p className="text-sm font-bold text-teal-300">WELCOME BACK</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight md:text-5xl">Where are you going today?</h2>
          <p className="mt-4 max-w-xl text-slate-300">Your account is active. Ride booking and your trip history are ready to connect here.</p>
          <a href="/trip" className="mt-7 inline-flex min-h-12 items-center rounded-xl bg-white px-5 font-bold text-slate-950">Book a ride</a>
        </div>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5"><div className="text-sm text-slate-500">Account</div><div className="mt-2 text-xl font-black">Active</div></div>
        <div className="rounded-2xl border bg-white p-5"><div className="text-sm text-slate-500">Service</div><div className="mt-2 text-xl font-black">Ride</div></div>
        <div className="rounded-2xl border bg-white p-5"><div className="text-sm text-slate-500">Phone</div><div className="mt-2 text-xl font-black">{profile.phone||'Not added'}</div></div>
      </div>
    </section>
  </main>;
}
