import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
    return await updateSession(request)
}

// 2025 官方最佳实践：如果涉及复杂 SDK (如 Supabase)，
// 建议显式声明使用 nodejs 运行时，避开 Edge Runtime 的 API 限制。
export const runtime = 'nodejs'

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
