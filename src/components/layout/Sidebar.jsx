import React from 'react';
import { 
  LayoutDashboard, 
  User, 
  BookOpen, 
  Edit3, 
  Users, 
  Sparkles, 
  FlaskConical, 
  BarChart2, 
  BookMarked,
  Plus,
  LogOut
} from 'lucide-react';

export default function Sidebar({ 
  activeView, 
  setActiveView, 
  currentUser, 
  streakDays, 
  handleLogout, 
  setShowNewCycleModal 
}) {
  const menuItems = [
    { id: 'dashboard', label: 'Главная Панель', icon: LayoutDashboard },
    { id: 'editor', label: 'Редактор Книги', icon: Edit3 },
    { id: 'lore', label: 'База Лора & Персонажи', icon: Users },
    { id: 'brainstorm', label: 'Генератор & Идеи (AI)', icon: Sparkles },
    { id: 'lab', label: 'Симулятор Лаборатория', icon: FlaskConical },
    { id: 'analytics', label: 'ИИ Бета-ридер', icon: BarChart2 },
    { id: 'reader', label: 'Режим Чтения', icon: BookMarked },
    { id: 'profile', label: 'Профиль Автора', icon: User },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 h-full select-none text-slate-200 shrink-0">
      <div className="space-y-6">
        {/* Логотип */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-9 h-9 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold text-lg shadow-lg shadow-emerald-950/50">
            ✦
          </div>
          <div>
            <h1 className="font-bold text-white tracking-wide text-base">Mythos Studio</h1>
            <p className="text-[10px] text-emerald-400 font-medium">Кабинет Писателя</p>
          </div>
        </div>

        {/* Кнопка создания нового цикла/проекта */}
        <button
          onClick={() => setShowNewCycleModal(true)}
          className="w-full py-2.5 px-3 bg-emerald-800 hover:bg-emerald-700 text-white font-medium rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" /> Новый проект
        </button>

        {/* Навигация */}
        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Навигация
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-800/60 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Футер сайдбара с профилем и выходом */}
      <div className="pt-4 border-t border-slate-800/80 px-1 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-800/60 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-300 uppercase">
              {(currentUser?.name || 'A').slice(0, 2)}
            </div>
            <div className="text-xs truncate max-w-[110px]">
              <p className="font-medium text-slate-200 truncate">{currentUser?.name || 'Демо-режим'}</p>
              <p className="text-[10px] text-amber-400">🔥 {streakDays} дн. подряд</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Выйти"
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
