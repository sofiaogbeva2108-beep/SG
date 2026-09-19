// src/components/views/ProfileView.jsx
import React from 'react';
import { 
  Flame, Award, BookOpen, Users, MapPin, Feather, 
  CheckCircle2, Sparkles, TrendingUp 
} from 'lucide-react';

export default function ProfileView({ currentUser, cycles, streakDays = 5 }) {
  const userName = currentUser?.name || 'Софья';
  const userEmail = currentUser?.email || 'writer@mythos.studio';

  // Расчёт общей статистики автора
  const totalCycles = cycles?.length || 0;
  
  let totalBooks = 0;
  let totalWords = 0;
  let totalCharacters = 0;
  let totalLocations = 0;

  cycles?.forEach(cycle => {
    totalCharacters += cycle.lore?.characters?.length || 0;
    totalLocations += cycle.lore?.locations?.length || 0;
    
    cycle.books?.forEach(book => {
      totalBooks += 1;
      book.chapters?.forEach(ch => {
        ch.scenes?.forEach(sc => {
          if (sc.content) {
            totalWords += sc.content.trim().split(/\s+/).filter(Boolean).length;
          }
        });
      });
    });
  });

  // Расчёт уровня писателя на основе слов и созданного лора
  const xp = totalWords + (totalCharacters * 50) + (totalLocations * 30);
  const level = Math.floor(xp / 500) + 1;
  const currentLevelXp = xp % 500;
  const levelProgress = Math.min(100, Math.round((currentLevelXp / 500) * 100));

  // Определение звания по уровню
  const getRankTitle = (lvl) => {
    if (lvl === 1) return 'Начинающий автограф';
    if (lvl < 3) return 'Летописец Забытых Земель';
    if (lvl < 5) return 'Мастер Слова и Сюжета';
    if (lvl < 10) return 'Архитектор Фэнтези-Миров';
    return 'Демиург Мифологии';
  };

  // Достижения
  const achievements = [
    { id: 1, title: 'Первый шаг', desc: 'Зарегистрироваться в Mythos Studio', unlocked: true, icon: Feather },
    { id: 2, title: 'Зарождение мира', desc: 'Создать первый литературный цикл', unlocked: totalCycles > 0, icon: BookOpen },
    { id: 3, title: 'Ожившее имя', desc: 'Добавить 3 или более персонажей в Лоре', unlocked: totalCharacters >= 3, icon: Users },
    { id: 4, title: 'Тысячник', desc: 'Написать более 1,000 слов', unlocked: totalWords >= 1000, icon: TrendingUp },
    { id: 5, title: 'Огонь вдохновения', desc: 'Писать 5 дней подряд', unlocked: streakDays >= 5, icon: Flame }
  ];

  return (
    <div className="h-full p-6 overflow-y-auto space-y-6 bg-[#FAF9F6]">
      
      {/* 1. ВЕРХНИЙ БАННЕР ПРОФИЛЯ */}
      <div className="bg-emerald-950 rounded-3xl p-6 md:p-8 text-white shadow-lg border border-emerald-800 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/60 via-emerald-950 to-transparent pointer-events-none" />

        <div className="relative z-10 flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-emerald-800 border-2 border-emerald-400 flex items-center justify-center font-bold text-2xl text-emerald-100 shadow-inner uppercase shrink-0">
            {userName.slice(0, 2)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-serif text-emerald-100">{userName}</h1>
              <span className="px-2.5 py-0.5 bg-emerald-800/80 border border-emerald-600 rounded-full text-[10px] text-emerald-300 font-semibold uppercase tracking-wider">
                PRO
              </span>
            </div>
            <p className="text-xs text-emerald-300/80">{userEmail}</p>
            <div className="text-xs text-amber-400 font-semibold flex items-center gap-1.5 pt-1">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Ранг: <strong>{getRankTitle(level)}</strong></span>
            </div>
          </div>
        </div>

        {/* Счётчик Серии Дней (Streak) */}
        <div className="relative z-10 bg-emerald-900/80 border border-emerald-700/80 rounded-2xl p-4 flex items-center gap-4 shrink-0 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
            <Flame className="w-7 h-7 text-amber-400 fill-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-amber-300">{streakDays} дней подряд</div>
            <div className="text-[11px] text-emerald-200/80">Серия активности писателя</div>
          </div>
        </div>
      </div>

      {/* 2. УРОВЕНЬ И ПРОГРЕСС ОПЫТА (XP) */}
      <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Уровень {level}</span>
          </span>
          <span className="text-slate-500">{currentLevelXp} / 500 XP до Уровня {level + 1}</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div 
            className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${levelProgress}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400">
          Зарабатывайте XP за написание текста (1 слово = 1 XP) и создание элементов Лора.
        </p>
      </div>

      {/* 3. ОБЩАЯ СТАТИСТИКА */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
            <Feather className="w-4 h-4 text-emerald-600" /> Всего слов
          </div>
          <div className="text-2xl font-extrabold text-emerald-950">{totalWords.toLocaleString()}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
            <BookOpen className="w-4 h-4 text-emerald-600" /> Книг
          </div>
          <div className="text-2xl font-extrabold text-emerald-950">{totalBooks}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
            <Users className="w-4 h-4 text-emerald-600" /> Персонажей
          </div>
          <div className="text-2xl font-extrabold text-emerald-950">{totalCharacters}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
            <MapPin className="w-4 h-4 text-emerald-600" /> Локаций
          </div>
          <div className="text-2xl font-extrabold text-emerald-950">{totalLocations}</div>
        </div>
      </div>

      {/* 4. ДОСТИЖЕНИЯ АВТОРА */}
      <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-700" /> Достижения & Награды
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {achievements.map(item => (
            <div 
              key={item.id} 
              className={`p-4 rounded-xl border flex items-start gap-3 transition ${
                item.unlocked 
                  ? 'bg-emerald-50/60 border-emerald-200 text-slate-800' 
                  : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                item.unlocked ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-400'
              }`}>
                <item.icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <span>{item.title}</span>
                  {item.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <div className="text-[11px] mt-0.5 leading-snug">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
