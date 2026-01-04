import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Fenghuo.tv | AI 电竞情报引擎",
    description: "为竞技而生。利用顶级 AI 情报系统，实时捕捉全网电竞动态，为您锁定每一次上分机遇。",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="zh">
            <body>
                <div className="bg-glow" />
                <main>{children}</main>
            </body>
        </html>
    );
}
