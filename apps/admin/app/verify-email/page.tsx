'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect, useRef, useState} from 'react';
import {createClient} from '../../lib/supabase/client';

const CODE_LENGTH=6;
const COOLDOWN_SECONDS=45;

function maskEmail(email:string){
  const [name,domain]=email.split('@');
  if(!name||!domain) return email;
  const visible=name.length>2?name.slice(0,1):name.slice(0,1);
  return visible+'***@'+domain;
}

export default function VerifyEmail(){
  const router=useRouter();
  const inputs=useRef<Array<HTMLInputElement|null>>([]);
  const [email,setEmail]=useState('');
  const [digits,setDigits]=useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [cooldown,setCooldown]=useState(COOLDOWN_SECONDS);
  const [status,setStatus]=useState<'idle'|'checking'|'success'|'error'>('idle');
  const [message,setMessage]=useState('');
  const [mounted,setMounted]=useState(false);

  useEffect(()=>{
    const saved=sessionStorage.getItem('driver-superapp:verification-email');
    if(!saved){ router.replace('/sign-up'); return; }
    setEmail(saved);
    setMounted(true);
    requestAnimationFrame(()=>inputs.current[0]?.focus());
  },[router]);

  useEffect(()=>{
    if(cooldown<=0) return;
    const timer=window.setInterval(()=>setCooldown(v=>Math.max(0,v-1)),1000);
    return()=>window.clearInterval(timer);
  },[cooldown]);

  async function verify(code:string){
    if(code.length!==CODE_LENGTH || status==='checking') return;
    setStatus('checking');
    setMessage('');
    const supabase=createClient();
    const {data,error}=await supabase.auth.verifyOtp({email,token:code,type:'email'});
    if(error || !data.session){
      setStatus('error');
      setMessage(error?.message?.toLowerCase().includes('expired')
        ? 'That code has expired. Please request a new one.'
        : "That code doesn't match. Please try again or request a new one.");
      setDigits(Array(CODE_LENGTH).fill(''));
      requestAnimationFrame(()=>inputs.current[0]?.focus());
      return;
    }
    setStatus('success');
    setMessage('Email verified');
    sessionStorage.removeItem('driver-superapp:verification-email');
    window.setTimeout(()=>{ router.replace('/dashboard'); router.refresh(); },420);
  }

  function updateDigit(index:number,value:string){
    const clean=value.replace(/\D/g,'');
    if(!clean) {
      setDigits(prev=>{const next=[...prev];next[index]='';return next;});
      return;
    }
    if(clean.length>1){
      const pasted=clean.slice(0,CODE_LENGTH).split('');
      setDigits(pasted.concat(Array(CODE_LENGTH-pasted.length).fill('')));
      const focusIndex=Math.min(pasted.length,CODE_LENGTH-1);
      requestAnimationFrame(()=>inputs.current[focusIndex]?.focus());
      if(pasted.length===CODE_LENGTH) void verify(pasted.join(''));
      return;
    }
    setDigits(prev=>{const next=[...prev];next[index]=clean;return next;});
    if(index<CODE_LENGTH-1) inputs.current[index+1]?.focus();
    else void verify([...digits.slice(0,index),clean,...digits.slice(index+1)].join(''));
  }

  function onKeyDown(index:number,e:React.KeyboardEvent<HTMLInputElement>){
    if(e.key==='Backspace' && !digits[index] && index>0) inputs.current[index-1]?.focus();
    if(e.key==='ArrowLeft' && index>0) inputs.current[index-1]?.focus();
    if(e.key==='ArrowRight' && index<CODE_LENGTH-1) inputs.current[index+1]?.focus();
  }

  async function resend(){
    if(cooldown>0 || !email || status==='checking') return;
    setStatus('idle');
    setMessage('');
    const supabase=createClient();
    const {error}=await supabase.auth.signInWithOtp({email,options:{shouldCreateUser:false}});
    if(error){
      setStatus('error');
      setMessage('We could not send a new code. Please check your connection and try again.');
      return;
    }
    setDigits(Array(CODE_LENGTH).fill(''));
    setCooldown(COOLDOWN_SECONDS);
    requestAnimationFrame(()=>inputs.current[0]?.focus());
    setMessage('A new code is on its way.');
  }

  if(!mounted) return <main className="min-h-screen bg-[#f7f8f6]" />;

  return <main className="min-h-screen bg-[#f7f8f6] px-5 py-8 text-slate-950 sm:grid sm:place-items-center">
    <section className="w-full max-w-[460px]">
      <div className="mb-8 flex items-center justify-between">
        <div className="text-[11px] font-black tracking-[.22em] text-teal-700">DRIVER SUPERAPP</div>
        <div className="h-2 w-2 rounded-full bg-teal-600" aria-hidden="true"/>
      </div>

      <div className="rounded-[30px] border border-slate-200/80 bg-white p-7 shadow-[0_24px_70px_rgba(15,23,42,.08)] sm:p-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700" aria-hidden="true">
          {status==='success' ? '✓' : '✉'}
        </div>
        <h1 className="mt-7 text-[34px] font-black tracking-[-.04em] sm:text-[40px]">
          {status==='success' ? 'Email verified' : 'Check your email'}
        </h1>
        <p className="mt-3 text-[15px] leading-7 text-slate-500">
          {status==='success' ? 'Your account is confirmed. Taking you to your dashboard…' : <>We sent a 6-digit code to <strong className="font-semibold text-slate-800">{maskEmail(email)}</strong>.</>}
        </p>

        {status!=='success' && <>
          <div className="mt-9 flex justify-between gap-2 sm:gap-3" role="group" aria-label="6-digit verification code">
            {digits.map((digit,index)=><input
              key={index}
              ref={el=>{inputs.current[index]=el}}
              value={digit}
              onChange={e=>updateDigit(index,e.target.value)}
              onKeyDown={e=>onKeyDown(index,e)}
              onPaste={e=>{e.preventDefault();updateDigit(index,e.clipboardData.getData('text'))}}
              inputMode="numeric"
              autoComplete={index===0?'one-time-code':'off'}
              maxLength={6}
              aria-label={'Verification code digit '+(index+1)+' of 6'}
              disabled={status==='checking'}
              className="h-14 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 text-center text-2xl font-bold tracking-tight outline-none transition duration-150 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10 disabled:opacity-60 sm:h-16"
            />)}
          </div>

          <div className="mt-5 min-h-6 text-center text-sm" aria-live="polite">
            {status==='checking' && <span className="text-slate-500">Checking your code…</span>}
            {status==='error' && <span className="font-medium text-red-600">{message}</span>}
            {status==='idle' && message && <span className="font-medium text-teal-700">{message}</span>}
          </div>

          <div className="mt-5 text-center text-sm text-slate-500">
            <span>Didn't receive the code? </span>
            {cooldown>0
              ? <span>Resend in <strong className="font-semibold text-slate-800">00:{String(cooldown).padStart(2,'0')}</strong></span>
              : <button type="button" onClick={resend} className="font-bold text-slate-950 underline-offset-4 hover:underline">Resend code</button>}
          </div>
        </>}

        {status!=='success' && <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 text-center text-sm">
          <Link href="/sign-up" className="font-semibold text-slate-700 underline-offset-4 hover:text-slate-950 hover:underline">Use a different email</Link>
          <Link href="/login" className="text-slate-400 hover:text-slate-700">Back to sign in</Link>
        </div>}
      </div>

      <p className="mt-5 text-center text-xs leading-5 text-slate-400">
        It can take a minute to arrive. Check your spam or junk folder if you don't see it.
      </p>
    </section>
  </main>;
}
