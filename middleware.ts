import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // 调试日志：打印请求路径
    console.log(`[Middleware] Processing ${request.nextUrl.pathname}`)

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
                    const cookies = request.cookies.getAll()
                    // 调试：打印收到的 cookie 名称，不打印值
                    console.log(`[Middleware] Received cookies: ${cookies.map(c => c.name).join(', ')}`)
                    return cookies
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        // 强制覆盖 Cookie 选项，确保在 Vercel (HTTPS) 上有效
                        const secureOptions: CookieOptions = {
                            ...options,
                            sameSite: 'lax', // 这里使用 'lax' 通常是安全的默认值，也可以尝试 'none'
                            secure: true,    // 强制 Secure
                            path: '/',       // 强制根路径
                        }

                        request.cookies.set(name, value)

                        // 更新 response
                        response = NextResponse.next({
                            request,
                        })

                        response.cookies.set(name, value, secureOptions)
                    })
                },
            },
        }
    )

    // 2. 刷新 Session
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
        // AuthSessionMissingError 是预期的，当没有 session 时会发生
        if (!error.message.includes('Auth session missing')) {
            console.error('[Middleware] Auth error:', error.message)
        }
    }

    if (user) {
        console.log(`[Middleware] ✅ User authenticated: ${user.email}`)
    } else {
        console.log('[Middleware] ❌ No user session')
    }

    // 3. 路由保护逻辑
    const protectedPaths = ['/dashboard', '/api/skills', '/api/generate']
    const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

    if (isProtectedPath && !user) {
        console.log(`[Middleware] ⚠️ User unauthenticated on protected path ${request.nextUrl.pathname}, but BYPASSING redirect for debug`)

        // 暂时注释掉重定向，观察客户端状态
        /*
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        const redirectResponse = NextResponse.redirect(url)
        
        // 关键: 重定向时也要带上 cookies
        const allCookies = response.cookies.getAll()
        allCookies.forEach(cookie => {
            redirectResponse.cookies.set(cookie)
        })
        
        return redirectResponse
        */
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
