import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
    try {
        const supabase = await createClient()
        const authHeader = req.headers.get('Authorization')
        let userId

        // 支持 API Key 或 Session Token
        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1]

            if (token.startsWith('fv_')) {
                // API Key 认证
                const { data: apiKeyData } = await supabase
                    .from('api_keys')
                    .select('user_id')
                    .eq('api_key', token)
                    .eq('is_active', true)
                    .single()

                userId = apiKeyData?.user_id
            } else {
                // Session Token
                const { data } = await supabase.auth.getUser(token)
                userId = data.user?.id
            }
        } else {
            // Cookie
            const { data } = await supabase.auth.getUser()
            userId = data.user?.id
        }

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 获取用户信息
        const { data: profile } = await supabase
            .from('profiles')
            .select('email, credits, plan')
            .eq('id', userId)
            .single()

        return NextResponse.json({
            email: profile?.email || 'User',
            credits: profile?.credits || 0,
            plan: profile?.plan || 'free'
        })
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
