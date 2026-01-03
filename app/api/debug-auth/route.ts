import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// 详细的服务端 Cookie 调试
export async function GET() {
    try {
        const cookieStore = await cookies()
        const allCookies = cookieStore.getAll()

        // 检查 Supabase 相关的 Cookie
        const supabaseCookies = allCookies.filter(c =>
            c.name.includes('sb-') ||
            c.name.includes('supabase') ||
            c.name.includes('auth')
        )

        // 尝试获取用户
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        return NextResponse.json({
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 50) + '...',
            cookies: {
                total: allCookies.length,
                all: allCookies.map(c => ({
                    name: c.name,
                    valueLength: c.value.length,
                    valuePreview: c.value.substring(0, 30) + (c.value.length > 30 ? '...' : '')
                })),
                supabaseRelated: supabaseCookies.map(c => ({
                    name: c.name,
                    valueLength: c.value.length,
                })),
            },
            auth: {
                hasUser: !!user,
                userId: user?.id,
                email: user?.email,
                userError: userError?.message,
                hasSession: !!session,
                sessionError: sessionError?.message,
                accessTokenPreview: session?.access_token?.substring(0, 20) + '...',
            }
        })
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to debug',
            message: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}
