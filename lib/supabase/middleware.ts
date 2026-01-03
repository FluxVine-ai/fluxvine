import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    // 1. 创建初始响应
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
                    // 关键修复：直接在现有的 request 和 response 上操作，不要重新创建 NextResponse.next()
                    cookiesToSet.forEach(({ name, value, options }) => {
                        // 同步到请求头，供后续页面使用
                        request.cookies.set(name, value)
                        // 同步到响应头，供浏览器保存
                        supabaseResponse.cookies.set(name, value, {
                            ...options,
                            // 强制允许跨域同步，解决 www 跳转问题
                            domain: '.fluxvine.com',
                            path: '/',
                            sameSite: 'lax',
                            secure: true,
                            httpOnly: false,
                        })
                    })
                },
            },
        }
    )

    // 3. 验证身份并触发 Cookie 同步
    const { data: { user } } = await supabase.auth.getUser()

    // 4. 对 dashboard 路径进行强制保护
    if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
