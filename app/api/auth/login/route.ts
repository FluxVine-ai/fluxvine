import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: '请输入邮箱和密码' },
                { status: 400 }
            )
        }

        // 创建响应对象（需要在创建客户端之前）
        const response = NextResponse.json({ success: true })

        // 获取 cookie store
        const cookieStore = await cookies()

        // 创建 Supabase 客户端，配置为同时设置 cookies 到 cookieStore 和 response
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            // 设置到 cookieStore（用于服务端）
                            cookieStore.set(name, value, options)
                            // 同时设置到响应的 cookies（用于浏览器）
                            response.cookies.set(name, value, options as CookieOptions)
                        })
                    },
                },
            }
        )

        // 使用 Supabase 登录
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            console.error('[Login API] Auth error:', error.message)
            return NextResponse.json(
                { error: '邮箱或密码错误' },
                { status: 401 }
            )
        }

        if (!data.session) {
            console.error('[Login API] No session returned')
            return NextResponse.json(
                { error: '登录失败，请重试' },
                { status: 500 }
            )
        }

        console.log('[Login API] Login successful for:', data.user.email)
        console.log('[Login API] Session created, cookies should be set')

        // 返回登录成功的响应（带有 cookies）
        // 创建一个新的成功响应，但保留之前设置的 cookies
        const successResponse = NextResponse.json({
            success: true,
            user: {
                id: data.user.id,
                email: data.user.email,
            }
        })

        // 复制所有 cookies 到成功响应
        response.cookies.getAll().forEach(cookie => {
            successResponse.cookies.set(cookie.name, cookie.value, cookie as CookieOptions)
        })

        return successResponse

    } catch (error) {
        console.error('[Login API] Error:', error)
        return NextResponse.json(
            { error: '服务器错误，请稍后重试' },
            { status: 500 }
        )
    }
}
