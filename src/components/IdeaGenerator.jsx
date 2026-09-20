import React, { useState } from 'react';

export default function IdeaGenerator() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResult('');

    try {
      // TODO: Здесь будет вызов вашего AI-сервиса (например, из src/services/aiService.js)
      // Временно имитируем ответ
      setTimeout(() => {
        setResult(`Сгенерированная идея для "${prompt}": Отличный сюжетный поворот с проклятым артефактом!`);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Ошибка генерации:', error);
      setResult('Не удалось сгенерировать идею. Попробуйте еще раз.');
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow-sm bg-white max-w-md my-4">
      <h3 className="text-lg font-semibold mb-2">Генератор идей (AI)</h3>
      <form onSubmit={handleGenerate} className="space-y-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Опишите, о чем нужна идея (например: персонаж, поворот сюжета)..."
          className="w-full p-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={3}
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Генерирую...' : 'Сгенерировать идею'}
        </button>
      </form>

      {result && (
        <div className="mt-4 p-3 bg-gray-50 border rounded-md text-sm text-gray-800">
          {result}
        </div>
      )}
    </div>
  );
}
