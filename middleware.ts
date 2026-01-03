import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // 调试日志：打印请求路径和 Cookie 信息
    console.log(`[Middleware] Processing ${request.nextUrl.pathname}`)

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
                    const allCookies = request.cookies.getAll()
                    // console.log('[Middleware] Getting all cookies:', allCookies.map(c => c.name))
                    return allCookies
                },
                setAll(cookiesToSet) {
                    // console.log('[Middleware] Setting cookies:', cookiesToSet.map(c => c.name))
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))

                    response = NextResponse.next({
                        request,
                    })

                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // 刷新 Session
    // 捕获可能的错误
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
        console.error('[Middleware] Auth error:', error.message)
    }

    if (user) {
        // console.log('[Middleware] User authenticated:', user.email)
    } else {
        // console.log('[Middleware] No user session')
    }

    // 路由保护逻辑
    const protectedPaths = ['/dashboard', '/api/skills', '/api/generate']
    const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

    if (isProtectedPath && !user) {
        console.log(`[Middleware] Redirecting unauthenticated user from ${request.nextUrl.pathname} to /login`)

        const url = request.nextUrl.clone()
        url.pathname = '/login'
        const redirectResponse = NextResponse.redirect(url)

        // 确保重定向时也携带 cookies
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
