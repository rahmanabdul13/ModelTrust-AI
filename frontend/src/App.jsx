import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import Sidebar from './components/Sidebar';
import SummaryCards from './components/SummaryCards';
import DatasetOverview from './pages/DatasetOverview';
import DataQuality from './pages/DataQuality';
import RiskAnalysis from './pages/RiskAnalysis';
import DataLeakage from './pages/DataLeakage';
import ModelEvaluation from './pages/ModelEvaluation';
import TrustScore from './pages/TrustScore';
import RecommendationsPage from './pages/RecommendationsPage';
import DatasetUploadModal from './components/DatasetUploadModal';

import { 
  uploadDatasetFile, 
  updateTargetAnalysis, 
  getSampleDatasets, 
  loadSampleDataset 
} from './services/api';

import { Upload, RefreshCw, AlertCircle } from 'lucide-react';

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' or 'dashboard'
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'quality', 'risks', 'leakage', 'model', 'trust', 'recommendations'
  const [data, setData] = useState(null);
  const [samples, setSamples] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch sample datasets on startup
  useEffect(() => {
    getSampleDatasets()
      .then((res) => setSamples(res))
      .catch((err) => console.log('Samples load failed:', err));
  }, []);

  const handleUpload = async (file) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await uploadDatasetFile(file);
      setData(result);
      setView('dashboard');
      setActiveTab('overview');
      setIsUploadOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to upload and analyze dataset.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = async (sampleFilename) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await loadSampleDataset(sampleFilename);
      setData(result);
      setView('dashboard');
      setActiveTab('overview');
    } catch (err) {
      setError(err.message || 'Failed to load sample dataset.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTargetChange = async (newTarget) => {
    if (!data) return;
    setIsLoading(true);
    try {
      const result = await updateTargetAnalysis(newTarget, data.problem_type, data.session_id);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to re-analyze target column.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProblemTypeToggle = async (newProblemType) => {
    if (!data) return;
    setIsLoading(true);
    try {
      const result = await updateTargetAnalysis(data.target_column, newProblemType, data.session_id);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to re-analyze problem type.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderActiveTabContent = () => {
    if (!data) return null;

    switch (activeTab) {
      case 'overview':
        return (
          <DatasetOverview
            data={data}
            onTargetChange={handleTargetChange}
            onProblemTypeToggle={handleProblemTypeToggle}
          />
        );
      case 'quality':
        return <DataQuality data={data} />;
      case 'risks':
        return <RiskAnalysis data={data} />;
      case 'leakage':
        return <DataLeakage data={data} />;
      case 'model':
        return <ModelEvaluation data={data} />;
      case 'trust':
        return (
          <TrustScore
            data={data}
            onGoToRecommendations={() => setActiveTab('recommendations')}
          />
        );
      case 'recommendations':
        return <RecommendationsPage data={data} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 font-sans">
      {/* Landing Page View */}
      {view === 'landing' ? (
        <LandingPage
          onUploadClick={() => setIsUploadOpen(true)}
          onLoadSample={handleLoadSample}
          samples={samples}
        />
      ) : (
        /* Dashboard Layout */
        <div className="flex min-h-screen">
          {/* Left Navigation Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            data={data}
            onUploadClick={() => setIsUploadOpen(true)}
            onLandingClick={() => setView('landing')}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#0b0f17]">
            {/* Top Dashboard Header */}
            <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-8 py-4 flex items-center justify-between sticky top-0 z-40">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">ModelTrust AI Dashboard</h2>
                <p className="text-xs text-slate-400">Intelligent ML Dataset Reliability & Model Validation Platform</p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-1.5 transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Dataset</span>
                </button>
              </div>
            </header>

            {/* Dashboard Body */}
            <main className="p-8 flex-1 max-w-7xl w-full mx-auto">
              {/* Error Alert Banner */}
              {error && (
                <div className="mb-6 p-4 bg-rose-950/40 border border-rose-900/60 rounded-xl text-rose-300 text-xs flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{error}</span>
                  </div>
                  <button onClick={() => setError(null)} className="text-rose-400 hover:text-white font-semibold">
                    Dismiss
                  </button>
                </div>
              )}

              {/* Loading Indicator Overlay */}
              {isLoading && (
                <div className="mb-6 p-3 bg-blue-950/30 border border-blue-900/50 rounded-xl text-blue-300 text-xs flex items-center space-x-2 animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Re-analyzing dataset pipeline metrics...</span>
                </div>
              )}

              {/* 4 Summary Cards (Rows, Features, Baseline Score, ModelTrust Score) */}
              <SummaryCards data={data} />

              {/* Active Tab View Content */}
              {renderActiveTabContent()}
            </main>
          </div>
        </div>
      )}

      {/* Upload File Modal */}
      <DatasetUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUpload}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
