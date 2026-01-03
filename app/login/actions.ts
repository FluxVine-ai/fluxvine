'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    // 强力补丁：手动同步 Cookie 到顶级域名
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()

    // 找出 Supabase 刚设置的 auth cookie 并强制更新它的属性
    allCookies.forEach(cookie => {
        if (cookie.name.includes('auth-token')) {
            cookieStore.set(cookie.name, cookie.value, {
                domain: '.fluxvine.com',
                path: '/',
                sameSite: 'lax',
                secure: true,
                httpOnly: false,
                maxAge: 60 * 60 * 24 * 7 // 7 days
            })
        }
    })

    redirect('/dashboard')
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()

    // 登出时也要彻底清理顶级域名 Cookie
    const cookieStore = await cookies()
    cookieStore.getAll().forEach(c => {
        if (c.name.includes('auth-token')) {
            cookieStore.set(c.name, '', { domain: '.fluxvine.com', maxAge: 0 })
        }
    })

    redirect('/login')
}
