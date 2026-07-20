export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-neutral-500 mb-6">
          Art Intelligence Platform
        </p>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6">
          Art<span className="text-neutral-400">Period</span>
        </h1>
        <p className="text-lg md:text-xl text-neutral-400 max-w-xl mb-10">
          Discover, track, and collect fine art with intelligence.
          Built for collectors who move fast and think deeper.
        </p>
        <div className="flex gap-4">
          <a
            href="#"
            className="px-8 py-3 bg-white text-black text-sm font-semibold rounded-full hover:bg-neutral-200 transition"
          >
            Get Early Access
          </a>
          <a
            href="#"
            className="px-8 py-3 border border-neutral-700 text-white text-sm font-semibold rounded-full hover:border-neutral-400 transition"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Feature grid */}
      <section className="max-w-5xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: 'Discover',
            desc: 'Surface emerging artists and undervalued works before the market catches on.',
          },
          {
            title: 'Track',
            desc: 'Follow artists, galleries, and auction results in real time across every major platform.',
          },
          {
            title: 'Collect',
            desc: 'Build and manage your collection with provenance tracking and valuation intelligence.',
          },
        ].map((f) => (
          <div key={f.title} className="border border-neutral-800 rounded-2xl p-8 hover:border-neutral-600 transition">
            <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  )
}
