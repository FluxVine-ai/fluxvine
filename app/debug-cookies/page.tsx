
import { cookies, headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function DebugCookies() {
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    const headerList = await headers()

    return (
        <div className="p-8 bg-slate-900 text-white min-h-screen font-mono">
            <h1 className="text-2xl font-bold text-yellow-500 mb-4">Debug Cookies (Server Side)</h1>

            <div className="mb-8">
                <h2 className="text-xl font-bold text-cyan-400 mb-2">Cookies Received:</h2>
                <pre className="bg-black/50 p-4 rounded text-sm overflow-auto">
                    {JSON.stringify(allCookies, null, 2)}
                </pre>
            </div>

            <div>
                <h2 className="text-xl font-bold text-pink-400 mb-2">Request Headers:</h2>
                <div className="bg-black/50 p-4 rounded text-sm overflow-auto">
                    {Array.from(headerList.entries()).map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                            <span className="text-slate-400">{key}:</span>
                            <span className="break-all">{value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
