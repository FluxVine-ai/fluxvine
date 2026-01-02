import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="bg-glow" />

      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="FluxVine Logo"
              width={32}
              height={32}
              className="rounded-lg shadow-lg shadow-primary/20"
            />
            <span className="text-xl font-bold tracking-tight text-white">FluxVine</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-foreground/60 hover:text-primary transition-colors">Features</a>
            <a href="#skills" className="text-sm text-foreground/60 hover:text-primary transition-colors">Skills</a>
            <a href="https://github.com/fluxvine" className="text-sm text-foreground/60 hover:text-primary transition-colors">GitHub</a>
          </div>
          <button className="rounded-full bg-primary/10 px-5 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-all border border-primary/20">
            Launch App
          </button>
        </div>
      </nav>

      <main className="relative pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-6">
          {/* Hero Section */}
          <section className="flex flex-col items-center text-center py-20 lg:py-32">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Now powered by Flux 1.1 + Agentic Workflows
            </div>

            <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl mb-6">
              Flow like data, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">grow like vines.</span>
            </h1>

            <p className="max-w-2xl text-lg text-foreground/60 mb-10 leading-relaxed">
              The ultimate AI-powered efficiency ecosystem for eCommerce and beyond.
              Stop trading your time for repetitive tasks—let FluxVine automate it.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a href="#" className="flex h-14 items-center justify-center rounded-xl bg-primary px-8 text-base font-bold text-background hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
                Get Chrome Extension
              </a>
              <a href="#" className="flex h-14 items-center justify-center rounded-xl border border-white/10 glass px-8 text-base font-bold hover:bg-white/5 transition-all">
                Explore Library
              </a>
            </div>

            {/* Visual Teaser */}
            <div className="mt-24 w-full max-w-5xl rounded-2xl border border-white/10 glass p-4 aspect-video shadow-2xl overflow-hidden group">
              <div className="w-full h-full bg-secondary/50 rounded-xl border border-white/5 flex items-center justify-center text-foreground/20 italic group-hover:bg-secondary/70 transition-colors">
                [ FluxVine Visual Preview: Agentic Flow in Action ]
              </div>
            </div>
          </section>

          {/* Quick Features */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-20 border-t border-white/5">
            <div className="p-8 rounded-2xl glass border border-white/5">
              <h3 className="text-xl font-bold mb-4 text-primary">0-Click Efficiency</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                Seamlessly integrates into your browser. Automate Shopify listings, email marketing, and product research without leaving the tab.
              </p>
            </div>
            <div className="p-8 rounded-2xl glass border border-white/5">
              <h3 className="text-xl font-bold mb-4 text-primary">Skill Intelligence</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                Access a massive library of verified AI Skills. Every skill is optimized for production-grade output and pixel-perfect results.
              </p>
            </div>
            <div className="p-8 rounded-2xl glass border border-white/5">
              <h3 className="text-xl font-bold mb-4 text-primary">Agentic DNA</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                Not just a wrapper. FluxVine understands context and executes multi-step workflows across different platforms automatically.
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-sm text-foreground/40 space-y-2">
            <div className="font-bold text-foreground/60">FluxVine.com</div>
            <div>© 2026 FluxVine. All rights reserved.</div>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-sm text-foreground/40 hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="text-sm text-foreground/40 hover:text-primary transition-colors">Terms</a>
            <a href="https://x.com/fluxvine" className="text-sm text-foreground/40 hover:text-primary transition-colors">X (Twitter)</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
