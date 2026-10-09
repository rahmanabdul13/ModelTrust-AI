import React from 'react';
import { Lightbulb, AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import VivaTooltip from '../components/VivaTooltip';

export default function RecommendationsPage({ data }) {
  if (!data) return null;

  const recommendations = data.trust_score?.recommendations || [];

  const getIcon = (type) => {
    switch (type) {
      case 'danger':
        return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />;
      case 'info':
        return <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />;
      case 'success':
      default:
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />;
    }
  };

  const getCardBorder = (type) => {
    switch (type) {
      case 'danger':
        return 'border-rose-900/50 bg-rose-950/20';
      case 'warning':
        return 'border-amber-900/50 bg-amber-950/20';
      case 'info':
        return 'border-cyan-900/50 bg-cyan-950/20';
      case 'success':
      default:
        return 'border-emerald-900/50 bg-emerald-950/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Automated Dataset Recommendations</h3>
            <p className="text-xs text-slate-400">Prioritized actionable advice to fix quality issues and model risks before deployment.</p>
          </div>
        </div>
        <span className="text-xs font-bold text-amber-400 bg-amber-950 px-3 py-1 rounded-full border border-amber-800/50">
          {recommendations.length} Recommendation(s)
        </span>
      </div>

      <VivaTooltip
        title="Why Actionable Recommendations Matter in Machine Learning"
        explanation="Actionable recommendations translate empirical findings (like missingness, identifier features, and collinearity) into explicit data cleaning steps. Following these suggestions ensures the dataset is reliable, unbiased, and ready for production ML training."
      />

      {/* Recommendations Cards List */}
      <div className="space-y-4">
        {recommendations.map((rec, idx) => (
          <div key={idx} className={`p-5 border rounded-2xl shadow-xl flex items-start space-x-4 transition-all ${getCardBorder(rec.type)}`}>
            {getIcon(rec.type)}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-white text-base">{rec.title}</h4>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  {rec.category}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mt-1">{rec.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
