import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// 强制动态渲染，防止 Next.js 缓存页面导致认证失效
export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    // 使用 getUser 而不是 getSession，因为 getUser 会向 Supabase 服务器验证 token 有效性
    // 这比单纯检查有没有 cookie 更安全、更准确
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        console.log('[DashboardLayout] User validation failed, redirecting to login', error)
        redirect('/login')
    }

    return (
        <>
            {children}
        </>
    )
}
