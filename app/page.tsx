import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <div className="bg-glow" />

      {/* 导航栏 */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="FluxVine Logo" width={32} height={32} />
            <span className="text-xl font-bold tracking-tight text-gradient">FluxVine</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#solutions" className="hover:text-primary transition-colors">Solutions</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          </div>
          <Link href="/dashboard" className="px-5 py-2 bg-primary text-slate-950 rounded-full text-sm font-bold btn-glow transition-all">
            Launch App
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 mb-6 glass rounded-full border border-primary/20 bg-primary/5">
            <span className="text-xs font-bold text-primary tracking-widest uppercase">Agentic AI for Shopify</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Flow like data,<br />
            <span className="text-gradient">Grow like vines.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            FluxVine is the ultimate AI-powered efficiency ecosystem for eCommerce.
            Stop trading your time for repetitive tasks — let FluxVine automate it.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-primary text-slate-950 rounded-xl font-bold text-lg btn-glow shadow-xl shadow-primary/20">
              Get Started Free
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 glass text-white rounded-xl font-bold text-lg hover:border-primary/50 transition-all">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful AI Skills</h2>
            <p className="text-slate-400">Everything you need to scale your eCommerce empire.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Magic Copywriter",
                desc: "Generate high-converting product descriptions in seconds for the North American market.",
                icon: "✍️"
              },
              {
                title: "Visual Agent",
                desc: "Automated background removal, scene generation, and image optimization.",
                icon: "🎨"
              },
              {
                title: "Competitor Intelligence",
                desc: "Real-time pricing analysis and trend tracking across multiple platforms.",
                icon: "📊"
              }
            ].map((f, i) => (
              <div key={i} className="p-8 glass rounded-3xl border border-white/5 hover:border-primary/30 transition-all group">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-white">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="FluxVine Logo" width={24} height={24} />
            <span className="font-bold text-gradient">FluxVine</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 FluxVine AI. Built for the future of eCommerce.
          </p>
          <div className="flex gap-6 text-slate-400 text-sm">
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">GitHub</a>
            <a href="#" className="hover:text-primary transition-colors">Updates</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
