import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const origin = req.headers.get('origin') || '*';
    const corsHeaders = {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
    };

    try {
        const supabase = await createClient();

        // 1. 验证用户
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
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
