'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AuthSync() {
    useEffect(() => {
        const supabase = createClient()

        // 监听所有 auth 变化
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('[AuthSync Logic]:', event)
            if (session) {
                // 当发现 Session 时，强制同步一次 Cookie (如果 Middleware 漏掉的话)
                const projectId = 'yljpcoobtbfuhwdudfau'
                const cookieName = `sb-${projectId}-auth-token`

                // 我们不手动编码 session，而是利用 SDK 自己的机制
                // 但为了稳妥，手动确保 Cookie 存在于顶级域名
                const val = btoa(JSON.stringify(session))
                document.cookie = `${cookieName}=${val}; domain=.fluxvine.com; path=/; max-age=604800; SameSite=Lax; Secure`
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    return null
}
