"use client";

import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import GlassCard from "@/components/ui/GlassCard";

const PERSONAS = [
    { id: "General", name: "General Analyst", icon: "🤖" },
    { id: "UN Crisis Coordinator", name: "UN Crisis Coordinator", icon: "🇺🇳" },
    { id: "Climate Data Scientist", name: "Climate Data Scientist", icon: "🌍" },
    { id: "Policy Strategist", name: "Policy Strategist", icon: "📋" },
    { id: "Humanitarian Economist", name: "Humanitarian Economist", icon: "💰" },
    { id: "Human Rights Investigator", name: "Human Rights Investigator", icon: "❤️" },
];

export default function IntelligencePage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [persona, setPersona] = useState("General");
    const [uploading, setUploading] = useState(false);
    const [querying, setQuerying] = useState(false);
    const [documents, setDocuments] = useState([]);
    const fileInputRef = useRef(null);

    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/documents/upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                setDocuments([...documents, {
                    name: file.name,
                    pages: result.data.pages,
                    chunks: result.data.chunks
                }]);
                setMessages([...messages, {
                    role: "system",
                    content: `📄 Uploaded: ${file.name} (${result.data.pages} pages, ${result.data.chunks} chunks)`
                }]);
            } else {
                setMessages([...messages, {
                    role: "error",
                    content: `Upload failed: ${result.error}`
                }]);
            }
        } catch (error) {
            setMessages([...messages, {
                role: "error",
                content: `Upload error: ${error.message}`
            }]);
        } finally {
            setUploading(false);
        }
    };

    const handleQuery = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        setMessages([...messages, userMessage]);
        setInput("");
        setQuerying(true);

        try {
            const response = await fetch('/api/documents/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: input, persona })
            });

            const result = await response.json();

            if (result.success) {
                setMessages(prev => [...prev, {
                    role: "assistant",
                    content: result.data.answer,
                    persona: result.data.persona_used,
                    sources: result.data.sources
                }]);
            } else {
                setMessages(prev => [...prev, {
                    role: "error",
                    content: result.error
                }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                role: "error",
                content: error.message
            }]);
        } finally {
            setQuerying(false);
        }
    };

    const selectedPersona = PERSONAS.find(p => p.id === persona);

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Deep Intelligence</h1>
                    <p className="text-gray-400">RAG-powered document analysis with expert personas</p>
                </div>
                <div className="text-right">
                    <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Documents Loaded</div>
                    <div className="text-2xl font-bold text-emerald-400 text-glow">{documents.length}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sidebar Controls */}
                <div className="space-y-6">
                    {/* Document Upload */}
                    <GlassCard className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Upload Documents</h3>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50 shadow-lg shadow-blue-500/20"
                            >
                                {uploading ? "Uploading..." : "+ PDF"}
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleUpload}
                                accept=".pdf"
                                className="hidden"
                            />
                        </div>

                        {documents.length > 0 ? (
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {documents.map((doc, i) => (
                                    <div key={i} className="px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-xs text-emerald-400 flex items-center gap-2">
                                        <span>📄</span>
                                        <span className="truncate flex-1">{doc.name}</span>
                                        <span className="opacity-50">{doc.pages}p</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 border-2 border-dashed border-white/5 rounded-xl">
                                <span className="text-2xl block mb-2 opacity-30">📎</span>
                                <p className="text-xs text-gray-500">No documents loaded</p>
                            </div>
                        )}
                    </GlassCard>

                    {/* Persona Selector */}
                    <GlassCard className="p-5">
                        <div className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Active Analyst Persona</div>
                        <div className="space-y-2">
                            {PERSONAS.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => setPersona(p.id)}
                                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${persona === p.id
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                        : "bg-white/[0.03] text-gray-400 hover:text-white hover:bg-white/[0.05]"
                                        }`}
                                >
                                    <span className="text-lg">{p.icon}</span> {p.name}
                                </button>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                {/* Chat Interface */}
                <div className="lg:col-span-2 flex flex-col h-[600px] border border-white/[0.05] rounded-3xl bg-black/20 backdrop-blur-xl overflow-hidden relative">

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 p-8">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                                    <span className="text-3xl">🧠</span>
                                </div>
                                <h3 className="text-white font-medium mb-2">Deep Intelligence Engine Ready</h3>
                                <p className="text-sm max-w-xs mx-auto text-gray-400">Upload a PDF analyzing crisis reports, then ask complex questions to simulate expert personas.</p>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === "user"
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10 rounded-br-sm"
                                    : msg.role === "error"
                                        ? "bg-red-500/10 border border-red-500/20 text-red-200"
                                        : msg.role === "system"
                                            ? "bg-white/5 text-xs text-gray-400 w-full text-center"
                                            : "bg-white/10 text-gray-100 shadow-lg shadow-black/10 rounded-bl-sm"
                                    }`}>
                                    {msg.role === "assistant" && msg.persona && (
                                        <div className="text-xs text-blue-300 mb-2 font-medium flex items-center gap-1.5 opacity-80">
                                            <span>🎭</span> {msg.persona}
                                        </div>
                                    )}
                                    <div className="prose prose-invert prose-sm max-w-none leading-relaxed">
                                        {msg.role === 'assistant' ? (
                                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                                        ) : (
                                            <p>{msg.content}</p>
                                        )}
                                    </div>

                                    {msg.sources && (
                                        <div className="mt-3 pt-3 border-t border-white/10">
                                            <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 font-semibold">Sources</div>
                                            <div className="space-y-1.5">
                                                {msg.sources.map((s, j) => (
                                                    <div key={j} className="text-xs text-gray-400 bg-black/20 rounded px-2 py-1 truncate">
                                                        <span className="text-blue-400 font-mono text-[10px] mr-1">ID:{s.chunk}</span> {s.preview}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {querying && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3">
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">{selectedPersona?.name} is analyzing...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-black/20 border-t border-white/5">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && !querying && handleQuery()}
                                placeholder="Ask a question about the loaded documents..."
                                className="w-full pl-5 pr-24 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all"
                                disabled={querying || documents.length === 0}
                            />
                            <button
                                onClick={handleQuery}
                                disabled={querying || !input.trim() || documents.length === 0}
                                className="absolute right-2 top-2 bottom-2 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors disabled:opacity-0 disabled:pointer-events-none shadow-lg shadow-blue-500/20"
                            >
                                Ask
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
