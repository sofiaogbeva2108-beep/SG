// src/components/layout/Sidebar.jsx
import React from 'react';
import { 
  Feather, Flame, Sparkles, Home, BookOpen, Users, 
  Activity, MessageSquare, Lightbulb, Eye 
} from 'lucide-react';

export default function Sidebar({
  focusMode,
  currentUser,
  streakDays,
  handleLogout,
  activeCycleId,
  setActiveCycleId,
  cycles,
  setActiveBookId,
  setActiveSceneId,
  activeView,
  setActiveView,
  setAiResponse
}) {
  if (focusMode) return null;

  const navItems = [
    { id: 'dashboard', label: 'Главная панель', icon: Home },
    { id: 'editor', label: 'Кабинет Писателя', icon: BookOpen },
    { id: 'lore', label: 'База Лор & Мир', icon: Users },
    { id: 'analytics', label: 'Рентген & Аналитика', icon: Activity },
    { id: 'lab', label: 'Комната испытаний', icon: MessageSquare },
    { id: 'brainstorm', label: 'Генератор & Идеи', icon: Lightbulb },
    { id: 'reader', label: 'Режим Чтения', icon: Eye }
  ];

  return (
    <div className="w-full md:w-64 bg-emerald-950 text-emerald-50 flex flex-col justify-between border-r border-emerald-800 p-4 shrink-0">
      <div className="space-y-6">
        <div className="flex items-center gap-2 font-bold text-xl text-emerald-200">
          <Feather className="w-6 h-6 text-emerald-400" />
          <span>Mythos Studio</span>
        </div>

        {/* ПЛАШКА ПРОФИЛЯ — КЛИК ПО НЕЙ ОТКРЫВАЕТ ЛИЧНЫЙ КАБИНЕТ */}
        {currentUser ? (
          <div 
            onClick={() => setActiveView('profile')} 
            title="Перейти в Личный Кабинет"
            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
              activeView === 'profile' 
                ? 'bg-emerald-800 border-emerald-500 ring-2 ring-emerald-400/30' 
                : 'bg-emerald-900/60 hover:bg-emerald-900/90 border-emerald-800'
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-emerald-100 border border-emerald-500 uppercase shrink-0">
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
              onClick={(e) => { e.stopPropagation(); handleLogout(); }} 
              className="text-[10px] text-emerald-400 hover:text-white underline ml-2 shrink-0"
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
              <button onClick={handleLogout} className="text-[10px] text-amber-400 hover:text-amber-200 underline">
                Выход
              </button>
            </div>
            <p className="text-[10px] text-amber-200/80 leading-tight">
              Вы можете тестировать весь функционал. Для сохранения войдите в свой аккаунт.
            </p>
            <button onClick={handleLogout} className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-semibold transition">
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
              if (selectedCyc && selectedCyc.books?.length > 0) {
                setActiveBookId(selectedCyc.books[0].id);
                if (selectedCyc.books[0].chapters?.length > 0) {
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

        {/* НАВИГАЦИЯ (без дублирования личного кабинета) */}
        <div className="space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveView(item.id); setAiResponse(''); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                activeView === item.id ? 'bg-emerald-800 text-white' : 'hover:bg-emerald-900/50 text-emerald-300'
              }`}
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
  );
}
