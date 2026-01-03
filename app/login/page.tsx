'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();
    const supabase = createClient();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
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

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) setMessage(error.message);
        else router.push('/dashboard');
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
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-slate-400 text-sm">Enter your details to access your dashboard</p>
                </div>

                <form className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all"
                            placeholder="name@company.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex flex-col gap-4 pt-2">
                        <button
                            onClick={handleSignIn}
                            disabled={loading}
                            className="w-full bg-primary text-slate-950 font-bold py-4 rounded-xl btn-glow shadow-xl shadow-primary/20 transition-all"
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>
                        <button
                            onClick={handleSignUp}
                            disabled={loading}
                            className="w-full glass text-white font-bold py-4 rounded-xl hover:bg-white/5 transition-all"
                        >
                            Build New Account
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
