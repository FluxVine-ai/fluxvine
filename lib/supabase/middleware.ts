import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request: {
            headers: request.headers,
        },
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
                    // 这是官方 GitHub 中解决刷新掉线的关键：
                    // 1. 设置在 request 上，供后续渲染读取
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))

                    // 2. 重新生成并覆盖 response，确保最新的 request headers 被带入
                    supabaseResponse = NextResponse.next({
                        request,
                    })

                    // 3. 设置在 response 上，供浏览器保存
                    // 移除任何手动 domain 绑定，让浏览器按标准处理
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // 执行 getUser 触发 session 刷新
    const { data: { user } } = await supabase.auth.getUser()

    // 路由守卫：Middleware 层级的重定向是最稳的
    if (
        !user &&
        !request.nextUrl.pathname.startsWith('/login') &&
        !request.nextUrl.pathname.startsWith('/auth') &&
        !request.nextUrl.pathname.startsWith('/api') &&
        request.nextUrl.pathname !== '/'
    ) {
        // 无 session 且在受保护路径，跳转登录
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
