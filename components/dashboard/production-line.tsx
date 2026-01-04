'use client'

import React from 'react'
import { Zap } from 'lucide-react'
import WarReportCard from './war-report-card'
import { toPng } from 'html-to-image'

interface ProductionLineProps {
    reportData: any;
}

/**
 * Client-side component for handling the production line interactions
 * 处理战报生产线的交互（如图片导出）
 */
export default function ProductionLine({ reportData }: ProductionLineProps) {
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
                            style={{ width: '100%', marginTop: '24px', fontSize: '13px', justifyContent: 'center' }}
                        >
                            一键生成情报长图 (PNG)
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
