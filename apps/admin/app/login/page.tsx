'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {createClient} from '../../lib/supabase/client';

export default function Login(){
  const router=useRouter();
  const[email,setEmail]=useState('');
  const[password,setPassword]=useState('');
  const[msg,setMsg]=useState('');
  const[busy,setBusy]=useState(false);

  async function submit(e:React.FormEvent){
    e.preventDefault();
    setBusy(true);
    setMsg('');
    const supabase=createClient();
    try {
      const{data,error}=await supabase.auth.signInWithPassword({
        email:email.trim().toLowerCase(),
        password
      });
      if(error){ setMsg(error.message); return; }
      if(!data.session||!data.user){
        setMsg('Sign in did not create an active session. Please try again.');
        return;
      }

      if(!data.user.email_confirmed_at){
        sessionStorage.setItem('driver-superapp:verification-email', data.user.email ?? email.trim().toLowerCase());
        await supabase.auth.signInWithOtp({email:data.user.email ?? email.trim().toLowerCase(), options:{shouldCreateUser:false}});
        router.replace('/verify-email');
        router.refresh();
        return;
      }

      const{data:profile,error:profileError}=await supabase
        .from('profiles')
        .select('role,account_status')
        .eq('id',data.user.id)
        .maybeSingle();

      if(profileError){
        setMsg('Signed in, but we could not load your account. Please try again.');
        return;
      }

      if(profile?.role==='admin'&&profile.account_status==='active'){
        router.replace('/admin');
      }else{
        router.replace('/dashboard');
      }
      router.refresh();
    } catch {
      setMsg('We could not sign you in right now. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return <main className="min-h-screen grid place-items-center p-6 bg-slate-50">
    <form onSubmit={submit} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
      <div className="text-sm font-black tracking-[.18em] text-teal-700">DRIVER SUPERAPP</div>
      <h1 className="mt-2 text-3xl font-black text-slate-950">Welcome back</h1>
      <p className="mt-2 text-slate-500">Sign in to continue.</p>
      <div className="mt-7 space-y-4">
        <input aria-label="Email" required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full min-h-12 rounded-xl border px-4 outline-none focus:ring-2 focus:ring-teal-600"/>
        <input aria-label="Password" required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full min-h-12 rounded-xl border px-4 outline-none focus:ring-2 focus:ring-teal-600"/>
        <button disabled={busy} className="w-full min-h-12 rounded-xl bg-slate-950 text-white font-bold disabled:opacity-50">{busy?'Signing in…':'Sign in'}</button>
        {msg&&<p role="alert" className="text-sm font-semibold text-red-600">{msg}</p>}
      </div>
      <p className="mt-6 text-center text-sm text-slate-500">New to Driver SuperApp? <Link href="/sign-up" className="font-bold text-slate-950 hover:underline">Create account</Link></p>
    </form>
  </main>
}