import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// 单例模式：确保整个应用使用同一个 Supabase 实例
let supabaseInstance: SupabaseClient | null = null

export function createClient() {
    if (supabaseInstance) {
        return supabaseInstance
    }

    supabaseInstance = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    return supabaseInstance
}
