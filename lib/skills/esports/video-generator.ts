import { BaseSkill, SkillResult } from '../types'
import { exec } from 'child_process'
import path from 'path'
import fs from 'fs'

/**
 * AI Video Generation Skill
 * 视频自动化工厂技能 - 调用 Remotion 渲染引擎产出 MP4
 */
export const generateVideo: BaseSkill = {
    id: 'generate-video',
    name: 'AI 电竞视频合成',
    description: '调用 Remotion 命令，将实时数据渲染为 9:16 短视频资产',

    async execute(inputData: any): Promise<SkillResult> {
        try {
            // 准备渲染参数（将数据序列化为默认属性或通过环境变量传递）
            // 在生产环境中，我们会把 inputData 写入临时文件供 Remotion 读取
            const outputDir = path.join(process.cwd(), 'out');
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir);
            }

            const outputFile = `signal-flash-${Date.now()}.mp4`;
            const outputPath = path.join(outputDir, outputFile);

            // 核心命令：调用 remotion render
            // 注意：这里我们使用了 package.json 中定义的脚本逻辑
            const command = `npx remotion render SignalFlash remotion/Root.tsx ${outputPath} --props='${JSON.stringify(inputData)}'`;

            return new Promise((resolve) => {
                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        console.error('Remotion render error:', stderr);
                        resolve({
                            success: false,
                            data: null,
                            message: `视频合成失败: ${error.message}`,
                            timestamp: new Date().toISOString()
                        });
                        return;
                    }

                    resolve({
                        success: true,
                        data: {
                            url: `/out/${outputFile}`,
                            filename: outputFile,
                            size: 'Approx. 5MB',
                            duration: '5s'
                        },
                        timestamp: new Date().toISOString()
                    });
                });
            });
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: '视频生产协议异常',
                timestamp: new Date().toISOString()
            }
        }
    }
}
