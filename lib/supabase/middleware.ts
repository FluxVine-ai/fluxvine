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
                    // 更新请求中的 cookie，以便后续页面能读取
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    // 创建新的响应并设置 cookie
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, {
                            ...options,
                            // 关键点：取消 httpOnly，允许客户端脚本同步状态
                            httpOnly: false,
                            sameSite: 'lax',
                            secure: true,
                        })
                    )
                },
            },
        }
    )

    // 这会触发 session 刷新
    await supabase.auth.getUser()

    return supabaseResponse
}
