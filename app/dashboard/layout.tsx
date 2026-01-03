import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    // 服务端强制检查：如果没登录，直接重定向到登录页
    if (error || !user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-background">
            {children}
        </div>
    )
}
