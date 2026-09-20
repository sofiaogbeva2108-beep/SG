import React from 'react';
import { Feather, Wand2, Users, BookOpen, Compass, LogIn, UserPlus, Shield, Lightbulb, ArrowLeft } from 'lucide-react';

export default function LandingView({
  authMode,
  setAuthMode,
  authName,
  setAuthName,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  authError,
  setAuthError,
  handleLogin,
  handleRegister,
  handleStartDemo
}) {
  return (
    <div className="min-h-screen w-full bg-[#061811] text-white flex flex-col justify-between relative overflow-hidden font-sans">
      {/* ФОНОВЫЙ АРТ И ГРАДИЕНТНЫЙ ОВЕРЛЕЙ */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35 scale-105"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#04120d] via-[#061811]/90 to-transparent" />

      {/* ШАПКА / ЛОГОТИП */}
      <header className="relative z-10 px-8 py-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
            <Feather className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <div className="text-xl font-bold tracking-wide text-emerald-100">Mythos Studio</div>
            <div className="text-[11px] text-emerald-400/80">Создавай миры. Оживляй истории.</div>
          </div>
        </div>
      </header>

      {/* ОСНОВНОЙ БЛОК (ДВЕ КОЛОНКИ) */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* ЛЕВАЯ ЧАСТЬ: ИНФОРМАЦИЯ И ПРЕИМУЩЕСТВА */}
        <div className="lg:col-span-7 space-y-6">
          <h1 className="text-3xl md:text-5xl font-extrabold text-emerald-50 leading-tight font-serif">
            Твоя персональная <br />
            <span className="text-emerald-100">
              вселенная начинается здесь
            </span>
          </h1>

          <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-xl">
            Mythos Studio — это платформа для создания уникальных миров, персонажей и историй. Вдохновляйся, пиши, развивай свои идеи и делись ими с другими.
          </p>

          {/* СЕТКА С ИКОНКАМИ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-900/60 border border-emerald-600/40 flex items-center justify-center shrink-0">
                <Wand2 className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-100">Создавай миры</div>
                <div className="text-[11px] text-slate-400">Погружайся в бесконечные возможности фантазии.</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-900/60 border border-emerald-600/40 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-100">Развивай персонажей</div>
                <div className="text-[11px] text-slate-400">Делай их живыми, глубокими и уникальными.</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-900/60 border border-emerald-600/40 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-100">Пиши истории</div>
                <div className="text-[11px] text-slate-400">Оживляй свои идеи и делись ими.</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-900/60 border border-emerald-600/40 flex items-center justify-center shrink-0">
                <Compass className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-100">Общайся с единомышленниками</div>
                <div className="text-[11px] text-slate-400">Найди свою аудиторию и вдохновение.</div>
              </div>
            </div>
          </div>

          <div className="pt-2 italic font-serif text-emerald-300/90 text-base">
            Мифы рождаются здесь
          </div>
        </div>

        {/* ПРАВАЯ ЧАСТЬ: КАРТОЧКА АВТОРИЗАЦИИ (КАК НА МАКЕТЕ) */}
        <div className="lg:col-span-5 bg-[#f4f7f4] text-slate-800 rounded-2xl p-8 shadow-2xl border border-emerald-100/30 max-w-md w-full mx-auto">
          
          {/* ИКОНКА И ЗАГОЛОВОК */}
          <div className="text-center space-y-1 mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-100 mx-auto flex items-center justify-center text-emerald-800 mb-2">
              <Feather className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Добро пожаловать в <br />Mythos Studio
            </h2>
            <p className="text-[11px] text-slate-500">
              Войдите в свой аккаунт или создайте новый, чтобы начать создавать.
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs text-center font-medium">
              {authError}
            </div>
          )}

          {/* ФОРМА ВХОДА ИЛИ РЕГИСТРАЦИИ */}
          {authMode === 'form' ? (
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase mb-1 block">Email автора</label>
                <input 
                  type="email" 
                  required
                  placeholder="writer@mythos.studio" 
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs outline-none focus:border-emerald-700 bg-white"
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
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs outline-none focus:border-emerald-700 bg-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setAuthMode('select')}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-[#006644] hover:bg-[#005236] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Войти в кабинет</span>
                </button>
              </div>
            </form>
          ) : authMode === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase mb-1 block">Имя / Псевдоним</label>
                <input 
                  type="text" 
                  required
                  placeholder="Софья" 
                  value={authName}
                  onChange={e => setAuthName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs outline-none focus:border-emerald-700 bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase mb-1 block">Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="writer@mythos.studio" 
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs outline-none focus:border-emerald-700 bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase mb-1 block">Придумайте пароль</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs outline-none focus:border-emerald-700 bg-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setAuthMode('select')}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-[#006644] hover:bg-[#005236] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Зарегистрироваться</span>
                </button>
              </div>
            </form>
          ) : (
            /* ВЫБОР ДЕЙСТВИЯ (КАК НА СКТИНШОТЕ) */
            <div className="space-y-3">
              <button 
                onClick={() => { setAuthMode('form'); setAuthError(''); }}
                className="w-full py-2.5 bg-[#006644] hover:bg-[#005236] text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Войти</span>
              </button>

              <button 
                onClick={() => { setAuthMode('register'); setAuthError(''); }}
                className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-semibold border border-slate-300 transition flex items-center justify-center gap-1.5"
              >
                <span className="text-base font-normal leading-none">+</span>
                <span>Зарегистрироваться</span>
              </button>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <span className="relative bg-[#f4f7f4] px-3 text-[10px] text-slate-400 uppercase">или</span>
              </div>

              {/* БЛОК БЕЗОПАСНОСТИ */}
              <div className="p-3 bg-white/60 border border-slate-200/60 rounded-xl flex items-start gap-2.5 text-[10px] text-slate-500">
                <Shield className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-700 block font-semibold">Ваши данные в безопасности</strong>
                  Мы заботимся о вашей приватности и не передаем информацию третьим лицам.
                </div>
              </div>

              {/* ПРОБНЫЙ РЕЖИМ (ПРИСОЕДИНЯЙСЯ) */}
              <div 
                onClick={handleStartDemo}
                className="p-3 bg-[#e4f2eb] hover:bg-[#d8ebd2] border border-emerald-200/80 rounded-xl flex items-start gap-2.5 cursor-pointer transition text-left mt-3"
              >
                <Lightbulb className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-950 block text-[11px] font-bold">Присоединяйся к сообществу авторов</strong>
                  <span className="text-[10px] text-emerald-800/80">
                    Нажмите здесь, чтобы попробовать демо-режим без регистрации!
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ФУТЕР */}
      <footer className="relative z-10 py-4 text-center text-[11px] text-emerald-400/60">
        Mythos Studio © 2026 • Платформа для писателей и сценаристов
      </footer>
    </div>
  );
}
