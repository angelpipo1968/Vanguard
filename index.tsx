import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { 
  Shield, 
  Search, 
  Activity, 
  AlertTriangle, 
  Settings, 
  FileText, 
  Lock,
  ChevronRight,
  Loader2,
  Globe,
  ExternalLink,
  Moon,
  Sun,
  Terminal,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Components ---

const Badge = ({ variant = 'info', children }: { variant?: 'success' | 'error' | 'warning' | 'info', children: React.ReactNode }) => {
  const styles = {
    success: 'bg-status-success/10 text-status-success border-status-success/20',
    error: 'bg-status-error/10 text-status-error border-status-error/20',
    warning: 'bg-status-warning/10 text-status-warning border-status-warning/20',
    info: 'bg-status-info/10 text-status-info border-status-info/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${styles[variant]}`}>
      {children}
    </span>
  );
};

const Header = ({ isDarkMode, onToggleDark }: any) => (
  <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between glass-demo border-b border-slate-200/30 dark:border-slate-800/30">
    <div className="flex items-center space-x-2">
      <div className="bg-brand-accent p-1.5 rounded-lg shadow-lg shadow-brand-accent/20">
        <Shield className="text-white" size={20} />
      </div>
      <span className="font-extrabold text-xl tracking-tighter dark:text-white">VANGUARD</span>
    </div>
    
    <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-500 dark:text-slate-400">
      <a href="#" className="hover:text-brand-cta transition-colors">Platform</a>
      <a href="#" className="hover:text-brand-cta transition-colors">Intelligence</a>
      <a href="#" className="hover:text-brand-cta transition-colors">Docs</a>
    </div>

    <div className="flex items-center space-x-4">
      <button 
        onClick={onToggleDark}
        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-brand-cta transition-colors"
        aria-label="Toggle Theme"
      >
        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <button className="px-5 py-2 bg-brand-primary dark:bg-brand-accent text-white rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95">
        Get Started
      </button>
    </div>
  </nav>
);

const App = () => {
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [demoTab, setDemoTab] = useState<'intel' | 'analysis'>('intel');
  const [intelligence, setIntelligence] = useState<any>(null);
  const [analysisInput, setAnalysisInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('Active APT groups targeting financial sectors');
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  const fetchIntelligence = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Provide a critical executive summary for: ${searchQuery}. Highlight technical markers and active campaigns.`,
        config: { tools: [{ googleSearch: {} }] },
      });
      
      const text = response.text || "No intelligence found.";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      setIntelligence({ text, chunks });
      
      // Auto-scroll to result on mobile
      if (window.innerWidth < 768) {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      setIntelligence({ text: "Intelligence engine timeout. Please retry.", chunks: [] });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, loading]);

  const analyzeIncident = async () => {
    if (!analysisInput.trim() || loading) return;
    setLoading(true);
    setAnalysisResult(null);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Forensic Analysis of: \n\n ${analysisInput} \n\n Provide RISK SCORE, VECTOR, and MITIGATION.`,
      });
      setAnalysisResult(response.text || "Empty analysis.");
    } catch (error) {
      setAnalysisResult("Analysis engine failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Header isDarkMode={isDarkMode} onToggleDark={toggleDarkMode} />

      {/* Hero Section */}
      <section className="pt-32 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-brand-accent/10 rounded-full border border-brand-accent/20 mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
          <Sparkles size={14} className="text-brand-accent" />
          <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">Powered by Gemini Pro & Flash</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tighter mb-6 leading-tight">
          Secure your perimeter with <span className="text-brand-cta underline decoration-brand-accent/30">Intelligence.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto font-medium">
          Vanguard autonomously maps, analyzes, and neutralizes threats before they reach your network edge. 
          Built for the modern secure enterprise.
        </p>

        {/* Live Demo Container */}
        <div className="relative group max-w-4xl mx-auto animate-in zoom-in-95 duration-700 delay-200">
          {/* Decorative background glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-cta to-brand-accent rounded-[2.5rem] blur opacity-15 group-hover:opacity-25 transition duration-1000"></div>
          
          <div className="relative bg-white dark:bg-brand-primary rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden glass-demo">
            {/* Demo Header Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800">
              <button 
                onClick={() => setDemoTab('intel')}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 text-xs font-bold uppercase tracking-widest transition-all ${demoTab === 'intel' ? 'text-brand-cta border-b-2 border-brand-cta bg-slate-50 dark:bg-slate-800/30' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
              >
                <Globe size={14} />
                <span>Threat Intelligence</span>
              </button>
              <button 
                onClick={() => setDemoTab('analysis')}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 text-xs font-bold uppercase tracking-widest transition-all ${demoTab === 'analysis' ? 'text-brand-cta border-b-2 border-brand-cta bg-slate-50 dark:bg-slate-800/30' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
              >
                <Terminal size={14} />
                <span>Forensics Lab</span>
              </button>
            </div>

            <div className="p-6 md:p-10">
              {demoTab === 'intel' ? (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search CVEs, domains, or actors..."
                        className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:ring-2 ring-brand-cta/20 outline-none transition-all dark:text-white"
                      />
                    </div>
                    <button 
                      onClick={fetchIntelligence}
                      disabled={loading}
                      className="px-8 py-4 bg-brand-cta text-white rounded-2xl font-bold shadow-xl shadow-brand-cta/20 hover:bg-brand-cta/90 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                      <span>Scan Intelligence</span>
                    </button>
                  </div>

                  <div ref={resultRef} className="min-h-[200px] bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 text-left">
                    {loading && !intelligence ? (
                      <div className="flex flex-col items-center justify-center h-48 space-y-4">
                        <Loader2 className="animate-spin text-brand-cta" size={32} />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Accessing Global Signals...</p>
                      </div>
                    ) : intelligence ? (
                      <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="flex items-center space-x-2">
                          <Badge variant="success">Verified Report</Badge>
                          <span className="text-[10px] text-slate-400 font-bold">Latency: 2.1s</span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                          {intelligence.text}
                        </p>
                        
                        {intelligence.chunks?.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                            {intelligence.chunks.slice(0, 4).map((chunk: any, i: number) => chunk.web && (
                              <a 
                                key={i} href={chunk.web.uri} target="_blank" rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-brand-cta transition-colors group"
                              >
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{chunk.web.title || 'Source'}</span>
                                <ExternalLink size={12} className="text-slate-300 group-hover:text-brand-cta" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-48 flex flex-col items-center justify-center text-slate-300 dark:text-slate-600">
                        <Activity size={48} className="mb-4 opacity-50" />
                        <p className="text-sm font-semibold">Enter a prompt to start the intelligence feed.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Forensic Log Ingestion</label>
                    <textarea 
                      value={analysisInput}
                      onChange={(e) => setAnalysisInput(e.target.value)}
                      placeholder="Paste firewall logs, JSON payloads, or packet headers here..."
                      className="w-full h-40 bg-slate-950 text-emerald-500 font-mono text-xs p-6 rounded-2xl border border-slate-800 focus:ring-2 ring-brand-accent/50 outline-none scrollbar-hide"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button 
                      onClick={analyzeIncident}
                      disabled={loading || !analysisInput}
                      className="px-8 py-3 bg-slate-900 text-white dark:bg-brand-accent rounded-xl font-bold shadow-lg flex items-center space-x-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                      {loading ? <Loader2 size={18} className="animate-spin" /> : <Cpu size={18} />}
                      <span>Analyze Payload</span>
                    </button>
                  </div>

                  {analysisResult && (
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-left animate-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center space-x-2 mb-4">
                        <Lock className="text-status-error" size={16} />
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase">Diagnostic Output</h4>
                      </div>
                      <div className="prose prose-slate dark:prose-invert max-w-none text-xs font-mono text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                        {analysisResult}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tighter">99.98%</div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Uptime Guaranteed</p>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tighter">4.2M</div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Threats Neutralized</p>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tighter">&lt; 100ms</div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Global Ingestion Latency</p>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-6 bg-white dark:bg-brand-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Uncompromising Security Architecture</h2>
            <p className="text-slate-500 dark:text-slate-400">Deployed globally. Managed centrally.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Semantic Grounding', desc: 'Real-time threat feeds grounded in global OSINT repositories.', icon: Globe },
              { title: 'Autonomous Response', desc: 'Self-healing infrastructure that scales to mitigate intrusion attempts.', icon: Shield },
              { title: 'Zero-Trust Protocol', desc: 'Hardware-level encryption for every packet in your VPC.', icon: Lock },
              { title: 'API-First Design', desc: 'Integrate seamlessly with your existing CI/CD pipelines.', icon: Settings },
              { title: 'Edge Analytics', desc: 'Process and alert on anomalies directly at the point of ingestion.', icon: Activity },
              { title: 'Deep Forensics', desc: 'Automated post-mortem analysis for every security incident.', icon: AlertTriangle },
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-brand-accent/30 transition-all hover:shadow-xl hover:shadow-brand-accent/5 group">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-6 text-brand-cta group-hover:scale-110 transition-transform">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="pt-24 pb-12 px-6 border-t border-slate-100 dark:border-slate-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center space-x-2">
            <div className="bg-brand-accent p-1.5 rounded-lg">
              <Shield className="text-white" size={20} />
            </div>
            <span className="font-extrabold text-lg dark:text-white">VANGUARD</span>
          </div>
          <div className="flex space-x-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-brand-cta">Privacy</a>
            <a href="#" className="hover:text-brand-cta">Terms</a>
            <a href="#" className="hover:text-brand-cta">Contact</a>
          </div>
          <p className="text-xs text-slate-400 font-medium">© 2025 Vanguard Intelligence Platform. Built with Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
