import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16 lg:px-10">
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white">D</div>
            <span className="text-lg font-semibold tracking-tight">Driver Super App</span>
          </div>
          <Link href="/admin" className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold transition hover:border-slate-400">
            Admin
          </Link>
        </div>

        <div className="max-w-4xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Ethiopia • Addis Ababa</p>
          <h1 className="text-5xl font-semibold tracking-[-0.04em] sm:text-7xl">
            One app for moving, delivering, and doing business.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            Your everyday platform for rides, deliveries, marketplace ordering, and business services.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/login" className="rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800">
              Customer sign in
            </Link>
            <a href="#services" className="rounded-full border border-slate-200 px-6 py-3.5 text-sm font-semibold transition hover:border-slate-400">
              Explore services
            </a>
          </div>
        </div>

        <div id="services" className="mt-20 grid gap-4 sm:grid-cols-3">
          {[
            ['Rides', 'Request a ride and get where you need to go.'],
            ['Delivery', 'Send food, goods, and packages across the city.'],
            ['Business', 'Order and manage services for your business.'],
          ].map(([title, description]) => (
            <article key={title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-2 leading-7 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
