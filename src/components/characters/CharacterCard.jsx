import React, { useState } from 'react';
import { X, Upload, Sparkles, User, Shield, Heart, Feather, Award } from 'lucide-react';

export default function CharacterCard({ character, onSave, onClose }) {
  const [formData, setFormData] = useState(
    character || {
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
      avatar: null,
    }
  );

  const [activeTab, setActiveTab] = useState('main');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0f172a] border border-emerald-900/50 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl text-slate-200">
        
        {/* Шапка модалки */}
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
        <div className="flex border-b border-slate-800 px-6 bg-slate-900/50 gap-2">
          <button
            onClick={() => setActiveTab('main')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'main'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" /> Основное & Внешность
          </button>
          <button
            onClick={() => setActiveTab('psychology')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'psychology'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className="w-4 h-4" /> Психология & Мотивация
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'skills'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" /> Навыки & Связи
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* ВКЛАДКА 1: ОСНОВНОЕ И ВНЕШНОСТЬ */}
          {activeTab === 'main' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Левая колонка: Аватар */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-48 h-64 rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/80 flex flex-col items-center justify-center overflow-hidden relative group shadow-inner">
                  {formData.avatar ? (
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
                </div>

                {/* Заглушка под будущую генерацию ИИ */}
                <button
                  type="button"
                  onClick={() => alert('Генерация портрета через ИИ будет доступна после подключения модуля генерации изображений!')}
                  className="w-full py-2 px-3 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-700/50 text-emerald-400 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Сгенерировать портрет
                </button>
              </div>

              {/* Правая колонка: Поля формы */}
              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">ФИО / Имя</label>
                    <input
                      type="text"
                      required
                      placeholder="Элара Найтс"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Прозвище / Титул</label>
                    <input
                      type="text"
                      placeholder="«Тень Северного Башни»"
                      value={formData.alias}
                      onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Роль в сюжете</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option>Главный герой</option>
                      <option>Антагонист</option>
                      <option>Второстепенный</option>
                      <option>Эпизодический</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Статус</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
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
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Возраст</label>
                    <input
                      type="text"
                      placeholder="21 год"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Рост</label>
                    <input
                      type="text"
                      placeholder="172 см"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Вес / Телосложение</label>
                    <input
                      type="text"
                      placeholder="58 кг / Стройное"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Описание внешности</label>
                  <textarea
                    rows={4}
                    placeholder="Цвет глаз, волосы, шрамы, особые приметы, стиль одежды..."
                    value={formData.appearance}
                    onChange={(e) => setFormData({ ...formData, appearance: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ВКЛАДКА 2: ПСИХОЛОГИЯ */}
          {activeTab === 'psychology' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Характер & Ключевые черты</label>
                <textarea
                  rows={3}
                  placeholder="Холодная, сдержанная, предана близким, остроумная..."
                  value={formData.personality}
                  onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Главная цель & Мотивация</label>
                <textarea
                  rows={3}
                  placeholder="Чего персонаж хочет больше всего на свете?"
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Страхи & Слабости</label>
                  <textarea
                    rows={3}
                    placeholder="Чего боится, в чем его уязвимость?"
                    value={formData.fears}
                    onChange={(e) => setFormData({ ...formData, fears: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Привычки & Жестикуляция</label>
                  <textarea
                    rows={3}
                    placeholder="Мелкие детали, повадки, особенные фразы..."
                    value={formData.habits}
                    onChange={(e) => setFormData({ ...formData, habits: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ВКЛАДКА 3: НАВЫКИ И СВЯЗИ */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Магия / Навыки / Снаряжение</label>
                <textarea
                  rows={3}
                  placeholder="Теневая магия, владение парными клинками, древний амулет..."
                  value={formData.magicOrSkills}
                  onChange={(e) => setFormData({ ...formData, magicOrSkills: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Связи и отношения</label>
                <textarea
                  rows={4}
                  placeholder="Каин — союзник и наставник; Лорд Вудс — заклятый враг..."
                  value={formData.relationships}
                  onChange={(e) => setFormData({ ...formData, relationships: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* Кнопки сохранения */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
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
        </form>
      </div>
    </div>
  );
}
