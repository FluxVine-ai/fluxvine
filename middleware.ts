import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Next.js 16+ 使用 proxy 约定来处理边缘请求和路由拦截
export async function proxy(request: NextRequest) {
    return await updateSession(request)
}

// 依然保持 nodejs 运行时以支持 Supabase SDK
export const runtime = 'nodejs'

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
