import Image from 'next/image';

export default function Dashboard() {
    return (
        <div className="flex h-screen bg-background overflow-hidden">
            <div className="bg-glow" />

            {/* Sidebar */}
            <aside className="w-64 glass border-r border-white/5 flex flex-col h-full z-20">
                <div className="p-6 flex items-center gap-3 border-b border-white/5">
                    <Image src="/logo.png" alt="Logo" width={28} height={28} />
                    <span className="font-bold text-lg tracking-tight text-white">FluxVine</span>
                </div>

                <nav className="flex-1 p-4 space-y-2 mt-4">
                    {[
                        { name: 'Overview', icon: '🏠', active: true },
                        { name: 'AI Skills', icon: '⚡', active: false },
                        { name: 'Connected Stores', icon: '🛒', active: false },
                        { name: 'Usage & Billing', icon: '💳', active: false },
                        { name: 'Team', icon: '👥', active: false },
                    ].map((item, i) => (
                        <button key={i} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${item.active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                            <span className="text-lg">{item.icon}</span>
                            {item.name}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-4 rounded-xl border border-primary/20">
                        <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">Free Plan</p>
                        <p className="text-sm text-white font-medium mb-3">15 / 50 Credits</p>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-primary h-full w-[30%]" />
                        </div>
                    </div>
                </div>

                <div className="p-4 flex items-center gap-3 border-t border-white/5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">Admin Pilot</p>
                        <p className="text-xs text-slate-500 truncate">Hobby Plan</p>
                    </div>
                    <button className="text-slate-500 hover:text-white">⚙️</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 relative z-10">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <header className="flex justify-between items-end mb-10">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back!</h1>
                            <p className="text-slate-400 text-sm">Everything is running smoothly on fluxvine.vercel.app</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 glass rounded-lg text-sm font-medium text-white hover:border-primary/50 transition-all">
                                Export Data
                            </button>
                            <button className="px-4 py-2 bg-primary text-slate-950 rounded-lg text-sm font-bold btn-glow">
                                New Automation
                            </button>
                        </div>
                    </header>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                        {[
                            { label: 'Weekly AI Calls', value: '1,284', trend: '+12%', color: 'text-primary' },
                            { label: 'Time Saved (Hrs)', value: '42.5', trend: '+5.2%', color: 'text-accent' },
                            { label: 'Active Webhooks', value: '8', trend: 'Stable', color: 'text-secondary' },
                            { label: 'API Success Rate', value: '99.8%', trend: 'Optimum', color: 'text-emerald-400' }
                        ].map((stat, i) => (
                            <div key={i} className="glass p-6 rounded-2xl border border-white/5">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{stat.label}</p>
                                <div className="flex items-baseline justify-between">
                                    <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                                    <span className="text-[10px] font-bold py-0.5 px-2 rounded-full bg-white/5 text-slate-400">{stat.trend}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Skill Center Section */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Active AI Agents</h2>
                            <button className="text-primary text-sm font-bold hover:underline">View All Skills</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    name: "Shopify Copilot",
                                    status: "Online",
                                    desc: "Writes premium product descriptions for North America.",
                                    badge: "Most Used",
                                    icon: "🛍️"
                                },
                                {
                                    name: "SEO Optimizer",
                                    status: "Online",
                                    desc: "Automates meta tags, alt text, and keyword density.",
                                    badge: "New",
                                    icon: "🔍"
                                },
                                {
                                    name: "Media Master",
                                    status: "Pausing",
                                    desc: "Bulk image processing and lifestyle scene generation.",
                                    badge: "Beta",
                                    icon: "📸"
                                }
                            ].map((skill, i) => (
                                <div key={i} className="glass p-6 rounded-2xl border border-white/5 hover:border-primary/20 transition-all cursor-pointer group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                            {skill.icon}
                                        </div>
                                        <span className={`text-[10px] font-extrabold px-2 py-1 rounded-md uppercase tracking-tighter ${skill.badge === 'Most Used' ? 'bg-primary/20 text-primary' : 'bg-slate-800 text-slate-400'}`}>
                                            {skill.badge}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">{skill.name}</h3>
                                    <p className="text-slate-500 text-xs leading-relaxed mb-6">
                                        {skill.desc}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${skill.status === 'Online' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{skill.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
