import { login, signup } from './actions'
import { Mail, Lock, UserPlus, LogIn } from 'lucide-react'

export default function LoginPage({
    searchParams,
}: {
    searchParams: { message: string }
}) {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div className="glass-card" style={{
                width: '100%',
                maxWidth: '440px',
                padding: '48px'
            }}>
                <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>欢迎回来</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>登录以访问您的 AI 技能引擎</p>
                </div>

                <form>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                            邮箱地址
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-secondary)'
                            }} />
                            <input
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                className="input-field"
                                style={{ paddingLeft: '44px' }}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                            访问密码
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-secondary)'
                            }} />
                            <input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                className="input-field"
                                style={{ paddingLeft: '44px' }}
                                required
                            />
                        </div>
                    </div>

                    {searchParams?.message && (
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            padding: '12px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            marginBottom: '20px',
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                        }}>
                            {searchParams.message}
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button formAction={login} className="premium-btn" style={{ width: '100%', justifyContent: 'center' }}>
                            <LogIn size={18} /> 立即登录
                        </button>
                        <button formAction={signup} className="premium-btn" style={{
                            width: '100%',
                            justifyContent: 'center',
                            background: 'transparent',
                            border: '1px solid var(--glass-border)'
                        }}>
                            <UserPlus size={18} /> 注册账户
                        </button>
                    </div>
                </form>

                <p style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    登录即代表您同意我们的服务协议。
                </p>
            </div>
        </div>
    )
}
