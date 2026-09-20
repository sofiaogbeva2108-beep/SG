// src/components/views/LabView.jsx
import React, { useState, useRef } from 'react';
import { Network, Plus, Trash2, Heart, ShieldAlert, Users, Zap, X, Move } from 'lucide-react';

const RELATION_TYPES = [
  { id: 'friends', label: 'Друзья / Союзники', color: '#10b981', bg: 'bg-emerald-500/10', border: 'border-emerald-500', text: 'text-emerald-400' },
  { id: 'enemies', label: 'Враги / Соперники', color: '#ef4444', bg: 'bg-rose-500/10', border: 'border-rose-500', text: 'text-rose-400' },
  { id: 'family', label: 'Семья / Родство', color: '#f59e0b', bg: 'bg-amber-500/10', border: 'border-amber-500', text: 'text-amber-400' },
  { id: 'romance', label: 'Возлюбленные / Симпатия', color: '#ec4899', bg: 'bg-pink-500/10', border: 'border-pink-500', text: 'text-pink-400' },
  { id: 'mentor', label: 'Учитель / Наставник', color: '#8b5cf6', bg: 'bg-purple-500/10', border: 'border-purple-500', text: 'text-purple-400' },
  { id: 'tense', label: 'Натянутые отношения', color: '#64748b', bg: 'bg-slate-500/10', border: 'border-slate-500', text: 'text-slate-400' },
];

export default function LabView({ currentCycle, setCycles, activeCycleId }) {
  const characters = currentCycle?.lore?.characters || [];
  const relationships = currentCycle?.lore?.relationships || [];

  // Состояние позиций карточек персонажей на холсте (по ID персонажа)
  const [positions, setPositions] = useState(() => {
    const initial = {};
    characters.forEach((c, idx) => {
      initial[c.id] = {
        x: 100 + (idx % 3) * 260,
        y: 80 + Math.floor(idx / 3) * 180,
      };
    });
    return initial;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sourceCharId, setSourceCharId] = useState('');
  const [targetCharId, setTargetCharId] = useState('');
  const [relationType, setRelationType] = useState('friends');
  const [relationLabel, setRelationLabel] = useState('');

  // Для перетаскивания узлов
  const draggingNode = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Добавление новой связи в состояние цикла
  const handleAddRelationship = (e) => {
    e.preventDefault();
    if (!sourceCharId || !targetCharId || sourceCharId === targetCharId) return;

    const newRel = {
      id: 'rel-' + Date.now(),
      sourceId: sourceCharId,
      targetId: targetCharId,
      type: relationType,
      label: relationLabel || RELATION_TYPES.find(r => r.id === relationType)?.label || 'Связь',
    };

    setCycles(prev => prev.map(c => {
      if (c.id !== activeCycleId) return c;
      const currentRels = c.lore?.relationships || [];
      return {
        ...c,
        lore: {
          ...c.lore,
          relationships: [...currentRels, newRel],
        }
      };
    }));

    // Сброс формы
    setRelationLabel('');
    setIsModalOpen(false);
  };

  // Удаление связи
  const handleDeleteRelationship = (relId) => {
    setCycles(prev => prev.map(c => {
      if (c.id !== activeCycleId) return c;
      return {
        ...c,
        lore: {
          ...c.lore,
          relationships: (c.lore?.relationships || []).filter(r => r.id !== relId),
        }
      };
    }));
  };

  // Перетаскивание узлов персонажей
  const handleMouseDown = (e, charId) => {
    draggingNode.current = charId;
    const pos = positions[charId] || { x: 100, y: 100 };
    dragOffset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!draggingNode.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(20, Math.min(rect.width - 220, e.clientX - dragOffset.current.x));
    const y = Math.max(20, Math.min(rect.height - 120, e.clientY - dragOffset.current.y));

    setPositions(prev => ({
      ...prev,
      [draggingNode.current]: { x, y }
    }));
  };

  const handleMouseUp = () => {
    draggingNode.current = null;
  };

  if (characters.length < 2) {
    return (
      <div className="h-full p-8 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800">
          <Network className="w-8 h-8" />
        </div>
        <div className="max-w-md">
          <h2 className="text-xl font-bold text-slate-900">Граф связей персонажей</h2>
          <p className="text-xs text-slate-500 mt-1">
            Чтобы строить социограмму и семейные древа, создайте хотя бы двух персонажей во вкладке <strong>«База Лора»</strong>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      
      {/* Шапка раздела */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between z-10">
        <div>
          <h1 className="text-base font-bold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-emerald-400" /> Интерактивная карта связей & Семейное древо
          </h1>
          <p className="text-[11px] text-slate-400">
            Перетаскивайте персонажей и настраивайте отношения между ними.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg transition"
        >
          <Plus className="w-4 h-4" /> Добавить связь
        </button>
      </div>

      {/* Основная интерактивная область (Холст) */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="flex-1 relative overflow-hidden bg-[#0a0f1d] cursor-crosshair"
        style={{
          backgroundImage: `radial-gradient(#1e293b 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      >
        {/* SVG Соединительные линии связей */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {relationships.map(rel => {
            const posA = positions[rel.sourceId] || { x: 100, y: 100 };
            const posB = positions[rel.targetId] || { x: 300, y: 100 };

            // Центры карточек (карточка примерно 200px в ширину и 80px в высоту)
            const x1 = posA.x + 100;
            const y1 = posA.y + 40;
            const x2 = posB.x + 100;
            const y2 = posB.y + 40;

            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            const config = RELATION_TYPES.find(r => r.id === rel.type) || RELATION_TYPES[0];

            return (
              <g key={rel.id}>
                {/* Линия связи */}
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={config.color}
                  strokeWidth="2.5"
                  strokeDasharray={rel.type === 'tense' ? '6 4' : '0'}
                  opacity="0.75"
                />

                {/* Метка на середине линии */}
                <foreignObject
                  x={midX - 60}
                  y={midY - 14}
                  width="120"
                  height="28"
                  className="overflow-visible pointer-events-auto"
                >
                  <div className="flex items-center justify-center">
                    <div
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md flex items-center gap-1 shadow-md ${config.bg} ${config.border} ${config.text}`}
                    >
                      <span className="truncate max-w-[80px]">{rel.label}</span>
                      <button
                        onClick={() => handleDeleteRelationship(rel.id)}
                        className="hover:text-rose-400 p-0.5 rounded transition"
                        title="Удалить связь"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>

        {/* Узлы Персонажей */}
        {characters.map(char => {
          const pos = positions[char.id] || { x: 100, y: 100 };

          return (
            <div
              key={char.id}
              onMouseDown={(e) => handleMouseDown(e, char.id)}
              style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
              className="absolute w-52 bg-slate-900/90 border border-slate-700 hover:border-emerald-500 rounded-2xl p-3 shadow-xl backdrop-blur-md cursor-grab active:cursor-grabbing z-10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                  {char.avatar ? (
                    <img src={char.avatar} alt={char.name} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-5 h-5 text-slate-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white truncate">{char.name}</h4>
                  <p className="text-[10px] text-emerald-400 truncate">{char.role || 'Персонаж'}</p>
                </div>
                <Move className="w-3.5 h-3.5 text-slate-600 opacity-0 group-hover:opacity-100 transition" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Модальное окно создания связи */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md space-y-4 text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" /> Соединить персонажей
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRelationship} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Первый персонаж</label>
                <select
                  value={sourceCharId}
                  onChange={(e) => setSourceCharId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500"
                  required
                >
                  <option value="">Выберите персонажа...</option>
                  {characters.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Второй персонаж</label>
                <select
                  value={targetCharId}
                  onChange={(e) => setTargetCharId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500"
                  required
                >
                  <option value="">Выберите персонажа...</option>
                  {characters.filter(c => c.id !== sourceCharId).map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Тип отношений</label>
                <div className="grid grid-cols-2 gap-2">
                  {RELATION_TYPES.map(type => (
                    <button
                      type="button"
                      key={type.id}
                      onClick={() => setRelationType(type.id)}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 transition ${
                        relationType === type.id
                          ? `${type.bg} ${type.border}${type.text} font-bold`
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: type.color }} />
                      <span className="truncate">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Подпись / Уточнение (необязательно)</label>
                <input
                  type="text"
                  placeholder="Например: Двоюродные братья, Втайне влюблен..."
                  value={relationLabel}
                  onChange={(e) => setRelationLabel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-800 rounded-xl text-slate-400 hover:text-white"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition"
                >
                  Создать связь
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
