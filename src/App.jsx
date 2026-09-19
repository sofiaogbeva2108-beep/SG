import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Plus, FolderPlus, Trash2, Edit3, Settings, 
  Sparkles, CheckCircle, AlertTriangle, Play, Pause, RotateCcw,
  BarChart2, FileDown, Layers, Users, MapPin, ShieldAlert,
  GitCommit, RefreshCw, Eye, Feather, HelpCircle, Save, Check,
  Menu, X, Image as ImageIcon, Download, Wand2, Compass, Book
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
  const [activeTab, setActiveTab] = useState('editor'); // editor, lore, analytics, gallery
  
  const [focusMode, setFocusMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAiOpen, setMobileAiOpen] = useState(false);

  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [pomodoroActive, setPomodoroActive] = useState(false);
  
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiOutput, setAiOutput] = useState('');
  const [tautologyResults, setTautologyResults] = useState([]);

  // --- GENERATOR STATE ---
  const [genCategory, setGenCategory] = useState('character'); // character, location, map, cover
  const [genPrompt, setGenPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGallery, setGeneratedGallery] = useState(() => {
    const saved = localStorage.getItem('storyhub_gallery');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return [
      {
        id: 'img-1',
        type: 'cover',
        title: 'Обложка «Наследие»',
        prompt: 'Dark fantasy book cover, Legacy of the Twilight Flower, dark magical aesthetic, winter valley, high detailed fantasy art',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'img-2',
        type: 'map',
        title: 'Карта континента',
        prompt: 'Fantasy continent map, kingdoms of Elendor and Veldarn, detailed coastline, mountains, vintage cartography style',
        url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80'
      }
    ];
  });

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('storyhub_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('storyhub_gallery', JSON.stringify(generatedGallery));
  }, [generatedGallery]);

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

  const runCanonCheck = () => {
    setAiAnalyzing(true);
    setAiOutput('ИИ анализирует соответствие лору и канону серии...');
    setTimeout(() => {
      setAiAnalyzing(false);
      setAiOutput('✅ Анализ завершен: Противоречий с каноном цикла «' + activeProject.title + '» не обнаружено. Описание локаций и поведение персонажей соответствуют правилам мира.');
    }, 1500);
  };

  const handleGenerateImage = () => {
    if (!genPrompt.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      const categoryLabels = {
        character: 'Персонаж',
        location: 'Локация',
        map: 'Карта',
        cover: 'Обложка'
      };

      // Пул атмосферных изображений для демонстрации визуализации
      const sampleImages = {
        character: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        location: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
        map: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
        cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80'
      };

      const newArt = {
        id: 'img-' + Date.now(),
        type: genCategory,
        title: `${categoryLabels[genCategory]}: ${genPrompt.slice(0, 20)}...`,
        prompt: genPrompt,
        url: sampleImages[genCategory]
      };

      setGeneratedGallery(prev => [newArt, ...prev]);
      setIsGenerating(false);
      setGenPrompt('');
    }, 2000);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-[#FAF9F6] text-slate-800 font-sans">
      
      {/* MOBILE TOP BAR */}
      <div className="md:hidden bg-emerald-950 text-emerald-50 px-4 py-3 flex items-center justify-between border-b border-emerald-800 z-30">
        <div className="flex items-center gap-2 font-bold text-lg text-emerald-200">
          <Feather className="w-5 h-5 text-emerald-400" />
          <span>StoryHub AI</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setMobileAiOpen(!mobileAiOpen)}
            className="p-2 bg-emerald-900 rounded-lg text-emerald-200"
          >
            <Sparkles className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-emerald-900 rounded-lg text-emerald-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* SIDEBAR (Responsive) */}
      {(!focusMode || mobileMenuOpen) && (
        <div className={`
          fixed md:relative inset-0 z-20 bg-emerald-950 text-emerald-50 flex flex-col justify-between border-r border-emerald-800 w-full md:w-72
          ${mobileMenuOpen ? 'flex mt-12 md:mt-0' : 'hidden md:flex'}
        `}>
          <div className="p-4 overflow-y-auto">
            <div className="hidden md:flex items-center gap-2 mb-6 font-bold text-xl text-emerald-200">
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
                onClick={() => { setActiveTab('editor'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'editor' ? 'bg-emerald-800 text-white' : 'hover:bg-emerald-900/50 text-emerald-200'}`}
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Редактор & Сцены</span>
              </button>

              <button 
                onClick={() => { setActiveTab('lore'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'lore' ? 'bg-emerald-800 text-white' : 'hover:bg-emerald-900/50 text-emerald-200'}`}
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Лор & Персонажи</span>
              </button>

              <button 
                onClick={() => { setActiveTab('gallery'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'gallery' ? 'bg-emerald-800 text-white' : 'hover:bg-emerald-900/50 text-emerald-200'}`}
              >
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>ИИ-Арт & Артбук</span>
              </button>

              <button 
                onClick={() => { setActiveTab('analytics'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'analytics' ? 'bg-emerald-800 text-white' : 'hover:bg-emerald-900/50 text-emerald-200'}`}
              >
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                <span>Аналитика текста</span>
              </button>
            </div>

            <div className="mt-6 border-t border-emerald-800/80 pt-4">
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Структура книги</div>
              {activeBook.chapters.map(ch => (
                <div key={ch.id} className="mb-3">
                  <div className="text-xs font-bold text-emerald-300 px-2 py-1">{ch.title}</div>
                  {ch.scenes.map(sc => (
                    <button
                      key={sc.id}
                      onClick={() => { setActiveSceneId(sc.id); setActiveTab('editor'); setMobileMenuOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition truncate block ${activeSceneId === sc.id ? 'bg-emerald-700 text-white font-medium' : 'hover:bg-emerald-900/40 text-emerald-200'}`}
                    >
                      {sc.title}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-emerald-800/80 bg-emerald-900/30 text-xs text-emerald-400 flex items-center justify-between">
            <span>RU • Автосохранение</span>
            <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-400" /></span>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <div className="min-h-12 py-2 px-4 md:px-6 border-b border-emerald-100 bg-white/80 backdrop-blur flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setFocusMode(!focusMode)}
              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-emerald-200 transition"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{focusMode ? 'Выйти из фокуса' : 'Фокус'}</span>
            </button>

            {/* POMODORO TIMER */}
            <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg text-xs">
              <span className="font-mono font-bold text-slate-700">{formatTime(pomodoroTime)}</span>
              <button onClick={() => setPomodoroActive(!pomodoroActive)} className="text-slate-600 hover:text-slate-900">
                {pomodoroActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button onClick={() => { setPomodoroActive(false); setPomodoroTime(25*60); }} className="text-slate-600 hover:text-slate-900">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>Слов: <strong className="text-slate-800 font-semibold">{wordCount}</strong></span>
            <button 
              onClick={runCanonCheck}
              className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-medium flex items-center gap-1 shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Проверить канон</span>
            </button>
          </div>
        </div>

        {/* WORKSPACE CONTENT */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* EDITOR TAB */}
          {activeTab === 'editor' && (
            <div className="flex-1 p-3 sm:p-6 md:p-8 overflow-y-auto flex justify-center bg-[#FAF9F6]">
              <div className="w-full max-w-2xl bg-white p-5 sm:p-8 md:p-12 rounded-2xl shadow-sm border border-emerald-100/60 flex flex-col min-h-[500px]">
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
                  className="text-xl sm:text-2xl font-bold text-slate-800 border-b border-emerald-100 pb-2 mb-4 outline-none bg-transparent"
                  placeholder="Название сцены"
                />
                <textarea
                  value={currentScene?.content || ''}
                  onChange={(e) => updateSceneContent(e.target.value)}
                  placeholder="Начните писать вашу историю здесь..."
                  className="w-full flex-1 resize-none border-none outline-none font-serif text-base sm:text-lg leading-relaxed text-slate-800 placeholder-slate-300 bg-transparent min-h-[350px]"
                />
              </div>
            </div>
          )}

          {/* GALLERY / AI ART TAB */}
          {activeTab === 'gallery' && (
            <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-[#FAF9F6]">
              <div className="max-w-4xl mx-auto space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">ИИ-Визуализация & Артбук</h2>
                  <p className="text-xs text-slate-500 mt-1">Генерируйте изображения персонажей, местности, карт и обложек для вашей книги.</p>
                </div>

                {/* Generator Form */}
                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-4">
                  <div className="font-semibold text-sm text-slate-800 flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-emerald-600" />
                    <span>Создать новое изображение</span>
                  </div>

                  {/* Type Selector */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button 
                      onClick={() => setGenCategory('character')}
                      className={`p-2.5 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 transition ${genCategory === 'character' ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      <Users className="w-4 h-4 text-emerald-600" /> Персонаж
                    </button>
                    <button 
                      onClick={() => setGenCategory('location')}
                      className={`p-2.5 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 transition ${genCategory === 'location' ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      <MapPin className="w-4 h-4 text-emerald-600" /> Локация
                    </button>
                    <button 
                      onClick={() => setGenCategory('map')}
                      className={`p-2.5 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 transition ${genCategory === 'map' ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      <Compass className="w-4 h-4 text-emerald-600" /> Карта
                    </button>
                    <button 
                      onClick={() => setGenCategory('cover')}
                      className={`p-2.5 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 transition ${genCategory === 'cover' ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      <Book className="w-4 h-4 text-emerald-600" /> Обложка
                    </button>
                  </div>

                  {/* Prompt Textarea */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="text" 
                      value={genPrompt}
                      onChange={(e) => setGenPrompt(e.target.value)}
                      placeholder={
                        genCategory === 'character' ? 'Элара, девушка с темными волосами в плаще...' :
                        genCategory === 'location' ? 'Заснеженная башня на пике горы в тумане...' :
                        genCategory === 'map' ? 'Карта материка с королевствами Элендор и Велдарн...' :
                        'Обложка книги: Наследие Сумеречного Цвета...'
                      }
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 transition"
                    />
                    <button 
                      onClick={handleGenerateImage}
                      disabled={isGenerating || !genPrompt.trim()}
                      className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm"
                    >
                      {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      <span>{isGenerating ? 'Генерация...' : 'Сгенерировать'}</span>
                    </button>
                  </div>
                </div>

                {/* Gallery Grid */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-slate-700">Галерея проекта</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {generatedGallery.map((item) => (
                      <div key={item.id} className="bg-white rounded-xl border border-emerald-100 overflow-hidden shadow-sm group">
                        <div className="h-48 overflow-hidden relative">
                          <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                          <span className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur text-white text-[10px] font-semibold rounded-md uppercase">
                            {item.type}
                          </span>
                        </div>
                        <div className="p-3">
                          <div className="font-bold text-sm text-slate-800 truncate">{item.title}</div>
                          <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">{item.prompt}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LORE TAB */}
          {activeTab === 'lore' && (
            <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-[#FAF9F6]">
              <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
                <h2 className="text-lg sm:text-xl font-bold text-slate-800">Лор и Персонажи цикла «{activeProject.title}»</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 sm:p-5 rounded-xl border border-emerald-100 shadow-sm">
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

                  <div className="bg-white p-4 sm:p-5 rounded-xl border border-emerald-100 shadow-sm">
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-[#FAF9F6]">
              <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
                <h2 className="text-lg sm:text-xl font-bold text-slate-800">Анализ текста</h2>
                <div className="bg-white p-4 sm:p-6 rounded-xl border border-emerald-100 shadow-sm">
                  <p className="text-xs text-slate-500">Запустите анализ текста в меню сверху для получения подробных метарик.</p>
                </div>
              </div>
            </div>
          )}

          {/* AI ASSISTANT PANEL */}
          <div className={`
            fixed md:relative right-0 top-0 bottom-0 z-20 w-80 border-l border-emerald-100 bg-white p-4 flex flex-col justify-between shadow-lg md:shadow-none transition-transform
            ${mobileAiOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
            ${focusMode ? 'hidden' : 'flex'}
          `}>
            <div>
              <div className="flex items-center justify-between font-bold text-sm text-emerald-950 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>ИИ-Соавтор</span>
                </div>
                <button onClick={() => setMobileAiOpen(false)} className="md:hidden text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <button 
                  onClick={() => { setAiAnalyzing(true); setTimeout(() => { setAiAnalyzing(false); setAiOutput('Элара медленно оглянулась, сжимая в руке старинный амулет...'); }, 1000); }}
                  className="w-full text-left px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-lg text-xs font-medium border border-emerald-200/80 transition"
                >
                  ⚡ Продолжить сцену
                </button>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 leading-relaxed min-h-[120px]">
                {aiAnalyzing ? 'Обработка запроса ИИ...' : (aiOutput || 'Выберите действие выше для работы с ИИ.')}
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
