'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers, cookies } from 'next/headers'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    console.log('[Login Action] Attempting login for:', email)

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error('[Login Action] Login failed:', error.message)
        return { error: error.message }
    }

    console.log('[Login Action] Login successful!')
    console.log('[Login Action] User ID:', data.user?.id)
    console.log('[Login Action] Session exists:', !!data.session)
    console.log('[Login Action] Access token (preview):', data.session?.access_token?.substring(0, 20))

    // 检查 cookie 是否被设置
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    console.log('[Login Action] Cookies after login:', allCookies.map(c => c.name))

    // 登录成功，刷新缓存并重定向
    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()
    const headersList = await headers()
    const origin = headersList.get('origin') || headersList.get('host') || ''

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // 构建完整的 redirect URL
    const redirectUrl = origin.startsWith('http')
        ? `${origin}/auth/callback`
        : `https://${origin}/auth/callback`

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: redirectUrl,
        },
    })

    if (error) {
        console.error('[Signup Action] Signup failed:', error.message)
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    return { message: 'Check your email for the confirmation link!' }
}
