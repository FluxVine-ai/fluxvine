'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DiagnosticPage() {
    const [info, setInfo] = useState<any>({})

    useEffect(() => {
        const supabase = createClient()

        const checkConfig = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            setInfo({
                hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
                hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
                hasSession: !!session,
                sessionPreview: session ? JSON.stringify(session).substring(0, 100) + '...' : 'No session',
            })
        }

        checkConfig()
    }, [])

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">FluxVine Diagnostic</h1>
            <div className="space-y-2 font-mono text-sm">
                <div>Has Supabase URL: {info.hasSupabaseUrl ? '✅' : '❌'}</div>
                <div>Has Supabase Key: {info.hasSupabaseKey ? '✅' : '❌'}</div>
                <div>Supabase URL: {info.supabaseUrl || 'Not set'}</div>
                <div>Has Session: {info.hasSession ? '✅' : '❌'}</div>
                <div>Session: {info.sessionPreview}</div>
            </div>
        </div>
    )
}
