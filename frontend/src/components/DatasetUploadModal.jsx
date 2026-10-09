import React, { useState } from 'react';
import { Upload, FileSpreadsheet, X, AlertCircle, Loader2 } from 'lucide-react';

export default function DatasetUploadModal({ isOpen, onClose, onUpload, isLoading, error }) {
  const [selectedFile, setSelectedFile] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Upload Dataset</h3>
            <p className="text-xs text-slate-400">Supported formats: .csv, .xlsx, .xls</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 bg-slate-950/60 rounded-xl p-8 text-center cursor-pointer transition-colors relative mb-6"
          >
            <input
              type="file"
              accept=".csv, .xlsx, .xls"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <FileSpreadsheet className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            
            {selectedFile ? (
              <div>
                <p className="text-sm font-semibold text-cyan-400">{selectedFile.name}</p>
                <p className="text-xs text-slate-400 mt-1">{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-slate-200">
                  Drag & drop your CSV / XLSX file here or <span className="text-blue-400 underline">browse</span>
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Auto-detects comma, semicolon, or tab separators
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || isLoading}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center space-x-2 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Analyze Dataset</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
