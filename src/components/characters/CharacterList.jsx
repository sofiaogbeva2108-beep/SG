import React, { useState } from 'react';
import { Plus, User, Search, Edit3, Trash2, Heart, Shield } from 'lucide-react';
import CharacterCard from './CharacterCard';

export default function CharacterList() {
  const [characters, setCharacters] = useState([
    {
      id: 1,
      name: 'Элара',
      alias: 'Дитя Тумана',
      role: 'Главный герой',
      status: 'Жив',
      age: '21 год',
      height: '168 см',
      weight: '54 кг',
      appearance: 'Темные волосы, внимательные серые глаза, тонкий шрам на левом запястье.',
      personality: 'Сдержанная, наблюдательная, преданная друзьям.',
      avatar: null,
    },
  ]);

  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSaveCharacter = (updatedData) => {
    if (updatedData.id) {
      setCharacters(characters.map((c) => (c.id === updatedData.id ? updatedData : c)));
    } else {
      setCharacters([...characters, { ...updatedData, id: Date.now() }]);
    }
    setIsModalOpen(false);
    setSelectedCharacter(null);
  };

  const handleDelete = (id) => {
    if (confirm('Удалить этого персонажа?')) {
      setCharacters(characters.filter((c) => c.id !== id));
    }
  };

  const filteredCharacters = characters.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Шапка раздела */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <User className="w-7 h-7 text-emerald-400" /> База Персонажей
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Создавайте досье героев, прорабатывайте внешность и характер.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCharacter(null);
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-900/30 self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" /> Создать персонажа
        </button>
      </div>

      {/* Поиск */}
      <div className="relative max-w-md">
        <Search className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Поиск по имени или роли..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Сетка карточек */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCharacters.map((char) => (
          <div
            key={char.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-emerald-800/60 rounded-2xl p-5 flex flex-col justify-between transition group shadow-lg"
          >
            <div>
              <div className="flex items-start gap-4 mb-4">
                {/* Аватар */}
                <div className="w-20 h-24 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {char.avatar ? (
                    <img src={char.avatar} alt={char.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-slate-600" />
                  )}
                </div>

                {/* Информация */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40 inline-block mb-1">
                    {char.role}
                  </span>
                  <h3 className="text-lg font-bold text-white truncate">{char.name}</h3>
                  {char.alias && <p className="text-xs text-slate-400 truncate">{char.alias}</p>}
                  
                  <div className="mt-2 text-xs text-slate-500 space-y-0.5">
                    {char.age && <p>Возраст: <span className="text-slate-300">{char.age}</span></p>}
                    {char.height && <p>Рост: <span className="text-slate-300">{char.height}</span></p>}
                  </div>
                </div>
              </div>

              {/* Краткое описание внешности */}
              {char.appearance && (
                <p className="text-xs text-slate-400 line-clamp-2 mb-4 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60">
                  {char.appearance}
                </p>
              )}
            </div>

            {/* Действия */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80">
              <button
                onClick={() => {
                  setSelectedCharacter(char);
                  setIsModalOpen(true);
                }}
                className="p-2 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition flex items-center gap-1 text-xs"
              >
                <Edit3 className="w-4 h-4" /> Открыть досье
              </button>
              <button
                onClick={() => handleDelete(char.id)}
                className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Модалка */}
      {isModalOpen && (
        <CharacterCard
          character={selectedCharacter}
          onSave={handleSaveCharacter}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
