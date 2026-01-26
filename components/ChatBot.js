"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const PERSONAS = [
    { id: "UN Crisis Coordinator", name: "UN Crisis Coordinator", icon: "🇺🇳" },
    { id: "Climate Data Scientist", name: "Climate Data Scientist", icon: "🌍" },
    { id: "Policy Strategist", name: "Policy Strategist", icon: "📋" },
    { id: "Humanitarian Economist", name: "Humanitarian Economist", icon: "💰" },
    { id: "Human Rights Investigator", name: "Human Rights Investigator", icon: "❤️" },
];

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [persona, setPersona] = useState(PERSONAS[0]);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = { role: "user", content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: input, persona: persona.id })
            });

            const result = await response.json();

            if (result.success) {
                const dataSources = result.data.data_sources?.length > 0
                    ? `\n\n📊 *Data sources: ${result.data.data_sources.join(", ")}*`
                    : "";

                setMessages(prev => [...prev, {
                    role: "assistant",
                    content: result.data.answer + dataSources,
                    persona: result.data.persona_used,
                    country: result.data.country_detected
                }]);
            } else {
                setMessages(prev => [...prev, {
                    role: "assistant",
                    content: `Error: ${result.error}. Make sure the Python backend is running.`,
                    persona: "System"
                }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "Connection error. Please ensure the backend service is running.",
                persona: "System"
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all duration-300 hover:scale-105 flex items-center justify-center z-50 border border-white/20"
            >
                {isOpen ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                )}
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-[#0b0c15]/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 flex flex-col z-50 overflow-hidden animation-slide-up">
                    {/* Header */}
                    <div className="p-4 border-b border-white/10 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-white font-bold tracking-tight flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                AI Analyst
                            </h3>
                            <select
                                value={persona.id}
                                onChange={(e) => setPersona(PERSONAS.find(p => p.id === e.target.value))}
                                className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-gray-300 focus:outline-none focus:border-blue-500/50"
                            >
                                {PERSONAS.map(p => (
                                    <option key={p.id} value={p.id} className="bg-gray-900">
                                        {p.icon} {p.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <p className="text-xs text-gray-400 px-1">
                            Use specialized personas for deeper insights into crisis data.
                        </p>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                        {messages.length === 0 && (
                            <div className="text-center text-gray-500 py-12">
                                <span className="text-4xl mb-3 block opacity-50">🤖</span>
                                <p className="text-sm font-medium text-gray-400">PRAMAN AI Assistant</p>
                                <p className="text-xs mt-2 text-gray-600">Ask about displacement trends, risk factors, or regional summaries.</p>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 rounded-br-sm'
                                    : 'bg-white/10 text-gray-200 rounded-bl-sm border border-white/5'
                                    }`}>
                                    {msg.role === 'assistant' && msg.persona && (
                                        <div className="text-[10px] text-blue-300 mb-1.5 font-bold uppercase tracking-wider opacity-70">
                                            {msg.persona}
                                        </div>
                                    )}
                                    <div className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
                                        {msg.role === 'assistant' ? (
                                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                                        ) : (
                                            msg.content
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 rounded-2xl rounded-bl-md px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-white/10 bg-black/20">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                                className="px-4 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
