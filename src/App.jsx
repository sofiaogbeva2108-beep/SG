// src/App.jsx
import React, { useState, useEffect } from 'react';

// LAYOUT & VIEWS
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import LandingView from './components/views/LandingView';
import DashboardView from './components/views/DashboardView';
import EditorView from './components/views/EditorView';
import LoreView from './components/views/LoreView';
import AnalyticsView from './components/views/AnalyticsView';
import LabView from './components/views/LabView';
import BrainstormView from './components/views/BrainstormView';
import ReaderView from './components/views/ReaderView';

// MODALS
import CreateCycleModal from './components/modals/CreateCycleModal';
import CreateBookModal from './components/modals/CreateBookModal';

// SERVICES
import { runAiBetaReader, runCharacterSim, runBrainstorm } from './services/aiService';
import { exportToDocx } from './services/docxExport';

// Демонстрационный шаблон (только для Демо-режима)
const DEMO_CYCLES = [
  {
    id: 'cycle-1',
    title: 'Хроники Сумеречного Цвета',
    description: '«История, которая ещё не рассказана.»',
    lore: {
      characters: [
        { id: 'c-1', name: 'Элара', role: 'Главная героиня', bio: 'Владеет редкой магией света. Ищет тайны своего происхождения.' },
        { id: 'c-2', name: 'Каин', role: 'Защитник / Спутник', bio: 'Бывший страж. Храбрый, но скрытный.' },
        { id: 'c-3', name: 'Лорд Вудс', role: 'Антагонист', bio: 'Правитель северных земель, охотящийся за древними артефактами.' }
      ],
      locations: [
        { id: 'l-1', name: 'Сумеречный лес', description: 'Старинное укрепление и мистические чащи.' },
        { id: 'l-2', name: 'Долина Света', description: 'Неприступная цитадель в северной долине.' }
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
                content: 'Холодный ветер проникал сквозь узкие бойницы башни, заставляя Элару сильнее сжаться в плащ. Каин молча стоял у края площадки, устремив взгляд в заснеженную долину.' 
              }
            ]
          }
        ]
      }
    ]
  }
];

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

  const [authMode, setAuthMode] = useState('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');

  // --- CYCLES DATA STATE (Привязано лично к пользователю) ---
  const [cycles, setCycles] = useState(() => {
    if (isDemoMode) return DEMO_CYCLES;
    if (currentUser?.email) {
      const userSaved = localStorage.getItem(`mythos_cycles_${currentUser.email.toLowerCase()}`);
      return userSaved ? JSON.parse(userSaved) : [];
    }
    return [];
  });

  const [activeView, setActiveView] = useState('dashboard');
  const [activeCycleId, setActiveCycleId] = useState('');
  const [activeBookId, setActiveBookId] = useState('');
  const [activeSceneId, setActiveSceneId] = useState('');
  const [focusMode, setFocusMode] = useState(false);

  // RPG & AI STATE
  const [streakDays] = useState(5);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');

  // MODALS
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

  // Переключение активного цикла при смене списка
  useEffect(() => {
    if (cycles.length > 0) {
      if (!cycles.find(c => c.id === activeCycleId)) {
        setActiveCycleId(cycles[0].id);
        if (cycles[0].books?.length > 0) {
          setActiveBookId(cycles[0].books[0].id);
          setActiveSceneId(cycles[0].books[0].chapters?.[0]?.scenes?.[0]?.id || '');
        }
      }
    } else {
      setActiveCycleId('');
      setActiveBookId('');
      setActiveSceneId('');
    }
  }, [cycles]);

  // АВТОСОХРАНЕНИЕ ДАННЫХ В ПЕРСОНАЛЬНОЕ ХРАНИЛИЩЕ ПОЛЬЗОВАТЕЛЯ
  useEffect(() => {
    if (currentUser?.email && !isDemoMode) {
      localStorage.setItem(`mythos_cycles_${currentUser.email.toLowerCase()}`, JSON.stringify(cycles));
    }
  }, [cycles, currentUser, isDemoMode]);

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
    setRegisteredUsers([...registeredUsers, newUser]);

    setCurrentUser({ name: newUser.name, email: newUser.email });
    setIsDemoMode(false);
    
    // Новые пользователи начинают с ЧИСТЫМ списком проектов
    setCycles([]);
    
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
    
    // Загружаем личные данные вошедшего пользователя
    const userSaved = localStorage.getItem(`mythos_cycles_${user.email.toLowerCase()}`);
    setCycles(userSaved ? JSON.parse(userSaved) : []);

    localStorage.setItem('mythos_user', JSON.stringify({ name: user.name, email: user.email }));
    localStorage.removeItem('mythos_demo');
    setAuthPassword('');
  };

  const handleStartDemo = () => {
    setIsDemoMode(true);
    setCycles(DEMO_CYCLES);
    localStorage.setItem('mythos_demo', 'true');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsDemoMode(false);
    setCycles([]);
    localStorage.removeItem('mythos_user');
    localStorage.removeItem('mythos_demo');
  };

  const currentCycle = cycles.find(c => c.id === activeCycleId) || cycles[0] || null;
  const currentBook = currentCycle?.books?.find(b => b.id === activeBookId) || currentCycle?.books?.[0] || null;

  let currentScene = null;
  currentBook?.chapters?.forEach(ch => {
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
    const updated = [...cycles, newCycle];
    setCycles(updated);
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
      title: `Глава ${(currentBook.chapters?.length || 0) + 1}`,
      scenes: [{ id: 'sc-' + Date.now(), title: 'Сцена 1', content: '' }]
    };
    setCycles(prev => prev.map(cyc => cyc.id === activeCycleId ? {
      ...cyc,
      books: cyc.books.map(bk => bk.id === activeBookId ? {
        ...bk,
        chapters: [...(bk.chapters || []), newChapter]
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
    if (!newCharName.trim() || !activeCycleId) return;
    setCycles(prev => prev.map(c => {
      if (c.id !== activeCycleId) return c;
      return {
        ...c,
        lore: {
          ...c.lore,
          characters: [...(c.lore?.characters || []), { id: 'c-' + Date.now(), name: newCharName, role: 'Персонаж', bio: newCharBio }]
        }
      };
    }));
    setNewCharName('');
    setNewCharBio('');
  };

  const addLocation = () => {
    if (!newLocName.trim() || !activeCycleId) return;
    setCycles(prev => prev.map(c => {
      if (c.id !== activeCycleId) return c;
      return {
        ...c,
        lore: {
          ...c.lore,
          locations: [...(c.lore?.locations || []), { id: 'l-' + Date.now(), name: newLocName, description: newLocDesc }]
        }
      };
    }));
    setNewLocName('');
    setNewLocDesc('');
  };

  // --- AI HANDLERS ---
  const handleAiBetaReader = async () => {
    setAiLoading(true);
    try {
      const res = await runAiBetaReader(currentScene, currentCycle);
      setAiResponse(res);
    } catch (e) {
      setAiResponse('Ошибка обращения к ИИ.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleCharacterSim = async () => {
    setAiLoading(true);
    try {
      const res = await runCharacterSim(simChar1, simChar2, simConflict, currentCycle);
      setAiResponse(res);
    } catch (e) {
      setAiResponse('Ошибка при моделировании.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleBrainstorm = async () => {
    setAiLoading(true);
    try {
      const res = await runBrainstorm(genCategory, currentCycle);
      setAiResponse(res);
    } catch (e) {
      setAiResponse('Ошибка генерации идей.');
    } finally {
      setAiLoading(false);
    }
  };

  const totalWords = currentBook?.chapters?.reduce((acc, ch) => 
    acc + ch.scenes.reduce((sAcc, sc) => sAcc + (sc.content ? sc.content.trim().split(/\s+/).filter(Boolean).length : 0), 0), 0) || 0;

  // --- LANDING PAGE ---
  if (!currentUser && !isDemoMode) {
    return (
      <LandingView 
        authMode={authMode}
        setAuthMode={setAuthMode}
        authName={authName}
        setAuthName={setAuthName}
        authEmail={authEmail}
        setAuthEmail={setAuthEmail}
        authPassword={authPassword}
        setAuthPassword={setAuthPassword}
        authError={authError}
        setAuthError={setAuthError}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        handleStartDemo={handleStartDemo}
      />
    );
  }

  // --- MAIN WORKSPACE ---
  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-[#FAF9F6] text-slate-800 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <Sidebar 
        focusMode={focusMode}
        currentUser={currentUser}
        streakDays={streakDays}
        handleLogout={handleLogout}
        activeCycleId={activeCycleId}
        setActiveCycleId={setActiveCycleId}
        cycles={cycles}
        setActiveBookId={setActiveBookId}
        setActiveSceneId={setActiveSceneId}
        activeView={activeView}
        setActiveView={setActiveView}
        setAiResponse={setAiResponse}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          focusMode={focusMode}
          setFocusMode={setFocusMode}
          totalWords={totalWords}
          exportToDocx={() => exportToDocx(currentBook, currentCycle)}
          currentUser={currentUser}
        />

        <div className="flex-1 overflow-hidden relative">
          {activeView === 'dashboard' && (
            <DashboardView 
              cycles={cycles}
              currentCycle={currentCycle}
              currentUser={currentUser}
              setShowNewCycleModal={setShowNewCycleModal}
              setActiveCycleId={setActiveCycleId}
              setActiveBookId={setActiveBookId}
              setActiveView={setActiveView}
            />
          )}

          {activeView === 'editor' && (
            <EditorView 
              currentCycle={currentCycle}
              activeBookId={activeBookId}
              setActiveBookId={setActiveBookId}
              setActiveSceneId={setActiveSceneId}
              setShowNewBookModal={setShowNewBookModal}
              handleAddChapter={handleAddChapter}
              handleAddScene={handleAddScene}
              activeSceneId={activeSceneId}
              currentScene={currentScene}
              setCycles={setCycles}
              activeCycleId={activeCycleId}
              updateSceneContent={updateSceneContent}
              setShowNewCycleModal={setShowNewCycleModal}
            />
          )}

          {activeView === 'lore' && (
            <LoreView 
              currentCycle={currentCycle}
              newCharName={newCharName}
              setNewCharName={setNewCharName}
              newCharBio={newCharBio}
              setNewCharBio={setNewCharBio}
              addCharacter={addCharacter}
              newLocName={newLocName}
              setNewLocName={setNewLocName}
              newLocDesc={newLocDesc}
              setNewLocDesc={setNewLocDesc}
              addLocation={addLocation}
            />
          )}

          {activeView === 'analytics' && (
            <AnalyticsView 
              handleAiBetaReader={handleAiBetaReader}
              aiLoading={aiLoading}
              aiResponse={aiResponse}
            />
          )}

          {activeView === 'lab' && (
            <LabView 
              simChar1={simChar1}
              setSimChar1={setSimChar1}
              simChar2={simChar2}
              setSimChar2={setSimChar2}
              simConflict={simConflict}
              setSimConflict={setSimConflict}
              handleCharacterSim={handleCharacterSim}
              aiLoading={aiLoading}
              aiResponse={aiResponse}
            />
          )}

          {activeView === 'brainstorm' && (
            <BrainstormView 
              genCategory={genCategory}
              setGenCategory={setGenCategory}
              handleBrainstorm={handleBrainstorm}
              aiLoading={aiLoading}
              aiResponse={aiResponse}
            />
          )}

          {activeView === 'reader' && (
            <ReaderView 
              currentBook={currentBook}
            />
          )}
        </div>
      </div>

      {/* MODALS */}
      <CreateCycleModal 
        show={showNewCycleModal}
        setShow={setShowNewCycleModal}
        newCycleTitle={newCycleTitle}
        setNewCycleTitle={setNewCycleTitle}
        newCycleDesc={newCycleDesc}
        setNewCycleDesc={setNewCycleDesc}
        handleCreateCycle={handleCreateCycle}
      />

      <CreateBookModal 
        show={showNewBookModal}
        setShow={setShowNewBookModal}
        newBookTitle={newBookTitle}
        setNewBookTitle={setNewBookTitle}
        handleCreateBook={handleCreateBook}
      />

    </div>
  );
}
