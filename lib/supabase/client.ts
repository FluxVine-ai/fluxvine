import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// 单例模式
let supabaseInstance: SupabaseClient | null = null

export function createClient() {
    if (supabaseInstance) {
        return supabaseInstance
    }

    supabaseInstance = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookieOptions: {
                secure: false // 关键：客户端也不要设置 secure
            }
        }
    )

    return supabaseInstance
}
