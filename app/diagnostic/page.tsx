'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DiagnosticPage() {
    const [info, setInfo] = useState<any>(null)

    useEffect(() => {
        const supabase = createClient()
        async function check() {
            const { data: { session } } = await supabase.auth.getSession()
            setInfo({
                url: process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/^(https:\/\/).*(.supabase.co)$/, '$1***$2'),
                hasSession: !!session,
                cookies: typeof document !== 'undefined' ? document.cookie.split(';').length : 0,
                allCookies: typeof document !== 'undefined' ? document.cookie : 'N/A'
            })
        }
        check()
    }, [])

    return (
        <div className="p-8 font-mono text-sm bg-black text-green-500 min-h-screen">
            <h1 className="text-xl mb-4">Environment Diagnostic</h1>
            <pre>{JSON.stringify(info, null, 2)}</pre>
            <div className="mt-8">
                <p>1. 检查环境变量是否以 yljpcoobtbfuhwdudfau 开头</p>
                <p>2. 检查 Cookies 是否包含 sb-yljpcoobtbfuhwdudfau-auth-token</p>
            </div>
        </div>
    )
}
