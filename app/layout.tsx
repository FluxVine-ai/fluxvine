import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "FluxVine | AI-Driven Innovation",
    description: "Next generation AI skill engine and creative platform.",
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
