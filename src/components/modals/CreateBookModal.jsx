import React from 'react';

export default function CreateBookModal({
  show,
  setShow,
  newBookTitle,
  setNewBookTitle,
  handleCreateBook
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
        <h2 className="text-lg font-bold">Добавить книгу в цикл</h2>
        <input 
          type="text" 
          placeholder="Название книги (например: Книга 2: Тень Дракона)" 
          value={newBookTitle}
          onChange={e => setNewBookTitle(e.target.value)}
          className="w-full p-2.5 border rounded-xl text-xs outline-none"
        />
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={() => setShow(false)} className="px-4 py-2 border rounded-xl text-xs font-semibold">Отмена</button>
          <button onClick={handleCreateBook} className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold">Добавить</button>
        </div>
      </div>
    </div>
  );
}
