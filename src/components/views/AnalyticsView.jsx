import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export default function AnalyticsView({ handleAiBetaReader, aiLoading, aiResponse }) {
  return (
    <div className="h-full p-6 overflow-y-auto max-w-4xl mx-auto space-y-6">
      <h1 className="text-xl font-bold text-slate-900">ИИ Бета-ридер & Стилистический Рентген</h1>
      <p className="text-xs text-slate-500">Глубокий анализ сцены: от детектора ошибок до ритмики текста.</p>
      
      <button 
        onClick={handleAiBetaReader}
        disabled={aiLoading}
        className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
      >
        {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        <span>Запустить Анализ Текста</span>
      </button>

      {aiResponse && (
        <div className="p-5 bg-white rounded-2xl border border-emerald-100 shadow-sm text-xs leading-relaxed whitespace-pre-wrap">
          {aiResponse}
        </div>
      )}
    </div>
  );
}
