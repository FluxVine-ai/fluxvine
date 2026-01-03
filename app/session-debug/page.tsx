'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SessionDiagnostic() {
    const [info, setInfo] = useState<any>({})

    useEffect(() => {
        checkSession()
    }, [])

    async function checkSession() {
        const supabase = createClient()

        // 获取 session
        const { data: { session }, error } = await supabase.auth.getSession()

        // 获取 user
        const { data: { user } } = await supabase.auth.getUser()

        // 检查 localStorage
        const localStorageKeys = Object.keys(localStorage).filter(k => k.includes('supabase') || k.includes('sb-'))

        // 检查 cookies
        const cookies = document.cookie.split(';').map(c => c.trim())

        setInfo({
            hasSession: !!session,
            sessionExpiry: session?.expires_at,
            user: user?.email,
            userId: user?.id,
            localStorageKeys,
            cookies: cookies.filter(c => c.includes('sb-') || c.includes('supabase')),
            error: error?.message
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">🔍 Session 诊断</h1>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
                    <pre className="text-sm overflow-auto">
                        {JSON.stringify(info, null, 2)}
                    </pre>
                </div>

                <button
                    onClick={checkSession}
                    className="mt-4 px-6 py-3 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-600"
                >
                    🔄 刷新检查
                </button>

                <div className="mt-8 bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
                    <h2 className="text-yellow-400 font-bold mb-2">💡 如何修复：</h2>
                    <ul className="text-yellow-200 text-sm space-y-1">
                        <li>1. 如果 hasSession 为 false，说明 session 没有保存</li>
                        <li>2. 检查 cookies 数组是否有 sb- 开头的 cookie</li>
                        <li>3. 检查 localStorageKeys 是否有 Supabase 相关的 key</li>
                        <li>4. 如果都没有，可能是浏览器阻止了第三方 cookie</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
