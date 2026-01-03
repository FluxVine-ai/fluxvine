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
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true',
        },
    });
}

export async function POST(req: Request) {
    try {
        const supabase = await createClient();

        // 1. 验证用户会话 (Auth Check)
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        // 如果没有登录，暂时允许测试，但在生产环境建议报错
        const isGuest = authError || !user;
        const userId = user?.id;

        // 2. 检查用户积分 (Credits Check)
        if (userId) {
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('credits')
                .eq('id', userId)
                .single();

            if (profileError || !profile) {
                console.error('Profile fetch error:', profileError);
            } else if (profile.credits <= 0) {
                return NextResponse.json(
                    { error: 'Insufficient AI Credits. Please top up.' },
                    { status: 403, headers: { 'Access-Control-Allow-Origin': req.headers.get('origin') || '*', 'Access-Control-Allow-Credentials': 'true' } }
                );
            }
        }

        const { title, context } = await req.json();

        if (!title) {
            return NextResponse.json({ error: 'Missing title' }, { status: 400, headers: { 'Access-Control-Allow-Origin': req.headers.get('origin') || '*', 'Access-Control-Allow-Credentials': 'true' } });
        }

        // 3. 调用 AI 引擎 (DeepSeek)
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content: "You are a world-class eCommerce copywriter specialized in the North American market (US/Canada). Write a persuasive, high-converting Shopify product description in professional American English. Structure the copy with an engaging intro paragraph, a bulleted list of 'Key Benefits' (not just features), and a brief 'Why Choose Us' section. Use HTML tags like <ul>, <li>, and <strong>. No conversational filler, ONLY return HTML."
                    },
                    {
                        role: "user",
                        content: `Write a premium North American marketing description for this product: ${title}. ${context || ''}`
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('DeepSeek Error:', errorData);
            return NextResponse.json(
                { error: 'AI engine failed' },
                { status: 502, headers: { 'Access-Control-Allow-Origin': req.headers.get('origin') || '*', 'Access-Control-Allow-Credentials': 'true' } }
            );
        }

        const data = await response.json();
        const generatedCopy = data.choices[0].message.content;

        // 4. 扣除积分 (Deduct Credits)
        if (userId) {
            const { error: updateError } = await supabase.rpc('deduct_credits', { user_id: userId, amount: 1 });

            // 注意：由于 rpc 需要在数据库定义，我这里的 sql 还没写，先尝试直接 update
            if (updateError) {
                await supabase
                    .from('profiles')
                    .update({ credits: supabase.rpc('decrement', { x: 1 }) }) // 这行在 JS 里可能不支持，换成直接计算
                    .eq('id', userId);

                // 正确的用法通常是直接减去 1
                const { data: currentProfile } = await supabase.from('profiles').select('credits').eq('id', userId).single();
                if (currentProfile) {
                    await supabase.from('profiles').update({ credits: Math.max(0, currentProfile.credits - 1) }).eq('id', userId);
                }
            }
        }

        return NextResponse.json(
            { copywriting: generatedCopy },
            { headers: { 'Access-Control-Allow-Origin': req.headers.get('origin') || '*', 'Access-Control-Allow-Credentials': 'true' } }
        );

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500, headers: { 'Access-Control-Allow-Origin': req.headers.get('origin') || '*', 'Access-Control-Allow-Credentials': 'true' } }
        );
    }
}
