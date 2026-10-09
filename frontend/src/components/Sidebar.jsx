import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  ShieldAlert, 
  SearchCode, 
  Cpu, 
  ShieldCheck, 
  Lightbulb, 
  Upload, 
  FileSpreadsheet,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, data, onUploadClick, onLandingClick }) {
  const filename = data?.filename || 'No file selected';
  const rows = data?.profile?.total_rows ? `${data.profile.total_rows.toLocaleString()} rows` : null;
  const cols = data?.profile?.total_cols ? `${data.profile.total_cols} cols` : null;

  const navItems = [
    { id: 'overview', label: 'Dataset Overview', icon: LayoutDashboard },
    { id: 'quality', label: 'Data Quality', icon: Sparkles, badge: data?.quality?.missing_cells > 0 ? 'Warning' : null },
    { id: 'risks', label: 'Risk Analysis', icon: ShieldAlert, badge: data?.risks?.id_cols_count > 0 ? `${data.risks.id_cols_count} IDs` : null },
    { id: 'leakage', label: 'Data Leakage', icon: SearchCode, badge: data?.leakage?.has_leakage ? 'Detected' : null },
    { id: 'model', label: 'Model Evaluation', icon: Cpu },
    { id: 'trust', label: 'Trust Score', icon: ShieldCheck, highlight: true },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
  ];

  return (
    <aside className="w-64 bg-[#0d131f] border-r border-slate-800/80 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand Logo & Header */}
        <div className="p-5 border-b border-slate-800/80">
          <button 
            onClick={onLandingClick}
            className="flex items-center space-x-3 group text-left w-full focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1">
                ModelTrust <span className="text-cyan-400 font-extrabold text-xs px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/50">AI</span>
              </h1>
              <p className="text-[11px] text-slate-400 truncate">Dataset Reliability Platform</p>
            </div>
          </button>
        </div>

        {/* Current File Info Pill */}
        <div className="px-4 py-3 mx-3 my-3 bg-slate-900/90 border border-slate-800 rounded-xl">
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-300">
            <FileSpreadsheet className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="truncate font-semibold text-slate-200">{filename}</span>
          </div>
          {rows && cols && (
            <p className="text-[11px] text-slate-400 mt-1 pl-6">
              {rows} • {cols}
            </p>
          )}
          <button
            onClick={onUploadClick}
            className="mt-2.5 w-full py-1.5 px-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-xs font-semibold text-blue-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload New File
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-2 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Analysis Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && !isActive && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-4 h-4 opacity-70" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 text-xs text-slate-400">
        <p className="font-medium text-slate-300">ModelTrust AI v1.0</p>
        <p className="text-[11px]">Academic Mini-Project Edition</p>
      </div>
    </aside>
  );
}
