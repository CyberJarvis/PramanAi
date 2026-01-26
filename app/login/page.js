"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login failed");
                return;
            }

            router.push("/dashboard");
            router.refresh();
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-full max-w-md mx-auto p-8 rounded-2xl shadow-md border border-gray-100 bg-white">
                {/* Back Link */}
                <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </Link>
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h1>
                    <p className="text-gray-500">Welcome back! Please enter your details</p>
                </div>

                {/* Demo Credentials Box */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8">
                    <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-3">Demo Credentials</p>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setEmail("admin@example.com");
                                setPassword("password123");
                            }}
                            className="flex flex-col items-start p-3 bg-white border border-blue-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all text-left"
                        >
                            <div className="flex items-center gap-1.5 mb-1">
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                <span className="text-sm font-bold text-gray-900">Admin</span>
                            </div>
                            <span className="text-xs text-gray-500">admin@example.com</span>
                            <span className="text-xs text-gray-400 mt-0.5">pass: password123</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setEmail("user@example.com");
                                setPassword("password123");
                            }}
                            className="flex flex-col items-start p-3 bg-white border border-blue-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all text-left"
                        >
                            <div className="flex items-center gap-1.5 mb-1">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                <span className="text-sm font-bold text-gray-900">User</span>
                            </div>
                            <span className="text-xs text-gray-500">user@example.com</span>
                            <span className="text-xs text-gray-400 mt-0.5">pass: password123</span>
                        </button>
                    </div>
                </div>

                {/* Google Button */}
                <button type="button" className="btn-google mb-6">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>
                {/* Divider */}
                <div className="divider mb-6">OR</div>
                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm flex items-center gap-3">
                        <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address"
                            className="input-field"
                            required
                        />
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="input-field"
                            style={{ paddingRight: '48px' }}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {/* Forgot Password */}
                    <div className="text-right">
                        <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            Forgot password?
                        </a>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </span>
                        ) : (
                            "Sign in"
                        )}
                    </button>
                </form>
                {/* Register Link */}
                <p className="mt-8 text-center text-gray-600">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}