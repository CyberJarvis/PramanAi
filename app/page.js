import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/[0.08] bg-[#0a0f1c]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/Logo.png" alt="Praman AI" className="w-10 h-10 rounded-xl object-cover shadow-[0_0_20px_rgba(59,130,246,0.4)]" />
            <span className="text-xl font-bold tracking-tight">PRAMAN AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#stats" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Impact</a>
            <a href="#partners" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Partners</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Login
            </Link>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl hover:from-blue-500 hover:to-cyan-400 transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              Launch Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-24 lg:pt-44 lg:pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1c] via-transparent to-[#0a0f1c] z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_60%)]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/[0.08] border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                PSAIML02: Causal AI System for Climate Shock–Driven 
                <br></br>
                Population Displacement
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                Climate-Driven
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">
                  Displacement Intelligence
                </span>
              </h1>

              <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-lg">
                Infer causal relationships between environmental shocks and population displacement.
                <span className="text-white"> Separate correlation from causation</span> for evidence-based policy making.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href="/dashboard"
                  className="px-8 py-4 text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl font-semibold hover:from-blue-500 hover:to-cyan-400 transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_20px_60px_-15px_rgba(37,99,235,0.6)] text-center"
                >
                  Launch Platform →
                </Link>
                <a
                  href="#features"
                  className="px-8 py-4 text-gray-300 bg-white/[0.03] border border-white/[0.08] rounded-2xl font-semibold hover:bg-white/[0.08] hover:text-white transition-all duration-300 text-center"
                >
                  Explore Features
                </a>
              </div>

              {/* Mini Stats */}
              <div className="flex gap-8">
                <div>
                  <p className="text-3xl font-bold text-white">20+</p>
                  <p className="text-sm text-gray-500">Countries Tracked</p>
                </div>
                <div className="w-px bg-white/10" />
                <div>
                  <p className="text-3xl font-bold text-white">92%</p>
                  <p className="text-sm text-gray-500">Model Accuracy</p>
                </div>
                <div className="w-px bg-white/10" />
                <div>
                  <p className="text-3xl font-bold text-white">5+</p>
                  <p className="text-sm text-gray-500">Data Sources</p>
                </div>
              </div>
            </div>

            {/* Right - Logo */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl opacity-20 scale-125" />
                {/* Rotating Ring */}
                <div className="absolute inset-[-30px] border-2 border-blue-500/20 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
                <div className="absolute inset-[-60px] border border-cyan-500/10 rounded-full animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />
                {/* Logo */}
                <img
                  src="/Logo.png"
                  alt="PRAMAN AI"
                  className="relative w-[420px] h-[420px] rounded-full object-cover shadow-[0_0_80px_rgba(59,130,246,0.5)] border-4 border-white/10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 border-y border-white/[0.05] bg-gradient-to-r from-blue-500/[0.03] via-transparent to-cyan-500/[0.03]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">2.5M+</p>
              <p className="text-gray-400 mt-2">Displacement Events Analyzed</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">10+</p>
              <p className="text-gray-400 mt-2">Climate Variables</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-400">48h</p>
              <p className="text-gray-400 mt-2">Early Warning Window</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-400">5+</p>
              <p className="text-gray-400 mt-2">Data Sources</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-blue-400 font-semibold text-sm uppercase tracking-wider mb-4">Capabilities</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Causal Intelligence Engine</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Powered by advanced causal inference algorithms and real-time data integration from NASA, UNHCR, and climate monitoring networks.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Cards */}
            <FeatureCard
              icon="🔗"
              color="blue"
              title="Causal Attribution"
              description="Distinguish true causal drivers from correlations in complex climate-migration datasets."
            />
            <FeatureCard
              icon="⚡"
              color="teal"
              title="Tipping Point Detection"
              description="Model nonlinear responses where environmental shocks trigger mass displacement events."
            />
            <FeatureCard
              icon="🔄"
              color="purple"
              title="Counterfactual Scenarios"
              description="Simulate 'what-if' scenarios under alternative climate policies to predict outcomes."
            />
            <FeatureCard
              icon="📊"
              color="amber"
              title="Confidence Metrics"
              description="Transparent confidence intervals and limitation metrics for every causal conclusion."
            />
            <FeatureCard
              icon="🌍"
              color="emerald"
              title="Global Risk Mapping"
              description="Real-time visualization of climate vulnerability and displacement risk across regions."
            />
            <FeatureCard
              icon="🤝"
              color="rose"
              title="Stakeholder Council"
              description="AI-powered multi-perspective policy debates with synthesized recommendations."
            />
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-20 border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-gray-500 text-sm uppercase tracking-wider mb-12">Data Gather From Top Trusted and Leading Organisation</p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-50">
            <span className="text-2xl font-bold text-gray-400">UNHCR</span>
            <span className="text-2xl font-bold text-gray-400">UNDP</span>
            <span className="text-2xl font-bold text-gray-400">World Bank</span>
            <span className="text-2xl font-bold text-gray-400">NASA</span>
            <span className="text-2xl font-bold text-gray-400">UNICEF</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-cyan-600/10" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Make <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">Data-Driven</span> Decisions?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join humanitarian organizations worldwide using causal AI for evidence-based climate adaptation planning.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-10 py-5 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl hover:from-blue-500 hover:to-cyan-400 transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(37,99,235,0.5)]"
          >
            Launch Dashboard
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-16 bg-[#05080f]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src="/Logo.png" alt="PRAMAN AI" className="w-10 h-10 rounded-xl object-cover" />
                <span className="text-xl font-bold">PRAMAN AI</span>
              </div>
              <p className="text-gray-500 max-w-sm leading-relaxed">
                Inferring causal relationships between climate shocks and population displacement for a resilient future.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-4">Platform</p>
              <div className="space-y-3 text-gray-400 text-sm">
                <Link href="/dashboard" className="block hover:text-white transition-colors">Dashboard</Link>
                <Link href="/dashboard/scenarios" className="block hover:text-white transition-colors">Scenario Simulator</Link>
                <Link href="/dashboard/intelligence" className="block hover:text-white transition-colors">Deep Intelligence</Link>
              </div>
            </div>
            <div>
              <p className="font-semibold mb-4">Company</p>
              <div className="space-y-3 text-gray-400 text-sm">
                <a href="#" className="block hover:text-white transition-colors">About</a>
                <a href="#" className="block hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="block hover:text-white transition-colors">Contact</a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">© 2026 PRAMAN AI. All rights reserved.</p>
            <p className="text-gray-600 text-sm">Built for PSAIML02 Hackathon</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, color, title, description }) {
  const colorMap = {
    blue: "border-blue-500/30 bg-blue-500/5",
    teal: "border-teal-500/30 bg-teal-500/5",
    purple: "border-purple-500/30 bg-purple-500/5",
    amber: "border-amber-500/30 bg-amber-500/5",
    emerald: "border-emerald-500/30 bg-emerald-500/5",
    rose: "border-rose-500/30 bg-rose-500/5",
  };

  return (
    <div className={`group p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.7)] ${colorMap[color]}`}>
      <div className="text-4xl mb-6">{icon}</div>
      <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
