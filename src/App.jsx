import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Plus, Trash2, Edit3, Settings, Sparkles, CheckCircle, 
  AlertTriangle, Play, Pause, RotateCcw, BarChart2, FileDown, Layers, 
  Users, MapPin, Eye, Feather, Check, Menu, X, Image as ImageIcon, 
  Wand2, Compass, Book, Home, HelpCircle, Activity, MessageSquare, 
  Flame, Award, ArrowLeft, Volume2, VolumeX, Move, Save, ChevronRight
} from 'lucide-react';

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
            { id: 'c-2', name: 'Каин', role: 'Защитник / Спутник', bio: 'Бывший страж. Моделирует тактику боя и защищает Элару.' },
            { id: 'c-3', name: 'Лорд Вудс', role: 'Антагонист', bio: 'Правитель северных земель, охотящийся за древними артефактами.' }
          ],
          locations: [
            { id: 'l-1', name: 'Заброшенная башня', description: 'Старинное укрепление на вершине Драконьего пика.' },
            { id: 'l-2', name: 'Замок Вудса', description: 'Неприступная цитадель в северной долине.' }
          ],
          rules: [
            { id: 'r-1', title: 'Ограничения Магии', detail: 'Использование магии оставляет видимый фантомный след в тумане.' }
          ]
        },
        books: [
          {
            id: 'book-1',
            title: 'Книга 1: Наследие',
            cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
            targetWords: 50000,
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
                  },
                  { 
                    id: 'sc-2', 
                    title: 'Сцена 2: Ночной заслон', 
                    content: 'Густой туман застилал тропу, делая каждый шаг опасным. Вдали послышался глухой топот копыт...' 
                  }
                ]
              },
              {
                id: 'chap-2',
                title: 'Глава 2: Погоня у Перевала',
                tension: 85,
                scenes: [
                  {
                    id: 'sc-3',
                    title: 'Сцена 1: Засада стражей',
                    content: 'Вспышка заклятия осветила обледенелые скалы. Каин мгновенно обнажил клинок, закрывая собой Элару.'
                  }
                ]
              }
            ]
          },
          {
            id: 'book-2',
            title: 'Книга 2: Пламя Перевала',
            cover: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
            targetWords: 60000,
            chapters: [
              {
                id: 'chap-2-1',
                title: 'Глава 1: Новая угроза',
                tension: 50,
                scenes: [
                  { id: 'sc-2-1', title: 'Сцена 1: Совет фракций', content: 'Прошел год после битвы у башни. Северные кланы начали собирать войска...' }
                ]
              }
            ]
          }
        ]
      }
    ];
  });

  // --- GENERAL STATE ---
  const [activeView, setActiveView] = useState('dashboard'); // dashboard, editor, reader, artbook, analytics, lab, help
  const [activeCycleId, setActiveCycleId] = useState('cycle-1');
  const [activeBookId, setActiveBookId] = useState('book-1');
  const [activeSceneId, setActiveSceneId] = useState('sc-1');

  const [focusMode, setFocusMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  // --- RPG STATE ---
  const [writerLevel, setWriterLevel] = useState(3);
  const [streakDays, setStreakDays] = useState(5);

  // --- GALLERY STATE ---
  const [generatedGallery, setGeneratedGallery] = useState(() => {
    const saved = localStorage.getItem('mythos_gallery');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return [
      {
        id: 'img-1',
        type: 'cover',
        title: 'Обложка «Наследие»',
        prompt: 'Dark fantasy book cover, Legacy of the Twilight Flower, winter valley, dark magical aesthetic',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'img-2',
        type: 'map',
        title: 'Карта континента',
        prompt: 'Fantasy continent map, kingdoms of Elendor and Veldarn, vintage cartography style',
        url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80'
      }
    ];
  });

  const [genCategory, setGenCategory] = useState('character');
  const [genPrompt, setGenPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // --- LAB STATE ---
  const [labMode, setLabMode] = useState('sim'); // sim, interview
  const [simChar1, setSimChar1] = useState('Элара');
  const [simChar2, setSimChar2] = useState('Каин');
  const [simOutput, setSimOutput] = useState('');
  const [simLoading, setSimLoading] = useState(false);

  // Save LocalStorage
  useEffect(() => {
    localStorage.setItem('mythos_cycles', JSON.stringify(cycles));
  }, [cycles]);

  useEffect(() => {
    localStorage.setItem('mythos_gallery', JSON.stringify(generatedGallery));
  }, [generatedGallery]);

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

  const totalWordsInBook = currentBook?.chapters.reduce((acc, ch) => {
    return acc + ch.scenes.reduce((sAcc, sc) => sAcc + (sc.content ? sc.content.trim().split(/\s+/).filter(Boolean).length : 0), 0);
  }, 0) || 0;

  const currentSceneWords = currentScene?.content ? currentScene.content.trim().split(/\s+/).filter(Boolean).length : 0;

  const handleGenerateArt = () => {
    if (!genPrompt.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      const sampleImages = {
        character: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        location: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
        map: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
        cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80'
      };

      const newArt = {
        id: 'img-' + Date.now(),
        type: genCategory,
        title: `${genCategory.toUpperCase()}: ${genPrompt.slice(0, 18)}...`,
        prompt: genPrompt,
        url: sampleImages[genCategory]
      };

      setGeneratedGallery(prev => [newArt, ...prev]);
      setIsGenerating(false);
      setGenPrompt('');
    }, 1800);
  };

  const runSim = () => {
    setSimLoading(true);
    setSimOutput('');
    setTimeout(() => {
      setSimLoading(false);
      setSimOutput(
        `[Симуляция отношений: ${simChar1} и ${simChar2}]\n\n` +
        `Локация: Заброшенная башня.\n` +
        `${simChar1}: «Ты ведь знал, что Лорд Вудс ищет не просто артефакт, а ключ к перевалу?»\n` +
        `${simChar2}: (на мгновение замирает, сжимая рукоять меча) «Есть вещи, о которых лучше молчать, пока туман не рассеется.»\n\n` +
        `💡 Вердикт ИИ: Напряжение между персонажами 78%. Динамика доверия соблюдена.`
      );
    }, 1500);
  };

  const exportPassport = () => {
    const passportData = `=== ПАСПОРТ МИРА: ${currentCycle.title} ===\n\n` +
      `ОПИСАНИЕ:\n${currentCycle.description}\n\n` +
      `ПЕРСОНАЖИ:\n` + currentCycle.lore.characters.map(c => `- ${c.name} (${c.role}): ${c.bio}`).join('\n') + `\n\n` +
      `ЛОКАЦИИ:\n` + currentCycle.lore.locations.map(l => `- ${l.name}: ${l.description}`).join('\n');
    
    const element = document.createElement("a");
    const file = new Blob([passportData], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Passport_${currentCycle.title}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-[#FAF9F6] text-slate-800 font-sans">
      
      {/* MOBILE HEADER */}
      <div className="md:hidden bg-emerald-950 text-emerald-50 px-4 py-3 flex items-center justify-between border-b border-emerald-800 z-30">
        <div className="flex items-center gap-2 font-bold text-lg text-emerald-200">
          <Feather className="w-5 h-5 text-emerald-400" />
          <span>Mythos Studio</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-emerald-900 rounded-lg text-emerald-200"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MAIN NAVIGATION SIDEBAR */}
      {(!focusMode || mobileMenuOpen) && (
        <div className={`
          fixed md:relative inset-0 z-20 bg-emerald-950 text-emerald-50 flex flex-col justify-between border-r border-emerald-800 w-full md:w-64
          ${mobileMenuOpen ? 'flex mt-12 md:mt-0' : 'hidden md:flex'}
        `}>
          <div className="p-4 overflow-y-auto">
            {/* BRAND */}
            <div className="hidden md:flex items-center gap-2 mb-6 font-bold text-xl text-emerald-200 tracking-wide">
              <Feather className="w-6 h-6 text-emerald-400" />
              <span>Mythos Studio</span>
            </div>

            {/* RPG USER BADGE */}
            <div className="mb-6 p-3 bg-emerald-900/60 rounded-xl border border-emerald-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-emerald-100 border border-emerald-500">
                L{writerLevel}
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-emerald-200">Мастер Сюжета</div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-0.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{streakDays} дней в строю</span>
                </div>
              </div>
            </div>

            {/* NAV LINKS */}
            <div className="space-y-1">
              <button 
                onClick={() => { setActiveView('dashboard'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${activeView === 'dashboard' ? 'bg-emerald-800 text-white' : 'hover:bg-emerald-900/50 text-emerald-300'}`}
              >
                <Home className="w-4 h-4 text-emerald-400" />
                <span>Главная (Циклы)</span>
              </button>

              <button 
                onClick={() => { setActiveView('editor'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${activeView === 'editor' ? 'bg-emerald-800 text-white' : 'hover:bg-emerald-900/50 text-emerald-300'}`}
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Кабинет Писателя</span>
              </button>

              <button 
                onClick={() => { setActiveView('reader'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${activeView === 'reader' ? 'bg-emerald-800 text-white' : 'hover:bg-emerald-900/50 text-emerald-300'}`}
              >
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>Читалка</span>
              </button>

              <button 
                onClick={() => { setActiveView('analytics'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${activeView === 'analytics' ? 'bg-emerald-800 text-white' : 'hover:bg-emerald-900/50 text-emerald-300'}`}
              >
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Рентген & Аналитика</span>
              </button>

              <button 
                onClick={() => { setActiveView('lab'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${activeView === 'lab' ? 'bg-emerald-800 text-white' : 'hover:bg-emerald-900/50 text-emerald-300'}`}
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Комната испытаний</span>
              </button>

              <button 
                onClick={() => { setActiveView('artbook'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${activeView === 'artbook' ? 'bg-emerald-800 text-white' : 'hover:bg-emerald-900/50 text-emerald-300'}`}
              >
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>ИИ-Артбук</span>
              </button>

              <button 
                onClick={() => { setActiveView('help'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${activeView === 'help' ? 'bg-emerald-800 text-white' : 'hover:bg-emerald-900/50 text-emerald-300'}`}
              >
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                <span>Обучение</span>
              </button>
            </div>

            {/* CURRENT ACTIVE NOVEL */}
            <div className="mt-6 border-t border-emerald-800/80 pt-4">
              <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider mb-2">Текущая книга</div>
              <div className="p-2.5 bg-emerald-900/40 rounded-lg border border-emerald-700/40 text-xs">
                <div className="font-bold text-emerald-100 truncate">{currentBook.title}</div>
                <div className="text-[11px] text-emerald-300 truncate mt-0.5">{currentCycle.title}</div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-emerald-800/80 bg-emerald-900/30 text-[11px] text-emerald-400 flex items-center justify-between">
            <span>Mythos v2.4</span>
            <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Сохранено</span>
          </div>
        </div>
      )}

      {/* WORKSPACE AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOP BAR */}
        <div className="h-12 border-b border-emerald-100 bg-white/80 backdrop-blur px-4 flex items-center justify-between gap-2 z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setFocusMode(!focusMode)}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1 border border-emerald-200 transition"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{focusMode ? 'Выйти из фокуса' : 'Фокус'}</span>
            </button>

            {/* AUDIO SOUNDSCAPE TOGGLE */}
            <button 
              onClick={() => setAudioPlaying(!audioPlaying)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${audioPlaying ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {audioPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{audioPlaying ? 'Аудио: Заснеженная башня' : 'Звуковой фон'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>Слов в книге: <strong className="text-slate-800 font-semibold">{totalWordsInBook}</strong></span>
            <button 
              onClick={exportPassport}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium flex items-center gap-1 transition"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Паспорт мира</span>
            </button>
          </div>
        </div>

        {/* VIEW SWITCHER */}
        <div className="flex-1 overflow-hidden relative">

          {/* VIEW 1: DASHBOARD */}
          {activeView === 'dashboard' && (
            <div className="h-full p-4 sm:p-8 overflow-y-auto bg-[#FAF9F6]">
              <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Мои Циклы & Книги</h1>
                    <p className="text-xs text-slate-500 mt-1">Управляйте сериями книг со сквозным лором, общими персонажами и мирами.</p>
                  </div>
                  <button className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition">
                    <Plus className="w-4 h-4" /> Новый цикл книг
                  </button>
                </div>

                {/* CYCLES LIST */}
                <div className="space-y-6">
                  {cycles.map(cyc => (
                    <div key={cyc.id} className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold uppercase">Цикл книг</span>
                            <h2 className="text-lg font-bold text-slate-800">{cyc.title}</h2>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{cyc.description}</p>
                        </div>
                        <button 
                          onClick={exportPassport}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1 border border-emerald-200 transition"
                        >
                          <FileDown className="w-3.5 h-3.5" />
                          <span>Паспорт мира</span>
                        </button>
                      </div>

                      {/* BOOKS IN CYCLE */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                        {cyc.books.map(bk => (
                          <div 
                            key={bk.id} 
                            onClick={() => {
                              setActiveCycleId(cyc.id);
                              setActiveBookId(bk.id);
                              setActiveView('editor');
                            }}
                            className="group bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 hover:border-emerald-300 rounded-xl p-3 cursor-pointer transition flex gap-3"
                          >
                            <img src={bk.cover} alt={bk.title} className="w-16 h-22 object-cover rounded-lg shadow-sm group-hover:scale-105 transition" />
                            <div className="flex-1 flex flex-col justify-between py-0.5">
                              <div>
                                <div className="font-bold text-sm text-slate-800 group-hover:text-emerald-900 transition">{bk.title}</div>
                                <div className="text-[11px] text-slate-500 mt-1">{bk.chapters.length} глав</div>
                              </div>
                              <div className="flex items-center justify-between text-[10px] font-semibold text-emerald-700">
                                <span>Открыть</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          </div>
                        ))}

                        <button className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl p-4 flex flex-col items-center justify-center text-slate-400 hover:text-emerald-700 transition gap-1 min-h-[100px]">
                          <Plus className="w-5 h-5" />
                          <span className="text-xs font-semibold">Добавить книгу в цикл</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: EDITOR */}
          {activeView === 'editor' && (
            <div className="h-full flex overflow-hidden">
              {/* CHAPTERS / SCENES LIST */}
              <div className="w-64 border-r border-emerald-100 bg-white p-4 overflow-y-auto hidden md:block">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Структура книги</div>
                {currentBook.chapters.map(ch => (
                  <div key={ch.id} className="mb-4">
                    <div className="font-bold text-xs text-slate-700 mb-1 flex items-center justify-between">
                      <span>{ch.title}</span>
                    </div>
                    <div className="space-y-1">
                      {ch.scenes.map(sc => (
                        <button
                          key={sc.id}
                          onClick={() => setActiveSceneId(sc.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs transition truncate block ${activeSceneId === sc.id ? 'bg-emerald-700 text-white font-medium' : 'hover:bg-slate-100 text-slate-600'}`}
                        >
                          {sc.title}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* EDITOR MAIN */}
              <div className="flex-1 p-4 sm:p-8 overflow-y-auto flex justify-center bg-[#FAF9F6]">
                <div className="w-full max-w-2xl bg-white p-6 sm:p-12 rounded-2xl shadow-sm border border-emerald-100/60 flex flex-col min-h-[550px]">
                  <input 
                    type="text" 
                    value={currentScene?.title || ''} 
                    onChange={(e) => {
                      if (!currentScene) return;
                      setCycles(prev => prev.map(cyc => cyc.id === activeCycleId ? {
                        ...cyc,
                        books: cyc.books.map(bk => bk.id === activeBookId ? {
                          ...bk,
                          chapters: bk.chapters.map(ch => ({
                            ...ch,
                            scenes: ch.scenes.map(sc => sc.id === activeSceneId ? { ...sc, title: e.target.value } : sc)
                          }))
                        } : bk)
                      } : cyc));
                    }}
                    className="text-xl sm:text-2xl font-bold text-slate-800 border-b border-emerald-100 pb-2 mb-4 outline-none bg-transparent"
                    placeholder="Название сцены"
                  />
                  <textarea
                    value={currentScene?.content || ''}
                    onChange={(e) => updateSceneContent(e.target.value)}
                    placeholder="Начните писать вашу историю здесь..."
                    className="w-full flex-1 resize-none border-none outline-none font-serif text-base sm:text-lg leading-relaxed text-slate-800 placeholder-slate-300 bg-transparent min-h-[380px]"
                  />
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>Слов в сцене: {currentSceneWords}</span>
                    <span>Автосохранение включено</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: READER MODE */}
          {activeView === 'reader' && (
            <div className="h-full p-6 sm:p-12 overflow-y-auto bg-[#FBF9F5] flex justify-center">
              <div className="max-w-2xl w-full space-y-8 py-8 font-serif">
                <div className="text-center border-b border-amber-200/60 pb-8 space-y-2">
                  <div className="text-xs font-sans text-amber-800 tracking-widest uppercase">{currentCycle.title}</div>
                  <h1 className="text-3xl font-bold text-slate-900">{currentBook.title}</h1>
                  <div className="text-xs font-sans text-slate-400">Время на чтение: ~15 мин.</div>
                </div>

                {currentBook.chapters.map(ch => (
                  <div key={ch.id} className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-800 font-sans border-b border-slate-200/60 pb-2">{ch.title}</h2>
                    {ch.scenes.map(sc => (
                      <div key={sc.id} className="space-y-4">
                        <h3 className="text-sm font-semibold font-sans text-emerald-900">{sc.title}</h3>
                        <div className="text-base sm:text-lg leading-relaxed text-slate-800 whitespace-pre-wrap">
                          {sc.content}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 4: ANALYTICS & X-RAY */}
          {activeView === 'analytics' && (
            <div className="h-full p-4 sm:p-8 overflow-y-auto bg-[#FAF9F6]">
              <div className="max-w-4xl mx-auto space-y-6">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Рентген сюжета & Симулятор читателя</h1>
                  <p className="text-xs text-slate-500 mt-1">Визуализация эмоционального напряжения по главам и честная обратная связь от ИИ.</p>
                </div>

                {/* X-RAY CHART */}
                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-4">
                  <div className="font-bold text-sm text-slate-800 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span>График эмоционального напряжения</span>
                  </div>

                  <div className="h-48 flex items-end gap-3 pt-6 pb-2 px-4 border-b border-slate-100">
                    {currentBook.chapters.map((ch, idx) => (
                      <div key={ch.id} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <span className="text-[10px] font-bold text-emerald-800">{ch.tension}%</span>
                        <div 
                          style={{ height: `${ch.tension}%` }}
                          className="w-full bg-emerald-600/80 hover:bg-emerald-700 rounded-t-lg transition-all"
                        />
                        <span className="text-[10px] text-slate-500 truncate w-full text-center">Гл. {idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BETA READER REPORT */}
                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
                  <div className="font-bold text-sm text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Отчет ИИ-Бета-ридера</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl text-xs space-y-2 text-slate-700 leading-relaxed">
                    <p>🟢 <strong>Сильные стороны:</strong> Взаимодействие Элары и Каина в 1-й главе задает отличный загадочный тон. Атмосфера заснеженной башни передана ярко.</p>
                    <p>🟡 <strong>Где стоит ускориться:</strong> Во 2-й сцене немного затянуты внутренние размышления героини перед началом движения к перевалу.</p>
                    <p>🔴 <strong>Детектор ООС:</strong> Противоречий в характере Каина не обнаружено (поведение сдержанного защитника выдержано канонично).</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 5: LAB (RELATIONS & INTERVIEW) */}
          {activeView === 'lab' && (
            <div className="h-full p-4 sm:p-8 overflow-y-auto bg-[#FAF9F6]">
              <div className="max-w-3xl mx-auto space-y-6">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Комната испытаний персонажей</h1>
                  <p className="text-xs text-slate-500 mt-1">Проводите тест-драйв совместимости персонажей и интервьюирование героев.</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Персонаж 1</label>
                      <input 
                        type="text" 
                        value={simChar1} 
                        onChange={(e) => setSimChar1(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Персонаж 2</label>
                      <input 
                        type="text" 
                        value={simChar2} 
                        onChange={(e) => setSimChar2(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={runSim}
                    disabled={simLoading}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition shadow-sm flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{simLoading ? 'Моделирование диалога...' : 'Запустить столкновение героев'}</span>
                  </button>

                  {simOutput && (
                    <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
                      {simOutput}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 6: ARTBOOK */}
          {activeView === 'artbook' && (
            <div className="h-full p-4 sm:p-8 overflow-y-auto bg-[#FAF9F6]">
              <div className="max-w-4xl mx-auto space-y-6">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">ИИ-Визуализация & Артбук</h1>
                  <p className="text-xs text-slate-500 mt-1">Создавайте иллюстрации персонажей, карт, локаций и обложек для цикла.</p>
                </div>

                {/* GENERATOR FORM */}
                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['character', 'location', 'map', 'cover'].map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setGenCategory(cat)}
                        className={`p-2 rounded-xl text-xs font-medium border capitalize transition ${genCategory === cat ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold' : 'border-slate-200 text-slate-600'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="text" 
                      value={genPrompt}
                      onChange={(e) => setGenPrompt(e.target.value)}
                      placeholder="Опишите желаемую иллюстрацию..."
                      className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                    />
                    <button 
                      onClick={handleGenerateArt}
                      disabled={isGenerating || !genPrompt.trim()}
                      className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition"
                    >
                      {isGenerating ? 'Создание...' : 'Сгенерировать'}
                    </button>
                  </div>
                </div>

                {/* GALLERY */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {generatedGallery.map(art => (
                    <div key={art.id} className="bg-white rounded-xl border border-emerald-100 overflow-hidden shadow-sm">
                      <img src={art.url} alt={art.title} className="w-full h-44 object-cover" />
                      <div className="p-3">
                        <div className="font-bold text-xs text-slate-800">{art.title}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5 truncate">{art.prompt}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 7: HELP & ACADEMY */}
          {activeView === 'help' && (
            <div className="h-full p-4 sm:p-8 overflow-y-auto bg-[#FAF9F6]">
              <div className="max-w-3xl mx-auto space-y-6">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Обучение & Руководство Mythos Studio</h1>
                  <p className="text-xs text-slate-500 mt-1">Как использовать все возможности приложения для создания книг и циклов.</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-2">
                    <h2 className="font-bold text-sm text-emerald-900">📚 Управление Циклами и Сквозным Лором</h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Цикл объединяет несколько книг. Все персонажи, правила магии и карты хранятся на уровне цикла, поэтому вам не нужно заново описывать героев для Книги 2 или 3.
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-2">
                    <h2 className="font-bold text-sm text-emerald-900">📊 Рентген сюжета</h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Показывает график эмоционального напряжения по главам. Если 3 главы подряд находятся на одном низком уровне — добавьте микро-конфликт или сюжетный поворот.
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-2">
                    <h2 className="font-bold text-sm text-emerald-900">💬 Комната испытаний</h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Используйте симулятор диалогов, чтобы проверить химию между героями и их поведение в стрессовых ситуациях до того, как писать об этом в книге.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
