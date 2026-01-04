import { registerComposition } from 'remotion';
import { SignalFlash } from './SignalFlash/Composition';

registerComposition('SignalFlash', {
    component: SignalFlash,
    durationInFrames: 150, // 30fps * 5s = 150 frames
    fps: 30,
    width: 1080,
    height: 1920, // 竖屏 9:16，适合抖音/B站短视频
    defaultProps: {
        title: '烽火战报 (FENGHUO.TV)',
        content: 'LPL 春季赛揭幕战深度预警：BLG vs JDG 宿命对决即将打响。AI 监测到卡兹克在韩服高分段的胜率波动已达 +4.2%。',
        hottestChamp: 'Kha\'Zix',
        trend: '+4.2% Win Rate',
        timestamp: new Date().toISOString()
    },
});
