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
    const origin = req.headers.get('origin') || '*';
    const corsHeaders = {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
    };

    try {
        const supabase = await createClient();
        const { title, context, skill_slug } = await req.json();
        const targetSlug = skill_slug || 'shopify-us-copy';

        // 1. 验证用户会话 (Auth Check)
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        const userId = user?.id;

        // 如果没有登录，且不是测试环境，则报错
        if (!userId) {
            return NextResponse.json({ error: 'Authentication required. Please login to FluxVine.' }, { status: 401, headers: corsHeaders });
        }

        // 2. 获取技能详情 (Fetch Skill Details)
        const { data: skill, error: skillError } = await supabase
            .from('skills')
            .select('*')
            .eq('slug', targetSlug)
            .single();

        if (skillError || !skill) {
            return NextResponse.json({ error: 'Skill not found or inactive.' }, { status: 404, headers: corsHeaders });
        }

        // 3. 检查用户积分 (Credits Check)
        const { data: profile } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', userId)
            .single();

        if (!profile || profile.credits <= 0) {
            return NextResponse.json({ error: 'Insufficient AI Credits. Please top up.' }, { status: 403, headers: corsHeaders });
        }

        let generatedContent = '';

        // 4. 路由逻辑 (Routing Logic)
        if (skill.n8n_webhook_url) {
            // A. 如果定义了 n8n Webhook，则转发
            const n8nResponse = await fetch(skill.n8n_webhook_url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, context, userId, skill: skill.name })
            });

            if (!n8nResponse.ok) throw new Error('n8n workflow failed');
            const n8nData = await n8nResponse.json();
            generatedContent = n8nData.output || n8nData.copywriting || JSON.stringify(n8nData);
        } else {
            // B. 默认使用 DeepSeek 引擎
            const aiResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
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
                            content: `You are an AI Agent named "${skill.name}". Mission: ${skill.description}. Output format: Strictly HTML. No conversational filler.`
                        },
                        {
                            role: "user",
                            content: `Process this request: ${title}. Context: ${context || ''}`
                        }
                    ],
                    temperature: 0.7
                })
            });

            if (!aiResponse.ok) throw new Error('AI engine failed');
            const aiData = await aiResponse.json();
            generatedContent = aiData.choices[0].message.content;
        }

        // 5. 扣除积分 (Deduct Credits)
        // 使用更稳妥的直接更新方式
        await supabase
            .from('profiles')
            .update({ credits: Math.max(0, profile.credits - 1) })
            .eq('id', userId);

        return NextResponse.json(
            { copywriting: generatedContent, skill_used: skill.name },
            { headers: corsHeaders }
        );

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500, headers: corsHeaders }
        );
    }
}
