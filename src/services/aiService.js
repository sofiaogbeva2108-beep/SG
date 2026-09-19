// src/services/aiService.js

// Прямой вызов Google Gemini API без бэкенд-посредников
async function callGeminiApi(prompt) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Переменная VITE_GEMINI_API_KEY не найдена!");
  }

  const cleanKey = apiKey.trim();

  // Формируем URL напрямую к v1beta версии Gemini 1.5 Flash
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${cleanKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Детали ошибки Google API:", errorData);
    
    // Попытка #2 (если Google требует ключ в заголовке x-goog-api-key)
    const altUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    const altResponse = await fetch(altUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': cleanKey
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const altData = await altResponse.json().catch(() => ({}));

    if (altResponse.ok) {
      return altData.candidates?.[0]?.content?.parts?.[0]?.text || 'Пустой ответ.';
    }

    throw new Error(errorData.error?.message || altData.error?.message || `Ошибка сервера: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Пустой ответ от модели.';
}

export const runAiBetaReader = async (currentScene, currentCycle) => {
  if (!currentScene?.content) return 'Текст сцены пуст. Напишите пару абзацев в редакторе!';
  
  const prompt = `Ты — литературный бета-ридер. Проанализируй отрывок для книги "${currentCycle?.title || ''}":
"${currentScene.content}"

Дай краткий разбор:
🟢 Сильные стороны:
🟡 Ритм и темп:
🔴 Что стоит доработать:`;

  return await callGeminiApi(prompt);
};

export const runCharacterSim = async (simChar1, simChar2, simConflict, currentCycle) => {
  const prompt = `Смоделируй короткий диалог двух персонажей: ${simChar1} и ${simChar2}.
Причина взаимодействия: ${simConflict}.
Произведение: ${currentCycle?.title || ''}.
Напиши реплики и эмоции.`;

  return await callGeminiApi(prompt);
};

export const runBrainstorm = async (genCategory, currentCycle) => {
  let prompt = `Сгенерируй 5 креативных идей для произведения "${currentCycle?.title || ''}". `;
  if (genCategory === 'names') prompt += 'Предложи 10 интересных имён персонажей и названий родов.';
  if (genCategory === 'twists') prompt += 'Предложи 5 неожиданных сюжетных поворотов.';
  if (genCategory === 'locations') prompt += 'Предложи 5 атмосферных локаций.';

  return await callGeminiApi(prompt);
};
