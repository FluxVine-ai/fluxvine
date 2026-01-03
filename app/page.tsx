import Link from "next/link";
import { Sparkles, ArrowRight, Zap, Shield, Globe } from "lucide-react";

export default function HomePage() {
    return (
        <div className="home-container">
            <div className="glass-card main-hero">
                <div className="badge-wrapper">
                    <Sparkles size={16} />
                    <span>FluxVine 2.0 已就绪</span>
                </div>

                <h1 className="gradient-text hero-title">
                    智联万物 <br />
                    创见未来
                </h1>

                <p className="hero-description">
                    基于 Next.js 15 和全新的 Supabase SSR 架构，为您提供最稳健、最流畅的 AI 技能引擎体验。
                </p>

                <div className="button-group">
                    <Link href="/login" className="premium-btn">
                        进入控制台 <ArrowRight size={18} />
                    </Link>
                    <button className="premium-btn secondary">
                        了解更多
                    </button>
                </div>

                <div className="feature-grid">
                    <div className="feature-item">
                        <Zap size={24} color="#0ea5e9" />
                        <h3>极速响应</h3>
                        <p>Server Component 优化，毫秒级开屏。</p>
                    </div>
                    <div className="feature-item">
                        <Shield size={24} color="#10b981" />
                        <h3>安全认证</h3>
                        <p>全新的 SSR 架构，告别登录失效。</p>
                    </div>
                    <div className="feature-item">
                        <Globe size={24} color="#7c3aed" />
                        <h3>全球部署</h3>
                        <p>Vercel Edge Network 驱动。</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
