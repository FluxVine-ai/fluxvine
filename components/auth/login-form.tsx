'use client'

import { useState } from 'react'
import { Mail, Lock, UserPlus, LogIn, ArrowLeft } from 'lucide-react'
import { login, signup } from '@/app/login/actions'
import { useRouter, usePathname } from 'next/navigation'

export default function LoginForm({ message }: { message?: string | null }) {
    const [mode, setMode] = useState<'login' | 'signup'>('login')
    const router = useRouter()
    const pathname = usePathname()

    const handleModeSwitch = (newMode: 'login' | 'signup') => {
        setMode(newMode)
        // 切换模式时，利用 router.replace 清除 searchParams 中的旧消息，防止误导用户
        router.replace(pathname)
    }

    return (
        <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '40px' }}>
            <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '4px', marginBottom: '32px' }}>
                <button type="button" onClick={() => handleModeSwitch('login')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: mode === 'login' ? 'var(--fenghuo-orange)' : 'transparent', color: 'white', cursor: 'pointer', fontWeight: '600' }}>账号登录</button>
                <button type="button" onClick={() => handleModeSwitch('signup')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: mode === 'signup' ? 'var(--fenghuo-orange)' : 'transparent', color: 'white', cursor: 'pointer', fontWeight: '600' }}>新用户注册</button>
            </div>

            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '8px' }}>{mode === 'login' ? '欢迎回来' : '创建新账号'}</h2>
                <p style={{ color: 'var(--text-secondary)' }}>{mode === 'login' ? '登录以访问您的 AI 技能引擎' : '开启您的智能工作流'}</p>
            </div>

            <form action={mode === 'login' ? login : signup}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>邮箱地址</label>
                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input name="email" type="email" placeholder="you@example.com" className="input-field" style={{ paddingLeft: '44px' }} required />
                    </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>访问密码</label>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input name="password" type="password" placeholder="••••••••" className="input-field" style={{ paddingLeft: '44px' }} required />
                    </div>
                </div>

                {message && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '8px', fontSize: '14px', marginBottom: '20px', textAlign: 'center' }}>
                        {message}
                    </div>
                )}

                <button type="submit" className="premium-btn" style={{ width: '100%', justifyContent: 'center', height: '48px', background: mode === 'signup' ? 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)' : 'var(--fenghuo-orange)' }}>
                    {mode === 'login' ? <LogIn size={20} /> : <UserPlus size={20} />} {mode === 'login' ? '立即登录' : '确定注册'}
                </button>
            </form>
        </div>
    )
}
