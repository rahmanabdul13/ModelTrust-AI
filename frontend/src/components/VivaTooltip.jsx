import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, GraduationCap } from 'lucide-react';

export default function VivaTooltip({ title, explanation }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-4 bg-slate-900/90 border border-blue-500/20 rounded-xl overflow-hidden shadow-lg transition-all duration-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-blue-950/30 hover:bg-blue-900/20 flex items-center justify-between text-left transition-colors"
      >
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 block">Viva Explanation Guide</span>
            <span className="text-sm font-medium text-slate-200">{title}</span>
          </div>
        </div>
        <div className="text-slate-400 hover:text-white transition-colors">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-4 py-3 bg-slate-900/60 border-t border-slate-800 text-sm text-slate-300 leading-relaxed">
          <p className="flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>{explanation}</span>
          </p>
        </div>
      )}
    </div>
  );
}
