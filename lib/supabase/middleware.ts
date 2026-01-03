import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    // 1. 创建一个初始响应
    let supabaseResponse = NextResponse.next({
        request,
    })

    // 2. 创建 Supabase 客户端
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    // 关键修复：同步到请求头，确保当前请求的下游（即页面渲染）能读到新 Cookie
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))

                    // 关键修复：不要重复创建 NextResponse.next()，而是基于当前响应继续设置
                    // 重新创建一个带有新请求头的响应
                    supabaseResponse = NextResponse.next({
                        request,
                    })

                    // 设置响应头中的 Cookie，传给浏览器
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, {
                            ...options,
                            // 这里我们稍微放宽一点限制，确保客户端能顺利读取
                            httpOnly: false,
                            sameSite: 'lax',
                            secure: true,
                            path: '/',
                        })
                    )
                },
            },
        }
    )

    // 3. 执行一次验证，触发 setAll
    const { data: { user } } = await supabase.auth.getUser()

    // 4. 特殊处理：如果是在 Dashboard 但没用户，强制重定向到登录
    if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
