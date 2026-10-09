import React from 'react';
import { SearchCode, ShieldAlert, CheckCircle, AlertOctagon } from 'lucide-react';
import VivaTooltip from '../components/VivaTooltip';

export default function DataLeakage({ data }) {
  if (!data) return null;

  const leakage = data.leakage || {};
  const suspiciousFeatures = leakage.suspicious_features || [];
  const similarityLeaks = leakage.similarity_leaks || [];
  const hasLeakage = leakage.has_leakage || false;
  const targetCol = data.target_column;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
            <SearchCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Basic Data Leakage Detection</h3>
            <p className="text-xs text-slate-400">Scans input predictors for target-derived features and excessive value similarity.</p>
          </div>
        </div>
        <div>
          {hasLeakage ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-xs">
              <AlertOctagon className="w-4 h-4" /> Possible Leakage Detected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs">
              <CheckCircle className="w-4 h-4" /> Leakage Free
            </span>
          )}
        </div>
      </div>

      <VivaTooltip
        title="What is Data Leakage and Why is it Critical for Viva Explanation?"
        explanation="Data leakage occurs when an input feature includes information that would not be available at the time of prediction (e.g. including 'previous_result' or 'final_outcome' to predict churn). It causes deceptive 99-100% test accuracy in development, but catastrophic failure when deployed on new real-world data."
      />

      {/* Main Leakage Content */}
      {!hasLeakage ? (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8 text-center shadow-xl">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-white mb-2">No Data Leakage Detected</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Input features do not match target-derived naming patterns and no feature exhibits suspicious (≥ 95%) similarity with target '{targetCol}'.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Target Similarity Leakage */}
          {similarityLeaks.length > 0 && (
            <div className="bg-[#111827] border border-rose-900/50 rounded-2xl p-6 shadow-xl">
              <h4 className="text-base font-bold text-rose-300 mb-2 flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-400" />
                Target Value Similarity Leakage (≥ 95%)
              </h4>
              <p className="text-xs text-slate-400 mb-4">
                These features share an unnaturally high percentage of identical values with the selected target column '{targetCol}'.
              </p>

              <div className="space-y-3">
                {similarityLeaks.map((leak, idx) => (
                  <div key={idx} className="p-4 bg-rose-950/20 border border-rose-900/40 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">Feature: <span className="text-rose-300">{leak.feature}</span></p>
                      <p className="text-xs text-slate-400 mt-0.5">{leak.reason}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-rose-400">Similarity: {leak.similarity_pct}%</span>
                      <p className="text-[11px] text-rose-300 font-semibold mt-0.5">High Leakage Risk</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suspicious Feature Names Leakage */}
          {suspiciousFeatures.length > 0 && (
            <div className="bg-[#111827] border border-amber-900/50 rounded-2xl p-6 shadow-xl">
              <h4 className="text-base font-bold text-amber-300 mb-2 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                Suspicious Column Name Leakage
              </h4>
              <p className="text-xs text-slate-400 mb-4">
                Feature names matching target-related keywords or target variable variations.
              </p>

              <div className="space-y-3">
                {suspiciousFeatures.map((item, idx) => (
                  <div key={idx} className="p-4 bg-amber-950/20 border border-amber-900/40 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">Feature: <span className="text-amber-300">{item.feature}</span></p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.reason}</p>
                    </div>
                    <span className="text-xs font-bold text-amber-400 bg-amber-950 px-2.5 py-1 rounded border border-amber-800/50">
                      Suspicious Name
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
