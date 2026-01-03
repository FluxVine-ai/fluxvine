import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    // 1. 同步到请求头
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))

                    // 2. 重新初始化响应
                    supabaseResponse = NextResponse.next({
                        request,
                    })

                    // 3. 强制设置 Cookie 属性
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, {
                            ...options,
                            domain: '.fluxvine.com', // 关键：允许子域名共享
                            path: '/',
                            sameSite: 'lax',
                            secure: true,
                            httpOnly: false, // 允许客户端同步
                        })
                    )
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // 4. 路由守卫：只在 /dashboard 下进行强制跳转
    if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
