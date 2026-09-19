import React from 'react';
import { Feather, Wand2, Users, BookOpen, Compass, LogIn, UserPlus, Sparkles, Shield } from 'lucide-react';

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
