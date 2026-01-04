import Link from 'next/link'
import { Activity, Zap, Target, Shield, Trophy } from 'lucide-react'

export default function HomePage() {
    return (
        <main className="home-container" style={{ flexDirection: 'column', justifyContent: 'flex-start', paddingTop: '80px' }}>
            {/* 扫视线背景动效 */}
            <div className="scan-line" />

            {/* Hero Section */}
            <div style={{ maxWidth: '1200px', width: '100%', padding: '0 24px', textAlign: 'center', marginBottom: '80px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '100px', background: 'rgba(255, 77, 0, 0.1)', color: 'var(--fenghuo-orange)', fontWeight: '600', fontSize: '14px', marginBottom: '24px', border: '1px solid rgba(255, 77, 0, 0.2)' }}>
                    <Zap size={16} /> 2026 AI 电竞引擎已就绪
                </div>

                <h1 className="glitch-text" data-text="FENGHUO.TV" style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '24px', color: '#fff' }}>
                    FENGHUO.TV
                </h1>

                <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--fenghuo-text-secondary)', maxWidth: '700px', margin: '0 auto 40px', lineHeight: '1.6' }}>
                    为竞技而生。利用顶级 AI 情报系统，实时捕捉全网电竞动态，<br />
                    为您锁定每一次上分机遇。
                </p>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <Link href="/login" className="premium-btn" style={{ padding: '16px 40px', fontSize: '16px' }}>
                        立即进入控制台
                    </Link>
                    <button className="premium-btn" style={{ background: 'transparent', border: '1px solid var(--fenghuo-border)', padding: '16px 40px', fontSize: '16px' }}>
                        观看 AI 演示
                    </button>
                </div>
            </div>

            {/* 数据流卡片展示区 */}
            <div style={{ maxWidth: '1200px', width: '100%', padding: '0 24px', marginBottom: '100px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    <div className="esports-card">
                        <div className="esports-badge" style={{ marginBottom: '16px' }}>Live Signal</div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Activity size={20} color="var(--fenghuo-orange)" /> 英雄联盟：全球 Meta 波动
                        </h3>
                        <p style={{ color: 'var(--fenghuo-text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                            AI 检测到韩服高端局“卡兹克”胜率异常上升 4.2%，核心装备路径已更新。
                        </p>
                        <div style={{ marginTop: '20px', fontSize: '12px', color: 'var(--fenghuo-accent)', fontWeight: '600' }}>
                            ● 3分钟前更新
                        </div>
                    </div>

                    <div className="esports-card">
                        <div className="esports-badge" style={{ marginBottom: '16px', borderColor: 'var(--fenghuo-accent)' }}>Alpha Prediction</div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Target size={20} color="var(--fenghuo-accent)" /> LPL 夏季赛：战力演算
                        </h3>
                        <p style={{ color: 'var(--fenghuo-text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                            基于近1000场对抗训练，今日揭幕战 BLG 对阵 JDG 的 AI 预测胜率为 58.4%。
                        </p>
                        <div style={{ marginTop: '20px', fontSize: '12px', color: 'var(--fenghuo-accent)', fontWeight: '600' }}>
                            ● 实战命中率 76%
                        </div>
                    </div>

                    <div className="esports-card">
                        <div className="esports-badge" style={{ marginBottom: '16px' }}>Skill Factory</div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Trophy size={20} color="var(--fenghuo-orange)" /> 自动化：高光时刻切片
                        </h3>
                        <p style={{ color: 'var(--fenghuo-text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                            您的专属 AI 剪辑师已就绪。支持一键将直播回放转为 4K 高动态画质短视频。
                        </p>
                        <div style={{ marginTop: '20px', fontSize: '12px', color: 'var(--fenghuo-orange)', fontWeight: '600' }}>
                            ● 极低 API 成本方案
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
