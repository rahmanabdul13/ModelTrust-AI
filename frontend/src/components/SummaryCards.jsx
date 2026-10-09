import React from 'react';
import { Database, Columns, Cpu, ShieldCheck } from 'lucide-react';

export default function SummaryCards({ data }) {
  if (!data) return null;

  const totalRows = data.profile?.total_rows?.toLocaleString() || '0';
  const totalCols = data.profile?.total_cols || 0;
  
  const modelEval = data.model_evaluation || {};
  const isClassification = data.problem_type === 'classification';
  
  let modelScoreLabel = 'Model Score';
  let modelScoreVal = 'N/A';
  
  if (modelEval.success) {
    if (isClassification) {
      modelScoreLabel = 'Baseline F1 Score';
      modelScoreVal = `${modelEval.metrics?.f1_score || 0}%`;
    } else {
      modelScoreLabel = 'Baseline R² Score';
      modelScoreVal = `${modelEval.metrics?.r2_pct || 0}%`;
    }
  }

  const trustScore = data.trust_score?.overall_score || 0;
  const trustBadge = data.trust_score?.level_badge || '🟢';
  const trustLevel = data.trust_score?.trust_level || 'High Trust';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Card 1: Rows */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between shadow-lg">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Dataset Rows</p>
          <h4 className="text-2xl font-bold text-white mt-1">{totalRows}</h4>
          <p className="text-xs text-slate-500 mt-0.5">Total sample instances</p>
        </div>
        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
          <Database className="w-6 h-6" />
        </div>
      </div>

      {/* Card 2: Features */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between shadow-lg">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Features</p>
          <h4 className="text-2xl font-bold text-white mt-1">{totalCols}</h4>
          <p className="text-xs text-slate-500 mt-0.5">{data.profile?.num_numeric_cols} Numeric / {data.profile?.num_categorical_cols} Categorical</p>
        </div>
        <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl">
          <Columns className="w-6 h-6" />
        </div>
      </div>

      {/* Card 3: Model Score */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between shadow-lg">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{modelScoreLabel}</p>
          <h4 className="text-2xl font-bold text-emerald-400 mt-1">{modelScoreVal}</h4>
          <p className="text-xs text-slate-500 mt-0.5">{modelEval.algorithm || 'Baseline Model'}</p>
        </div>
        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
          <Cpu className="w-6 h-6" />
        </div>
      </div>

      {/* Card 4: Trust Score */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between shadow-lg border-l-4 border-l-blue-500">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">ModelTrust Score</p>
          <div className="flex items-baseline space-x-2 mt-1">
            <h4 className="text-2xl font-bold text-white">{trustScore}</h4>
            <span className="text-xs font-semibold text-slate-400">/ 100</span>
          </div>
          <p className="text-xs font-medium text-emerald-400 mt-0.5 flex items-center gap-1">
            <span>{trustBadge}</span> {trustLevel}
          </p>
        </div>
        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
          <ShieldCheck className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
