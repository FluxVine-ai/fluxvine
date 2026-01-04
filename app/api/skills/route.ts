import { fetchLPLData } from '@/lib/skills/esports/lpl-scraper'
import { createClient } from '@/lib/supabase/server'

/**
 * 烽火技能引擎 API 入口
 * 用于协调和触发各类 AI 技能任务
 */
export async function GET() {
    await createClient() // 确保鉴权上下文（Next.js 16 Proxy 会自动处理）

    // 执行 LPL 抓取技能
    const lplResult = await fetchLPLData.execute()

    const skills = [
        {
            id: fetchLPLData.id,
            name: fetchLPLData.name,
            description: fetchLPLData.description,
            status: lplResult.success ? 'active' : 'error',
            lastData: lplResult.data,
            timestamp: lplResult.timestamp
        },
        // 后续可以继续在这里注入更多技能...
    ]

    return Response.json({
        timestamp: new Date().toISOString(),
        owner: 'fenghuo.tv',
        skills: skills
    })
}
