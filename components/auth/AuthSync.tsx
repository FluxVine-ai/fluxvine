'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AuthSync() {
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        // 官方监听器：负责在客户端状态变化时，手动同步 Cookie
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('[AuthSync] Event:', event)

            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                if (session) {
                    // 按照你提供的方案：手动在浏览器端强制写入 Cookie
                    // 我们这里写入两个：一个是通用的，一个是 Supabase 引脚所需的
                    const maxAge = 60 * 60 * 24 * 7 // 7 days

                    // 获取项目 ID (yljpcoobtbfuhwdudfau)
                    const projectId = 'yljpcoobtbfuhwdudfau'
                    const cookieName = `sb-${projectId}-auth-token`

                    // 封装 session 数据
                    const sessionData = JSON.stringify(session)
                    const encodedSession = btoa(sessionData)

                    document.cookie = `${cookieName}=${encodedSession}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`
                    console.log('[AuthSync] Cookie synchronized manually')
                }
            } else if (event === 'SIGNED_OUT') {
                // 登出时彻底清理
                const projectId = 'yljpcoobtbfuhwdudfau'
                document.cookie = `sb-${projectId}-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
                console.log('[AuthSync] Cookie cleared manually')
            }
        })

        return () => subscription.unsubscribe()
    }, [supabase, router])

    return null
}
