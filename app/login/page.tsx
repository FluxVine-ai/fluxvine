'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSocialLogin = async (provider: 'google' | 'twitter') => {
        setLoading(true);
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) setMessage(error.message);
        setLoading(false);
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setMessage(error.message);
            setLoading(false);
        } else if (data.session) {
            setMessage('Success! Redirecting...');

            // 关键：强制刷新路由器，确保服务端 Middleware 在下次请求时能读到最新的 Cookie
            // 客户端登录会自动写入 Cookie (createBrowserClient默认行为)
            router.refresh();

            // 稍微延迟跳转，确保 Cookie 写入和 Router Refresh 生效
            setTimeout(() => {
                router.push('/dashboard');
            }, 500);
        } else {
            setMessage('Check your email for confirmation.');
            setLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        const supabase = createClient();
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) setMessage(error.message);
        else setMessage('Check your email for the confirmation link!');
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative px-6">
            <div className="bg-glow" />

            <div className="w-full max-w-md glass p-10 rounded-3xl border border-white/10 shadow-2xl relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <Image src="/logo.png" alt="FluxVine" width={40} height={40} />
                        <span className="text-2xl font-bold text-gradient">FluxVine</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Build Your Empire</h1>
                    <p className="text-slate-400 text-sm">One-click access to FluxVine Cloud AI</p>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                        onClick={() => handleSocialLogin('google')}
                        className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Google</span>
                    </button>
                    <button
                        onClick={() => handleSocialLogin('twitter')}
                        className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" /></svg>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Twitter</span>
                    </button>
                </div>

                <div className="relative flex items-center gap-4 mb-8">
                    <div className="flex-1 h-px bg-white/10"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">or use email</span>
                    <div className="flex-1 h-px bg-white/10"></div>
                </div>

                <form className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1" htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                            placeholder="name@company.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1" htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex flex-col gap-4 pt-4">
                        <button
                            onClick={handleSignIn}
                            disabled={loading}
                            className="w-full bg-primary text-slate-950 font-extrabold py-4 rounded-xl btn-glow shadow-xl shadow-primary/20 transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Authenticating...' : 'Sign In Now'}
                        </button>
                        <button
                            onClick={handleSignUp}
                            disabled={loading}
                            className="w-full bg-white/5 border border-white/20 text-white font-bold py-4 rounded-xl hover:bg-white/10 hover:border-white/40 transition-all active:scale-[0.97] shadow-lg disabled:opacity-50"
                        >
                            Create Free Account
                        </button>
                    </div>
                </form>

                {message && (
                    <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs text-center">
                        {message}
                    </div>
                )}

                <div className="mt-8 text-center">
                    <Link href="/" className="text-slate-500 hover:text-white text-xs transition-colors">
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}
