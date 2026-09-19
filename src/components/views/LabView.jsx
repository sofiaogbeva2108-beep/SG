import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export default function LabView({
  simChar1,
  setSimChar1,
  simChar2,
  setSimChar2,
  simConflict,
  setSimConflict,
  handleCharacterSim,
  aiLoading,
  aiResponse
}) {
  return (
    <div className="h-full p-6 overflow-y-auto max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-bold text-slate-900">Симулятор отношений & Химия персонажей</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input 
          type="text" 
          value={simChar1} 
          onChange={(e) => setSimChar1(e.target.value)} 
          className="p-2 border rounded-xl text-xs" 
          placeholder="Персонаж 1" 
        />
        <input 
          type="text" 
          value={simChar2} 
          onChange={(e) => setSimChar2(e.target.value)} 
          className="p-2 border rounded-xl text-xs" 
          placeholder="Персонаж 2" 
        />
        <input 
          type="text" 
          value={simConflict} 
          onChange={(e) => setSimConflict(e.target.value)} 
          className="p-2 border rounded-xl text-xs" 
          placeholder="Причина конфликта" 
        />
      </div>
      <button 
        onClick={handleCharacterSim}
        disabled={aiLoading}
        className="w-full py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-semibold flex justify-center items-center gap-2"
      >
        {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        <span>Смоделировать Диалог</span>
      </button>

      {aiResponse && (
        <div className="p-5 bg-white rounded-2xl border border-emerald-100 text-xs leading-relaxed whitespace-pre-wrap">
          {aiResponse}
        </div>
      )}
    </div>
  );
}
