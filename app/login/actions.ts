'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
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
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    // 这里的逻辑必须极简，防止 Next.js 16 编译器误解
    if (error) {
        return redirect(`/login?message=${encodeURIComponent(error.message)}`)
    }

    if (data?.session) {
        return redirect('/dashboard')
    }

    return redirect('/login?message=${encodeURIComponent("注册成功！请查收邮件或直接登录。")}')
}
