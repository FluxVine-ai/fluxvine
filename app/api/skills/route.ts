import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function GET() {
    const supabase = await createClient()

    // 1. 获取当前电竞情报数据（模拟从真实数据库或缓存获取）
    // 后期这里将对接真正的 Scraper 爬虫逻辑
    const mockSkills = [
        {
            id: 'lol-meta',
            name: '英雄联盟：全球 Meta 监控',
            status: 'active',
            lastUpdate: '3分钟前',
            data: '韩服高端局“卡兹克”胜率异常上升 4.2%'
        },
        {
            id: 'lpl-predict',
            name: 'LPL 夏季赛：战力演算',
            status: 'active',
            lastUpdate: '10分钟前',
            data: '今日揭幕战 BLG 胜率预测 58.4%'
        }
    ]

    return Response.json({
        timestamp: new Date().toISOString(),
        owner: 'fenghuo.tv',
        skills: mockSkills
    })
}
