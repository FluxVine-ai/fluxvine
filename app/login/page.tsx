'use client'

import { useState, Suspense } from 'react'
import { login, signup } from './actions'
import { Mail, Lock, UserPlus, LogIn, ArrowLeft } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

// 将核心逻辑拆分为子组件，以便包裹在 Suspense 中
function LoginContent() {
    const [mode, setMode] = useState<'login' | 'signup'>('login')
    const searchParams = useSearchParams()
    const message = searchParams.get('message')

    return (
        <div className="glass-card" style={{
            width: '100%',
            maxWidth: '440px',
            padding: '40px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* 顶部切换 Tab */}
            <div style={{
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '4px',
                marginBottom: '32px'
            }}>
                <button
                    onClick={() => setMode('login')}
                    style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        border: 'none',
                        background: mode === 'login' ? 'var(--primary)' : 'transparent',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.3s'
                    }}
                >
                    账号登录
                </button>
                <button
                    onClick={() => setMode('signup')}
                    style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        border: 'none',
                        background: mode === 'signup' ? 'var(--primary)' : 'transparent',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.3s'
                    }}
                >
                    新用户注册
                </button>
            </div>

            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '8px' }}>
                    {mode === 'login' ? '欢迎回来' : '创建新账号'}
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                    {mode === 'login' ? '登录以访问您的 AI 技能引擎' : '几秒钟内开启您的智能工作流'}
                </p>
            </div>

            <form>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', textAlign: 'left' }}>
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
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', textAlign: 'left' }}>
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

                {message && (
                    <div style={{
                        background: mode === 'signup' && message.includes('成功') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: mode === 'signup' && message.includes('成功') ? '#10b981' : '#ef4444',
                        padding: '12px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        marginBottom: '20px',
                        border: mode === 'signup' && message.includes('成功') ? '1px solid rgba(10, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
                        textAlign: 'center'
                    }}>
                        {message}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {mode === 'login' ? (
                        <button formAction={login} className="premium-btn" style={{ width: '100%', justifyContent: 'center', height: '48px' }}>
                            <LogIn size={20} /> 立即登录
                        </button>
                    ) : (
                        <button formAction={signup} className="premium-btn" style={{ width: '100%', justifyContent: 'center', height: '48px', background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)' }}>
                            <UserPlus size={20} /> 确定注册
                        </button>
                    )}
                </div>
            </form>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <button
                    onClick={() => window.location.href = '/'}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        width: '100%',
                        fontSize: '14px'
                    }}
                >
                    <ArrowLeft size={14} /> 返回首页
                </button>
            </div>
        </div>
    )
}

// 导出包装了 Suspense 的主页面
export default function LoginPage() {
    return (
        <div className="home-container">
            <Suspense fallback={<div className="glass-card" style={{ width: '440px', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>加载中...</div>}>
                <LoginContent />
            </Suspense>
        </div>
    )
}
