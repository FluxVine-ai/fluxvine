import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

export async function POST(req: Request) {
    try {
        const supabase = await createClient();

        // 1. 验证用户会话 (Auth Check)
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        // 注意：在测试阶段，如果没有配置 Supabase 或未登录，我们先允许通过，但记录日志
        if (authError || !user) {
            console.log('No active session found, running in guest mode.');
            // 在正式商业版中，这里应该返回 401
            // return NextResponse.json({ error: 'Please login to FluxVine' }, { status: 401 });
        }

        const { title, context } = await req.json();

        if (!title) {
            return NextResponse.json({ error: 'Missing title' }, { status: 400 });
        }

        // 2. 检查用户积分 (Credits Check - Placeholder)
        // 这里未来会查询 profiles 表中的 credits 字段

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
                {
                    status: 502,
                    headers: { 'Access-Control-Allow-Origin': '*' }
                }
            );
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        // 3. 扣除积分 (Deduct Credits - Placeholder)
        // 如果用户存在，记录一次调用并扣费

        return NextResponse.json(
            { copywriting: content },
            {
                headers: { 'Access-Control-Allow-Origin': '*' }
            }
        );

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            {
                status: 500,
                headers: { 'Access-Control-Allow-Origin': '*' }
            }
        );
    }
}
