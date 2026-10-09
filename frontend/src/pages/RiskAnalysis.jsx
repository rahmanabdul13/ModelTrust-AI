import React from 'react';
import { ShieldAlert, Fingerprint, Network, CheckCircle, AlertTriangle } from 'lucide-react';
import VivaTooltip from '../components/VivaTooltip';

export default function RiskAnalysis({ data }) {
  if (!data) return null;

  const risks = data.risks || {};
  const idCols = risks.id_cols || [];
  const highCorrPairs = risks.high_corr_pairs || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Feature Risk Analysis</h3>
            <p className="text-xs text-slate-400">Detects identifier features and multicollinearity in numerical predictors.</p>
          </div>
        </div>
        <div className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300">
          {idCols.length + highCorrPairs.length} Risk Flag(s)
        </div>
      </div>

      <VivaTooltip
        title="Why ID Columns & High Correlation Risk Machine Learning Performance"
        explanation="ID-like columns (e.g. Student ID, Roll No) act as unique primary keys. Models will memorize these keys to get 100% training accuracy, leading to catastrophic overfitting on unseen test data. Highly correlated numerical features (|r| >= 0.90) introduce multicollinearity, causing linear model weights to become unstable."
      />

      {/* Section 1: ID-Like Columns Detection */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">ID & High-Uniqueness Columns</h4>
            <p className="text-xs text-slate-400">
              {idCols.length > 0 ? `${idCols.length} ID-like feature(s) detected` : 'No ID-like features detected'}
            </p>
          </div>
        </div>

        {idCols.length === 0 ? (
          <div className="p-5 bg-emerald-950/20 border border-emerald-900/40 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>✓ Safe! No identifier columns or high-uniqueness features detected.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {idCols.map((item) => (
              <div key={item.column} className="p-4 bg-amber-950/20 border border-amber-900/40 rounded-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-amber-300">{item.column}</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-bold uppercase">
                      ID Risk
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{item.reason}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-300">{item.unique_values.toLocaleString()} unique</span>
                  <p className="text-[11px] text-amber-400 mt-0.5">Exclude from training</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Highly Correlated Numerical Features */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">Highly Correlated Feature Pairs (|r| ≥ 0.90)</h4>
            <p className="text-xs text-slate-400">
              {highCorrPairs.length > 0 ? `${highCorrPairs.length} highly correlated pair(s) flagged` : 'No collinear pairs found'}
            </p>
          </div>
        </div>

        {highCorrPairs.length === 0 ? (
          <div className="p-5 bg-emerald-950/20 border border-emerald-900/40 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>✓ Safe! No feature pairs exhibit severe multicollinearity (|r| &ge; 0.90).</span>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Highly correlated features may contain redundant information. Consider removing one feature from each pair.</span>
            </div>

            {highCorrPairs.map((pair, idx) => (
              <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-white text-sm">{pair.feature_1}</span>
                  <span className="text-xs text-slate-500 font-mono">↔</span>
                  <span className="font-semibold text-white text-sm">{pair.feature_2}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-800/50 px-3 py-1 rounded-lg">
                    Correlation = {pair.correlation}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
