import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return redirect(`/login?message=${encodeURIComponent(error.message)}`)
    }

    return redirect('/dashboard')
}

export async function signup(formData: FormData) {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        return redirect(`/login?message=${encodeURIComponent(error.message)}`)
    }

    // 2025/2026 逻辑：如果数据中已经包含了 session (说明无需验证邮件)，直接进控制台
    if (data?.session) {
        return redirect('/dashboard')
    }

    // 否则提示去查收邮件
    return redirect('/login?message=注册成功！请查收邮件验证账号。')
}
