import React from 'react';
import { User, Sparkles, BookOpen, Compass, Shield, Feather, Eye } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'characters', label: 'База Персонажей', icon: User },
    { id: 'generator', label: 'Генератор & Идеи', icon: Sparkles },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between p-4 h-full select-none">
      <div className="space-y-6">
        {/* Логотип */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-lg shadow-lg shadow-emerald-950/50">
            ✦
          </div>
          <div>
            <h1 className="font-bold text-white tracking-wide text-base">Mythos Studio</h1>
            <p className="text-[10px] text-emerald-400 font-medium">Кабинет Писателя</p>
          </div>
        </div>

        {/* Навигация */}
        <nav className="space-y-1.5">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Разделы
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 shadow-md shadow-emerald-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Футер сайдбара */}
      <div className="pt-4 border-t border-slate-800/80 px-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-900/40 border border-emerald-700/50 flex items-center justify-center text-xs font-bold text-emerald-300">
            MS
          </div>
          <div className="text-xs">
            <p className="font-medium text-slate-300">Mythos Studio</p>
            <p className="text-[10px] text-slate-500">Версия 1.0.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
