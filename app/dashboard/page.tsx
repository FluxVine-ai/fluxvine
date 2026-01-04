import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { signOut } from './actions'
import { Activity, Zap, Shield, Database, LayoutDashboard, LogOut } from 'lucide-react'
import { fetchLPLData } from '@/lib/skills/esports/lpl-scraper'

// 将页面改为服务端异步组件
export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    // 直接从技能引擎获取实时情报 (不再进行内部 HTTP 请求)
    let skillData: any = null;
    const lplResult = await fetchLPLData.execute();
    if (lplResult.success) {
        skillData = lplResult.data;
    }

    return (
        <div className="home-container" style={{ flexDirection: 'row', alignItems: 'flex-start', padding: '0', background: 'var(--fenghuo-charcoal)' }}>
            {/* 侧边导航栏 */}
            <aside style={{ width: '280px', height: '100vh', background: 'rgba(0,0,0,0.2)', borderRight: '1px solid var(--fenghuo-border)', padding: '40px 24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '48px' }}>
                    <h2 className="glitch-text" data-text="FENGHUO" style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--fenghuo-orange)' }}>FENGHUO</h2>
                    <p style={{ fontSize: '12px', color: 'var(--fenghuo-text-secondary)', marginTop: '4px' }}>AI 竞技指挥部</p>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(255, 77, 0, 0.1)', color: 'var(--fenghuo-orange)', fontWeight: '600' }}>
                        <LayoutDashboard size={20} /> 控制台
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', color: 'var(--fenghuo-text-secondary)', cursor: 'not-allowed' }}>
                        <Activity size={20} /> 实时情报
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', color: 'var(--fenghuo-text-secondary)', cursor: 'not-allowed' }}>
                        <Database size={20} /> 资产中心
                    </div>
                </nav>

                <form action={signOut}>
                    <button type="submit" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
                        <LogOut size={20} /> 退出登录
                    </button>
                </form>
            </aside>

            {/* 主内容区 */}
            <main style={{ flex: 1, height: '100vh', overflowY: 'auto', padding: '40px 60px' }}>
                <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>你好, 指挥官</h1>
                        <p style={{ color: 'var(--fenghuo-text-secondary)' }}>欢迎回到 Fenghuo.tv。当前 AI 核心运行正常。</p>
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div className="esports-badge" style={{ color: 'var(--fenghuo-accent)', borderColor: 'var(--fenghuo-accent)' }}>Server: Online</div>
                        <div className="esports-badge">User: {user.email?.split('@')[0]}</div>
                    </div>
                </header>

                {/* 状态看板 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '48px' }}>
                    <div className="esports-card">
                        <h4 style={{ color: 'var(--fenghuo-text-secondary)', fontSize: '13px', marginBottom: '16px', textTransform: 'uppercase' }}>活跃技能</h4>
                        <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--fenghuo-orange)' }}>02</div>
                        <div style={{ marginTop: '12px', fontSize: '14px', color: 'var(--fenghuo-accent)' }}>● LPL 实时抓取已就绪</div>
                    </div>
                    <div className="esports-card">
                        <h4 style={{ color: 'var(--fenghuo-text-secondary)', fontSize: '13px', marginBottom: '16px', textTransform: 'uppercase' }}>数据吞吐量</h4>
                        <div style={{ fontSize: '2.5rem', fontWeight: '900' }}>1.2k<span style={{ fontSize: '1rem', color: 'var(--fenghuo-text-secondary)' }}>/hr</span></div>
                        <div style={{ marginTop: '12px', fontSize: '14px', color: 'var(--fenghuo-text-secondary)' }}>信号源同步中...</div>
                    </div>
                </div>

                {/* 系统日志 */}
                <section className="esports-card" style={{ padding: '0' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--fenghuo-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>最新的“烽火信号”</h3>
                        <button style={{ color: 'var(--fenghuo-orange)', background: 'transparent', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>查看全部</button>
                    </div>
                    <div style={{ padding: '8px 0' }}>
                        {skillData?.matches?.map((match: any, index: number) => (
                            <div key={index} style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: '600' }}>{match.matchup}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--fenghuo-text-secondary)', marginTop: '4px' }}>{match.description}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '12px', color: 'var(--fenghuo-orange)', fontWeight: '700' }}>{match.date}</div>
                                    <div style={{ fontSize: '10px', color: 'var(--fenghuo-text-secondary)', marginTop: '4px' }}>即将开赛</div>
                                </div>
                            </div>
                        ))}

                        {/* Meta数据动态展示 */}
                        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: '600' }}>AI 核心动态：{skillData?.metaAnalysis?.hottestChamp}</div>
                                <div style={{ fontSize: '12px', color: 'var(--fenghuo-text-secondary)', marginTop: '4px' }}>{skillData?.metaAnalysis?.trend}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '12px', color: 'var(--fenghuo-accent)', fontWeight: '700' }}>ACTIVE</div>
                                <div style={{ fontSize: '10px', color: 'var(--fenghuo-text-secondary)', marginTop: '4px' }}>实时同步</div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
