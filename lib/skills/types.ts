/**
 * Fenghuo Skill Base Interface
 * 烽火技能标准接口 - 2026 模块化架构
 */

export interface SkillResult {
    success: boolean;
    data: any;
    message?: string;
    timestamp: string;
}

export interface BaseSkill {
    id: string;
    name: string;
    description: string;
    execute: (...args: any[]) => Promise<SkillResult>;
}
