import React from 'react';
import { Users, MapPin } from 'lucide-react';

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
  return (
    <div className="h-full p-8 overflow-y-auto max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">База Лора и Мироустройства</h1>
        <p className="text-xs text-slate-500">Управляйте персонажами и локациями мира "{currentCycle?.title || ''}"</p>
      </div>

      {/* CHARACTERS */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-600" /> Персонажи
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentCycle?.lore?.characters?.map(c => (
            <div key={c.id} className="p-4 bg-white rounded-xl border border-emerald-100 shadow-sm">
              <div className="font-bold text-sm text-slate-800">{c.name}</div>
              <div className="text-xs text-emerald-700 font-semibold mb-1">{c.role}</div>
              <div className="text-xs text-slate-600">{c.bio}</div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/60 space-y-2">
          <div className="text-xs font-bold text-emerald-900">Добавить персонажа</div>
          <input 
            type="text" 
            placeholder="Имя персонажа" 
            value={newCharName} 
            onChange={e => setNewCharName(e.target.value)} 
            className="w-full p-2 text-xs border rounded-lg" 
          />
          <textarea 
            placeholder="Краткое описание / роль" 
            value={newCharBio} 
            onChange={e => setNewCharBio(e.target.value)} 
            className="w-full p-2 text-xs border rounded-lg h-16 resize-none" 
          />
          <button onClick={addCharacter} className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold">
            Сохранить персонажа
          </button>
        </div>
      </div>

      {/* LOCATIONS */}
      <div className="space-y-4 pt-4 border-t border-emerald-100">
        <h2 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-600" /> Локации
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentCycle?.lore?.locations?.map(l => (
            <div key={l.id} className="p-4 bg-white rounded-xl border border-emerald-100 shadow-sm">
              <div className="font-bold text-sm text-slate-800">{l.name}</div>
              <div className="text-xs text-slate-600 mt-1">{l.description}</div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/60 space-y-2">
          <div className="text-xs font-bold text-emerald-900">Добавить локацию</div>
          <input 
            type="text" 
            placeholder="Название локации" 
            value={newLocName} 
            onChange={e => setNewLocName(e.target.value)} 
            className="w-full p-2 text-xs border rounded-lg" 
          />
          <textarea 
            placeholder="Описание локации" 
            value={newLocDesc} 
            onChange={e => setNewLocDesc(e.target.value)} 
            className="w-full p-2 text-xs border rounded-lg h-16 resize-none" 
          />
          <button onClick={addLocation} className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold">
            Сохранить локацию
          </button>
        </div>
      </div>
    </div>
  );
}
