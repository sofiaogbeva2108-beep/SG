import React from 'react';

export default function CreateCycleModal({
  show,
  setShow,
  newCycleTitle,
  setNewCycleTitle,
  newCycleDesc,
  setNewCycleDesc,
  handleCreateCycle
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
        <h2 className="text-lg font-bold">Создать новый цикл</h2>
        <input 
          type="text" 
          placeholder="Название цикла (например: Легенды Элендора)" 
          value={newCycleTitle}
          onChange={e => setNewCycleTitle(e.target.value)}
          className="w-full p-2.5 border rounded-xl text-xs outline-none"
        />
        <textarea 
          placeholder="Описание цикла и жанр" 
          value={newCycleDesc}
          onChange={e => setNewCycleDesc(e.target.value)}
          className="w-full p-2.5 border rounded-xl text-xs h-24 resize-none outline-none"
        />
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={() => setShow(false)} className="px-4 py-2 border rounded-xl text-xs font-semibold">Отмена</button>
          <button onClick={handleCreateCycle} className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold">Создать</button>
        </div>
      </div>
    </div>
  );
}
