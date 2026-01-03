# FluxVine SaaS 环境配置指南

为了让您的商业化 SaaS 正式转起来，您需要在 Vercel 或本地 `.env.local` 中配置以下环境变量：

### 1. 必填变量
| 变量名 | 说明 | 获取位置 |
| :--- | :--- | :--- |
| `DEEPSEEK_API_KEY` | DeepSeek AI 的密钥 | DeepSeek 控制台 |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 数据库地址 | Supabase Project Settings -> API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | Supabase Project Settings -> API |

### 2. 数据库初始化 (SQL)
请在 Supabase 的 **SQL Editor** 中运行 `supabase_schema.sql` 文件中的代码。这会为您创建：
*   **profiles 表**：存储用户积分（默认送 50 点）和会员等级。
*   **自动触发器**：每当有新用户注册，自动在 profiles 表生成一条数据。

### 3. 下一步
完成配置后，Dashboard 里的“剩余积分”将变成实时读取。
我们需要进一步实现：
1. **GitHub 推送** 以同步最新的代码到 Vercel。
2. **中间件配置** 以保护 `/dashboard` 页面必须登录可见。
