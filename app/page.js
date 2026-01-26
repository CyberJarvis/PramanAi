import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/[0.08] bg-[#0a0f1c]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
              <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Praman AI</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200">
              Login
            </Link>
            <Link
              href="/register"
              className="group relative px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-500 transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-32 lg:pt-56 lg:pb-40 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1c] via-[#0a0f1c]/80 to-[#0a0f1c] z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent_70%)] z-10" />
          <Image
            src="/hero-bg.png"
            alt="Global Data Network"
            fill
            className="object-cover opacity-50"
            priority
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/[0.05] border border-blue-500/20 text-blue-400 text-sm font-medium mb-10 backdrop-blur-sm animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            PSAIML02: Causal AI System
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40 drop-shadow-sm">
            Climate Shock-Driven <br />
            Population Displacement
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-12 leading-relaxed font-light">
            Infer causal relationships between environmental stressors and displacement pathways.
            Separate <span className="text-white font-medium">correlation from causation</span> for evidence-based adaptation planning.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 text-white bg-blue-600 rounded-2xl font-semibold hover:bg-blue-500 transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_20px_60px_-15px_rgba(37,99,235,0.6)] hover:-translate-y-1"
            >
              Launch Platform
            </Link>
            <Link
              href="#objectives"
              className="w-full sm:w-auto px-8 py-4 text-gray-300 bg-white/[0.03] border border-white/[0.08] rounded-2xl font-semibold hover:bg-white/[0.08] hover:text-white transition-all duration-300 backdrop-blur-md hover:-translate-y-1"
            >
              Explore Use Cases
            </Link>
          </div>
        </div>
      </section>

      {/* Objectives Grid */}
      <section id="objectives" className="py-32 relative bg-[#0a0f1c]">
        {/* Section Divider */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">Core Capabilities</h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group p-10 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:border-blue-500/30 transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-2 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.7)]">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Causality vs. Correlation</h3>
              <p className="text-gray-400 leading-relaxed font-light">
                Distinguish true causal drivers from simple correlations in complex climate and migration datasets.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group p-10 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:border-teal-500/30 transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-2 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.7)]">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Nonlinear Responses</h3>
              <p className="text-gray-400 leading-relaxed font-light">
                Model delayed effects and nonlinear tipping points where environmental shocks trigger mass displacement.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group p-10 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:border-purple-500/30 transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-2 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.7)]">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Counterfactual Analysis</h3>
              <p className="text-gray-400 leading-relaxed font-light">
                Simulate "what-if" scenarios under alternative climate policies to predict potential displacement outcomes.
              </p>
            </div>

            {/* Card 4 */}
            <div className="group p-10 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:border-amber-500/30 transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-2 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.7)]">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Confidence Quantification</h3>
              <p className="text-gray-400 leading-relaxed font-light">
                Provide transparent confidence intervals and limitation metrics for every causal conclusion.
              </p>
            </div>

            {/* Card 5 */}
            <div className="group p-10 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:border-emerald-500/30 transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-2 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.7)] md:col-span-2 lg:col-span-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Adaptation Planning</h3>
              <p className="text-gray-400 leading-relaxed font-light">
                Generate actionable evidence suitable for long-term policy making and climate resilience strategies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-16 bg-[#05080f]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Praman AI</span>
            </div>
            <p className="text-gray-500 text-sm max-w-xs">
              Inferring causal relationships for a climate-resilient future.
            </p>
          </div>

          <div className="flex items-center gap-8 text-sm text-gray-500">
            <span className="hover:text-blue-400 transition-colors cursor-pointer">© 2026 Praman AI</span>
            <span className="w-1 h-1 rounded-full bg-gray-700"></span>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
