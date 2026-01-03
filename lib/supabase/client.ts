import { createBrowserClient } from '@supabase/ssr'

// 自定义 storage adapter
const customStorageAdapter = {
    getItem: (key: string) => {
        if (typeof window === 'undefined') return null
        return window.localStorage.getItem(key)
    },
    setItem: (key: string, value: string) => {
        if (typeof window === 'undefined') return
        window.localStorage.setItem(key, value)
    },
    removeItem: (key: string) => {
        if (typeof window === 'undefined') return
        window.localStorage.removeItem(key)
    },
}

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                storage: customStorageAdapter,
                storageKey: 'sb-auth-token',
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true,
            }
        }
    )
}
