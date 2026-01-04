import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { Zap, TrendingUp, Shield } from 'lucide-react';
import { loadFont } from "@remotion/google-fonts/Outfit";

const { fontFamily } = loadFont();

interface SignalFlashProps {
    title: string;
    content: string;
    hottestChamp: string;
    trend: string;
    timestamp: string;
}

export const SignalFlash: React.FC<SignalFlashProps> = ({
    title,
    content,
    hottestChamp,
    trend,
    timestamp
}) => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    // 动画曲线
    const entrance = spring({
        frame,
        fps,
        config: { damping: 10.5 },
    });

    const opacity = interpolate(frame, [0, 20], [0, 1]);
    const scale = interpolate(entrance, [0, 1], [0.8, 1]);
    const scanLinePos = interpolate(frame % 60, [0, 60], [-100, 100]);

    return (
        <AbsoluteFill style={{
            backgroundColor: '#0a0a0c',
            fontFamily,
            color: 'white',
            padding: '80px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            overflow: 'hidden'
        }}>
            {/* 动态背景背景扫描 */}
            <div style={{
                position: 'absolute',
                top: `${scanLinePos}%`,
                left: 0,
                width: '100%',
                height: '2px',
                background: '#ff4d00',
                boxShadow: '0 0 20px #ff4d00',
                opacity: 0.2
            }} />

            {/* 标题装饰层 */}
            <div style={{
                opacity,
                transform: `scale(${scale})`,
                borderLeft: '8px solid #ff4d00',
                paddingLeft: '40px',
                marginBottom: '60px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                    <Zap size={48} color="#ff4d00" fill="#ff4d00" />
                    <span style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '4px', color: '#ff4d00' }}>FENGHUO INTELLIGENCE</span>
                </div>
                <h1 style={{ fontSize: '72px', fontWeight: '900', lineHeight: 1.1, margin: 0 }}>{title}</h1>
            </div>

            {/* 核心内容区 */}
            <div style={{
                opacity: interpolate(frame, [30, 50], [0, 1]),
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '60px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                marginBottom: '80px',
                position: 'relative'
            }}>
                <p style={{ fontSize: '40px', lineHeight: 1.6, margin: 0, color: 'rgba(255,255,255,0.9)' }}>
                    {content}
                </p>
            </div>

            {/* 数据指示器 */}
            <div style={{
                display: 'flex',
                gap: '40px',
                opacity: interpolate(frame, [60, 80], [0, 1]),
                transform: `translateY(${interpolate(frame, [60, 80], [20, 0])}px)`
            }}>
                <div style={{ flex: 1, background: 'rgba(0, 255, 157, 0.05)', padding: '40px', border: '1px solid #00ff9d', borderRadius: '4px' }}>
                    <div style={{ color: '#00ff9d', fontSize: '24px', fontWeight: '800', marginBottom: '10px' }}>TRENDING CHAMPING</div>
                    <div style={{ fontSize: '56px', fontWeight: '900' }}>{hottestChamp}</div>
                </div>
                <div style={{ flex: 1, background: 'rgba(255, 77, 0, 0.05)', padding: '40px', border: '1px solid #ff4d00', borderRadius: '4px' }}>
                    <div style={{ color: '#ff4d00', fontSize: '24px', fontWeight: '800', marginBottom: '10px' }}>METRIC ANALYSIS</div>
                    <div style={{ fontSize: '56px', fontWeight: '900' }}>{trend}</div>
                </div>
            </div>

            {/* 底部装饰 */}
            <div style={{
                position: 'absolute',
                bottom: '80px',
                left: '80px',
                right: '80px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                opacity: interpolate(frame, [100, 120], [0, 0.5])
            }}>
                <div>
                    <div style={{ fontSize: '24px', fontWeight: '700' }}>AI BROADCAST ENGINE v2.0</div>
                    <div style={{ fontSize: '18px', color: '#94a3b8' }}>{new Date(timestamp).toLocaleDateString()}</div>
                </div>
                <div style={{ letterSpacing: '4px', fontSize: '24px', fontWeight: '900', color: '#ff4d00' }}>FENGHUO.TV</div>
            </div>
        </AbsoluteFill>
    );
};
