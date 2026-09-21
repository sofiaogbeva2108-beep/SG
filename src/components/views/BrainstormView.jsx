import React from 'react';
import { Loader2, Wand2 } from 'lucide-react';

export default function BrainstormView({ genCategory, setGenCategory, handleBrainstorm, aiLoading, aiResponse }) {
  const categories = [
    { id: 'names', label: 'Имена & Роды' },
    { id: 'twists', label: 'Сюжетные повороты' },
    { id: 'locations', label: 'Идеи Локаций' }
  ];

  // Для категории "Имена" разбиваем ответ ИИ на чистый список — снимаем
  // возможную нумерацию/маркеры и пустые строки — и показываем чипами,
  // а не сплошным абзацем.
  const nameItems = genCategory === 'names' && aiResponse
    ? aiResponse
        .split('\n')
        .map(line => line.replace(/^[\s\-*•\d.)]+/, '').trim())
        .filter(Boolean)
    : null;

  return (
    <div className="h-full p-6 overflow-y-auto max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-bold text-slate-900">Генератор идей & Брейншторм</h1>
      
      <div className="flex gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setGenCategory(cat.id)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${genCategory === cat.id ? 'bg-emerald-700 text-white' : 'bg-white border text-slate-600'}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <button 
        onClick={handleBrainstorm}
        disabled={aiLoading}
        className="w-full py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-semibold flex justify-center items-center gap-2"
      >
        {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
        <span>Сгенерировать идеи</span>
      </button>

      {nameItems && nameItems.length > 0 && (
        <div className="p-5 bg-white rounded-2xl border border-emerald-100">
          <div className="flex flex-wrap gap-2">
            {nameItems.map((name, idx) => (
              <button
                key={idx}
                onClick={() => navigator.clipboard.writeText(name)}
                title="Скопировать"
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-full text-xs font-medium text-emerald-900 transition"
              >
                {name}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-3">Нажмите на имя, чтобы скопировать его.</p>
        </div>
      )}

      {aiResponse && genCategory !== 'names' && (
        <div className="p-5 bg-white rounded-2xl border border-emerald-100 text-xs leading-relaxed whitespace-pre-wrap">
          {aiResponse}
        </div>
      )}
    </div>
  );
}
