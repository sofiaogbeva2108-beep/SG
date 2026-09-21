import React, { useState, useEffect } from 'react';
import {
  BookOpen, Upload, ArrowRight, Users, MapPin, Target, Clock, Tag, X
} from 'lucide-react';

const STRUCTURE_MODELS = ['Три акта', 'Путь героя', 'Снежинка', 'Save the Cat', 'Своя структура'];

function countWords(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function formatUpdatedAt(timestamp) {
  if (!timestamp) return 'ещё не редактировалась';
  const diffMs = Date.now() - timestamp;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'обновлено только что';
  if (diffMin < 60) return `обновлено ${diffMin} мин. назад`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `обновлено ${diffH} ч. назад`;
  const diffD = Math.floor(diffH / 24);
  return `обновлено ${diffD} дн. назад`;
}

export default function BookHub({ book, currentCycle, onUpdateBookMeta, onContinue, onOpenLore }) {
  const [form, setForm] = useState({
    logline: book?.logline || '',
    genre: book?.genre || '',
    audience: book?.audience || '',
    wordGoal: book?.wordGoal || '',
    annotation: book?.annotation || '',
    themes: book?.themes || [],
    deadline: book?.deadline || '',
    povTime: book?.povTime || '',
    structure: book?.structure || STRUCTURE_MODELS[0],
    cover: book?.cover || null,
  });
  const [themeInput, setThemeInput] = useState('');

  // Синхронизация при переключении на другую книгу
  useEffect(() => {
    setForm({
      logline: book?.logline || '',
      genre: book?.genre || '',
      audience: book?.audience || '',
      wordGoal: book?.wordGoal || '',
      annotation: book?.annotation || '',
      themes: book?.themes || [],
      deadline: book?.deadline || '',
      povTime: book?.povTime || '',
      structure: book?.structure || STRUCTURE_MODELS[0],
      cover: book?.cover || null,
    });
  }, [book?.id]);

  const save = (patch) => {
    const next = { ...form, ...patch };
    setForm(next);
    onUpdateBookMeta(next);
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => save({ cover: reader.result });
    reader.readAsDataURL(file);
  };

  const addTheme = (e) => {
    e.preventDefault();
    const val = themeInput.trim();
    if (!val || form.themes.includes(val)) return;
    save({ themes: [...form.themes, val] });
    setThemeInput('');
  };

  const removeTheme = (t) => {
    save({ themes: form.themes.filter((x) => x !== t) });
  };

  // Прогресс по словам
  const totalWords = (book?.chapters || []).reduce(
    (sum, ch) => sum + (ch.scenes || []).reduce((s, sc) => s + countWords(sc.content), 0),
    0
  );
  const goal = Number(form.wordGoal) || 0;
  const percent = goal > 0 ? Math.min(100, Math.round((totalWords / goal) * 100)) : null;

  const chapterCount = book?.chapters?.length || 0;
  const emptyChapters = (book?.chapters || []).filter(
    (ch) => (ch.scenes || []).every((sc) => !sc.content?.trim())
  ).length;

  const inputClass =
    'w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-emerald-500';
  const labelClass = 'block text-[11px] font-semibold text-slate-500 mb-1';

  if (!book) {
    return (
      <div className="h-full flex items-center justify-center text-xs text-slate-400">
        Сначала создайте книгу.
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-[#FAF9F6] p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ВЕРХНИЙ БЛОК — ПАСПОРТ КНИГИ */}
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 flex flex-col sm:flex-row gap-6">
          {/* Обложка */}
          <label className="w-36 h-52 rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 flex flex-col items-center justify-center overflow-hidden relative shrink-0 cursor-pointer group mx-auto sm:mx-0">
            {form.cover ? (
              <img src={form.cover} alt="Обложка" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-3">
                <BookOpen className="w-8 h-8 text-emerald-300 mx-auto mb-1" />
                <p className="text-[10px] text-emerald-700 font-medium">Загрузить обложку</p>
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
          </label>

          {/* Название и мета */}
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{book.title}</h1>
              <input
                type="text"
                placeholder="Слоган / логлайн в одну строку..."
                value={form.logline}
                onChange={(e) => setForm({ ...form, logline: e.target.value })}
                onBlur={() => save({ logline: form.logline })}
                className="w-full mt-1 text-sm italic text-slate-500 bg-transparent outline-none border-b border-transparent focus:border-emerald-200 py-1"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Жанр</label>
                <input
                  type="text"
                  placeholder="Тёмное фэнтези, YA-роман..."
                  value={form.genre}
                  onChange={(e) => setForm({ ...form, genre: e.target.value })}
                  onBlur={() => save({ genre: form.genre })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Целевая аудитория</label>
                <input
                  type="text"
                  placeholder="YA, 16+, взрослая проза..."
                  value={form.audience}
                  onChange={(e) => setForm({ ...form, audience: e.target.value })}
                  onBlur={() => save({ audience: form.audience })}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Цель по объёму (слов)</label>
                <input
                  type="number"
                  placeholder="80000"
                  value={form.wordGoal}
                  onChange={(e) => setForm({ ...form, wordGoal: e.target.value })}
                  onBlur={() => save({ wordGoal: form.wordGoal })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>POV и время повествования</label>
                <input
                  type="text"
                  placeholder="От первого лица, прошедшее время"
                  value={form.povTime}
                  onChange={(e) => setForm({ ...form, povTime: e.target.value })}
                  onBlur={() => save({ povTime: form.povTime })}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* БЛОК ПРОГРЕССА */}
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-700" /> Прогресс
            </h2>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {formatUpdatedAt(book.updatedAt)}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-emerald-900">{totalWords.toLocaleString('ru-RU')}</span>
            <span className="text-xs text-slate-400">
              {goal > 0 ? `из ${goal.toLocaleString('ru-RU')} слов` : 'слов написано'}
            </span>
          </div>

          {percent !== null && (
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
          )}

          <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
            <span>{chapterCount} {chapterCount === 1 ? 'глава' : 'глав(ы)'}</span>
            {emptyChapters > 0 && <span>· {emptyChapters} ещё пустых</span>}
            {percent !== null && <span>· готовность {percent}%</span>}
          </div>
        </div>

        {/* БЛОК КРАТКОГО ОПИСАНИЯ */}
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Краткое описание</h2>

          <div>
            <label className={labelClass}>Аннотация</label>
            <textarea
              rows={3}
              placeholder="О чём эта книга — пара абзацев для читателя..."
              value={form.annotation}
              onChange={(e) => setForm({ ...form, annotation: e.target.value })}
              onBlur={() => save({ annotation: form.annotation })}
              className={inputClass + ' resize-none'}
            />
          </div>

          <div>
            <label className={labelClass}>Темы и мотивы</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.themes.map((t) => (
                <span
                  key={t}
                  className="px-2 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-[11px] font-medium flex items-center gap-1"
                >
                  {t}
                  <button onClick={() => removeTheme(t)} className="hover:text-rose-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <form onSubmit={addTheme} className="flex gap-2">
              <input
                type="text"
                placeholder="взросление, месть, поиск дома..."
                value={themeInput}
                onChange={(e) => setThemeInput(e.target.value)}
                className={inputClass}
              />
              <button
                type="submit"
                className="px-3 py-2 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0"
              >
                <Tag className="w-3.5 h-3.5" /> Добавить
              </button>
            </form>
          </div>
        </div>

        {/* СЛУЖЕБНОЕ + ДЕЙСТВИЯ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Служебное</h2>
            <div>
              <label className={labelClass}>Дедлайн</label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                onBlur={() => save({ deadline: form.deadline })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Структура</label>
              <select
                value={form.structure}
                onChange={(e) => save({ structure: e.target.value })}
                className={inputClass}
              >
                {STRUCTURE_MODELS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 space-y-2">
            <h2 className="text-sm font-bold text-slate-900 mb-1">Действия</h2>
            <button
              onClick={onContinue}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              Продолжить письмо <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenLore}
              className="w-full py-2 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-emerald-50 transition"
            >
              <Users className="w-3.5 h-3.5" /> Персонажи книги
            </button>
            <button
              onClick={onOpenLore}
              className="w-full py-2 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-emerald-50 transition"
            >
              <MapPin className="w-3.5 h-3.5" /> Мир и локации
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
