import { NextResponse } from 'next/server'

// 测试端点：验证 Set-Cookie Header 是否能被正确发送
export async function GET() {
    const response = NextResponse.json({
        message: 'Test cookie endpoint',
        timestamp: new Date().toISOString(),
    })

    // 设置一个简单的测试 cookie
    response.cookies.set('test-cookie', 'test-value-' + Date.now(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60, // 1 hour
    })

    // 记录设置的 cookie
    const setCookieHeaders = response.headers.getSetCookie()
    console.log('[Test Cookie] Set-Cookie headers:', setCookieHeaders)

    return response
}
