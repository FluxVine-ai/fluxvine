import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
    const supabase = await createClient();

    // 1. 获取用户信息
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // 2. 如果没登录，重定向到登录页
    if (authError || !user) {
        redirect('/login');
    }

    // 3. 获取用户 Profile（包含积分）
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    const credits = profile?.credits ?? 0;
    const fullName = profile?.full_name || user.email?.split('@')[0] || 'User';
    const plan = (profile?.plan || 'Free').toUpperCase();

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
                    ].map((item, i) => (
                        <button key={i} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${item.active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                            <span className="text-lg">{item.icon}</span>
                            {item.name}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-4 rounded-xl border border-primary/20 text-center">
                        <p className="text-[10px] font-bold text-primary mb-1 tracking-widest uppercase">{plan} PLAN</p>
                        <p className="text-lg text-white font-bold mb-3">{credits} <span className="text-xs text-slate-400 font-normal">/ 50 Credits</span></p>
                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-2">
                            <div
                                className="bg-primary h-full transition-all duration-1000"
                                style={{ width: `${(credits / 50) * 100}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-slate-500">Refills on next billing cycle</p>
                    </div>
                </div>

                <div className="p-4 flex items-center gap-3 border-t border-white/5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent active:scale-95 transition-all cursor-pointer" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate capitalize">{fullName}</p>
                        <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                    </div>
                    <Link href="/api/auth/signout" className="text-slate-500 hover:text-white transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-12 relative z-10">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <header className="flex justify-between items-end mb-16">
                        <div>
                            <p className="text-primary font-bold text-xs tracking-widest uppercase mb-2">FluxVine Dashboard</p>
                            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Welcome, {fullName.split(' ')[0]}!</h1>
                            <p className="text-slate-400 text-sm">Everything is running smoothly for your North American Shopify stores.</p>
                        </div>
                        <div className="flex gap-4">
                            <button className="px-6 py-2.5 glass rounded-xl text-sm font-bold text-white hover:border-primary/50 transition-all">
                                Export Reports
                            </button>
                            <button className="px-6 py-2.5 bg-primary text-slate-950 rounded-xl text-sm font-extrabold btn-glow">
                                + New Skill
                            </button>
                        </div>
                    </header>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
                        {[
                            { label: 'Weekly AI Calls', value: '1,284', trend: '+12%', color: 'text-primary' },
                            { label: 'Time Saved (Hrs)', value: '42.5', trend: '+5.2%', color: 'text-accent' },
                            { label: 'Cloud Logic', value: 'Active', trend: 'Stable', color: 'text-emerald-400' },
                            { label: 'Active Store', value: 'Shopify US', trend: 'Optimum', color: 'text-secondary' }
                        ].map((stat, i) => (
                            <div key={i} className="glass p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all">
                                <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-4">{stat.label}</p>
                                <div className="flex items-baseline justify-between">
                                    <span className={`text-3xl font-extrabold tracking-tight ${stat.color}`}>{stat.value}</span>
                                    <span className="text-[10px] font-bold py-1 px-2.5 rounded-lg bg-white/5 text-slate-400">{stat.trend}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Skill Center Section */}
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Active AI Agents</h2>
                            <button className="text-primary text-sm font-bold hover:underline">Skills Marketplace →</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    name: "Shopify US Copywriter",
                                    status: "Online",
                                    desc: "Writes long-form, high-converting product descriptions in American English.",
                                    badge: "Active",
                                    icon: "🇺🇸"
                                },
                                {
                                    name: "Automated SEO Pro",
                                    status: "Online",
                                    desc: "Analyzes meta tags, alt text and competition for maximum ranking.",
                                    badge: "Beta",
                                    icon: "🔍"
                                },
                                {
                                    name: "Pinterest Designer",
                                    status: "Paused",
                                    desc: "Bulk image processing and viral lifestyle scene generation.",
                                    badge: "Pro",
                                    icon: "🎨"
                                }
                            ].map((skill, i) => (
                                <div key={i} className="glass p-8 rounded-3xl border border-white/5 hover:border-primary/20 transition-all cursor-pointer group">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                                            {skill.icon}
                                        </div>
                                        <span className={`text-[10px] font-extrabold px-3 py-1.5 rounded-xl uppercase tracking-tighter ${skill.badge === 'Active' ? 'bg-primary/20 text-primary' : 'bg-slate-800 text-slate-400'}`}>
                                            {skill.badge}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{skill.name}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                        {skill.desc}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${skill.status === 'Online' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{skill.status}</span>
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
