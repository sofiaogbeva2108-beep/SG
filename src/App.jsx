import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import IdeaGenerator from './components/IdeaGenerator';
import CharacterList from './components/characters/CharacterList';

export default function App() {
  const [activeTab, setActiveTab] = useState('characters');

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Боковое меню */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Основной контент */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'characters' && <CharacterList />}
        {activeTab === 'generator' && <IdeaGenerator />}
      </main>
    </div>
  );
}
