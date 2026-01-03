'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AuthSync() {
    useEffect(() => {
        const supabase = createClient()

        // 监听 auth 状态变化
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('AuthSync Event:', event)
            if (session) {
                // 强制确保 session 在浏览器中是活跃的
                localStorage.setItem('supabase.auth.token', session.access_token)
            } else if (event === 'SIGNED_OUT') {
                localStorage.removeItem('supabase.auth.token')
            }
        })

        // 初始加载时，如果发现有 Session 但 Cookie 丢了，尝试强制刷新
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session && window.location.pathname.startsWith('/dashboard')) {
                console.warn('Session missing in dashboard, attempting recovery...')
                // 尝试重新获取，有时这能触发 Cookie 重新注入
                await supabase.auth.getUser()
            }
        }

        checkSession()

        return () => subscription.unsubscribe()
    }, [])

    return null
}
