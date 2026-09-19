// src/components/views/DashboardView.jsx
import React from 'react';
import { 
  Users, MapPin, BookOpen, ArrowRight, Plus, 
  Sparkles, Compass, Activity, UserPlus, FileText, Lightbulb
} from 'lucide-react';

export default function DashboardView({ 
  cycles, 
  currentCycle, 
  currentUser, 
  setShowNewCycleModal, 
  setActiveCycleId, 
  setActiveBookId, 
  setActiveView 
}) {
  const userName = currentUser?.name || 'Автор';

  // Состояние, если у автора ещё нет циклов
  if (!cycles || cycles.length === 0) {
    return (
      <div className="h-full p-8 overflow-y-auto flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-emerald-100 flex items-center justify-center text-emerald-800 shadow-inner">
          <BookOpen className="w-10 h-10" />
        </div>
        <div className="max-w-md space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">С возвращением, {userName}!</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Ваша творческая вселенная пока пуста. Создайте свой первый литературный цикл, чтобы начать прорабатывать мир, персонажей и сюжетные линии.
          </p>
        </div>
        <button 
          onClick={() => setShowNewCycleModal(true)}
          className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" /> Создать первый цикл
        </button>
      </div>
    );
  }

  const charCount = currentCycle?.lore?.characters?.length || 0;
  const locCount = currentCycle?.lore?.locations?.length || 0;
  const bookCount = currentCycle?.books?.length || 0;

  return (
    <div className="h-full p-6 overflow-y-auto space-y-6 bg-[#FAF9F6]">
      
      {/* 1. БАННЕР ТЕКУЩЕГО ЦИКЛА (Как на макете) */}
      <div className="relative w-full h-64 rounded-3xl overflow-hidden shadow-md border border-emerald-900/10 text-white flex flex-col justify-between p-8 bg-emerald-950">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/80 to-transparent" />

        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-300 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> Текущий цикл
          </div>
          <h1 className="text-3xl font-extrabold font-serif text-emerald-50 tracking-wide">
            {currentCycle?.title || 'Без названия'}
          </h1>
          <p className="text-xs text-emerald-200/80 italic font-serif">
            «{currentCycle?.description || 'История, которая ещё не рассказана.'}»
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between pt-4 border-t border-emerald-800/50">
          <div className="flex items-center gap-6 text-xs text-emerald-200 font-medium">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400" /> <strong>{charCount}</strong> Персонажей
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" /> <strong>{locCount}</strong> Локаций
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-400" /> <strong>{bookCount}</strong> Книг
            </span>
          </div>

          <button 
            onClick={() => {
              setActiveCycleId(currentCycle.id);
              setActiveBookId(currentCycle.books?.[0]?.id || '');
              setActiveView('editor');
            }}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md"
          >
            <span>Продолжить создание</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. СЕКЦИЯ ПРИВЕТСТВИЯ И ПОСЛЕДНИХ АКТИВНОСТЕЙ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Приветствие и быстрый выбор последнего файла */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">С возвращением, {userName}!</h2>
            <p className="text-xs text-slate-500 mt-1">
              Вы остановились на разработке мира «{currentCycle?.title}».
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div 
              onClick={() => setActiveView('lore')}
              className="p-3 bg-emerald-50/50 hover:bg-emerald-100/50 rounded-xl border border-emerald-100 cursor-pointer transition space-y-1"
            >
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Последний персонаж</div>
              <div className="text-xs font-bold text-emerald-900 truncate">
                {currentCycle?.lore?.characters?.[0]?.name || 'Не создан'}
              </div>
            </div>

            <div 
              onClick={() => setActiveView('editor')}
              className="p-3 bg-emerald-50/50 hover:bg-emerald-100/50 rounded-xl border border-emerald-100 cursor-pointer transition space-y-1"
            >
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Последняя глава</div>
              <div className="text-xs font-bold text-emerald-900 truncate">
                {currentCycle?.books?.[0]?.chapters?.[0]?.title || 'Глава I'}
              </div>
            </div>

            <div 
              onClick={() => setActiveView('brainstorm')}
              className="p-3 bg-emerald-50/50 hover:bg-emerald-100/50 rounded-xl border border-emerald-100 cursor-pointer transition space-y-1"
            >
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Последняя идея</div>
              <div className="text-xs font-bold text-emerald-900 truncate">Источник магии</div>
            </div>

            <div 
              onClick={() => setActiveView('lore')}
              className="p-3 bg-emerald-50/50 hover:bg-emerald-100/50 rounded-xl border border-emerald-100 cursor-pointer transition space-y-1"
            >
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Последняя локация</div>
              <div className="text-xs font-bold text-emerald-900 truncate">
                {currentCycle?.lore?.locations?.[0]?.name || 'Не создана'}
              </div>
            </div>
          </div>
        </div>

        {/* Правый блок: Быстрые действия & Искра дня */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
            <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">Быстрые действия</div>
            <div className="space-y-1.5">
              <button 
                onClick={() => setActiveView('lore')}
                className="w-full text-left p-2 hover:bg-emerald-50 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-between transition"
              >
                <span className="flex items-center gap-2"><UserPlus className="w-3.5 h-3.5 text-emerald-700" /> Создать персонажа</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
              <button 
                onClick={() => setActiveView('lore')}
                className="w-full text-left p-2 hover:bg-emerald-50 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-between transition"
              >
                <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-emerald-700" /> Добавить локацию</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
              <button 
                onClick={() => setActiveView('brainstorm')}
                className="w-full text-left p-2 hover:bg-emerald-50 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-between transition"
              >
                <span className="flex items-center gap-2"><Lightbulb className="w-3.5 h-3.5 text-emerald-700" /> Создать идею</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 3. КАРТА МИРА И ИНТЕРАКТИВНЫЙ ГРАФ СВЯЗЕЙ (Как в нижней части макета) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Карта мира */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-700" /> Карта мира
            </h3>
            <button onClick={() => setActiveView('lore')} className="text-xs text-emerald-700 font-semibold hover:underline">Открыть карту →</button>
          </div>
          
          <div className="w-full h-48 bg-emerald-900/10 rounded-xl border border-emerald-200/60 relative overflow-hidden flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1000&q=80')` }}
            />
            <div className="relative z-10 text-center space-y-2">
              <MapPin className="w-8 h-8 text-emerald-700 mx-auto" />
              <div className="text-xs font-bold text-emerald-950">География текущего цикла</div>
              <div className="text-[11px] text-slate-500 max-w-xs">
                {locCount > 0 ? `Локаций зарегистрировано: ${locCount}` : 'Добавьте первую локацию в базе лора'}
              </div>
            </div>
          </div>
        </div>

        {/* Пульс мира / Граф персонажей */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-700" /> Связи персонажей
            </h3>
            <button onClick={() => setActiveView('lab')} className="text-xs text-emerald-700 font-semibold hover:underline">Открыть граф →</button>
          </div>

          <div className="w-full h-48 bg-slate-50 rounded-xl border border-slate-200 p-4 flex items-center justify-center relative">
            {currentCycle?.lore?.characters?.length > 0 ? (
              <div className="flex flex-wrap gap-2 items-center justify-center">
                {currentCycle.lore.characters.map((c, i) => (
                  <div key={c.id || i} className="px-3 py-1.5 bg-emerald-800 text-white rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    {c.name}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-400 text-xs">
                Персонажи пока не созданы
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
