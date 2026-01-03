import { NextResponse } from 'next/server'
// 使用我们定义的 server client
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // 如果有 next 参数，跳转到 next，否则跳转到 dashboard
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            const forwardedHost = request.headers.get('x-forwarded-host') // 原始请求域名
            const isLocalEnv = process.env.NODE_ENV === 'development'
            if (isLocalEnv) {
                // 开发环境
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                // Vercel 生产环境，确保跳转到正确的域名
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
    }

    // 认证失败，跳回登录页
    return NextResponse.redirect(`${origin}/login?message=认证失败，请重试`)
}
