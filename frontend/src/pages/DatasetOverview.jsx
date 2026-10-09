import React from 'react';
import { Target, Table, Info, Layers, CheckCircle2 } from 'lucide-react';
import VivaTooltip from '../components/VivaTooltip';

export default function DatasetOverview({ data, onTargetChange, onProblemTypeToggle }) {
  if (!data) return null;

  const profile = data.profile || {};
  const columnsInfo = profile.columns_info || [];
  const preview = profile.preview || [];
  const availableColumns = data.available_columns || [];
  const currentTarget = data.target_column;
  const currentProblemType = data.problem_type;

  return (
    <div className="space-y-6">
      {/* Target Column & Problem Type Selection Box */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold">
              <Target className="w-3.5 h-3.5" />
              <span>Target & ML Problem Setup</span>
            </div>
            <h3 className="text-xl font-bold text-white">Target Column Detection</h3>
            <p className="text-xs text-slate-400">
              Selected target column determines model evaluation and data leakage analysis.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Target Select Dropdown */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Target Variable (y)</label>
              <select
                value={currentTarget}
                onChange={(e) => onTargetChange(e.target.value)}
                className="bg-slate-900 border border-slate-700 hover:border-blue-500 text-white text-sm font-semibold rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                {availableColumns.map((col) => (
                  <option key={col} value={col}>
                    {col} {col === currentTarget ? '(Selected Target)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Problem Type Toggle */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Detected ML Task</label>
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
                <button
                  onClick={() => onProblemTypeToggle('classification')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    currentProblemType === 'classification'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Classification
                </button>
                <button
                  onClick={() => onProblemTypeToggle('regression')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    currentProblemType === 'regression'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Regression
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Algorithm Auto-Selection: <strong className="text-slate-200 ml-1">{currentProblemType === 'classification' ? 'Logistic Regression' : 'Linear Regression'}</strong>
          </span>
          <span className="text-slate-500">Auto-detected problem type based on target uniqueness & dtype</span>
        </div>
      </div>

      <VivaTooltip
        title="Dataset Profiling & Target Auto-Detection"
        explanation="Dataset profiling scans shape, row count, column types, and missing values. Auto-detection checks target keywords (like 'target', 'label', 'outcome') and target cardinality to switch between Classification (Logistic Regression) and Regression (Linear Regression) to avoid label type mismatch errors."
      />

      {/* Column Schema Metadata Table */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Column Info & Types</h4>
              <p className="text-xs text-slate-400">Detailed column data types, missing counts, and unique value counts</p>
            </div>
          </div>
          <span className="text-xs font-medium text-slate-400">{columnsInfo.length} Total Columns</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Column Name</th>
                <th className="px-4 py-3">Data Type</th>
                <th className="px-4 py-3">Missing Values</th>
                <th className="px-4 py-3">Unique Values</th>
                <th className="px-4 py-3">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {columnsInfo.map((col) => {
                const isTarget = col.name === currentTarget;
                return (
                  <tr key={col.name} className={`hover:bg-slate-800/40 transition-colors ${isTarget ? 'bg-blue-950/20' : ''}`}>
                    <td className="px-4 py-3 font-semibold text-white flex items-center gap-2">
                      {col.name}
                      {isTarget && (
                        <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded font-bold">
                          Target
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400">{col.type}</td>
                    <td className="px-4 py-3">
                      {col.missing_count > 0 ? (
                        <span className="text-amber-400 font-semibold">{col.missing_count} ({col.missing_pct}%)</span>
                      ) : (
                        <span className="text-emerald-400">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{col.unique_count.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      {isTarget ? (
                        <span className="text-cyan-400 font-semibold">Target (y)</span>
                      ) : (
                        <span className="text-slate-500">Feature (X)</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dataset Preview (First 5 - 10 Rows) */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
            <Table className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">Dataset Preview</h4>
            <p className="text-xs text-slate-400">Displaying first {preview.length} sample rows of dataset</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
              <tr>
                <th className="px-3 py-2.5">#</th>
                {columnsInfo.map((c) => (
                  <th key={c.name} className={`px-3 py-2.5 ${c.name === currentTarget ? 'text-cyan-400 font-bold' : ''}`}>
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {preview.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="px-3 py-2 text-slate-500 font-sans">{idx + 1}</td>
                  {columnsInfo.map((c) => {
                    const val = row[c.name];
                    return (
                      <td key={c.name} className={`px-3 py-2 truncate max-w-[150px] ${c.name === currentTarget ? 'font-bold text-cyan-300' : ''}`}>
                        {val === null || val === undefined ? <span className="text-slate-600 italic">NaN</span> : String(val)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
