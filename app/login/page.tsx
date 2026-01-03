'use client'

import { login } from './actions'
import { useState } from 'react'
import Image from 'next/image'

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null)
    const [pending, setPending] = useState(false)

    async function handleSubmit(formData: FormData) {
        setPending(true)
        setError(null)
        const result = await login(formData)
        if (result?.error) {
            setError(result.error)
            setPending(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <div className="w-full max-w-md p-8 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-4 border border-cyan-500/20">
                        <span className="text-3xl">🌱</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">FluxVine</h1>
                    <p className="text-zinc-500 mt-2">Sign in to your account</p>
                </div>

                <form action={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={pending}
                        className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.98]"
                    >
                        {pending ? 'Signing in...' : 'Sign In Now'}
                    </button>

                    <div className="text-center text-zinc-500 text-sm">
                        Don't have an account? <span className="text-cyan-500 hover:underline cursor-pointer">Sign up</span>
                    </div>
                </form>
            </div>
        </div>
    )
}
