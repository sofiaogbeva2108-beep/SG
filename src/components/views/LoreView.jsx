// src/components/views/LoreView.jsx
import React from 'react';
import { Users, MapPin, Plus, BookOpen } from 'lucide-react';

export default function LoreView({
  currentCycle,
  newCharName,
  setNewCharName,
  newCharBio,
  setNewCharBio,
  addCharacter,
  newLocName,
  setNewLocName,
  newLocDesc,
  setNewLocDesc,
  addLocation
}) {
  if (!currentCycle) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        Создайте или выберите проект, чтобы управлять базой лора.
      </div>
    );
  }

  const characters = currentCycle?.lore?.characters || [];
  const locations = currentCycle?.lore?.locations || [];

  return (
    <div className="h-full p-6 overflow-y-auto space-y-6 bg-[#FAF9F6]">
      
      {/* Шапка ЛОР-базы */}
      <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-700" /> База Лор & Персонажи
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Активный проект / книга: <strong className="text-emerald-900">{currentCycle.title}</strong>
          </p>
        </div>
        <div className="text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-semibold">
          Общий доступ ко всем томам проекта
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* ПЕРСОНАЖИ */}
        <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-700" /> Персонажи ({characters.length})
            </h2>
          </div>

          {/* Форма добавления */}
          <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <input 
              type="text"
              placeholder="Имя персонажа..."
              value={newCharName}
              onChange={(e) => setNewCharName(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-emerald-600"
            />
            <textarea 
              placeholder="Краткое описание, роль в сюжете..."
              value={newCharBio}
              onChange={(e) => setNewCharBio(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-emerald-600 h-16 resize-none"
            />
            <button 
              onClick={addCharacter}
              className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Добавить в проект
            </button>
          </div>

          {/* Список персонажей */}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {characters.length > 0 ? (
              characters.map(c => (
                <div key={c.id} className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-950">{c.name}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                      {c.role || 'Персонаж'}
                    </span>
                  </div>
                  {c.bio && <p className="text-[11px] text-slate-600 leading-tight">{c.bio}</p>}
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs italic">
                В этом проекте ещё нет персонажей
              </div>
            )}
          </div>
        </div>

        {/* ЛОКАЦИИ */}
        <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700" /> Локации & Места ({locations.length})
            </h2>
          </div>

          {/* Форма добавления */}
          <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <input 
              type="text"
              placeholder="Название локации..."
              value={newLocName}
              onChange={(e) => setNewLocName(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-emerald-600"
            />
            <textarea 
              placeholder="Атмосфера, особенности места..."
              value={newLocDesc}
              onChange={(e) => setNewLocDesc(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-emerald-600 h-16 resize-none"
            />
            <button 
              onClick={addLocation}
              className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Добавить в проект
            </button>
          </div>

          {/* Список локаций */}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {locations.length > 0 ? (
              locations.map(l => (
                <div key={l.id} className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100 space-y-1">
                  <div className="text-xs font-bold text-emerald-950">{l.name}</div>
                  {l.description && <p className="text-[11px] text-slate-600 leading-tight">{l.description}</p>}
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs italic">
                В этом проекте ещё нет локаций
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
