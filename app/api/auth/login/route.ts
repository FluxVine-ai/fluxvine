import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: '请输入邮箱和密码' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // 使用 Supabase 登录
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            return NextResponse.json(
                { error: '邮箱或密码错误' },
                { status: 401 }
            )
        }

        if (!data.session) {
            return NextResponse.json(
                { error: '登录失败，请重试' },
                { status: 500 }
            )
        }

        // 返回 access token
        return NextResponse.json({
            token: data.session.access_token,
            user: {
                id: data.user.id,
                email: data.user.email,
            }
        })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: '服务器错误，请稍后重试' },
            { status: 500 }
        )
    }
}
