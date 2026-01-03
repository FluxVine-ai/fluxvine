
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function SessionDiagnostics() {
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()

    return (
        <div className="min-h-screen bg-slate-900 text-white p-10 font-mono">
            <h1 className="text-3xl font-bold text-yellow-400 mb-6">🍪 Session Diagnostics</h1>

            <div className="bg-black/40 p-6 rounded-xl border border-white/10 mb-8">
                <h2 className="text-xl font-bold text-cyan-400 mb-4">Server-Side Cookies Received</h2>
                <div className="space-y-2">
                    {allCookies.length === 0 ? (
                        <p className="text-red-500">❌ NO COOKIES RECEIVED ON SERVER</p>
                    ) : (
                        allCookies.map(cookie => (
                            <div key={cookie.name} className="flex flex-col gap-1 p-3 bg-white/5 rounded">
                                <span className="text-green-400 font-bold">{cookie.name}</span>
                                <span className="text-slate-400 break-all text-xs">{cookie.value}</span>
                                <div className="flex gap-2 text-[10px] text-slate-500 mt-1">
                                    {cookie.path && <span>Path: {cookie.path}</span>}
                                    {cookie.domain && <span>Domain: {cookie.domain}</span>}
                                    {cookie.secure && <span className="text-red-400">SECURE</span>}
                                    {cookie.httpOnly && <span className="text-blue-400">HttpOnly</span>}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-700/50 p-6 rounded-xl">
                <h3 className="text-yellow-500 font-bold mb-2">Troubleshooting Guide</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-yellow-200/80">
                    <li>If you see cookies above, the Server IS receiving them.</li>
                    <li>If you see NO cookies above, but you are logged in on the client:
                        <ul className="list-circle pl-5 mt-1 text-slate-300">
                            <li>Are you using <strong>http://fluxvine.com</strong>? Browser blocks Secure cookies on HTTP custom domains.</li>
                            <li>I have forced <code>secure: false</code> in the latest update to fix exactly this.</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    )
}
