import React from 'react';
import { ShieldCheck, Sparkles, ShieldAlert, SearchCode, Cpu, ArrowRight, Lightbulb } from 'lucide-react';
import VivaTooltip from '../components/VivaTooltip';

export default function TrustScore({ data, onGoToRecommendations }) {
  if (!data) return null;

  const trustRes = data.trust_score || {};
  const overallScore = trustRes.overall_score || 0;
  const trustLevel = trustRes.trust_level || 'High Trust';
  const badge = trustRes.level_badge || '🟢';
  const levelCode = trustRes.level_code || 'high';
  const breakdown = trustRes.breakdown || {};
  const recommendations = trustRes.recommendations || [];

  const getScoreColorClass = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20';
    if (score >= 60) return 'text-amber-400 border-amber-500/30 bg-amber-950/20';
    return 'text-rose-400 border-rose-500/30 bg-rose-950/20';
  };

  const getProgressColorClass = (score) => {
    if (score >= 80) return 'bg-gradient-to-r from-emerald-500 to-cyan-400';
    if (score >= 60) return 'bg-gradient-to-r from-amber-500 to-yellow-400';
    return 'bg-gradient-to-r from-rose-600 to-red-400';
  };

  return (
    <div className="space-y-8">
      {/* Visual Hero Card for Trust Score */}
      <div className="bg-gradient-to-b from-[#111827] to-[#0d131f] border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center">
        {/* Ambient glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>MODELTRUST SCORE</span>
          </div>

          <div className="flex items-center justify-center space-x-3 my-4">
            <h2 className="text-6xl sm:text-7xl font-extrabold text-white tracking-tight">
              {overallScore}
            </h2>
            <span className="text-2xl font-bold text-slate-500 self-end mb-2">/ 100</span>
          </div>

          {/* Level Badge Pill */}
          <div className="inline-flex items-center space-x-2 px-5 py-2 rounded-full border text-base font-bold my-2 shadow-lg transition-all" style={{
            borderColor: levelCode === 'high' ? '#10b981' : levelCode === 'moderate' ? '#f59e0b' : '#f43f5e',
            backgroundColor: levelCode === 'high' ? 'rgba(16, 185, 129, 0.1)' : levelCode === 'moderate' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(244, 63, 94, 0.1)'
          }}>
            <span className="text-lg">{badge}</span>
            <span className={levelCode === 'high' ? 'text-emerald-400' : levelCode === 'moderate' ? 'text-amber-400' : 'text-rose-400'}>
              {trustLevel.toUpperCase()}
            </span>
          </div>

          {/* Horizontal Progress Bar */}
          <div className="mt-8 mb-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
              <span>0 (Low Trust)</span>
              <span>Overall Reliability</span>
              <span>100 (High Trust)</span>
            </div>
            <div className="w-full h-4 bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${getProgressColorClass(overallScore)}`}
                style={{ width: `${overallScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <VivaTooltip
        title="Formula & Weight Breakdown for ModelTrust Score"
        explanation="ModelTrust Score is computed as: (Data Quality × 0.25) + (Feature Risk × 0.20) + (Leakage Safety × 0.25) + (Model Performance × 0.30). Scores range from 0 to 100, providing an unbiased metric for dataset reliability prior to machine learning deployment."
      />

      {/* 4 Category Sub-score Cards (Specified in prompt) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Data Quality */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Data Quality</span>
            <span className="text-[10px] font-bold text-blue-400 px-2 py-0.5 bg-blue-950/80 rounded border border-blue-800/50">25% Weight</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <h4 className="text-3xl font-extrabold text-white">{breakdown.data_quality?.score || 100}</h4>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-4">
            <div className="bg-blue-500 h-full" style={{ width: `${breakdown.data_quality?.score || 100}%` }} />
          </div>
          <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Missing cells & duplicates check
          </p>
        </div>

        {/* Card 2: Feature Risk */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Feature Risk</span>
            <span className="text-[10px] font-bold text-cyan-400 px-2 py-0.5 bg-cyan-950/80 rounded border border-cyan-800/50">20% Weight</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <h4 className="text-3xl font-extrabold text-white">{breakdown.feature_risk?.score || 100}</h4>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-4">
            <div className="bg-cyan-400 h-full" style={{ width: `${breakdown.feature_risk?.score || 100}%` }} />
          </div>
          <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
            ID features & collinearity check
          </p>
        </div>

        {/* Card 3: Leakage Safety */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Leakage Safety</span>
            <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 bg-emerald-950/80 rounded border border-emerald-800/50">25% Weight</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <h4 className="text-3xl font-extrabold text-white">{breakdown.leakage_safety?.score || 100}</h4>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-4">
            <div className="bg-emerald-400 h-full" style={{ width: `${breakdown.leakage_safety?.score || 100}%` }} />
          </div>
          <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
            <SearchCode className="w-3.5 h-3.5 text-emerald-400" />
            Target similarity & leakage names
          </p>
        </div>

        {/* Card 4: Model Performance */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Model Performance</span>
            <span className="text-[10px] font-bold text-purple-400 px-2 py-0.5 bg-purple-950/80 rounded border border-purple-800/50">30% Weight</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <h4 className="text-3xl font-extrabold text-white">{breakdown.model_performance?.score || 100}</h4>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-4">
            <div className="bg-purple-400 h-full" style={{ width: `${breakdown.model_performance?.score || 100}%` }} />
          </div>
          <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            Baseline F1 or R² metric score
          </p>
        </div>
      </div>

      {/* Actionable Recommendations Summary Box */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Generated Recommendations Preview</h4>
              <p className="text-xs text-slate-400">{recommendations.length} action items based on dataset analysis</p>
            </div>
          </div>

          <button
            onClick={onGoToRecommendations}
            className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>View All Recommendations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {recommendations.slice(0, 3).map((rec, idx) => (
            <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-start gap-3">
              <span className="text-xs font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/50 shrink-0 mt-0.5">
                {rec.category}
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{rec.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{rec.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
