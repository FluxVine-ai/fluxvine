'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error('Login failed:', error.message)
        return { error: error.message }
    }

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
        console.error('Signup failed:', error.message)
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    return { message: 'Check your email for the confirmation link!' }
}
