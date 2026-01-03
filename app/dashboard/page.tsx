import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { signOut } from './actions'
import { LayoutDashboard, LogOut, Settings, Plus, Activity } from 'lucide-react'

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // 这里的逻辑其实可以由 Middleware 处理，但为了双重保险我们在这里也判断一下
    if (!user) {
        return redirect('/login')
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* 侧边栏 */}
            <aside className="glass-card" style={{
                width: '280px',
                borderRadius: '0',
                borderLeft: 'none',
                borderTop: 'none',
                borderBottom: 'none',
                padding: '32px 20px',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ marginBottom: '40px', padding: '0 12px' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #fff, var(--text-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FluxVine</h1>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        background: 'var(--glass-bg)',
                        borderRadius: '12px',
                        color: 'var(--accent-primary)',
                        fontWeight: '600'
                    }}>
                        <LayoutDashboard size={20} /> 控制台
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: 'var(--text-secondary)' }}>
                        <Activity size={20} /> 任务监控
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: 'var(--text-secondary)' }}>
                        <Settings size={20} /> 系统设置
                    </div>
                </nav>

                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
                    <div style={{ marginBottom: '16px', padding: '0 12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        {user.email}
                    </div>
                    <form action={signOut}>
                        <button className="premium-btn" style={{
                            width: '100%',
                            background: 'transparent',
                            border: '1px solid var(--glass-border)',
                            justifyContent: 'center'
                        }}>
                            <LogOut size={18} /> 退出登录
                        </button>
                    </form>
                </div>
            </aside>

            {/* 主内容区 */}
            <main style={{ flex: 1, padding: '40px' }}>
                <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>概览</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>欢迎回来，开始管理您的 AI 技能。</p>
                    </div>
                    <button className="premium-btn">
                        <Plus size={18} /> 创建新路径
                    </button>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    <div className="glass-card" style={{ padding: '32px' }}>
                        <h3 style={{ marginBottom: '16px' }}>技能状态</h3>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-secondary)' }}>12</div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>当前活跃技能数量</p>
                    </div>
                    <div className="glass-card" style={{ padding: '32px' }}>
                        <h3 style={{ marginBottom: '16px' }}>每日调用</h3>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-primary)' }}>1,284</div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>近 24 小时请求总数</p>
                    </div>
                </div>
            </main>
        </div>
    )
}
