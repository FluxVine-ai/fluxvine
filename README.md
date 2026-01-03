# FluxVine 2.0 - 建站说明

## 1. Vercel 环境变量配置
在 Vercel 后台添加以下变量：
- `NEXT_PUBLIC_SUPABASE_URL`: `https://sdaxjpuagyagwhzpdszu.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `sb_publishable_ylCGjQlmRcogdMuaDW-KhA_B8eL8dCz`
- `NEXT_PUBLIC_SITE_URL`: `https://www.fluxvine.com` (生产环境)

## 2. Supabase 后台关键配置 (重要)
请在 Supabase Dashboard -> Authentication -> URL Configuration 进行如下设置：

- **Site URL**: `https://www.fluxvine.com`
- **Redirect URLs**:
  - `https://www.fluxvine.com/**`
  - `http://localhost:3000/**`

## 3. 为什么这次不会掉登录？
1. **Middleware 刷新**: 我们在 `middleware.ts` 中拦截了所有页面请求，通过 `supabase.auth.getUser()` 强制刷新 Session。
2. **Cookie 同步**: 使用 `@supabase/ssr`，认证信息存储在浏览器安全 Cookie 中，且在服务端和客户端之间自动同步。
3. **域名一致性**: 确保 Vercel 中的 `fluxvine.com` 全部重定向到 `www.fluxvine.com`，避免 Cookie 在不同子域间丢失。

---
FluxVine 2.0 - Built by Antigravity
