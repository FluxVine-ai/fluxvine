'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SessionDiagnostics() {
    const [sessionInfo, setSessionInfo] = useState<{
        hasSession: boolean
        userId?: string
        email?: string
        expiresAt?: string
    } | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function checkSession() {
            const supabase = createClient()
            const { data: { session } } = await supabase.auth.getSession()

            if (session) {
                setSessionInfo({
                    hasSession: true,
                    userId: session.user.id,
                    email: session.user.email,
                    expiresAt: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : undefined
                })
            } else {
                setSessionInfo({ hasSession: false })
            }
            setLoading(false)
        }
        checkSession()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 text-white p-10 font-mono flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>检查会话状态...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white p-10 font-mono">
            <h1 className="text-3xl font-bold text-yellow-400 mb-6">🍪 Session Diagnostics</h1>

            <div className="bg-black/40 p-6 rounded-xl border border-white/10 mb-8">
                <h2 className="text-xl font-bold text-cyan-400 mb-4">客户端 Session 状态</h2>

                {sessionInfo?.hasSession ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-green-400 text-2xl">✅</span>
                            <span className="text-green-400 font-bold">Session 存在</span>
                        </div>
                        <div className="bg-white/5 p-4 rounded-lg space-y-2 text-sm">
                            <p><span className="text-slate-400">用户 ID:</span> <span className="text-cyan-300">{sessionInfo.userId}</span></p>
                            <p><span className="text-slate-400">邮箱:</span> <span className="text-cyan-300">{sessionInfo.email}</span></p>
                            <p><span className="text-slate-400">过期时间:</span> <span className="text-cyan-300">{sessionInfo.expiresAt}</span></p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="text-red-400 text-2xl">❌</span>
                        <span className="text-red-400 font-bold">没有 Session - 用户未登录</span>
                    </div>
                )}
            </div>

            <div className="bg-yellow-900/20 border border-yellow-700/50 p-6 rounded-xl">
                <h3 className="text-yellow-500 font-bold mb-2">故障排除指南</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-yellow-200/80">
                    <li>如果上面显示 Session 存在，说明登录成功且 Cookie 正常工作。</li>
                    <li>如果显示没有 Session，请前往 <a href="/login" className="text-cyan-400 underline">/login</a> 登录。</li>
                    <li>如果登录后刷新页面 Session 丢失，请检查浏览器开发者工具中的 Cookie。</li>
                </ul>
            </div>
        </div>
    )
}
