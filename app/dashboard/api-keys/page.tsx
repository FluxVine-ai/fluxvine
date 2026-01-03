'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ApiKey {
    id: string
    key_name: string
    api_key: string
    created_at: string
    last_used_at: string | null
    is_active: boolean
}

export default function ApiKeysPage() {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)
    const [keyName, setKeyName] = useState('')
    const [newKey, setNewKey] = useState<string | null>(null)

    useEffect(() => {
        fetchApiKeys()
    }, [])

    const fetchApiKeys = async () => {
        const res = await fetch('/api/api-keys')
        const data = await res.json()
        setApiKeys(data.apiKeys || [])
        setLoading(false)
    }

    const createApiKey = async () => {
        setCreating(true)
        const res = await fetch('/api/api-keys', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keyName: keyName || 'Default Key' })
        })
        const data = await res.json()
        setNewKey(data.apiKey.api_key)
        setKeyName('')
        fetchApiKeys()
        setCreating(false)
    }

    const deleteApiKey = async (id: string) => {
        if (!confirm('确定要删除这个 API Key 吗？')) return
        await fetch(`/api/api-keys?id=${id}`, { method: 'DELETE' })
        fetchApiKeys()
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        alert('已复制到剪贴板！')
    }

    if (loading) return <div className="p-8">Loading...</div>

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">API Keys 管理</h1>

                {/* 新建 API Key */}
                <div className="glass p-6 rounded-2xl mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">创建新的 API Key</h2>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={keyName}
                            onChange={(e) => setKeyName(e.target.value)}
                            placeholder="API Key 名称 (可选)"
                            className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                        />
                        <button
                            onClick={createApiKey}
                            disabled={creating}
                            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-bold hover:opacity-90 disabled:opacity-50"
                        >
                            {creating ? '创建中...' : '创建 API Key'}
                        </button>
                    </div>

                    {newKey && (
                        <div className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                            <p className="text-green-400 font-bold mb-2">✅ API Key 创建成功！请立即复制保存：</p>
                            <div className="flex gap-2">
                                <code className="flex-1 px-3 py-2 bg-black/30 rounded text-green-300 text-sm break-all">
                                    {newKey}
                                </code>
                                <button
                                    onClick={() => copyToClipboard(newKey)}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    复制
                                </button>
                            </div>
                            <p className="text-yellow-400 text-sm mt-2">⚠️ 此 Key 只显示一次，请妥善保管！</p>
                        </div>
                    )}
                </div>

                {/* API Keys 列表 */}
                <div className="glass p-6 rounded-2xl">
                    <h2 className="text-xl font-bold text-white mb-4">现有 API Keys</h2>
                    {apiKeys.length === 0 ? (
                        <p className="text-slate-400">暂无 API Keys</p>
                    ) : (
                        <div className="space-y-4">
                            {apiKeys.map((key) => (
                                <div key={key.id} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-white font-bold">{key.key_name}</h3>
                                            <code className="text-slate-400 text-sm">
                                                {key.api_key.substring(0, 20)}...
                                            </code>
                                        </div>
                                        <button
                                            onClick={() => deleteApiKey(key.id)}
                                            className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 text-sm"
                                        >
                                            删除
                                        </button>
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        <p>创建时间: {new Date(key.created_at).toLocaleString('zh-CN')}</p>
                                        {key.last_used_at && (
                                            <p>最后使用: {new Date(key.last_used_at).toLocaleString('zh-CN')}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 使用说明 */}
                <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
                    <h3 className="text-blue-400 font-bold mb-3">📖 如何使用 API Key</h3>
                    <ol className="text-slate-300 text-sm space-y-2 list-decimal list-inside">
                        <li>创建一个新的 API Key 并复制保存</li>
                        <li>在 Chrome 插件中配置此 API Key</li>
                        <li>插件将使用此 Key 调用 FluxVine API</li>
                        <li>如果 Key 泄露，请立即删除并创建新的</li>
                    </ol>
                </div>
            </div>
        </div>
    )
}
