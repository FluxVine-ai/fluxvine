import { NextResponse } from 'next/server';

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
        const { title, context } = await req.json();

        if (!title) {
            return NextResponse.json({ error: 'Missing title' }, { status: 400 });
        }

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
                        content: "You are a world-class eCommerce copywriter. Write a persuasive and high-converting Shopify product description in HTML format. Use <p>, <ul>, <li>, <strong> tags. IMPORTANT: Output in the same language as the product title provided. If the title is in English, write in English. If it's Chinese, write in Chinese. No conversational intro or outro. Return ONLY the HTML code."
                    },
                    {
                        role: "user",
                        content: `Write description for: ${title}. ${context || ''}`
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
