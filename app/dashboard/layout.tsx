
import { createClient } from '@/lib/supabase/server'
import { cookies, headers } from 'next/headers'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        // 调试模式：不直接重定向，而是显示诊断信息
        // 这样可以看清楚到底是什么状态
        const cookieStore = await cookies()
        const allCookies = cookieStore.getAll()
        const headerList = await headers()

        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-mono">
                <div className="max-w-2xl w-full bg-black/50 p-8 rounded-2xl border border-red-500/50">
                    <h1 className="text-3xl font-bold text-red-500 mb-4">⚠️ Authentication Failed</h1>
                    <p className="mb-4 text-slate-300">
                        The server verification for your session failed. Inspect the details below to debug.
                    </p>

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Error Details</h2>
                            <pre className="bg-red-950/30 p-4 rounded border border-red-500/20 text-red-300 overflow-auto whitespace-pre-wrap">
                                {JSON.stringify(error || { message: 'No user found' }, null, 2)}
                            </pre>
                        </div>

                        <div>
                            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Cookies Received by Server</h2>
                            <div className="bg-slate-900 p-4 rounded border border-slate-700 max-h-48 overflow-auto">
                                {allCookies.length === 0 ? (
                                    <span className="text-yellow-400">⚠️ No cookies received from browser.</span>
                                ) : (
                                    allCookies.map(c => (
                                        <div key={c.name} className="mb-2 last:mb-0 border-b border-white/5 pb-2">
                                            <span className="text-emerald-400 font-bold">{c.name}</span>
                                            <p className="text-xs text-slate-500 break-all">{c.value.substring(0, 20)}...[truncated]</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Environment</h2>
                            <div className="text-xs text-slate-400">
                                Host: {headerList.get('host')} <br />
                                Proto: {headerList.get('x-forwarded-proto')}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10 flex gap-4">
                            <Link href="/login" className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-slate-200 transition-colors">
                                ← Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            {children}
        </>
    )
}
