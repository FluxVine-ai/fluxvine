import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function OPTIONS(req: Request) {
    const origin = req.headers.get('origin');
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': origin || '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true',
        },
    });
}

export async function GET(req: Request) {
    const origin = req.headers.get('origin') || '*';
    const corsHeaders = {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
    };

    try {
        const supabase = await createClient();

        // 1. 验证用户 (支持 Session Token 或 API Key)
        const authHeader = req.headers.get('Authorization');
        let userId;

        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];

            // 检查是否是 API Key
            if (token.startsWith('fv_')) {
                const { data: apiKeyData, error: apiKeyError } = await supabase
                    .from('api_keys')
                    .select('user_id, is_active')
                    .eq('api_key', token)
                    .single();

                if (apiKeyError || !apiKeyData || !apiKeyData.is_active) {
                    return NextResponse.json({ error: 'Invalid API key' }, { status: 401, headers: corsHeaders });
                }

                userId = apiKeyData.user_id;
            } else {
                const { data } = await supabase.auth.getUser(token);
                userId = data.user?.id;
            }
        } else {
            const { data } = await supabase.auth.getUser();
            userId = data.user?.id;
        }

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
        }

        // 2. 获取激活技能
        const { data: skills, error } = await supabase
            .from('skills')
            .select('id, name, description, icon, slug, pricing_type')
            .eq('is_active', true)
            .order('name', { ascending: true });

        if (error) throw error;

        return NextResponse.json({ skills }, { headers: corsHeaders });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }
}
