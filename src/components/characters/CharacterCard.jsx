import React, { useState } from 'react';
import { X, Upload, Sparkles, User, Shield, Heart, BookOpen, Trash2, Loader2 } from 'lucide-react';
import { generateCharacterPortrait } from '../../services/aiService';

const emptyCharacter = {
  name: '',
  alias: '',
  role: 'Главный герой',
  status: 'Жив',
  age: '',
  height: '',
  weight: '',
  appearance: '',
  personality: '',
  motivation: '',
  fears: '',
  habits: '',
  magicOrSkills: '',
  relationships: '',
  occupation: '',
  quote: '',
  backstory: '',
  arcNotes: '',
  avatar: null,
};

export default function CharacterCard({ character, currentCycle, onSave, onClose, onDelete }) {
  const [formData, setFormData] = useState(
    character ? { ...emptyCharacter, ...character } : emptyCharacter
  );

  const [activeTab, setActiveTab] = useState('main');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState('');

  // Обработка загрузки фото с устройства
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Генерация портрета через ИИ на основе заполненных полей досье
  const handleGeneratePortrait = async () => {
    setIsGenerating(true);
    setGenError('');
    try {
      const image = await generateCharacterPortrait(formData, currentCycle);
      setFormData((prev) => ({ ...prev, avatar: image }));
    } catch (error) {
      setGenError(error.message || 'Не удалось сгенерировать портрет. Попробуйте ещё раз.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleDelete = () => {
    if (onDelete && character?.id && confirm('Удалить этого персонажа из проекта?')) {
      onDelete(character.id);
    }
  };

  const tabClass = (tab) =>
    `py-3 px-4 text-sm font-medium border-b-2 transition flex items-center gap-2 ${
      activeTab === tab
        ? 'border-emerald-500 text-emerald-400'
        : 'border-transparent text-slate-400 hover:text-slate-200'
    }`;

  const inputClass =
    'w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500';
  const textareaClass =
    'w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none';
  const labelClass = 'block text-xs font-semibold text-slate-400 mb-1';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0f172a] border border-emerald-900/50 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl text-slate-200">

        {/* Шапка модалки — страница персонажа */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">
              {formData.name ? formData.name : 'Новый персонаж'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Навигация по вкладкам */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-900/50 gap-2 overflow-x-auto">
          <button onClick={() => setActiveTab('main')} className={tabClass('main')}>
            <User className="w-4 h-4" /> Основное & Внешность
          </button>
          <button onClick={() => setActiveTab('psychology')} className={tabClass('psychology')}>
            <Heart className="w-4 h-4" /> Психология & Мотивация
          </button>
          <button onClick={() => setActiveTab('skills')} className={tabClass('skills')}>
            <Shield className="w-4 h-4" /> Навыки & Связи
          </button>
          <button onClick={() => setActiveTab('story')} className={tabClass('story')}>
            <BookOpen className="w-4 h-4" /> История & Развитие
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">

          {/* ВКЛАДКА 1: ОСНОВНОЕ И ВНЕШНОСТЬ */}
          {activeTab === 'main' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Левая колонка: Аватар */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-48 h-64 rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/80 flex flex-col items-center justify-center overflow-hidden relative group shadow-inner">
                  {isGenerating ? (
                    <div className="text-center p-4">
                      <Loader2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 animate-spin" />
                      <p className="text-xs text-slate-400">Генерируем портрет...</p>
                    </div>
                  ) : formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt={formData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <User className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-500">Нет портрета</p>
                    </div>
                  )}

                  {/* Оверлей загрузки */}
                  {!isGenerating && (
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 cursor-pointer transition">
                      <Upload className="w-6 h-6 text-white" />
                      <span className="text-xs font-medium text-white">Загрузить фото</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleGeneratePortrait}
                  disabled={isGenerating}
                  className="w-full py-2 px-3 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-700/50 text-emerald-400 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  )}
                  {isGenerating ? 'Секунду...' : 'Сгенерировать портрет'}
                </button>
                {genError && (
                  <p className="text-[11px] text-rose-400 text-center">{genError}</p>
                )}
                <p className="text-[10px] text-slate-500 text-center">
                  Портрет строится по заполненным полям внешности и характера — заполните их ниже для более точного результата.
                </p>
              </div>

              {/* Правая колонка: Поля формы */}
              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>ФИО / Имя</label>
                    <input
                      type="text"
                      required
                      placeholder="Элара Найтс"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Прозвище / Титул</label>
                    <input
                      type="text"
                      placeholder="«Тень Северного Башни»"
                      value={formData.alias}
                      onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Роль в сюжете</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className={inputClass}
                    >
                      <option>Главный герой</option>
                      <option>Антагонист</option>
                      <option>Второстепенный</option>
                      <option>Эпизодический</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Статус</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className={inputClass}
                    >
                      <option>Жив</option>
                      <option>Погиб</option>
                      <option>Пропал без вести</option>
                      <option>Переродился</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>Возраст</label>
                    <input
                      type="text"
                      placeholder="21 год"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Рост</label>
                    <input
                      type="text"
                      placeholder="172 см"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Вес / Телосложение</label>
                    <input
                      type="text"
                      placeholder="58 кг / Стройное"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Род занятий</label>
                  <input
                    type="text"
                    placeholder="Наёмница, придворный маг, студент..."
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Описание внешности</label>
                  <textarea
                    rows={4}
                    placeholder="Цвет глаз, волосы, шрамы, особые приметы, стиль одежды..."
                    value={formData.appearance}
                    onChange={(e) => setFormData({ ...formData, appearance: e.target.value })}
                    className={textareaClass}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ВКЛАДКА 2: ПСИХОЛОГИЯ */}
          {activeTab === 'psychology' && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Характер & Ключевые черты</label>
                <textarea
                  rows={3}
                  placeholder="Холодная, сдержанная, предана близким, остроумная..."
                  value={formData.personality}
                  onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                  className={textareaClass}
                />
              </div>

              <div>
                <label className={labelClass}>Главная цель & Мотивация</label>
                <textarea
                  rows={3}
                  placeholder="Чего персонаж хочет больше всего на свете?"
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  className={textareaClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Страхи & Слабости</label>
                  <textarea
                    rows={3}
                    placeholder="Чего боится, в чем его уязвимость?"
                    value={formData.fears}
                    onChange={(e) => setFormData({ ...formData, fears: e.target.value })}
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Привычки & Жестикуляция</label>
                  <textarea
                    rows={3}
                    placeholder="Мелкие детали, повадки, особенные фразы..."
                    value={formData.habits}
                    onChange={(e) => setFormData({ ...formData, habits: e.target.value })}
                    className={textareaClass}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ВКЛАДКА 3: НАВЫКИ И СВЯЗИ */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Магия / Навыки / Снаряжение</label>
                <textarea
                  rows={3}
                  placeholder="Теневая магия, владение парными клинками, древний амулет..."
                  value={formData.magicOrSkills}
                  onChange={(e) => setFormData({ ...formData, magicOrSkills: e.target.value })}
                  className={textareaClass}
                />
              </div>

              <div>
                <label className={labelClass}>Связи и отношения</label>
                <textarea
                  rows={4}
                  placeholder="Каин — союзник и наставник; Лорд Вудс — заклятый враг..."
                  value={formData.relationships}
                  onChange={(e) => setFormData({ ...formData, relationships: e.target.value })}
                  className={textareaClass}
                />
              </div>
            </div>
          )}

          {/* ВКЛАДКА 4: ИСТОРИЯ И РАЗВИТИЕ (новое) */}
          {activeTab === 'story' && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Коронная фраза / манера речи</label>
                <input
                  type="text"
                  placeholder="Характерная фраза, поговорка или речевая особенность персонажа"
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Предыстория</label>
                <textarea
                  rows={4}
                  placeholder="Откуда персонаж родом, ключевые события прошлого, которые его сформировали..."
                  value={formData.backstory}
                  onChange={(e) => setFormData({ ...formData, backstory: e.target.value })}
                  className={textareaClass}
                />
              </div>

              <div>
                <label className={labelClass}>Арка развития по сюжету</label>
                <textarea
                  rows={4}
                  placeholder="Каким персонаж начинает историю и каким её заканчивает? Что его меняет?"
                  value={formData.arcNotes}
                  onChange={(e) => setFormData({ ...formData, arcNotes: e.target.value })}
                  className={textareaClass}
                />
              </div>
            </div>
          )}

          {/* Кнопки сохранения */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <div>
              {character?.id && onDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3 py-2 text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" /> Удалить
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl text-sm transition shadow-lg shadow-emerald-900/30"
              >
                Сохранить персонажа
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

