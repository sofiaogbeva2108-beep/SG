import React, { useState, useRef } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import AiAssistantPanel from '../editor/AiAssistantPanel';
import BookHub from '../editor/BookHub';

export default function EditorView({
  currentCycle,
  activeBookId,
  setActiveBookId,
  setActiveSceneId,
  setShowNewBookModal,
  handleAddChapter,
  handleAddScene,
  activeSceneId,
  currentScene,
  setCycles,
  activeCycleId,
  updateSceneContent,
  updateBookMeta,
  currentBook,
  setActiveView
}) {
  const textareaRef = useRef(null);
  const [selection, setSelection] = useState({ start: 0, end: 0, text: '' });
  const [showHub, setShowHub] = useState(false);

  // Захватываем выделение текста в textarea, чтобы ИИ-ассистент мог
  // работать именно с выделенным фрагментом сцены.
  const captureSelection = () => {
    const el = textareaRef.current;
    if (!el) return;
    setSelection({
      start: el.selectionStart,
      end: el.selectionEnd,
      text: el.value.substring(el.selectionStart, el.selectionEnd),
    });
  };

  // Заменить выделенный фрагмент результатом от ИИ
  const replaceSelection = (newText) => {
    const content = currentScene?.content || '';
    const { start, end } = selection;
    const updated = content.slice(0, start) + newText + content.slice(end);
    updateSceneContent(updated);
    setSelection({ start, end: start + newText.length, text: newText });
  };

  // Добавить текст от ИИ в конец сцены
  const appendText = (newText) => {
    const content = currentScene?.content || '';
    const separator = content && !content.endsWith('\n') ? '\n\n' : '';
    updateSceneContent(content + separator + newText);
  };

  return (
    <div className="h-full flex">
      {showHub ? (
        <BookHub
          book={currentBook}
          currentCycle={currentCycle}
          onUpdateBookMeta={updateBookMeta}
          onContinue={() => setShowHub(false)}
          onOpenLore={() => setActiveView('lore')}
        />
      ) : (
        <>
      {/* CHAPTERS AND SCENES PANEL */}
      <div className="w-64 border-r border-emerald-100 bg-white p-4 overflow-y-auto hidden md:block shrink-0">
        <div className="mb-4 pb-3 border-b border-emerald-100">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Выбор книги</div>
          <select 
            value={activeBookId}
            onChange={e => {
              setActiveBookId(e.target.value);
              const bk = currentCycle?.books.find(b => b.id === e.target.value);
              if (bk && bk.chapters.length > 0) {
                setActiveSceneId(bk.chapters[0].scenes[0]?.id || '');
              }
            }}
            className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-1.5 font-bold mb-2"
          >
            {currentCycle?.books.map(b => (
              <option key={b.id} value={b.id}>{b.title}</option>
            ))}
          </select>
          <button
            onClick={() => setShowHub(true)}
            className="w-full py-1 mb-1.5 bg-white text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex justify-center items-center gap-1 hover:bg-emerald-50"
          >
            <BookOpen className="w-3.5 h-3.5" /> Паспорт книги
          </button>
          <button 
            onClick={() => setShowNewBookModal(true)}
            className="w-full py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex justify-center items-center gap-1 hover:bg-emerald-100"
          >
            <Plus className="w-3.5 h-3.5" /> Новая книга
          </button>
        </div>

        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-slate-400 uppercase">Главы и сцены</span>
          <button onClick={handleAddChapter} className="p-1 hover:bg-slate-100 rounded text-emerald-700" title="Добавить главу">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {currentCycle?.books.find(b => b.id === activeBookId)?.chapters.map(ch => (
          <div key={ch.id} className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-xs text-slate-700">{ch.title}</span>
              <button onClick={() => handleAddScene(ch.id)} className="text-[10px] text-emerald-600 font-semibold hover:underline">
                + сцена
              </button>
            </div>
            {ch.scenes.map(sc => (
              <button
                key={sc.id}
                onClick={() => setActiveSceneId(sc.id)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition truncate block mb-1 ${activeSceneId === sc.id ? 'bg-emerald-700 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
              >
                {sc.title}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* TEXT EDITOR AREA */}
      <div className="flex-1 p-6 overflow-y-auto flex justify-center bg-[#FAF9F6]">
        <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-emerald-100 flex flex-col min-h-[500px]">
          <input 
            type="text" 
            value={currentScene?.title || ''} 
            onChange={(e) => {
              const newTitle = e.target.value;
              setCycles(prev => prev.map(cyc => cyc.id === activeCycleId ? {
                ...cyc,
                books: cyc.books.map(bk => bk.id === activeBookId ? {
                  ...bk,
                  chapters: bk.chapters.map(ch => ({
                    ...ch,
                    scenes: ch.scenes.map(sc => sc.id === activeSceneId ? { ...sc, title: newTitle } : sc)
                  }))
                } : bk)
              } : cyc));
            }}
            className="text-xl font-bold border-b border-emerald-100 pb-2 mb-4 outline-none"
            placeholder="Название сцены"
          />
          <textarea
            ref={textareaRef}
            value={currentScene?.content || ''}
            onChange={(e) => updateSceneContent(e.target.value)}
            onSelect={captureSelection}
            onMouseUp={captureSelection}
            onKeyUp={captureSelection}
            className="w-full flex-1 resize-none border-none outline-none font-serif text-base leading-relaxed text-slate-800"
            placeholder="Пишите сцену..."
          />
        </div>
      </div>

      {/* AI ASSISTANT PANEL */}
      <AiAssistantPanel
        selectedText={selection.text}
        sceneContent={currentScene?.content || ''}
        currentScene={currentScene}
        currentCycle={currentCycle}
        onReplaceSelection={replaceSelection}
        onAppendText={appendText}
      />
      </>
      )}
    </div>
  );
}
