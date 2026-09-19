// src/services/aiService.js
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("❌ VITE_GEMINI_API_KEY не найден!");
}

async function callGeminiApi(prompt) {
  // Определяем тип ключа (OAuth token или API Key)
  const isOAuthToken = API_KEY && API_KEY.startsWith('AQ.');
  
  const url = isOAuthToken 
    ? 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
    : `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  const headers = {
    'Content-Type': 'application/json',
  };

  if (isOAuthToken) {
    headers['Authorization'] = `Bearer ${API_KEY}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
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
    console.error("Детали ошибки API:", errorData);
    throw new Error(errorData.error?.message || `Ошибка API (Статус: ${response.status})`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

export const runAiBetaReader = async (currentScene, currentCycle) => {
  if (!currentScene?.content) return 'Текст сцены пуст.';
  
  const prompt = `Проведи детальный анализ литературного отрывка как бета-ридер и стилист.
        
Контекст мира: ${currentCycle?.description || ''}
Персонажи: ${currentCycle?.lore?.characters?.map(c => c.name + ': ' + c.bio).join('; ') || 'Нет'}

Текст сцены:
"${currentScene.content}"

Структура ответа:
🟢 **Сильные стороны:**
🟡 **Ритм и темп сцены:**
🔴 **Замечания к стилю, повторам и ООС (выходу из характера):**`;

  return await callGeminiApi(prompt);
};

export const runCharacterSim = async (simChar1, simChar2, simConflict, currentCycle) => {
  const prompt = `Смоделируй диалог-столкновение двух персонажей фэнтези.
Персонаж 1: ${simChar1}
Персонаж 2: ${simChar2}
Причина конфликта: ${simConflict}
Мир: ${currentCycle?.description || ''}

Напиши напряженный диалог с описанием эмоций и жестов, а в конце дай вердикт ИИ о химии персонажей.`;

  return await callGeminiApi(prompt);
};

export const runBrainstorm = async (genCategory, currentCycle) => {
  let prompt = `Сгенерируй 5 креативных идей для фэнтези мира "${currentCycle?.title || ''}". Описание мира: ${currentCycle?.description || ''}. `;
  
  if (genCategory === 'names') prompt += 'Предложи 10 атмосферных имён персонажей и названий древних родов с краткой характеристикой.';
  if (genCategory === 'twists') prompt += 'Предложи 5 неожиданных сюжетных поворотов (Plot Twists) для текущей сюжетной арки.';
  if (genCategory === 'locations') prompt += 'Предложи 5 уникальных волшебных или мрачных локаций с их секретами.';

  return await callGeminiApi(prompt);
};
