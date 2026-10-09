import React from 'react';
import { Cpu, CheckCircle2, AlertCircle, GitCommit, Sliders, Layers } from 'lucide-react';
import VivaTooltip from '../components/VivaTooltip';

export default function ModelEvaluation({ data }) {
  if (!data) return null;

  const modelEval = data.model_evaluation || {};
  const isClassification = data.problem_type === 'classification';
  const metrics = modelEval.metrics || {};
  const algorithm = modelEval.algorithm || (isClassification ? 'Logistic Regression' : 'Linear Regression');
  const splitInfo = modelEval.split || '80% Train / 20% Test (random_state=42)';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Automatic ML Model Evaluation</h3>
            <p className="text-xs text-slate-400">Baseline machine learning evaluation using Scikit-Learn Pipelines.</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/50 px-3 py-1 rounded-lg">
            {algorithm}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">{isClassification ? 'Classification Model' : 'Regression Model'}</p>
        </div>
      </div>

      <VivaTooltip
        title="Why Baseline Linear Models (Logistic / Linear Regression) Are Ideal for Viva Defense"
        explanation="Linear and Logistic Regression models are highly interpretable, mathematically transparent, and provide robust baseline benchmark scores. Using Scikit-Learn Pipeline with ColumnTransformer ensures data preprocessing (imputation, scaling, one-hot encoding) is applied cleanly without leakage."
      />

      {/* Model Training Failure Warning */}
      {!modelEval.success && (
        <div className="p-4 bg-rose-950/30 border border-rose-900/50 rounded-2xl text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Model Training Warning</h4>
            <p className="text-xs mt-1">{modelEval.error || 'Could not complete model training. Please check target column selection.'}</p>
          </div>
        </div>
      )}

      {/* Evaluation Metric Cards Grid */}
      {modelEval.success && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isClassification ? (
            <>
              {/* Classification Metric 1: Accuracy */}
              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Accuracy</p>
                <h4 className="text-3xl font-extrabold text-white mt-2">{metrics.accuracy}%</h4>
                <p className="text-xs text-slate-500 mt-1">Overall correct predictions</p>
              </div>

              {/* Classification Metric 2: Precision */}
              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Precision</p>
                <h4 className="text-3xl font-extrabold text-cyan-400 mt-2">{metrics.precision}%</h4>
                <p className="text-xs text-slate-500 mt-1">Weighted positive predictive value</p>
              </div>

              {/* Classification Metric 3: Recall */}
              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Recall</p>
                <h4 className="text-3xl font-extrabold text-blue-400 mt-2">{metrics.recall}%</h4>
                <p className="text-xs text-slate-500 mt-1">Weighted sensitivity / true positives</p>
              </div>

              {/* Classification Metric 4: F1 Score */}
              <div className="bg-[#111827] border border-emerald-900/50 rounded-2xl p-5 shadow-xl bg-gradient-to-br from-[#111827] to-emerald-950/20">
                <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider font-bold">F1 Score (Primary)</p>
                <h4 className="text-3xl font-extrabold text-emerald-400 mt-2">{metrics.f1_score}%</h4>
                <p className="text-xs text-slate-400 mt-1">Harmonic mean of precision & recall</p>
              </div>
            </>
          ) : (
            <>
              {/* Regression Metric 1: R^2 Score */}
              <div className="bg-[#111827] border border-emerald-900/50 rounded-2xl p-5 shadow-xl bg-gradient-to-br from-[#111827] to-emerald-950/20">
                <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider font-bold">R² Score (Primary)</p>
                <h4 className="text-3xl font-extrabold text-emerald-400 mt-2">{metrics.r2_pct}%</h4>
                <p className="text-xs text-slate-400 mt-1">Coefficient of determination ({metrics.r2_score})</p>
              </div>

              {/* Regression Metric 2: MAE */}
              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">MAE</p>
                <h4 className="text-3xl font-extrabold text-white mt-2">{metrics.mae}</h4>
                <p className="text-xs text-slate-500 mt-1">Mean Absolute Error</p>
              </div>

              {/* Regression Metric 3: RMSE */}
              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">RMSE</p>
                <h4 className="text-3xl font-extrabold text-cyan-400 mt-2">{metrics.rmse}</h4>
                <p className="text-xs text-slate-500 mt-1">Root Mean Squared Error</p>
              </div>

              {/* Regression Metric 4: Split Info */}
              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Test Split Ratio</p>
                <h4 className="text-xl font-bold text-slate-200 mt-2">20% Holdout</h4>
                <p className="text-xs text-slate-500 mt-1">80% Training Data</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Scikit-Learn Pipeline Architecture Visual */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">Scikit-Learn Pipeline Architecture</h4>
            <p className="text-xs text-slate-400">Automated end-to-end preprocessing & model execution flow</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1: Preprocessing */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Step 1</span>
              <Sliders className="w-4 h-4 text-slate-500" />
            </div>
            <h5 className="font-semibold text-white text-sm">Numerical Preprocessing</h5>
            <ul className="text-xs text-slate-400 mt-2 space-y-1">
              <li>• SimpleImputer (median)</li>
              <li>• StandardScaler (z-score scaling)</li>
            </ul>
          </div>

          {/* Step 2: Categorical Preprocessing */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Step 2</span>
              <Sliders className="w-4 h-4 text-slate-500" />
            </div>
            <h5 className="font-semibold text-white text-sm">Categorical Preprocessing</h5>
            <ul className="text-xs text-slate-400 mt-2 space-y-1">
              <li>• SimpleImputer (most_frequent)</li>
              <li>• OneHotEncoder (handle_unknown='ignore')</li>
            </ul>
          </div>

          {/* Step 3: Estimator */}
          <div className="p-4 bg-slate-900 border border-emerald-900/50 rounded-xl bg-emerald-950/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Step 3</span>
              <GitCommit className="w-4 h-4 text-emerald-400" />
            </div>
            <h5 className="font-semibold text-white text-sm">Baseline Model Fitting</h5>
            <p className="text-xs text-slate-300 mt-2">
              Fits <strong className="text-emerald-400">{algorithm}</strong> on 80% train split and evaluates performance on 20% test split.
            </p>
          </div>
        </div>

        <div className="mt-4 text-right text-xs text-slate-500">
          Split Configuration: {splitInfo}
        </div>
      </div>
    </div>
  );
}
