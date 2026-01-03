'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface Profile {
    credits: number;
    full_name: string;
    plan: string;
}

interface Skill {
    id: string;
    name: string;
    description: string;
    icon: string;
    pricing_type: string;
}

interface User {
    id: string;
    email?: string;
}

export default function Dashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [skills, setSkills] = useState<Skill[]>([]);

    useEffect(() => {
        const supabase = createClient();

        // 检查登录状态
        async function checkAuth() {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error || !user) {
                // 未登录，跳转到登录页
                router.push('/login');
                return;
            }

            setUser(user);

            // 获取用户 Profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            setProfile(profileData);

            // 获取技能列表
            const { data: skillsData } = await supabase
                .from('skills')
                .select('*')
                .eq('is_active', true)
                .order('name', { ascending: true });

            setSkills(skillsData || []);
            setLoading(false);
        }

        checkAuth();

        // 监听登录状态变化
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                router.push('/login');
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background text-white">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-400">加载中...</p>
                </div>
            </div>
        );
    }

    const credits = profile?.credits ?? 0;
    const fullName = profile?.full_name || user?.email?.split('@')[0] || 'User';
    const plan = (profile?.plan || 'Free').toUpperCase();

    return (
        <div className="flex h-screen bg-background overflow-hidden text-slate-100 font-sans">
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
                        { name: 'Skill Center', icon: '⚡', active: false },
                        { name: 'Cloud Logs', icon: '📊', active: false },
                        { name: 'Billing', icon: '💳', active: false },
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
                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-2 shadow-inner">
                            <div
                                className="bg-primary h-full transition-all duration-1000 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                                style={{ width: `${(credits / 50) * 100}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-slate-500">Refills on next billing cycle</p>
                    </div>
                </div>

                <div className="p-4 flex items-center gap-3 border-t border-white/5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent transition-all cursor-pointer shadow-lg active:scale-95" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate capitalize">{fullName}</p>
                        <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <Link href="/api/auth/signout" className="text-slate-500 hover:text-white transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-12 relative z-10 custom-scrollbar">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <header className="flex justify-between items-end mb-16">
                        <div>
                            <p className="text-primary font-bold text-xs tracking-widest uppercase mb-2">FluxVine AI Console</p>
                            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Active Engine Room</h1>
                            <p className="text-slate-400 text-sm">Empowering your {fullName.split(' ')[0]} eCommerce empire with 500+ logic workflows.</p>
                        </div>
                        <div className="flex gap-4">
                            <Link href="/dashboard/api-keys" className="px-6 py-2.5 glass rounded-xl text-sm font-bold text-white hover:border-primary/50 transition-all active:scale-95">
                                API Access
                            </Link>
                            <button className="px-6 py-2.5 bg-primary text-slate-950 rounded-xl text-sm font-extrabold btn-glow active:scale-95">
                                + Add Custom Skill
                            </button>
                        </div>
                    </header>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
                        {[
                            { label: 'Weekly AI Calls', value: '1,284', color: 'text-primary' },
                            { label: 'Cloud Status', value: 'Online', color: 'text-emerald-400' },
                            { label: 'Skill Latency', value: '240ms', color: 'text-accent' },
                            { label: 'Active Store', value: 'Shopify US', color: 'text-secondary' }
                        ].map((stat, i) => (
                            <div key={i} className="glass p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all shadow-sm">
                                <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-4">{stat.label}</p>
                                <span className={`text-2xl font-extrabold tracking-tight ${stat.color}`}>{stat.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Skill Center Section */}
                    <section>
                        <div className="flex items-center justify-between mb-8 text-slate-100">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Active Engine Skills</h2>
                            <button className="text-primary text-sm font-bold hover:underline">Skill Marketplace →</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {skills?.map((skill, i) => (
                                <div key={i} className="glass p-8 rounded-3xl border border-white/5 hover:border-primary/20 transition-all cursor-pointer group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-7xl font-black -mr-4 -mt-4 group-hover:opacity-[0.07] transition-opacity pointer-events-none">
                                        {skill.icon}
                                    </div>
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform relative z-10 backdrop-blur-sm border border-white/5">
                                            {skill.icon}
                                        </div>
                                        <span className="text-[10px] font-extrabold px-3 py-1.5 rounded-xl uppercase tracking-tighter bg-primary/20 text-primary border border-primary/10">
                                            {skill.pricing_type}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3 tracking-tight relative z-10 group-hover:text-primary transition-colors">{skill.name}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-8 relative z-10 line-clamp-2">
                                        {skill.description}
                                    </p>
                                    <div className="flex items-center gap-2 relative z-10">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Active & Ready</span>
                                    </div>
                                </div>
                            ))}

                            {/* Empty placeholder */}
                            <div className="border-2 border-dashed border-white/5 p-8 rounded-3xl flex flex-col items-center justify-center text-center group cursor-pointer hover:border-white/10 hover:bg-white/[0.02] transition-all">
                                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-2xl text-slate-500 mb-4 group-hover:scale-110 group-hover:text-primary transition-all">+</div>
                                <p className="text-slate-500 font-bold text-sm group-hover:text-slate-400 transition-colors">Connect next n8n flow</p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
