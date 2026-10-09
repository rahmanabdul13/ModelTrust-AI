import React from 'react';
import { Sparkles, AlertTriangle, CheckCircle, XCircle, Copy, FileCode, Layers } from 'lucide-react';
import VivaTooltip from '../components/VivaTooltip';

export default function DataQuality({ data }) {
  if (!data) return null;

  const quality = data.quality || {};
  const missingCells = quality.missing_cells || 0;
  const missingPct = quality.missing_pct || 0;
  const missingByCol = quality.missing_by_col || {};
  const duplicateRows = quality.duplicate_rows || 0;
  const duplicatePct = quality.duplicate_pct || 0;
  const constantCols = quality.constant_cols || [];
  const statusColor = quality.status_color || 'green';
  const statusLabel = quality.status_label || 'High Quality';

  const getStatusBadge = (color) => {
    if (color === 'green') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-xs">
          <CheckCircle className="w-4 h-4" /> Good
        </span>
      );
    } else if (color === 'yellow') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold text-xs">
          <AlertTriangle className="w-4 h-4" /> Warning
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-semibold text-xs">
          <XCircle className="w-4 h-4" /> Serious Issue
        </span>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Data Quality Summary</h3>
            <p className="text-xs text-slate-400">Evaluates missing value density, duplicate records, and zero-variance columns.</p>
          </div>
        </div>
        <div>
          {getStatusBadge(statusColor)}
        </div>
      </div>

      <VivaTooltip
        title="Why Data Quality Matters in Machine Learning"
        explanation="Missing values force imputer estimators to guess feature data. Duplicate rows cause data leakage between train and test splits. Constant columns have zero variance, adding zero predictive signal while increasing computation complexity."
      />

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1: Missing Values */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Missing Values</span>
            <FileCode className="w-5 h-5 text-amber-400" />
          </div>
          <h4 className="text-3xl font-extrabold text-white">{missingCells.toLocaleString()}</h4>
          <p className="text-xs text-slate-400 mt-1">{missingPct}% of total data cells</p>
          <div className="mt-4">
            {missingCells === 0 ? (
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> No missing values found
              </span>
            ) : (
              <span className="text-xs text-amber-400 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Found in {Object.keys(missingByCol).length} column(s)
              </span>
            )}
          </div>
        </div>

        {/* Metric 2: Duplicate Rows */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Duplicate Rows</span>
            <Copy className="w-5 h-5 text-cyan-400" />
          </div>
          <h4 className="text-3xl font-extrabold text-white">{duplicateRows.toLocaleString()}</h4>
          <p className="text-xs text-slate-400 mt-1">{duplicatePct}% of dataset rows</p>
          <div className="mt-4">
            {duplicateRows === 0 ? (
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> All rows are unique
              </span>
            ) : (
              <span className="text-xs text-amber-400 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Consider dropping duplicate records
              </span>
            )}
          </div>
        </div>

        {/* Metric 3: Constant Columns */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Constant Columns</span>
            <Layers className="w-5 h-5 text-blue-400" />
          </div>
          <h4 className="text-3xl font-extrabold text-white">{constantCols.length}</h4>
          <p className="text-xs text-slate-400 mt-1">Zero-variance features</p>
          <div className="mt-4">
            {constantCols.length === 0 ? (
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> No constant columns detected
              </span>
            ) : (
              <span className="text-xs text-rose-400 font-medium flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> Drop before model training
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Breakdown Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Missing Values breakdown */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h4 className="text-base font-bold text-white mb-4">Columns with Missing Values</h4>
          {Object.keys(missingByCol).length === 0 ? (
            <div className="p-6 text-center text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 rounded-xl">
              ✓ Clean! No columns contain missing values.
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(missingByCol).map(([col, cnt]) => {
                const pct = ((cnt / (data.profile?.total_rows || 1)) * 100).toFixed(1);
                return (
                  <div key={col} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{col}</p>
                      <p className="text-xs text-slate-400">{cnt} missing cells ({pct}%)</p>
                    </div>
                    <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full" style={{ width: `${Math.min(100, pct)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Constant Columns breakdown */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h4 className="text-base font-bold text-white mb-4">Zero-Variance Columns List</h4>
          {constantCols.length === 0 ? (
            <div className="p-6 text-center text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 rounded-xl">
              ✓ Clean! All columns possess valid variance.
            </div>
          ) : (
            <div className="space-y-3">
              {constantCols.map((col) => (
                <div key={col} className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-xl flex items-center justify-between">
                  <span className="text-sm font-semibold text-rose-300">{col}</span>
                  <span className="text-xs text-rose-400 font-medium">1 Unique Value</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
