import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { 
  BookOpen, Plus, Trash2, Edit3, Settings, Sparkles, CheckCircle, 
  AlertTriangle, Play, Pause, RotateCcw, BarChart2, FileDown, Layers, 
  Users, MapPin, Eye, Feather, Check, Menu, X, Image as ImageIcon, 
  Wand2, Compass, Book, Home, HelpCircle, Activity, MessageSquare, 
  Flame, Award, ArrowLeft, Volume2, VolumeX, Save, ChevronRight, Loader2
} from 'lucide-react';

// Инициализация Gemini API (использует ключ из env или встроенный)
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

export default function App() {
  // --- STATE: CYCLES & BOOKS ---
  const [cycles, setCycles] = useState(() => {
    const saved = localStorage.getItem('mythos_cycles');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return [
      {
        id: 'cycle-1',
        title: 'Хроники Сумеречного Цвета',
        description: 'Темное фэнтези о древней магии, зимних землях и тайнах происхождения.',
        lore: {
          characters: [
            { id: 'c-1', name: 'Элара', role: 'Главная героиня', bio: 'Владеет редкой магией света. Ищет тайны своего происхождения.' },
            { id: 'c-2', name: 'Каин', role: 'Защитник / Спутник', bio: 'Бывший страж. Храбрый, но скрытный.' },
            { id: 'c-3', name: 'Лорд Вудс', role: 'Антагонист', bio: 'Правитель северных земель, охотящийся за древними артефактами.' }
          ],
          locations: [
            { id: 'l-1', name: 'Заброшенная башня', description: 'Старинное укрепление на вершине Драконьего пика.' },
            { id: 'l-2', name: 'Замок Вудса', description: 'Неприступная цитадель в северной долине.' }
          ]
        },
        books: [
          {
            id: 'book-1',
            title: 'Книга 1: Наследие',
            cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
            chapters: [
              {
                id: 'chap-1',
                title: 'Глава 1: Пробуждение в тумане',
                tension: 40,
                scenes: [
                  { 
                    id: 'sc-1', 
                    title: 'Сцена 1: Заброшенная башня', 
                    content: 'Холодный ветер проникал сквозь узкие бойницы башни, заставляя Элару сильнее сжаться в плащ. Каин молча стоял у края площадки, устремив взгляд в заснеженную долину. На горизонте возвышались очертания замка Лорда Вудса.\n\n— Нам нельзя здесь оставаться, — тихо произнесла Элара. — Если темные стражи обнаружат следы магии, мы не успеем добраться до перевала.' 
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
  });

  // NAVIGATION & UI
  const [activeView, setActiveView] = useState('dashboard');
  const [activeCycleId, setActiveCycleId] = useState('cycle-1');
  const [activeBookId, setActiveBookId] = useState('book-1');
  const [activeSceneId, setActiveSceneId] = useState('sc-1');
  const [focusMode, setFocusMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  // RPG & AI STATE
  const [writerLevel] = useState(3);
  const [streakDays] = useState(5);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');

  // LAB & SIMULATOR
  const [simChar1, setSimChar1] = useState('Элара');
  const [simChar2, setSimChar2] = useState('Каин');

  useEffect(() => {
    localStorage.setItem('mythos_cycles', JSON.stringify(cycles));
  }, [cycles]);

  const currentCycle = cycles.find(c => c.id === activeCycleId) || cycles[0];
  const currentBook = currentCycle?.books.find(b => b.id === activeBookId) || currentCycle?.books[0];

  let currentScene = null;
  currentBook?.chapters.forEach(ch => {
    const sc = ch.scenes.find(s => s.id === activeSceneId);
    if (sc) currentScene = sc;
  });

  const updateSceneContent = (newContent) => {
    if (!currentScene) return;
    setCycles(prev => prev.map(cyc => {
      if (cyc.id !== activeCycleId) return cyc;
      return {
        ...cyc,
        books: cyc.books.map(bk => {
          if (bk.id !== activeBookId) return bk;
          return {
            ...bk,
            chapters: bk.chapters.map(ch => ({
              ...ch,
              scenes: ch.scenes.map(sc => sc.id === activeSceneId ? { ...sc, content: newContent } : sc)
            }))
          };
        })
      };
    }));
  };

  // --- GEMINI AI CALLS ---
  const runAiBetaReader = async () => {
    if (!currentScene?.content) return;
    setAiLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Проведи анализ литературного отрывка как строгого бета-ридера и литературного редактора.
        
Контекст мира: ${currentCycle.description}
Персонажи: ${currentCycle.lore.characters.map(c => c.name + ': ' + c.bio).join('; ')}

Текст сцены:
"${currentScene.content}"

Выдай ответ по структуре:
🟢 Сильные стороны: (1-2 пункта)
🟡 Что провисает/скучно: (1-2 пункта)
🔴 Детектор ООС (выход из характера) и логические дыры: (краткий анализ)`
      });
      setAiResponse(response.text);
    } catch (e) {
      setAiResponse('Ошибка запроса к ИИ. Убедитесь, что настроен VITE_GEMINI_API_KEY в переменных окружения.');
    } finally {
      setAiLoading(false);
    }
  };

  const runCharacterSim = async () => {
    setAiLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Смоделируй короткую напряженную сцену диалога между двумя персонажами для фэнтези книги.
Персонаж 1: ${simChar1}
Персонаж 2: ${simChar2}
Мир: ${currentCycle.description}

Напиши их диалог на основе характеров и сзади добавь вердикт ИИ о химии персонажей.`
      });
      setAiResponse(response.text);
    } catch (e) {
      setAiResponse('Ошибка при моделировании симулятора.');
    } finally {
      setAiLoading(false);
    }
  };

  // --- EXPORT TO DOCX ---
  const exportToDocx = () => {
    const docChildren = [
      new Paragraph({ text: currentBook.title, heading: HeadingLevel.TITLE }),
      new Paragraph({ text: `Цикл: ${currentCycle.title}`, heading: HeadingLevel.SUBTITLE }),
      new Paragraph({ text: '' })
    ];

    currentBook.chapters.forEach(ch => {
      docChildren.push(new Paragraph({ text: ch.title, heading: HeadingLevel.HEADING_1 }));
      ch.scenes.forEach(sc => {
        docChildren.push(new Paragraph({ text: sc.title, heading: HeadingLevel.HEADING_2 }));
        docChildren.push(new Paragraph({ text: sc.content }));
        docChildren.push(new Paragraph({ text: '' }));
      });
    });

    const doc = new Document({ sections: [{ children: docChildren }] });
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `${currentBook.title}.docx`);
    });
  };

  const totalWords = currentBook?.chapters.reduce((acc, ch) => 
    acc + ch.scenes.reduce((sAcc, sc) => sAcc + (sc.content ? sc.content.trim().split(/\s+/).filter(Boolean).length : 0), 0), 0) || 0;

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-[#FAF9F6] text-slate-800 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      {(!focusMode || mobileMenuOpen) && (
        <div className="w-full md:w-64 bg-emerald-950 text-emerald-50 flex flex-col justify-between border-r border-emerald-800 p-4">
          <div className="space-y-6">
            <div className="flex items-center gap-2 font-bold text-xl text-emerald-200">
              <Feather className="w-6 h-6 text-emerald-400" />
              <span>Mythos Studio</span>
            </div>

            <div className="p-3 bg-emerald-900/60 rounded-xl border border-emerald-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-emerald-100 border border-emerald-500">
                L{writerLevel}
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-200">Мастер Сюжета</div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-0.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{streakDays} дней в строю</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              {[
                { id: 'dashboard', label: 'Главная (Циклы)', icon: Home },
                { id: 'editor', label: 'Кабинет Писателя', icon: BookOpen },
                { id: 'reader', label: 'Читалка', icon: Eye },
                { id: 'analytics', label: 'Рентген & Аналитика', icon: Activity },
                { id: 'lab', label: 'Комната испытаний', icon: MessageSquare },
                { id: 'help', label: 'Обучение', icon: HelpCircle }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${activeView === item.id ? 'bg-emerald-800 text-white' : 'hover:bg-emerald-900/50 text-emerald-300'}`}
                >
                  <item.icon className="w-4 h-4 text-emerald-400" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-emerald-800 text-[11px] text-emerald-400">
            Mythos Studio Pro • Gemini Ready
          </div>
        </div>
      )}

      {/* MAIN VIEW */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="h-12 border-b border-emerald-100 bg-white px-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setFocusMode(!focusMode)}
              className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1 border border-emerald-200"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{focusMode ? 'Выйти из фокуса' : 'Фокус'}</span>
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

        {/* CONTENT SWITCHER */}
        <div className="flex-1 overflow-hidden relative">
          
          {/* EDITOR */}
          {activeView === 'editor' && (
            <div className="h-full flex">
              <div className="w-64 border-r border-emerald-100 bg-white p-4 overflow-y-auto hidden md:block">
                <div className="text-xs font-bold text-slate-400 uppercase mb-3">Главы и сцены</div>
                {currentBook.chapters.map(ch => (
                  <div key={ch.id} className="mb-4">
                    <div className="font-bold text-xs text-slate-700 mb-1">{ch.title}</div>
                    {ch.scenes.map(sc => (
                      <button
                        key={sc.id}
                        onClick={() => setActiveSceneId(sc.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition truncate block ${activeSceneId === sc.id ? 'bg-emerald-700 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
                      >
                        {sc.title}
                      </button>
                    ))}
                  </div>
                ))}
              </div>

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
                  />
                  <textarea
                    value={currentScene?.content || ''}
                    onChange={(e) => updateSceneContent(e.target.value)}
                    className="w-full flex-1 resize-none border-none outline-none font-serif text-base leading-relaxed text-slate-800"
                    placeholder="Пишите сцену..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* ANALYTICS & BETA READER */}
          {activeView === 'analytics' && (
            <div className="h-full p-6 overflow-y-auto max-w-4xl mx-auto space-y-6">
              <h1 className="text-xl font-bold text-slate-900">ИИ Бета-ридер & Рентген сюжета</h1>
              
              <button 
                onClick={runAiBetaReader}
                disabled={aiLoading}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
              >
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Запустить ИИ-Анализ сцены</span>
              </button>

              {aiResponse && (
                <div className="p-5 bg-white rounded-2xl border border-emerald-100 shadow-sm text-xs leading-relaxed whitespace-pre-wrap">
                  {aiResponse}
                </div>
              )}
            </div>
          )}

          {/* LAB */}
          {activeView === 'lab' && (
            <div className="h-full p-6 overflow-y-auto max-w-3xl mx-auto space-y-6">
              <h1 className="text-xl font-bold text-slate-900">Симулятор отношений персонажей</h1>
              <div className="grid grid-cols-2 gap-4">
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
              </div>
              <button 
                onClick={runCharacterSim}
                disabled={aiLoading}
                className="w-full py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-semibold flex justify-center items-center gap-2"
              >
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Смоделировать столкновение</span>
              </button>

              {aiResponse && (
                <div className="p-5 bg-white rounded-2xl border border-emerald-100 text-xs leading-relaxed whitespace-pre-wrap">
                  {aiResponse}
                </div>
              )}
            </div>
          )}

          {/* DASHBOARD */}
          {activeView === 'dashboard' && (
            <div className="h-full p-8 overflow-y-auto max-w-4xl mx-auto space-y-6">
              <h1 className="text-2xl font-bold">Мои Циклы Книг</h1>
              {cycles.map(cyc => (
                <div key={cyc.id} className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
                  <h2 className="text-lg font-bold text-emerald-900">{cyc.title}</h2>
                  <p className="text-xs text-slate-500">{cyc.description}</p>
                  <div className="pt-2 text-xs font-semibold text-emerald-700">Книг в цикле: {cyc.books.length}</div>
                </div>
              ))}
            </div>
          )}

          {/* READER */}
          {activeView === 'reader' && (
            <div className="h-full p-8 overflow-y-auto max-w-2xl mx-auto font-serif leading-relaxed">
              <h1 className="text-2xl font-bold font-sans text-center mb-6">{currentBook.title}</h1>
              {currentBook.chapters.map(ch => (
                <div key={ch.id} className="mb-6">
                  <h2 className="text-lg font-bold font-sans mb-3">{ch.title}</h2>
                  {ch.scenes.map(sc => (
                    <p key={sc.id} className="whitespace-pre-wrap text-base mb-4">{sc.content}</p>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* HELP */}
          {activeView === 'help' && (
            <div className="h-full p-8 overflow-y-auto max-w-3xl mx-auto space-y-4">
              <h1 className="text-xl font-bold">Инструкция по Mythos Studio</h1>
              <div className="p-4 bg-white rounded-xl border border-emerald-100 text-xs leading-relaxed space-y-2">
                <p>• <strong>Ключ Gemini:</strong> Добавьте ваш ключ в переменные окружения как VITE_GEMINI_API_KEY для активации ИИ-функций.</p>
                <p>• <strong>Экспорт в DOCX:</strong> Кнопка вверху справа выгружает всю книгу со структурой глав в формат Word.</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
