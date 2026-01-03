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

        // 创建响应对象
        const response = NextResponse.json({ success: false, message: 'Initial' })

        // 获取 cookie store
        const cookieStore = await cookies()

        // 用于追踪设置的 cookies
        const setCookies: Array<{ name: string; value: string; options: CookieOptions }> = []

        // 创建 Supabase 客户端
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        console.log('[Login API] setAll called with', cookiesToSet.length, 'cookies')
                        cookiesToSet.forEach(({ name, value, options }) => {
                            console.log('[Login API] Setting cookie:', name, 'options:', options)
                            setCookies.push({ name, value, options: options as CookieOptions })

                            // 尝试设置到 cookieStore
                            try {
                                cookieStore.set(name, value, options)
                            } catch (err) {
                                console.log('[Login API] cookieStore.set error (expected in Route Handler):', err)
                            }
                        })
                    },
                },
            }
        )

        // 使用 Supabase 登录
        console.log('[Login API] Attempting signInWithPassword...')
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            console.error('[Login API] Auth error:', error.message)
            return NextResponse.json(
                { error: '邮箱或密码错误', details: error.message },
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
        console.log('[Login API] Cookies to set:', setCookies.length)

        // 创建成功响应
        const successResponse = NextResponse.json({
            success: true,
            user: {
                id: data.user.id,
                email: data.user.email,
            },
            debug: {
                cookiesCount: setCookies.length,
                cookieNames: setCookies.map(c => c.name),
            }
        })

        // 手动设置 cookies 到响应
        setCookies.forEach(({ name, value, options }) => {
            console.log('[Login API] Adding cookie to response:', name)
            // 确保 cookie 选项正确
            const cookieOptions: CookieOptions = {
                ...options,
                // 确保在 HTTPS 环境使用 secure
                secure: process.env.NODE_ENV === 'production',
                // 使用 lax 允许跨页面导航时发送 cookie
                sameSite: 'lax',
                // 确保服务端可访问
                httpOnly: true,
                // 设置路径为根目录
                path: '/',
            }
            successResponse.cookies.set(name, value, cookieOptions)
        })

        // 记录最终的 Set-Cookie headers
        const setCookieHeaders = successResponse.headers.getSetCookie()
        console.log('[Login API] Final Set-Cookie headers:', setCookieHeaders)

        return successResponse

    } catch (error) {
        console.error('[Login API] Error:', error)
        return NextResponse.json(
            { error: '服务器错误，请稍后重试', details: String(error) },
            { status: 500 }
        )
    }
}
