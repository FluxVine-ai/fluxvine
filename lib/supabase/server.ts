import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// 创建服务端 Supabase 客户端
// 用于 Server Components, Route Handlers, Server Actions
export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // setAll 在 Server Component 中被调用时会抛出错误
                        // 这是预期行为，可以安全忽略
                    }
                },
            },
        }
    )
}
