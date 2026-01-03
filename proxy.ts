import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// 在新版本 Next.js 中，这个函数名改为 proxy
export async function proxy(request: NextRequest) {
    return await updateSession(request)
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
