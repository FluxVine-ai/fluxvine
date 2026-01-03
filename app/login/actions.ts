'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // 1. 获取客户端
    const supabase = await createClient()

    // 2. 尝试登录
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    if (!data.session) {
        return { error: 'Login failed - no session returned' }
    }

    // 3. 核心手动补丁：在重定向前，确保我们等待了一瞬间，
    // 虽然 Server Action 的 redirect 会自动同步 Cookie，但在有些环境下不稳。
    // 这里我们直接依赖 redirect，它是 Next.js 最推荐的结束操作。
    redirect('/dashboard')
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}
