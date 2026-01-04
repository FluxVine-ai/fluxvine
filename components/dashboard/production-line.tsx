'use client'

import React, { useState } from 'react'
import { Zap, Video, Download, Loader2 } from 'lucide-react'
import WarReportCard from './war-report-card'
import { toPng } from 'html-to-image'

interface ProductionLineProps {
    reportData: any;
}

export default function ProductionLine({ reportData }: ProductionLineProps) {
    const [isRendering, setIsRendering] = useState(false);

    const handleExport = async () => {
        const node = document.getElementById('fenghuo-report-card');
        if (node) {
            try {
                const dataUrl = await toPng(node, { cacheBust: true, quality: 1, pixelRatio: 2 });
                const link = document.createElement('a');
                link.download = `fenghuo-report-${Date.now()}.png`;
                link.href = dataUrl;
                link.click();
            } catch (err) {
                console.error('Export failed:', err);
            }
        }
    };

    const handleVideoRender = async () => {
        setIsRendering(true);
        // 模拟服务端渲染逻辑
        // 实际生产中会调用 /api/skills/video 触发 generateVideo.execute()
        setTimeout(() => {
            setIsRendering(false);
            alert('【模拟任务提交成功】指挥官，视频渲染任务已分发至您的 8 核高性能服务器。由于环境限制，请在命令行运行 `npm run remotion:render` 体验完整渲染。');
        }, 3000);
    };

    return (
        <section>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Zap size={20} color="var(--fenghuo-orange)" /> 自动化战报生产线
            </h3>

            <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <WarReportCard data={reportData} timestamp={new Date().toISOString()} />

                <div style={{ flex: 1, minWidth: '300px' }}>
                    <div className="esports-card">
                        <h4 style={{ marginBottom: '16px', color: 'var(--fenghuo-orange)' }}>生产指令状态</h4>
                        <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', color: 'var(--fenghuo-text-secondary)' }}>
                            <li style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                                <span>● 原始信号解析</span>
                                <span style={{ color: 'var(--fenghuo-accent)' }}>COMPLETED</span>
                            </li>
                            <li style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                                <span>● AI 文案协议填充</span>
                                <span style={{ color: 'var(--fenghuo-accent)' }}>COMPLETED</span>
                            </li>
                            <li style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                                <span>● 视觉图层渲染</span>
                                <span style={{ color: 'var(--fenghuo-orange)' }}>READY FOR EXPORT</span>
                            </li>
                        </ul>

                        <button
                            onClick={handleExport}
                            className="premium-btn"
                            style={{ width: '100%', marginTop: '24px', fontSize: '13px', justifyContent: 'center', gap: '8px' }}
                        >
                            <Download size={14} /> 一键生成情报长图 (PNG)
                        </button>

                        <button
                            disabled={isRendering}
                            onClick={handleVideoRender}
                            className="premium-btn"
                            style={{
                                width: '100%',
                                marginTop: '12px',
                                fontSize: '13px',
                                justifyContent: 'center',
                                gap: '8px',
                                background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                                opacity: isRendering ? 0.6 : 1
                            }}
                        >
                            {isRendering ? <Loader2 size={14} className="animate-spin" /> : <Video size={14} />}
                            {isRendering ? 'AI 视频渲染中...' : '生成 AI 短视频 (MP4)'}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
