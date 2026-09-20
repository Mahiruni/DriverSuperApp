'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {createClient} from '../../lib/supabase/client';

function normalizeEthiopianPhone(value:string){
  const digits=value.trim().replace(/[^0-9+]/g,'');
  if(/^09[0-9]{8}$/.test(digits)) return '+251'+digits.slice(1);
  if(/^9[0-9]{8}$/.test(digits)) return '+251'+digits;
  if(/^\+2519[0-9]{8}$/.test(digits)) return digits;
  return '';
}

export default function SignUp() {
  const router=useRouter();
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [phone,setPhone]=useState('');
  const [password,setPassword]=useState('');
  const [confirm,setConfirm]=useState('');
  const [msg,setMsg]=useState('');
  const [busy,setBusy]=useState(false);

  async function submit(e:React.FormEvent){
    e.preventDefault();
    setMsg('');
    if(password.length < 8){ setMsg('Password must be at least 8 characters.'); return; }
    if(password !== confirm){ setMsg('Passwords do not match.'); return; }

    const normalizedPhone=normalizeEthiopianPhone(phone);
    if(phone.trim() && !normalizedPhone){
      setMsg('Enter a valid Ethiopian phone number, for example +251912345678.');
      return;
    }

    setBusy(true);
    try {
      const supabase=createClient();
      const metadata:{full_name:string;phone?:string}={full_name:name.trim()};
      if(normalizedPhone) metadata.phone=normalizedPhone;

      const {data,error}=await supabase.auth.signUp({
        email:email.trim().toLowerCase(),
        password,
        options:{data:metadata}
      });

      if(error){ setMsg(error.message); return; }
      if(data.session){
        router.replace('/dashboard');
        router.refresh();
        return;
      }
      setMsg('Account created. Check your email to verify your account, then sign in.');
    } catch {
      setMsg('We could not create your account right now. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen grid place-items-center bg-slate-50 px-6 py-10">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-sm font-black tracking-[.18em] text-teal-700">DRIVER SUPERAPP</div>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Create your account</h1>
        <p className="mt-2 text-slate-500">Create a customer account to get started.</p>
        <div className="mt-7 space-y-4">
          <input required value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="w-full min-h-12 rounded-xl border px-4 outline-none focus:ring-2 focus:ring-teal-600"/>
          <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" className="w-full min-h-12 rounded-xl border px-4 outline-none focus:ring-2 focus:ring-teal-600"/>
          <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone (optional) +2519XXXXXXXX" className="w-full min-h-12 rounded-xl border px-4 outline-none focus:ring-2 focus:ring-teal-600"/>
          <input required minLength={8} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password (8+ characters)" className="w-full min-h-12 rounded-xl border px-4 outline-none focus:ring-2 focus:ring-teal-600"/>
          <input required minLength={8} type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Confirm password" className="w-full min-h-12 rounded-xl border px-4 outline-none focus:ring-2 focus:ring-teal-600"/>
          <button disabled={busy} className="w-full min-h-12 rounded-xl bg-slate-950 text-white font-bold disabled:opacity-50">{busy?'Creating account…':'Create account'}</button>
          {msg && <p role="alert" className="text-sm font-semibold text-slate-600">{msg}</p>}
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">Already have an account? <Link href="/login" className="font-bold text-slate-950 hover:underline">Sign in</Link></p>
      </form>
    </main>
  );
}