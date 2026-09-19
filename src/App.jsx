import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Document, Packer, Paragraph, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { 
  BookOpen, Plus, Trash2, Edit3, Settings, Sparkles, CheckCircle, 
  AlertTriangle, Play, Pause, RotateCcw, BarChart2, FileDown, Layers, 
  Users, MapPin, Eye, Feather, Check, Menu, X, Image as ImageIcon, 
  Wand2, Compass, Book, Home, HelpCircle, Activity, MessageSquare, 
  Flame, Award, ArrowLeft, Volume2, VolumeX, Save, ChevronRight, Loader2, Lightbulb, Lock, LogIn, UserPlus, Shield
} from 'lucide-react';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export default function App() {
  // --- AUTH & ACCOUNTS STATE ---
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('mythos_registered_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('mythos_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isDemoMode, setIsDemoMode] = useState(() => {
    return localStorage.getItem('mythos_demo') === 'true';
  });

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');

  // --- CYCLES & BOOKS DATA ---
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
            chapters: [
              {
                id: 'chap-1',
                title: 'Глава 1: Пробуждение в тумане',
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

  const [activeView, setActiveView] = useState('editor');
  const [activeCycleId, setActiveCycleId] = useState('cycle-1');
  const [activeBookId, setActiveBookId] = useState('book-1');
  const [activeSceneId, setActiveSceneId] = useState('sc-1');
  const [focusMode, setFocusMode] = useState(false);

  // RPG & AI STATE
  const [writerLevel] = useState(3);
  const [streakDays] = useState(5);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');

  // MODALS & INPUTS FOR CREATION
  const [showNewCycleModal, setShowNewCycleModal] = useState(false);
  const [newCycleTitle, setNewCycleTitle] = useState('');
  const [newCycleDesc, setNewCycleDesc] = useState('');

  const [showNewBookModal, setShowNewBookModal] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');

  // LAB & GENERATORS STATE
  const [simChar1, setSimChar1] = useState('Элара');
  const [simChar2, setSimChar2] = useState('Каин');
  const [simConflict, setSimConflict] = useState('Тайна из прошлого');
  const [genCategory, setGenCategory] = useState('names');

  // LORE INPUTS
  const [newCharName, setNewCharName] = useState('');
  const [newCharBio, setNewCharBio] = useState('');
  const [newLocName, setNewLocName] = useState('');
  const [newLocDesc, setNewLocDesc] = useState('');

  useEffect(() => {
    localStorage.setItem('mythos_cycles', JSON.stringify(cycles));
  }, [cycles]);

  useEffect(() => {
    localStorage.setItem('mythos_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // --- AUTH HANDLERS ---
  const handleRegister = (e) => {
    e.preventDefault();
    setAuthError('');
    if (!authEmail.trim() || !authPassword.trim() || !authName.trim()) {
      setAuthError('Заполните все поля');
      return;
    }

    const existingUser = registeredUsers.find(u => u.email.toLowerCase() === authEmail.toLowerCase());
    if (existingUser) {
      setAuthError('Пользователь с таким Email уже существует');
      return;
    }

    const newUser = { name: authName, email: authEmail, password: authPassword };
    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);

    setCurrentUser({ name: newUser.name, email: newUser.email });
    setIsDemoMode(false);
    localStorage.setItem('mythos_user', JSON.stringify({ name: newUser.name, email: newUser.email }));
    localStorage.removeItem('mythos_demo');
    setAuthPassword('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    const user = registeredUsers.find(
      u => u.email.toLowerCase() === authEmail.toLowerCase() && u.password === authPassword
    );

    if (!user) {
      setAuthError('Неверный Email или пароль');
      return;
    }

    setCurrentUser({ name: user.name, email: user.email });
    setIsDemoMode(false);
    localStorage.setItem('mythos_user', JSON.stringify({ name: user.name, email: user.email }));
    localStorage.removeItem('mythos_demo');
    setAuthPassword('');
  };

  const handleStartDemo = () => {
    setIsDemoMode(true);
    localStorage.setItem('mythos_demo', 'true');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsDemoMode(false);
    localStorage.removeItem('mythos_user');
    localStorage.removeItem('mythos_demo');
  };

  const currentCycle = cycles.find(c => c.id === activeCycleId) || cycles[0];
  const currentBook = currentCycle?.books.find(b => b.id === activeBookId) || currentCycle?.books[0];

  let currentScene = null;
  currentBook?.chapters.forEach(ch => {
    const sc = ch.scenes.find(s => s.id === activeSceneId);
    if (sc) currentScene = sc;
  });

  // --- CREATION HANDLERS ---
  const handleCreateCycle = () => {
    if (!newCycleTitle.trim()) return;
    const newCycle = {
      id: 'cycle-' + Date.now(),
      title: newCycleTitle,
      description: newCycleDesc || 'Новый литературный цикл.',
      lore: { characters: [], locations: [] },
      books: [
        {
          id: 'book-' + Date.now(),
          title: 'Книга 1',
          chapters: [
            {
              id: 'chap-' + Date.now(),
              title: 'Глава 1',
              scenes: [{ id: 'sc-' + Date.now(), title: 'Сцена 1', content: '' }]
            }
          ]
        }
      ]
    };
    setCycles([...cycles, newCycle]);
    setActiveCycleId(newCycle.id);
    setActiveBookId(newCycle.books[0].id);
    setActiveSceneId(newCycle.books[0].chapters[0].scenes[0].id);
    setNewCycleTitle('');
    setNewCycleDesc('');
    setShowNewCycleModal(false);
  };

  const handleCreateBook = () => {
    if (!newBookTitle.trim() || !currentCycle) return;
    const newBook = {
      id: 'book-' + Date.now(),
      title: newBookTitle,
      chapters: [
        {
          id: 'chap-' + Date.now(),
          title: 'Глава 1',
          scenes: [{ id: 'sc-' + Date.now(), title: 'Сцена 1', content: '' }]
        }
      ]
    };
    setCycles(prev => prev.map(c => c.id === activeCycleId ? { ...c, books: [...c.books, newBook] } : c));
    setActiveBookId(newBook.id);
    setActiveSceneId(newBook.chapters[0].scenes[0].id);
    setNewBookTitle('');
    setShowNewBookModal(false);
  };

  const handleAddChapter = () => {
    if (!currentBook) return;
    const newChapter = {
      id: 'chap-' + Date.now(),
      title: `Глава ${currentBook.chapters.length + 1}`,
      scenes: [{ id: 'sc-' + Date.now(), title: 'Сцена 1', content: '' }]
    };
    setCycles(prev => prev.map(cyc => cyc.id === activeCycleId ? {
      ...cyc,
      books: cyc.books.map(bk => bk.id === activeBookId ? {
        ...bk,
        chapters: [...bk.chapters, newChapter]
      } : bk)
    } : cyc));
    setActiveSceneId(newChapter.scenes[0].id);
  };

  const handleAddScene = (chapterId) => {
    const newScene = {
      id: 'sc-' + Date.now(),
      title: 'Новая сцена',
      content: ''
    };
    setCycles(prev => prev.map(cyc => cyc.id === activeCycleId ? {
      ...cyc,
      books: cyc.books.map(bk => bk.id === activeBookId ? {
        ...bk,
        chapters: bk.chapters.map(ch => ch.id === chapterId ? {
          ...ch,
          scenes: [...ch.scenes, newScene]
        } : ch)
      } : bk)
    } : cyc));
    setActiveSceneId(newScene.id);
  };

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

  const addCharacter = () => {
    if (!newCharName.trim()) return;
    setCycles(prev => prev.map(c => {
      if (c.id !== activeCycleId) return c;
      return {
        ...c,
        lore: {
          ...c.lore,
          characters: [...c.lore.characters, { id: 'c-' + Date.now(), name: newCharName, role: 'Персонаж', bio: newCharBio }]
        }
      };
    }));
    setNewCharName('');
    setNewCharBio('');
  };

  const addLocation = () => {
    if (!newLocName.trim()) return;
    setCycles(prev => prev.map(c => {
      if (c.id !== activeCycleId) return c;
      return {
        ...c,
        lore: {
          ...c.lore,
          locations: [...c.lore.locations, { id: 'l-' + Date.now(), name: newLocName, description: newLocDesc }]
        }
      };
    }));
    setNewLocName('');
    setNewLocDesc('');
  };

  // --- AI FUNCTIONS ---
  const runAiBetaReader = async () => {
    if (!currentScene?.content) return;
    setAiLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Проведи детальный анализ литературного отрывка как бета-ридер и стилист.
        
Контекст мира: ${currentCycle?.description || ''}
Персонажи: ${currentCycle?.lore?.characters?.map(c => c.name + ': ' + c.bio).join('; ') || 'Нет'}

Текст сцены:
"${currentScene.content}"

Структура ответа:
🟢 **Сильные стороны:**
🟡 **Ритм и темп сцены:**
🔴 **Замечания к стилю, повторам и ООС (выходу из характера):**`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setAiResponse(response.text());
    } catch (e) {
      console.error(e);
      setAiResponse('Ошибка ИИ. Проверьте правильность VITE_GEMINI_API_KEY.');
    } finally {
      setAiLoading(false);
    }
  };

  const runCharacterSim = async () => {
    setAiLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Смоделируй диалог-столкновение двух персонажей фэнтези.
Персонаж 1: ${simChar1}
Персонаж 2: ${simChar2}
Причина конфликта: ${simConflict}
Мир: ${currentCycle?.description || ''}

Напиши напряженный диалог с описанием эмоций и жестов, а в конце дай вердикт ИИ о химии персонажей.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setAiResponse(response.text());
    } catch (e) {
      console.error(e);
      setAiResponse('Ошибка при моделировании симулятора.');
    } finally {
      setAiLoading(false);
    }
  };

  const runBrainstorm = async () => {
    setAiLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      let prompt = `Сгенерируй 5 креативных идей для фэнтези мира "${currentCycle?.title || ''}". Описание мира: ${currentCycle?.description || ''}. `;
      
      if (genCategory === 'names') prompt += 'Предложи 10 атмосферных имён персонажей и названий древних родов с краткой характеристикой.';
      if (genCategory === 'twists') prompt += 'Предложи 5 неожиданных сюжетных поворотов (Plot Twists) для текущей сюжетной арки.';
      if (genCategory === 'locations') prompt += 'Предложи 5 уникальных волшебных или мрачных локаций с их секретами.';

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setAiResponse(response.text());
    } catch (e) {
      console.error(e);
      setAiResponse('Ошибка генерации идей.');
    } finally {
      setAiLoading(false);
    }
  };

  const exportToDocx = () => {
    if (!currentBook) return;
    const docChildren = [
      new Paragraph({ text: currentBook.title, heading: HeadingLevel.TITLE }),
      new Paragraph({ text: `Цикл: ${currentCycle?.title || ''}`, heading: HeadingLevel.SUBTITLE }),
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

  // --- WELCOME / LANDING PAGE (IF NOT LOGGED IN & NOT DEMO) ---
  if (!currentUser && !isDemoMode) {
    return (
      <div className="min-h-screen w-full bg-[#0a1a14] text-white flex flex-col justify-between relative overflow-hidden font-sans">
        {/* BACKGROUND ART WORK & OVERLAY */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105 transform transition duration-1000"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f18] via-[#0b241c]/90 to-transparent" />

        {/* TOP HEADER */}
        <header className="relative z-10 px-8 py-6 flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center">
              <Feather className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="text-2xl font-bold tracking-wide text-emerald-100">Mythos Studio</div>
              <div className="text-xs text-emerald-400/80 tracking-wider">Создавай миры. Оживляй истории.</div>
            </div>
          </div>
        </header>

        {/* HERO SECTION */}
        <main className="relative z-10 max-w-7xl mx-auto w-full px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-7 space-y-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-50 leading-tight font-serif">
              Твоя персональная <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400">
                вселенная начинается здесь
              </span>
            </h1>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl">
              Mythos Studio — это платформа для создания уникальных миров, персонажей и историй. Вдохновляйся, пиши, развивай свои идеи и делись ими с другими.
            </p>

            {/* FEATURES GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-900/80 border border-emerald-700 flex items-center justify-center shrink-0">
                  <Wand2 className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <div className="text-sm font-bold text-emerald-100">Создавай миры</div>
                  <div className="text-xs text-slate-400">Погружайся в бесконечные возможности фантазии.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-900/80 border border-emerald-700 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <div className="text-sm font-bold text-emerald-100">Развивай персонажей</div>
                  <div className="text-xs text-slate-400">Делай их живыми, глубокими и уникальными.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-900/80 border border-emerald-700 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <div className="text-sm font-bold text-emerald-100">Пиши истории</div>
                  <div className="text-xs text-slate-400">Оживляй свои идеи и делись ими.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-900/80 border border-emerald-700 flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <div className="text-sm font-bold text-emerald-100">Общайся с единомышленниками</div>
                  <div className="text-xs text-slate-400">Найди свою аудиторию и вдохновение.</div>
                </div>
              </div>
            </div>

            <div className="pt-4 italic font-serif text-emerald-300/80 text-lg">
              Мифы рождаются здесь
            </div>
          </div>

          {/* RIGHT AUTH CARD */}
          <div className="lg:col-span-5 bg-[#FAF9F6] text-slate-800 rounded-3xl p-8 shadow-2xl border border-emerald-100/20 max-w-md w-full mx-auto">
            <div className="text-center space-y-2 mb-6">
              <div className="w-12 h-12 rounded-full bg-emerald-100 mx-auto flex items-center justify-center text-emerald-800">
                <Feather className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Добро пожаловать в <br />Mythos Studio</h2>
              <p className="text-xs text-slate-500">Войдите в свой аккаунт или создайте новый, чтобы начать создавать.</p>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs text-center font-medium">
                {authError}
              </div>
            )}

            {/* TOGGLE TABS */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-5">
              <button 
                onClick={() => { setAuthMode('login'); setAuthError(''); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${authMode === 'login' ? 'bg-white shadow text-emerald-900' : 'text-slate-500'}`}
              >
                Войти
              </button>
              <button 
                onClick={() => { setAuthMode('register'); setAuthError(''); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${authMode === 'register' ? 'bg-white shadow text-emerald-900' : 'text-slate-500'}`}
              >
                Зарегистрироваться
              </button>
            </div>

            {/* AUTH FORM */}
            <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-3.5">
              {authMode === 'register' && (
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase mb-1 block">Ваше имя или псевдоним</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Софья" 
                    value={authName}
                    onChange={e => setAuthName(e.target.value)}
                    className="w-full p-2.5 border rounded-xl text-xs outline-none focus:border-emerald-600 bg-slate-50/50"
                  />
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase mb-1 block">Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="writer@mythos.studio" 
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-xs outline-none focus:border-emerald-600 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase mb-1 block">Пароль</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-xs outline-none focus:border-emerald-600 bg-slate-50/50"
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md"
              >
                {authMode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                <span>{authMode === 'login' ? 'Войти в кабинет' : 'Создать защищенный аккаунт'}</span>
              </button>
            </form>

            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              <span className="relative bg-[#FAF9F6] px-3 text-[11px] text-slate-400 uppercase font-semibold">или</span>
            </div>

            <button 
              onClick={handleStartDemo}
              className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold border border-emerald-200 transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Попробовать демо-режим (без входа)</span>
            </button>

            {/* SECURITY FOOTER */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
              <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-700 block">Ваши данные в безопасности</strong>
                Ваш пароль и проекты защищены и сохраняются только на вашем устройстве.
              </div>
            </div>
          </div>
        </main>

        <footer className="relative z-10 py-4 text-center text-xs text-emerald-400/60">
          Mythos Studio Pro © 2026 • Платформа для писателей и сценаристов
        </footer>
      </div>
    );
  }

  // --- MAIN APP WORKSPACE (WHEN LOGGED IN OR DEMO MODE) ---
  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-[#FAF9F6] text-slate-800 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      {!focusMode && (
        <div className="w-full md:w-64 bg-emerald-950 text-emerald-50 flex flex-col justify-between border-r border-emerald-800 p-4">
          <div className="space-y-6">
            <div className="flex items-center gap-2 font-bold text-xl text-emerald-200">
              <Feather className="w-6 h-6 text-emerald-400" />
              <span>Mythos Studio</span>
            </div>

            {/* USER PROFILE & DEMO STATUS */}
            {currentUser ? (
              <div className="p-3 bg-emerald-900/60 rounded-xl border border-emerald-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-emerald-100 border border-emerald-500 uppercase">
                    {currentUser.name.slice(0, 2)}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-emerald-200 truncate">{currentUser.name}</div>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-0.5">
                      <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{streakDays} дней</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-[10px] text-emerald-400 hover:text-white underline ml-2"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <div className="p-3 bg-amber-950/60 rounded-xl border border-amber-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Демо-режим
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="text-[10px] text-amber-400 hover:text-amber-200 underline"
                  >
                    Выход
                  </button>
                </div>
                <p className="text-[10px] text-amber-200/80 leading-tight">
                  Вы можете тестировать весь функционал. Для созранения войдите в свой аккаунт.
                </p>
                <button 
                  onClick={handleLogout}
                  className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-semibold transition"
                >
                  Войти с паролем
                </button>
              </div>
            )}

            {/* CYCLE SELECTOR */}
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Текущий цикл</div>
              <select 
                value={activeCycleId}
                onChange={(e) => {
                  setActiveCycleId(e.target.value);
                  const selectedCyc = cycles.find(c => c.id === e.target.value);
                  if (selectedCyc && selectedCyc.books.length > 0) {
                    setActiveBookId(selectedCyc.books[0].id);
                    if (selectedCyc.books[0].chapters.length > 0) {
                      setActiveSceneId(selectedCyc.books[0].chapters[0].scenes[0]?.id || '');
                    }
                  }
                }}
                className="w-full bg-emerald-900 border border-emerald-700 text-emerald-100 text-xs rounded-lg p-2 outline-none font-semibold"
              >
                {cycles.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              {[
                { id: 'dashboard', label: 'Мои Циклы', icon: Home },
                { id: 'editor', label: 'Кабинет Писателя', icon: BookOpen },
                { id: 'lore', label: 'База Лор & Мир', icon: Users },
                { id: 'analytics', label: 'Рентген & Аналитика', icon: Activity },
                { id: 'lab', label: 'Комната испытаний', icon: MessageSquare },
                { id: 'brainstorm', label: 'Генератор & Идеи', icon: Lightbulb },
                { id: 'reader', label: 'Режим Чтения', icon: Eye }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => { setActiveView(item.id); setAiResponse(''); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${activeView === item.id ? 'bg-emerald-800 text-white' : 'hover:bg-emerald-900/50 text-emerald-300'}`}
                >
                  <item.icon className="w-4 h-4 text-emerald-400" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-emerald-800 text-[11px] text-emerald-400">
            Mythos Studio Pro • Protected Auth
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

        {/* CONTENT SWITCHER */}
        <div className="flex-1 overflow-hidden relative">
          
          {/* EDITOR */}
          {activeView === 'editor' && (
            <div className="h-full flex">
              <div className="w-64 border-r border-emerald-100 bg-white p-4 overflow-y-auto hidden md:block">
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

                {currentBook?.chapters.map(ch => (
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
                    value={currentScene?.content || ''}
                    onChange={(e) => updateSceneContent(e.target.value)}
                    className="w-full flex-1 resize-none border-none outline-none font-serif text-base leading-relaxed text-slate-800"
                    placeholder="Пишите сцену..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* DASHBOARD WITH NEW CYCLE BUTTON */}
          {activeView === 'dashboard' && (
            <div className="h-full p-8 overflow-y-auto max-w-4xl mx-auto space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Мои Циклы Книг</h1>
                <button 
                  onClick={() => setShowNewCycleModal(true)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Новый Цикл
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cycles.map(cyc => (
                  <div key={cyc.id} className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-3 flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-emerald-900">{cyc.title}</h2>
                      <p className="text-xs text-slate-500 mt-1">{cyc.description}</p>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-xs font-semibold text-emerald-700">Книг: {cyc.books.length}</span>
                      <button 
                        onClick={() => {
                          setActiveCycleId(cyc.id);
                          setActiveBookId(cyc.books[0]?.id || '');
                          setActiveView('editor');
                        }}
                        className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold hover:bg-emerald-100"
                      >
                        Открыть кабинет
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LORE BASE */}
          {activeView === 'lore' && (
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
          )}

          {/* ANALYTICS & BETA READER */}
          {activeView === 'analytics' && (
            <div className="h-full p-6 overflow-y-auto max-w-4xl mx-auto space-y-6">
              <h1 className="text-xl font-bold text-slate-900">ИИ Бета-ридер & Стилистический Рентген</h1>
              <p className="text-xs text-slate-500">Глубокий анализ сцены: от детектора ошибок до ритмики текста.</p>
              
              <button 
                onClick={runAiBetaReader}
                disabled={aiLoading}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
              >
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Запустить Анализ Текста</span>
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
              <h1 className="text-xl font-bold text-slate-900">Симулятор отношений & Химия персонажей</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                <input 
                  type="text" 
                  value={simConflict} 
                  onChange={(e) => setSimConflict(e.target.value)} 
                  className="p-2 border rounded-xl text-xs" 
                  placeholder="Причина конфликта" 
                />
              </div>
              <button 
                onClick={runCharacterSim}
                disabled={aiLoading}
                className="w-full py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-semibold flex justify-center items-center gap-2"
              >
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Смоделировать Диалог</span>
              </button>

              {aiResponse && (
                <div className="p-5 bg-white rounded-2xl border border-emerald-100 text-xs leading-relaxed whitespace-pre-wrap">
                  {aiResponse}
                </div>
              )}
            </div>
          )}

          {/* BRAINSTORM */}
          {activeView === 'brainstorm' && (
            <div className="h-full p-6 overflow-y-auto max-w-3xl mx-auto space-y-6">
              <h1 className="text-xl font-bold text-slate-900">Генератор идей & Брейншторм</h1>
              
              <div className="flex gap-2">
                {[
                  { id: 'names', label: 'Имена & Роды' },
                  { id: 'twists', label: 'Сюжетные повороты' },
                  { id: 'locations', label: 'Идеи Локаций' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setGenCategory(cat.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${genCategory === cat.id ? 'bg-emerald-700 text-white' : 'bg-white border text-slate-600'}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <button 
                onClick={runBrainstorm}
                disabled={aiLoading}
                className="w-full py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-semibold flex justify-center items-center gap-2"
              >
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                <span>Сгенерировать идеи</span>
              </button>

              {aiResponse && (
                <div className="p-5 bg-white rounded-2xl border border-emerald-100 text-xs leading-relaxed whitespace-pre-wrap">
                  {aiResponse}
                </div>
              )}
            </div>
          )}

          {/* READER */}
          {activeView === 'reader' && (
            <div className="h-full p-8 overflow-y-auto max-w-2xl mx-auto font-serif leading-relaxed">
              <h1 className="text-2xl font-bold font-sans text-center mb-6">{currentBook?.title}</h1>
              {currentBook?.chapters?.map(ch => (
                <div key={ch.id} className="mb-6">
                  <h2 className="text-lg font-bold font-sans mb-3">{ch.title}</h2>
                  {ch.scenes.map(sc => (
                    <p key={sc.id} className="whitespace-pre-wrap text-base mb-4">{sc.content}</p>
                  ))}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* MODAL: CREATE CYCLE */}
      {showNewCycleModal && (
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
              <button onClick={() => setShowNewCycleModal(false)} className="px-4 py-2 border rounded-xl text-xs font-semibold">Отмена</button>
              <button onClick={handleCreateCycle} className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold">Создать</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE BOOK */}
      {showNewBookModal && (
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
              <button onClick={() => setShowNewBookModal(false)} className="px-4 py-2 border rounded-xl text-xs font-semibold">Отмена</button>
              <button onClick={handleCreateBook} className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold">Добавить</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
