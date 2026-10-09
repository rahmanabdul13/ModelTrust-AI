import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  Upload, 
  ArrowRight, 
  Cpu, 
  FileSpreadsheet,
  Zap,
  BarChart3
} from 'lucide-react';

export default function LandingPage({ onUploadClick, onLoadSample, samples }) {
  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight">ModelTrust <span className="text-cyan-400">AI</span></span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onUploadClick}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/25 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Dataset</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Intelligent ML Dataset Reliability & Model Validation Platform</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Understand whether your dataset is ready for <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">reliable machine learning.</span>
          </h1>
          
          <p className="text-lg text-slate-300 leading-relaxed mb-8">
            Automatically detect missing values, ID feature traps, correlated predictors, data leakage, and train baseline Logistic or Linear Regression models with a composite Trust Score.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onUploadClick}
              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold rounded-xl shadow-xl shadow-blue-500/20 flex items-center space-x-2.5 text-base transition-all transform hover:-translate-y-0.5"
            >
              <Upload className="w-5 h-5" />
              <span>Upload Dataset (CSV / XLSX)</span>
              <ArrowRight className="w-4 h-4 opacity-70" />
            </button>
          </div>
        </div>

        {/* Feature Cards Grid (3 Cards as specified in prompt) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Card 1: Data Quality */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/40 transition-all shadow-xl group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">1. Data Quality</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              "Detect missing values, duplicates and constant columns."
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Auto-delimiter detection (comma, semicolon, tab)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero-variance column identification</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Risk Detection */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 hover:border-cyan-500/40 transition-all shadow-xl group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">2. Risk Detection</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              "Identify risky features and possible data leakage."
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>ID & high-uniqueness column warnings</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Target leakage & similarity detection</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Trust Score */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 hover:border-emerald-500/40 transition-all shadow-xl group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">3. Trust Score</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              "Measure dataset and model reliability."
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Weighted 0–100 composite score</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Baseline Logistic / Linear Regression evaluation</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Quick Viva Try Out / Sample Datasets */}
        {samples && samples.length > 0 && (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 text-center max-w-4xl mx-auto">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-cyan-400 mb-2 flex items-center justify-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span>Instant Viva Demonstration Datasets</span>
            </h4>
            <p className="text-xs text-slate-400 mb-6">Click any pre-packaged sample dataset to instantly test the platform without uploading a file:</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {samples.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => onLoadSample(sample.id)}
                  className="p-4 bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/40 rounded-xl text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/50">
                      {sample.type}
                    </span>
                    <FileSpreadsheet className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
                  </div>
                  <h5 className="font-semibold text-sm text-white mb-1">{sample.name}</h5>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{sample.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-400">
        <p>© 2026 ModelTrust AI – Academic Mini-Project & Viva Demonstration Platform.</p>
      </footer>
    </div>
  );
}
