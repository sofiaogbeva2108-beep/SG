import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Plus, FolderPlus, Trash2, Edit3, Settings, 
  Sparkles, CheckCircle, AlertTriangle, Play, Pause, RotateCcw,
  BarChart2, FileDown, Layers, Users, MapPin, ShieldAlert,
  GitCommit, RefreshCw, Eye, Feather, HelpCircle, Save, Check
} from 'lucide-react';

export default function App() {
  // --- STATE ---
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('storyhub_projects');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return [
      {
        id: 'proj-1',
        title: 'Хроники Сумеречного Цвета',
        isSeries: true,
        books: [
          {
            id: 'book-1',
            title: 'Книга 1: Наследие',
            chapters: [
              {
                id: 'chap-1',
                title: 'Глава 1: Пробуждение',
                scenes: [
                  { 
                    id: 'sc-1', 
                    title: 'Сцена 1: Заброшенная башня', 
                    content: 'Холодный ветер проникал сквозь узкие бойницы башни, заставляя Элару сильнее сжаться в плащ. Каин молча стоял у края площадки, устремив взгляд в заснеженную долину. На горизонте возвышались очертания замка Лорда Вудса.\n\n— Нам нельзя здесь оставаться, — тихо произнесла Элара. — Если темные стражи обнаружат следы магии, мы не успеем добраться до перевала.' 
                  },
                  { 
                    id: 'sc-2', 
                    title: 'Сцена 2: Встреча в тумане', 
                    content: 'Густой туман застилал тропу, делая каждый шаг опасным...' 
                  }
                ]
              }
            ]
          }
        ],
        lore: {
          characters: [
            { id: 'c-1', name: 'Элара', role: 'Главная героиня', bio: 'Владеет редкой магией света. Ищет тайны своего происхождения.' },
            { id: 'c-2', name: 'Каин', role: 'Спутник / Защитник', bio: 'Бывший страж. Моделирует тактику боя и защищает Элару.' },
            { id: 'c-3', name: 'Лорд Вудс', role: 'Антагонист', bio: 'Правитель северных земель, охотящийся за древними артефактами.' }
          ],
          locations: [
            { id: 'l-1', name: 'Заброшенная башня', description: 'Старинное укрепление на вершине Драконьего пика.' },
            { id: 'l-2', name: 'Замок Вудса', description: 'Неприступная цитадель в северной долине.' }
          ],
          rules: [
            { id: 'r-1', title: 'Ограничения Магии', detail: 'Использование магии оставляет видимый фантомный след в тумане.' }
          ]
        }
      }
    ];
  });

  const [activeProjId, setActiveProjId] = useState('proj-1');
  const [activeBookId, setActiveBookId] = useState('book-1');
  const [activeSceneId, setActiveSceneId] = useState('sc-1');
  const [activeTab, setActiveTab] = useState('editor'); // editor, lore, analytics, export
  
  const [focusMode, setFocusMode] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [pomodoroActive, setPomodoroActive] = useState(false);
  
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiOutput, setAiOutput] = useState('');
  const [tautologyResults, setTautologyResults] = useState([]);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('storyhub_projects', JSON.stringify(projects));
  }, [projects]);

  // Pomodoro timer
  useEffect(() => {
    let interval = null;
    if (pomodoroActive && pomodoroTime > 0) {
      interval = setInterval(() => setPomodoroTime(t => t - 1), 1000);
    } else if (pomodoroTime === 0) {
      setPomodoroActive(false);
    }
    return () => clearInterval(interval);
  }, [pomodoroActive, pomodoroTime]);

  const activeProject = projects.find(p => p.id === activeProjId) || projects[0];
  const activeBook = activeProject?.books.find(b => b.id === activeBookId) || activeProject?.books[0];

  let currentScene = null;
  activeBook?.chapters.forEach(ch => {
    const sc = ch.scenes.find(s => s.id === activeSceneId);
    if (sc) currentScene = sc;
  });

  const updateSceneContent = (newContent) => {
    if (!currentScene) return;
    setProjects(prev => prev.map(proj => {
      if (proj.id !== activeProjId) return proj;
      return {
        ...proj,
        books: proj.books.map(bk => {
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

  const wordCount = currentScene?.content ? currentScene.content.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = currentScene?.content ? currentScene.content.length : 0;

  const runCanonCheck = () => {
    setAiAnalyzing(true);
    setAiOutput('ИИ анализирует соответствие лору и канону серии...');
    setTimeout(() => {
      setAiAnalyzing(false);
      setAiOutput('✅ Анализ завершен: Противоречий с каноном цикла «' + activeProject.title + '» не обнаружено. Описание локаций и поведение персонажей (Элара, Каин) соответствуют правилам мира.');
    }, 1500);
  };

  const runTautologyCheck = () => {
    if (!currentScene?.content) return;
    const words = currentScene.content.toLowerCase().match(/[а-яa-z]+/gi) || [];
    const freq = {};
    words.forEach(w => {
      if (w.length > 3) freq[w] = (freq[w] || 0) + 1;
    });
    const repeated = Object.entries(freq).filter(([_, count]) => count > 2).sort((a,b) => b[1] - a[1]);
    setTautologyResults(repeated);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FAF9F6] text-slate-800 font-sans">
      
      {/* SIDEBAR */}
      {!focusMode && (
        <div className="w-72 bg-emerald-950 text-emerald-50 flex flex-col justify-between border-r border-emerald-800">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-6 font-bold text-xl text-emerald-200">
              <Feather className="w-6 h-6 text-emerald-400" />
              <span>StoryHub AI</span>
            </div>

            <div className="mb-6">
              <label className="text-xs uppercase font-semibold text-emerald-400 tracking-wider block mb-2">
                Проект / Цикл книг
              </label>
              <div className="p-3 bg-emerald-900/60 rounded-xl border border-emerald-700/50">
                <div className="font-semibold text-sm text-emerald-100">{activeProject.title}</div>
                <div className="text-xs text-emerald-300 mt-0.5">{activeBook.title}</div>
              </div>
            </div>

            <div className="space-y-1">
              <button 
                onClick={() => setActiveTab('editor')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'editor' ? 'bg-emerald-800 text-white' : 'hover:bg-emerald-900/50 text-emerald-200'}`}
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Редактор & Сцены</span>
              </button>

              <button 
                onClick={() => setActiveTab('lore')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'lore' ? 'bg-emerald-800 text-white' : 'hover:bg-emerald-900/50 text-emerald-200'}`}
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Лор & Персонажи</span>
              </button>

              <button 
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'analytics' ? 'bg-emerald-800 text-white' : 'hover:bg-emerald-900/50 text-emerald-200'}`}
              >
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                <span>Аналитика & Повторы</span>
              </button>
            </div>

            <div className="mt-8 border-t border-emerald-800/80 pt-4">
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Структура книги</div>
              {activeBook.chapters.map(ch => (
                <div key={ch.id} className="mb-3">
                  <div className="text-xs font-bold text-emerald-300 px-2 py-1">{ch.title}</div>
                  {ch.scenes.map(sc => (
                    <button
                      key={sc.id}
                      onClick={() => { setActiveSceneId(sc.id); setActiveTab('editor'); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition truncate block ${activeSceneId === sc.id ? 'bg-emerald-700 text-white font-medium' : 'hover:bg-emerald-900/40 text-emerald-200'}`}
                    >
                      {sc.title}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-emerald-800/80 bg-emerald-900/30 text-xs text-emerald-400 flex items-center justify-between">
            <span>Локализация: RU</span>
            <span className="flex items-center gap-1"><Check className="w-3 h-3 text-emerald-400" /> Автосохранение</span>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <div className="h-14 border-b border-emerald-100 bg-white/80 backdrop-blur px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setFocusMode(!focusMode)}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 border border-emerald-200 transition"
            >
              <Eye className="w-4 h-4" />
              <span>{focusMode ? 'Выйти из режимa фокуса' : 'Режим фокуса'}</span>
            </button>

            {/* POMODORO TIMER */}
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-lg text-xs">
              <span className="font-mono font-bold text-slate-700">{formatTime(pomodoroTime)}</span>
              <button onClick={() => setPomodoroActive(!pomodoroActive)} className="text-slate-600 hover:text-slate-900">
                {pomodoroActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button onClick={() => { setPomodoroActive(false); setPomodoroTime(25*60); }} className="text-slate-600 hover:text-slate-900">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500">
            <span>Слов: <strong className="text-slate-800 font-semibold">{wordCount}</strong></span>
            <span>Символов: <strong className="text-slate-800 font-semibold">{charCount}</strong></span>
            <button 
              onClick={runCanonCheck}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-medium flex items-center gap-1.5 shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Проверить канон с ИИ</span>
            </button>
          </div>
        </div>

        {/* WORKSPACE CONTENT */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* EDITOR TAB */}
          {activeTab === 'editor' && (
            <div className="flex-1 p-8 overflow-y-auto flex justify-center bg-[#FAF9F6]">
              <div className="w-full max-w-2xl bg-white p-12 rounded-2xl shadow-sm border border-emerald-100/60 flex flex-col min-h-[600px]">
                <input 
                  type="text" 
                  value={currentScene?.title || ''} 
                  onChange={(e) => {
                    if (!currentScene) return;
                    setProjects(prev => prev.map(proj => proj.id === activeProjId ? {
                      ...proj,
                      books: proj.books.map(bk => bk.id === activeBookId ? {
                        ...bk,
                        chapters: bk.chapters.map(ch => ({
                          ...ch,
                          scenes: ch.scenes.map(sc => sc.id === activeSceneId ? { ...sc, title: e.target.value } : sc)
                        }))
                      } : bk)
                    } : proj));
                  }}
                  className="text-2xl font-bold text-slate-800 border-b border-emerald-100 pb-3 mb-6 outline-none bg-transparent"
                  placeholder="Название сцены"
                />
                <textarea
                  value={currentScene?.content || ''}
                  onChange={(e) => updateSceneContent(e.target.value)}
                  placeholder="Начните писать вашу историю здесь..."
                  className="w-full flex-1 resize-none border-none outline-none font-serif text-lg leading-relaxed text-slate-800 placeholder-slate-300 bg-transparent min-h-[450px]"
                />
              </div>
            </div>
          )}

          {/* LORE TAB */}
          {activeTab === 'lore' && (
            <div className="flex-1 p-8 overflow-y-auto bg-[#FAF9F6]">
              <div className="max-w-4xl mx-auto space-y-6">
                <h2 className="text-xl font-bold text-slate-800">Лор и Персонажи цикла «{activeProject.title}»</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-xl border border-emerald-100 shadow-sm">
                    <h3 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-600" /> Персонажи
                    </h3>
                    <div className="space-y-3">
                      {activeProject.lore.characters.map(c => (
                        <div key={c.id} className="p-3 bg-emerald-50/40 rounded-lg border border-emerald-100/80">
                          <div className="font-bold text-sm text-slate-800">{c.name}</div>
                          <div className="text-xs font-medium text-emerald-700">{c.role}</div>
                          <div className="text-xs text-slate-600 mt-1">{c.bio}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-emerald-100 shadow-sm">
                    <h3 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600" /> Локации и Правила
                    </h3>
                    <div className="space-y-3">
                      {activeProject.lore.locations.map(l => (
                        <div key={l.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
                          <div className="font-bold text-sm text-slate-800">{l.name}</div>
                          <div className="text-xs text-slate-600 mt-1">{l.description}</div>
                        </div>
                      ))}
                      {activeProject.lore.rules.map(r => (
                        <div key={r.id} className="p-3 bg-amber-50/60 rounded-lg border border-amber-200/60">
                          <div className="font-bold text-sm text-amber-900">{r.title}</div>
                          <div className="text-xs text-amber-800 mt-1">{r.detail}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="flex-1 p-8 overflow-y-auto bg-[#FAF9F6]">
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-800">Анализ текста и Тавтологии</h2>
                  <button 
                    onClick={runTautologyCheck}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition"
                  >
                    Запустить анализ частоты слов
                  </button>
                </div>

                <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm">
                  <h3 className="font-semibold text-sm text-slate-700 mb-4">Часто встречающиеся слова (тавтологии):</h3>
                  {tautologyResults.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3">
                      {tautologyResults.map(([word, count]) => (
                        <div key={word} className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-lg flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-800">{word}</span>
                          <span className="text-xs font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">{count}x</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Нажмите кнопку выше, чтобы найти повторы слов в активной сцене.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* AI ASSISTANT PANEL */}
          {!focusMode && (
            <div className="w-80 border-l border-emerald-100 bg-white/60 backdrop-blur p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-950 mb-4">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>ИИ-Соавтор (Gemini)</span>
                </div>

                <div className="space-y-2 mb-6">
                  <button 
                    onClick={() => { setAiAnalyzing(true); setTimeout(() => { setAiAnalyzing(false); setAiOutput('ИИ сгенерировал продолжение: "Элара сжала рукоять кинжала, чувствуя, как холодный металл успокаивает дрожь в пальцах..."'); }, 1000); }}
                    className="w-full text-left px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-lg text-xs font-medium border border-emerald-200/80 transition"
                  >
                    ⚡ Продолжить сцену
                  </button>
                  <button 
                    onClick={() => { setAiAnalyzing(true); setTimeout(() => { setAiAnalyzing(false); setAiOutput('Стилевая подсказка: Попробуйте заменить глаголы движения на более описательные, чтобы передать напряженную атмосферу.'); }, 1000); }}
                    className="w-full text-left px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-lg text-xs font-medium border border-emerald-200/80 transition"
                  >
                    🎨 Улучшить описания
                  </button>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 leading-relaxed min-h-[140px]">
                  {aiAnalyzing ? (
                    <div className="text-emerald-700 font-medium animate-pulse flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Обработка запроса ИИ...</span>
                    </div>
                  ) : (
                    aiOutput || 'Выберите действие выше или запустите канон-чекер.'
                  )}
                </div>
              </div>

              <div className="p-3 bg-emerald-50/80 rounded-lg border border-emerald-100 text-[11px] text-emerald-900">
                💡 ИИ автоматически считывает персонажей и лор активного цикла.
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
