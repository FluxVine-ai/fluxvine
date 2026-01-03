import Link from "next/link";
import { Sparkles, ArrowRight, Zap, Shield, Globe } from "lucide-react";

export default function HomePage() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            textAlign: 'center'
        }}>
            <div className="glass-card" style={{
                padding: '60px 40px',
                maxWidth: '800px',
                width: '100%'
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(124, 58, 237, 0.1)',
                    padding: '8px 16px',
                    borderRadius: '100px',
                    color: 'var(--accent-primary)',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '24px'
                }}>
                    <Sparkles size={16} />
                    <span>FluxVine 2.0 已就绪</span>
                </div>

                <h1 className="gradient-text" style={{
                    fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                    fontWeight: '800',
                    lineHeight: '1.1',
                    marginBottom: '24px',
                    letterSpacing: '-0.02em'
                }}>
                    智联万物 <br />
                    创见未来
                </h1>

                <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1.1rem',
                    lineHeight: '1.6',
                    maxWidth: '600px',
                    margin: '0 auto 40px'
                }}>
                    基于 Next.js 15 和全新的 Supabase SSR 架构，为您提供最稳健、最流畅的 AI 技能引擎体验。
                </p>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <Link href="/login" style={{ textDecoration: 'none' }}>
                        <button className="premium-btn">
                            进入控制台 <ArrowRight size={18} />
                        </button>
                    </Link>
                    <button className="premium-btn" style={{
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)'
                    }}>
                        了解更多
                    </button>
                </div>

                <div style={{
                    marginTop: '60px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '24px',
                    paddingTop: '40px',
                    borderTop: '1px solid var(--glass-border)'
                }}>
                    <div style={{ textAlign: 'left' }}>
                        <Zap size={24} style={{ color: var(--accent-secondary), marginBottom: '12px' }} />
                        <h3 style={{ marginBottom: '8px' }}>极速响应</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Server Component 优化，毫秒级开屏。</p>
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <Shield size={24} style={{ color: '#10b981', marginBottom: '12px' }} />
                        <h3 style={{ marginBottom: '8px' }}>安全认证</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>全新的 SSR 架构，告别登录失效。</p>
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <Globe size={24} style={{ color: var(--accent-primary), marginBottom: '12px' }} />
                        <h3 style={{ marginBottom: '8px' }}>全球部署</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Vercel Edge Network 驱动。</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 修正一个样式变量引用的小错误
const varToString = (v: string) => v; 
