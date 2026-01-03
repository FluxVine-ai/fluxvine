import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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

    // 重要：不要在 getUser() 和 supabaseResponse 之间写任何逻辑
    // 一个简单的错误可能导致用户在刷新浏览器时被随机踢出登录
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // 如果用户未登录且尝试访问受保护路由，重定向到登录页
    if (
        !user &&
        request.nextUrl.pathname.startsWith('/dashboard')
    ) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // 重要：必须返回 supabaseResponse 对象
    // 如果你创建新的 NextResponse 对象，确保：
    // 1. 传递 request，如：NextResponse.next({ request })
    // 2. 复制 cookies，如：supabaseResponse.cookies.getAll().forEach(...)
    return supabaseResponse
}

export const config = {
    matcher: [
        /*
         * 匹配所有请求路径，除了以下开头的：
         * - _next/static (静态文件)
         * - _next/image (图片优化文件)
         * - favicon.ico (浏览器图标)
         * - 其他常见静态资源
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
