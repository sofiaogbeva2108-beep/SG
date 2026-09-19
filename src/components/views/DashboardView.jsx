import React from 'react';
import { Plus } from 'lucide-react';

export default function DashboardView({ cycles, setShowNewCycleModal, setActiveCycleId, setActiveBookId, setActiveView }) {
  return (
    <div className="h-full p-8 overflow-y-auto max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Мои Циклы Книг</h1>
        <button 
          onClick={() => setShowNewCycleModal(true)}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Новый Цикл
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cycles.map(cyc => (
          <div key={cyc.id} className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-emerald-900">{cyc.title}</h2>
              <p className="text-xs text-slate-500 mt-1">{cyc.description}</p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs font-semibold text-emerald-700">Книг: {cyc.books.length}</span>
              <button 
                onClick={() => {
                  setActiveCycleId(cyc.id);
                  setActiveBookId(cyc.books[0]?.id || '');
                  setActiveView('editor');
                }}
                className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold hover:bg-emerald-100"
              >
                Открыть кабинет
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
