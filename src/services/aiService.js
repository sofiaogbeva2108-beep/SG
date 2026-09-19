// src/services/aiService.js
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

async function callGeminiApi(prompt) {
  if (!API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY не установлен в Vercel!");
  }

  // Используем актуальный v1beta REST API Google Gemini
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`;

  const headers = {
    'Content-Type': 'application/json',
  };

  // Если ключ начинается на AQ (новый токен), передаем через Bearer, иначе как API Key
  if (API_KEY.startsWith('AQ')) {
    headers['Authorization'] = `Bearer ${API_KEY}`;
  } else {
    headers['x-goog-api-key'] = API_KEY;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Ошибка ИИ:", errorData);
    throw new Error(errorData.error?.message || `Ошибка сервера: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

export const runAiBetaReader = async (currentScene, currentCycle) => {
  if (!currentScene?.content) return 'Текст сцены пуст. Напишите пару абзацев!';
  
  const prompt = `Ты — профессиональный литературный бета-ридер. Проанализируй текст сцены для книги "${currentCycle?.title || ''}".
Текст:
"${currentScene.content}"

Дай конструктивный отзыв:
🟢 Что получилось отлично:
🟡 Ритм и атмосфера:
🔴 Что стоит улучшить:`;

  return await callGeminiApi(prompt);
};

export const runCharacterSim = async (simChar1, simChar2, simConflict, currentCycle) => {
  const prompt = `Смоделируй сцену-диалог между двумя персонажами: ${simChar1} и ${simChar2}.
Причина конфликта/взаимодействия: ${simConflict}.
Контекст произведения: ${currentCycle?.title || ''}.
Напиши живой диалог с эмоциями и ремарками.`;

  return await callGeminiApi(prompt);
};

export const runBrainstorm = async (genCategory, currentCycle) => {
  const prompt = `Ты — соавтор книги "${currentCycle?.title || ''}". Предложи 5 креативных идей для категории "${genCategory}".`;
  return await callGeminiApi(prompt);
};
