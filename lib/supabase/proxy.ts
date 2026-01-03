import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    // 使用 Fluid compute 时，不要将此客户端放在全局环境变量中
    // 每次请求都创建一个新的客户端
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // 不要在 createServerClient 和 supabase.auth.getClaims() 之间运行任何代码
    // 一个简单的错误可能导致用户被随机踢出登录

    // 重要：如果移除 getClaims() 并使用 Supabase 客户端进行服务端渲染
    // 用户可能会被随机踢出登录
    const { data } = await supabase.auth.getClaims()
    const user = data?.claims

    // 需要保护的路由
    const protectedRoutes = ['/dashboard']
    const isProtectedRoute = protectedRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    )

    // 公开路由（未登录用户可以访问）
    const publicRoutes = ['/', '/login', '/auth', '/api', '/session-debug', '/debug-cookies', '/diagnostic']
    const isPublicRoute = publicRoutes.some(route =>
        request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + '/')
    )

    if (!user && isProtectedRoute) {
        // 未登录且访问受保护路由，重定向到登录页
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // 重要：必须原样返回 supabaseResponse 对象
    // 如果你创建新的 NextResponse.next() 响应对象，确保：
    // 1. 传入 request, 如: const myNewResponse = NextResponse.next({ request })
    // 2. 复制 cookies, 如: myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. 修改 myNewResponse 对象以满足你的需求，但避免修改 cookies!
    // 4. 最后: return myNewResponse
    // 如果不这样做，可能导致浏览器和服务器不同步，过早终止用户会话！

    return supabaseResponse
}
