'use client';

import Link from 'next/link';
import {useEffect,useState} from 'react';

const services=[
  {n:'01',title:'Move',copy:'A better way across the city.',detail:'Request a ride, see your trip clearly, and move with confidence.',mark:'↗'},
  {n:'02',title:'Deliver',copy:'From doorstep to doorstep.',detail:'Food, packages, groceries and everyday essentials — in one flow.',mark:'→'},
  {n:'03',title:'Order',copy:'Business, without the friction.',detail:'Connect businesses with suppliers and keep orders moving.',mark:'＋'},
];

export default function HomePage(){
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{const on=()=>setScrolled(window.scrollY>24);window.addEventListener('scroll',on);return()=>window.removeEventListener('scroll',on)},[]);
  return <main className="marketing">
    <nav className={scrolled?'nav nav-scrolled':'nav'}>
      <Link href="/" className="brand"><span className="brand-mark">D</span><span>DRIVER<span>SUPERAPP</span></span></Link>
      <div className="nav-links"><a href="#services">Services</a><a href="#about">For business</a></div>
      <div className="nav-actions"><Link href="/preview" className="nav-login">Sign in</Link><Link href="/sign-up" className="nav-cta">Get started <span>↗</span></Link></div>
    </nav>

    <section className="hero">
      <div className="hero-grid" aria-hidden="true"></div>
      <div className="hero-orbit orbit-one"></div><div className="hero-orbit orbit-two"></div>
      <div className="hero-content">
        <div className="eyebrow"><span className="live-dot"></span> BUILT FOR ETHIOPIA · STARTING IN ADDIS ABABA</div>
        <h1>Move the city.<br/><em>Move forward.</em></h1>
        <p className="hero-copy">One beautifully simple platform for rides, deliveries and business orders — designed around how Ethiopia moves.</p>
        <div className="hero-actions"><Link href="/sign-up" className="hero-primary">Create your account <span>↗</span></Link><a href="#services" className="hero-secondary">Explore the platform <span>↓</span></a></div>
        <div className="hero-meta"><span>01 / 03</span><span className="meta-line"></span><span>Mobility · Delivery · Commerce</span></div>
      </div>
      <div className="hero-visual" aria-hidden="true">
        <div className="phone-shadow"></div>
        <div className="phone">
          <div className="phone-top"><span>9:41</span><span>● ● ●</span></div>
          <div className="map"><div className="map-road r1"></div><div className="map-road r2"></div><div className="pin">D</div><div className="map-label">ADDIS ABABA</div></div>
          <div className="ride-card"><div><small>YOUR RIDE</small><strong>Arriving in 3 min</strong></div><span className="mini-arrow">↗</span></div>
          <div className="driver-row"><div className="avatar">M</div><div><strong>Mohammed</strong><small> Toyota Corolla · ★ 4.9</small></div><span>›</span></div>
        </div>
      </div>
    </section>

    <section className="ticker"><div>RIDES <i>✦</i> DELIVERY <i>✦</i> BUSINESS <i>✦</i> ETHIOPIA <i>✦</i> RIDES <i>✦</i> DELIVERY <i>✦</i> BUSINESS <i>✦</i></div></section>

    <section id="services" className="services section-pad">
      <div className="section-head"><div><p className="eyebrow dark">THE PLATFORM</p><h2>Everything that moves,<br/><em>in one place.</em></h2></div><p>One account. One experience. Multiple ways to get things done — without the usual friction.</p></div>
      <div className="service-grid">{services.map(s=><article className="service-card" key={s.title}><span className="service-num">{s.n}</span><div className="service-mark">{s.mark}</div><h3>{s.title}</h3><h4>{s.copy}</h4><p>{s.detail}</p><a href="/sign-up">Explore <span>↗</span></a></article>)}</div>
    </section>

    <section id="about" className="statement"><div className="statement-inner"><p className="eyebrow dark">MADE HERE · MADE FOR HERE</p><h2>Local infrastructure.<br/><em>Global ambition.</em></h2><p>We are building the everyday digital layer for movement and commerce in Ethiopia — with a product experience that feels at home, from the first tap to the final delivery.</p><Link href="/sign-up">Join the platform <span>↗</span></Link></div></section>

    <footer><div className="brand footer-brand"><span className="brand-mark">D</span><span>DRIVER<span>SUPERAPP</span></span></div><p>Mobility · Delivery · Commerce</p><div><Link href="/preview">Sign in</Link><Link href="/sign-up">Create account</Link></div><small>© 2026 Driver SuperApp</small></footer>
  </main>
}