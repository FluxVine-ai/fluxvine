import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // 仅用于日志记录，不做登录拦截
    // 登录验证完全由客户端处理
    console.log(`[Middleware] ${request.method} ${request.nextUrl.pathname}`)

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
