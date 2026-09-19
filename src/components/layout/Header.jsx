import React from 'react';
import { Eye, FileDown } from 'lucide-react';

export default function Header({ focusMode, setFocusMode, totalWords, exportToDocx }) {
  return (
    <div className="h-12 border-b border-emerald-100 bg-white px-4 flex items-center justify-between z-10 shrink-0">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setFocusMode(!focusMode)}
          className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1 border border-emerald-200"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{focusMode ? 'Выйти из фокуса' : 'Режим Фокуса'}</span>
        </button>
      </div>

      <div className="flex items-center gap-3 text-xs">
        <span>Слов: <strong className="text-slate-800">{totalWords}</strong></span>
        <button 
          onClick={exportToDocx}
          className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold flex items-center gap-1 transition"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>Скачать .DOCX</span>
        </button>
      </div>
    </div>
  );
}
