import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { signOut } from './actions'
import { LayoutDashboard, LogOut, Settings, Plus, Activity } from 'lucide-react'

// Dashboard 通常不带参数，但为了符合 2025 规范，我们也加上类型占位
export default async function DashboardPage() {
    const supabase = await createClient()

    // 这里的调用也是异步的
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <aside className="glass-card" style={{ width: '280px', borderRadius: '0', borderLeft: 'none', borderTop: 'none', borderBottom: 'none', padding: '32px 20px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '40px', padding: '0 12px' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800' }}>FluxVine</h1>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', color: '#7c3aed', fontWeight: '600' }}>
                        <LayoutDashboard size={20} /> 控制台
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#a1a1aa' }}>
                        <Activity size={20} /> 任务监控
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#a1a1aa' }}>
                        <Settings size={20} /> 系统设置
                    </div>
                </nav>

                <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '20px' }}>
                    <div style={{ marginBottom: '16px', padding: '0 12px', fontSize: '14px', color: '#a1a1aa' }}>
                        {user.email}
                    </div>
                    <form action={signOut}>
                        <button className="premium-btn" style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.1)', justifyContent: 'center' }}>
                            <LogOut size={18} /> 退出登录
                        </button>
                    </form>
                </div>
            </aside>

            <main style={{ flex: 1, padding: '40px' }}>
                <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>概览</h2>
                        <p style={{ color: '#a1a1aa' }}>欢迎回来，开始管理您的 AI 技能。</p>
                    </div>
                    <button className="premium-btn"><Plus size={18} /> 创建新路径</button>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    <div className="glass-card" style={{ padding: '32px' }}>
                        <h3 style={{ marginBottom: '16px' }}>技能状态</h3>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0ea5e9' }}>12</div>
                        <p style={{ color: '#a1a1aa', fontSize: '14px' }}>当前活跃技能数量</p>
                    </div>
                    <div className="glass-card" style={{ padding: '32px' }}>
                        <h3 style={{ marginBottom: '16px' }}>每日调用</h3>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: '#7c3aed' }}>1,284</div>
                        <p style={{ color: '#a1a1aa', fontSize: '14px' }}>近 24 小时请求总数</p>
                    </div>
                </div>
            </main>
        </div>
    )
}
