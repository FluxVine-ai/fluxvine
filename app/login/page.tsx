import { login, signup } from './actions'
import { Mail, Lock, UserPlus, LogIn } from 'lucide-react'

// 按照 2025 年标准定义 PageProps
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function LoginPage(props: {
    searchParams: SearchParams
}) {
    const searchParams = await props.searchParams;
    const message = typeof searchParams.message === 'string' ? searchParams.message : undefined;

    return (
        <div className="home-container">
            <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '48px' }}>
                <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>欢迎回来</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>登录以访问您的 AI 技能引擎</p>
                </div>

                <form>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', textAlign: 'left' }}>
                            邮箱地址
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input name="email" type="email" placeholder="you@example.com" className="input-field" style={{ paddingLeft: '44px' }} required />
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', textAlign: 'left' }}>
                            访问密码
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input name="password" type="password" placeholder="••••••••" className="input-field" style={{ paddingLeft: '44px' }} required />
                        </div>
                    </div>

                    {message && (
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '8px', fontSize: '14px', marginBottom: '20px', border: '1px solid rgba(239, 68, 68, 0.2)', textAlign: 'center' }}>
                            {message}
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button formAction={login} className="premium-btn" style={{ width: '100%', justifyContent: 'center' }}>
                            <LogIn size={18} /> 立即登录
                        </button>
                        <button formAction={signup} className="premium-btn secondary" style={{ width: '100%', justifyContent: 'center' }}>
                            <UserPlus size={18} /> 注册账户
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
