// src/App.jsx
import React, { useState, useEffect } from 'react';

// LAYOUT & VIEWS
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import LandingView from './components/views/LandingView';
import DashboardView from './components/views/DashboardView';
import ProfileView from './components/views/ProfileView';
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

export default function App() {
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

  // ХРАНИЛИЩЕ ВСЕХ ПРОЕКТОВ (КНИГ И ЦИКЛОВ) АВТОРА
  const [cycles, setCycles] = useState(() => {
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
  const [simChar1, setSimChar1] = useState('');
  const [simChar2, setSimChar2] = useState('');
  const [simConflict, setSimConflict] = useState('Тайна из прошлого');
  const [genCategory, setGenCategory] = useState('names');

  // LORE INPUTS
  const [newCharName, setNewCharName] = useState('');
  const [newCharBio, setNewCharBio] = useState('');
  const [newLocName, setNewLocName] = useState('');
  const [newLocDesc, setNewLocDesc] = useState('');

  // Выбор активного проекта
  useEffect(() => {
    if (cycles.length > 0) {
      const currentCyc = cycles.find(c => c.id === activeCycleId) || cycles[0];
      if (currentCyc.id !== activeCycleId) {
        setActiveCycleId(currentCyc.id);
      }
      if (currentCyc.books?.length > 0) {
        const currentBk = currentCyc.books.find(b => b.id === activeBookId) || currentCyc.books[0];
        if (currentBk.id !== activeBookId) {
          setActiveBookId(currentBk.id);
          setActiveSceneId(currentBk.chapters?.[0]?.scenes?.[0]?.id || '');
        }
      } else {
        setActiveBookId('');
        setActiveSceneId('');
      }
    } else {
      setActiveCycleId('');
      setActiveBookId('');
      setActiveSceneId('');
    }
  }, [cycles, activeCycleId, activeBookId]);

  // Сохранение личных данных автора
  useEffect(() => {
    if (currentUser?.email && !isDemoMode) {
      localStorage.setItem(`mythos_cycles_${currentUser.email.toLowerCase()}`, JSON.stringify(cycles));
    }
  }, [cycles, currentUser, isDemoMode]);

  useEffect(() => {
    localStorage.setItem('mythos_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // AUTH HANDLERS
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
    const userSaved = localStorage.getItem(`mythos_cycles_${user.email.toLowerCase()}`);
    setCycles(userSaved ? JSON.parse(userSaved) : []);
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

  // СОЗДАНИЕ НОВОГО ПРОЕКТА / КНИГИ
  const handleCreateCycle = () => {
    if (!newCycleTitle.trim()) return;
    const newBookId = 'book-' + Date.now();
    const newCycle = {
      id: 'cycle-' + Date.now(),
      title: newCycleTitle,
      description: newCycleDesc || 'Самостоятельное произведение или цикл.',
      lore: { characters: [], locations: [] },
      books: [
        {
          id: newBookId,
          title: 'Том 1 / Основной текст',
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
    setActiveBookId(newBookId);
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

  // Персонажи и Локации полностью принадлежат текущему Проекту/Циклу
  const addCharacter = () => {
    if (!newCharName.trim() || !activeCycleId) return;
    setCycles(prev => prev.map(c => {
      if (c.id !== activeCycleId) return c;
      return {
        ...c,
        lore: {
          ...c.lore,
          characters: [
            ...(c.lore?.characters || []), 
            { id: 'c-' + Date.now(), name: newCharName, role: 'Персонаж', bio: newCharBio }
          ]
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
          locations: [
            ...(c.lore?.locations || []), 
            { id: 'l-' + Date.now(), name: newLocName, description: newLocDesc }
          ]
        }
      };
    }));
    setNewLocName('');
    setNewLocDesc('');
  };

  // AI HANDLERS
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

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-[#FAF9F6] text-slate-800 font-sans overflow-hidden">
      
      <Sidebar 
        focusMode={focusMode}
        currentUser={currentUser}
        streakDays={streakDays}
        handleLogout={handleLogout}
        activeCycleId={activeCycleId}
        setActiveCycleId={setActiveCycleId}
        activeBookId={activeBookId}
        setActiveBookId={setActiveBookId}
        cycles={cycles}
        setActiveSceneId={setActiveSceneId}
        activeView={activeView}
        setActiveView={setActiveView}
        setAiResponse={setAiResponse}
        setShowNewCycleModal={setShowNewCycleModal}
        setShowNewBookModal={setShowNewBookModal}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          focusMode={focusMode}
          setFocusMode={setFocusMode}
          totalWords={totalWords}
          exportToDocx={() => exportToDocx(currentBook, currentCycle)}
          currentUser={currentUser}
          setActiveView={setActiveView}
        />

        <div className="flex-1 overflow-hidden relative">
          {activeView === 'dashboard' && (
            <DashboardView 
              cycles={cycles}
              currentCycle={currentCycle}
              currentBook={currentBook}
              currentUser={currentUser}
              setShowNewCycleModal={setShowNewCycleModal}
              setActiveCycleId={setActiveCycleId}
              setActiveBookId={setActiveBookId}
              setActiveView={setActiveView}
            />
          )}

          {activeView === 'profile' && (
            <ProfileView 
              currentUser={currentUser}
              cycles={cycles}
              streakDays={streakDays}
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
