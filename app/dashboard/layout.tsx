
// 这是一个纯粹的包装器，不再进行严格的服务端拦截
// 我们将验证逻辑移交给客户端页面，这样更能容忍 Cookie 传输问题
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            {children}
        </>
    )
}
