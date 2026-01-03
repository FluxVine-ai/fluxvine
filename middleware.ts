import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // 1. 初始化 response
    let response = NextResponse.next({
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
                    // 2. 更新 Request 里的 cookies (供 Server Components 使用)
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))

                    // 3. 更新 Response 对象 (确保包含了最新的 Request)
                    response = NextResponse.next({
                        request,
                    })

                    // 4. 更新 Response 里的 cookies (供浏览器保存)
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // 5. 刷新 Session
    // 这一步非常关键:
    // - 如果 token 过期，getUser() 会自动刷新并触发上面的 setAll
    // - 如果 token 有效，它会验证用户
    // - 如果无效，user 为 null
    const { data: { user } } = await supabase.auth.getUser()

    // 6. 路由保护逻辑
    const protectedPaths = ['/dashboard', '/api/skills', '/api/generate']
    const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

    if (isProtectedPath && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        // 关键: 重定向时也要带上 cookies (防止循环重定向)
        const redirectResponse = NextResponse.redirect(url)

        // 复制所有 cookies 到重定向响应中
        const allCookies = response.cookies.getAll()
        allCookies.forEach(cookie => {
            redirectResponse.cookies.set(cookie)
        })

        return redirectResponse
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
